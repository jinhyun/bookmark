package com.bookmark.rest.service;

import com.bookmark.domain.Bookmark;
import com.bookmark.domain.BookmarkParser;
import com.bookmark.domain.BookmarkTag;
import com.bookmark.domain.Tag;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class BookmarkParserService {
    private static final Logger logger = LoggerFactory.getLogger(BookmarkParserService.class);

    @Autowired
    private TagService tagService;

    @Autowired
    private BookmarkService bookmarkService;


    public String addBookmarkFromFile(String filePathName) throws Exception {
        File input = new File(filePathName);
        Document doc = Jsoup.parse(input, "UTF-8");

        List<String> folderNameList = this.getAllFolderName(doc);
        List<BookmarkParser> bookmarkParserList = this.parserBookmarkForChrome(doc);

        for (String folderName : folderNameList) {
            Tag tag = new Tag();
            tag.setName(folderName);

            tagService.saveTag(tag);
        }

        for (BookmarkParser bookmarkParser : bookmarkParserList) {
            List<String> bookmarkFolderNameList = bookmarkParser.getFolderNameList();
            List<BookmarkTag> bookmarkTagList = new ArrayList<>();

            for (String tagName : bookmarkFolderNameList) {
                BookmarkTag bookmarkTag = new BookmarkTag();
                bookmarkTag.setTag(tagService.getTagByName(tagName));

                bookmarkTagList.add(bookmarkTag);
            }

            Bookmark bookmark = new Bookmark();
            bookmark.setUrl(bookmarkParser.getUrl());
            bookmark.setTitle(bookmarkParser.getTitle());
            bookmark.setDescription("");
            bookmark.setRegDate(new Date());
            bookmark.setBookmarkTagList(bookmarkTagList);

            bookmarkService.addBookmark(bookmark);
        }

        return "success";
    }

    public List<String> getAllFolderName(Document doc) {
        List<String> folderNameList = new ArrayList<>();
        Elements folderElems = doc.getElementsByTag("h3");

        for (Element element : folderElems) {
            folderNameList.add(element.text());
        }

        return folderNameList;
    }

    /*
    [Netscape Bookmark File Format]
        <DT><H3 ADD_DATE="{date}" LAST_MODIFIED="{date}">{folderName}</H3>
        <DL><p>
            <DT>
                <A HREF="{url}" SHORTCUTURL="{keyword}" ICON="{data:icon}" ADD_DATE="{date}" LAST_MODIFIED="{date}" LAST_VISIT="{date}" ID="{rdf:id}">{title}</A>
        </DL>

    [Jsoup Element Structure]
        a > dt > dl > dt h3
    */
    public List<BookmarkParser> parserBookmarkForChrome(Document doc) {
        List<BookmarkParser> bookmarkParserList = new ArrayList<>();

        // find bookmark
        Elements bookmarkList = doc.select("a[href]");
        for (Element bookmark : bookmarkList) {
            String url = bookmark.attr("href");
            String title = bookmark.text();

            // find bookmark folder
            List<String> bookmarkFolderList = new ArrayList<>();
            Elements parentsElemList = bookmark.parents();

            for(Element parentElem : parentsElemList) {
                Elements childrenElemList = parentElem.children();

                for (int i = 0; i < childrenElemList.size(); i++) {
                    Element childrenElem = childrenElemList.get(i);
                    Node childrenNode = childrenElemList.get(i);

                    if (childrenNode.nodeName().equals("h3")) {
                        bookmarkFolderList.add(childrenElem.text());
                    }
                }
            }

            BookmarkParser bookmarkParser = new BookmarkParser(url, title, bookmarkFolderList);
            bookmarkParserList.add(bookmarkParser);
        }

        return bookmarkParserList;
    }
}
