package com.bookmark.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class Bookmark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOOKMARK_UID")
    private Long uid;

    @Column(name = "URL")
    private String url;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "REG_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date regDate;

    @Transient
    private List<Tag> tagList;

    public List<Tag> getTagList() {
        List<Tag> tagList = new ArrayList<>();
        for (BookmarkTag bookmarkTag : bookmarkTagList) {
            Tag tag = new Tag();
            tag.setUid(bookmarkTag.getTag().getUid());
            tag.setName(bookmarkTag.getTag().getName());
            tagList.add(tag);
        }

        return tagList;
    }

    @OneToMany(mappedBy = "bookmark", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonBackReference
    private List<BookmarkTag> bookmarkTagList = new ArrayList<>();

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<BookmarkTag> getBookmarkTagList() {
        return bookmarkTagList;
    }

    public void setBookmarkTagList(List<BookmarkTag> bookmarkTagList) {
        this.bookmarkTagList = bookmarkTagList;
    }

    public Long getUid() {
        return uid;
    }

    public void setUid(Long uid) {
        this.uid = uid;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getRegDate() {
        return regDate;
    }

    public void setRegDate(Date regDate) {
        this.regDate = regDate;
    }
}
