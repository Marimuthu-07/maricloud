package com.maricloud.backend.file;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;

import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<FileResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folderId", required = false) Long folderId
    ) throws Exception {

        FileMetadata metadata =
                fileStorageService.upload(file, folderId);

        return ResponseEntity.ok(toResponse(metadata));
    }

    @GetMapping
    public ResponseEntity<List<FileResponse>> listFiles() {

        List<FileResponse> files = fileStorageService.listFiles()
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(files);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(
            @PathVariable Long id
    ) throws Exception {

        FileMetadata metadata = fileStorageService.findById(id);

        Resource resource = fileStorageService.download(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        metadata.getContentType() != null
                                ? metadata.getContentType()
                                : MediaType.APPLICATION_OCTET_STREAM_VALUE
                ))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                metadata.getFileName() + "\""
                )
                .body(resource);
    }

    @GetMapping("/storage")
    public ResponseEntity<StorageInfo> storage() {

        long used = fileStorageService.getUsedStorage();
        long limit = fileStorageService.getStorageLimit();
        long remaining = Math.max(0, limit - used);

        double usagePercent = limit > 0
                ? ((double) used / limit) * 100
                : 0;

        return ResponseEntity.ok(
                new StorageInfo(
                        used,
                        limit,
                        remaining,
                        usagePercent
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws Exception {
        fileStorageService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/rename")
    public ResponseEntity<FileResponse> rename(
            @PathVariable Long id,
            @RequestBody FileRenameRequest request
    ) {
        return ResponseEntity.ok(toResponse(
                fileStorageService.rename(id, request.fileName())
        ));
    }

    private FileResponse toResponse(FileMetadata metadata) {

        Long folderId = metadata.getFolder() != null
                ? metadata.getFolder().getId()
                : null;

        return new FileResponse(
                metadata.getId(),
                metadata.getFileName(),
                metadata.getObjectKey(),
                metadata.getSize(),
                metadata.getContentType(),
                metadata.getCreatedAt(),
                folderId
        );
    }
    @PutMapping("/{id}/folder")
    public ResponseEntity<FileResponse> moveToFolder(
            @PathVariable Long id,
            @RequestParam Long folderId
    ) {

    FileMetadata metadata =
            fileStorageService.moveToFolder(id, folderId);

    return ResponseEntity.ok(toResponse(metadata));
    }
    @PostMapping("/restore")
    public ResponseEntity<FileMetadata> restore(
        @RequestParam String fileName,
        @RequestParam String objectKey,
        @RequestParam long size,
        @RequestParam(required = false) String contentType
	) {

    	FileMetadata metadata = fileStorageService.restore(
            fileName,
            objectKey,
            size,
            contentType,
            LocalDateTime.now()
    	);

    	return ResponseEntity.ok(metadata);
    }
}
