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
      createDivCentralTagsList(tagsList);

    }).done(function () {
      createAddBookmarkTaggle();
    });
  };

  var createDivCentralTagsList = function (inputTagsList) {
    var tagsList, template, html, contentsElem;

    tagsList = { "tagsList" : inputTagsList };
    template = Handlebars.compile($("#hbs_central_tags_list").html());
    html = template(tagsList);
    contentsElem = $(".central_tags_list");

    contentsElem.html(html);
  };

  var addDivCentralTagsList = function (tags) {
    var tagsList, template, html, contentsElem;

    tagsList = { "tagsList" : tags };
    template = Handlebars.compile($("#hbs_central_tags_list").html());
    html = template(tagsList);
    contentsElem = $(".central_tags_list");
    contentsElem.append(html);
  };

  var setCentralTagsList = function (inputTagsList) {
    var tagsList = (inputTagsList) ? JSON.stringify(inputTagsList) : "";

    $("#central_tags_list_json").val(tagsList);
  };

  var addCentralTagsList = function (tags) {
    var centralTagsList, centralTagsListElem;

    centralTagsList = [];
    centralTagsListElem = $("#central_tags_list_json");

    if (centralTagsListElem.val()) {
      centralTagsList = JSON.parse(centralTagsListElem.val());
    }

    centralTagsList.push(tags);
    centralTagsListElem.val(JSON.stringify(centralTagsList));

    return tags;
  };

  var getCentralTagsUidByName = function (inputTagsName) {
    var centralTagsList, tagsUid, strCentralTagsList;

    strCentralTagsList = $("#central_tags_list_json").val();

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

  // TODO: delete - getCentralTagsUidByName
  var getCentralTagsByName = function (inputTagsName) {
    var centralTagsList, tags, strCentralTagsList;

    strCentralTagsList = $("#central_tags_list_json").val();

    if (!strCentralTagsList) {
      return "";
    }

    centralTagsList = JSON.parse(strCentralTagsList);

    for (var i in centralTagsList) {
      if (centralTagsList[i].name == inputTagsName) {
        return tags = centralTagsList[i];
      }
    }

    return "";
  };

  var getCentralTagsList = function () {
    var strCentralTagsList, centralTagsListObj, centralTagsList;

    strCentralTagsList = $("#central_tags_list_json").val();
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
      setBookmarksTagsFromCentralTags();
      bindHbsBookmarks();

    }).done(function( ) {
      bindDropdown();
      $('.table').tablesort();
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

  var removeBookmarksTagsLabel = function (elem, tagsName) {
    var labelElem = $(elem).parent().parent().find(".bookmarks_tags_label").children();

    for (var i = 0; i < labelElem.length; i++) {
      if ($(labelElem[i]).text() == tagsName) {
        $(labelElem[i]).remove();
      }
    }
  };

  var setBookmarksTagsLabel = function (elem , tags) {
    var labelElem, addElem;

    labelElem = $(elem).parent().parent().find(".bookmarks_tags_label");
    addElem = "<div class='ui small label' style='margin-bottom: 5px' data-value='"+tags.uid+"'>"+tags.name+"</div>";

    labelElem.append(addElem);
  };

  var setBookmarksTagsFromCentralTags = function () {
    var menu, centralTagsElem, centralTagsChildElem;

    menu = $(".bookmarks_tags_dropdown").find(".menu");
    centralTagsElem = $(".central_tags_list");
    centralTagsChildElem = $(".central_tags_list").children();

    for (var i = 0; i < centralTagsChildElem.length; i++) {
      $(centralTagsChildElem[i]).addClass("item");
    }

    for (var j = 0; j < menu.length; j++) {
      $(menu[j]).html(centralTagsElem.html());
    }
  };

  var setInputTagsFromCentralTags = function () {
    var menu, centralTagsElem;

    menu = $(".input_tags_dropdown").find(".menu");
    centralTagsElem = $(".central_tags_list");

    for (var j = 0; j < menu.length; j ++) {
      $(menu[j]).html(centralTagsElem.html());
    }

    $('.input_tags_dropdown > .ui.dropdown').dropdown({
      allowAdditions: true
    });
  };

  var bindDropdown = function () {
    $('.bookmarks_tags_dropdown > .ui.dropdown').dropdown({
      allowAdditions: true,

      onAdd: function(value, text) {
        addTag(this, text);
      },

      onRemove: function (value, text) {
        removeTag(this, text);
        removeBookmarksTagsLabel(this, text);
      }
    });
  };

  var bookmarksTaggle = function (elem) {
    elem.tagit({
      availableTags: getCentralTagsList(),
      autocomplete: { delay: 0, minLength: 1 },
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

  var createAddBookmarkTaggle = function () {
    addBookmarkTaggle($(".add_bookmark_taggle"));
  };

  var addTag = function (elem, tagsName) {
    var bookmarkUid, centralTags;

    centralTags = getCentralTagsByName(tagsName);
    bookmarkUid = $(elem).data("bookmarkUid");

    if (centralTags.uid) {
      saveBookmarkTags(bookmarkUid, centralTags.uid);
      setBookmarksTagsLabel(elem, centralTags);

    } else {
      saveTags(tagsName)
        .done(function (tags) {
          addDivCentralTagsList(tags);
          return addCentralTagsList(tags);

        }).done(function (tags) {
          setBookmarksTagsFromCentralTags();
          setBookmarksTagsLabel(elem, tags);
          saveBookmarkTags(bookmarkUid, tags.uid);
        });
    }
  };

  var removeTag = function (elem, tagName) {
    var centralTags, bookmarkUid;

    centralTags = getCentralTagsByName(tagName);
    bookmarkUid = $(elem).data("bookmarkUid");

    deleteBookmarkTags(bookmarkUid, centralTags.uid);
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

  var bindBtn = function () {
    $(".btn_modal_add_bookmark").click(function () {
      $('.add_bookmark_modal').modal('show');
      setInputTagsFromCentralTags();
    });

    $(".btn_edit_read_tags").click(function () {
      $('.bookmarks_tags_label').toggleClass("hide");
      $('.bookmarks_tags_dropdown').toggleClass("hide");
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

    $(".search_bookmark").keypress(function( event ) {
      if ( event.which == 13 ) {
        searchBookmark(bindHbsBookmarks);
      }
    });

    $(".input_search_delete").click(function () {
      $("#input_search").val("");
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
      bindBtn();
    },

    readInitData: function () {
      readCentralTagsList();
      readBookmarks();
    }
  }
}();

bookmarks.bind();
bookmarks.readInitData();