var elFrontend = angular.module("elFrontend", []);
;elFrontend.constant("Backend", {
  host: "https://email-listicle.herokuapp.com/"
});
;elFrontend.factory("Article", function($http, Backend) {
  var host = Backend.host;
  var httpConf = {timeout: 3000};
  var allUndecided = function() {
    //return $http.get("https://email-listicle.herokuapp.com/api/v1/email_links/all");
    return $http.get(host + "/api/v1/email_links/all");
  };

  var addToReadingList = function(id) {
    return $http.post(host + "/api/v1/email_links/mark_for_read",
                      {id: id},
                      httpConf);
  };

  var rejectFromReadingList = function(id) {
    return $http.post(host + "/api/v1/email_links/mark_for_reject",
                      {id: id},
                      httpConf);
  };

  return {
    allUndecided: allUndecided,
    addToReadingList: addToReadingList,
    rejectFromReadingList: rejectFromReadingList
  };
});
;elFrontend.directive("swipableArticle", function(Article) {
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
;elFrontend.controller("showUnread", function($scope, $timeout, Article) {
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
