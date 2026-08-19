package com.maricloud.backend.folder;

import com.maricloud.backend.config.ResourceConflictException;
import com.maricloud.backend.config.ResourceNotFoundException;
import com.maricloud.backend.file.FileMetadataRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class FolderServiceTest {

    private final FolderRepository folderRepository = mock(FolderRepository.class);
    private final FileMetadataRepository fileRepository = mock(FileMetadataRepository.class);
    private final FolderService service = new FolderService(folderRepository, fileRepository);

    @Test
    void deletesEmptyFolder() {
        Folder folder = folder(4L, "Documents");
        when(folderRepository.findById(4L)).thenReturn(Optional.of(folder));
        when(folderRepository.existsByParentId(4L)).thenReturn(false);
        when(fileRepository.existsByFolderId(4L)).thenReturn(false);

        service.deleteFolder(4L);

        verify(folderRepository).delete(folder);
    }

    @Test
    void deleteRejectsNonexistentFolder() {
        when(folderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.deleteFolder(99L));
        verify(folderRepository, never()).delete(any());
    }

    @Test
    void deleteRejectsFolderWithContent() {
        Folder folder = folder(4L, "Documents");
        when(folderRepository.findById(4L)).thenReturn(Optional.of(folder));
        when(folderRepository.existsByParentId(4L)).thenReturn(true);

        assertThrows(ResourceConflictException.class, () -> service.deleteFolder(4L));
        verify(folderRepository, never()).delete(any());
    }

    @Test
    void renamesFolder() {
        Folder folder = folder(4L, "Old name");
        when(folderRepository.findById(4L)).thenReturn(Optional.of(folder));
        when(folderRepository.save(folder)).thenReturn(folder);

        Folder renamedFolder = service.renameFolder(4L, "New name");

        assertEquals("New name", renamedFolder.getName());
        verify(folderRepository).save(folder);
    }

    @Test
    void folderRenameRejectsBlankNames() {
        Folder folder = folder(4L, "Old name");
        when(folderRepository.findById(4L)).thenReturn(Optional.of(folder));

        assertThrows(IllegalArgumentException.class, () -> service.renameFolder(4L, " "));
        verify(folderRepository, never()).save(any());
    }

    private Folder folder(Long id, String name) {
        Folder folder = new Folder(name, null, LocalDateTime.now());
        try {
            var idField = Folder.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(folder, id);
        } catch (ReflectiveOperationException exception) {
            throw new AssertionError(exception);
        }
        return folder;
    }
}
