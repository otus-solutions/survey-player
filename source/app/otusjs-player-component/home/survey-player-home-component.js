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
    '$mdToast',
    'SurveyClientService'
  ];

  function Controller($scope, LoginService, SurveyApiService, $mdSidenav, $mdToast, SurveyClientService) {
    var self = this;

    self.auth = auth;
    self.authenticate = authenticate;
    self.toggleMenu = toggleMenu;

    self.$onInit = function () {
      _setUser();
    };

    function auth() {
      return LoginService.isAuthenticated();
    }

    function authenticate(ev) {
      $mdSidenav('userMenu').close();
      LoginService.authenticate(ev).then(function (response) {
        _setUser();
        _showMessage(response)
      }, function (err) {
        _setUser()
        _showMessage(err)
      })
    }

    function _setUser() {
      self.user = SurveyApiService.getLoggedUser() ?  SurveyApiService.getLoggedUser() : '';
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
