var bookmarks = function () {
  // TODO: refactor naming이 중복됨
  var tagsListObj = new TagsList(true);

  var showBookmarks = function (data, _bindHbsBookmarks) {
    var bookmarks, template, html;

    bookmarks = { "bookmarks" : data };
    template = Handlebars.compile($("#hbs_bookmarks").html());
    html = template(bookmarks);

    $(".bookmarks_contents").html(html);

    // TODO: refactor
    var bookmark_taggle_div = $(".bookmark_taggle");
    for (var i = 0; i < bookmark_taggle_div.length; i++) {
      var tagsList = new TagsList();
      tagsList.setTagsList(data[i].tagsList);

      $(bookmark_taggle_div[i]).find("#bookmark_tagsList").val(JSON.stringify(tagsList.getTagsList()));

      var taggle = new Taggle(bookmark_taggle_div[i], {
        tags: tagsList.getTagsNameList(),
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

  var addTag = function (event, tag) {
    var bookmark_taggle_div = event.path[3];

    $(bookmark_taggle_div).find("#bookmark_tagsList").val( function( index, val ) {
      if (val == '') {
        return tag;

      } else {
        return val + "," + tag;
      }
    });
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