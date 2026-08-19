package com.maricloud.backend.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    @Value("${minio.url}")
    private String minioUrl;

    @Value("${minio.username}")
    private String minioUsername;

    @Value("${minio.password}")
    private String minioPassword;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(minioUrl)
                .credentials(minioUsername, minioPassword)
                .build();
    }
}
