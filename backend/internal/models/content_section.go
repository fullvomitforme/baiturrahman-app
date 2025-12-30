package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ContentSectionKey string

const (
	SectionKeyHero      ContentSectionKey = "hero"
	SectionKeyAbout     ContentSectionKey = "about"
	SectionKeyVision    ContentSectionKey = "vision"
	SectionKeyFacilities ContentSectionKey = "facilities"
)

type Metadata map[string]interface{}

func (m Metadata) Value() (driver.Value, error) {
	return json.Marshal(m)
}

func (m *Metadata) Scan(value interface{}) error {
	if value == nil {
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return nil
	}
	return json.Unmarshal(bytes, m)
}

type ContentSection struct {
	ID           uuid.UUID     `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	SectionKey   string        `gorm:"type:varchar(50);uniqueIndex;not null" json:"section_key"`
	Title        *string       `gorm:"type:varchar(255)" json:"title,omitempty"`
	Subtitle     *string       `gorm:"type:varchar(255)" json:"subtitle,omitempty"`
	Body         string        `gorm:"type:text" json:"body"`
	ImageURL     *string        `gorm:"type:varchar(500)" json:"image_url,omitempty"`
	VideoURL     *string        `gorm:"type:varchar(500)" json:"video_url,omitempty"`
	DisplayOrder int            `gorm:"default:0;not null;index" json:"display_order"`
	IsActive     bool           `gorm:"default:true;not null" json:"is_active"`
	Metadata     Metadata       `gorm:"type:jsonb" json:"metadata,omitempty"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
}

func (c *ContentSection) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}

