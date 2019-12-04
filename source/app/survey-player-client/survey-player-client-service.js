(function() {
  'use strict';

  angular.module('survey.player.client')
    .service('SurveyClientService', Service);

  Service.$inject = [
    '$http',
    '$q',
    'SurveyFactory',
    'otusjs.model.activity.ActivityFactory',
    'otusjs.model.activity.ActivityFacadeService',
    'SurveyApiService',
    'ActivityRepositoryService'
  ];

  function Service($http, $q, SurveyFactory,ActivityFactory,ActivityFacadeService, SurveyApiService, ActivityRepositoryService) {

    var self = this;

    var activityToPlay = null;

    self.getSurveyTemplate = getSurveyTemplate;
    self.saveActivity = saveActivity;

    function _getActivityAddress() {
      return SurveyApiService.getActivityUrl();
    }

    function getSurveyTemplate() {
      // var defer = $q.defer();
      // // $http.get(_getActivityAddress() + '/' + SurveyApiService.getCurrentActivity()).success(function(data) {
      // $http.get("/app/otusjs-player-data/survey.json").success(function(response) {
      //   defer.resolve(response.data);
      // }).error(function(error) {
      //   console.error('Cannot GET a survey template.');
      // });
      // return defer.promise;

      return ActivityRepositoryService.getById(SurveyApiService.getCurrentActivity()).then(function (response) {
        if (Array.isArray(response)) {
          if (response.length > 0) {
            activityToPlay = angular.copy(response[0]);
            // _setActivityToPlay();
            return activityToPlay;
          }
        }
      });
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