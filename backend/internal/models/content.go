package models

import (
	"time"

	"gorm.io/gorm"
)

type Content struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Title     string         `gorm:"not null" json:"title"`
	Slug      string         `gorm:"uniqueIndex" json:"slug"`
	Body      string         `gorm:"type:text" json:"body"`
	Type      string         `gorm:"not null" json:"type"` // page, post, etc
	Status    string         `gorm:"default:draft" json:"status"` // draft, published
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

