var elFrontend = angular.module("elFrontend", []);

elFrontend.directive('acceptLink', function(Article) {
  return {
    restrict: "A",
    scope : {
      articleId : "@",
      addOrReject : "@"
    },
    link: function(scope, elem, attrs) {
      elem.bind('click', function(evt) {
        evt.preventDefault();

        var articleFunction;
        if(scope.addOrReject == 'add') {
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

elFrontend.factory('Article', function($http) {
  var host = "http://home.bam:4001";
  var allUndecided = function() {
    //return $http.get("https://email-listicle.herokuapp.com/api/v1/email_links/all");
    return $http.get(host + "/api/v1/email_links/all");
  };

  var addToReadingList = function(id) {
    return $http.post(host + "/api/v1/email_links/mark_for_read", {id: id});
  };

  var rejectFromReadingList = function(id) {
    return $http.post(host + "/api/v1/email_links/mark_for_reject", {id: id});
  };

  return {
    allUndecided : allUndecided,
    addToReadingList : addToReadingList,
    rejectFromReadingList : rejectFromReadingList
  };
});

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
    if(add) {
      Article.addToReadingList(articleId);
    } else {
      Article.rejectFromReadingList(articleId);
    }
    $('#article_' + articleId).fadeOut('fast');
  };


  $scope.init();
});
