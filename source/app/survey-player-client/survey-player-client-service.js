(function() {
  'use strict';

  angular.module('survey.player.client')
    .service('SurveyClientService', Service);

  Service.$inject = [
    '$http',
    '$q',
    'SurveyFactory'
  ];

  function Service($http, $q, SurveyFactory) {

    var self = this;
    var HOSTNAME;
    var CONTEXT;
    self.init = init;
    self.getSurveyTemplate = getSurveyTemplate;

    self.setUrl = setUrl;
    self.getApiHost = getApiHost;
    self.setContext = setContext;


    self.init();

    function init() {
      HOSTNAME = 'http://' + window.location.hostname + ':8080';
      CONTEXT = '/otus-rest';
    }

    function setUrl(url) {
      HOSTNAME = angular.copy(url);
    }

    function setContext(context) {
      CONTEXT = angular.copy(context);
    }

    function getApiHost() {
      return HOSTNAME + CONTEXT;
    }

    function getSurveyTemplate(activity) {
      var defer = $q.defer();
      $http.get('https://5d386bdcf898950014c52bce.mockapi.io/api/activity').success(function(data) {
        console.log(data);
        defer.resolve(SurveyFactory.fromJsonObject(data[0]));
      }).error(function(error) {
        console.log('Cannot GET a fake survey template.');
      });
      return defer.promise;
    }


  }


})();