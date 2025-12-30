package middleware

import (
	"net/http"
	"masjid-baiturrahim-backend/internal/utils"

	"github.com/gin-gonic/gin"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		}
	}
}

