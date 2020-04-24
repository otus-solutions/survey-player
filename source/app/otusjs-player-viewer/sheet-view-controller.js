(function () {
  'use strict';

  angular.module('otusjs.player.viewer')
    .controller('SheetViewController', SheetViewController);

  SheetViewController.$inject = [
    'resolvedSurveyTemplate',
    '$scope',
    'otusjs.model.activity.ActivityFacadeService',
    'otusjs.player.core.player.PlayerService'
  ];

  function SheetViewController(resolvedSurveyTemplate, $scope) {
    var self = this;
    self.surveyTemplate = resolvedSurveyTemplate;
    $scope.surveyActivity = {};
    $scope.surveyActivity.template = resolvedSurveyTemplate;

  }

})();
