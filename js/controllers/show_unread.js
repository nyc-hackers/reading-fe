elFrontend.controller("showUnread", function($scope, $timeout, Article) {
  $scope.communicatingWithServer = false;
  $scope.unreadArticles = [];
  $scope.articlesRejectedOrAccepted = 0;

  $scope.init = function() {
    $scope.communicatingWithServer = true;
    Article.allUndecided().then(
      //success
      function(resp) {
        console.log("all articles", resp.data);
        $scope.unreadArticles = resp.data;
        $scope.communicatingWithServer = false;
      },
      // failure
      function(data) {
        console.warn("all articles", data);
        $scope.communicatingWithServer = false;
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

  $scope.init();
});
