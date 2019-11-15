(function(){
  'use strict';

  angular.module('survey.player.client')
    .factory('Interceptor', Interceptor);

  Interceptor.$inject = ['$q'];

  function Interceptor() {
    return {
      request: function(config) {
        // config.headers['Authorization'] = 'Bearer '+ sessionStorage.getItem('Auth_Token');
        config.headers['Content-Type'] = 'application/json';
        return config;
      }
    };
  }
})();