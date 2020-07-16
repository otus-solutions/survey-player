(function () {
  'use strict';

  angular
    .module('otusjs.player.config')
    .config(stateConfiguration);

  stateConfiguration.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
  ];

  const STATES = {
    MAIN: '/',
    ERROR: '/error',
    HOME: '/home',
    PLAY: '/play',
    FINISH: '/finish'
  };

  function stateConfiguration($stateProvider, $urlRouterProvider) {

    $stateProvider.state(STATES.MAIN, {
      url: '/?activity&token&callback',
      templateUrl: 'app/activity-viewer-template.html',
      controller: Controller
    });

    $stateProvider.state(STATES.ERROR, {
      url: '/error',
      template: '<h1 style="flex-direction: row; text-align: center; flex: 100; margin: auto">404 - Data Not Found</h1>'
    });

    $stateProvider.state(STATES.HOME, {
      url: '/home',
      template: '<survey-player-home layout="column" flex></survey-player-home>'
    });

    $stateProvider.state(STATES.PLAY, {
      url: '/play',
      templateUrl: 'app/otusjs-player-component/player-play/player-play-template.html',
      controller: Controller
    });

    $stateProvider.state(STATES.FINISH, {
      url: '/finish',
      template: '<otus-survey-back-cover layout="column" flex></otus-survey-back-cover>'
    });

    $urlRouterProvider.otherwise(STATES.HOME);
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

    const self = this;
    /* Lifecycle hooks */
    self.$onInit = onInit;

    let _newScope;
    let _isValid = false;

    function onInit() {
      _config();
    }

    function _config() {
      LoadingScreenService.start();
      _loadOtusDb().then(function () {

        const _token = angular.copy($stateParams.token);
        const _callback = angular.copy($stateParams.callback);
        const _activity = angular.copy($stateParams.activity);

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
                $state.go(STATES.ERROR);
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
            $state.go(STATES.ERROR);
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

      const SURVEY_PREVIEW_ID ='#survey-preview';
      $(SURVEY_PREVIEW_ID).empty();
      switch ($state.current.name) {
        case STATES.MAIN:
          $(SURVEY_PREVIEW_ID).append($compile('<otus-survey-cover layout="column" layout-fill=""></otus-survey-cover>')($scope));
          break;
        case STATES.PLAY:
          $(SURVEY_PREVIEW_ID).append($compile('<otus-survey-playing layout="column" layout-fill="" flex></otus-survey-playing>')($scope));
          break;
      }
    }

    function _generateOtusPreview() {
      _newScope = $scope;
      _newScope.surveyActivity = {};
      _newScope.surveyActivity.template = _getSurveyTemplateObject();
    }

    function _getSurveyTemplateObject() {
      const _activity = angular.copy(self.template);
      return ActivityFacadeService.surveyActivity = _activity;
    }

  }

}());
