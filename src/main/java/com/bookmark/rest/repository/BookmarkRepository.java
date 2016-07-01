package com.bookmark.rest.repository;

import com.bookmark.domain.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookmarkRepository extends JpaRepository <Bookmark, Long> {
    List<Bookmark> findByUrlContainingOrDescriptionContaining(String url, String description);

    @Query("select b from Bookmark b join b.bookmarkTagsList t group by b.uid")
    List<Bookmark> findAllWithTags();
}
