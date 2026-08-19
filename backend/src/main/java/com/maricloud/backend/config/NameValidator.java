package com.maricloud.backend.config;

public final class NameValidator {

    private NameValidator() {
    }

    public static String validateAndTrim(String name, String label) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException(label + " is required");
        }

        String trimmedName = name.trim();
        if (trimmedName.indexOf('/') >= 0 || trimmedName.indexOf('\\') >= 0
                || trimmedName.chars().anyMatch(Character::isISOControl)) {
            throw new IllegalArgumentException(label + " contains invalid characters");
        }

        return trimmedName;
    }
}
