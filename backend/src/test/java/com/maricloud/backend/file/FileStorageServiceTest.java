package com.maricloud.backend.file;

import com.maricloud.backend.config.ResourceNotFoundException;
import com.maricloud.backend.folder.FolderRepository;
import io.minio.MinioClient;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class FileStorageServiceTest {

    private final MinioClient minioClient = mock(MinioClient.class);
    private final FileMetadataRepository fileRepository = mock(FileMetadataRepository.class);
    private final FileStorageService service = new FileStorageService(
            minioClient, fileRepository, mock(FolderRepository.class));

    @Test
    void deletesPhysicalObjectAndMetadata() throws Exception {
        FileMetadata file = file(7L, "report.pdf");
        when(fileRepository.findById(7L)).thenReturn(Optional.of(file));

        service.delete(7L);

        verify(minioClient).removeObject(any());
        verify(fileRepository).delete(file);
    }

    @Test
    void deleteRejectsNonexistentFile() {
        when(fileRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.delete(99L));
        verify(minioClient, never()).removeObject(any());
        verify(fileRepository, never()).delete(any());
    }

    @Test
    void renamesFileMetadataWithoutChangingObjectKey() {
        FileMetadata file = file(3L, "old-name.txt");
        when(fileRepository.findById(3L)).thenReturn(Optional.of(file));
        when(fileRepository.save(file)).thenReturn(file);

        FileMetadata renamedFile = service.rename(3L, "new-name.txt");

        assertEquals("new-name.txt", renamedFile.getFileName());
        assertEquals("object-key", renamedFile.getObjectKey());
        verify(fileRepository).save(file);
    }

    @Test
    void renameRejectsBlankOrInvalidNames() {
        FileMetadata file = file(3L, "old-name.txt");
        when(fileRepository.findById(eq(3L))).thenReturn(Optional.of(file));

        assertThrows(IllegalArgumentException.class, () -> service.rename(3L, "   "));
        assertThrows(IllegalArgumentException.class, () -> service.rename(3L, "folder/name.txt"));
        verify(fileRepository, never()).save(any());
    }

    private FileMetadata file(Long id, String name) {
        FileMetadata file = new FileMetadata(name, "object-key", 12L,
                "text/plain", LocalDateTime.now(), null);
        file.setId(id);
        return file;
    }
}
