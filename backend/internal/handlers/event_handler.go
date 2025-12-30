package handlers

import (
	"net/http"
	"masjid-baiturrahim-backend/internal/models"
	"masjid-baiturrahim-backend/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (h *Handler) GetEvents(c *gin.Context) {
	page, limit := utils.GetPaginationParams(c)
	offset := utils.GetOffset(page, limit)

	var events []models.Event
	var total int64

	query := h.DB.Model(&models.Event{})

	// Filters
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}
	if category := c.Query("category"); category != "" {
		query = query.Where("category = ?", category)
	}

	query.Count(&total)
	query.Preload("Creator").
		Order("event_date ASC, event_time ASC").
		Offset(offset).
		Limit(limit).
		Find(&events)

	utils.PaginatedSuccessResponse(c, events, page, limit, total)
}

func (h *Handler) GetEventBySlug(c *gin.Context) {
	slug := c.Param("slug")
	var event models.Event

	if err := h.DB.Preload("Creator").Where("slug = ?", slug).First(&event).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Event not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, event, "")
}

func (h *Handler) CreateEvent(c *gin.Context) {
	var event models.Event
	if err := c.ShouldBindJSON(&event); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	userID, _ := c.Get("userID")
	event.CreatedBy = userID.(uuid.UUID)

	if err := h.DB.Create(&event).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create event")
		return
	}

	h.DB.Preload("Creator").First(&event, event.ID)
	utils.SuccessResponse(c, http.StatusCreated, event, "Event created successfully")
}

func (h *Handler) UpdateEvent(c *gin.Context) {
	id := c.Param("id")
	var event models.Event

	if err := h.DB.First(&event, "id = ?", id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Event not found")
		return
	}

	if err := c.ShouldBindJSON(&event); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.DB.Save(&event).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update event")
		return
	}

	h.DB.Preload("Creator").First(&event, event.ID)
	utils.SuccessResponse(c, http.StatusOK, event, "Event updated successfully")
}

func (h *Handler) DeleteEvent(c *gin.Context) {
	id := c.Param("id")
	if err := h.DB.Delete(&models.Event{}, "id = ?", id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete event")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, nil, "Event deleted successfully")
}

