package com.bookmark.rest.service;

import com.bookmark.domain.Bookmark;
import com.bookmark.domain.BookmarkTags;
import com.bookmark.domain.Tags;
import com.bookmark.rest.repository.BookmarkRepository;
import com.bookmark.rest.repository.TagsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BookmarkService {
    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private TagsService tagsService;

    public List<Bookmark> getBookmarks() {
        return bookmarkRepository.findAllWithTags();
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

    public List<Bookmark> findAllBookmarks(String contents) {
        String url = contents;
        String description = contents;
        return bookmarkRepository.findByUrlContainingOrDescriptionContaining(url, description);
    }

    public Tags saveBookmarkTags(Long bookmarkUid, Tags inputTags) {
        Bookmark bookmark = this.getBookmark(bookmarkUid);
        Tags tags = tagsService.getTags(inputTags.getUid());

        BookmarkTags bookmarkTags = new BookmarkTags();
        bookmarkTags.setBookmark(bookmark);
        bookmarkTags.setTags(tags);

        bookmark.getBookmarkTagsList().add(bookmarkTags);

        bookmarkRepository.saveAndFlush(bookmark);

        return tags;
    }
}
