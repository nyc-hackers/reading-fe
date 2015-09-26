var elFrontend = angular.module("elFrontend", ["ui.router"]);

elFrontend.config(function($stateProvider, $urlRouterProvider,
                           $locationProvider) {
  // For any unmatched url, redirect to /state1
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/");
  // Now set up the states
  $stateProvider
  .state("undecided", {
    url: "/",
    templateUrl: "/views/_undecided_articles.html"
  })
  .state("unlabeled", {
    url: "/unlabeled",
    templateUrl: "/views/_unlabeled.html"
  });
});
;elFrontend.constant("Backend", {
  host: "http://home.bam:4001",
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

  var allUnlabeled = function() {
    return $http.get(host + "/api/v1/cards/unlabeled");
  };

  var applyLabelToCard = function(cardId, labelColor) {
    return $http.put(host + "/api/v1/cards/label", {"card_id": cardId,
                                                    "label_color": labelColor});
  };

  return {
    allUndecided: allUndecided,
    allUnlabeled: allUnlabeled,
    addToReadingList: addToReadingList,
    rejectFromReadingList: rejectFromReadingList,
    applyLabelToCard: applyLabelToCard
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
;elFrontend.directive("colorSelector", function(Article) {
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
;elFrontend.controller("showUnread", function($scope, $timeout, Article) {
  $scope.communicatingWithServer = false;
  $scope.unreadArticles = [];
  $scope.articlesRejectedOrAccepted = 0;

  $scope.init = function() {
    $scope.communicatingWithServer = true;
    Article.allUndecided().then(
      //success
      function(resp) {
        $scope.unreadArticles = resp.data;
        $scope.communicatingWithServer = false;
      },
      // failure
      function(data) {
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
;elFrontend.controller("unlabeled", function($scope, Article) {

  $scope.cardLabels = [
    {name: "Business, Product", color: "orange", hex: "#FF7200"},
    {name: "Data Science", color: "green", hex: "#52a74F"},
    {name: "Programming", color: "yellow", hex: "#FEDF83"}
  ];

  $scope.cards = [];

  $scope.init = function() {
    Article.allUnlabeled().then(
      //success
      function(resp) {
        $scope.cards = resp.data;
      },
      //error
      function(resp) {

      }
    );
  };

  $scope.init();
});
