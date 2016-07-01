package com.bookmark.rest.service;

import com.bookmark.domain.Bookmark;
import com.bookmark.rest.repository.BookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BookmarkService {
    @Autowired
    private BookmarkRepository bookmarkRepository;

    public List<Bookmark> getBookmarks() {
        return bookmarkRepository.findAll();
    }

    public Bookmark saveBookmark(Bookmark bookmark) {
        return bookmarkRepository.save(bookmark);
    }

    public Bookmark getBookmark(Long uid) {
        return bookmarkRepository.findOne(uid);
    }

    public Bookmark modifyBookmark(Bookmark bookmarkInput) {
        Bookmark bookmark = bookmarkRepository.findOne(bookmarkInput.getUid());
        bookmark.setDescription(bookmarkInput.getDescription());
        bookmark.setUrl(bookmarkInput.getUrl());

        return bookmarkRepository.saveAndFlush(bookmark);
    }

    public void deleteBookmark(Long bookmarkUid) {
        bookmarkRepository.delete(bookmarkUid);
    }
}
