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
    self.$onInit = onInit;
    self.commands = [];

    function onInit() {
      self.commands = [];
      _setUser();
      update();
    }

    function auth() {
      return LoginService.isAuthenticated();
    }

    function update() {
      self.preActivities = [];
      if (navigator.onLine) {
        SurveyClientService.getSurveys().then(function (response) {
          self.preActivities = angular.copy(Array.prototype.concat.apply(response)).map(function (activity) {
            return activity.toObjectJson()
          });
        }).catch(function () {
          SurveyApiService.clearSession();
          _setUser();
        });
      } else {
        SurveyClientService.getOfflineSurveys().then(function (response) {
          self.preActivities = angular.copy(Array.prototype.concat.apply(response));
        });
      }
    }

    function authenticate(ev) {
      $mdSidenav('userMenu').close();
      LoginService.authenticate(ev).then(function (response) {
        _setUser();
        if (response) {
          _showMessage(response);
          update();
        }
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
