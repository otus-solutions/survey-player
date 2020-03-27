(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSingleSelectionQuestion', {
      template:'<md-content layout-padding style="margin-left: 10px"><md-radio-group id="singleSelectionQuestionRadioGroup" ng-model="$ctrl.answer" ng-change="$ctrl.update()" layout-padding flex><md-radio-button value="{{option.value}}" ng-click="$ctrl.blurOnClick()" ng-repeat="option in $ctrl.itemData.options" layout="row" style="margin: 10px;outline: none;border: 0;" ng-disabled="$ctrl.view"><otus-label item-label="option.label.ptBR.formattedText"></otus-label></md-radio-button></md-radio-group></md-content>',
      controller: Controller,
      bindings: {
        itemData: '<',
        onUpdate: '&'
      },
      require: {
        otusQuestion: '^otusQuestion'
      }
    });

  Controller.$inject = [
    'otusjs.player.data.activity.CurrentItemService',
    '$element'
  ];

  function Controller(CurrentItemService, $element) {
    var self = this;

    self.$onInit = onInit;
    self.update = update;
    self.clear = clear;
    self.blurOnClick = blurOnClick;

    self.view = false;

    function onInit() {
      self.answer = CurrentItemService.getFilling(self.itemData.templateID).answer.value;
      self.otusQuestion.answer = self;
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

    //OPJ-21 Remove classe md-focused que é adicionada pelo componete radiogroup do angular-material para que
    //não ative os atalhos do teclado nativos do componente
    function blurOnClick() {
      $element.find('#singleSelectionQuestionRadioGroup').removeClass('md-focused');
    }
  }
}());
