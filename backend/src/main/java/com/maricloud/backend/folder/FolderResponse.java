package com.maricloud.backend.folder;

import java.time.LocalDateTime;

public record FolderResponse(
        Long id,
        String name,
        Long parentId,
        LocalDateTime createdAt
) {
}

