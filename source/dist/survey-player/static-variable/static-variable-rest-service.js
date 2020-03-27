(function () {
  'use strict';

  angular
    .module('survey.player.staticVariable')
    .service('StaticVariableRestService', Service);

  Service.$inject = [
    'StaticVariableResourceFactory'
  ];

  function Service(StaticVariableResourceFactory) {
    var self = this;
    var _rest = null;

    /* Public methods */
    self.initialize = initialize;
    self.getParticipantStaticVariable = getParticipantStaticVariable;

    function initialize() {
      _rest = StaticVariableResourceFactory.create();
    }

    function getParticipantStaticVariable(variableRequest) {
      if (!_rest) {
        self.initialize();
      }

      return _rest
        .getStaticVariableList(variableRequest)
        .$promise
        .then(function (response) {
          if (response.data) {
            return response.data;
          }
        });

    }
  }
}());
