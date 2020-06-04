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
    self.$onChanges = onChanges;

    self.list = list;
    $scope.selectedIndex = 0;
    self.commands = [];
    self.preActivities = [];
    self.isLoading = false;
    self.disableAuth = true;
    self.user = ""

    function onInit() {
      self.commands = [];
      _setUser();
    }

    function onChanges(){
      if(self.user){
        list()
      }
    }

    function list() {
      self.isLoading = true;
      if(self.user === "")
        return self.isLoading = false;
      SurveyClientService.getSurveys().then(function (response) {
        self.preActivities = angular.copy(Array.prototype.concat.apply(response));
        _setUser();
        self.isLoading = false;
      }).catch(function () {
        self.preActivities = [];
        _setUser();
        self.isLoading = false;
      });
    }

    function authenticate() {
      $mdSidenav('userMenu').close();
      LoginService.authenticate().then(function (response) {
        _setUser();
        list();

        if (response) {
          _showMessage(response);
        }
      }, function (err) {
        _setUser();
        err ? _showMessage(err) : null;
      });
    }

    function _setUser() {
      self.user = SurveyApiService.getLoggedUser() ? SurveyApiService.getLoggedUser() : "";
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
      self.disableAuth = false;
    });

    $scope.$on("login", function () {
      self.authenticate();
      self.disableAuth = false;
    });

    $scope.$on("listSurveys", function () {
      self.list();
    });
  }
}());
