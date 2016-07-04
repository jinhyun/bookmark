package com.bookmark.rest.service;

import com.bookmark.domain.Bookmark;
import com.bookmark.domain.BookmarkTags;
import com.bookmark.domain.Tags;
import com.bookmark.rest.repository.BookmarkTagsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BookmarkTagsService {
    @Autowired
    private BookmarkTagsRepository bookmarkTagsRepository;

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private TagsService tagsService;

    public BookmarkTags getBookmarkTagsByBookmarkAndTags(Bookmark bookmark, Tags tags) {
        return bookmarkTagsRepository.findByBookmarkAndTags(bookmark, tags);
    }

    public Tags deleteBookmarkTags(Long bookmarkUid, Long inputTags) {
        Bookmark bookmark = bookmarkService.getBookmark(bookmarkUid);
        Tags tags = tagsService.getTags(inputTags);
        BookmarkTags bookmarkTags = this.getBookmarkTagsByBookmarkAndTags(bookmark, tags);

        bookmarkTagsRepository.delete(bookmarkTags.getUid());

        return tags;
    }
}
