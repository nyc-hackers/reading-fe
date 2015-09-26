elFrontend.factory("Article", function($http, Backend) {
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
