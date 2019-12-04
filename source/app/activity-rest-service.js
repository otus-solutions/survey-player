(function() {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('ActivityRestService', Service);

  Service.$inject = [
    '$q',
    '$http',
    'SurveyApiService'
  ];

  function Service($q, $http, SurveyApiService) {
    var self = this;
    var _rest = null;

    /* Public methods */

    self.getById = getById;

    function _getActivityAddress() {
      return SurveyApiService.getActivityUrl();
    }

    function getById(activityInfo) {
      var defer = $q.defer();
      $http.get(_getActivityAddress() + '/' + activityInfo).success(function(response) {
      // $http.get("/app/otusjs-player-data/survey.json").success(function(response) {
        defer.resolve(response.data);
      }).error(function(error) {
        console.error('Cannot GET a survey template.');
      });
      return defer.promise;
    }

  }
}());
