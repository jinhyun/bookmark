var Tags = function (uid, name) {
  this.uid = uid;
  this.name = name;
};

var bookmarks = function () {
  var readCentralTagsList = function () {
    $.ajax({
      type: "GET",
      url: "/api/tags"

    }).done(function (tagsList) {
      setCentralTagsList(tagsList);
    });
  };

  var setCentralTagsList = function (inputTagsList) {
    var tagsList = (inputTagsList) ? JSON.stringify(inputTagsList) : "";

    $("#central_tags_list").val(tagsList);
  };

  var readBookmarks = function () {
    $.ajax({
      type: "GET",
      url: "/api/bookmarks"

    }).done(function (data) {
      showBookmarks(data);

    }).done(function () {
      bindHbsBookmarks();
    });
  };

  var showBookmarks = function (data) {
    var bookmarks, template, html, contentsElem;

    bookmarks = { "bookmarks" : data };
    template = Handlebars.compile($("#hbs_bookmarks").html());
    html = template(bookmarks);
    contentsElem = $(".bookmarks_contents");

    contentsElem.html(html);
    taggle($(".bookmark_taggle"));
    contentsElem.show();
  };

  var taggle = function (elem) {
    elem.tagit({
      afterTagAdded: function(event, ui) {
        if (!ui.duringInitialization) {
          //console.log("afterTagAdded: " + elem.tagit('tagLabel', ui.tag));
          addTag(this, elem.tagit('tagLabel', ui.tag));
        }
      },
      onTagClicked: function(evt, ui) {
        //console.log("onTagClicked: " + elem.tagit('tagLabel', ui.tag));
      },
      afterTagRemoved: function(evt, ui) {
        //console.log('afterTagRemoved: ' + elem.tagit('tagLabel', ui.tag));
        removeTag(this, elem.tagit('tagLabel', ui.tag))
      }
    });
  };

  var addTag = function (elem, tagsName) {
    var centralTagsUid, bookmarkUid;

    centralTagsUid = getCentralTagsUidByName(tagsName);
    bookmarkUid = $(elem).data("bookmarkUid");

    if (centralTagsUid) {
      saveBookmarkTags(bookmarkUid, centralTagsUid);

    } else {
      saveTags(tagsName)
        .done(function (tags) {
          return addCentralTagsList(tags);
        })
        .done(function (tags) {
          saveBookmarkTags(bookmarkUid, tags.uid);
        });
    }
  };

  var addCentralTagsList = function (tags) {
    var centralTagsList, centralTAgsListElem;

    centralTagsList = [];
    centralTAgsListElem = $("#central_tags_list");

    if (centralTAgsListElem.val()) {
      centralTagsList = JSON.parse(centralTAgsListElem.val());
    }

    centralTagsList.push(tags);
    centralTAgsListElem.val(JSON.stringify(centralTagsList));

    return tags;
  };

  var removeTag = function (elem, tagName) {
    var centralTagsUid, bookmarkUid;

    centralTagsUid = getCentralTagsUidByName(tagName);
    bookmarkUid = $(elem).data("bookmarkUid");

    deleteBookmarkTags(bookmarkUid, centralTagsUid);
  };

  var saveTags = function (tagsName) {
    var tags = new Tags(null, tagsName);

    return $.ajax({
      url:"/api/tags",
      type: "POST",
      data: JSON.stringify(tags),
      contentType: "application/json"
    });
  };

  var saveBookmarkTags = function (bookmarkUid, tagsUid) {
    var tags = new Tags(tagsUid, null);

    return $.ajax({
      url:"/api/bookmarks/" + bookmarkUid + "/tags",
      type: "POST",
      data: JSON.stringify(tags),
      contentType: "application/json"
    });
  };

  var getCentralTagsUidByName = function (inputTagsName) {
    if (!$("#central_tags_list").val()) {
      return "";
    }

    var centralTagsList, tagsUid;
    centralTagsList = JSON.parse($("#central_tags_list").val());

    for (var i in centralTagsList) {
      if (centralTagsList[i].name == inputTagsName) {
        return tagsUid = centralTagsList[i].uid;
      }
    }

    return "";
  };

  var deleteBookmarkTags = function (bookmarkUid, tagsUid) {
    return $.ajax({
      url:"/api/bookmarks/" + bookmarkUid + "/tags/" + tagsUid,
      type: "DELETE"
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
    },

    readInitData: function () {
      readCentralTagsList();
      readBookmarks();
    }
  }
}();

bookmarks.bind();
bookmarks.readInitData();