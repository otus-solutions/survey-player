(function () {
  'use strict';

  angular
    .module('otusjs.player.config')
    .constant('STATE', {
      MAIN: '/',
      BEGIN: '/begin',
      ERROR: '/error',
      HOME: '/home',
      PENDENT_ACTIVITIES: '/pendent',
      PLAY: '/play',
      FINISH: '/finish',

      PARTICIPANT_CONFIRMATION: '/participant-confirmation',
      PARTICIPANT_FINISH: '/participant-finish'
    });

}());
