(function () {
  'use strict';

  angular.module('survey.player.client')
    .factory('Interceptor', Interceptor);

  Interceptor.$inject = ['SurveyApiService', '$rootScope'];

  function Interceptor(SurveyApiService, $rootScope) {
    return {
      request: function (config) {
        if (/^http/.test(config.url)) $rootScope.online = true;
        config.headers['Authorization'] = 'Bearer ' + SurveyApiService.getAuthToken();
        return config;
      },
      responseError: function(response){
        $rootScope.status = response.status;
        if (/^http/.test(response.config.url)) {
          $rootScope.online = false;
        }
        if (!response.data){
          response.data = {}
        }
        else if (response.data['STATUS'] && response.data.STATUS === "UNAUTHORIZED") {
          SurveyApiService.clearSession();
          SurveyApiService.setLoggedUser();
          $rootScope.online = true;
          $rootScope.$broadcast('logged');
          if (/authentication/.test(response.config.url) === false) {
            $rootScope.$broadcast('login');
          }
        }
        return Promise.reject(response);
      },
      response: function(response){
        $rootScope.status = response.status;
        if (/^http/.test(response.config.url)) $rootScope.online = true;
        return response;
      }
    };
  }
})();