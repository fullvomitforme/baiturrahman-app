package handlers

import (
	"net/http"
	"masjid-baiturrahim-backend/internal/models"
	"masjid-baiturrahim-backend/internal/utils"

	"github.com/gin-gonic/gin"
)

type ReorderPaymentRequest struct {
	Items []struct {
		ID          string `json:"id"`
		DisplayOrder int   `json:"display_order"`
	} `json:"items" binding:"required"`
}

func (h *Handler) GetPaymentMethods(c *gin.Context) {
	var methods []models.PaymentMethod
	query := h.DB.Where("is_active = ?", true)

	if c.Query("active") == "false" {
		query = h.DB
	}

	query.Order("display_order ASC").Find(&methods)
	utils.SuccessResponse(c, http.StatusOK, methods, "")
}

func (h *Handler) CreatePaymentMethod(c *gin.Context) {
	var method models.PaymentMethod
	if err := c.ShouldBindJSON(&method); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.DB.Create(&method).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create payment method")
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, method, "Payment method created successfully")
}

func (h *Handler) UpdatePaymentMethod(c *gin.Context) {
	id := c.Param("id")
	var method models.PaymentMethod

	if err := h.DB.First(&method, "id = ?", id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Payment method not found")
		return
	}

	if err := c.ShouldBindJSON(&method); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.DB.Save(&method).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update payment method")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, method, "Payment method updated successfully")
}

func (h *Handler) DeletePaymentMethod(c *gin.Context) {
	id := c.Param("id")
	if err := h.DB.Delete(&models.PaymentMethod{}, "id = ?", id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete payment method")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, nil, "Payment method deleted successfully")
}

func (h *Handler) ReorderPaymentMethods(c *gin.Context) {
	var req ReorderPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	for _, item := range req.Items {
		h.DB.Model(&models.PaymentMethod{}).
			Where("id = ?", item.ID).
			Update("display_order", item.DisplayOrder)
	}

	utils.SuccessResponse(c, http.StatusOK, nil, "Payment methods reordered successfully")
}

