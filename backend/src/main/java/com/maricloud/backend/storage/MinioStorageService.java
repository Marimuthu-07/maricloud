package com.maricloud.backend.storage;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import org.springframework.stereotype.Service;

@Service
public class MinioStorageService {

    private static final String BUCKET_NAME = "maricloud";

    private final MinioClient minioClient;

    public MinioStorageService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    public void ensureBucketExists() throws Exception {

        boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder()
                        .bucket(BUCKET_NAME)
                        .build()
        );

        if (!exists) {
            minioClient.makeBucket(
                    MakeBucketArgs.builder()
                            .bucket(BUCKET_NAME)
                            .build()
            );
        }
    }
}
