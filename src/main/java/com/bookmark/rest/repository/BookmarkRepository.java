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

    /*
        SELECT B.*
        FROM BOOKMARK B
        LEFT JOIN BOOKMARK_TAG BT
        WHERE B.BOOKMARK_UID IN
            (SELECT BOOKMARK_UID FROM BOOKMARK_TAG BT
            WHERE BT.TAG_UID IN ('1', '3')
            GROUP BY BOOKMARK_UID
            HAVING COUNT(BOOKMARK_UID) > 1)
        GROUP BY B.BOOKMARK_UID
     */
    @Query("select b from Bookmark b " +
            "left join b.bookmarkTagList bt " +
            "where b.uid in (" +
            "   select ibt.bookmark.uid from BookmarkTag ibt where ibt.tag.uid in :tagUidList group by ibt.bookmark.uid having count (ibt.bookmark.uid) > :tagUidListCnt)" +
            "group by b.uid")
    List<Bookmark> findBookmarkListByTagUidList(@Param("tagUidList") List<Long> tagUidList, @Param("tagUidListCnt") Long tagUidListCnt);
}
