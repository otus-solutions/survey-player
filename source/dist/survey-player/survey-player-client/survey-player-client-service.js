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


    function getSurveyTemplate() {
      return ActivityRepositoryService.getById(SurveyApiService.getCurrentActivity()).then(function (response) {
        if (Array.isArray(response)) {
          if (response.length > 0) {
            activityToPlay = angular.copy(response[0]);
            return activityToPlay;
          }
        }
      });
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
  }

})();