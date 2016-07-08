package com.bookmark.rest.service;

import com.bookmark.domain.BookmarkParser;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.junit.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;

public class BookmarkParserServiceTests {
    private static final Logger logger = LoggerFactory.getLogger(BookmarkParserServiceTests.class);

    private BookmarkParserService bookmarkParserService = new BookmarkParserService();

    private String bookmarkFile;
    private List<String> expectedFolderNameList;

    @Before
    public void setUp() {
        bookmarkFile = "src/test/resources/sample-bookmarks/bookmarks_chrome.html";

        expectedFolderNameList = new ArrayList<>();
        expectedFolderNameList.add("북마크바");
        expectedFolderNameList.add("develop");
        expectedFolderNameList.add("naming");
        expectedFolderNameList.add("api");
        expectedFolderNameList.add("Cocotask");
        expectedFolderNameList.add("webEditor");
        expectedFolderNameList.add("private");
        expectedFolderNameList.add("기타");
        expectedFolderNameList.add("쇼핑");
    }

    @Test
    public void getAllFolderNameTest() throws Exception {
        File input = new File(bookmarkFile);
        Document doc = Jsoup.parse(input, "UTF-8");
        List<String> folderNameList = bookmarkParserService.getAllFolderName(doc);

        assertThat(folderNameList.size(), is(expectedFolderNameList.size()));

        for (int i = 0; i < folderNameList.size(); i++) {
            String folderName = folderNameList.get(i);
            assertThat(folderName, is(expectedFolderNameList.get(i)));
        }

        logger.debug(folderNameList.toString());
    }

    @Test
    public void parserBookmarkForChrome() throws Exception {
        File input = new File(bookmarkFile);
        Document doc = Jsoup.parse(input, "UTF-8");
        List<BookmarkParser> bookmarkParserList = bookmarkParserService.parserBookmarkForChrome(doc);

        assertThat(bookmarkParserList.size(), is(24));
        assertThat(bookmarkParserList.get(7).getTitle(), is("Overview (Java Platform SE 8 )"));
        assertThat(bookmarkParserList.get(7).getFolderNameList().size(), is(3));
        assertThat(bookmarkParserList.get(7).getFolderNameList().get(0), is("api"));
        assertThat(bookmarkParserList.get(7).getFolderNameList().get(1), is("develop"));
        assertThat(bookmarkParserList.get(7).getFolderNameList().get(2), is("북마크바"));
    }
}
