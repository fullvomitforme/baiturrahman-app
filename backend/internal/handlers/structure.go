package handlers

import (
	"net/http"
	"masjid-baiturrahim-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetStructures(c *gin.Context) {
	var structures []models.Structure
	h.DB.Order("`order` ASC").Find(&structures)
	c.JSON(http.StatusOK, structures)
}

func (h *Handler) CreateStructure(c *gin.Context) {
	var structure models.Structure
	if err := c.ShouldBindJSON(&structure); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.DB.Create(&structure)
	c.JSON(http.StatusCreated, structure)
}

func (h *Handler) UpdateStructure(c *gin.Context) {
	id := c.Param("id")
	var structure models.Structure

	if err := h.DB.First(&structure, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Structure not found"})
		return
	}

	if err := c.ShouldBindJSON(&structure); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.DB.Save(&structure)
	c.JSON(http.StatusOK, structure)
}

func (h *Handler) DeleteStructure(c *gin.Context) {
	id := c.Param("id")
	h.DB.Delete(&models.Structure{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Structure deleted"})
}

