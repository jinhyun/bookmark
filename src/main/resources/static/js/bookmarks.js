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

    }).done(function () {
      createAddBookmarkTaggle();

    }).done(function () {
      createSearchTagsListTaggle();
    });
  };

  var createSearchTagsListTaggle = function () {
    addSearchTagsListTaggle($(".search_tagsList_taggle"));
  };

  var setCentralTagsList = function (inputTagsList) {
    var tagsList = (inputTagsList) ? JSON.stringify(inputTagsList) : "";

    $("#central_tags_list").val(tagsList);
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

  var getCentralTagsUidByName = function (inputTagsName) {
    var centralTagsList, tagsUid, strCentralTagsList;

    strCentralTagsList = $("#central_tags_list").val();

    if (!strCentralTagsList) {
      return "";
    }

    centralTagsList = JSON.parse(strCentralTagsList);

    for (var i in centralTagsList) {
      if (centralTagsList[i].name == inputTagsName) {
        return tagsUid = centralTagsList[i].uid;
      }
    }

    return "";
  };

  var getCentralTagsList = function () {
    var strCentralTagsList, centralTagsListObj, centralTagsList;

    strCentralTagsList = $("#central_tags_list").val();
    centralTagsList = [];

    if (strCentralTagsList) {
      centralTagsListObj = JSON.parse(strCentralTagsList);

      for (var i in centralTagsListObj){
        centralTagsList.push(centralTagsListObj[i].name);
      }
    }

    return centralTagsList;
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
    contentsElem = $(".bookmarks");

    contentsElem.html(html);
    bookmarksTaggle($(".bookmark_taggle"));
    contentsElem.show();
  };

  var bookmarksTaggle = function (elem) {
    elem.tagit({
      availableTags: getCentralTagsList(),
      autocomplete: { delay: 0, minLength: 1 },
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

  var addBookmarkTaggle = function (elem) {
    elem.tagit({
      availableTags: getCentralTagsList(),
      autocomplete: { delay: 0, minLength: 1 }
    });
  };

  var readBookmarksByTagsName = function (selectedTagElem, inputTagsName) {
    var inputTagsUid, searchTagsUidListElem, strTagsUidList, tagsUidList, toggleElem, isAddTags;

    toggleElem = $(selectedTagElem.tag).toggleClass("checked");
    searchTagsUidListElem = $("#search_tagsUidList");

    isAddTags = (toggleElem.hasClass("checked")) ? true : false;
    inputTagsUid = getCentralTagsUidByName(inputTagsName);
    strTagsUidList = searchTagsUidListElem.val();
    tagsUidList = [];

    if (strTagsUidList) {
      tagsUidList = JSON.parse(strTagsUidList);
    }

    if (isAddTags) {
      tagsUidList.push(inputTagsUid);

    } else {
      for (var i = 0; i < tagsUidList.length; i++){
        if (inputTagsUid == tagsUidList[i]) {
          tagsUidList.splice([i], 1);
        }
      }
    }

    searchTagsUidListElem.val(JSON.stringify(tagsUidList));

    $.ajax({
      type: "POST",
      url: "/api/search/bookmarks/tags",
      data: JSON.stringify(tagsUidList),
      contentType: "application/json"

    }).done(function (data) {
      showBookmarks(data);

    }).done(function () {
      bindHbsBookmarks();
    });
  };

  var addSearchTagsListTaggle = function (elem) {
    elem.tagit({
      readOnly: true,
      onTagClicked: function(evt, ui) {
        //console.log("onTagClicked: " + elem.tagit('tagLabel', ui.tag));
        readBookmarksByTagsName(ui, elem.tagit('tagLabel', ui.tag));
      }
    });

    var tagsList = getCentralTagsList();
    for (var i = 0; i < tagsList.length; i++) {
      elem.tagit("createTag", tagsList[i]);
    }
  };

  var createAddBookmarkTaggle = function () {
    addBookmarkTaggle($(".add_bookmark_taggle"));
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

        }).done(function (tags) {
          saveBookmarkTags(bookmarkUid, tags.uid);

        }).done(function () {
          bookmarksTaggle($(".bookmark_taggle"));
        });
    }
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
    $(".add_bookmark_taggle").tagit("removeAll");
  };

  var modalReadBookmark = function (elem) {
    var bookmarkUid = $(elem).data("bookmarkUid");

    $.ajax({
      type: "GET",
      url: "/api/bookmarks/" + bookmarkUid

    }).done(function (data) {
      showBookmarkEdit(data);

    }).done(function () {
      bindBookmarkEdit();
    });
  };

  var bindBookmarkEdit = function () {
    $("#btn_updateBookmark").click(function () {
      updateBookmark(this);
    });
  };

  var showBookmarkEdit = function (data) {
    var template, html;

    template = Handlebars.compile($("#hbs_bookmark_edit").html());
    html = template(data);

    $(".modal_detail_content").html(html);
    $(".modal").show();
  };

  var deleteBookmark = function (elem) {
    var bookmarkUid = $(elem).data("bookmarkUid");

    $.ajax({
      type: "DELETE",
      url: "/api/bookmarks/" + bookmarkUid

    }).done(function () {
      readBookmarks();
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
      contentType: "application/json"

    }).done(function () {
      $(".modal").hide();
      readBookmarks();
    });
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

  var createBookmarkObj = function () {
    var elemList, bookmarkTagsList;

    elemList = $(".add_bookmark_taggle").find("input[name]");
    bookmarkTagsList = [];

    for (var i = 0; i < elemList.length; i++) {
      var tags, bookmarkTags, tagName;

      tagName = $(elemList[i]).val();
      tags = { name : tagName};
      bookmarkTags = { tags : tags };

      bookmarkTagsList.push(bookmarkTags);
    }

    return {
      url: $("#input_url").val(),
      description: $("#input_desc").val(),
      regDate: new Date(),
      bookmarkTagsList: bookmarkTagsList
    };
  };

  var addBookmark = function () {
    var bookmark = createBookmarkObj();

    $.ajax({
      type: "POST",
      url: "/api/bookmarks",
      data: JSON.stringify(bookmark),
      contentType: "application/json"

    }).done(function() {
      readBookmarks();

    }).done(function() {
      clearInputData();
    });
  };

  var bindAddBookmark = function () {
    $("#btn_add_bookmark").click(function () {
      addBookmark();
    });
  };

  // TODO: refactor readBookmarks()
  var searchBookmark = function () {
    var inputSearch = $("#input_search").val();

    if (!inputSearch) {
      readBookmarks();

    } else {
      $.ajax({
        url: "/api/search/bookmarks/" + inputSearch,
        type: "GET"

      }).done(function (data) {
        showBookmarks(data);

      }).done(function () {
        bindHbsBookmarks();
      });
    }
  };

  var bindHeader = function () {
    $("#btn_search_bookmark").click(function () {
      searchBookmark(bindHbsBookmarks);
    });

    $("#btn_modal_load_bookmark").click(function () {
      modalLoadBookmarkFile();
    });
  };

  var modalLoadBookmarkFile = function () {
    var template, html;

    template = Handlebars.compile($("#hbs_load_bookmark_file").html());
    html = template();

    $(".modal_detail_content").html(html);
    $(".modal").show();

    $("#btn_load_bookmark_file").click(function () {
      loadBookmarkFile();
    });
  };

  var loadBookmarkFile = function () {
    var bookmarkFilePath = $("#bookmark_file_path").val();

    $.ajax({
      type: "POST",
      url: "/parser/bookmarks",
      data: { filePathName: bookmarkFilePath }

    }).done(function (data) {
      alert(data);
      $(".modal").hide();
      readBookmarks();
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