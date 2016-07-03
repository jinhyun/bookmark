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

TagsList.prototype.setTagsList = function (tagsList) {
  var parent = this;

  tagsList.forEach(function (tags) {
    parent.tagsList.push(new Tags(tags.uid, tags.name));
  });
};

TagsList.prototype.getTagsNameList = function () {
  var tagsList = this.tagsList;
  var tagsNameList = [];

  tagsList.forEach(function (tags) {
    tagsNameList.push(tags.name);
  });

  return tagsNameList;
};

TagsList.prototype.isExistTagsUid = function (tagsUid) {
  var tagsList = this.getTagsList();

  tagsList.forEach(function (tags) {
    return (tags.uid == tagsUid);
  });
};
