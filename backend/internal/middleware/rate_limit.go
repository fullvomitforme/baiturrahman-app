package middleware

import (
	"net/http"
	"sync"
	"time"
	"masjid-baiturrahim-backend/internal/utils"

	"github.com/gin-gonic/gin"
)

type rateLimiter struct {
	visitors map[string]*visitor
	mu       sync.RWMutex
	rate     int
	window   time.Duration
}

type visitor struct {
	count    int
	lastSeen time.Time
}

var limiter = &rateLimiter{
	visitors: make(map[string]*visitor),
	rate:     100,              // 100 requests
	window:   time.Minute,      // per minute
}

func (rl *rateLimiter) getVisitor(ip string) *visitor {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	v, exists := rl.visitors[ip]
	if !exists {
		v = &visitor{lastSeen: time.Now()}
		rl.visitors[ip] = v
		return v
	}

	// Reset if window expired
	if time.Since(v.lastSeen) > rl.window {
		v.count = 0
		v.lastSeen = time.Now()
	}

	return v
}

func (rl *rateLimiter) allow(ip string) bool {
	v := rl.getVisitor(ip)
	v.count++
	return v.count <= rl.rate
}

func RateLimit() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		if !limiter.allow(ip) {
			utils.ErrorResponse(c, http.StatusTooManyRequests, "Rate limit exceeded. Please try again later.")
			c.Abort()
			return
		}
		c.Next()
	}
}

