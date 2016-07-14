package com.bookmark.rest.repository;

import com.bookmark.domain.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookmarkRepository extends JpaRepository <Bookmark, Long> {
    List<Bookmark> findByUrlContainingOrDescriptionContaining(String url, String description);

    @Query("select b from Bookmark b left outer join b.bookmarkTagList t group by b.uid")
    List<Bookmark> findBookmarkListWithTag();

    @Query("select b from Bookmark b left join b.bookmarkTagList bt left join bt.tag t where t.uid in :tagUidList group by b.uid")
    List<Bookmark> findBookmarkListByTagUidList(@Param("tagUidList") List<Long> tagUidList);
}
