var bookmarks = function () {
  // TODO: refactor naming이 중복됨
  var apiTagsList = new TagsList(true);

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
        onTagAdd: function(event, tag) {
          addTag(event, tag);
        },
        onTagRemove: function(event, tag) {
          removeTag(event, tag);
        }
      });

      $(".taggle_placeholder").hide();    // Temp
    }

    _bindHbsBookmarks();
  };

  var saveBookmarkTags = function (bookmark_taggle_div, tags, _showTags) {
    var tags, bookmarkUid;
    bookmarkUid = $(bookmark_taggle_div).data("bookmarkUid");

    $.ajax({
      url:"/api/bookmarks/" + bookmarkUid + "/tags",
      type: "POST",
      data: JSON.stringify(tags),
      contentType: "application/json",
      success: function (resultTags) {
        if (typeof _showTags != "undefined") {
          return _showTags(resultTags);
        }
      }
    });
  };

  var saveTags = function (inputTagsName) {
    var tags = {
      name: inputTagsName
    };

    var ajax = $.ajax({
      url:"/api/tags",
      type: "POST",
      data: JSON.stringify(tags),
      contentType: "application/json"
    });

    return ajax;
  };

  var getAddedTagsList = function(inputTagsName, bookmark_taggle_div) {
    var tagsList = new TagsList();
    tagsList.setTagsList(JSON.parse(bookmark_taggle_div.val()));

    var _showTags = function (resultTags) {
      tagsList.addTags(new Tags(resultTags.uid, resultTags.name));

      bookmark_taggle_div.val(JSON.stringify(tagsList.getTagsList()));
    };

    if (apiTagsList.isExistTagsName(inputTagsName)) {
      var tags = apiTagsList.getTagsByTagsName(inputTagsName);
      saveBookmarkTags(bookmark_taggle_div, tags, _showTags);

    } else {
      var savedTags = saveTags(inputTagsName);

      savedTags.done(function(tags){
        return saveBookmarkTags(bookmark_taggle_div, tags);

      }).done(function(data){
        _showTags(data);
      });
    }
  };

  // TODO: refactor 복잡함
  var addTag = function (event, inputTagsName) {
    var bookmark_taggle_div;
    bookmark_taggle_div = $(event.path[3]).find("#bookmark_tagsList");

    getAddedTagsList(inputTagsName, bookmark_taggle_div);
  };

  var removeTag = function (event, tag) {
    var bookmark_taggle_div = event.path[3];

    $(bookmark_taggle_div).find("#bookmark_tagsList").val( function( index, val ) {
      var arrayVal = val.split(',');

      for (var i = 0; i < arrayVal.length; i++) {
        if (arrayVal[i] == tag) {
          arrayVal.splice(i, 1);
        }
      }

      return arrayVal.toString();
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