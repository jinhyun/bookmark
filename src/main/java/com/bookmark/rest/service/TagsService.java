package com.bookmark.rest.service;

import com.bookmark.domain.Tags;
import com.bookmark.rest.repository.TagsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagsService {
    @Autowired
    protected TagsRepository tagsRepository;

    public List<Tags> getTags() {
        return tagsRepository.findAll();
    }

    public Tags saveTags(Tags tags) {
        return tagsRepository.save(tags);
    }
}
