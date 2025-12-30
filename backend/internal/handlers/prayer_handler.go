package handlers

import (
	"net/http"
	"strconv"
	"time"
	"masjid-baiturrahim-backend/internal/models"
	"masjid-baiturrahim-backend/internal/services"
	"masjid-baiturrahim-backend/internal/utils"

	"github.com/gin-gonic/gin"
)

type BulkPrayerTimesRequest struct {
	PrayerTimes []models.PrayerTimes `json:"prayer_times" binding:"required"`
}

func (h *Handler) GetPrayerTimesByDate(c *gin.Context) {
	dateStr := c.Query("date")
	location := c.DefaultQuery("location", "default")

	var date time.Time
	var err error
	if dateStr == "" {
		date = time.Now()
	} else {
		date, err = time.Parse("2006-01-02", dateStr)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid date format. Use YYYY-MM-DD")
			return
		}
	}

	var prayerTimes models.PrayerTimes
	if err := h.DB.Where("date = ? AND location = ?", date.Format("2006-01-02"), location).First(&prayerTimes).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Prayer times not found for this date")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, prayerTimes, "")
}

func (h *Handler) GetPrayerTimesByMonth(c *gin.Context) {
	yearStr := c.Query("year")
	monthStr := c.Query("month")
	location := c.DefaultQuery("location", "default")

	var year, month int
	var err error
	if yearStr == "" || monthStr == "" {
		now := time.Now()
		year = now.Year()
		month = int(now.Month())
	} else {
		year, err = strconv.Atoi(yearStr)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid year format")
			return
		}
		month, err = strconv.Atoi(monthStr)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid month format")
			return
		}
	}

	startDate := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
	endDate := startDate.AddDate(0, 1, 0).AddDate(0, 0, -1)

	var prayerTimes []models.PrayerTimes
	h.DB.Where("date >= ? AND date <= ? AND location = ?", startDate, endDate, location).
		Order("date ASC").
		Find(&prayerTimes)

	utils.SuccessResponse(c, http.StatusOK, prayerTimes, "")
}

func (h *Handler) CreatePrayerTimes(c *gin.Context) {
	var prayerTimes models.PrayerTimes
	if err := c.ShouldBindJSON(&prayerTimes); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.DB.Create(&prayerTimes).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create prayer times")
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, prayerTimes, "Prayer times created successfully")
}

func (h *Handler) BulkCreatePrayerTimes(c *gin.Context) {
	var req BulkPrayerTimesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.DB.Create(&req.PrayerTimes).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create prayer times")
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, req.PrayerTimes, "Prayer times created successfully")
}

func (h *Handler) UpdatePrayerTimes(c *gin.Context) {
	id := c.Param("id")
	var prayerTimes models.PrayerTimes

	if err := h.DB.First(&prayerTimes, "id = ?", id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Prayer times not found")
		return
	}

	if err := c.ShouldBindJSON(&prayerTimes); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.DB.Save(&prayerTimes).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update prayer times")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, prayerTimes, "Prayer times updated successfully")
}

func (h *Handler) DeletePrayerTimes(c *gin.Context) {
	id := c.Param("id")
	if err := h.DB.Delete(&models.PrayerTimes{}, "id = ?", id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete prayer times")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, nil, "Prayer times deleted successfully")
}

func (h *Handler) GeneratePrayerTimes(c *gin.Context) {
	yearStr := c.Query("year")
	monthStr := c.Query("month")
	location := c.DefaultQuery("location", "default")

	var year, month int
	var err error
	if yearStr == "" || monthStr == "" {
		now := time.Now()
		year = now.Year()
		month = int(now.Month())
	} else {
		year, err = strconv.Atoi(yearStr)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid year format")
			return
		}
		month, err = strconv.Atoi(monthStr)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid month format")
			return
		}
	}

	// Use prayer service to generate times
	prayerTimes, err := services.GeneratePrayerTimesForMonth(h.DB, year, month, location)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, prayerTimes, "Prayer times generated successfully")
}

