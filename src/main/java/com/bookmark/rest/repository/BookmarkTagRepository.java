package com.bookmark.rest.repository;

import com.bookmark.domain.Bookmark;
import com.bookmark.domain.BookmarkTag;
import com.bookmark.domain.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookmarkTagRepository extends JpaRepository<BookmarkTag, Long> {
    BookmarkTag findByBookmarkAndTag(Bookmark bookmark, Tag tag);
}
