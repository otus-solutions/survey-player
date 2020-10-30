var version = "1.5.1";
var CACHE_PREFIX = 'survey-player';
var CACHE_NAME = CACHE_PREFIX + version;

var CACHED_FILES = [
  "manifest.json",
  "/node_modules/jquery/dist/jquery.min.js",
  "/node_modules/angular/angular.min.js",
  "/node_modules/angular-ui-router/release/angular-ui-router.min.js",
  "/node_modules/angular-ui-mask/dist/mask.js",
  "/node_modules/angular-cookies/angular-cookies.min.js",
  "/node_modules/angular-material/angular-material.min.js",
  "/node_modules/angular-aria/angular-aria.min.js",
  "/node_modules/angular-animate/angular-animate.min.js",
  "/node_modules/angular-messages/angular-messages.min.js",
  "/node_modules/angular-resource/angular-resource.min.js",
  "/node_modules/angular-sanitize/angular-sanitize.min.js",
  "/node_modules/lokijs/build/lokijs.min.js",
  "/node_modules/lokijs/build/loki-indexed-adapter.min.js",
  "/node_modules/lokijs/src/loki-angular.js",
  "/node_modules/alasql/dist/alasql.min.js",
  "/node_modules/angular-bind-html-compile-ci-dev/angular-bind-html-compile.js",
  "/node_modules/angular-mousewheel/mousewheel.js",
  "/node_modules/otus-model-js/dist/otus-model.js",
  "/node_modules/otus-model-js/dist/st-utils.min.js",
  "/node_modules/fuse.js/src/fuse.min.js",
  "/node_modules/otus-validation-js/dist/otus-validation-min.js",
  "/node_modules/please-wait/build/please-wait.css",
  "/node_modules/trail-js/dist/style.css",
  "/node_modules/angular-material/angular-material.min.css",
  "/app/app.js",
  "/app/static-resource/stylesheet/please-wait-style.css",
  "/app/static-resource/image/coruja_pesquisadora.png",
  "/app/assets/MaterialIcons-Regular.woff2",
  "/app/assets/otusjs-player-standalone.css",
  "/app/assets/fonts-googleapis-css.css",
  "/app/assets/material-icons.css",
  "/app/assets/otusjs-player.css",
  "/app/assets/otusjs-survey-item.css",
  "/app/assets/otusjs-viewer.css",
  "/app/assets/icons/survey-player.png",
  "/app/service-worker.js",
  "/app/activity-rest-service.js",
  "/app/activity-collection-rest-service.js",
  "/app/activity-remote-storage-service.js",
  "/app/activity-collection-service.js",
  "/app/activity-repository-service.js",
  "/app/indexed-db-service.js",
  "/app/storage-loader-service.js",
  "/app/survey-player-api/survey-api-module.js",
  "/app/survey-player-api/survey-api-service.js",
  "/app/storage/storage-module.js",
  "/app/storage/activity-local-storage-service.js",
  "/app/storage/activity-indexed-db-storage-service.js",
  "/app/storage/collect-indexed-db-storage-service.js",
  "/app/data-source/datasource-module.js",
  "/app/data-source/datasource-resource-factory.js",
  "/app/data-source/survey-item-rest-service.js",
  "/app/data-source/survey-item-datasource-service.js",
  "/app/file-upload/file-upload-module.js",
  "/app/file-upload/upload-resource-factory.js",
  "/app/file-upload/file-upload-rest-service.js",
  "/app/file-upload/file-upload-datasource-service.js",
  "/app/static-variable/static-variable-module.js",
  "/app/static-variable/static-variable-resource-factory.js",
  "/app/static-variable/static-variable-rest-service.js",
  "/app/static-variable/static-variable-data-source-request-factory.js",
  "/app/static-variable/static-variable-data-source-service.js",
  "/app/config/otusjs-config-module.js",
  "/app/config/state-configuration.js",
  "/app/config/theme-configuration.js",
  "/app/config/locale-configuration.js",
  "/app/misc/otusjs-player-data-module.js",
  "/app/misc/fake-data-service.js",
  "/app/utils/connection-icon-component.js",
  "/app/utils/activity-status-constant.js",
  "/app/otusjs-player-viewer/otusjs-player-viewer-module.js",
  "/app/otusjs-player-viewer/sheet-view-controller.js",
  "/app/otusjs-player-viewer/loading-screen-service.js",
  "/app/survey-player-client/survey-player-client-module.js",
  "/app/survey-player-client/interceptor-factory.js",
  "/app/survey-player-client/survey-player-client-config.js",
  "/app/survey-player-client/survey-player-client-service.js",
  "/app/player-module.js",
  "/app/player/pre-player-step-service.js",
  "/app/player/save-player-step-service.js",
  "/app/player/stop-player-step-service.js",
  "/app/player/player-service.js",
  "/app/otusjs-player-component/component-module.js",
  "/app/otusjs-player-component/question-icons/icon-constant.js",
  "/app/otusjs-player-component/comment/comment-component.js",
  "/app/otusjs-player-component/label/otus-label-component.js",
  "/app/otusjs-player-component/metadata/metadata-component.js",
  "/app/otusjs-player-component/viewer/viewer-component.js",
  "/app/otusjs-player-component/viewer/filters/viewer-filters.js",
  "/app/otusjs-player-component/survey-playing/survey-playing-component.js",
  "/app/otusjs-player-component/viewer/survey-item-views/survey-item-view-component.js",
  "/app/otusjs-player-component/viewer/survey-item-views/calendar-question-view-component.js",
  "/app/otusjs-player-component/viewer/survey-item-views/file-upload-question-view-component.js",
  "/app/otusjs-player-component/viewer/survey-item-views/question-view-component.js",
  "/app/otusjs-player-component/viewer/survey-item-views/checkbox-question-view-component.js",
  "/app/otusjs-player-component/viewer/survey-item-views/single-selection-question-view-component.js",
  "/app/otusjs-player-component/viewer/survey-item-views/grid-integer-question-view-component.js",
  "/app/otusjs-player-component/viewer/survey-item-views/grid-text-question-view-component.js",
  "/app/otusjs-player-component/viewer/survey-item-views/image-item-view-component.js",
  "/app/otusjs-player-component/viewer/survey-item-views/text-item-view-component.js",
  "/app/otusjs-player-component/viewer/survey-item-views/time-question-view-component.js",
  "/app/otusjs-player-component/static-variable/static-variable-component.js",
  "/app/otusjs-player-component/player-commander/player-commander-component.js",
  "/app/otusjs-player-component/player-display/player-display-component.js",
  "/app/otusjs-player-component/survey-back-cover/survey-back-cover-component.js",
  "/app/otusjs-player-component/survey-cover/survey-cover-component.js",
  "/app/otusjs-player-component/survey-header/survey-header-component.js",
  "/app/otusjs-player-component/survey-item/survey-item-component.js",
  "/app/otusjs-player-component/survey-item/question/question-component.js",
  "/app/otusjs-player-component/survey-item/question/calendar/calendar-question-component.js",
  "/app/otusjs-player-component/survey-item/question/calendar/calendar-question-view-component.js",
  "/app/otusjs-player-component/survey-item/question/integer/integer-question-component.js",
  "/app/otusjs-player-component/survey-item/question/integer/integer-question-view-component.js",
  "/app/otusjs-player-component/survey-item/question/integer/ui-integer-directive.js",
  "/app/otusjs-player-component/survey-item/question/decimal/decimal-question-component.js",
  "/app/otusjs-player-component/survey-item/question/decimal/decimal-question-view-component.js",
  "/app/otusjs-player-component/survey-item/question/single-selection/single-selection-question-component.js",
  "/app/otusjs-player-component/survey-item/question/single-selection/single-selection-question-view-component.js",
  "/app/otusjs-player-component/survey-item/question/checkbox/checkbox-question-component.js",
  "/app/otusjs-player-component/survey-item/question/checkbox/checkbox-question-view-component.js",
  "/app/otusjs-player-component/survey-item/question/text/text-question-component.js",
  "/app/otusjs-player-component/survey-item/question/text/text-question-view-component.js",
  "/app/otusjs-player-component/survey-item/question/email/email-question-component.js",
  "/app/otusjs-player-component/survey-item/question/email/email-question-view-component.js",
  "/app/otusjs-player-component/survey-item/question/time/time-question-component.js",
  "/app/otusjs-player-component/survey-item/question/time/time-question-view-component.js",
  "/app/otusjs-player-component/survey-item/question/phone/phone-question-component.js",
  "/app/otusjs-player-component/survey-item/question/phone/phone-question-view-component.js",
  "/app/otusjs-player-component/survey-item/question/file-upload/file-upload-question-component.js",
  "/app/otusjs-player-component/survey-item/question/file-upload/file-upload-question-view-component.js",
  "/app/otusjs-player-component/survey-item/question/autocomplete/autocomplete-question-component.js",
  "/app/otusjs-player-component/survey-item/question/autocomplete/autocomplete-question-view-component.js",
  "/app/otusjs-player-component/survey-item/question/grid-text/grid-text-question-component.js",
  "/app/otusjs-player-component/survey-item/question/grid-text/grid-text-question-view-component.js",
  "/app/otusjs-player-component/survey-item/question/grid-integer/grid-integer-question-component.js",
  "/app/otusjs-player-component/survey-item/question/grid-integer/grid-integer-question-view-component.js",
  "/app/otusjs-player-component/survey-item/question/grid-integer/numbers-only-directive.js",
  "/app/otusjs-player-component/survey-item/misc/misc-item-component.js",
  "/app/otusjs-player-component/survey-item/misc/image/image-item-component.js",
  "/app/otusjs-player-component/survey-item/misc/text/text-item-component.js",
  "/app/otusjs-player-component/validation-error/validation-error-component.js",
  "/app/otusjs-player-component/question-menu/question-menu-component.js",
  "/app/otusjs-player-component/answer-view/answer-view-component.js",
  "/app/otusjs-player-component/survey-list/survey-list-component.js",
  "/app/otusjs-player-component/activity-collect/group/activity-group-collect-component.js",
  "/app/otusjs-player-component/activity-collect/activity-collect-component.js",
  "/app/otusjs-player-core/player/on-processing-service.js",
  "/app/otusjs-player-core/core-module.js",
  "/app/otusjs-player-core/phase/phase-module.js",
  "/app/otusjs-player-core/phase/action-pipe-service.js",
  "/app/otusjs-player-core/phase/ahead/ahead-action-service.js",
  "/app/otusjs-player-core/phase/ahead/execution-ahead-action-service.js",
  "/app/otusjs-player-core/phase/ahead/post-ahead-action-service.js",
  "/app/otusjs-player-core/phase/ahead/pre-ahead-action-service.js",
  "/app/otusjs-player-core/phase/back/back-action-service.js",
  "/app/otusjs-player-core/phase/back/execution-back-action-service.js",
  "/app/otusjs-player-core/phase/back/post-back-action-service.js",
  "/app/otusjs-player-core/phase/back/pre-back-action-service.js",
  "/app/otusjs-player-core/phase/eject/eject-action-service.js",
  "/app/otusjs-player-core/phase/eject/execution-eject-action-service.js",
  "/app/otusjs-player-core/phase/eject/post-eject-action-service.js",
  "/app/otusjs-player-core/phase/eject/pre-eject-action-service.js",
  "/app/otusjs-player-core/phase/play/play-action-service.js",
  "/app/otusjs-player-core/phase/play/execution-play-action-service.js",
  "/app/otusjs-player-core/phase/play/post-play-action-service.js",
  "/app/otusjs-player-core/phase/play/pre-play-action-service.js",
  "/app/otusjs-player-core/phase/save/save-action-service.js",
  "/app/otusjs-player-core/phase/save/execution-save-action-service.js",
  "/app/otusjs-player-core/phase/save/post-save-action-service.js",
  "/app/otusjs-player-core/phase/save/pre-save-action-service.js",
  "/app/otusjs-player-core/phase/start/execution-player-start-action-service.js",
  "/app/otusjs-player-core/phase/start/player-start-action-service.js",
  "/app/otusjs-player-core/phase/start/post-player-start-action-service.js",
  "/app/otusjs-player-core/phase/start/pre-player-start-action-service.js",
  "/app/otusjs-player-core/phase/stop/execution-stop-action-service.js",
  "/app/otusjs-player-core/phase/stop/stop-action-service.js",
  "/app/otusjs-player-core/phase/stop/post-stop-action-service.js",
  "/app/otusjs-player-core/phase/stop/pre-stop-action-service.js",
  "/app/otusjs-player-core/player/player-module.js",
  "/app/otusjs-player-core/player/player-configuration-service.js",
  "/app/otusjs-player-core/player/player-service.js",
  "/app/otusjs-player-core/renderer/renderer-module.js",
  "/app/otusjs-player-core/renderer/html-builder-service.js",
  "/app/otusjs-player-core/renderer/tag-component-builder-service.js",
  "/app/otusjs-player-core/scaffold/scaffold-module.js",
  "/app/otusjs-player-core/scaffold/chain-factory.js",
  "/app/otusjs-player-core/scaffold/chain-link-factory.js",
  "/app/otusjs-player-core/step/step-module.js",
  "/app/otusjs-player-core/step/survey/initialize-survey-activity-step-service.js",
  "/app/otusjs-player-core/step/survey/finalize-survey-activity-step-service.js",
  "/app/otusjs-player-core/step/survey/save-survey-activity-step-service.js",
  "/app/otusjs-player-core/step/survey/load-survey-activity-step-service.js",
  "/app/otusjs-player-core/step/survey/load-survey-activity-cover-step-service.js",
  "/app/otusjs-player-core/step/survey-item/load-next-item-step-service.js",
  "/app/otusjs-player-core/step/survey-item/load-previous-item-step-service.js",
  "/app/otusjs-player-core/step/survey-item/update-item-tracking-step-service.js",
  "/app/otusjs-player-core/step/survey-item-data/apply-answer-step-service.js",
  "/app/otusjs-player-core/step/survey-item-data/clear-skipped-answer-step-service.js",
  "/app/otusjs-player-core/step/survey-item-validation/handle-validation-error-step-service.js",
  "/app/otusjs-player-core/step/survey-item-validation/read-validation-error-step-service.js",
  "/app/otusjs-player-core/step/survey-item-validation/run-validation-step-service.js",
  "/app/otusjs-player-core/step/survey-item-validation/setup-validation-step-service.js",
  "/app/otusjs-player-data/data-module.js",
  "/app/otusjs-player-data/activity/activity-module.js",
  "/app/otusjs-player-data/activity/activity-facade-service.js",
  "/app/otusjs-player-data/activity/current-item-service.js",
  "/app/otusjs-player-data/activity/current-survey-service.js",
  "/app/otusjs-player-data/navigation/navigation-module.js",
  "/app/otusjs-player-data/navigation/navigation-service.js",
  "/app/otusjs-player-data/navigation/route-service.js",
  "/app/otusjs-player-data/navigation/rule-service.js",
  "/app/otusjs-player-data/viewer/viewer-module.js",
  "/app/otusjs-player-data/viewer/survey-viewer-model-factory.js",
  "/app/otusjs-player-data/validation/validation-module.js",
  "/app/otusjs-player-data/validation/item-filling-validator-service.js",
  "/app/otusjs-player-component/home/survey-player-home-component.js",
  "/node_modules/please-wait/build/please-wait.min.js",
  "/node_modules/trail-js/dist/trail-min.js",
  "/app/utils/login-service.js",
  "/app/index.html"
];

self.addEventListener('install', function (e) {
  //todo this should be on activate only
  e.waitUntil(
    removeOldCacheFiles()
  );
  //

  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CACHED_FILES);
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    removeOldCacheFiles()
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method === 'GET') {
    var url = event.request.url.indexOf(self.location.origin) !== -1 ?
      event.request.url.split(`${self.location.origin}/`)[1] :
      event.request.url;

    if(url.indexOf("#/") !== -1){
      url = "index.html"
    }

    event.respondWith(
      //todo: this match should consider CACHE_NAME
      caches.match(url).then(function (response) {
        return response || fetch(event.request);
      })
    );
  }
});

function removeOldCacheFiles() {
  caches.keys().then(function (cacheNames) {
    return Promise.all(
      cacheNames.filter(function (cacheName) {
        // Return true if you want to remove this cache,
        // but remember that caches are shared across
        // the whole origin
        return (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME);
      }).map(function (cacheName) {
        return caches.delete(cacheName);
      })
    );
  })
}
