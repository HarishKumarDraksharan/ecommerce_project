package com.shopsphere.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.Map;

/**
 * CloudinaryService – handles image uploads to Cloudinary with local storage fallback
 * if credentials are not configured.
 */
@Service
@Slf4j
public class CloudinaryService {

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    private Cloudinary cloudinary;
    private boolean isConfigured = false;

    private final FileStorageService fileStorageService;

    public CloudinaryService(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostConstruct
    public void init() {
        if (cloudName != null && !cloudName.isBlank() &&
            apiKey != null && !apiKey.isBlank() &&
            apiSecret != null && !apiSecret.isBlank()) {

            cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret,
                    "secure", true
            ));
            isConfigured = true;
            log.info("Cloudinary client initialized successfully");
        } else {
            log.warn("Cloudinary credentials are not configured. Falling back to local disk storage.");
        }
    }

    public String uploadFile(MultipartFile file) {
        if (!isConfigured) {
            return fileStorageService.storeFile(file);
        }

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            String url = (String) uploadResult.get("secure_url");
            log.info("Uploaded file to Cloudinary: {}", url);
            return url;
        } catch (IOException e) {
            log.error("Cloudinary upload failed: {}", e.getMessage());
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }

    public void deleteFile(String url) {
        if (!isConfigured || url == null || !url.contains("cloudinary")) {
            fileStorageService.deleteFile(url);
            return;
        }

        try {
            // Extract publicId from URL
            String publicId = extractPublicId(url);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                log.info("Deleted file from Cloudinary: {}", publicId);
            }
        } catch (Exception e) {
            log.warn("Could not delete file from Cloudinary: {}", e.getMessage());
        }
    }

    private String extractPublicId(String url) {
        try {
            int lastSlash = url.lastIndexOf('/');
            int lastDot = url.lastIndexOf('.');
            if (lastSlash != -1 && lastDot != -1 && lastSlash < lastDot) {
                return url.substring(lastSlash + 1, lastDot);
            }
        } catch (Exception e) {
            log.warn("Failed to parse publicId from url: {}", url);
        }
        return null;
    }
}
