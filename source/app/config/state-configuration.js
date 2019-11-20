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

    $urlRouterProvider.otherwise('/error');
  }


  function Controller (
    ActivityFacadeService,
    ActivityFactory,
    PlayerService,
    $compile,
    $q,
    $scope,
    PlayerConfigurationService,
    ExitPlayerStepService,
    $stateParams,
    SurveyClientService,
    SurveyApiService,
    $cookies,
    $location,
    $state,
    SavePlayerStepService,
    PrePlayerStepService) {
    var self = this;

    /* Lifecycle hooks */
    self.$onInit = onInit;
    var _newScope;

    function _generateOtusPreview() {
      _newScope = $scope;
      _newScope.surveyActivity = {};
      _newScope.surveyActivity.template = _getSurveyTemplateObject();

    }

    function _getSurveyTemplateObject() {
      var _activity = ActivityFactory.fromJsonObject(self.template);
      return ActivityFacadeService.surveyActivity = _activity;
    }

    _config();
    function _config() {
      var _token =  angular.copy($stateParams.token);
      if ($stateParams.callback) {
        SurveyApiService.setCallbackAddress(angular.copy($stateParams.callback));
        $location.search('Callback-Address', null);
      }
      if (!SurveyApiService.getAuthToken()) {
        SurveyApiService.setAuthToken(angular.copy(_token));
        if (!SurveyApiService.getCurrentActivity()){
          SurveyApiService.setCurrentActivity($stateParams.activity);
          SurveyClientService.getSurveyTemplate().then(function(response) {
            self.template = angular.copy(response);
            _setPlayerConfiguration();
          });
        }

      } else {
        if (SurveyApiService.getCurrentActivity()){
          SurveyClientService.getSurveyTemplate().then(function(response) {
            self.template = angular.copy(response);
            _setPlayerConfiguration();
            $('#survey-preview').append($compile('<otus-player layout="column" layout-fill=""></otus-player>')($scope));
            $scope.apply();
          });
        }
      }
      $location.search('activity', null);
    }

    function _setPlayerConfiguration(){
      _generateOtusPreview();
      PlayerConfigurationService.onPrePlayerStart(PrePlayerStepService);
      PlayerConfigurationService.onStop(ExitPlayerStepService);
      PlayerConfigurationService.onEject(ExitPlayerStepService);
      PlayerConfigurationService.onSave(SavePlayerStepService);
      PlayerService.setup();
    }

    function onInit(){
      $location.search('token',null);
      if(SurveyApiService.getAuthToken() && SurveyApiService.getCurrentActivity()){
        console.log('Ready')
      } else {
        $state.go('/error');
      }
    }
  }

  Controller.$inject = [
    'otusjs.model.activity.ActivityFacadeService',
    'otusjs.model.activity.ActivityFactory',
    'otusjs.player.core.player.PlayerService',
    '$compile',
    '$q',
    '$scope',
    'otusjs.player.core.player.PlayerConfigurationService',
    'ExitPlayerStepService',
    '$stateParams',
    'SurveyClientService',
    'SurveyApiService',
    '$cookies',
    '$location',
    '$state',
    'SavePlayerStepService',
    'PrePlayerStepService'
  ];

}());
