(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusAutocompleteQuestion', {
      templateUrl: 'app/otusjs-player-component/survey-item/question/autocomplete/autocomplete-question-template.html',
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
    self.$onInit = onInit;
    self.update = update;
    self.clear = clear;
    self.setOther = setOther;

    /* Question Methods */
    function onInit() {
      self.dataReady = false;
      self.answer = CurrentItemService.getFilling(self.itemData.templateID).answer.value;
      self.otusQuestion.answer = self;
      _setupDatasourceQuery();
    }

    function update() {
      var _answerUpdate;
      if (!self.answer) {
        _answerUpdate = null;
      } else {
        _answerUpdate = self.answer.value;
      }
      self.onUpdate({
        valueType: 'answer',
        value: _answerUpdate
      });
    }

    function clear() {
      CurrentItemService.getFilling(self.itemData.templateID).answer.clear();
      delete self.answer;
    }

    function setOther() {
      self.answer = {value: "Outro"};
      self.update();
    }

    /* Datasource Methods */
    function _setupDatasourceQuery() {
      DatasourceService.fetchDatasources(self.itemData.templateID)
        .then(function (dataList) {
          _datasource = _datasource.concat(dataList);
          if (_datasource.length) {
            self.searchQuery = SearchQueryFactory.newStringSearch(_datasource).perform;
            self.dataReady = true;
          }
        }, function (err) {
          self.dataError = true;
        });
      self.autoCompleteSettings = {
        selectedItem: null,
        searchText: "",
      };
    }
  }

}());
