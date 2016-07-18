package com.bookmark.rest.controller;

import com.bookmark.domain.Bookmark;
import com.bookmark.domain.Tag;
import com.bookmark.rest.service.BookmarkService;
import com.bookmark.rest.service.BookmarkTagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BookmarkRestController {
    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private BookmarkTagService bookmarkTagService;

    @GetMapping("/bookmarks")
    public List<Bookmark> readBookmarkList() {
        return bookmarkService.getBookmarks();
    }

    @GetMapping("/bookmarks/{bookmarkUid}")
    public Bookmark readBookmark(@PathVariable Long bookmarkUid) {
        return bookmarkService.getBookmark(bookmarkUid);
    }

    @PostMapping("/bookmarks")
    public Bookmark addBookmark(@RequestBody Bookmark bookmark) {
        return bookmarkService.addBookmark(bookmark);
    }

    @PatchMapping("/bookmarks")
    public Bookmark modifyBookmark(@RequestBody Bookmark bookmark) {
        return bookmarkService.modifyBookmark(bookmark);
    }

    @DeleteMapping("/bookmarks/{bookmarkUid}")
    public void removeBookmark(@PathVariable Long bookmarkUid){
        bookmarkService.removeBookmark(bookmarkUid);
    }

    @GetMapping(value = "/search/bookmarks/contents/{contents}/tags/{tagUidList}")
    public List<Bookmark> findBookmarkListByUrlDescTitleTagUidList(@PathVariable("contents") String contents, @PathVariable("tagUidList") List<Long> tagUidList) {
        return bookmarkService.findBookmarkListByUrlDescTitleTagUidList(contents, tagUidList);
    }

    @GetMapping("/search/bookmarks/contents/{contents}")
    public List<Bookmark> findBookmarkListByUrlDescTitle(@PathVariable("contents") String contents) {
        return bookmarkService.findBookmarkListByUrlDescTitle(contents);
    }

    @GetMapping(value = "/search/bookmarks/tags/{tagUidList}")
    public List<Bookmark> findBookmarkListByTagUidList(@PathVariable("tagUidList") List<Long> tagUidList) {
        return bookmarkService.findBookmarkListByTagUidList(tagUidList);
    }

    @PostMapping("/bookmarks/{bookmarkUid}/tags")
    public Tag addBookmarkTag(@PathVariable Long bookmarkUid, @RequestBody Tag tag) {
        return bookmarkService.addBookmarkTag(bookmarkUid, tag);
    }

    @DeleteMapping("/bookmarks/{bookmarkUid}/tags/{tagUid}")
    public Tag removeBookmarkTag(@PathVariable Long bookmarkUid, @PathVariable Long tagUid) {
        return bookmarkTagService.removeBookmarkTag(bookmarkUid, tagUid);
    }
}
