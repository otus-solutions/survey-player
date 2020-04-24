(function () {

  'use strict';

  angular.module('otusjs.player.standalone')
    .service('ServiceWorker', Service);

  Service.$inject = [];


  function Service() {
    var self = this;
    const CACHE = 'survey-player';

    self.deleteCache = deleteCache;

    self.register = register;
    self.unregister = unregister;



    function register() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js', {scope: '/'})
          .then(function () {
            console.info('Service Worker Registered');
          });
      }
    }

    function unregister() {
      return navigator.serviceWorker.getRegistrations().then(
        function (registrations) {
          if (registrations.length){
            for (let registration of registrations) {
              registration.unregister();
            }
          }
        });
    }


    function deleteCache(cacheName) {
      caches.delete(cacheName);
    }

    function _clear() {
      caches.keys().then(names => {
        var index = names.indexOf(CACHE);
        if (index > -1) {
          names.splice(index, 1);
          names.forEach(name => {
            deleteCache(name);
          })
        }
      });
    }


  }
})();