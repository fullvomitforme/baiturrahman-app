package services

import (
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"os"
	"path/filepath"
	"strings"
)

func OptimizeImage(filePath string) (string, error) {
	// Open image
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	// Decode image
	img, format, err := image.Decode(file)
	if err != nil {
		return "", err
	}

	// Create optimized filename
	ext := filepath.Ext(filePath)
	optimizedPath := strings.TrimSuffix(filePath, ext) + "_optimized" + ext

	// Create output file
	out, err := os.Create(optimizedPath)
	if err != nil {
		return "", err
	}
	defer out.Close()

	// Encode with quality settings
	switch format {
	case "jpeg", "jpg":
		err = jpeg.Encode(out, img, &jpeg.Options{Quality: 85})
	case "png":
		encoder := &png.Encoder{CompressionLevel: png.BestCompression}
		err = encoder.Encode(out, img)
	default:
		return filePath, nil // Return original if format not supported
	}

	if err != nil {
		return filePath, err // Return original if optimization fails
	}

	// Replace original with optimized
	if err := os.Rename(optimizedPath, filePath); err != nil {
		return filePath, err
	}

	return filePath, nil
}

func ValidateImage(filePath string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	_, format, err := image.DecodeConfig(file)
	if err != nil {
		return fmt.Errorf("invalid image format: %w", err)
	}

	allowedFormats := []string{"jpeg", "jpg", "png", "gif", "webp"}
	for _, allowed := range allowedFormats {
		if format == allowed {
			return nil
		}
	}

	return fmt.Errorf("unsupported image format: %s", format)
}

