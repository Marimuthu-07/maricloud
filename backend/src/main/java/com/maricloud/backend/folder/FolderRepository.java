package com.maricloud.backend.folder;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {

    List<Folder> findByParentId(Long parentId);

    List<Folder> findByParentIsNull();

    boolean existsByParentId(Long parentId);
}
