package com.bookmark.domain;

import javax.persistence.*;

@Entity
public class BookmarkTags {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOOKMARK_TAGS_UID")
    private Long uid;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="BOOKMARK_UID")
    private Bookmark bookmark;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="TAGS_UID")
    private Tags tags;

    public Long getUid() {
        return uid;
    }

    public void setUid(Long uid) {
        this.uid = uid;
    }

    public Tags getTags() {
        return tags;
    }

    public void setTags(Tags tags) {
        this.tags = tags;
    }

    public Bookmark getBookmark() {
        return bookmark;
    }

    public void setBookmark(Bookmark bookmark) {
        this.bookmark = bookmark;
    }

    @Override
    public String toString() {
        return "BookmarkTags{" +
                "uid=" + uid +
                ", bookmark=" + bookmark +
                ", tags=" + tags +
                '}';
    }
}
