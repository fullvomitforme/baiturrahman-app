package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PaymentMethodType string

const (
	PaymentTypeBankTransfer PaymentMethodType = "bank_transfer"
	PaymentTypeEWallet      PaymentMethodType = "ewallet"
	PaymentTypeQRIS         PaymentMethodType = "qris"
)

type PaymentMethod struct {
	ID           uuid.UUID         `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Name         string            `gorm:"type:varchar(255);not null" json:"name"`
	Type         PaymentMethodType `gorm:"type:varchar(50);not null" json:"type"`
	AccountNumber *string          `gorm:"type:varchar(100)" json:"account_number,omitempty"`
	AccountName   *string          `gorm:"type:varchar(255)" json:"account_name,omitempty"`
	QRCodeURL     *string          `gorm:"type:varchar(500)" json:"qr_code_url,omitempty"`
	Instructions  string           `gorm:"type:text" json:"instructions"`
	IsActive      bool             `gorm:"default:true;not null" json:"is_active"`
	DisplayOrder  int              `gorm:"default:0;not null;index" json:"display_order"`
	CreatedAt     time.Time        `json:"created_at"`
	UpdatedAt     time.Time        `json:"updated_at"`
}

func (p *PaymentMethod) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

