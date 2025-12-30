package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SettingDataType string

const (
	SettingTypeString SettingDataType = "string"
	SettingTypeJSON   SettingDataType = "json"
	SettingTypeInt    SettingDataType = "int"
	SettingTypeBool   SettingDataType = "bool"
)

type Setting struct {
	ID          uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Key         string         `gorm:"type:varchar(100);uniqueIndex;not null" json:"key"`
	Value       string         `gorm:"type:text;not null" json:"value"`
	Description *string         `gorm:"type:varchar(500)" json:"description,omitempty"`
	DataType    SettingDataType `gorm:"type:varchar(20);default:'string';not null" json:"data_type"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
}

func (s *Setting) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}

