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

    function _getSaveAddress() {
      return SurveyApiService.getSaveUrl();
    }

    function _getActivityAddress(id) {
      return SurveyApiService.getActivityUrl(id);
    }

    function getSurveyTemplate() {
      var defer = $q.defer();
      // $http.get(SurveyApiService.getCurrentActivity()).success(function(data) {
      $http.get('https://5d386bdcf898950014c52bce.mockapi.io/api/activity').success(function(data) { //TODO: remover
        defer.resolve(SurveyFactory.fromJsonObject(data[0]));
      }).error(function(error) {
        console.error('Cannot GET a survey template.');
      });
      return defer.promise;
    }

    function saveActivity(data) {
      var defer = $q.defer();
      $http.post(_getSaveAddress(), data).then(function (data) {
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