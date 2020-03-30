(function () {

  'use strict';

  angular.module('otusjs.player.component')
    .component('activityCollection', {
      templateUrl: 'app/otusjs-player-component/activity-collect/activity-collect-template.html',
      controller: Controller,
      bindings: {
        user: '<',
        activities: '=',
        commands: '=',
        showCommands: '='
      }
    });

  Controller.$inject = [
    'otusjs.model.activity.OfflineActivityCollection',
    '$scope',
    '$mdDialog',
    'CollectIndexedDbService',
    'SurveyApiService',
    '$state',
    'ActivityCollectionRestService',
    'ACTIVITY_STATUS',
    '$mdToast'
  ];

  function Controller(OfflineActivityCollection, $scope, $mdDialog, CollectIndexedDbService, SurveyApiService, $state, ActivityCollectionRestService, ACTIVITY_STATUS, $mdToast) {
    var self = this;

    const PRINCIPAL_THEME = 'md-accent md-raised md-icon-button';
    const OTHER_THEME = 'md-icon-button';
    const POSITION = 'bottom right';
    const DELAY = 3000;
    const MESSAGE_SEND_SUCCESS = 'Coleta foi enviada com sucesso.';
    const MESSAGE_SEND_FAILED = 'Não foi possível enviar a coleta! Tente novamente.';
    const MESSAGE_REMOVE_SUCCESS = 'Coleta foi removida com sucesso.';
    const MESSAGE_REMOVE_FAILED = 'Não foi possível remover a coleta! Tente novamente.';
    const MESSAGE_INITIALIZE = 'Coleta iniciada.';

    const NEW_COLLECTION = {
      title: 'Nova Coleta',
      textContent: 'Informe uma observação sobre a coleta:',
      placeholder: 'Observação',
      required: true,
      ariaLabel: 'Observation',
      ok: 'Criar',
      cancel: 'Cancelar',
      action: newCollection
    };

    const SEND_COLLECTION = {
      title: 'Envio de Coleta',
      textContent: 'Informe seu email para confirmar o envio:',
      placeholder: 'Email',
      required: true,
      ariaLabel: 'Email',
      ok: 'Enviar',
      cancel: 'Cancelar',
      action: _confirmEmail
    };

    const REMOVE_COLLECTION = {
      title: 'Excluir Coleta',
      textContent: 'ATENÇÃO! A exclusão da coleta é permanente. Informe seu email para confirmar a remoção:',
      placeholder: 'Email',
      required: true,
      ariaLabel: 'Email',
      ok: 'Excluir',
      cancel: 'Cancelar',
      action: _confirmEmail
    };

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

    $scope.$watch('$ctrl.showCommands', function (newVal) {
      if (newVal){
        _addButtonADD();
      } else {
        _clear();
      }
    });


    function onInit() {
      self.allActivities = self.activities;
      SurveyApiService.setSelectedCollection();
      self.STATUS = ACTIVITY_STATUS;
      _listCollections();
      _clear();
    }

    function _listCollections() {
      CollectIndexedDbService.getAllCollections(self.user.email).then(function (response) {
        self.collections = OfflineActivityCollection.fromArray(Array.prototype.concat.apply(response), self.user.email);
      });
    }

    function fill(collect) {
      SurveyApiService.setModeOffline();
      SurveyApiService.setSelectedCollection(collect.code);
      self.fillCollection = collect;
    }

    function removeCollection(collect) {
      self.collect = collect.toJSON();
      _showPrompt(REMOVE_COLLECTION).then(function (response) {
        if (response) {
          CollectIndexedDbService.removeCollection(collect.code);
          _listCollections();
          _messages(MESSAGE_REMOVE_SUCCESS)
        } else {
          _messages(MESSAGE_REMOVE_FAILED)
        }
        delete self.collect;
      });
    }

    function play(activity) {
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
      _messages(MESSAGE_INITIALIZE)
    }

    function newCollection() {
      self.selectedCollection = OfflineActivityCollection.fromJson({}, self.user.email);
      self.selectedCollection.code = new ObjectId().toString();
      self.commands.splice(0, self.commands.length);
      _addButtonCANCEL();
      _addButtonSAVE();
    }

    function _addButtonSAVE() {
      self.commands.push({icon: 'save', theme: PRINCIPAL_THEME, action: _save});
    }

    function _addButtonADD() {
      self.commands.push({icon: 'add', theme: PRINCIPAL_THEME, action: newCollection});
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

    function _confirmEmail(email) {
      return self.collect.userEmail === email;
    }

    function saveCollection(collect, index) {
      self.collect = collect.toJSON();
      _showPrompt(SEND_COLLECTION).then(function (response) {
        if (response) {
          ActivityCollectionRestService.saveOffline(collect.toJSON()).then(function () {
            self.removeCollection(index);
            _messages(MESSAGE_SEND_SUCCESS);
            _updateIndexedDB();
            onInit();
          }).catch(function () {
            _messages(MESSAGE_SEND_FAILED);
          });
        } else {
          _messages(MESSAGE_SEND_FAILED);
        }
        delete self.collect;
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

    function _showPrompt(data) {
      if (!data) data = NEW_COLLECTION;
      var confirm = $mdDialog.prompt()
        .title(data.title)
        .textContent(data.textContent)
        .placeholder(data.placeholder)
        .required(data.required)
        .ariaLabel(data.ariaLabel)
        .ok(data.ok)
        .cancel(data.cancel);

      return $mdDialog.show(confirm).then(function (result) {
        return data.action(result);
      }, function () {
        return false;
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
      }
    }

    function _messages(text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position(POSITION)
          .hideDelay(DELAY)
      );
    }

  }
})();