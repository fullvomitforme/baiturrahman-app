package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PrayerTimes struct {
	ID        uuid.UUID    `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Date      time.Time    `gorm:"type:date;uniqueIndex:idx_prayer_date_location;not null" json:"date"`
	Location  string       `gorm:"type:varchar(255);uniqueIndex:idx_prayer_date_location;default:'default';not null" json:"location"`
	Fajr      *time.Time   `gorm:"type:time" json:"fajr,omitempty"`
	Sunrise   *time.Time   `gorm:"type:time" json:"sunrise,omitempty"`
	Dhuhr     *time.Time   `gorm:"type:time" json:"dhuhr,omitempty"`
	Asr       *time.Time   `gorm:"type:time" json:"asr,omitempty"`
	Maghrib   *time.Time   `gorm:"type:time" json:"maghrib,omitempty"`
	Isha      *time.Time   `gorm:"type:time" json:"isha,omitempty"`
	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
}

func (p *PrayerTimes) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

