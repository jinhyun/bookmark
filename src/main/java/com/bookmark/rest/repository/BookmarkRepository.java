package com.bookmark.rest.repository;

import com.bookmark.domain.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookmarkRepository extends JpaRepository <Bookmark, Long> {
}
