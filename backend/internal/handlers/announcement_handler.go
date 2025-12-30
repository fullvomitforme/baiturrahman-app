package handlers

import (
	"net/http"
	"time"
	"masjid-baiturrahim-backend/internal/models"
	"masjid-baiturrahim-backend/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (h *Handler) GetAnnouncements(c *gin.Context) {
	page, limit := utils.GetPaginationParams(c)
	offset := utils.GetOffset(page, limit)

	var announcements []models.Announcement
	var total int64

	query := h.DB.Model(&models.Announcement{})

	// Filter active only for public
	if c.Query("active") == "true" {
		now := time.Now()
		query = query.Where("is_pinned = ? OR (published_at <= ? AND (expires_at IS NULL OR expires_at >= ?))", true, now, now)
	}

	if category := c.Query("category"); category != "" {
		query = query.Where("category = ?", category)
	}
	if priority := c.Query("priority"); priority != "" {
		query = query.Where("priority = ?", priority)
	}

	query.Count(&total)
	query.Preload("Creator").
		Order("is_pinned DESC, published_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&announcements)

	utils.PaginatedSuccessResponse(c, announcements, page, limit, total)
}

func (h *Handler) CreateAnnouncement(c *gin.Context) {
	var announcement models.Announcement
	if err := c.ShouldBindJSON(&announcement); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	userID, _ := c.Get("userID")
	announcement.CreatedBy = userID.(uuid.UUID)

	if err := h.DB.Create(&announcement).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create announcement")
		return
	}

	h.DB.Preload("Creator").First(&announcement, announcement.ID)
	utils.SuccessResponse(c, http.StatusCreated, announcement, "Announcement created successfully")
}

func (h *Handler) UpdateAnnouncement(c *gin.Context) {
	id := c.Param("id")
	var announcement models.Announcement

	if err := h.DB.First(&announcement, "id = ?", id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Announcement not found")
		return
	}

	if err := c.ShouldBindJSON(&announcement); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.DB.Save(&announcement).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update announcement")
		return
	}

	h.DB.Preload("Creator").First(&announcement, announcement.ID)
	utils.SuccessResponse(c, http.StatusOK, announcement, "Announcement updated successfully")
}

func (h *Handler) DeleteAnnouncement(c *gin.Context) {
	id := c.Param("id")
	if err := h.DB.Delete(&models.Announcement{}, "id = ?", id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete announcement")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, nil, "Announcement deleted successfully")
}

