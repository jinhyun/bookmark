package com.bookmark.rest.controller;

import com.bookmark.domain.Tag;
import com.bookmark.rest.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TagsRestController {
    @Autowired
    private TagService tagService;

    @GetMapping("/tags")
    public List<Tag> readTagList() {
        return tagService.getTagList();
    }

    @PostMapping("/tags")
    public Tag createBookmark(@RequestBody Tag tag) {
        return tagService.saveTag(tag);
    }
}
