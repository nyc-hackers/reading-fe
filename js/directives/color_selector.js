elFrontend.directive("colorSelector", function(Article) {
  return {
    restrict: "A",
    scope: {
      cardId: "@",
      labelColor: "@"
    },
    link: function(scope, elem, attrs) {
      elem.bind("click", function(evt) {
        evt.preventDefault();
        $(evt.currentTarget).parents(".card").first().hide();
        Article.applyLabelToCard(scope.cardId, scope.labelColor).then(
          function() {},
          // error
          function() {
            $(evt.currentTarget).parents(".card").first().show();
          }
        );
      });
    }
  };
});
