package com.bookmark.rest.service;

import com.bookmark.domain.Bookmark;
import com.bookmark.domain.BookmarkTag;
import com.bookmark.domain.Tag;
import com.bookmark.rest.repository.BookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class BookmarkService {
    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private TagService tagService;

    @Autowired
    private LinkService linkService;

    public List<Bookmark> getBookmarks() {
        return bookmarkRepository.findBookmarkListWithTag();
    }

    public Bookmark addBookmark(Bookmark inputBookmark) {
        if (StringUtils.isEmpty(inputBookmark.getTitle())){
            inputBookmark.setTitle(linkService.getTitle(inputBookmark.getUrl()));
        }

        if (inputBookmark.getBookmarkTagList().size() == 0) {
            return bookmarkRepository.save(inputBookmark);

        } else {
            List<BookmarkTag> inputBookmarkTagList = inputBookmark.getBookmarkTagList();
            inputBookmark.setBookmarkTagList(null);
            Bookmark savedBookmark = bookmarkRepository.save(inputBookmark);

            List<BookmarkTag> bookmarkTagList = new ArrayList<>();

            for (BookmarkTag inputBookmarkTag : inputBookmarkTagList) {
                // TODO: change tagUid
                Tag inputTag = inputBookmarkTag.getTag();
                Tag resultTag = tagService.getTagByName(inputTag.getName());

                if (resultTag == null) {
                    Tag tag = new Tag();
                    tag.setName(inputTag.getName());
                    resultTag = tagService.saveTag(tag);
                }

                BookmarkTag bookmarkTag = new BookmarkTag();
                bookmarkTag.setBookmark(savedBookmark);
                bookmarkTag.setTag(resultTag);
                bookmarkTagList.add(bookmarkTag);
            }

            savedBookmark.setBookmarkTagList(bookmarkTagList);

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

    public List<Bookmark> findBookmarkListByUrlDesc(String contents) {
        String url = contents;
        String description = contents;
        return bookmarkRepository.findByUrlContainingOrDescriptionContaining(url, description);
    }

    public Tag addBookmarkTag(Long bookmarkUid, Tag inputTag) {
        Bookmark bookmark = this.getBookmark(bookmarkUid);
        Tag tag = tagService.getTag(inputTag.getUid());

        BookmarkTag bookmarkTag = new BookmarkTag();
        bookmarkTag.setBookmark(bookmark);
        bookmarkTag.setTag(tag);

        bookmark.getBookmarkTagList().add(bookmarkTag);

        bookmarkRepository.saveAndFlush(bookmark);

        return tag;
    }

    public List<Bookmark> findBookmarksByTagUidList(List<Long> tagUidList) {
        if (CollectionUtils.isEmpty(tagUidList)) {
            return this.findBookmarkListByUrlDesc("");
        }
        return bookmarkRepository.findBookmarkListByTagUidList(tagUidList);
    }
}
