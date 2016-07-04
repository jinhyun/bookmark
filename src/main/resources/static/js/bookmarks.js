var bookmarks = function () {
  var GlobalTagsList = new TagsList(true);

  var showBookmarks = function (data, _bindHbsBookmarks) {
    var bookmarks, template, html;

    bookmarks = { "bookmarks" : data };
    template = Handlebars.compile($("#hbs_bookmarks").html());
    html = template(bookmarks);

    $(".bookmarks_contents").html(html);

    // TODO: refactor
    var bookmark_taggle_div = $(".bookmark_taggle");
    for (var i = 0; i < bookmark_taggle_div.length; i++) {
      var bookmarkTagsList = new TagsList();
      bookmarkTagsList.setTagsList(data[i].tagsList);

      $(bookmark_taggle_div[i]).find("#bookmark_tagsList").val(JSON.stringify(bookmarkTagsList.getTagsList()));

      var taggle = new Taggle(bookmark_taggle_div[i], {
        tags: bookmarkTagsList.getTagsNameList(),
        duplicateTagClass: 'bounce',
        onTagAdd: function(event, tagName) {
          addTag(event, tagName);
        },
        onTagRemove: function(event, tag) {
          removeTag(event, tag);
        }
      });

      $(".taggle_placeholder").hide();    // Temp
    }

    _bindHbsBookmarks();
  };

  var saveBookmarkTags = function (bookmarkUid, tags) {
    return $.ajax({
      url:"/api/bookmarks/" + bookmarkUid + "/tags",
      type: "POST",
      data: JSON.stringify(tags),
      contentType: "application/json"
    });
  };

  var saveTags = function (tagsName) {
    var tags = { name: tagsName };

    return $.ajax({
      url:"/api/tags",
      type: "POST",
      data: JSON.stringify(tags),
      contentType: "application/json"
    });
  };

  var addTag = function (event, inputTagName) {
    var bookmark_tagsList_elem = $(event.path[3]).find("#bookmark_tagsList");

    if (GlobalTagsList.isExistTagsName(inputTagName)) {
      var globalTags, bookmarkUid;
      globalTags = GlobalTagsList.getTagsByTagsName(inputTagName);
      bookmarkUid = $(bookmark_tagsList_elem).data("bookmarkUid");

      saveBookmarkTags(bookmarkUid, globalTags)
        .done(function (tags) {
          showAddTags(bookmark_tagsList_elem, tags);
        });

    } else {
      saveTags(inputTagName)
        .done(function (tags) {
          var bookmarkUid = $(bookmark_tagsList_elem).data("bookmarkUid");

          return saveBookmarkTags(bookmarkUid, tags);

        }).done(function (tags) {
          showAddTags(bookmark_tagsList_elem, tags);

        }).done(function (){
          GlobalTagsList = new TagsList(true);
        });
    }
  };

  var showAddTags = function (elem, tags) {
    var tagsList = new TagsList();
    tagsList.setTagsList(JSON.parse(elem.val()));
    tagsList.addTags(new Tags(tags.uid, tags.name));

    elem.val(JSON.stringify(tagsList.getTagsList()));
  };

  var showRemoveTags = function (elem, removeTags) {
    var tagsListObj = new TagsList();
    tagsListObj.setTagsList(JSON.parse(elem.val()));

    var tagsList = tagsListObj.getTagsList();
    tagsList.forEach(function (tags, i) {
      if (tags.uid == removeTags.uid){
        tagsList.splice(i, 1);
      }
    });

    elem.val(JSON.stringify(tagsList));
  };

  var deleteBookmarkTags = function (bookmarkUid, tagsUid) {
    return $.ajax({
      url:"/api/bookmarks/" + bookmarkUid + "/tags/" + tagsUid,
      type: "DELETE"
    });
  };

  var removeTag = function (event, tag) {
    var bookmark_tagsList_elem, globalTags, bookmarkUid;

    bookmark_tagsList_elem = $(event.path[3]).find("#bookmark_tagsList");
    bookmarkUid = $(bookmark_tagsList_elem).data("bookmarkUid");
    globalTags = GlobalTagsList.getTagsByTagsName(tag);

    deleteBookmarkTags(bookmarkUid, globalTags.uid)
      .done(function (tags) {
        showRemoveTags(bookmark_tagsList_elem, tags);
      });
  };

  var readBookmarks = function (_bindHbsBookmarks) {
    $.ajax({
      type: "GET",
      url: "/api/bookmarks",
      success: function(data) {
        showBookmarks(data, _bindHbsBookmarks);
      },
      error: function() {

      }
    });
  };

  var bindHbsBookmarks = function () {
    $(".btn_update_bookmark").click(function() {
      modalReadBookmark(this);
    });

    $(".btn_delete_bookmark").click(function() {
      deleteBookmark(this);
    });
  };

  var clearInputData = function () {
    $("#input_url").val("");
    $("#input_desc").val("");
  };

  var modalReadBookmark = function (el) {
    var bookmarkUid = $(el).data("bookmarkUid");
    $.ajax({
      type: "GET",
      url: "/api/bookmarks/" + bookmarkUid,
      success: function(data) {
        var template, html;

        template = Handlebars.compile($("#hbs_bookmark_edit").html());
        html = template(data);

        $(".modal_detail_content").html(html);

        $("#btn_updateBookmark").click(function() {
          updateBookmark(this);
        });

        $(".modal").show();
      },
      error: function() {

      }
    });
  };

  var deleteBookmark = function (el) {
    var bookmarkUid = $(el).data("bookmarkUid");

    $.ajax({
      type: "DELETE",
      url: "/api/bookmarks/" + bookmarkUid,
      success: function (data) {
        bookmarks.readBookmarks();
      },
      error: function () {

      }
    });
  };

  var updateBookmark = function (el) {
    var bookmark = {
      uid: $(el).data("bookmarkUid"),
      url: $("#input_update_url").val(),
      description: $("#input_update_desc").val()
    };

    $.ajax({
      type: "PATCH",
      url: "/api/bookmarks",
      data: JSON.stringify(bookmark),
      contentType: "application/json",
      success: function () {
        bookmarks.readBookmarks();
        $(".modal").hide();
      },
      error: function () {

      }
    })
  };

  var bindModal = function() {
    $(".modal_close").click (function() {
      $(".modal").hide();
    });

    window.onclick = function (event) {
      if (event.target == $(".modal")[0]) {
        $(".modal").hide();
      }
    };
  };

  var bindAddBookmark = function () {
    $("#btn_add_bookmark").click(function() {
      var bookmark = {
        url: $("#input_url").val(),
        description: $("#input_desc").val(),
        regDate: new Date()
      };

      $.ajax({
        type: "POST",
        url: "/api/bookmarks",
        data: JSON.stringify(bookmark),
        contentType: "application/json",
        success: function(data) {
          bookmarks.readBookmarks();
          clearInputData();
        },
        error: function() {
          console.log("error");
        }
      })
    });
  };

  var searchBookmark = function (_bindHbsBookmarks) {
    var inputSearch = $("#input_search").val();

    if (inputSearch == '') {
      bookmarks.readBookmarks();

    } else {
      $.ajax({
        url: "/api/search/bookmarks/" + inputSearch,
        type: "GET",
        success: function (data) {
          showBookmarks(data, _bindHbsBookmarks);
        },
        error: function () {
        }
      });
    }
  };

  var bindHeader = function () {
    $("#btn_search_bookmark").click(function () {
      searchBookmark(bindHbsBookmarks);
    });
  };

  return {
    bind: function() {
      bindHeader();
      bindModal();
      bindAddBookmark();
    },

    readBookmarks: function() {
      readBookmarks(bindHbsBookmarks);
    }
  }
}();

bookmarks.bind();
bookmarks.readBookmarks();