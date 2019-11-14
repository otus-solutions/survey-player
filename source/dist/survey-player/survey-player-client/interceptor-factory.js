(function(){
  'use strict';

  angular.module('survey.player.client')
    .factory('Interceptor', Interceptor);

  Interceptor.$inject = ['$q'];

  function Interceptor() {
    return {
      request: function(config) {
        // config.headers['Authorization'] = sessionStorage.getItem('Auth_Token');
        return config;
      }
    };
  }
})();