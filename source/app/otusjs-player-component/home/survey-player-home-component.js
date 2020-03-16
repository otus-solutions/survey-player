(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('surveyPlayerHome', {
      templateUrl: 'app/otusjs-player-component/home/survey-player-home-template.html',
      controller: Controller
    });

  Controller.$inject = [
    '$scope',
    'LoginService',
    'SurveyApiService'
  ];

  function Controller($scope, LoginService, SurveyApiService) {
    var self = this;

    self.auth = auth;
    self.authenticate = authenticate;

    function auth() {
      self.user = SurveyApiService.getLoggedUser() ?  SurveyApiService.getLoggedUser()['name'] : '';
      return LoginService.isAuthenticated();
    }

    $scope.$watch('$root.online', function(newStatus) {
      self.connection = newStatus;
    });

    function authenticate(ev) {
      LoginService.authenticate(ev)
    }
  }
}());
