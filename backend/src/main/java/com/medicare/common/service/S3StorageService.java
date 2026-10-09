package com.medicare.common.service;

import com.medicare.common.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutBucketPolicyRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

/**
 * AWS S3 Storage Service for MediFinder Profile Images and Assets
 */
@Service
public class S3StorageService {

    private static final Logger logger = LoggerFactory.getLogger(S3StorageService.class);

    private final String bucketName;
    private final String region;
    private final S3Client s3Client;

    public S3StorageService(
            @Value("${aws.s3.access-key:}") String accessKey,
            @Value("${aws.s3.secret-key:}") String secretKey,
            @Value("${aws.s3.bucket-name:medi-finder}") String bucketName,
            @Value("${aws.s3.region:eu-north-1}") String region) {

        this.bucketName = bucketName;
        this.region = region;

        S3Client client = null;
        try {
            if (accessKey != null && !accessKey.isBlank() && secretKey != null && !secretKey.isBlank()) {
                AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey.trim(), secretKey.trim());
                client = S3Client.builder()
                        .region(Region.of(region.trim()))
                        .credentialsProvider(StaticCredentialsProvider.create(credentials))
                        .build();
                logger.info("AWS S3 client initialized successfully for bucket '{}' in region '{}'", bucketName, region);
            } else {
                logger.warn("AWS S3 credentials not provided; S3 uploads will use local fallback.");
            }
        } catch (Exception e) {
            logger.error("Failed to initialize AWS S3 client: {}", e.getMessage(), e);
        }
        this.s3Client = client;

        // Attempt to auto-apply public read policy to bucket
        enablePublicReadPolicy();
    }

    /**
     * Attempts to automatically configure the S3 bucket policy for public read access
     */
    public boolean enablePublicReadPolicy() {
        if (s3Client == null) return false;
        try {
            String policyJson = String.format("{\n" +
                    "  \"Version\": \"2012-10-17\",\n" +
                    "  \"Statement\": [\n" +
                    "    {\n" +
                    "      \"Sid\": \"PublicReadGetObject\",\n" +
                    "      \"Effect\": \"Allow\",\n" +
                    "      \"Principal\": \"*\",\n" +
                    "      \"Action\": \"s3:GetObject\",\n" +
                    "      \"Resource\": \"arn:aws:s3:::%s/*\"\n" +
                    "    }\n" +
                    "  ]\n" +
                    "}", bucketName);

            PutBucketPolicyRequest policyRequest = PutBucketPolicyRequest.builder()
                    .bucket(bucketName)
                    .policy(policyJson)
                    .build();
            s3Client.putBucketPolicy(policyRequest);
            logger.info("Successfully configured public read bucket policy on AWS S3 bucket '{}'", bucketName);
            return true;
        } catch (Exception ex) {
            logger.warn("Notice: S3 PutBucketPolicy returned: {}. Bucket public access block might be enabled in AWS Console.", ex.getMessage());
            return false;
        }
    }

    /**
     * Upload an image file to the configured AWS S3 bucket and return its public URL
     *
     * @param file the MultipartFile to upload
     * @param folder folder prefix (e.g., "avatars")
     * @return the public S3 URL of the uploaded image
     */
    public String uploadImage(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "avatar.png";
        String sanitizedName = originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
        String uniqueKey = (folder != null ? folder + "/" : "") + UUID.randomUUID() + "-" + sanitizedName;

        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            if (originalFilename.toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            } else if (originalFilename.toLowerCase().endsWith(".webp")) {
                contentType = "image/webp";
            } else {
                contentType = "image/jpeg";
            }
        }

        // Try direct AWS S3 upload
        if (s3Client != null) {
            try {
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(uniqueKey)
                        .contentType(contentType)
                        .build();

                s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

                String s3Url = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, uniqueKey);
                logger.info("Successfully uploaded image to S3: {}", s3Url);
                return s3Url;
            } catch (Exception ex) {
                logger.error("Error uploading image to AWS S3 bucket '{}': {}. Utilizing base64 data URI fallback.", bucketName, ex.getMessage());
            }
        }

        // Resilient fallback: data URI
        try {
            byte[] bytes = file.getBytes();
            String base64 = Base64.getEncoder().encodeToString(bytes);
            return "data:" + contentType + ";base64," + base64;
        } catch (IOException ioException) {
            throw new BadRequestException("Failed to process image file: " + ioException.getMessage());
        }
    }

    /**
     * Downloads an image directly from S3 by object key or full S3 URL
     */
    public byte[] downloadImageBytes(String keyOrUrl) {
        if (s3Client == null || keyOrUrl == null || keyOrUrl.isBlank()) return null;

        String key = keyOrUrl;
        if (key.contains(".amazonaws.com/")) {
            key = key.substring(key.indexOf(".amazonaws.com/") + ".amazonaws.com/".length());
        }

        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            return s3Client.getObjectAsBytes(getObjectRequest).asByteArray();
        } catch (Exception ex) {
            logger.error("Error downloading image from S3 for key '{}': {}", key, ex.getMessage());
            return null;
        }
    }
}

