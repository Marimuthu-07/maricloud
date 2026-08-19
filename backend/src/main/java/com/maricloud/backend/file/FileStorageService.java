package com.maricloud.backend.file;

import io.minio.GetObjectArgs;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import io.minio.RemoveObjectArgs;
import org.springframework.beans.factory.annotation.Value;
import com.maricloud.backend.folder.Folder;
import com.maricloud.backend.folder.FolderRepository;

import io.minio.PutObjectArgs;
import io.minio.MinioClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final String BUCKET_NAME = "maricloud";

    private final MinioClient minioClient;
    private final FileMetadataRepository fileMetadataRepository;
    private final FolderRepository folderRepository;

    @Value("${maricloud.storage.limit-bytes}")
    private long storageLimitBytes;

    public FileStorageService(
            MinioClient minioClient,
            FileMetadataRepository fileMetadataRepository,
	    FolderRepository folderRepository
    ) {
        this.minioClient = minioClient;
        this.fileMetadataRepository = fileMetadataRepository;
	this.folderRepository = folderRepository;
    }
    public FileMetadata upload(MultipartFile file, Long folderId) throws Exception {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
	Folder folder = null;

	if (folderId != null) {
    		folder = folderRepository.findById(folderId)
            		.orElseThrow(() ->
                    		new RuntimeException("Folder not found"));
	}

        String originalName = file.getOriginalFilename();

        if (originalName == null || originalName.isBlank()) {
            throw new IllegalArgumentException("File name is required");
        }
	long usedStorage = getUsedStorage();

	if (usedStorage + file.getSize() > storageLimitBytes) {
    		throw new IllegalStateException(
            		"Storage limit exceeded. Remaining: "
                    	+ (storageLimitBytes - usedStorage)
                    	+ " bytes"
    		);
	}

        String objectKey = UUID.randomUUID() + "-" + originalName;

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(BUCKET_NAME)
                        .object(objectKey)
                        .stream(
                                file.getInputStream(),
                                file.getSize(),
                                -1
                        )
                        .contentType(file.getContentType())
                        .build()
        );

        FileMetadata metadata = new FileMetadata(
                originalName,
                objectKey,
                file.getSize(),
                file.getContentType(),
                LocalDateTime.now(),
		folder
        );

        return fileMetadataRepository.save(metadata);
    }
    public java.util.List<FileMetadata> listFiles() {
    return fileMetadataRepository.findAll();
    }

    public FileMetadata findById(Long id) {
    	return fileMetadataRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("File not found"));
    }

    public Resource download(Long id) throws Exception {

    	FileMetadata metadata = findById(id);

    	var inputStream = minioClient.getObject(
            GetObjectArgs.builder()
                    .bucket(BUCKET_NAME)
                    .object(metadata.getObjectKey())
                    .build()
    	);

    	return new InputStreamResource(inputStream);
    }

    public void delete(Long id) throws Exception {

    	FileMetadata metadata = findById(id);

    	minioClient.removeObject(
            RemoveObjectArgs.builder()
                    .bucket(BUCKET_NAME)
                    .object(metadata.getObjectKey())
                    .build()
    	);

    	fileMetadataRepository.delete(metadata);
    }
    public long getUsedStorage() {
    	return fileMetadataRepository.findAll()
            .stream()
            .mapToLong(FileMetadata::getSize)
            .sum();
    }
    public long getStorageLimit() {
    return storageLimitBytes;
    }
}
