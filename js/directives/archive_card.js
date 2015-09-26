elFrontend.directive("archiveCard", function(Article) {
  var cardId = "";
  var archiveSuccess = function(data) {
    console.log("success!");
    $("#" + cardId).css("background-color", "red");
  };

  var archiveFail = function(resp) {

  };

  return {
    restrict: "A",
    link: function(scope, elem, attrs) {
      elem.bind("click", function(evt) {
        evt.preventDefault();
        cardId = attrs.id;
        Article.archiveCard(attrs.id).then(archiveSuccess, archiveFail);
      });
    }
  };
});
