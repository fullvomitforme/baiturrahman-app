package middleware

import (
	"net/http"
	"masjid-baiturrahim-backend/config"
	"masjid-baiturrahim-backend/internal/models"
	"masjid-baiturrahim-backend/internal/utils"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Authorization header required")
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid authorization header")
			c.Abort()
			return
		}

		claims, err := utils.ParseToken(tokenString, config.Load().JWTSecret)
		if err != nil {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid or expired token")
			c.Abort()
			return
		}

		if claims.TokenType != utils.TokenTypeAccess {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid token type")
			c.Abort()
			return
		}

		// Store claims in context
		c.Set("userID", claims.UserID)
		c.Set("userEmail", claims.Email)
		c.Set("userRole", claims.Role)

		c.Set("userID", claims.UserID)
		c.Set("userEmail", claims.Email)
		c.Set("userRole", claims.Role)

		c.Next()
	}
}

func RequireRole(roles ...models.UserRole) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("userRole")
		if !exists {
			utils.ErrorResponse(c, http.StatusForbidden, "Role not found in context")
			c.Abort()
			return
		}

		userRole := models.UserRole(role.(string))
		allowed := false
		for _, r := range roles {
			if userRole == r {
				allowed = true
				break
			}
		}

		if !allowed {
			utils.ErrorResponse(c, http.StatusForbidden, "Insufficient permissions")
			c.Abort()
			return
		}

		c.Next()
	}
}
