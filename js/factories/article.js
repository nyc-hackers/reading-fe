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

  return {
    allUndecided: allUndecided,
    addToReadingList: addToReadingList,
    rejectFromReadingList: rejectFromReadingList
  };
});
