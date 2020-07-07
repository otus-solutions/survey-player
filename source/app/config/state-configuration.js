(function () {
  'use strict';

  angular
    .module('otusjs.player.config')
    .config(stateConfiguration);

  stateConfiguration.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
  ];

  function stateConfiguration($stateProvider, $urlRouterProvider) {

    $stateProvider.state('/', {
      url: '/?activity&token&callback',
      templateUrl: 'app/activity-viewer-template.html',
      controller: Controller
    });

    $stateProvider.state('/error', {
      url: '/error',
      template: '<h1 style="flex-direction: row; text-align: center; flex: 100; margin: auto">404 - Data Not Found</h1>'
    });

    $stateProvider.state('/home', {
      url: '/home',
      template: '<survey-player-home layout="column" flex></survey-player-home>'
    });

    $stateProvider.state('/play', {
      url: '/?activity&token&play',
      templateUrl: 'app/otusjs-player-component/player-play/player-play-template.html'
    });

    $stateProvider.state('/finish', {
      url: '/?activity&token&finish',
      templateUrl: 'app/otusjs-player-component/player-finish/player-finish-template.html'
    });

    $urlRouterProvider.otherwise('/home');
  }

  Controller.$inject = [
    'otusjs.model.activity.ActivityFacadeService',
    'StorageLoaderService',
    '$compile',
    '$q',
    '$scope',
    'PlayerService',
    '$stateParams',
    'SurveyClientService',
    'SurveyApiService',
    '$location',
    '$state',
    'LoadingScreenService'
  ];

  function Controller(
    ActivityFacadeService,
    StorageLoaderService,
    $compile,
    $q,
    $scope,
    PlayerService,
    $stateParams,
    SurveyClientService,
    SurveyApiService,
    $location,
    $state,
    LoadingScreenService) {

    var self = this;
    /* Lifecycle hooks */
    self.$onInit = onInit;

    var _newScope;
    var _isValid = false;

    function onInit() {
      _config();
    }

    function _config() {
      LoadingScreenService.start();
      _loadOtusDb().then(function () {

        var _token = angular.copy($stateParams.token);
        var _callback = angular.copy($stateParams.callback);
        var _activity = angular.copy($stateParams.activity);

        if (_callback) {
          SurveyApiService.setCallbackAddress(angular.copy(_callback));
          $location.search('callback', null);
        }
        if (_token) {
          SurveyApiService.setAuthToken(angular.copy(_token));
          $location.search('token', null);
          if (_activity) {
            SurveyApiService.setCurrentActivity(_activity);
            $location.search('activity', null);
            SurveyClientService.getSurveyTemplate()
              .then(function (response) {
                self.template = angular.copy(response);
                _setPlayerConfiguration();
              })
              .catch(() => {
                $state.go('/error');
                LoadingScreenService.finish();
              });
          }
        }
        else if (SurveyApiService.getAuthToken() && SurveyApiService.getCurrentActivity()) {
          SurveyClientService.getSurveyTemplate().then(function (response) {
            self.template = angular.copy(response);
            _isValid = true;
            _setPlayerConfiguration();
            LoadingScreenService.finish();
          }).catch(function () {
            $state.go('/error');
            LoadingScreenService.finish();
          });
        }

      });
    }

    function _loadOtusDb() {
      const DB_NAME = 'otus';

      return StorageLoaderService.dbExists(DB_NAME).then(function (dbExists) {
        if (dbExists) {
          return StorageLoaderService.loadIndexedStorage(DB_NAME);
        }

        return StorageLoaderService.createIndexedStorage(DB_NAME);
      });

    }

    function _setPlayerConfiguration() {
      _generateOtusPreview();
      PlayerService.setup();
      $('#survey-preview').empty();
      // $('#survey-preview').append($compile('<otus-player layout="column" layout-fill=""></otus-player>')($scope));
      $('#survey-preview').append($compile('<otus-player-start layout="column" layout-fill=""></otus-player-start>')($scope));
    }

    function _generateOtusPreview() {
      _newScope = $scope;
      _newScope.surveyActivity = {};
      _newScope.surveyActivity.template = _getSurveyTemplateObject();

    }

    function _getSurveyTemplateObject() {
      var _activity = angular.copy(self.template);
      return ActivityFacadeService.surveyActivity = _activity;
    }

  }


}());
