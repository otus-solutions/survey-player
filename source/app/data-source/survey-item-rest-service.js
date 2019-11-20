(function() {
  'use strict';

  angular
    .module('survey.player.datasource')
    .service('SurveyItemRestService', Service);

  Service.$inject = [
    '$q',
    'DatasourceResourceFactory'
  ];

  function Service($q, DatasourceResourceFactory) {
    var self = this;
    var _rest = null;

    /* Public methods */
    self.initialize = initialize;
    self.list = list;
    self.getByID = getByID;

    function initialize() {
      _rest = DatasourceResourceFactory.create();
    }

    function list() {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }

      return _rest.list();
    }

    function getByID(id) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }

      return _rest.getByID(id);
    }
  }
}());