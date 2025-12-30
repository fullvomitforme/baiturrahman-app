package services

import (
	"fmt"
	"time"
	"masjid-baiturrahim-backend/internal/models"

	"gorm.io/gorm"
)

func GeneratePrayerTimesForMonth(db *gorm.DB, year, month int, location string) ([]models.PrayerTimes, error) {
	// This is a placeholder - in production, use a prayer time calculation library
	// like github.com/msarvar/prayertime or integrate with an API
	
	startDate := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
	var prayerTimes []models.PrayerTimes

	for d := startDate; d.Month() == time.Month(month); d = d.AddDate(0, 0, 1) {
		// Placeholder times - replace with actual calculation
		fajr := time.Date(d.Year(), d.Month(), d.Day(), 4, 30, 0, 0, time.UTC)
		sunrise := time.Date(d.Year(), d.Month(), d.Day(), 5, 45, 0, 0, time.UTC)
		dhuhr := time.Date(d.Year(), d.Month(), d.Day(), 12, 15, 0, 0, time.UTC)
		asr := time.Date(d.Year(), d.Month(), d.Day(), 15, 30, 0, 0, time.UTC)
		maghrib := time.Date(d.Year(), d.Month(), d.Day(), 18, 20, 0, 0, time.UTC)
		isha := time.Date(d.Year(), d.Month(), d.Day(), 19, 35, 0, 0, time.UTC)

		pt := models.PrayerTimes{
			Date:     d,
			Location: location,
			Fajr:     &fajr,
			Sunrise:  &sunrise,
			Dhuhr:    &dhuhr,
			Asr:      &asr,
			Maghrib:  &maghrib,
			Isha:     &isha,
		}

		// Check if already exists
		var existing models.PrayerTimes
		if err := db.Where("date = ? AND location = ?", d.Format("2006-01-02"), location).First(&existing).Error; err != nil {
			// Create if doesn't exist
			if err := db.Create(&pt).Error; err != nil {
				return nil, fmt.Errorf("failed to create prayer times for %s: %w", d.Format("2006-01-02"), err)
			}
		} else {
			// Update existing
			existing.Fajr = pt.Fajr
			existing.Sunrise = pt.Sunrise
			existing.Dhuhr = pt.Dhuhr
			existing.Asr = pt.Asr
			existing.Maghrib = pt.Maghrib
			existing.Isha = pt.Isha
			db.Save(&existing)
		}

		prayerTimes = append(prayerTimes, pt)
	}

	return prayerTimes, nil
}

