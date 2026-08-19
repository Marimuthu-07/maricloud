package com.maricloud.backend.file;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FileMetadataRepository
        extends JpaRepository<FileMetadata, Long> {
}
