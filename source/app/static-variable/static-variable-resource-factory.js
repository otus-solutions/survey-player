(function () {
  'use strict';

  angular
    .module('survey.player.staticVariable')
    .factory('StaticVariableResourceFactory', StaticVariableResourceFactory);

  StaticVariableResourceFactory.$inject = [
    '$resource',
    'SurveyApiService'
  ];

  function StaticVariableResourceFactory($resource, SurveyApiService) {
    var self = this;

    self.create = create;

    function create() {
      var restPrefix = SurveyApiService.getStatiVariableUrl();

      return $resource({}, {}, {
        getStaticVariableList: {
          method: 'POST',
          url: restPrefix,
          data: {
            'data': '@data'
          }
        }
      });
    }

    return self;
  }

}());