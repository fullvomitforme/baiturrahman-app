package handlers

import (
	"net/http"
	"masjid-baiturrahim-backend/internal/models"
	"masjid-baiturrahim-backend/internal/utils"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetSettings(c *gin.Context) {
	var settings []models.Setting
	h.DB.Order("key ASC").Find(&settings)

	// Convert to map for easier access
	settingsMap := make(map[string]interface{})
	for _, setting := range settings {
		settingsMap[setting.Key] = setting.Value
	}

	utils.SuccessResponse(c, http.StatusOK, settingsMap, "")
}

func (h *Handler) UpdateSetting(c *gin.Context) {
	key := c.Param("key")
	var setting models.Setting

	if err := h.DB.Where("key = ?", key).First(&setting).Error; err != nil {
		// Create if doesn't exist
		setting = models.Setting{
			Key: key,
		}
	}

	var req struct {
		Value       string `json:"value" binding:"required"`
		Description string `json:"description"`
		DataType    string `json:"data_type"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	setting.Value = req.Value
	if req.Description != "" {
		setting.Description = &req.Description
	}
	if req.DataType != "" {
		setting.DataType = models.SettingDataType(req.DataType)
	}

	if err := h.DB.Save(&setting).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update setting")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, setting, "Setting updated successfully")
}

