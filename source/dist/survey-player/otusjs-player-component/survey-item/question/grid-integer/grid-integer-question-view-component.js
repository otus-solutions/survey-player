(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusGridIntegerQuestionView', {
      template:'<div ng-repeat="line in ::$ctrl.itemData.getLinesList()" ng-init="outerIndex=$index" layout="row" flex><div ng-repeat="gridNumber in ::line.getGridIntegerList()" ng-init="innerIndex=$index" layout-padding layout="row" flex><md-input-container flex><label ng-bind-html="::gridNumber.label.ptBR.formattedText"></label><div><input type="text" numbers-only ng-model="$ctrl.answerArray[outerIndex][innerIndex].value" ng-blur="$ctrl.update(outerIndex, innerIndex)" ng-disabled="$ctrl.view"></div><div style="color: gray;" ng-bind-html="::gridNumber.unit.ptBR.plainText"></div></md-input-container></div></div>',
      controller: "otusGridIntegerQuestionViewCtrl as $ctrl",
      bindings: {
        itemData: '<'
      }
    }).controller("otusGridIntegerQuestionViewCtrl", Controller);

  Controller.$inject = [];

  function Controller() {
    var self = this;

    /* Public Interface */
    self.$onInit = onInit;

    function onInit() {
      self.answerArray = self.itemData.data.answer.value;
      self.view = true;
    }
  }
}());
