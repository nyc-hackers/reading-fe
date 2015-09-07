var elFrontend = angular.module("elFrontend", ["ui.router"]);

elFrontend.config(function($stateProvider, $urlRouterProvider,
                           $locationProvider) {
  // For any unmatched url, redirect to /state1
  //$locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/unread");
  // Now set up the states
  $stateProvider
  .state("undecided", {
    url: "/undecided",
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
