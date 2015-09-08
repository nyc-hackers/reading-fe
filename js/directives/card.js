elFrontend.directive("card", function(Article) {
  return {
    restrict: "E",
    templateUrl: "views/_card.html",
    link: function(scope, elem, attrs) {
      elem.bind("click", function(evt) {
        evt.preventDefault();
        cardId = attrs.id;
        success();
        Article.moveToDone(attrs.id).then(success, fail);
      });
    }
  };
});
