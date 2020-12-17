(function () {

  'use strict';

  angular.module('otusjs.player.component')
    .component('pendentActivityGroup', {
      templateUrl: 'app/otusjs-player-component/pendent-activity-group/pendent-activity-group-template.html',
      controller: Controller,
    });

  Controller.$inject = [
    '$scope',
    '$mdToast',
    '$timeout',
    '$mdSidenav',
    'PendentActivitiesDbStorageService',
    'ActivityCollectionService',
    'SurveyApiService',
    'LoginService'
  ];

  function Controller(
    $scope,
    $mdToast,
    $timeout,
    $mdSidenav,
    PendentActivitiesDbStorageService,
    ActivityCollectionService,
    SurveyApiService,
    LoginService
  ) {

    var self = this;

    self.$onInit = onInit;

    self.save = save;
    self.saveAll = saveAll;
    self.authenticate = authenticate
    self.toggleMenu = toggleMenu

    function onInit() {
      PendentActivitiesDbStorageService.getAll()
        .then(function(res){
          self.activities = res;
        });
    }

    function authenticate() {
      $mdSidenav('userMenu').close()
      LoginService.authenticate().then(function (response) {
        _setUser();
        if (response) {
          _showToast(response);
        }
      }, function (err) {
        _setUser();
        err ? _showToast(err) : null;
      });
    }

    function _setUser() {
      self.user = SurveyApiService.getLoggedUser() ? SurveyApiService.getLoggedUser() : "";
    }

    function save(activity) {
      activity.loading = true;
      ActivityCollectionService.update([activity])
        .then(function (response) {
          activity.saved = true;
          activity.loading = false;
        }).catch(function (e) {
          activity.loading = false;
          _showToast('algo deu errado ao salvar a atividade ' + activity.surveyForm.name)
      });
      $timeout(function() {
        activity.saved = true;
        activity.loading = false;
      }, 1000);

    }

    function saveAll() {
      for(let activity of self.activities) {
        if(!activity.saved) {
          save(activity)
        }
      }
    }

    function toggleMenu() {
      $mdSidenav('userMenu').toggle();
    }

    function _showToast(text) {
      $mdToast.show($mdToast.simple()
        .textContent(text)
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
  }
})();