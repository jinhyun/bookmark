package com.bookmark.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Tags {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TAGS_UID")
    private Long uid;

    @Column(name = "NAME")
    private String name;

    @OneToMany(mappedBy = "tags", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BookmarkTags> bookmarkTags = new ArrayList<>();

    public Long getUid() {
        return uid;
    }

    public void setUid(Long uid) {
        this.uid = uid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Tags{" +
                "uid=" + uid +
                ", name='" + name + '\'' +
                ", bookmarkTags=" + bookmarkTags +
                '}';
    }
}
