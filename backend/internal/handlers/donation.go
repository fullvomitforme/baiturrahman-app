package handlers

import (
	"net/http"
	"masjid-baiturrahim-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetDonations(c *gin.Context) {
	var donations []models.Donation
	h.DB.Order("created_at DESC").Find(&donations)
	c.JSON(http.StatusOK, donations)
}

func (h *Handler) CreateDonation(c *gin.Context) {
	var donation models.Donation
	if err := c.ShouldBindJSON(&donation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.DB.Create(&donation)
	c.JSON(http.StatusCreated, donation)
}

func (h *Handler) UpdateDonation(c *gin.Context) {
	id := c.Param("id")
	var donation models.Donation

	if err := h.DB.First(&donation, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Donation not found"})
		return
	}

	if err := c.ShouldBindJSON(&donation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.DB.Save(&donation)
	c.JSON(http.StatusOK, donation)
}

func (h *Handler) DeleteDonation(c *gin.Context) {
	id := c.Param("id")
	h.DB.Delete(&models.Donation{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Donation deleted"})
}

