(function () {
  'use strict';

  angular.module('survey.player.client')
    .service('SurveyClientService', Service);

  Service.$inject = [
    '$q',
    'SurveyFactory',
    'otusjs.model.activity.ActivityFactory',
    'otusjs.model.activity.ActivityFacadeService',
    'SurveyApiService',
    'ActivityRepositoryService'
  ];

  function Service($q, SurveyFactory, ActivityFactory, ActivityFacadeService, SurveyApiService, ActivityRepositoryService) {

    var self = this;

    var activityToPlay = null;

    self.getSurveyTemplate = getSurveyTemplate;
    self.saveActivity = saveActivity;
    self.getSurveys = getSurveys;
    self.getAllActivities = getAllActivities;

    function getSurveyTemplate() {
      if (!SurveyApiService.getModeOffline()) {
        return ActivityRepositoryService.getById(SurveyApiService.getCurrentActivity()).then(function (response) {
          if (Array.isArray(response)) {
            if (response.length > 0) {
              activityToPlay = angular.copy(response[0]);
              return activityToPlay;
            }
          }
        });
      } else {
        return ActivityRepositoryService.getByAcronymOffline(SurveyApiService.getSelectedCollection(), SurveyApiService.getCurrentActivity()).then(function (response) {
          activityToPlay = angular.copy(response);
          return activityToPlay;
        });
      }
    }

    function saveActivity(data) {
      var defer = $q.defer();
      ActivityRepositoryService.save(data).then(function () {
        if (data) {
          defer.resolve(true);
        } else {
          defer.reject();
        }
      });
      return defer.promise;
    }

    function getSurveys() {
      return ActivityRepositoryService.getSurveys().then(function (response) {
        if (Array.isArray(response)) {
          return response;
        } else {
          return [];
        }
      }).catch(function (err) {
          return Promise.reject(err);
      });
    }

    function getAllActivities() {
      return ActivityRepositoryService.getAllActivities(SurveyApiService.getLoggedUser()).then(function (response) {
        if (Array.isArray(response)) {
          return response;
        } else {
          return [];
        }
      }).catch(function (err) {
          return Promise.reject(err);
      });
    }

  }

})();
