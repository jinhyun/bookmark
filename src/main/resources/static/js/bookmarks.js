var Tag = function (uid, name) {
  this.uid = uid;
  this.name = name;
};

var bookmarks = function () {
  var callApiFindBookmarkListByUrlDescTitleTagUidList = function (val, tagUidList) {
    return $.ajax({
      type: "GET",
      url: "/api/search/bookmarks/contents/" + val + "/tags/" + tagUidList
    });
  };

  var callApiFindBookmarkListByUrlDescTitle = function (val) {
    return $.ajax({
      type: "GET",
      url: "/api/search/bookmarks/contents/" + val
    });
  };

  var callApiFindBookmarkListByTagUidList = function (tagUidList) {
    return $.ajax({
      type: "GET",
      url: "/api/search/bookmarks/tags/" + tagUidList
    });
  };

  var callApiReadBookmarkList = function () {
    return $.ajax({
      type: "GET",
      url: "/api/bookmarks"
    });
  };

  var callApiReadTagList = function () {
    return $.ajax({
      type: "GET",
      url: "/api/tags"
    });
  };

  var callApiReadTagByName = function (tagName) {
    return $.ajax({
      type: "GET",
      url: "/api/tags/" + tagName
    });
  };

  var callApiAddTag = function (tagsName) {
    var tags = new Tag(null, tagsName);

    return $.ajax({
      type: "POST",
      url: "/api/tags",
      data: JSON.stringify(tags),
      contentType: "application/json"
    });
  };

  var callApiRemoveBookmarkTag = function (bookmarkUid, tagsUid) {
    return $.ajax({
      type: "DELETE",
      url:"/api/bookmarks/" + bookmarkUid + "/tags/" + tagsUid
    });
  };

  var callApiAddBookmarkTag = function (bookmarkUid, tagsName) {
    var tags = new Tag(null, tagsName);

    return $.ajax({
      type: "POST",
      url:"/api/bookmarks/" + bookmarkUid + "/tags",
      data: JSON.stringify(tags),
      contentType: "application/json"
    });
  };

  var callApiReadBookmark = function (bookmarkUid) {
    return $.ajax({
      type: "GET",
      url: "/api/bookmarks/" + bookmarkUid
    });
  };

  var callApiRemoveBookmark = function (bookmarkUid) {
    return $.ajax({
      type: "DELETE",
      url: "/api/bookmarks/" + bookmarkUid
    });
  };

  var callApiModifyBookmark = function (bookmark) {
    return $.ajax({
      type: "PATCH",
      url: "/api/bookmarks",
      data: JSON.stringify(bookmark),
      contentType: "application/json"
    });
  };

  var callApiAddBookmark = function (bookmark) {
    return $.ajax({
      type: "POST",
      url: "/api/bookmarks",
      data: JSON.stringify(bookmark),
      contentType: "application/json"
    });
  };

  var callApiAddBookmarkFromFile = function (bookmarkFilePath) {
    return $.ajax({
      type: "POST",
      url: "/parser/bookmarks",
      data: { filePathName: bookmarkFilePath }
    });
  };

  var callApiSearchType = function () {
    var tagUidList, searchContents;

    searchContents = $("#input_search").val();
    tagUidList = $("aside.search_tag_list").find(".tags").val();

    if (tagUidList && searchContents) {
      return callApiFindBookmarkListByUrlDescTitleTagUidList(searchContents, tagUidList);

    } else if (tagUidList) {
      return callApiFindBookmarkListByTagUidList(tagUidList);

    } else if (searchContents) {
      return callApiFindBookmarkListByUrlDescTitle(searchContents);

    } else {
      return callApiReadBookmarkList();
    }
  };

  var searchReadTagList = function () {
    callApiReadTagList().done(function (data) {
      var template, tagList, html, contentsElem;

      tagList = { tagList: data };

      template = Handlebars.compile($("#search_tag_list_hbs_template").html());
      html = template(tagList);
      contentsElem = $("aside.search_tag_list").find(".menu");
      contentsElem.html(html);

      $("aside.search_tag_list > .ui.dropdown").dropdown({
        onChange: function (value, text, elem){
          // TODO: refactor setA
          $.when(callApiSearchType(), callApiReadTagList()).done(function (bookmarkListObj, tagListObj){
            showBookmarkList(bookmarkListObj[0], tagListObj[0]);

          }).done(function () {
            bindDropdownHbs();
            bindBtnBookmarksHbs();
            $('.table').tablesort();
          });
        }
      });
    });
  };

  var readBookmarkList = function () {
    // TODO: refactor setA
    $.when(callApiReadBookmarkList(), callApiReadTagList()).done(function (bookmarkListObj, tagListObj){
      showBookmarkList(bookmarkListObj[0], tagListObj[0]);

    }).done(function () {
      bindDropdownHbs();
      bindBtnBookmarksHbs();
      $('.table').tablesort();
    });
  };

  var bindBtnBookmarksHbs = function () {
    $(".btn_update_bookmark").click(function () {
      showModalBookmarkEdit(this);
    });

    $(".btn_modal_delete_bookmark").click(function () {
      document.querySelector(".btn_delete_bookmark").dataset.bookmarkUid = this.dataset.bookmarkUid;
      $('.delete_msg').modal('show');
    });
  };

  var showBookmarkList = function (bookmarkList, tagList) {
    var bookmarks, template, html, contentsElem;

    for (var i = 0; i < bookmarkList.length; i++) {
      bookmarkList[i].menuTagList = tagList;
    }

    bookmarks = {bookmarks: bookmarkList};

    template = Handlebars.compile($("#hbs_bookmarks").html());
    Handlebars.registerPartial("menuTag", $("#tag_list_hbs_partial").html());
    html = template(bookmarks);

    contentsElem = $(".bookmarks");
    contentsElem.html(html);
    contentsElem.show();
  };

  var removeElemBookmarksTagsLabel = function (elem, tagsName) {
    var labelElem = $(elem).parent().parent().find(".bookmarks_tags_label").children();

    for (var i = 0; i < labelElem.length; i++) {
      if ($(labelElem[i]).text() == tagsName) {
        $(labelElem[i]).remove();
      }
    }
  };

  var addElemBookmarksTagsLabel = function (elem , tag) {
    var labelElem, addElem;

    labelElem = $(elem).parent().parent().find(".bookmarks_tags_label");
    addElem = "<div class='ui small label' style='margin-bottom: 5px' data-value='"+tag.uid+"'>"+tag.name+"</div>";

    labelElem.append(addElem);
  };

  var bindDropdownHbs = function () {
    $('.bookmarks_tags_dropdown > .ui.dropdown').dropdown({
      allowAdditions: true,

      onAdd: function(value, text) {
        addTag(this, value, text);
      },

      // issue: 태그를 입력한 후에 바로 삭제시 text와 tagElem 모두 undefined
      onRemove: function (value, text, tagElem) {
        removeTag(this, value, tagElem);
      }
    });
  };

  var appendElemAnotherMenuTag = function (elem, value, text) {
    var bookmarkUid, bookmarkTagsDropdownElem, menuTagElem;

    bookmarkUid = elem.dataset.bookmarkUid;
    bookmarkTagsDropdownElem = $('.bookmarks_tags_dropdown');

    for (var i = 0; i < bookmarkTagsDropdownElem.length; i++) {
      if (bookmarkUid != bookmarkTagsDropdownElem[i].dataset.bookmarkUid) {
        menuTagElem = "<div class='item' data-value='"+ value + "'>" + text + "</div>";
        $(bookmarkTagsDropdownElem[i]).find('.menu').append(menuTagElem);
      }
    }
  };

  var addTag = function (elem, value, text) {
    var bookmarkUid;

    bookmarkUid = $(elem).data("bookmarkUid");

    callApiAddBookmarkTag(bookmarkUid, text)
      .done(function (tag) {
        appendElemAnotherMenuTag(elem, value, text);
        addElemBookmarksTagsLabel(elem, tag);
      });
  };

  /*
   input hidden tag value
    new tag 는 text
    saved tag 는 uid
   */
  // issue: 태그를 입력한 후에 바로 삭제시 text와 tagElem 모두 undefined
  var removeTag = function (elem, value, tagElem) {
    var bookmarkUid, tagName;

    bookmarkUid = $(elem).data("bookmarkUid");

    if (tagElem) {
      // saved tag
      tagName = tagElem[0].innerText;

    } else {
      // new tag
      tagName = value;
    }

    callApiReadTagByName(tagName).done(function(tag) {
      callApiRemoveBookmarkTag(bookmarkUid, tag.uid);
      removeElemBookmarksTagsLabel(elem, tagName);
    })
  };

  var initInputData = function () {
    $("#input_url").val("");
    $("#input_desc").val("");
    $('.input_tags_dropdown > .ui.dropdown').dropdown("clear");
  };

  var showModalBookmarkEdit = function (elem) {
    var bookmarkUid = $(elem).data("bookmarkUid");

    // TODO: refactor setA
    $.when(callApiReadBookmark(bookmarkUid), callApiReadTagList()).done(function (bookmarkObj, tagListObj){
      var template, html, modalElem, data;

      data = {
        addEdit : "Edit",
        url: bookmarkObj[0].url,
        description: bookmarkObj[0].description,
        tagList: bookmarkObj[0].tagList,
        menuTagList: tagListObj[0]
      };

      template = Handlebars.compile($("#hbs_add_bookmark_modal").html());
      Handlebars.registerPartial("menuTag", $("#tag_list_hbs_partial").html());

      html = template(data);
      modalElem = $(".add_bookmark_modal");

      modalElem.html(html);
      modalElem.modal('show');

      bindInputTagsDropdownHbs();
      $(".btn_edit_bookmark").removeClass("hidden");

      $(".btn_edit_bookmark").click(function () {
        updateBookmark(bookmarkUid);
      });
    });
  };

  var bindInputTagsDropdownHbs = function () {
    $('.input_tags_dropdown > .ui.dropdown').dropdown({
      allowAdditions: true
    });
  };

  var deleteBookmark = function (bookmarkUid) {
    callApiRemoveBookmark(bookmarkUid).done(function () {
      readBookmarkList();
    });
  };

  var updateBookmark = function (bookmarkUid) {
    var bookmark = createBookmarkObj();
    bookmark.uid = bookmarkUid;

    callApiModifyBookmark(bookmark).done(function () {
      $(".add_bookmark_modal").modal("hide");
      readBookmarkList();
    });
  };

  var createBookmarkObj = function () {
    var bookmarkTagList, selectedTagListElem;

    selectedTagListElem = $(".input_tags_dropdown").find("a");
    bookmarkTagList = [];

    for (var i = 0; i < selectedTagListElem.length; i++) {
      var bookmarkTag, tagName;

      tagName = selectedTagListElem[i].innerText;
      bookmarkTag = {
        tag: {
          name: tagName
        }
      };

      bookmarkTagList.push(bookmarkTag);
    }

    return {
      url: $("#input_url").val(),
      description: $("#input_desc").val(),
      regDate: new Date(),
      bookmarkTagList: bookmarkTagList
    };
  };

  var addBookmark = function () {
    var bookmark = createBookmarkObj();

    callApiAddBookmark(bookmark).done(function() {
      readBookmarkList();

    }).done(function() {
      initInputData();

      if (!$(".add_continue").is(":checked")) {
        $(".add_bookmark_modal").modal("hide");
      }
    });
  };

  var showModalBookmarkNew = function () {
    callApiReadTagList().done(function (tagList) {
      var template, html, modalElem, data;

      data = {
        addEdit : "Add",
        menuTagList: tagList
      };

      template = Handlebars.compile($("#hbs_add_bookmark_modal").html());
      Handlebars.registerPartial("menuTag", $("#tag_list_hbs_partial").html());
      html = template(data);
      modalElem = $(".add_bookmark_modal");

      modalElem.html(html);
      modalElem.modal('show');

      bindInputTagsDropdownHbs();
      $(".btn_add_continue").removeClass("hidden");
      $(".btn_add_bookmark").removeClass("hidden");

      $(".btn_add_bookmark").click(function () {
        addBookmark();
      });
    });
  };

  var searchKeyup = function () {
    var timer;
    $("#input_search").keyup(function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        searchBookmark();
      }, 200);
    });
  };

  var searchBookmark = function () {
    // TODO: refactor setA
    $.when(callApiSearchType(), callApiReadTagList()).done(function (bookmarkListObj, tagListObj){
      showBookmarkList(bookmarkListObj[0], tagListObj[0]);

    }).done(function () {
      bindDropdownHbs();
      bindBtnBookmarksHbs();
      $('.table').tablesort();
    });
    //}
  };

  var showModalLoadBookmarkFile = function () {
    var template, html, modalElem;

    template = Handlebars.compile($("#hbs_import_bookmark_file").html());
    html = template();

    modalElem = $(".load_bookmark");
    modalElem.html(html);
    modalElem.modal('show');

    $(".btn_import_bookmark_file").click(function () {
      loadBookmarkFile();
    });
  };

  var bindBtn = function () {
    $("#btn_search_bookmark").click(function () {
      searchBookmark();
    });

    $("#btn_modal_load_bookmark").click(function () {
      showModalLoadBookmarkFile();
    });

    $(".search_bookmark").keypress(function( event ) {
      if ( event.which == 13 ) {
        searchBookmark();
      }
    });

    $(".input_search_delete").click(function () {
      $("#input_search").val("");
      searchBookmark();
    });

    $(".modal_close").click (function () {
      $(".modal").hide();
    });

    window.onclick = function (event) {
      if (event.target == $(".modal")[0]) {
        $(".modal").hide();
      }
    };

    $(".btn_modal_add_bookmark").click(function () {
      showModalBookmarkNew();
    });

    $(".btn_edit_read_tags").click(function () {
      $('.bookmarks_tags_label').toggleClass("hidden");
      $('.bookmarks_tags_dropdown').toggleClass("hidden");
    });

    $(".btn_delete_bookmark").click(function () {
      deleteBookmark(this.dataset.bookmarkUid);
    });
  };

  var loadBookmarkFile = function () {
    var bookmarkFilePath = $("#bookmark_file_path").val();

    callApiAddBookmarkFromFile(bookmarkFilePath).done(function (data) {
      alert(data);
      $(".load_bookmark").modal('hide');
      readBookmarkList();
    });
  };

  return {
    bind: function () {
      bindBtn();
    },

    readInitData: function () {
      readBookmarkList();
      searchReadTagList();
      searchKeyup();
    }
  }
}();

bookmarks.bind();
bookmarks.readInitData();