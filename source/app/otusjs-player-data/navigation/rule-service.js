(function () {
  'use strict';

  angular
    .module('otusjs.player.data.navigation')
    .service('otusjs.player.data.navigation.RuleService', Service);

  Service.$inject = [
    'otusjs.player.data.activity.ActivityFacadeService',
    'otusjs.player.data.activity.CurrentSurveyService'
  ];

  function Service(ActivityFacadeService, CurrentSurveyService) {
    var self = this;

    /* Public Interface */
    self.isRuleApplicable = isRuleApplicable;

    function isRuleApplicable(rule) {
      var itemAnswer = ActivityFacadeService.fetchItemAnswerByTemplateID(rule.when);

      if (!itemAnswer || _isSkipped(rule.when)) {
        return false;
      }

      var _answerValue = (rule.isMetadata ? itemAnswer.metadata.value : itemAnswer.answer.value);
      return itemAnswer.answer.eval.run(rule, _answerValue);
    }

    function _isSkipped(item) {
      return CurrentSurveyService.getNavigationTracker().getSkippedItems().some(function (element) {
        return item === element.getID();
      });
    }

  }
}());
