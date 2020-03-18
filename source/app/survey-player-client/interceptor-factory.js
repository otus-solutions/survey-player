(function () {
  'use strict';

  angular.module('survey.player.client')
    .factory('Interceptor', Interceptor);

  Interceptor.$inject = ['SurveyApiService'];

  function Interceptor(SurveyApiService) {
    return {
      request: function (config) {
        config.headers['Authorization'] = 'Bearer ' + SurveyApiService.getAuthToken();
        return config;
      }
    };
  }
})();