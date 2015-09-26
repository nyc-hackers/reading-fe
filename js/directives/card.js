elFrontend.directive("card", function(Article) {

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
