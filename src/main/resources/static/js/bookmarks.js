var bookmarks = function () {
  var readBookmarks = function (_bindHbsBookmarks) {
    $.ajax({
      type: "GET",
      url: "/api/bookmarks",
      success: function(data) {
        var bookmarks, template, html;

        bookmarks = { "bookmarks" : data };
        template = Handlebars.compile($("#hbs_bookmarks").html());
        html = template(bookmarks);
        $(".bookmarks_contents").html(html);

        _bindHbsBookmarks();
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
          var bookmarks, template, html;
          bookmarks = { "bookmarks" : data };
          template = Handlebars.compile($("#hbs_bookmarks").html());
          html = template(bookmarks);

          $(".bookmarks_contents").html(html);

          _bindHbsBookmarks();
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