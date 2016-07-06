package com.bookmark.rest.service;

import com.bookmark.domain.Bookmark;
import com.bookmark.domain.BookmarkTags;
import com.bookmark.domain.Tags;
import com.bookmark.rest.repository.BookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Collection;
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

    public Bookmark addBookmark(Bookmark inputBookmark) {
        if (inputBookmark.getBookmarkTagsList().size() == 0) {
            return bookmarkRepository.save(inputBookmark);

        } else {
            List<BookmarkTags> inputBookmarkTagsList = inputBookmark.getBookmarkTagsList();
            inputBookmark.setBookmarkTagsList(null);
            Bookmark savedBookmark = bookmarkRepository.save(inputBookmark);

            List<BookmarkTags> bookmarkTagsList = new ArrayList<>();

            for (BookmarkTags inputBookmarkTags : inputBookmarkTagsList) {
                Tags inputTags = inputBookmarkTags.getTags();
                Tags resultTags = tagsService.getTagsByName(inputTags.getName());

                if (resultTags == null) {
                    Tags tags = new Tags();
                    tags.setName(inputTags.getName());
                    resultTags = tagsService.saveTags(tags);
                }

                BookmarkTags bookmarkTags = new BookmarkTags();
                bookmarkTags.setBookmark(savedBookmark);
                bookmarkTags.setTags(resultTags);
                bookmarkTagsList.add(bookmarkTags);
            }

            savedBookmark.setBookmarkTagsList(bookmarkTagsList);

            return bookmarkRepository.saveAndFlush(savedBookmark);
        }
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

    public void removeBookmark(Long bookmarkUid) {
        bookmarkRepository.delete(bookmarkUid);
    }

    public List<Bookmark> findAllBookmarks(String contents) {
        String url = contents;
        String description = contents;
        return bookmarkRepository.findByUrlContainingOrDescriptionContaining(url, description);
    }

    public Tags addBookmarkTags(Long bookmarkUid, Tags inputTags) {
        Bookmark bookmark = this.getBookmark(bookmarkUid);
        Tags tags = tagsService.getTags(inputTags.getUid());

        BookmarkTags bookmarkTags = new BookmarkTags();
        bookmarkTags.setBookmark(bookmark);
        bookmarkTags.setTags(tags);

        bookmark.getBookmarkTagsList().add(bookmarkTags);

        bookmarkRepository.saveAndFlush(bookmark);

        return tags;
    }

    public List<Bookmark> findBookmarksByTagsUid(List<Long> tagsUidList) {
        if (CollectionUtils.isEmpty(tagsUidList)) {
            return this.findAllBookmarks("");
        }
        return bookmarkRepository.findBookmarksByTagsUid(tagsUidList);
    }
}
