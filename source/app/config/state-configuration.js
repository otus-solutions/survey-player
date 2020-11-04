(function () {
  'use strict';

  angular
    .module('otusjs.player.config')
    .config(stateConfiguration);

  stateConfiguration.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
    'STATE'
  ];

  function stateConfiguration($stateProvider, $urlRouterProvider, STATE) {

    $stateProvider.state(STATE.MAIN, {
      url: '/?activity&token&callback',
      templateUrl: 'app/activity-viewer-template.html',
      controller: Controller
    });

    $stateProvider.state(STATE.ERROR, {
      url: '/error',
      template: '<otus-survey-error layout="column" layout-fill=""></otus-survey-error>'
    });

    $stateProvider.state(STATE.HOME, {
      url: '/home',
      template: '<survey-player-home layout="column" flex></survey-player-home>'
    });

    $stateProvider.state(STATE.BEGIN, {
      url: '/begin',
      template: '<otus-survey-cover layout="column" layout-fill=""></otus-survey-cover>'
    });

    $stateProvider.state(STATE.PLAY, {
      url: '/play',
      templateUrl: 'app/otusjs-player-component/survey-playing/playing-template.html',
      controller: Controller
    });

    $stateProvider.state(STATE.FINISH, {
      url: '/finish',
      template: '<otus-survey-back-cover layout="column" layout-fill=""></otus-survey-back-cover>'
    });

    $stateProvider.state(STATE.PARTICIPANT_FINISH, {
      url: '/participant-finish',
      template: '<otus-survey-finish-participant layout="column" layout-fill=""></otus-survey-finish-participant>'
    });

    $urlRouterProvider.otherwise(STATE.HOME);
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
    'LoadingScreenService',
    'STATE'
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
    LoadingScreenService,
    STATE) {

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
                $state.go(STATE.ERROR);
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
            $state.go(STATE.ERROR);
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
      if($state.current.name === STATE.PLAY){
        PlayerService.setup();
      }
      _appendTemplateAccordingState();
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

    function _appendTemplateAccordingState(){
      const SURVEY_PREVIEW_ID ='#survey-preview';
      $(SURVEY_PREVIEW_ID).empty();
      switch ($state.current.name) {
        case STATE.MAIN:
          if(SurveyApiService.hasCallbackAddress()){
            $(SURVEY_PREVIEW_ID).append($compile('<otus-survey-cover layout="column" layout-fill=""></otus-survey-cover>')($scope));
          }
          else{
            $(SURVEY_PREVIEW_ID).append($compile('<otus-survey-confirmation-participant layout="column" layout-fill=""></otus-survey-confirmation-participant>')($scope));
          }
          break;

        case STATE.BEGIN:
          $(SURVEY_PREVIEW_ID).append($compile('<otus-survey-cover layout="column" layout-fill=""></otus-survey-cover>')($scope));
          break;

        case STATE.PLAY:
          $(SURVEY_PREVIEW_ID).append($compile('<otus-survey-playing layout="column" layout-fill="" flex></otus-survey-playing>')($scope));
          break;

        case STATE.FINISH:
          $(SURVEY_PREVIEW_ID).append($compile('<otus-survey-back-cover layout="column" layout-fill=""></otus-survey-back-cover>')($scope));
          break;

        case STATE.PARTICIPANT_FINISH:
          $(SURVEY_PREVIEW_ID).append($compile('<otus-survey-finish-participant layout="column" layout-fill=""></otus-survey-finish-participant>')($scope));
          break;
      }
    }

  }

}());
