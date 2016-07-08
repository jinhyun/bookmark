package com.bookmark.domain;

import java.util.List;

public class BookmarkParser {
    private String url;
    private String title;
    private List<String> folderNameList;

    public BookmarkParser(String url, String title, List<String> folderNameList) {
        this.url = url;
        this.title = title;
        this.folderNameList = folderNameList;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getFolderNameList() {
        return folderNameList;
    }

    public void setFolderNameList(List<String> folderNameList) {
        this.folderNameList = folderNameList;
    }

    @Override
    public String toString() {
        return "BookmarkParser{" +
                "url='" + url + '\'' +
                ", title='" + title + '\'' +
                ", folderNameList=" + folderNameList +
                '}';
    }
}
