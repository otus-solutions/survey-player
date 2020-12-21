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
    '$state',
    '$stateParams',
    '$location',
    'STATE',
    'PendentActivitiesDbStorageService',
    'ActivityCollectionService',
    'SurveyApiService',
    'LoginService',
    'PlayerService'
  ];

  function Controller(
    $scope,
    $mdToast,
    $timeout,
    $mdSidenav,
    $state,
    $stateParams,
    $location,
    STATE,
    PendentActivitiesDbStorageService,
    ActivityCollectionService,
    SurveyApiService
  ) {

    var self = this;


    self.$onInit = onInit;

    self.save = save;
    self.saveAll = saveAll;
    self.goToCallback = goToCallback;

    function onInit() {
      _setCallback();
      _setToken();
      PendentActivitiesDbStorageService.getAll()
        .then(function(res){
          if(res.length < 1) {
            $state.go(STATE.HOME);
          }
          self.activities = res;
        });
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

    function goToCallback() {
      location.href = SurveyApiService.getCallbackAddress()
    }

    function _setCallback() {
      let callback = angular.copy($stateParams.callback)
      if(callback) {
        SurveyApiService.setCallbackAddress(callback);
        $location.search('callback', null);
      }
      self.hasCallback = SurveyApiService.hasCallbackAddress();
    }

    function _setToken() {
      let _token = angular.copy($stateParams.token);
      if (_token) {
        SurveyApiService.setAuthToken(angular.copy(_token));
        $location.search('token', null);
      }
    }

    function _showToast(text) {
      $mdToast.show($mdToast.simple()
        .textContent(text)
        .hideDelay(3000));
    }

  }
})();