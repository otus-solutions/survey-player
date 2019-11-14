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
      url: '/?activity&token',
      template:'<div id=survey-preview layout=row layout-align="center center" layout-fill></div>',
      controller: Controller
    });

    $stateProvider.state('/error', {
      url: '/error',
      template: '<h1 style="flex-direction: row; text-align: center; flex: 100; margin: auto">404 - Data Not Found</h1>'
    });

    $urlRouterProvider.otherwise('/error');
  }



  function Controller (ActivityFacadeService, ActivityFactory, PlayerService, $compile, $q, $scope, PlayerConfigurationService, ExitPlayerStepService, $stateParams, SurveyClientService, $cookies, $location, $state) {
    var self = this;

    /* Lifecycle hooks */
    self.$onInit = onInit;
    var _newScope;
    var _user = undefined;
    var _participant = undefined;
    var _activityConfigurationName = 'C0';



    function _generateOtusPreview() {
      _newScope = $scope;
      _newScope.surveyActivity = {};
      _newScope.surveyActivity.template = _getSurveyTemplateObject();

    }

    function _getSurveyTemplateObject() {
      //TODO: Tiago - alterar para fromJsonObject
      var _activity = ActivityFactory.create(self.template, _user, _participant, _activityConfigurationName);
      return ActivityFacadeService.surveyActivity = _activity;
    }

    _config();
    function _config() {
      const _token =  new String(angular.copy($stateParams.token));
      if (!sessionStorage.getItem('Auth_Token')) {
        sessionStorage.setItem('Auth_Token', angular.copy(_token));
        SurveyClientService.setUrl($cookies.get('Backend-Address'));
        if (!sessionStorage.getItem('Current_Activity')){
          sessionStorage.setItem('Current_Activity', $stateParams.activity);
          SurveyClientService.getSurveyTemplate(sessionStorage.getItem('Current_Activity')).then(function(response) {
            self.template = angular.copy(response);
            _generateOtusPreview();
            PlayerConfigurationService.onStop(ExitPlayerStepService);
            PlayerService.setup();
          });
        }

      } else {
        if (sessionStorage.getItem('Current_Activity')){
          SurveyClientService.getSurveyTemplate(sessionStorage.getItem('Current_Activity')).then(function(response) {
            self.template = angular.copy(response);
            _generateOtusPreview();
            PlayerConfigurationService.onStop(ExitPlayerStepService);
            PlayerService.setup();
            $('#survey-preview').append($compile('<otus-player layout="column" layout-fill=""></otus-player>')($scope));
            $scope.apply();
            essionStorage.removeItem('Current_Activity');
          });
        }
      }
      $location.search('activity', null);
    }

    function onInit(){

      $location.search('token',null);
      // _config();
      if(sessionStorage.getItem('Auth_Token') && sessionStorage.getItem('Current_Activity')){

        // if (!self.template) {
        //   SurveyClientService.getSurveyTemplate(sessionStorage.getItem('Current_Activity')).then(function (response) {
        //     self.template = angular.copy(response);
        //     _generateOtusPreview();
        //     PlayerConfigurationService.onStop(ExitPlayerStepService);
        //     PlayerService.setup();
        //   });
        // } else {
        //   PlayerService.setup();
        // }
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
    '$cookies',
    '$location',
    '$state'
  ];

}());
