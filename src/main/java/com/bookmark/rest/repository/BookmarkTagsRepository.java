package com.bookmark.rest.repository;

import com.bookmark.domain.Bookmark;
import com.bookmark.domain.BookmarkTags;
import com.bookmark.domain.Tags;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookmarkTagsRepository extends JpaRepository<BookmarkTags, Long> {
    BookmarkTags findByBookmarkAndTags(Bookmark bookmark, Tags tags);
}
