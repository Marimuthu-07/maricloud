package com.maricloud.backend.folder;

import com.maricloud.backend.config.NameValidator;
import com.maricloud.backend.config.ResourceConflictException;
import com.maricloud.backend.config.ResourceNotFoundException;
import com.maricloud.backend.file.FileMetadataRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FolderService {

    private final FolderRepository folderRepository;
    private final FileMetadataRepository fileMetadataRepository;

    public FolderService(FolderRepository folderRepository,
                         FileMetadataRepository fileMetadataRepository) {
        this.folderRepository = folderRepository;
        this.fileMetadataRepository = fileMetadataRepository;
    }

    public Folder createFolder(String name, Long parentId) {

        Folder parent = null;

        if (parentId != null) {
            parent = folderRepository.findById(parentId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Parent folder not found"));
        }

        Folder folder = new Folder(
                NameValidator.validateAndTrim(name, "Folder name"),
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
                        new ResourceNotFoundException("Folder not found"));
    }

    public void deleteFolder(Long id) {

        Folder folder = findById(id);

        if (folderRepository.existsByParentId(id)) {
            throw new ResourceConflictException("Folder cannot be deleted because it contains subfolders");
        }

        if (fileMetadataRepository.existsByFolderId(id)) {
            throw new ResourceConflictException("Folder cannot be deleted because it contains files");
        }

        folderRepository.delete(folder);
    }

    public Folder renameFolder(Long id, String name) {
        Folder folder = findById(id);
        folder.setName(NameValidator.validateAndTrim(name, "Folder name"));
        return folderRepository.save(folder);
    }
}
