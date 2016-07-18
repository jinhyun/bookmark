package com.bookmark.rest.repository;

import com.bookmark.domain.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookmarkRepository extends JpaRepository <Bookmark, Long> {
    List<Bookmark> findByUrlContainingOrDescriptionContainingOrTitleContaining(String url, String description, String title);

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
    // TODO: Specification
    @Query("select b from Bookmark b " +
            "left join b.bookmarkTagList bt " +
            "where b.uid in (" +
            "   select ibt.bookmark.uid from BookmarkTag ibt where ibt.tag.uid in :tagUidList group by ibt.bookmark.uid having count (ibt.bookmark.uid) > :tagUidListCnt)" +
            "group by b.uid")
    List<Bookmark> findBookmarkListByTagUidList(
            @Param("tagUidList") List<Long> tagUidList,
            @Param("tagUidListCnt") Long tagUidListCnt);

    /*
        SELECT B.*
        FROM BOOKMARK B
        LEFT JOIN BOOKMARK_TAG BT on b.bookmark_uid = bt.bookmark_uid
        WHERE B.BOOKMARK_UID IN
            (SELECT BOOKMARK_UID FROM BOOKMARK_TAG BT
            WHERE BT.TAG_UID IN ('1',  '2')
            GROUP BY BOOKMARK_UID
            HAVING COUNT(BOOKMARK_UID) > 1)
        AND B.BOOKMARK_UID IN
            (SELECT B.BOOKMARK_UID
            FROM BOOKMARK B
            WHERE
            B.URL LIKE '%n%'
            OR B.DESCRIPTION LIKE '%n%'
            OR B.TITLE LIKE '%n%')
        GROUP BY B.BOOKMARK_UID
     */
    // TODO: Specification
    @Query("select b from Bookmark b " +
            "left join b.bookmarkTagList bt " +
            "where b.uid in (" +
            "   select ibt.bookmark.uid from BookmarkTag ibt where ibt.tag.uid in :tagUidList group by ibt.bookmark.uid having count (ibt.bookmark.uid) > :tagUidListCnt)" +
            "and b.uid in (" +
            "   select ib.uid from Bookmark ib where ib.url like '%'||:url||'%' or ib.description like '%'||:description||'%' or ib.title like '%'||:title||'%')" +
            "group by b.uid")
    List<Bookmark> findBookmarkListByUrlDescTitleTagUidList(
            @Param("url") String url,
            @Param("description") String description,
            @Param("title") String title,
            @Param("tagUidList") List<Long> tagUidList,
            @Param("tagUidListCnt") Long tagUidListCnt);
}
