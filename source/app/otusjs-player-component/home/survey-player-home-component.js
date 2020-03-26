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
    self.isUpdate = isUpdate;
    self.allUpdated = true;
    self.$onInit = onInit;
    self.commands = [];

    function onInit() {
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
          console.log(response);
          self.preActivities = angular.copy(Array.prototype.concat.apply(response)).map(function (activity) {
            return activity.toObjectJson()
          });
          self.list = SurveyClientService.getListSurveys();
        }).catch(function () {
          SurveyApiService.clearSession();
          _setUser();
        });
      } else {
        SurveyClientService.getOfflineSurveys().then(function (response) {
          self.preActivities = angular.copy(Array.prototype.concat.apply(response));
          self.list = SurveyClientService.getListSurveys();
        });
      }
    }


    function isUpdate(activity) {
      let _data = {
        acronym: activity.surveyForm.acronym,
        version: activity.surveyForm.version
      };
      if ((!!self.list.find(item => {
        return item.acronym == _data.acronym && item.version == _data.version;
      }))) {
        return {theme: 'md-accent', icon: 'done'};
      }
      self.allUpdated = false;
      return {theme: 'md-warn', icon: 'sync_problem'};
    }

    function authenticate(ev) {
      $mdSidenav('userMenu').close();
      LoginService.authenticate(ev).then(function (response) {
        _setUser();
        response ? _showMessage(response) : null;
        update();
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
