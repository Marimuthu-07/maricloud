package com.maricloud.backend.file;

import com.maricloud.backend.folder.Folder;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "files")
public class FileMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String objectKey;

    @Column(nullable = false)
    private Long size;

    private String contentType;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "folder_id")
    private Folder folder;

    public FileMetadata() {
    }

    public FileMetadata(
            String fileName,
            String objectKey,
            Long size,
            String contentType,
            LocalDateTime createdAt,
	    Folder folder
    ) {
        this.fileName = fileName;
        this.objectKey = objectKey;
        this.size = size;
        this.contentType = contentType;
        this.createdAt = createdAt;
	this.folder = folder;
    }

    public Long getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public String getObjectKey() {
        return objectKey;
    }

    public Long getSize() {
        return size;
    }

    public String getContentType() {
        return contentType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public Folder getFolder() {
    	return folder;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setObjectKey(String objectKey) {
        this.objectKey = objectKey;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public void setFolder(Folder folder) {
    	this.folder = folder;
    }
}
