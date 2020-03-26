(function () {

  'use strict';

  angular.module('otusjs.player.component')
    .component('activityCollection', {
      templateUrl: 'app/otusjs-player-component/activity-collect/activity-collect-template.html',
      controller: Controller,
      bindings: {
        user: '<',
        activities: '=',
        commands: '='
      }
    });

  Controller.$inject = [
    'otusjs.model.activity.OfflineActivityCollection',
    '$scope',
    '$mdDialog',
    'CollectIndexedDbService',
    'SurveyApiService',
    '$state',
    'ActivityCollectionRestService'
  ];

  function Controller(OfflineActivityCollection, $scope, $mdDialog, CollectIndexedDbService, SurveyApiService, $state, ActivityCollectionRestService) {
    var self = this;

    const PRINCIPAL_THEME = 'md-accent md-raised md-icon-button';
    const OTHER_THEME = 'md-icon-button';

    self.collections = [];


    self.$onInit = onInit;
    self.$onDestroy = onDestroy;
    self.selectCollection = selectCollection;
    self.selected = [];
    self.toggle = toggle;
    self.exists = exists;
    self.isIndeterminate = isIndeterminate;
    self.isChecked = isChecked;
    self.toggleAll = toggleAll;
    self.initializeCollection = initializeCollection;
    self.newCollection = newCollection;
    self.removeCollection = removeCollection;
    self.saveCollection = saveCollection;
    self.fill = fill;
    self.play = play;

    function onInit() {
      self.allActivities = self.activities;


      _listCollections();

      _clear();
      _addButtonADD();
    }

    function _listCollections() {
      CollectIndexedDbService.getAllCollections(self.user.email).then(function (response) {
        self.collections = OfflineActivityCollection.fromArray(Array.prototype.concat.apply(response), self.user.email);
      });
    }

    function fill(collect) {
      SurveyApiService.setSelectedCollection(collect.code);
      self.fillCollection = collect;
    }


    function removeCollection(code) {
      CollectIndexedDbService.removeCollection(code);
      _listCollections();
    }

    function play(activity) {
      SurveyApiService.setModeOffline();
      SurveyApiService.setCallbackAddress(location.origin);
      SurveyApiService.setCurrentActivity(activity.surveyForm.acronym);
      $state.go('/');
    }

    function onDestroy() {
      _clear();
    }

    function selectCollection(collect) {
      self.selectedCollection = collect;
    }

    function initializeCollection(collect) {
      collect.initialize();
      CollectIndexedDbService.updateCollection(collect.toJSON());
    }

    function newCollection(observation) {
      self.selectedCollection = OfflineActivityCollection.fromJson({observation: observation}, self.user.email);
      self.selectedCollection.code = new ObjectId().toString();
      self.commands.splice(0, self.commands.length);
      _addButtonCANCEL();
      _addButtonSAVE();
    }

    function _addButtonSAVE() {
      self.commands.push({icon: 'save', theme: PRINCIPAL_THEME, action: _save});
    }

    function _addButtonADD() {
      self.commands.push({icon: 'add', theme: PRINCIPAL_THEME, action: _showPrompt});
    }

    function _addButtonCANCEL() {
      self.commands.push({icon: 'close', theme: OTHER_THEME, action: _cancel});
    }

    function _cancel() {
      _clear();
      _addButtonADD();
    }

    function _clear() {
      self.selected.splice(0, self.allActivities.length);
      delete self.selectedCollection;
      self.commands.splice(0, self.commands.length);
    }

    function saveCollection(collect, index) {
      ActivityCollectionRestService.saveOffline(collect.toJSON()).then(function () {
        self.removeCollection(index);
        _updateIndexedDB();
        onInit();
      });
    }

    function _save() {
      try {
        self.selectedCollection.addActivities(self.selected);
        if (self.selectedCollection.activities.length) {
          self.selectedCollection.userEmail = self.user.email;
          self.collections.push(self.selectedCollection);

          CollectIndexedDbService.insertCollection(self.selectedCollection.toJSON());
          _clear();
          _addButtonADD();
          _listCollections();
        }
      } catch (e) {
        throw new Error(e);
      }
    }

    function _updateIndexedDB() {
      CollectIndexedDbService.updateAllCollections(self.collections.map(collect => {
        return collect.toJSON();
      }));
    }

    function _showPrompt() {
      var confirm = $mdDialog.prompt()
        .title('Nova Coleta')
        .textContent('Informe uma observação sobre a coleta:')
        .placeholder('Observação')
        .required(true)
        .ariaLabel('Observation')
        .ok('Criar')
        .cancel('Cancelar');

      $mdDialog.show(confirm).then(function (result) {
        self.newCollection(result);
      }, function () {
      });
    }

    function toggle(item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    }

    function exists(item, list) {
      return list.indexOf(item) > -1;
    }

    function isIndeterminate() {
      return (self.selected.length !== 0 &&
        self.selected.length !== self.allActivities.length);
    }

    function isChecked() {
      return self.selected.length === self.allActivities.length;
    }

    function toggleAll() {
      if (self.selected.length === self.allActivities.length) {
        self.selected = [];
      } else if (self.selected.length === 0 || self.selected.length > 0) {
        self.selected = self.allActivities.slice(0);
        console.log(self.selected);
      }
    }

  }
})();