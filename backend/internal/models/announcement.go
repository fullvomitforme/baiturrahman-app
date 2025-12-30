package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AnnouncementPriority string

const (
	PriorityLow    AnnouncementPriority = "low"
	PriorityNormal AnnouncementPriority = "normal"
	PriorityHigh   AnnouncementPriority = "high"
	PriorityUrgent AnnouncementPriority = "urgent"
)

type AnnouncementCategory string

const (
	AnnouncementCategoryInfo     AnnouncementCategory = "info"
	AnnouncementCategoryWarning  AnnouncementCategory = "warning"
	AnnouncementCategoryEvent    AnnouncementCategory = "event"
	AnnouncementCategoryDonation  AnnouncementCategory = "donation"
)

type Announcement struct {
	ID          uuid.UUID            `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Title       string               `gorm:"type:varchar(255);not null" json:"title"`
	Content     string               `gorm:"type:text;not null" json:"content"`
	Priority    AnnouncementPriority `gorm:"type:varchar(20);default:'normal';not null;index" json:"priority"`
	Category    AnnouncementCategory `gorm:"type:varchar(50);not null;index" json:"category"`
	PublishedAt *time.Time           `gorm:"index" json:"published_at,omitempty"`
	ExpiresAt   *time.Time           `gorm:"index" json:"expires_at,omitempty"`
	IsPinned    bool                 `gorm:"default:false;not null;index" json:"is_pinned"`
	ImageURL    *string              `gorm:"type:varchar(500)" json:"image_url,omitempty"`
	CreatedBy   uuid.UUID            `gorm:"type:uuid;not null;index" json:"created_by"`
	CreatedAt   time.Time            `json:"created_at"`
	UpdatedAt   time.Time            `json:"updated_at"`
	DeletedAt   gorm.DeletedAt       `gorm:"index" json:"-"`

	Creator     User                 `gorm:"foreignKey:CreatedBy" json:"creator,omitempty"`
}

func (a *Announcement) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	if a.PublishedAt == nil {
		now := time.Now()
		a.PublishedAt = &now
	}
	return nil
}
