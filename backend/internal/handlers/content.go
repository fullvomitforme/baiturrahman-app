package handlers

import (
	"net/http"
	"masjid-baiturrahim-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetContents(c *gin.Context) {
	var contents []models.Content
	h.DB.Find(&contents)
	c.JSON(http.StatusOK, contents)
}

func (h *Handler) CreateContent(c *gin.Context) {
	var content models.Content
	if err := c.ShouldBindJSON(&content); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.DB.Create(&content)
	c.JSON(http.StatusCreated, content)
}

func (h *Handler) UpdateContent(c *gin.Context) {
	id := c.Param("id")
	var content models.Content

	if err := h.DB.First(&content, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Content not found"})
		return
	}

	if err := c.ShouldBindJSON(&content); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.DB.Save(&content)
	c.JSON(http.StatusOK, content)
}

func (h *Handler) DeleteContent(c *gin.Context) {
	id := c.Param("id")
	h.DB.Delete(&models.Content{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Content deleted"})
}

