(function () {
  'use strict';

  angular
    .module('survey.player.staticVariable')
    .service('StaticVariableDataSourceService', service);

  service.$inject = [
    '$q',
    'StaticVariableRestService',
    'StaticVariableDataSourceRequestFactory'
  ];

  function service($q, StaticVariableRestService, StaticVariableDataSourceRequestFactory) {
    var self = this;

    /* Public Interface */
    self.up = up;
    self.setup = setup;

    function up() {
      var defer = $q.defer();
      StaticVariableRestService.initialize();
      defer.resolve(true);
      return defer.promise;
    }

    function setup(ActivityFacadeService) {
      return $q(function (resolve, reject) {
        try {
          var currentSurvey = ActivityFacadeService.getCurrentSurvey().getSurvey();
          var variables = currentSurvey.getStaticVariableList();
          if (!variables || !variables.length) {
            resolve([]);
          } else {
            var participant = ActivityFacadeService.getCurrentSurvey().getSurvey().participantData;
            var request = StaticVariableDataSourceRequestFactory.create(participant.recruitmentNumber, variables);
            StaticVariableRestService.getParticipantStaticVariable(request)
              .then(response => {
                if (response.variables) {
                  resolve(currentSurvey.fillStaticVariablesValues(response.variables));
                }
              })
              .catch(function (e) {
                reject(e);
              });
          }
        } catch (e) {
          reject(e);
        }
      });
    }

  }
}());
