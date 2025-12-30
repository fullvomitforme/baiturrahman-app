package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DonationCategory string

const (
	DonationCategoryInfaq      DonationCategory = "infaq"
	DonationCategorySedekah    DonationCategory = "sedekah"
	DonationCategoryZakat      DonationCategory = "zakat"
	DonationCategoryWakaf      DonationCategory = "wakaf"
	DonationCategoryOperasional DonationCategory = "operasional"
)

type DonationStatus string

const (
	DonationStatusPending   DonationStatus = "pending"
	DonationStatusConfirmed DonationStatus = "confirmed"
	DonationStatusCancelled DonationStatus = "cancelled"
)

type Donation struct {
	ID              uuid.UUID        `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	DonationCode    string           `gorm:"type:varchar(50);uniqueIndex;not null" json:"donation_code"`
	DonorName       string           `gorm:"type:varchar(255);not null" json:"donor_name"`
	DonorEmail      *string          `gorm:"type:varchar(255);index" json:"donor_email,omitempty"`
	DonorPhone      *string          `gorm:"type:varchar(20)" json:"donor_phone,omitempty"`
	Amount          float64          `gorm:"type:decimal(15,2);not null" json:"amount"`
	PaymentMethodID *uuid.UUID       `gorm:"type:uuid;index" json:"payment_method_id,omitempty"`
	Category        DonationCategory `gorm:"type:varchar(50);not null;index" json:"category"`
	Notes           string           `gorm:"type:text" json:"notes"`
	Status          DonationStatus    `gorm:"type:varchar(50);default:'pending';not null;index" json:"status"`
	ProofURL        *string          `gorm:"type:varchar(500)" json:"proof_url,omitempty"`
	ConfirmedBy    *uuid.UUID        `gorm:"type:uuid;index" json:"confirmed_by,omitempty"`
	ConfirmedAt    *time.Time       `json:"confirmed_at,omitempty"`
	CreatedAt       time.Time        `json:"created_at"`
	UpdatedAt       time.Time        `json:"updated_at"`

	PaymentMethod  PaymentMethod    `gorm:"foreignKey:PaymentMethodID" json:"payment_method,omitempty"`
	Confirmer      User             `gorm:"foreignKey:ConfirmedBy" json:"confirmer,omitempty"`
}

func (d *Donation) BeforeCreate(tx *gorm.DB) error {
	if d.ID == uuid.Nil {
		d.ID = uuid.New()
	}
	return nil
}
