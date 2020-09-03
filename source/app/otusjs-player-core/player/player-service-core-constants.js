(function () {

  'use strict';
  angular.module('otusjs.player.core.player')
    .constant('PLAYER_SERVICE_CORE_CONSTANTS',{

      REASONS_TO_LIVE_PLAYER: {
        IS_NOT_ME: 'Nao sou eu.',
        GET_OUT: "Você saiu.",
        CANCEL: "Você saiu sem salvar a atividade.",
        SAVE: "Você salvou a atividade, porém não finalizou.",
        FINALIZE: "Você finalizou a atividade.",
        ALREADY_FINALIZED: 'Você ja finalizou esta atividade.<br>Para preenchê-la novamente, entre em contato com seu centro.<br>Obrigado.'
      }

    });
})();