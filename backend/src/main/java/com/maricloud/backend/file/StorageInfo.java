package com.maricloud.backend.file;

public record StorageInfo(
        long usedBytes,
        long limitBytes,
        long remainingBytes,
        double usagePercent
) {
}

