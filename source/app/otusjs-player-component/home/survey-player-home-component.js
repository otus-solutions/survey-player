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
    'SurveyApiService',
    '$mdSidenav',
    '$mdToast'
  ];

  function Controller($scope, LoginService, SurveyApiService, $mdSidenav, $mdToast) {
    var self = this;

    self.auth = auth;
    self.authenticate = authenticate;
    self.toggleMenu = toggleMenu;

    function auth() {
      self.user = SurveyApiService.getLoggedUser() ?  SurveyApiService.getLoggedUser() : '';
      return LoginService.isAuthenticated();
    }

    function authenticate(ev) {
      $mdSidenav('userMenu').close();
      LoginService.authenticate(ev).then(function (response) {
        _showMessage(response)
      }, function (err) {
        _showMessage(err)
      })
    }

    self.test = function () {
      _showMessage('teste')
    }

    function toggleMenu() {
      $mdSidenav('userMenu').toggle();
    }

    function _showMessage(txt) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(txt)
          .parent(document.querySelectorAll('survey-player-home'))
          .position('bottom right')
          .hideDelay(3000))
    }
  }
}());
