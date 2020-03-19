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
        response ? _showMessage(response) : null;
      }, function (err) {
        _setUser();
        err ? _showMessage(err) : null;
      });
    }

    function _setUser() {
      self.user = SurveyApiService.getLoggedUser() ? SurveyApiService.getLoggedUser() : '';
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
          .hideDelay(3000));
    }

    $scope.$on("logged", function () {
      _setUser();
    });

    $scope.$on("login", function () {
      $("#shortLogin").click();
    });

  }
}());
