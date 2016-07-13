(function() {
    'use strict';

    angular
        .module('otus.component.preview')
        .component('otusTextQuestion', {
            templateUrl: 'app/components/preview/survey-item/question/text/text-question-template.html',
            controller: TextQuestionController,
            bindings: {
                itemData: '<',
                onUpdate: '&'
            }
        });

    function TextQuestionController() {
        var self = this;

        self.update = function() {
            self.onUpdate({
                valueType: 'answer',
                value: self.answer
            });
        };
    }

})();
