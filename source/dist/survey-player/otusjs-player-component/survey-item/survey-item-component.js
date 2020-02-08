(function() {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSurveyItem', {
      template:'<md-card flex><md-card-title layout="row" ng-if="!$ctrl.isItem()"><md-card-title-text layout="column" flex><div layout="row"><otus-label class="md-headline" item-label="$ctrl.itemData.label.ptBR.formattedText" flex layout-padding></otus-label></div></md-card-title-text></md-card-title><md-card-content layout="column" layout-align="space-between" flex><otus-question ng-if="$ctrl.isQuestion()" on-update="$ctrl.update(valueType, value)" item-data="$ctrl.itemData" layout="column" flex></otus-question><otus-misc-item ng-if="$ctrl.isItem()" item-data="$ctrl.itemData" layout="column" flex></otus-misc-item></md-card-content><otus-validation-error error="$ctrl.$error" layout="row"></otus-validation-error></md-card>',
      controller: 'otusSurveyItemCtrl as $ctrl',
      bindings: {
        itemData: '<'
      }
    }).controller('otusSurveyItemCtrl', OtusSurveyItemController);

  OtusSurveyItemController.$inject = [
    '$scope',
    '$element',
    'otusjs.player.data.activity.CurrentItemService'
  ];

  function OtusSurveyItemController($scope, $element, CurrentItemService) {
    var self = this;

    /* Public methods */
    self.$onInit = onInit;
    self.isQuestion = isQuestion;
    self.isItem = isItem;
    self.update = update;
    self.clear = clear;
    self.pushData = pushData;
    self.destroy = destroy;
    self.updateValidation = updateValidation;

    function onInit() {
      self.filling = {};
      self.filling.questionID = self.itemData.templateID;

      $scope.$parent.$ctrl.currentItems.push(self);
      CurrentItemService.observerRegistry(self);

      self.$error = {};
      self.questionComponent = {};
      self.errorComponent = {};
    }

    function updateValidation(validationMap) {
      self.$error = validationMap;

      if (self.$error.hasError) {
        self.questionComponent.setError(self.$error);
      }
    }

    function isQuestion() {
      return (self.itemData.objectType === 'ImageItem') || (self.itemData.objectType === 'TextItem') ? false : true;
    }

    function isItem() {
      return (self.itemData.objectType === 'ImageItem') || (self.itemData.objectType === 'TextItem') ? true : false;
    }

    function update(prop, value) {
      if (prop) {
        if (prop === 'comment' || prop === 'forceAnswer') {
          self.filling[prop] = value;
        } else {
          clear(prop, value);
          self.filling[prop].value = value;
        }
      } else {
        throw new Error('Cannot determine property type to update', 72, 'survey-item-component.js');
      }
      CurrentItemService.fill(self.filling);
    }

    function clear(prop) {
      if (prop) {
        if (prop === 'metadata') {
          self.questionComponent.clearAnswer();
        } else if (prop === 'answer') {
          self.questionComponent.clearMetadataAnswer();
        }
      } else {
        throw new Error('Cannot determine property type to clear', 85, 'survey-item-component.js');
      }
    }

    function pushData(filling) {
      self.filling = filling;
    }

    function destroy() {
      $element.remove();
      $scope.$destroy();
    }
  }
})();
