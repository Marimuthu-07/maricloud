package com.maricloud.backend.file;

import java.time.LocalDateTime;

public record FileResponse(
        Long id,
        String fileName,
        String objectKey,
        Long size,
        String contentType,
        LocalDateTime createdAt,
        Long folderId
) {
}

