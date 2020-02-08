(function() {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusDecimalQuestion', {
      template:'<md-content layout-padding><div layout="row"><md-input-container md-no-float class="md-block" flex-gt-sm="45"><input type="number" step="any" ng-model="$ctrl.answer" ng-change="$ctrl.update()" ng-if="!$ctrl.mobileInput" ui-decimal placeholder="Insira um valor decimal" ng-disabled="$ctrl.view"> <input type="number" inputmode="decimal" step="any" ng-model="$ctrl.answer" ng-change="$ctrl.update()" ng-if="$ctrl.mobileInput" placeholder="Insira um valor decimal" ng-disabled="$ctrl.view"></md-input-container><md-input-container class="md-block" flex-gt-sm="45"><otus-label item-label="$ctrl.itemData.unit"></otus-label></md-input-container></div></md-content>',
      controller: "otusDecimalQuestionCtrl as $ctrl",
      bindings: {
        itemData: '<',
        onUpdate: '&'
      },
      require : {
        otusQuestion: '^otusQuestion'
      }
    }).controller("otusDecimalQuestionCtrl", Controller);

  Controller.$inject = [
    'otusjs.player.data.activity.CurrentItemService'
  ];

  function Controller($document, CurrentItemService) {
    var self = this;

    self.view = false;

    self.$onInit = function() {
      self.answer = CurrentItemService.getFilling(self.itemData.templateID).answer.value;
      self.otusQuestion.answer = self;

      $document.on('focus blur', 'select, textarea, input', function(e){
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
          self.mobileInput = true;
        }
        else{
          self.mobileInput = false;
        }
      });
    };

    self.update = function() {
      self.onUpdate({
        valueType: 'answer',
        value: self.answer
      });
    };

    self.clear = function() {
      CurrentItemService.getFilling(self.itemData.templateID).answer.clear();
      delete self.answer;
    };
  }
}());
