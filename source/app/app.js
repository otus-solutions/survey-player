(function() {
  'use strict';

  angular
    .module('otusjs.player.standalone', [
      /* External dependencies */
      'ngMaterial',
      'ngMessages',
      'ngAnimate',
      'ui.router',
      'angular-bind-html-compile',
      /* Exportable dependencies */
      'otusjs.player.core',
      'otusjs.player.component',
      /* Standalone dependencies */
      'otusjs.player.config',
      'otusjs.player.data',
      'otusjs.player.viewer'
    ])
    .component('activityViewer', {
      controller: 'activityViewerCtrl',
      templateUrl: 'app/activity-viewer-template.html'
    })
    .controller('activityViewerCtrl', Controller);

  Controller.$inject = [
    // '$scope',
    // '$element',
    '$compile',
    // 'WorkspaceService',
    // 'contextTemplate',
    'SurveyFactory',
    'otusjs.model.activity.ActivityFacadeService',
    'otusjs.player.core.player.PlayerService',
    '$http',
    '$q',
    '$scope',
    'otusjs.player.core.player.PlayerConfigurationService',
    'ExitPlayerStepService'
  ];

  function Controller($compile, SurveyFactory, ActivityFacadeService, PlayerService, $http, $q, $scope, PlayerConfigurationService, ExitPlayerStepService) {
    var self = this;

    /* Lifecycle hooks */
    self.$onInit = onInit;
    var _newScope;
    var _user = undefined;
    var _participant = undefined;
    var _activityConfigurationName = 'C0';




    function getSurveyTemplate() {
      var defer = $q.defer();
      $http.get('/app/otusjs-player-data/survey.json').success(function(data) {
        defer.resolve(SurveyFactory.fromJsonObject(data));
      }).error(function(error) {
        console.log('Cannot GET a fake survey template.');
      });
      return defer.promise;
    }

    function _generateOtusPreview() {
      _newScope = $scope;
      _newScope.surveyActivity = {};
      _newScope.surveyActivity.template = _getSurveyTemplateObject();

    }

    function _getSurveyTemplateObject() {
      return ActivityFacadeService.createActivity(self.template, _user, _participant,_activityConfigurationName);
    }

    function onInit(){
      getSurveyTemplate().then(function(response) {
        self.template = angular.copy(response);
        _generateOtusPreview();
        PlayerConfigurationService.onStop(ExitPlayerStepService);
        PlayerService.setup();
      });
    }
  }

}());
