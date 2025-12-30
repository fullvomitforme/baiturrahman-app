package services

import (
	"fmt"
	"time"
	"masjid-baiturrahim-backend/internal/models"

	"gorm.io/gorm"
)

func GenerateDonationCode() string {
	// Format: DON-YYYYMMDD-HHMMSS-XXXX
	now := time.Now()
	timestamp := now.Format("20060102-150405")
	random := fmt.Sprintf("%04d", now.Nanosecond()%10000)
	return fmt.Sprintf("DON-%s-%s", timestamp, random)
}

type DonationStats struct {
	TotalAmount     float64                `json:"total_amount"`
	TotalCount      int64                  `json:"total_count"`
	ByCategory      map[string]interface{} `json:"by_category"`
	ByMonth         map[string]interface{} `json:"by_month"`
	PendingCount    int64                  `json:"pending_count"`
	ConfirmedCount  int64                  `json:"confirmed_count"`
	CancelledCount  int64                  `json:"cancelled_count"`
}

func GetDonationStats(db *gorm.DB) (*DonationStats, error) {
	stats := &DonationStats{
		ByCategory: make(map[string]interface{}),
		ByMonth:    make(map[string]interface{}),
	}

	// Total amount and count
	var totalAmount struct {
		Total float64
	}
	db.Model(&models.Donation{}).
		Where("status = ?", models.DonationStatusConfirmed).
		Select("COALESCE(SUM(amount), 0) as total").
		Scan(&totalAmount)
	stats.TotalAmount = totalAmount.Total

	db.Model(&models.Donation{}).Count(&stats.TotalCount)

	// By status
	db.Model(&models.Donation{}).
		Where("status = ?", models.DonationStatusPending).
		Count(&stats.PendingCount)
	db.Model(&models.Donation{}).
		Where("status = ?", models.DonationStatusConfirmed).
		Count(&stats.ConfirmedCount)
	db.Model(&models.Donation{}).
		Where("status = ?", models.DonationStatusCancelled).
		Count(&stats.CancelledCount)

	// By category
	var categoryStats []struct {
		Category string
		Total    float64
		Count    int64
	}
	db.Model(&models.Donation{}).
		Where("status = ?", models.DonationStatusConfirmed).
		Select("category, SUM(amount) as total, COUNT(*) as count").
		Group("category").
		Scan(&categoryStats)

	for _, cs := range categoryStats {
		stats.ByCategory[cs.Category] = map[string]interface{}{
			"total": cs.Total,
			"count": cs.Count,
		}
	}

	// By month (last 12 months)
	var monthStats []struct {
		Month string
		Total float64
		Count int64
	}
	db.Model(&models.Donation{}).
		Where("status = ? AND created_at >= ?", models.DonationStatusConfirmed, time.Now().AddDate(0, -12, 0)).
		Select("TO_CHAR(created_at, 'YYYY-MM') as month, SUM(amount) as total, COUNT(*) as count").
		Group("month").
		Order("month ASC").
		Scan(&monthStats)

	for _, ms := range monthStats {
		stats.ByMonth[ms.Month] = map[string]interface{}{
			"total": ms.Total,
			"count": ms.Count,
		}
	}

	return stats, nil
}

