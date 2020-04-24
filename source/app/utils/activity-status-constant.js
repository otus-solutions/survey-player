(function () {

  'use strict';
  angular.module('otusjs.player.standalone')
    .constant('ACTIVITY_STATUS',{
      'CREATED': 'Criado',
      'INITIALIZED_OFFLINE': 'Iniciado offline',
      'INITIALIZED_ONLINE': 'Iniciado online',
      'OPENED': 'Aberto',
      'SAVED': 'Salvo',
      'FINALIZED': 'Finalizado',
    });
})();