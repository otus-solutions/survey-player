(function() {
  'use strict';

  angular.module('survey.player.client')
    .service('SurveyClientService', Service);

  Service.$inject = [
    '$http',
    '$q',
    'SurveyFactory',
    'SurveyApiService'
  ];

  function Service($http, $q, SurveyFactory, SurveyApiService) {

    var self = this;

    self.getSurveyTemplate = getSurveyTemplate;
    self.saveActivity = saveActivity;

    function _getActivityAddress() {
      return SurveyApiService.getActivityUrl();
    }

    function getSurveyTemplate() {
      var defer = $q.defer();
      $http.get(_getActivityAddress() + '/' + SurveyApiService.getCurrentActivity()).success(function(data) {
        defer.resolve(SurveyFactory.fromJsonObject(data[0]));
      }).error(function(error) {
        console.error('Cannot GET a survey template.');
      });
      return defer.promise;
    }

    function saveActivity(data) {
      var defer = $q.defer();
      $http.post(_getActivityAddress(), data).then(function (data) {
        if (data) {
          defer.resolve(true);
        } else {
          defer.reject();
        }
      }, function (error) {
        defer.reject();
      });

      return defer.promise;
    }


  }


})();