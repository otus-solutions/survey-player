(function() {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusAutocompleteQuestion', {
      template:'<md-content layout-padding><div layout=row style="margin-top: 15px" layout-fill><div layout=column flex><p layout=row ng-hide="$ctrl.dataReady || $ctrl.dataError">Aguarde. Preparando lista de opções.</p><p layout=row md-warn ng-show=$ctrl.dataError>Erro ao carregar opções.</p><md-autocomplete flex ng-disabled="!$ctrl.dataReady || $ctrl.answer" md-search-text=$ctrl.autoCompleteSettings.searchText md-selected-item=$ctrl.answer md-selected-item-change=$ctrl.update() md-items="meds in $ctrl.searchQuery($ctrl.autoCompleteSettings.searchText)" md-item-text=meds.value md-min-length=3 placeholder="Inicie a digitação"><md-item-template layout-fill flex><span md-highlight-text=$ctrl.autoCompleteSettings.searchText md-highlight-flags=gi>{{meds.value}}</span></md-item-template><md-not-found><span ng-click=$ctrl.setOther()>"{{$ctrl.autoCompleteSettings.searchText}}" não encontrado. Clique para responder com "Outro"</span></md-not-found></md-autocomplete></div></div></md-content>',
      controller: "otusAutocompleteQuestionCtrl as $ctrl",
      bindings: {
        itemData: '<',
        onUpdate: '&'
      },
      require: {
        otusQuestion: '^otusQuestion'
      }
    })
    .controller("otusAutocompleteQuestionCtrl", Controller);

  Controller.$inject = [
    'otusjs.player.data.activity.CurrentItemService',
    'otusjs.utils.DatasourceService',
    'otusjs.utils.SearchQueryFactory'
  ];

  function Controller(CurrentItemService, DatasourceService, SearchQueryFactory) {
    var self = this;
    var _datasource = [];

    self.view = false;

    /* Question Methods */
    self.$onInit = function() {
      self.dataReady = false;
      self.answer = CurrentItemService.getFilling(self.itemData.templateID).answer.value;
      self.otusQuestion.answer = self;
      _setupDatasourceQuery();
    };

    self.update = function() {
      var _answerUpdate;
      if (!self.answer) {
         _answerUpdate = null;
     } else{
        _answerUpdate = self.answer.value;
     }
      self.onUpdate({
        valueType: 'answer',
        value: _answerUpdate
    });
    };

    self.clear = function() {
      CurrentItemService.getFilling(self.itemData.templateID).answer.clear();
      delete self.answer;
    };

    self.setOther = function() {
      self.answer = {value:"Outro"};
      self.update();
    };

    /* Datasource Methods */
    function _setupDatasourceQuery() {
      DatasourceService.fetchDatasources(self.itemData.templateID)
        .then(function(dataList) {
          _datasource = _datasource.concat(dataList);
          if (_datasource.length) {
            self.searchQuery = SearchQueryFactory.newStringSearch(_datasource).perform;
            self.dataReady = true;
          }
       }, function(err){
          self.dataError = true;
       });
      self.autoCompleteSettings = {
        selectedItem: null,
        searchText: "",
      };
    }
  }
}());
