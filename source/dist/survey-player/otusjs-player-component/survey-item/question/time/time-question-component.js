(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusTimeQuestion', {
      template:'<md-content layout-padding><div layout="row"><md-button ng-click="$ctrl.currentTime()" class="md-fab md-raised md-mini" aria-label="Hora Atual" ng-disabled="$ctrl.itemData.options.data.disabledButton.value || $ctrl.view"><md-icon>access_time</md-icon><md-tooltip md-direction="down">Hora Atual</md-tooltip></md-button><md-input-container class="md-block" flex-gt-sm="45"><input id="inputtime" type="time" ng-model="$ctrl.answer.date" ng-blur="$ctrl.update($event)" ng-disabled="$ctrl.view" aria-label="Tempo"></md-input-container></div></md-content>',
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

      if (e.target.validity.valid) {
        _answer = self.answer;
        if (self.answer === null) {
          _answer = {};
        } else {
          if (self.answer.hasOwnProperty('date')) {
            if (self.answer.date === null || self.answer.date === undefined) {
              _answer = {};
            }
          }
        }
      } else {
        _answer = "invalid format";
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
