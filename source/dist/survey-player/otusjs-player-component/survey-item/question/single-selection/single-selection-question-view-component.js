(function() {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSingleSelectionQuestionView', {
      template:'<md-content layout-padding style="margin-left: 10px"><md-radio-group id=singleSelectionQuestionRadioGroup ng-model=$ctrl.answer ng-change=$ctrl.update() layout-padding flex><md-radio-button value={{option.value}} ng-click=$ctrl.blurOnClick() ng-repeat="option in $ctrl.itemData.options" layout=row style="margin: 10px;outline: none;border: 0;" ng-disabled=$ctrl.view><otus-label item-label=option.label.ptBR.formattedText></otus-label></md-radio-button></md-radio-group></md-content>',
      controller: "otusSingleSelectionQuestionViewCtrl as $ctrl",
      bindings: {
        itemData: '<'
      }
    }).controller("otusSingleSelectionQuestionViewCtrl", Controller);

   function Controller() {
    var self = this;

     self.view = true;

    self.$onInit = function() {
      self.answer = self.itemData.data.answer.value;
    };

  }
}());
