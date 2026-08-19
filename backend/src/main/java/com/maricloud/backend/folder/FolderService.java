package com.maricloud.backend.folder;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FolderService {

    private final FolderRepository folderRepository;

    public FolderService(FolderRepository folderRepository) {
        this.folderRepository = folderRepository;
    }

    public Folder createFolder(String name, Long parentId) {

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Folder name is required");
        }

        Folder parent = null;

        if (parentId != null) {
            parent = folderRepository.findById(parentId)
                    .orElseThrow(() ->
                            new RuntimeException("Parent folder not found"));
        }

        Folder folder = new Folder(
                name.trim(),
                parent,
                LocalDateTime.now()
        );

        return folderRepository.save(folder);
    }

    public List<Folder> getRootFolders() {
        return folderRepository.findByParentIsNull();
    }

    public List<Folder> getSubFolders(Long parentId) {
        return folderRepository.findByParentId(parentId);
    }

    public Folder findById(Long id) {
        return folderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Folder not found"));
    }

    public void deleteFolder(Long id) {

        Folder folder = findById(id);

        folderRepository.delete(folder);
    }
}

