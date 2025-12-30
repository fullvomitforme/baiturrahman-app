package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
	Error   string      `json:"error,omitempty"`
}

type PaginatedResponse struct {
	Success   bool        `json:"success"`
	Data      interface{} `json:"data"`
	Page      int         `json:"page"`
	Limit     int         `json:"limit"`
	Total     int64       `json:"total"`
	TotalPages int        `json:"total_pages"`
}

func SuccessResponse(c *gin.Context, statusCode int, data interface{}, message string) {
	c.JSON(statusCode, Response{
		Success: true,
		Data:    data,
		Message: message,
	})
}

func ErrorResponse(c *gin.Context, statusCode int, errorMsg string) {
	c.JSON(statusCode, Response{
		Success: false,
		Error:   errorMsg,
	})
}

func PaginatedSuccessResponse(c *gin.Context, data interface{}, page, limit int, total int64) {
	totalPages := int((total + int64(limit) - 1) / int64(limit))
	c.JSON(http.StatusOK, PaginatedResponse{
		Success:    true,
		Data:       data,
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	})
}

