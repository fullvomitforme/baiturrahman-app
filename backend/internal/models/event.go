package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type EventCategory string

const (
	EventCategoryKajian     EventCategory = "kajian"
	EventCategorySosial      EventCategory = "sosial"
	EventCategoryPendidikan  EventCategory = "pendidikan"
	EventCategoryOther       EventCategory = "other"
)

type EventStatus string

const (
	EventStatusUpcoming  EventStatus = "upcoming"
	EventStatusOngoing   EventStatus = "ongoing"
	EventStatusCompleted EventStatus = "completed"
	EventStatusCancelled EventStatus = "cancelled"
)

type Gallery []string

func (g Gallery) Value() (driver.Value, error) {
	return json.Marshal(g)
}

func (g *Gallery) Scan(value interface{}) error {
	if value == nil {
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return nil
	}
	return json.Unmarshal(bytes, g)
}

type Event struct {
	ID                    uuid.UUID     `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Title                 string        `gorm:"type:varchar(255);not null" json:"title"`
	Slug                  string        `gorm:"type:varchar(255);uniqueIndex;not null" json:"slug"`
	Description           string        `gorm:"type:text" json:"description"`
	Content               string        `gorm:"type:text" json:"content"`
	Category              EventCategory `gorm:"type:varchar(50);not null" json:"category"`
	EventDate             time.Time     `gorm:"type:date;not null;index" json:"event_date"`
	EventTime             *time.Time    `gorm:"type:time" json:"event_time,omitempty"`
	Location              *string        `gorm:"type:varchar(255)" json:"location,omitempty"`
	IsOnline              bool           `gorm:"default:false;not null" json:"is_online"`
	MeetingURL             *string        `gorm:"type:varchar(500)" json:"meeting_url,omitempty"`
	ImageURL               *string        `gorm:"type:varchar(500)" json:"image_url,omitempty"`
	Gallery                Gallery        `gorm:"type:jsonb" json:"gallery,omitempty"`
	MaxParticipants        *int           `json:"max_participants,omitempty"`
	RegistrationRequired   bool           `gorm:"default:false;not null" json:"registration_required"`
	Status                 EventStatus     `gorm:"type:varchar(50);default:'upcoming';not null;index" json:"status"`
	CreatedBy              uuid.UUID      `gorm:"type:uuid;not null;index" json:"created_by"`
	CreatedAt              time.Time      `json:"created_at"`
	UpdatedAt              time.Time      `json:"updated_at"`
	DeletedAt              gorm.DeletedAt `gorm:"index" json:"-"`

	Creator                User           `gorm:"foreignKey:CreatedBy" json:"creator,omitempty"`
}

func (e *Event) BeforeCreate(tx *gorm.DB) error {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return nil
}

