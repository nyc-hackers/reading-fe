elFrontend.directive("moveToDoing", function(Article) {
  var cardId = "";
  var success = function(data) {
    console.log("success!");
    $("#" + cardId).addClass("doing");
  };

  var fail = function(resp) {

  };

  return {
    restrict: "A",
    link: function(scope, elem, attrs) {
      elem.bind("click", function(evt) {
        evt.preventDefault();
        cardId = attrs.id;
        success();
        Article.moveToDoing(attrs.id).then(success, fail);
      });
    }
  };
});
