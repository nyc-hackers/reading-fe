elFrontend.directive("acceptLink", function(Article) {
  return {
    restrict: "A",
    scope: {
      articleId: "@",
      addOrReject: "@"
    },
    link: function(scope, elem, attrs) {
      elem.bind("click", function(evt) {
        evt.preventDefault();

        var articleFunction;
        if (scope.addOrReject === "add") {
          articleFunction = Article.addToReadingList;
        } else {
          articleFunction = Article.rejectFromReadingList;
        }

        articleFunction(scope.articleId).then(
          //success
          function(resp) {
            $(elem).parents(".article").first().remove();
            console.log("article update", resp.data);
          },
          // failure
          function(data) {
            console.warn("article update", data);
          }
        );
      });
    }
  };
});
