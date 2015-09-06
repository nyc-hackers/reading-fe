elFrontend.controller("cards", function($scope, Article) {

  $scope.cardLabels = [
    {name: "Business, Product", color: "orange", hex: "#FF7200"},
    {name: "Data Science", color: "green", hex: "#52a74F"},
    {name: "Programming", color: "yellow", hex: "#FEDF83"}
  ];

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
