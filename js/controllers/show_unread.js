elFrontend.controller("showUnread", function($scope, $timeout, Article) {
  $scope.communicatingWithServer = false;
  $scope.unreadArticles = [];
  $scope.articleIdsToAdd = [];
  $scope.articleIdsToRemove = [];

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
    if (add) {
      Article.addToReadingList(articleId);
    } else {
      Article.rejectFromReadingList(articleId);
    }
    $("#article_" + articleId).fadeOut("fast");
  };

  $scope.init();
});
