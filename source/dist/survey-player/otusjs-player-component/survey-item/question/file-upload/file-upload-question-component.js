(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusFileUploadQuestion', {
      template:'<md-content layout-padding><div layout="row"><md-button class="md-primary md-raised" upload-tool="$ctrl.uploadConfig" ng-disabled="$ctrl.view"><md-icon md-font-set="material-icons">attach_file</md-icon>Adicionar Arquivos</md-button><md-button class="md-primary md-raised" ng-show="$ctrl.pendingList.length != 0" ng-click="$ctrl.uploadMultiple()" ng-disabled="$ctrl.pendingCounter > 0"><md-icon md-font-set="material-icons">attach_file</md-icon>Enviar Todos</md-button></div><div md-whiteframe="3" layout="column" md-padding><md-list layout="column" class="md-dense" flex><md-subheader class="md-no-sticky">Arquivos a Enviar</md-subheader><md-list-item ng-hide="$ctrl.pendingList.length != 0"><p>Nenhum arquivo selecionado</p><md-divider></md-divider></md-list-item><md-content ng-show="$ctrl.pendingList.length != 0" style="max-height: 300px;"><md-list-item ng-repeat="file in $ctrl.pendingList track by $index"><span class="md-subhead md-truncate">{{ file.name }}</span><div class="uploading-panel" ng-if="file.status == \'uploading\'"><md-progress-circular class="md-secondary" md-mode="indeterminate" md-diameter="20px" ng-if="file.status == \'uploading\'"></md-progress-circular></div><div class="action-panel" flex="20" ng-if="!$ctrl.view"><md-button class="md-icon-button md-secondary" aria-label="Enviar Arquivo" ng-click="$ctrl.uploadFile($index)" ng-hide="file.status == \'uploading\'" ng-disabled="$ctrl.pendingCounter >= 5"><md-icon md-font-set="material-icons">file_upload</md-icon><md-tooltip md-direction="bottom">Enviar Arquivo</md-tooltip></md-button><md-button class="md-icon-button md-secondary" aria-label="Excluir" ng-click="$ctrl.popFromPending($index)" ng-hide="file.status == \'uploading\'"><md-icon md-font-set="material-icons">delete</md-icon><md-tooltip md-direction="bottom">Excluir</md-tooltip></md-button></div></md-list-item></md-content><md-divider></md-divider><md-divider></md-divider><md-content ng-show="$ctrl.sentFiles.length != 0" style="background-color:#ebebeb; margin-top: 25px;"><md-subheader class="md-no-sticky">Arquivos Enviados</md-subheader><md-list-item class="md-2-line" ng-repeat="file in $ctrl.sentFiles track by $index"><div class="md-list-item-text" layout="column"><span class="md-subhead md-truncate">{{ file.name }}</span><p>Tamanho: {{ file.printableSize }}</p></div><div class="action-panel" flex="20"><md-button class="md-icon-button md-secondary" aria-label="Download" ng-click="$ctrl.downloadFile($index)"><md-icon md-font-set="material-icons">file_download</md-icon><md-tooltip md-direction="bottom">Download</md-tooltip></md-button><md-button class="md-icon-button md-secondary" aria-label="Delete" ng-if="!$ctrl.view" ng-click="$ctrl.deleteFile($index, $event)"><md-icon md-font-set="material-icons">delete_forever</md-icon><md-tooltip md-direction="bottom">Apagar Arquivo</md-tooltip></md-button></div></md-list-item><md-divider></md-divider></md-content></md-list></div></md-content>',
      controller: "otusFileUploadQuestionCtrl as $ctrl",
      bindings: {
        itemData: '<',
        onUpdate: '&'
      },
      require: {
        otusQuestion: '^otusQuestion'
      }
    }).controller("otusFileUploadQuestionCtrl", Controller);

  Controller.$inject = [
    '$mdToast',
    '$q',
    '$mdDialog',
    'otusjs.player.data.activity.CurrentItemService',
    'otusjs.utils.FileUploadFactory',
    '$scope',
    'otusjs.surveyItem.customAnswer.FileUploadAnswerFactory',
  ];

  function Controller($mdToast, $q, $mdDialog, CurrentItemService, FileUploadService, $scope, FileUploadAnswerFactory) {
    var self = this;

    var _uploadInterface;
    var _questionID;
    var _pendingArrayControl;
    var _deleteDialog;
    var _deleteError;

    /* Public Interface */
    self.$onInit = onInit;
    self.popFromPending = popFromPending;
    self.uploadFile = uploadFile;
    self.uploadMultiple = uploadMultiple;
    self.downloadFile = downloadFile;
    self.deleteFile = deleteFile;
    self.clear = clear;
    self.cancelUpload = cancelUpload;
    self.view = false;

    function onInit() {
      var answerFiles = CurrentItemService.getFilling(self.itemData.templateID).answer.value || [];
      self.sentFiles = FileUploadAnswerFactory.buildFromJson(answerFiles);
      self.pendingList = [];
      self.promise = 0;
      self.uploadConfig = {
        callback: _populatePendingList,
        type: 'any',
        multiple: true
      };
      self.otusQuestion.answer = self;

      _uploadInterface = FileUploadService.getUploadInterface();
      _questionID = CurrentItemService.getItemsByTemplateID(self.itemData.templateID);
      _deleteDialog = _createDeleteDialog();
      _pendingArrayControl = 0;
      self.pendingCounter = 0;
    }


    function popFromPending(idx) {
      return self.pendingList.splice(idx, 1);
    }

    function cancelUpload(controlIndex) {
      _uploadInterface.cancelRequest(controlIndex);
      _updateView();
    }

    function uploadMultiple() {
      for (var i = 0; i < self.pendingList.length; i++) {
        uploadFile(i);
      }
    }

    function uploadFile(idx) {
      var file = self.pendingList[idx];
      file.status = 'uploading';

      self.pendingCounter++;
      if (!_uploadInterface) _uploadInterface = FileUploadService.getUploadInterface();

      _uploadInterface.uploadFile(file, _questionID)
        .then(function (response) {
          var _oid = response.data.data;
          self.pendingCounter--;
          var fileInfo = _removeFile(file);
          fileInfo.oid = _oid;
          self.sentFiles.push(FileUploadAnswerFactory.buildAnswer(fileInfo));
          _updateView();
          _updateAnswer();
        }, function (err) {
          _toastError('enviar');
          file.status = 'pending';
          self.pendingCounter--;
        });
    }

    function _removeFile(file) {
      var idx = self.pendingList.indexOf(file);
      return self.pendingList.splice(idx, 1)[0];
    }

    function downloadFile(idx) {
      var fileInfo = self.sentFiles[idx];
      _uploadInterface.getFile(fileInfo)
        .then(function (responseBlob) {
          var link = document.createElement('a');
          var downloadUrl = URL.createObjectURL(responseBlob);
          link.setAttribute('href', downloadUrl);
          link.download = responseBlob.name;
          document.body.appendChild(link);
          link.click();
        }, function (err) {
          _toastError('transferir');
        });
    }

    function deleteFile(idx) {
      var file = self.sentFiles[idx];
      _showConfirm(event).then(function () {
        _uploadInterface.deleteFile(file.oid)
          .then(function (response) {
            self.sentFiles.splice(idx, 1);
            _updateAnswer();
          }, function (err) {
            _toastError('excluir');
          });
      }, function () {
      });
    }

    var _toastLocker = {
      enviar: false,
      transferir: false,
      excluir: false
    };

    function _toastError(action) {
      if (!_toastLocker[action]) {
        _toastLocker[action] = true;
        var toast = $mdToast.show($mdToast.simple()
          .textContent('Erro ao ' + action + ' um ou mais arquivos!')
          .hideDelay(3000));
        toast.then(function (log) {
          _toastLocker[action] = false;
        });
      }
    }

    function _showConfirm() {
      return $mdDialog.show(_deleteDialog);
    }

    function _createDeleteDialog() {
      return $mdDialog.confirm()
        .title('Exclusão de Arquivo')
        .textContent('O arquivo será excluído permanentemente da base de dados.')
        .ariaLabel('Confirmar exclusão')
        .ok('Excluir Arquivo')
        .cancel('Cancelar');
    }

    function _populatePendingList(filesArray) {
      self.pendingList = self.pendingList.concat(filesArray.map(function (file) {
        file.status = 'pending';
        file.control = _pendingArrayControl++;
        return file;
      }));
      _updateView();
    }

    function _updateView() {
      var phase = $scope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        return;
      } else {
        $scope.$apply();
      }
    }

    function _updateAnswer() {
      if (self.sentFiles.length) {
        self.onUpdate({
          valueType: 'answer',
          value: self.sentFiles
        });
      } else {
        self.onUpdate({
          valueType: 'answer',
          value: {}
        });
      }
    }

    function clear() {
      self.pendingList = [];
      _pendingArrayControl = 0;
    }

  }
}());
