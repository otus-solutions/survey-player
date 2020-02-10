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
      template:'<div id="survey-preview" layout="row" layout-align="center center" layout-fill></div>',
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

    function _generateOtusPreview() {
      _newScope = $scope;
      _newScope.surveyActivity = {};
      _newScope.surveyActivity.template = _getSurveyTemplateObject();

    }

    function _getSurveyTemplateObject() {
      var _activity = angular.copy(self.template);
      return ActivityFacadeService.surveyActivity = _activity;
    }

    function _config() {
      LoadingScreenService.start();
      _loadOtusDb().then(function () {

        var _token =  angular.copy($stateParams.token);
        var _callback =  angular.copy($stateParams.callback);
        var _activity =  angular.copy($stateParams.activity);

        if (_callback) {
          SurveyApiService.setCallbackAddress(angular.copy(_callback));
          $location.search('callback', null);
        }
        if (_token) {
          SurveyApiService.setAuthToken(angular.copy(_token));
          $location.search('token',null);
          if (_activity){
            SurveyApiService.setCurrentActivity(_activity);
            $location.search('activity', null);
            SurveyClientService.getSurveyTemplate().then(function(response) {
              self.template = angular.copy(response);
              _setPlayerConfiguration();
            });
          }
        } else {
          if (SurveyApiService.getAuthToken() && SurveyApiService.getCurrentActivity()){
            SurveyClientService.getSurveyTemplate().then(function(response) {
              _loadOtusDb().then(function () {
                self.template = angular.copy(response);
                _isValid = true;
                _setPlayerConfiguration();

                LoadingScreenService.finish();
              });


            }).catch(function () {
              $state.go('/error');
              LoadingScreenService.finish();
            });
          }
        }
      });
    }

    function _setPlayerConfiguration(){
      _generateOtusPreview();
      PlayerService.setup();
      $('#survey-preview').empty();
      $('#survey-preview').append($compile('<otus-player layout="column" layout-fill=""></otus-player>')($scope));
    }

    function onInit(){
      _config();
    }

    function _loadOtusDb() {
      var OTUS_DB = 'otus';
      var deferred = $q.defer();

      StorageLoaderService.dbExists(OTUS_DB).then(function(dbExists) {
        if (dbExists) {
          StorageLoaderService.loadIndexedStorage(OTUS_DB);
          deferred.resolve();
        } else {
          StorageLoaderService.createIndexedStorage(OTUS_DB);
          deferred.resolve();

        }
      });

      return deferred.promise;
    }
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

}());