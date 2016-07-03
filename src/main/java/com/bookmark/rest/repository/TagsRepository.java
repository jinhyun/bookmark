package com.bookmark.rest.repository;

import com.bookmark.domain.Tags;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagsRepository extends JpaRepository<Tags, Long> {
}
