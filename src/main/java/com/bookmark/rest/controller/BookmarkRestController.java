package com.bookmark.rest.controller;

import com.bookmark.domain.Bookmark;
import com.bookmark.domain.Tags;
import com.bookmark.rest.service.BookmarkService;
import com.bookmark.rest.service.BookmarkTagsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BookmarkRestController {
    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private BookmarkTagsService bookmarkTagsService;

    @GetMapping("/bookmarks")
    public List<Bookmark> readBookmarks() {
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
    public Bookmark modifyBookmark(@RequestBody Bookmark bookmarkInput) {
        return bookmarkService.modifyBookmark(bookmarkInput);
    }

    @DeleteMapping("/bookmarks/{bookmarkUid}")
    public void removeBookmark(@PathVariable Long bookmarkUid){
        bookmarkService.removeBookmark(bookmarkUid);
    }

    @GetMapping("/search/bookmarks/{contents}")
    public List<Bookmark> findAllBookmarks(@PathVariable String contents) {
        return bookmarkService.findAllBookmarks(contents);
    }

    @PostMapping("/bookmarks/{bookmarkUid}/tags")
    public Tags addBookmarkTags(@PathVariable Long bookmarkUid, @RequestBody Tags tags) {
        return bookmarkService.addBookmarkTags(bookmarkUid, tags);
    }

    @DeleteMapping("/bookmarks/{bookmarkUid}/tags/{tagsUid}")
    public Tags removeBookmarkTags(@PathVariable Long bookmarkUid, @PathVariable Long tagsUid) {
        return bookmarkTagsService.removeBookmarkTags(bookmarkUid, tagsUid);
    }

    @PostMapping("/search/bookmarks/tags")
    public List<Bookmark> findBookmarksByTagsUid(@RequestBody List<Long> tagsUidList) {
        return bookmarkService.findBookmarksByTagsUid(tagsUidList);
    }
}
