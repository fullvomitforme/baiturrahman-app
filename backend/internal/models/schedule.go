package models

import (
	"time"

	"gorm.io/gorm"
)

type Schedule struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"not null" json:"title"`
	Type        string         `gorm:"not null" json:"type"` // prayer, activity, event
	Date        time.Time      `gorm:"not null" json:"date"`
	Time        string         `json:"time"`
	Description string         `gorm:"type:text" json:"description"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

