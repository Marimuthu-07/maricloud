package com.maricloud.backend.folder;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @PostMapping
    public ResponseEntity<FolderResponse> createFolder(
            @RequestParam String name,
            @RequestParam(required = false) Long parentId
    ) {
        Folder folder = folderService.createFolder(name, parentId);

        return ResponseEntity.ok(toResponse(folder));
    }

    @GetMapping
    public ResponseEntity<List<FolderResponse>> getFolders(
            @RequestParam(required = false) Long parentId
    ) {
        List<Folder> folders;

        if (parentId == null) {
            folders = folderService.getRootFolders();
        } else {
            folders = folderService.getSubFolders(parentId);
        }

        return ResponseEntity.ok(
                folders.stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    private FolderResponse toResponse(Folder folder) {

        Long parentId = folder.getParent() != null
                ? folder.getParent().getId()
                : null;

        return new FolderResponse(
                folder.getId(),
                folder.getName(),
                parentId,
                folder.getCreatedAt()
        );
    }
}
