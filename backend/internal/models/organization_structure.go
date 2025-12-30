package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrganizationStructure struct {
	ID           uuid.UUID     `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Name         string        `gorm:"type:varchar(255);not null" json:"name"`
	Position     string        `gorm:"type:varchar(255);not null" json:"position"`
	Department   *string       `gorm:"type:varchar(255)" json:"department,omitempty"`
	PhotoURL     *string       `gorm:"type:varchar(500)" json:"photo_url,omitempty"`
	Bio          string        `gorm:"type:text" json:"bio"`
	Email        *string       `gorm:"type:varchar(255)" json:"email,omitempty"`
	Phone        *string       `gorm:"type:varchar(20)" json:"phone,omitempty"`
	DisplayOrder int           `gorm:"default:0;not null;index" json:"display_order"`
	IsActive     bool          `gorm:"default:true;not null" json:"is_active"`
	CreatedAt    time.Time     `json:"created_at"`
	UpdatedAt    time.Time     `json:"updated_at"`
}

func (o *OrganizationStructure) BeforeCreate(tx *gorm.DB) error {
	if o.ID == uuid.Nil {
		o.ID = uuid.New()
	}
	return nil
}

