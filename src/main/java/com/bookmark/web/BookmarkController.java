package com.bookmark.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BookmarkController {
    @GetMapping("/")
    public String readBookmarks() {
        return "bookmarks";
    }
}
