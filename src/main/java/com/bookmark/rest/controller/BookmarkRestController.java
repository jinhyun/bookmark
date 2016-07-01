package com.bookmark.rest.controller;

import com.bookmark.domain.Bookmark;
import com.bookmark.rest.service.BookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BookmarkRestController {
    @Autowired
    private BookmarkService bookmarkService;

    @GetMapping("/bookmarks")
    public List<Bookmark> readBookmarks() {
        return bookmarkService.getBookmarks();
    }

    @GetMapping("/bookmarks/{bookmarkUid}")
    public Bookmark readBookmark(@PathVariable Long bookmarkUid) {
        return bookmarkService.getBookmark(bookmarkUid);
    }

    @PostMapping("/bookmarks")
    public Bookmark createBookmark(@RequestBody Bookmark bookmark) {
        return bookmarkService.saveBookmark(bookmark);
    }

    @PatchMapping("/bookmarks")
    public Bookmark modifyBookmark(@RequestBody Bookmark bookmarkInput) {
        return bookmarkService.modifyBookmark(bookmarkInput);
    }

    @DeleteMapping("/bookmarks/{bookmarkUid}")
    public void deleteBookmark(@PathVariable Long bookmarkUid){
        bookmarkService.deleteBookmark(bookmarkUid);
    }

    @GetMapping("/search/bookmarks/{contents}")
    public List<Bookmark> findAllBookmarks(@PathVariable String contents) {
        return bookmarkService.findAllBookmarks(contents);
    }
}
