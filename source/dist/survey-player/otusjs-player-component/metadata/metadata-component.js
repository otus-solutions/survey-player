(function() {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('metadataGroup', {
      template:'<md-content layout-padding style="margin-left: 10px"><md-radio-group id=metadataGroupRadioGroup ng-model=$ctrl.metadata ng-change=$ctrl.update() layout-padding flex><md-content value={{option.value}} ng-repeat="option in $ctrl.itemData.metadata.options" layout=row style="margin: 10px"><md-radio-button aria-label={{option.label}} ng-click=$ctrl.blurOnClick() value={{option.value}} style="outline: none;border: 0;" flex><otus-label item-label=option.label.ptBR.formattedText></otus-label></md-radio-button></md-content></md-radio-group></md-content>',
      controller: MetadataGroupController,
      bindings: {
        itemData: '<',
        onUpdate: '&'
      },
      require: {
        otusQuestion: '^otusQuestion'
      }
    });

  MetadataGroupController.$inject = [
    'otusjs.player.data.activity.CurrentItemService',
    '$element'
  ];

  function MetadataGroupController(CurrentItemService, $element) {
    var self = this;

    self.$onInit = onInit;
    self.update = update;
    self.clear = clear;
    self.blurOnClick = blurOnClick;

    function onInit() {
        self.metadata = CurrentItemService.getFilling(self.itemData.templateID).metadata.value;
        self.otusQuestion.metadata = self;
    }

    function update() {
      self.onUpdate({
        valueType: 'metadata',
        value: self.metadata
      });
    }

    function clear() {
        CurrentItemService.getFilling(self.itemData.templateID).metadata.clear();
        delete self.metadata;
    }

    function blurOnClick() {
      $element.find('#metadataGroupRadioGroup').removeClass('md-focused');
    }
  }
})();
