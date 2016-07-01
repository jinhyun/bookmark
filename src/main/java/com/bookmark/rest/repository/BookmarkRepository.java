package com.bookmark.rest.repository;

import com.bookmark.domain.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookmarkRepository extends JpaRepository <Bookmark, Long> {
    List<Bookmark> findByUrlContainingOrDescriptionContaining(String url, String description);
}
