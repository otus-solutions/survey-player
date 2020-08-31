(function () {
  'use strict';

  angular
    .module('otusjs.player.config')
    .constant('STATE', {
      MAIN: '/',
      BEGIN: '/begin',
      ERROR: '/error',
      HOME: '/home',
      PLAY: '/play',
      FINISH: '/finish',

      PARTICIPANT_CONFIRMATION: '/participant-confirmation',
      PARTICIPANT_FINISH: '/participant-finish'
    });

}());
