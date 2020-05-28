(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusTimeQuestion', {
      templateUrl: 'app/otusjs-player-component/survey-item/question/time/time-question-template.html',
      controller: "otusTimeQuestionCtrl as $ctrl",
      bindings: {
        itemData: '<',
        onUpdate: '&'
      },
      require: {
        otusQuestion: '^otusQuestion'
      }
    }).controller("otusTimeQuestionCtrl", Controller);

  Controller.$inject = [
    'otusjs.player.data.activity.CurrentItemService',
    'otusjs.utils.ImmutableDate',
    '$element'
  ];

  function Controller(CurrentItemService, ImmutableDate, $element) {
    var self = this;

    self.$onInit = onInit;
    self.update = update;
    self.clear = clear;
    self.currentTime = currentTime;

    self.view = false;

    function onInit() {
      self.answer = CurrentItemService.getFilling(self.itemData.templateID).answer.value || new ImmutableDate(null);
      self.otusQuestion.answer = self;
    }

    function update(e) {
      var _answer = {};

      if(!e.target.validity.valid){handle-validation-error-step-service
        _answer = "invalid format";
      }
      else if (self.answer !== null && (self.answer.date || !self.answer.hasOwnProperty('date'))){
        _answer = self.answer;
      }

      self.onUpdate({
        valueType: 'answer',
        value: _answer
      });
    }

    function clear() {
      CurrentItemService.getFilling(self.itemData.templateID).answer.clear();
      delete self.answer;
    }

    function currentTime(e) {
      var imuDate = new ImmutableDate();

      imuDate.setSeconds(0);
      imuDate.setMilliseconds(0);

      self.answer = imuDate;

      $element.find('#inputtime').blur();
    }
  }
}());
