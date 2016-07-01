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
      readBookmarks();
      clearInputData();
    },
    error: function() {
      console.log("error");
    }
  })
});

function clearInputData() {
  $("#input_url").val("");
  $("#input_desc").val("");
}

function readBookmarks() {
  $.ajax({
    type: "GET",
    url: "/api/bookmarks",
    success: function(data) {
      var bookmarks = { "bookmarks" : data };
      var template = Handlebars.compile($("#hbs_bookmarks").html());
      var html = template(bookmarks);
      $(".bookmarks_contents").html(html);

      bind();
    },
    error: function() {

    }
  });
}

function readBookmark(el) {
  var bookmarkUid = $(el).data("bookmarkUid");
  $.ajax({
    type: "GET",
    url: "/api/bookmarks/" + bookmarkUid,
    success: function(data) {
      var template = Handlebars.compile($("#hbs_bookmark_edit").html());
      var html = template(data);

      $(".modal_detail_content").html(html);

      $("#btn_updateBookmark").click(function() {
        updateBookmark(this);
      });

      $(".modal").show();
    },
    error: function() {

    }
  });
}

function deleteBookmark(el) {
  var bookmarkUid = $(el).data("bookmarkUid");
  $.ajax({
    type: "DELETE",
    url: "/api/bookmarks/" + bookmarkUid,
    success: function(data) {
      readBookmarks();
    },
    error: function() {

    }
  });
}

function updateBookmark(el) {
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
    success: function() {
      readBookmarks();
      $(".modal").hide();
    },
    error: function() {

    }
  })
}

function bind() {
  $(".btn_update_bookmark").click(function() {
    readBookmark(this);
  });

  $(".btn_delete_bookmark").click(function() {
    deleteBookmark(this);
  });

  $(".modal_close").click (function() {
    $(".modal").hide();
  });

  window.onclick = function (event) {
    if (event.target == $(".modal")[0]) {
      $(".modal").hide();
    }
  };
}