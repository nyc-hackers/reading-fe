elFrontend.controller("cards", function($scope, Article) {

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
