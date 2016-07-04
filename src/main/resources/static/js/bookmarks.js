var bookmarks = function () {
  var GlobalTagsList = new TagsList(true);
  var GlobalInputTaggle;

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
        onTagAdd: function (event, tagName) {
          addTag(event, tagName);
        },
        onTagRemove: function (event, tag) {
          if (typeof event != 'undefined') {
            removeTag(event, tag);
          }
        }
      });

      $(".taggle_placeholder").hide();    // Temp
    }

    _bindHbsBookmarks();
  };

  var bindAddBookmarkTaggle = function () {
    GlobalInputTaggle = new Taggle($(".input_taggle")[0], {
      duplicateTagClass: 'bounce',
      onTagAdd: function (event, tagName) {
        showAddBookmarkTags(tagName);
      },
      onTagRemove: function (event, tagName) {
        if (typeof event != 'undefined') {
          showRemoveBookmarkTags(tagName);
        }
      }
    });

    $(".taggle_placeholder").hide();    // Temp
  };

  var showAddBookmarkTags = function (inputTagName) {
    var inputTagsList, tagsList;

    inputTagsList = $("#input_tagsList").val();

    if (inputTagsList == "") {
      tagsList = [];

    } else {
      tagsList = JSON.parse(inputTagsList);
    }

    tagsList.push(inputTagName);

    $("#input_tagsList").val(JSON.stringify(tagsList));
  };

  var showRemoveBookmarkTags = function (inputTagName) {
    var inputTagsList, tagsList;

    inputTagsList = $("#input_tagsList").val();

    if (inputTagsList != "") {
      tagsList = JSON.parse(inputTagsList.val());
    }

    tagsList.forEach(function (tagName, i) {
      if (tagName == inputTagName) {
        tagsList.splice(i, 1);
      }
    });

    $("#input_tagsList").val(JSON.stringify(tagsList));
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

    if (elem.val() != "") {
      tagsList.setTagsList(JSON.parse(elem.val()));
    }
    tagsList.addTags(new Tags(tags.uid, tags.name));

    elem.val(JSON.stringify(tagsList.getTagsList()));
  };

  var showRemoveTags = function (elem, removeTags) {
    var tagsListObj = new TagsList();

    if (elem.val() != "") {
      tagsListObj.setTagsList(JSON.parse(elem.val()));
    }

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
      success: function (data) {
        showBookmarks(data, _bindHbsBookmarks);
      },
      error: function () {

      }
    });
  };

  var bindHbsBookmarks = function () {
    $(".btn_update_bookmark").click(function () {
      modalReadBookmark(this);
    });

    $(".btn_delete_bookmark").click(function () {
      deleteBookmark(this);
    });
  };

  var clearInputData = function () {
    $("#input_url").val("");
    $("#input_desc").val("");
    $("#input_tagsList").val("");
    GlobalInputTaggle.removeAll();
  };

  var modalReadBookmark = function (el) {
    var bookmarkUid = $(el).data("bookmarkUid");
    $.ajax({
      type: "GET",
      url: "/api/bookmarks/" + bookmarkUid,
      success: function (data) {
        var template, html;

        template = Handlebars.compile($("#hbs_bookmark_edit").html());
        html = template(data);

        $(".modal_detail_content").html(html);

        $("#btn_updateBookmark").click(function () {
          updateBookmark(this);
        });

        $(".modal").show();
      },
      error: function () {

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

  var bindModal = function () {
    $(".modal_close").click (function () {
      $(".modal").hide();
    });

    window.onclick = function (event) {
      if (event.target == $(".modal")[0]) {
        $(".modal").hide();
      }
    };
  };

  var addBookmark = function () {
    var bookmarkTagsList = [];
    var inputTagsList = $("#input_tagsList").val();

    if (inputTagsList != ""){
      JSON.parse(inputTagsList).forEach(function (tagName) {
        var tags, bookmarkTags;

        tags = { name : tagName};
        bookmarkTags = { tags : tags };

        bookmarkTagsList.push(bookmarkTags);
      });
    }

    var bookmark = {
      url: $("#input_url").val(),
      description: $("#input_desc").val(),
      regDate: new Date(),
      bookmarkTagsList: bookmarkTagsList
    };

    $.ajax({
      type: "POST",
      url: "/api/bookmarks",
      data: JSON.stringify(bookmark),
      contentType: "application/json",
      success: function (data) {
        bookmarks.readBookmarks();
        clearInputData();
      },
      error: function () {
        console.log("error");
      }
    })
  };

  var bindAddBookmark = function () {
    $("#btn_add_bookmark").click(function () {
      addBookmark();
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
    bind: function () {
      bindHeader();
      bindModal();
      bindAddBookmark();
      bindAddBookmarkTaggle();
    },

    readBookmarks: function () {
      readBookmarks(bindHbsBookmarks);
    }
  }
}();

bookmarks.bind();
bookmarks.readBookmarks();