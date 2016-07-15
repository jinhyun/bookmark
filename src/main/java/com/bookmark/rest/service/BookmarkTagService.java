package com.bookmark.rest.service;

import com.bookmark.domain.Bookmark;
import com.bookmark.domain.BookmarkTag;
import com.bookmark.domain.Tag;
import com.bookmark.rest.repository.BookmarkTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BookmarkTagService {
    @Autowired
    private BookmarkTagRepository bookmarkTagRepository;

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private TagService tagService;

    public BookmarkTag getBookmarkTagByBookmarkAndTag(Bookmark bookmark, Tag tag) {
        return bookmarkTagRepository.findByBookmarkAndTag(bookmark, tag);
    }

    public Tag removeBookmarkTag(Long bookmarkUid, Long inputTag) {
        Bookmark bookmark = bookmarkService.getBookmark(bookmarkUid);
        Tag tag = tagService.getTag(inputTag);
        BookmarkTag bookmarkTag = this.getBookmarkTagByBookmarkAndTag(bookmark, tag);

        bookmarkTagRepository.delete(bookmarkTag.getUid());

        return tag;
    }

    public void deleteBookmarkTag(Long uid) {
        bookmarkTagRepository.delete(uid);
    }
}
