elFrontend.directive("colorSelector", function(Article) {
  return {
    restrict: "A",
    scope: {
      labelColor: "@"
    },
    require: "^^card",
    link: function(scope, elem, attrs, cardCtrl) {
      elem.bind("click", function(evt) {
        evt.preventDefault();
        cardCtrl.hideCard();

        Article.applyLabelToCard(cardCtrl.card.id, scope.labelColor).
          then(angular.noop(),
               function(resp) {
                 cardCtrl.showCard();
               });
      });
    }
  };
});
