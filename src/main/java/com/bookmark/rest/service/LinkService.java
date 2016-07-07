package com.bookmark.rest.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

@Service
public class LinkService {
    public String getTitle(String url) {
        String title = "";

        try {
            Document doc = Jsoup.connect(url).get();
            title = doc.title();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return title;
    }
}
