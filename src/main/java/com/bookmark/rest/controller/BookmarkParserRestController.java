package com.bookmark.rest.controller;

import com.bookmark.rest.service.BookmarkParserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;

@RestController
@RequestMapping("/parser")
public class BookmarkParserRestController {
    private static final Logger logger = LoggerFactory.getLogger(BookmarkParserRestController.class);

    @Autowired
    private BookmarkParserService bookmarkParserService;

    @PostMapping("/bookmarks")
    public String addBookmarkFromFile(@RequestParam("filePathName") String filePathName) throws Exception {
        logger.debug(filePathName);

        return bookmarkParserService.addBookmarkFromFile(URLDecoder.decode(filePathName, "UTF-8"));
    }
}
