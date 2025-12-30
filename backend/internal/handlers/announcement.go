package handlers

import (
	"net/http"
	"masjid-baiturrahim-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetAnnouncements(c *gin.Context) {
	var announcements []models.Announcement
	h.DB.Where("status = ?", "active").Order("created_at DESC").Find(&announcements)
	c.JSON(http.StatusOK, announcements)
}

func (h *Handler) CreateAnnouncement(c *gin.Context) {
	var announcement models.Announcement
	if err := c.ShouldBindJSON(&announcement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.DB.Create(&announcement)
	c.JSON(http.StatusCreated, announcement)
}

func (h *Handler) UpdateAnnouncement(c *gin.Context) {
	id := c.Param("id")
	var announcement models.Announcement

	if err := h.DB.First(&announcement, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Announcement not found"})
		return
	}

	if err := c.ShouldBindJSON(&announcement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.DB.Save(&announcement)
	c.JSON(http.StatusOK, announcement)
}

func (h *Handler) DeleteAnnouncement(c *gin.Context) {
	id := c.Param("id")
	h.DB.Delete(&models.Announcement{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Announcement deleted"})
}

