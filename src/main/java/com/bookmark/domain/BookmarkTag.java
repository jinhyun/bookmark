package com.bookmark.domain;

import javax.persistence.*;

@Entity
public class BookmarkTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOOKMARK_TAG_UID")
    private Long uid;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="BOOKMARK_UID")
    private Bookmark bookmark;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="TAG_UID")
    private Tag tag;

    public Long getUid() {
        return uid;
    }

    public void setUid(Long uid) {
        this.uid = uid;
    }

    public Tag getTag() {
        return tag;
    }

    public void setTag(Tag tag) {
        this.tag = tag;
    }

    public Bookmark getBookmark() {
        return bookmark;
    }

    public void setBookmark(Bookmark bookmark) {
        this.bookmark = bookmark;
    }
}
