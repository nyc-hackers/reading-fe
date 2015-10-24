var elFrontend = angular.module("elFrontend", ["ui.router", "satellizer"]);

elFrontend.config(function($stateProvider, $urlRouterProvider,
                           $locationProvider, $authProvider) {
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
    templateUrl: "/views/_cards_parent.html",
    controller: function($scope, Article) {
      $scope.title = "Label Cards";
      $scope.cards = [];

      $scope.unLabeledCards = function() {
        Article.allUnlabeled().then(
          //success
          function(resp) {
          $scope.cards = resp.data;
        },
        // failure
        function(data) {
        }
        );
      };

      $scope.unLabeledCards();
    }
  })

  .state("unread", {
    url: "/unread",
    templateUrl: "/views/_cards_parent.html",
    controller: function($scope, Article) {
      $scope.title = "Read Cards";
      $scope.cards = [];

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

      $scope.unreadCards();
    }
  })

  .state("login", {
    url: "/login",
    templateUrl: "/views/_login.html",
    controller: 'LoginCtrl'
  });

  $authProvider.google({
    clientId: '1056669470112-m15b11qnmjcbus1t72obg56in98m8uf8.apps.googleusercontent.com'
  });

  $authProvider.github({
    clientId: 'GitHub Client ID'
  });
});
