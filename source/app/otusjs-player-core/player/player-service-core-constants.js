(function () {

  'use strict';
  angular.module('otusjs.player.core.player')
    .constant('PLAYER_SERVICE_CORE_CONSTANTS',{

      REASONS_TO_LIVE_PLAYER: {
        IS_NOT_ME: {
          icon:{
            name: 'thumb_up',
            color: "green",
          },
          highlightedText: {
            text: 'Obrigado pela notificação.',
            color: "#66b266"
          },
        },
        GET_OUT_WITHOUT_SAVE: {
          icon:{
            name: 'highlight_off',
            color: "orange",
          },
          highlightedText: {
            text: 'Você saiu sem salvar a atividade.',
            color: "orange"
          }
        },
        SAVE: {
          icon:{
            name: 'save',
            color: "#00786c",
          },
          highlightedText: {
            text: 'Você salvou a atividade, porém NÃO finalizou.',
            color: "#009688"
          },
        },
        FINALIZE: {
          icon:{
            name: 'check_circle',
            color: "blue"
          },
          highlightedText: {
            text: 'Você finalizou a atividade.',
            color: "dodgerblue"
          },
          text: ['Obrigado.']
        },
        ALREADY_FINALIZED: {
          icon:{
            name: 'check_circle',
            color: "blue"
          },
          highlightedText: {
            text: 'Você já finalizou esta atividade.',
            color: "dodgerblue"
          },
          text: [
            'Se quiser preenchê-la novamente, entre em contato com seu centro.',
            'Obrigado.'
          ]
        },
        ERROR: {
          icon:{
            name: 'sentiment_very_dissatisfied',
            color: "red"
          },
          highlightedText: {
            text: 'Este link expirou ou é inválido.',
            color: "lightcoral"
          },
          text: [
            'Entre em contato com seu projeto para obter novo link de acesso.',
            'Obrigado.'
          ]
        }
      }

    });
})();