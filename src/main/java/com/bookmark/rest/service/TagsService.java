package com.bookmark.rest.service;

import com.bookmark.domain.Tags;
import com.bookmark.rest.repository.TagsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TagsService {
    @Autowired
    protected TagsRepository tagsRepository;

    public List<Tags> getTagsList() {
        return tagsRepository.findAll();
    }

    public Tags saveTags(Tags tags) {
        return tagsRepository.save(tags);
    }

    public Tags getTags(Long tagsUid) {
        return tagsRepository.findOne(tagsUid);
    }

    public Tags getTagsByName(String tagsName) {
        return tagsRepository.findByName(tagsName);
    }
}
