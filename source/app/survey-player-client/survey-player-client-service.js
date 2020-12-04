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
      if (SurveyApiService.getModeOffline()) {
        return ActivityRepositoryService.getByAcronymOffline(SurveyApiService.getSelectedCollection(), SurveyApiService.getCurrentActivity())
          .then(function (response) {
            activityToPlay = angular.copy(response);
            return activityToPlay;
          });
      }

      return ActivityRepositoryService.getById(SurveyApiService.getCurrentActivity())
        .then(function (response) {
          if (Array.isArray(response) && response.length > 0) {
            activityToPlay = angular.copy(response[0]);
            return activityToPlay;
          }
        })
        .catch(function (error) {
          return Promise.reject(error);
        });
    }

    function saveActivity(data) {
      var defer = $q.defer();
      ActivityRepositoryService.save(data)
        .then(function () {
          if (data) {
            defer.resolve(true);
          } else {
            defer.reject();
          }
        })
        .catch(function (error) {
          defer.reject(error);
        });
      return defer.promise;
    }

    function getSurveys() {
      return ActivityRepositoryService.getSurveys().then(function (response) {
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      }).catch(function (err) {
        return Promise.reject(err);
      });
    }

    function getAllActivities(filter) {
      return ActivityRepositoryService.getAllActivities(SurveyApiService.getLoggedUser(), filter).then(function (response) {
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      }).catch(function (err) {
        return Promise.reject(err);
      });
    }

  }

})();
