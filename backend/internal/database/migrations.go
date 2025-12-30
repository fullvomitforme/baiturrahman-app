package database

import (
	"masjid-baiturrahim-backend/internal/models"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
		&models.MosqueInfo{},
		&models.OrganizationStructure{},
		&models.PrayerTimes{},
		&models.ContentSection{},
		&models.Event{},
		&models.Announcement{},
		&models.Donation{},
		&models.PaymentMethod{},
		&models.Setting{},
	)
}
