elFrontend.directive("swipableArticle", function(Article) {
  return {
    restrict: "A",
    link: function(scope, elem, attrs) {
      elem.bind("swipeleft", function(evt) {
        scope.addRemoveFromList(attrs.articleId, false);
      });

      elem.bind("swiperight", function(evt) {
        scope.addRemoveFromList(attrs.articleId, true);
      });

      elem.bind("click", function(evt) {
      });
    }
  };
});
