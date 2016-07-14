package com.bookmark.rest.service;

import com.bookmark.domain.Tag;
import com.bookmark.rest.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TagService {
    @Autowired
    protected TagRepository tagRepository;

    public List<Tag> getTagList() {
        return tagRepository.findAll();
    }

    public Tag saveTag(Tag tag) {
        return tagRepository.save(tag);
    }

    public Tag getTag(Long tagUid) {
        return tagRepository.findOne(tagUid);
    }

    public Tag getTagByName(String tagName) {
        return tagRepository.findByName(tagName);
    }
}
