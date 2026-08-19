package com.maricloud.backend.storage;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MinioStartup implements CommandLineRunner {

    private final MinioStorageService storageService;

    public MinioStartup(MinioStorageService storageService) {
        this.storageService = storageService;
    }

    @Override
    public void run(String... args) throws Exception {
        storageService.ensureBucketExists();

        System.out.println("=================================");
        System.out.println("MariCloud MinIO: CONNECTED");
        System.out.println("Bucket: maricloud");
        System.out.println("=================================");
    }
}
