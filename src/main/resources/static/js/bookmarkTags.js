var Tags = function (uid, name) {
  this.uid = uid;
  this.name = name;
};

Tags.prototype.saveTags = function () {
  var tags = {
    uid: this.uid,
    name: this.name
  };

  $.ajax({
    url: "/api/tags",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(tags),
    success : function(data) {
      return data;
    }
  });
};

// TODO: change extend options
// TODO: option 값에 따라 변수 타입이 private or public 가능?
// (http://stackoverflow.com/questions/9602449/a-javascript-design-pattern-for-options-with-default-values)
var TagsList = function (options) {
  this.tagsList = [] || Tags;   // Tags Type??
  //this.tagsList = [];   // Tags Type??

  if (options == true){
    this._callTagsList();
  }
};

TagsList.prototype._callTagsList = function () {
  var parent = this;

  $.ajax({
    url: "/api/tags",
    type: "GET",
    success : function(data) {
      parent.tagsList = [];

      data.forEach(function (tags) {
        parent.tagsList.push(new Tags(tags.uid, tags.name));
      });

      return parent;
    }
  });
};

TagsList.prototype.getTagsList = function () {
  return this.tagsList;
};

// TODO: tagsList construct
TagsList.prototype.setTagsList = function (tagsList) {
  var parent = this;

  tagsList.forEach(function (tags) {
    parent.tagsList.push(new Tags(tags.uid, tags.name));
  });
};

TagsList.prototype.addTags = function (tags) {
  if ((typeof (tags) == "object")) {
    this.tagsList.push(tags);

  } else {
    throw "tags must be Tags Object";
  }
};

TagsList.prototype.getTagsNameList = function () {
  var tagsList, tagsNameList;
  tagsList = this.tagsList;
  tagsNameList = [];

  tagsList.forEach(function (tags) {
    tagsNameList.push(tags.name);
  });

  return tagsNameList;
};

TagsList.prototype.isExistTagsName = function (inputTagsName) {
  var tagsList, result;
  tagsList = this.getTagsList();
  result = false;

  tagsList.forEach(function (tags) {
    if (tags.name == inputTagsName) {
      result = true;
    }
  });

  return result;
};

TagsList.prototype.getTagsByTagsName = function (inputTagsName) {
  var tagsList, resultTags;
  tagsList = this.getTagsList();

  tagsList.forEach(function (tags, i) {
    if (tags.name == inputTagsName) {
      resultTags = new Tags(tagsList[i].uid, tagsList[i].name);
    }
  });

  return resultTags;
};
