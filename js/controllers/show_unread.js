elFrontend.controller("showUnread", function($scope, $timeout, Article) {
  $scope.unreadArticles = [];
  $scope.articlesRejectedOrAccepted = 0;

  $scope.init = function() {
    Article.allUndecided().then(
      //success
      function(resp) {
        $scope.unreadArticles = resp.data;
      },
      // failure
      function(data) {
      }
    );
  };

  $scope.toUpdateCount = function() {
    return $scope.articleIdsToAdd.length + $scope.articleIdsToRemove.length;
  };

  // TODO this is currently broken
  $scope.progressFloat = function() {
    return ($scope.toUpdateCount() / $scope.unreadArticles.length) * 100;
  };

  $scope.addRemoveFromList = function(articleId, add) {
    var prom;
    if (add) {
      prom = Article.addToReadingList(articleId);
    } else {
      prom = Article.rejectFromReadingList(articleId);
    }
    $("#article_" + articleId).fadeOut("fast");
    ++$scope.articlesRejectedOrAccepted;
    prom.then(function() {},
              // error
              function(data) {
                $("#article_" + articleId).fadeIn("fast");
                --$scope.articlesRejectedOrAccepted;
              });
  };
});
