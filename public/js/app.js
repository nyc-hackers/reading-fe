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
    templateUrl: "/views/_undecided_articles.html",
  })
  .state("unlabeled", {
    url: "/unlabeled",
    templateUrl: "/views/_unlabeled.html"
  })
  .state("unread", {
    url: "/unread",
    templateUrl: "/views/_unread.html"
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

  var allUnread = function() {
    return $http.get(host + "/api/v1/cards/unread");
  };

  var applyLabelToCard = function(cardId, labelColor) {
    return $http.put(host + "/api/v1/cards/label", {"card_id": cardId,
                                                    "label_color": labelColor});
  };

  var archiveCard = function(cardId) {
    return $http.delete(host + "/api/v1/cards/archive_card",
                        {params: {"card_id": cardId}});
  };

  var moveToDoing = function(cardId) {
    return $http.put(host + "/api/v1/cards/move_card_to_doing",
                     {"card_id": cardId});
  };

  var moveToDone = function(cardId) {
    return $http.put(host + "/api/v1/cards/move_card_to_done",
                     {"card_id": cardId});
  };

  return {
    allUndecided: allUndecided,
    allUnlabeled: allUnlabeled,
    allUnread: allUnread,
    addToReadingList: addToReadingList,
    rejectFromReadingList: rejectFromReadingList,
    applyLabelToCard: applyLabelToCard,
    archiveCard: archiveCard,
    moveToDoing: moveToDoing,
    moveToDone: moveToDone
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
;elFrontend.directive("archiveCard", function(Article) {
  var cardId = "";
  var archiveSuccess = function(data) {
    console.log("success!");
    $("#" + cardId).css("background-color", "red");
  };

  var archiveFail = function(resp) {

  };

  return {
    restrict: "A",
    link: function(scope, elem, attrs) {
      elem.bind("click", function(evt) {
        evt.preventDefault();
        cardId = attrs.id;
        Article.archiveCard(attrs.id).then(archiveSuccess, archiveFail);
      });
    }
  };
});
;elFrontend.directive("card", function(Article) {

  return {
    restrict: "E",
    templateUrl: "views/_card.html",
    controllerAs: "cardCtrl",
    scope: {
      card: "="
    },
    controller: function($scope) {
      this.cardId = "";
      this.cardSelector = {}; // should be jq selector

      $scope.cardLabels = [
        {name: "Business, Product", color: "orange", hex: "#FF7200"},
        {name: "Data Science", color: "green", hex: "#52a74F"},
        {name: "Programming", color: "yellow", hex: "#FEDF83"}
      ];

      this.hideCard = function() {
        this.cardSelector().hide();
      };

      this.showCard = function(card) {
        this.cardSelector().show();
      };

      this.cardSelector = function() {
        return $("#" + this.card.id);
      };

    },
    link: function(scope, elem, attrs, cardCtrl) {
      cardCtrl.card = scope.card;
    }
  };
});
;elFrontend.directive("colorSelector", function(Article) {
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

        Article.applyLabelToCard(scope.cardId, scope.labelColor).
          then(angular.noop(),
               function(resp) {
                 cardCtrl.showCard();
               });
      });
    }
  };
});
;elFrontend.directive("moveToDoing", function(Article) {
  var cardId = "";
  var success = function(data) {
    console.log("success!");
    $("#" + cardId).addClass("doing");
  };

  var fail = function(resp) {

  };

  return {
    restrict: "A",
    link: function(scope, elem, attrs) {
      elem.bind("click", function(evt) {
        evt.preventDefault();
        cardId = attrs.id;
        success();
        Article.moveToDoing(attrs.id).then(success, fail);
      });
    }
  };
});
;elFrontend.directive("moveToDone", function(Article) {
  var cardId = "";
  var success = function(data) {
    console.log("success!");
    $("#" + cardId).addClass("doing");
  };

  var fail = function(resp) {

  };

  return {
    restrict: "A",
    link: function(scope, elem, attrs) {
      elem.bind("click", function(evt) {
        evt.preventDefault();
        cardId = attrs.id;
        success();
        Article.moveToDone(attrs.id).then(success, fail);
      });
    }
  };
});
;elFrontend.controller("showUnread", function($scope, $timeout, Article) {
  $scope.unreadArticles = [];
  $scope.articlesRejectedOrAccepted = 0;

  $scope.unDecided = function() {
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
;elFrontend.controller("cards", function($scope, Article) {

  $scope.cards = [];

  $scope.unlabeledCards = function() {
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

  $scope.unreadCards = function() {
    Article.allUnread().then(
      //success
      function(resp) {
        $scope.cards = resp.data;
      },
      // failure
      function(data) {
      }
    );
  };
});
