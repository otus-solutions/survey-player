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
    'SurveyClientService',
    '$rootScope',
    'ServiceWorker'
  ];

  function Controller($scope, LoginService, SurveyApiService, $mdSidenav, $mdToast, SurveyClientService, $rootScope, ServiceWorker) {
    var self = this;

    self.authenticate = authenticate;
    self.toggleMenu = toggleMenu;
    self.$onInit = onInit;
    self.update = update;
    $scope.selectedIndex = null;
    self.commands = [];
    self.preActivities = [];
    self.isLoading = false;


    function onInit() {
      ServiceWorker.unregister();
      self.commands = [];
      update();
    }

    function update() {
      self.isLoading = true;
        SurveyClientService.getSurveys().then(function (response) {
          self.preActivities = angular.copy(Array.prototype.concat.apply(response));
          self.isLoading = false;
        }).catch(function () {
          self.preActivities = [];
          _updateOffline();
        });

    }

    function _updateOffline() {
      if (!$scope.$root.online){
        _setUser();
        SurveyClientService.getOfflineSurveys().then(function (response) {
          self.preActivities = angular.copy(Array.prototype.concat.apply(response));
          self.isLoading = false;
        });
      } else {
        _setUser();
        self.isLoading = false;
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
      if (self.user.email) {
        ServiceWorker.register();
      }
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
