elFrontend.controller("unlabeled", function($scope, Article) {

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
