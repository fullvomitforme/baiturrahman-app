package handlers

import (
	"net/http"
	"masjid-baiturrahim-backend/internal/models"
	"masjid-baiturrahim-backend/internal/utils"

	"github.com/gin-gonic/gin"
)

type ReorderRequest struct {
	Items []struct {
		ID          string `json:"id"`
		DisplayOrder int   `json:"display_order"`
	} `json:"items" binding:"required"`
}

func (h *Handler) GetStructures(c *gin.Context) {
	var structures []models.OrganizationStructure
	query := h.DB.Where("is_active = ?", true)

	if c.Query("active") == "false" {
		query = h.DB
	}

	query.Order("display_order ASC, created_at ASC").Find(&structures)
	utils.SuccessResponse(c, http.StatusOK, structures, "")
}

func (h *Handler) CreateStructure(c *gin.Context) {
	var structure models.OrganizationStructure
	if err := c.ShouldBindJSON(&structure); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.DB.Create(&structure).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create structure")
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, structure, "Structure created successfully")
}

func (h *Handler) UpdateStructure(c *gin.Context) {
	id := c.Param("id")
	var structure models.OrganizationStructure

	if err := h.DB.First(&structure, "id = ?", id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Structure not found")
		return
	}

	if err := c.ShouldBindJSON(&structure); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.DB.Save(&structure).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update structure")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, structure, "Structure updated successfully")
}

func (h *Handler) DeleteStructure(c *gin.Context) {
	id := c.Param("id")
	if err := h.DB.Delete(&models.OrganizationStructure{}, "id = ?", id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete structure")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, nil, "Structure deleted successfully")
}

func (h *Handler) ReorderStructures(c *gin.Context) {
	var req ReorderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	for _, item := range req.Items {
		h.DB.Model(&models.OrganizationStructure{}).
			Where("id = ?", item.ID).
			Update("display_order", item.DisplayOrder)
	}

	utils.SuccessResponse(c, http.StatusOK, nil, "Structures reordered successfully")
}

