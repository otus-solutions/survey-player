(function () {

  'use strict';
  angular.module('otusjs.player.core.player')
    .constant('PLAYER_SERVICE_CORE_CONSTANTS', {

      REASONS_TO_LIVE_PLAYER: {
        IS_NOT_ME: {
          icon: {
            name: 'thumb_up',
            color: "green",
          },
          highlightedText: {
            text: 'Obrigado pela notificação.',
            color: "#66b266"
          },
        },
        GET_OUT_WITHOUT_SAVE: {
          icon: {
            name: 'meeting_room',
            color: "orange",
          },
          highlightedText: {
            text: 'Você saiu sem salvar ou finalizar a atividade.',
            color: "orange"
          }
        },
        SAVE: {
          icon: {
            name: 'save',
            color: "#00786c",
          },
          highlightedText: {
            text: 'Sua atividade foi salva, porém ainda não foi finalizada.',
            color: "#009688"
          },
          text: ["Para finalizar, preencha o questionário até o final."]
        },
        FINALIZE: {
          icon: {
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
          icon: {
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
        UNAUTHORIZED: {
          icon: {
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
        },
        OFFLINE_ERROR: {
          icon: {
            name: 'sentiment_very_dissatisfied',
            color: "red"
          },
          highlightedText: {
            text: 'Erro ao conectar com o servidor',
            color: "lightcoral"
          },
          text: [
            'Verifique a conexão e tente de novo!',
            'Obrigado.'
          ]
        }
      }

    });
})();
