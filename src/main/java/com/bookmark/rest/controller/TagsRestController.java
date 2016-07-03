package com.bookmark.rest.controller;

import com.bookmark.domain.Tags;
import com.bookmark.rest.service.TagsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TagsRestController {
    @Autowired
    private TagsService tagsService;

    @GetMapping("/tags")
    public List<Tags> readTags() {
        return tagsService.getTags();
    }

    @PostMapping("/tags")
    public Tags createBookmark(@RequestBody Tags tags) {
        return tagsService.saveTags(tags);
    }
}
