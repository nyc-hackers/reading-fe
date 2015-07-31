var elFrontend = angular.module("elFrontend", []);

elFrontend.factory('Article', function($http) {
  var allUndecided = function() {
    //return $http.get("https://email-listicle.herokuapp.com/api/v1/email_links/all");
    return $http.get("http://home.bam:4001/api/v1/email_links/all");
  };

  return {
    allUndecided : allUndecided
  };
});

elFrontend.controller("showUnread", function($scope, Article) {
  $scope.unreadArticles = [];

  $scope.init = function() {
    Article.allUndecided().then(
      //success
      function(resp) {
        console.log("all articles", resp.data);
        $scope.unreadArticles = resp.data;
      },
      // failure
      function(data) {
        console.warn("all articles", data);
      }
    );
  };

  $scope.init();
});
