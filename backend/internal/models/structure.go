package models

import (
	"time"

	"gorm.io/gorm"
)

type Structure struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"not null" json:"name"`
	Position  string         `gorm:"not null" json:"position"`
	Email     string         `json:"email"`
	Phone     string         `json:"phone"`
	Photo     string         `json:"photo"`
	Order     int            `gorm:"default:0" json:"order"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

