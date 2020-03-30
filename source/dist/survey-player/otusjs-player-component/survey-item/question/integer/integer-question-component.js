(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusIntegerQuestion', {
      template:'<md-content layout-padding><div layout="row"><md-input-container md-no-float class="md-block" flex-gt-sm="45"><input type="number" step="1" ng-model="$ctrl.answer" ng-change="$ctrl.update()" ng-if="!$ctrl.mobileInput" ui-integer placeholder="Insira um valor inteiro" ng-disabled="$ctrl.view"> <input type="number" step="1" ng-model="$ctrl.answer" ng-change="$ctrl.update()" ng-if="$ctrl.mobileInput" placeholder="Insira um valor inteiro" ng-disabled="$ctrl.view"></md-input-container><md-input-container class="md-block" flex-gt-sm="45"><otus-label item-label="$ctrl.itemData.unit"></otus-label></md-input-container></div></md-content>',
      controller: "otusIntegerQuestionCtrl as $ctrl",
      bindings: {
        itemData: '<',
        onUpdate: '&'
      },
      require: {
        otusQuestion: '^otusQuestion'
      }
    }).controller("otusIntegerQuestionCtrl", Controller);

  Controller.$inject = [
    '$document',
    'otusjs.player.data.activity.CurrentItemService'
  ];

  function Controller($document, CurrentItemService) {
    var self = this;

    self.$onInit = onInit;
    self.update = update;
    self.clear = clear;

    self.view = false;

    function onInit() {
      self.answer = CurrentItemService.getFilling(self.itemData.templateID).answer.value;
      self.otusQuestion.answer = self;

      $document.on('focus blur', 'select, textarea, input', function (e) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          self.mobileInput = true;
        } else {
          self.mobileInput = false;
        }
      });
    }

    function update() {
      self.onUpdate({
        valueType: 'answer',
        value: self.answer
      });
    }

    function clear() {
      CurrentItemService.getFilling(self.itemData.templateID).answer.clear();
      delete self.answer;
    }
  }
}());
