package com.maricloud.backend.folder;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "folders")
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Folder parent;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Folder() {
    }

    public Folder(String name, Folder parent, LocalDateTime createdAt) {
        this.name = name;
        this.parent = parent;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Folder getParent() {
        return parent;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setParent(Folder parent) {
        this.parent = parent;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
