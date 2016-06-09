!function(){"use strict";angular.module("otus.core.preview",["otus.preview"])}(),function(){"use strict";angular.module("otus.preview",[])}(),function(){"use strict";function CoreSheetContentPreviewService(CoreTemplateLoaderService){function startSheet(scopeReference,elementReference,template){CoreTemplateLoaderService.loadInitForJsonFile(scopeReference,elementReference,template)}var self=this;self.startSheet=startSheet}angular.module("otus.core.preview").service("CoreSheetContentPreviewService",CoreSheetContentPreviewService),CoreSheetContentPreviewService.$inject=["CoreTemplateLoaderService"]}(),function(){"use strict";function CoreTemplateLoaderService($compile,$templateRequest,$templateCache,TemplateItemFactory){function loadInitForJsonFile(scopeReference,elementReference,template){scope=scopeReference,element=elementReference,template=template,buildItemTemplate(template)}function buildItemTemplate(template){if(template.itemContainer.length>0){var questions=template.itemContainer;for(var key in questions)TemplateItemFactory.create(scope,element,questions[key])}}var self=this,scope=null,element=null;self.loadInitForJsonFile=loadInitForJsonFile}angular.module("otus.core.preview").service("CoreTemplateLoaderService",CoreTemplateLoaderService),CoreTemplateLoaderService.$inject=["$compile","$templateRequest","$templateCache","TemplateItemFactory"]}(),function(){"use strict";function TemplateItemFactory($compile,$templateRequest,$templateCache,CalendarQuestionTemplateFactory){function create(scope,element,item){question=templateFactories[item.objectType].create(scope,element,item),console.log(question),loadItem(question,scope)}function loadItem(question,scope){var templateCompiled=compileTemplate(question.getTemplate(),scope);$("#survey-preview").append(templateCompiled)}function compileTemplate(html,scope){return $compile(html)(scope)}var self=this,question=null,templateFactories={CalendarQuestion:CalendarQuestionTemplateFactory};return self.create=create,self}angular.module("otus.core.preview").factory("TemplateItemFactory",TemplateItemFactory),TemplateItemFactory.$inject=["$compile","$templateRequest","$templateCache","CalendarQuestionTemplateFactory"]}(),function(){"use strict";function otusItemContainerPreview(){var ddo={scope:{},templateUrl:"node_modules/otus-preview-js/app/ui-preview/item-container/item-container-preview.html",retrict:"E"};return ddo}angular.module("otus.preview").directive("otusItemContainerPreview",otusItemContainerPreview)}(),function(){"use strict";function otusSheetPreview(){var ddo={scope:{},templateUrl:"node_modules/otus-preview-js/app/ui-preview/sheet/sheet-preview-container.html",retrict:"E"};return ddo}angular.module("otus.preview").directive("otusSheetPreview",otusSheetPreview)}(),function(){"use strict";function imageItemPreview(){var ddo={scope:{},templateUrl:"node_modules/otus-preview-js/app/ui-preview/item/image/image-item-preview.html",retrict:"E"};return ddo}angular.module("otus.preview").directive("imageItemPreview",imageItemPreview)}(),function(){"use strict";function calendarQuestionPreview(){var ddo={scope:{},templateUrl:"node_modules/otus-preview-js/app/ui-preview/item/question/calendar/calendar-question-preview.html",retrict:"E"};return ddo}angular.module("otus.preview").directive("questionPreview",calendarQuestionPreview)}(),function(){"use strict";function textItemPreview(){var ddo={scope:{},templateUrl:"node_modules/otus-preview-js/app/ui-preview/item/text/text-item-preview.html",retrict:"E"};return ddo}angular.module("otus.preview").directive("textItemPreview",textItemPreview)}(),function(){"use strict";function directive(){var ddo={scope:{},templateUrl:"node_modules/otus-preview-js/app/ui-preview/item/question/calendar/calendar-question-preview.html",retrict:"E"};return ddo}angular.module("otus.preview").directive("otusPreviewCalendarQuestion",directive)}(),function(){"use strict";function CalendarQuestionTemplateFactory(){function create(scope,element,item){return new CalendarQuestionTemplate(scope,element,item)}var self=this;return self.create=create,self}function CalendarQuestionTemplate(scope,element,item){function getClassName(){return"CalendarQuestionTemplate"}function getScope(){return scope.uuid}function getExtents(){return self.extents}function getObjectType(){return self.objectType}function getTemplateID(){return self.templateID}function getformattedText(){return self.label}function getTemplate(){return"<otus-preview-calendar-question></otus-preview-calendar-question>"}var self=this;self.extents=item.extents,self.objectType=item.objectType,self.templateID=item.templateID,self.dataType=item.dataType,self.label=item.label.ptBR.formattedText,self.getClassName=getClassName,self.getScope=getScope,self.getExtents=getExtents,self.getObjectType=getObjectType,self.getTemplateID=getTemplateID,self.getformattedText=getformattedText,self.getTemplate=getTemplate}angular.module("otus.preview").factory("CalendarQuestionTemplateFactory",CalendarQuestionTemplateFactory)}();