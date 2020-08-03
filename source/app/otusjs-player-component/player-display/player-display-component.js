(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusPlayerDisplay', {
      templateUrl: 'app/otusjs-player-component/player-display/player-display-template.html',
      controller: 'otusPlayerDisplayCtrl as $ctrl',
      bindings: {
        goBack: '&'
      }
    }).controller('otusPlayerDisplayCtrl', Controller);

  Controller.$inject = [
    '$scope',
    '$document',
    '$element',
    '$compile',
    '$location',
    '$anchorScroll',
    'otusjs.player.data.activity.ActivityFacadeService',
    'otusjs.player.core.player.PlayerService',
    'otusjs.player.core.player.OnProcessingService'
  ];

  function Controller($scope, $document, $element, $compile, $location, $anchorScroll,
                      ActivityFacadeService, PlayerService, OnProcessingService) {
    const self = this;

    const SURVEY_ITEM = '<otus-survey-item item-data="itemData" id="{{itemData.templateID}}" on-processing-player="$ctrl.onProcessingPlayer()" style="margin: 0;display:block;" class="animate-switch"/>';

    /* Public methods */
    self.$onInit = onInit;
    self.loadItem = loadItem;
    self.remove = remove;
    self.onProcessingPlayer = onProcessingPlayer;
    self.currentItems = [];

    function onInit() {
      $scope.$parent.$ctrl.playerDisplay = self;
      $scope.itemData = {};
      $scope.itemData.templateID = '';
      $scope.questions = [];
      self.ids = [];

      let itemData = PlayerService.getItemData();
      if (itemData) {
        self.loadItem(itemData);
      }
    }

    function loadItem(itemsData) {
      if (_shouldLoadItem(itemsData[itemsData.length - 1])) {
        _saveQuestion();
        _destroyCurrentItems();
        _removeQuestions(itemsData);

        $element.find('#pagePlayer').empty();
        for (let i = 0; i < itemsData.length; i++) {
          (function () {
            $scope = $scope.$new();
            $scope.itemData = itemsData[i];
            _setQuestionId(itemsData[i].templateID);
            let element = $compile(SURVEY_ITEM)($scope);
            $element.find('#pagePlayer').append(element);
          }());
        }
        onProcessingPlayer();
        _focusOnItem(itemsData[0].templateID);
      } else {
        onProcessingPlayer();
        _focusOnItem(itemsData[0].templateID);
      }

      if(PlayerService.isGoingBack()){
        PlayerService.setGoBackTo(null);
      }
    }

    function _destroyCurrentItems() {
      if (self.currentItems.length) {
        self.currentItems.forEach(item => {
          item.destroy();
        });
      }

      self.currentItems = [];
    }

    function _removeQuestions(itemsData) {
      let id = itemsData[0].templateID;

      var index = _getIndexQuestionId(id);
      if (index > -1) {
        var length = $scope.questions.length;
        $scope.questions.splice(index, length);
        self.ids.splice(index, length);
      }
    }

    function _setQuestionId(id) {
      self.ids.push(id);
    }

    function _getIndexQuestionId(id) {
      return self.ids.indexOf(id);
    }

    function _focusOnItem(idQuestion) {
      $location.hash(idQuestion);
      $anchorScroll();
    }

    function _saveQuestion() {
      if (self.currentItems.length) {
        self.currentItems.forEach(item => {
          var question = angular.copy(item.itemData);
          question.data = ActivityFacadeService.fetchItemAnswerByTemplateID(question.templateID);
          question.data = question.data ? question.data : _setAnswerBlank();
          $scope.questions.push(question);
        });
      }
    }

    function _setAnswerBlank() {
      return {
        metadata: {
          value: null
        },
        answer: {
          value: null
        }
      };
    }

    function remove() {
      $element.find('#pagePlayer').remove();
    }

    function _shouldLoadItem(itemData) {
      return !self.currentItems.length || (self.currentItems.length && $scope.itemData.templateID !== itemData.templateID);
    }

    function onProcessingPlayer() {
      OnProcessingService.onProcessing();
    }
  }
}());