package handlers

import (
	"net/http"
	"masjid-baiturrahim-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetSchedules(c *gin.Context) {
	var schedules []models.Schedule
	h.DB.Order("date ASC, time ASC").Find(&schedules)
	c.JSON(http.StatusOK, schedules)
}

func (h *Handler) CreateSchedule(c *gin.Context) {
	var schedule models.Schedule
	if err := c.ShouldBindJSON(&schedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.DB.Create(&schedule)
	c.JSON(http.StatusCreated, schedule)
}

func (h *Handler) UpdateSchedule(c *gin.Context) {
	id := c.Param("id")
	var schedule models.Schedule

	if err := h.DB.First(&schedule, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Schedule not found"})
		return
	}

	if err := c.ShouldBindJSON(&schedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.DB.Save(&schedule)
	c.JSON(http.StatusOK, schedule)
}

func (h *Handler) DeleteSchedule(c *gin.Context) {
	id := c.Param("id")
	h.DB.Delete(&models.Schedule{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Schedule deleted"})
}

