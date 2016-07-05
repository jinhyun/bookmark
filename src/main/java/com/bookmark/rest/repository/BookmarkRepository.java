package com.bookmark.rest.repository;

import com.bookmark.domain.Bookmark;
import com.bookmark.domain.Tags;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookmarkRepository extends JpaRepository <Bookmark, Long> {
    List<Bookmark> findByUrlContainingOrDescriptionContaining(String url, String description);

    @Query("select b from Bookmark b left outer join b.bookmarkTagsList t group by b.uid")
    List<Bookmark> findAllWithTags();

    @Query("select b from Bookmark b left join b.bookmarkTagsList bt left join bt.tags t where t.uid in :tagsUidList group by b.uid")
    List<Bookmark> findBookmarksByTagsUid(@Param("tagsUidList") List<Long> tagsUidList);
}
