angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.carousel","ui.bootstrap.collapse","ui.bootstrap.dialog","ui.bootstrap.dropdownToggle","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.popover","ui.bootstrap.tabs","ui.bootstrap.tooltip","ui.bootstrap.transition"]);
angular.module("ui.bootstrap.tpls", ["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/dialog/message.html","template/pagination/pagination.html","template/popover/popover.html","template/tabs/pane.html","template/tabs/tabs.html","template/tooltip/tooltip-popup.html"]);
angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse']).constant('accordionConfig', {  closeOthers: true}).controller('AccordionController', ['$scope', '$attrs', 'accordionConfig', function ($scope, $attrs, accordionConfig) {    this.groups = [];
    this.closeOthers = function(openGroup) {    var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
    if ( closeOthers ) { angular.forEach(this.groups, function (group) {   if ( group !== openGroup ) {     group.isOpen = false;}});}};
    this.addGroup = function(groupScope) {    var that = this;
    this.groups.push(groupScope);
    groupScope.$on('$destroy', function (event) { that.removeGroup(groupScope);});};
    this.removeGroup = function(group) {    var index = this.groups.indexOf(group);
    if ( index !== -1 ) { this.groups.splice(this.groups.indexOf(group), 1);}};}]);
angular.module('ui.bootstrap.accordion').directive('accordion', function () {  return {    restrict:'EA',    controller:'AccordionController',    transclude: true,    replace: false,    templateUrl: 'template/accordion/accordion.html'};});
angular.module('ui.bootstrap.accordion').directive('accordionGroup', ['$parse', '$transition', '$timeout', function($parse, $transition, $timeout) {  return {    require:'^accordion',   restrict:'EA',    transclude:true,   replace: true,     templateUrl:'template/accordion/accordion-group.html',    scope:{ heading:'@' },  link: function(scope, element, attrs, accordionCtrl) { var getIsOpen, setIsOpen;
 accordionCtrl.addGroup(scope);
 scope.isOpen = false;
 if ( attrs.isOpen ) {   getIsOpen = $parse(attrs.isOpen);
   setIsOpen = getIsOpen.assign;
   scope.$watch( function watchIsOpen() { return getIsOpen(scope.$parent); },     function updateOpen(value) { scope.isOpen = value; });
   scope.isOpen = getIsOpen ? getIsOpen(scope.$parent) : false;}
 scope.$watch('isOpen', function(value) {   if ( value ) {     accordionCtrl.closeOthers(scope);}
   if ( setIsOpen ) {     setIsOpen(scope.$parent, value);}});}};}]);
angular.module("ui.bootstrap.alert", []).directive('alert', function () {  return {    restrict:'EA',    templateUrl:'template/alert/alert.html',    transclude:true,    replace:true,    scope:{ type:'=', close:'&'}};});
angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition']).controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function ($scope, $timeout, $transition, $q) {  var self = this,    slides = self.slides = [],    currentIndex = -1,    currentTimeout, isPlaying;
  self.currentSlide = null;
  self.select = function(nextSlide, direction) {    var nextIndex = slides.indexOf(nextSlide);
   if (direction === undefined) { direction = nextIndex > currentIndex ? "next" : "prev";}
    if (nextSlide && nextSlide !== self.currentSlide) { if ($scope.$currentTransition) {   $scope.$currentTransition.cancel();
      $timeout(goNext);} else {   goNext();}} function goNext() {  if (self.currentSlide && angular.isString(direction) && !$scope.noTransition && nextSlide.$element) { 
      nextSlide.$element.addClass(direction);
   nextSlide.$element[0].offsetWidth = nextSlide.$element[0].offsetWidth;       angular.forEach(slides, function(slide) {     angular.extend(slide, {direction: '', entering: false, leaving: false, active: false});});
   angular.extend(nextSlide, {direction: direction, active: true, entering: true});
   angular.extend(self.currentSlide||{}, {direction: direction, leaving: true});
   $scope.$currentTransition = $transition(nextSlide.$element, {});
      (function(next,current) {     $scope.$currentTransition.then( function(){ transitionDone(next, current); },  function(){ transitionDone(next, current); });
   }(nextSlide, self.currentSlide));} else {   transitionDone(nextSlide, self.currentSlide);}
 self.currentSlide = nextSlide;
 currentIndex = nextIndex; restartTimer();} function transitionDone(next, current) { angular.extend(next, {direction: '', active: true, leaving: false, entering: false});
 angular.extend(current||{}, {direction: '', active: false, leaving: false, entering: false});
 $scope.$currentTransition = null;}};
  self.indexOfSlide = function(slide) {    return slides.indexOf(slide);};
  $scope.next = function() {    var newIndex = (currentIndex + 1) % slides.length;
    return self.select(slides[newIndex], 'next');};
  $scope.prev = function() {    var newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;
    return self.select(slides[newIndex], 'prev');};
  $scope.$watch('interval', restartTimer); function restartTimer() {    if (currentTimeout) { $timeout.cancel(currentTimeout);} function go() { if (isPlaying) {   $scope.next();
   restartTimer();} else {   $scope.pause();}}
    var interval = +$scope.interval;
    if (!isNaN(interval) && interval>=0) { currentTimeout = $timeout(go, interval);}}
  $scope.play = function() {    if (!isPlaying) { isPlaying = true;
 restartTimer();}};
  $scope.pause = function() {    isPlaying = false;
    if (currentTimeout) { $timeout.cancel(currentTimeout);}};
  self.addSlide = function(slide, element) {    slide.$element = element;
    slides.push(slide);
   if(slides.length === 1 || slide.active) { self.select(slides[slides.length-1]);
 if (slides.length == 1) {   $scope.play();}} else { slide.active = false;}};
  self.removeSlide = function(slide) {   var index = slides.indexOf(slide);
    slides.splice(index, 1);
    if (slides.length > 0 && slide.active) { if (index >= slides.length) {   self.select(slides[index-1]);} else {   self.select(slides[index]);}}};}]).directive('carousel', [function() {  return {    restrict: 'EA',    transclude: true,    replace: true,    controller: 'CarouselController',    require: 'carousel',    templateUrl: 'template/carousel/carousel.html',    scope: { interval: '=', noTransition: '='}};}]).directive('slide', [function() {  return {    require: '^carousel',    restrict: 'EA',    transclude: true,    replace: true,    templateUrl: 'template/carousel/slide.html',    scope: { active: '='},    link: function (scope, element, attrs, carouselCtrl) { carouselCtrl.addSlide(scope, element);
  scope.$on('$destroy', function() {   carouselCtrl.removeSlide(scope);});
 scope.$watch('active', function(active) {   if (active) {     carouselCtrl.select(scope);}});}};}]);
angular.module('ui.bootstrap.collapse',['ui.bootstrap.transition']).directive('collapse', ['$transition', function($transition) {  var fixUpHeight = function(scope, element, height) {   element.removeClass('collapse');
    element.css({ height: height });
  var x = element[0].offsetWidth;
    element.addClass('collapse');};
  return {    link: function(scope, element, attrs) { var isCollapsed;
 var initialAnimSkip = true;
 scope.$watch(function (){ return element[0].scrollHeight; }, function (value) {        if (element[0].scrollHeight !== 0) {     if (!isCollapsed) {  fixUpHeight(scope, element, element[0].scrollHeight + 'px');}}});
 scope.$watch(attrs.collapse, function(value) {   if (value) {     collapse();} else {     expand();}});
 var currentTransition;
 var doTransition = function(change) {   if ( currentTransition ) {     currentTransition.cancel();}
   currentTransition = $transition(element,change);
   currentTransition.then( function() { currentTransition = undefined; },     function() { currentTransition = undefined; } );
   return currentTransition;};
 var expand = function() {   if (initialAnimSkip) {     initialAnimSkip = false;
     if ( !isCollapsed ) {  fixUpHeight(scope, element, 'auto');}} else {     doTransition({ height : element[0].scrollHeight + 'px' })
     .then(function() {      if ( !isCollapsed ) {    fixUpHeight(scope, element, 'auto');}});}
   isCollapsed = false;};
 var collapse = function() {   isCollapsed = true;
   if (initialAnimSkip) {     initialAnimSkip = false;
     fixUpHeight(scope, element, 0);} else {     fixUpHeight(scope, element, element[0].scrollHeight + 'px');
     doTransition({'height':'0'});}};}};}]);
var dialogModule = angular.module('ui.bootstrap.dialog', ['ui.bootstrap.transition']);
dialogModule.controller('MessageBoxController', ['$scope', 'dialog', 'model', function($scope, dialog, model){  $scope.title = model.title;
  $scope.message = model.message;
  $scope.buttons = model.buttons;
  $scope.close = function(res){    dialog.close(res);};}]);
dialogModule.provider("$dialog", function(){  	var defaults = {		backdrop: true,		modalClass: 'modal',		backdropClass: 'modal-backdrop',    transitionClass: 'fade',    triggerClass: 'in',		resolve:{},		backdropFade: false,		modalFade:false,		keyboard: true, 		backdropClick: true     };
	var globalOptions = {};
  	this.options = function(value){		globalOptions = value;};
  	this.$get = ["$http", "$document", "$compile", "$rootScope", "$controller", "$templateCache", "$q", "$transition",  function ($http, $document, $compile, $rootScope, $controller, $templateCache, $q, $transition) {		var body = $document.find('body');
		function createElement(clazz) {			var el = angular.element("<div>");
			el.addClass(clazz); return el;}
       		function Dialog(opts) { var self = this, options = this.options = angular.extend({}, defaults, globalOptions, opts);
 this.backdropEl = createElement(options.backdropClass);
 if(options.backdropFade){   this.backdropEl.addClass(options.transitionClass);
   this.backdropEl.removeClass(options.triggerClass);}
 this.modalEl = createElement(options.modalClass);
 if(options.modalFade){   this.modalEl.addClass(options.transitionClass);
   this.modalEl.removeClass(options.triggerClass);}
 this.handledEscapeKey = function(e) {   if (e.which === 27) {     self.close();
     e.preventDefault();
     self.$scope.$apply();}};
 this.handleBackDropClick = function(e) {   self.close(); e.preventDefault();
   self.$scope.$apply();};}
   Dialog.prototype.isOpen = function(){ return this._open;};
  Dialog.prototype.open = function(templateUrl, controller){ var self = this, options = this.options;
 if(templateUrl){   options.templateUrl = templateUrl;}
 if(controller){   options.controller = controller;}
 if(!(options.template || options.templateUrl)) {   throw new Error('Dialog.open expected template or templateUrl, neither found. Use options or open method to specify them.');}
 this._loadResolves().then(function(locals) {   var $scope = locals.$scope = self.$scope = $rootScope.$new();
   self.modalEl.html(locals.$template);
   if (self.options.controller) {     var ctrl = $controller(self.options.controller, locals);
     self.modalEl.contents().data('ngControllerController', ctrl);}
   $compile(self.modalEl.contents())($scope);
   self._addElementsToDom();
      setTimeout(function(){     if(self.options.modalFade){ self.modalEl.addClass(self.options.triggerClass); }
     if(self.options.backdropFade){ self.backdropEl.addClass(self.options.triggerClass); }});
   self._bindEvents();});
 this.deferred = $q.defer();
 return this.deferred.promise;};
   Dialog.prototype.close = function(result){ var self = this;
 var fadingElements = this._getFadingElements();
 if(fadingElements.length > 0){   for (var i = fadingElements.length - 1; i >= 0; i--) {     $transition(fadingElements[i], removeTriggerClass).then(onCloseComplete);} return;}
 this._onCloseComplete(result); function removeTriggerClass(el){   el.removeClass(self.options.triggerClass);} function onCloseComplete(){   if(self._open){     self._onCloseComplete(result);}}};
    Dialog.prototype._getFadingElements = function(){ var elements = [];
 if(this.options.modalFade){   elements.push(this.modalEl);}
 if(this.options.backdropFade){   elements.push(this.backdropEl);}
 return elements;};
    Dialog.prototype._bindEvents = function() { if(this.options.keyboard){ body.bind('keydown', this.handledEscapeKey); }
 if(this.options.backdrop && this.options.backdropClick){ this.backdropEl.bind('click', this.handleBackDropClick); }};
    Dialog.prototype._unbindEvents = function() { if(this.options.keyboard){ body.unbind('keydown', this.handledEscapeKey); }
 if(this.options.backdrop && this.options.backdropClick){ this.backdropEl.unbind('click', this.handleBackDropClick); }};
    Dialog.prototype._onCloseComplete = function(result) { this._removeElementsFromDom();
 this._unbindEvents();
 this.deferred.resolve(result);};
    Dialog.prototype._addElementsToDom = function(){ body.append(this.modalEl);
 if(this.options.backdrop) { body.append(this.backdropEl); }
 this._open = true;};
    Dialog.prototype._removeElementsFromDom = function(){ this.modalEl.remove();
 if(this.options.backdrop) { this.backdropEl.remove(); }
 this._open = false;};
   Dialog.prototype._loadResolves = function(){ var values = [], keys = [], templatePromise, self = this;
 if (this.options.template) { templatePromise = $q.when(this.options.template);} else if (this.options.templateUrl) {   templatePromise = $http.get(this.options.templateUrl, {cache:$templateCache})
   .then(function(response) { return response.data; });}
 angular.forEach(this.options.resolve || [], function(value, key) {   keys.push(key);
   values.push(value);});
 keys.push('$template');
 values.push(templatePromise);
 return $q.all(values).then(function(values) {   var locals = {};
   angular.forEach(values, function(value, index) {     locals[keys[index]] = value;});
   locals.dialog = self;
   return locals;});};
   return {  dialog: function(opts){   return new Dialog(opts);},          messageBox: function(title, message, buttons){   return new Dialog({templateUrl: 'template/dialog/message.html', controller: 'MessageBoxController', resolve: {model: {     title: title,     message: message,     buttons: buttons}}});}};}];});
angular.module('ui.bootstrap.dropdownToggle', []).directive('dropdownToggle', 
['$document', '$location', '$window', function ($document, $location, $window) {  var openElement = null, close;
  return {    restrict: 'CA',    link: function(scope, element, attrs) { scope.$watch(function dropdownTogglePathWatch(){return $location.path();}, function dropdownTogglePathWatchAction() {   if (close) { close(); }});
 element.parent().bind('click', function(event) {   if (close) { close(); }});
 element.bind('click', function(event) {   event.preventDefault();
   event.stopPropagation();
   var iWasOpen = false;
   if (openElement) {     iWasOpen = openElement === element;
     close();}
   if (!iWasOpen){     element.parent().addClass('open');
     openElement = element;
     close = function (event) {  if (event) {    event.preventDefault();
    event.stopPropagation();}
  $document.unbind('click', close);
  element.parent().removeClass('open');
  close = null;
  openElement = null;};
     $document.bind('click', close);}});}};}]);
angular.module('ui.bootstrap.modal', []).directive('modal', ['$parse',function($parse) {  var backdropEl;
  var body = angular.element(document.getElementsByTagName('body')[0]);
  var defaultOpts = {    backdrop: true,    escape: true};
  return {    restrict: 'EA',    link: function(scope, elm, attrs) { var opts = angular.extend(defaultOpts, scope.$eval(attrs.uiOptions || attrs.bsOptions || attrs.options));
 var shownExpr = attrs.modal || attrs.show;
 var setClosed;
 if (attrs.close) {   setClosed = function() {     scope.$apply(attrs.close);};} else {   setClosed = function() {     scope.$apply(function() {  $parse(shownExpr).assign(scope, false);});};}
 elm.addClass('modal');
 if (opts.backdrop && !backdropEl) {   backdropEl = angular.element('<div class="modal-backdrop"></div>');
   backdropEl.css('display','none');
   body.append(backdropEl);} function setShown(shown) {   scope.$apply(function() {     model.assign(scope, shown);});} function escapeClose(evt) {   if (evt.which === 27) { setClosed(); }} function clickClose() {    setClosed();} function close() {   if (opts.escape) { body.unbind('keyup', escapeClose); }
   if (opts.backdrop) {     backdropEl.css('display', 'none').removeClass('in');
     backdropEl.unbind('click', clickClose);}
   elm.css('display', 'none').removeClass('in');
   body.removeClass('modal-open');} function open() {   if (opts.escape) { body.bind('keyup', escapeClose); }
   if (opts.backdrop) {     backdropEl.css('display', 'block').addClass('in');
     if(opts.backdrop != "static") {  backdropEl.bind('click', clickClose);}}
   elm.css('display', 'block').addClass('in');
   body.addClass('modal-open');}
 scope.$watch(shownExpr, function(isShown, oldShown) {   if (isShown) {     open();} else {     close();}});}};}]);
angular.module('ui.bootstrap.pagination', []).directive('pagination', function() {  return {    restrict: 'EA',    scope: { numPages: '=', currentPage: '=', maxSize: '=', onSelectPage: '&', nextText: '@', previousText: '@'},    templateUrl: 'template/pagination/pagination.html',    replace: true,    link: function(scope) { scope.$watch('numPages + currentPage + maxSize', function() {   scope.pages = [];
      var maxSize = ( scope.maxSize && scope.maxSize < scope.numPages ) ? scope.maxSize : scope.numPages;
   var startPage = scope.currentPage - Math.floor(maxSize/2);
      if(startPage < 1) {  startPage = 1;}
   if ((startPage + maxSize - 1) > scope.numPages) {  startPage = startPage - ((startPage + maxSize - 1) - scope.numPages );}
   for(var i=0; i < maxSize && i < scope.numPages ;i++) {     scope.pages.push(startPage + i);}
   if ( scope.currentPage > scope.numPages ) {     scope.selectPage(scope.numPages);}});
 scope.noPrevious = function() {   return scope.currentPage === 1;};
 scope.noNext = function() {   return scope.currentPage === scope.numPages;};
 scope.isActive = function(page) {   return scope.currentPage === page;};
 scope.selectPage = function(page) {   if ( ! scope.isActive(page) ) {     scope.currentPage = page;
     scope.onSelectPage({ page: page });}};
 scope.selectPrevious = function() {   if ( !scope.noPrevious() ) {     scope.selectPage(scope.currentPage-1);}};
 scope.selectNext = function() {   if ( !scope.noNext() ) {     scope.selectPage(scope.currentPage+1);}};}};});
angular.module( 'ui.bootstrap.popover', [] ).directive( 'popoverPopup', function () {  return {    restrict: 'EA',    replace: true,    scope: { popoverTitle: '@', popoverContent: '@', placement: '@', animation: '&', isOpen: '&' },    templateUrl: 'template/popover/popover.html'};}).directive( 'popover', [ '$compile', '$timeout', '$parse', function ( $compile, $timeout, $parse ) {  var template = 
    '<popover-popup popover-title="{{tt_title}}" popover-content="{{tt_popover}}" placement="{{tt_placement}}" animation="tt_animation()" is-open="tt_isOpen"></popover-popup>';
  return {    scope: true,    link: function ( scope, element, attr ) { var popover = $compile( template )( scope ), 
     transitionTimeout;
 attr.$observe( 'popover', function ( val ) {   scope.tt_popover = val;});
 attr.$observe( 'popoverTitle', function ( val ) {   scope.tt_title = val;});
 attr.$observe( 'popoverPlacement', function ( val ) {      scope.tt_placement = val || 'top';});
 attr.$observe( 'popoverAnimation', function ( val ) {   scope.tt_animation = $parse( val );});
  scope.tt_isOpen = false; function getPosition() {   return {     width: element.prop( 'offsetWidth' ),     height: element.prop( 'offsetHeight' ),     top: element.prop( 'offsetTop' ),     left: element.prop( 'offsetLeft' )};} function show() {   var position,  ttWidth,  ttHeight,  ttPosition;
    if ( transitionTimeout ) {     $timeout.cancel( transitionTimeout );}
      popover.css({ top: 0, left: 0, display: 'block' });
    element.after( popover );
      position = getPosition();
      ttWidth = popover.prop( 'offsetWidth' );
   ttHeight = popover.prop( 'offsetHeight' );
    switch ( scope.tt_placement ) {     case 'right':
  ttPosition = {    top: (position.top + position.height / 2 - ttHeight / 2) + 'px',    left: (position.left + position.width) + 'px'};break;
     case 'bottom':ttPosition = {    top: (position.top + position.height) + 'px',    left: (position.left + position.width / 2 - ttWidth / 2) + 'px'};break;
     case 'left':ttPosition = {    top: (position.top + position.height / 2 - ttHeight / 2) + 'px',    left: (position.left - ttWidth) + 'px'};break;
     default:ttPosition = {    top: (position.top - ttHeight) + 'px',    left: (position.left + position.width / 2 - ttWidth / 2) + 'px'};break;}
      popover.css( ttPosition );
      scope.tt_isOpen = true;} function hide() {    scope.tt_isOpen = false;
       if ( angular.isDefined( scope.tt_animation ) && scope.tt_animation() ) {     transitionTimeout = $timeout( function () { popover.remove(); }, 500 );} else {     popover.remove();}}
  element.bind( 'click', function() {   if(scope.tt_isOpen){  scope.$apply( hide );} else {  scope.$apply( show );}});}};}]);
angular.module('ui.bootstrap.tabs', []).controller('TabsController', ['$scope', '$element', function($scope, $element) {  var panes = $scope.panes = [];
  this.select = $scope.select = function selectPane(pane) {    angular.forEach(panes, function(pane) { pane.selected = false;});
    pane.selected = true;};
  this.addPane = function addPane(pane) {    if (!panes.length) { $scope.select(pane);}
    panes.push(pane);};
  this.removePane = function removePane(pane) { 
    var index = panes.indexOf(pane);
    panes.splice(index, 1);
   if (pane.selected && panes.length > 0) { $scope.select(panes[index < panes.length ? index : index-1]);}};}]).directive('tabs', function() {  return {    restrict: 'EA',    transclude: true,    scope: {},    controller: 'TabsController',    templateUrl: 'template/tabs/tabs.html',    replace: true};}).directive('pane', ['$parse', function($parse) {  return {    require: '^tabs',    restrict: 'EA',    transclude: true,    scope:{ heading:'@'
    },    link: function(scope, element, attrs, tabsCtrl) { var getSelected, setSelected;
 scope.selected = false;
 if (attrs.active) {   getSelected = $parse(attrs.active);
   setSelected = getSelected.assign;
   scope.$watch( function watchSelected() {return getSelected(scope.$parent);},     function updateSelected(value) {scope.selected = value;});
   scope.selected = getSelected ? getSelected(scope.$parent) : false;}
 scope.$watch('selected', function(selected) {   if(selected) {     tabsCtrl.select(scope);}
   if(setSelected) {     setSelected(scope.$parent, selected);}});
 tabsCtrl.addPane(scope);
 scope.$on('$destroy', function() {   tabsCtrl.removePane(scope);}); },    templateUrl: 'template/tabs/pane.html',    replace: true};}]);
angular.module( 'ui.bootstrap.tooltip', [] ).directive( 'tooltipPopup', function () {  return {    restrict: 'EA',    replace: true,    scope: { tooltipTitle: '@', placement: '@', animation: '&', isOpen: '&' },    templateUrl: 'template/tooltip/tooltip-popup.html'};}).directive( 'tooltip', [ '$compile', '$timeout', '$parse', function ( $compile, $timeout, $parse ) {  var template = 
    '<tooltip-popup '+
 'tooltip-title="{{tt_tooltip}}" placement="{{tt_placement}}" animation="tt_animation()" is-open="tt_isOpen"></tooltip-popup>';
  return {    scope: true,    link: function ( scope, element, attr ) { var tooltip = $compile( template )( scope ), 
     transitionTimeout;
 attr.$observe( 'tooltip', function ( val ) {   scope.tt_tooltip = val;});
 attr.$observe( 'tooltipPlacement', function ( val ) {      scope.tt_placement = val || 'top';});
 attr.$observe( 'tooltipAnimation', function ( val ) {   scope.tt_animation = $parse( val );});
  scope.tt_isOpen = false; function getPosition() {   return {     width: element.prop( 'offsetWidth' ),     height: element.prop( 'offsetHeight' ),     top: element.prop( 'offsetTop' ),     left: element.prop( 'offsetLeft' )};} function show() {   var position,  ttWidth,  ttHeight,  ttPosition;
    if ( transitionTimeout ) {     $timeout.cancel( transitionTimeout );}
      tooltip.css({ top: 0, left: 0, display: 'block' });
    element.after( tooltip );
      position = getPosition();
      ttWidth = tooltip.prop( 'offsetWidth' );
   ttHeight = tooltip.prop( 'offsetHeight' );
    switch ( scope.tt_placement ) {     case 'right':
  ttPosition = {    top: (position.top + position.height / 2 - ttHeight / 2) + 'px',    left: (position.left + position.width) + 'px'};break;
     case 'bottom':  ttPosition = {    top: (position.top + position.height) + 'px',    left: (position.left + position.width / 2 - ttWidth / 2) + 'px'};break;
     case 'left':  ttPosition = {    top: (position.top + position.height / 2 - ttHeight / 2) + 'px',    left: (position.left - ttWidth) + 'px'};break;
     default:  ttPosition = {    top: (position.top - ttHeight) + 'px',    left: (position.left + position.width / 2 - ttWidth / 2) + 'px'};break;}
      tooltip.css( ttPosition );
      scope.tt_isOpen = true;} function hide() {    scope.tt_isOpen = false;
       if ( angular.isDefined( scope.tt_animation ) && scope.tt_animation() ) {     transitionTimeout = $timeout( function () { tooltip.remove(); }, 500 );} else {     tooltip.remove();}}
  element.bind( 'mouseenter', function() {   scope.$apply( show );});
 element.bind( 'mouseleave', function() {   scope.$apply( hide );});}};}]);
angular.module('ui.bootstrap.transition', []).factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {  var $transition = function(element, trigger, options) {    options = options || {};
    var deferred = $q.defer();
    var endEventName = $transition[options.animation ? "animationEndEventName" : "transitionEndEventName"];
    var transitionEndHandler = function(event) { $rootScope.$apply(function() {   element.unbind(endEventName, transitionEndHandler);
   deferred.resolve(element);});};
    if (endEventName) { element.bind(endEventName, transitionEndHandler);}
    $timeout(function() { if ( angular.isString(trigger) ) {   element.addClass(trigger);} else if ( angular.isFunction(trigger) ) {   trigger(element);} else if ( angular.isObject(trigger) ) {   element.css(trigger);}
  if ( !endEventName ) {   deferred.resolve(element);}});
      deferred.promise.cancel = function() { if ( endEventName ) {   element.unbind(endEventName, transitionEndHandler);}
 deferred.reject('Transition cancelled');};
    return deferred.promise;};
    var transElement = document.createElement('trans');
  var transitionEndEventNames = {    'WebkitTransition': 'webkitTransitionEnd','MozTransition': 'transitionend','OTransition': 'oTransitionEnd','msTransition': 'MSTransitionEnd','transition': 'transitionend'};
  var animationEndEventNames = {    'WebkitTransition': 'webkitAnimationEnd','MozTransition': 'animationend','OTransition': 'oAnimationEnd','msTransition': 'MSAnimationEnd','transition': 'animationend'}; function findEndEventName(endEventNames) {    for (var name in endEventNames){ if (transElement.style[name] !== undefined) {   return endEventNames[name];}}}
  $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
  $transition.animationEndEventName = findEndEventName(animationEndEventNames);
  return $transition;}]);
angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache){  $templateCache.put("template/accordion/accordion-group.html","<div class=\"accordion-group\">  <div class=\"accordion-heading\" ><a class=\"accordion-toggle\" ng-click=\"isOpen = !isOpen\">{{heading}}</a></div>  <div class=\"accordion-body\" collapse=\"!isOpen\">    <div class=\"accordion-inner\" ng-transclude></div>  </div></div>");}]);
angular.module("template/accordion/accordion.html", []).run(["$templateCache", function($templateCache){  $templateCache.put("template/accordion/accordion.html","<div class=\"accordion\" ng-transclude></div>");}]);
angular.module("template/alert/alert.html", []).run(["$templateCache", function($templateCache){  $templateCache.put("template/alert/alert.html","<div class='alert' ng-class='type && \"alert-\" + type'>    <button type='button' class='close' ng-click='close()'>&times;</button>    <div ng-transclude></div></div>");}]);
angular.module("template/carousel/carousel.html", []).run(["$templateCache", function($templateCache){  $templateCache.put("template/carousel/carousel.html","<div ng-mouseenter=\"pause()\" ng-mouseleave=\"play()\" class=\"carousel\">    <div class=\"carousel-inner\" ng-transclude></div>    <a ng-click=\"prev()\" class=\"carousel-control left\">&lsaquo;</a>    <a ng-click=\"next()\" class=\"carousel-control right\">&rsaquo;</a></div>");}]);
angular.module("template/carousel/slide.html", []).run(["$templateCache", function($templateCache){  $templateCache.put("template/carousel/slide.html","<div ng-class=\"{    'active': leaving || (active && !entering),    'prev': (next || active) && direction=='prev',    'next': (next || active) && direction=='next',    'right': direction=='prev',    'left': direction=='next'  }\" class=\"item\" ng-transclude></div>");}]);
angular.module("template/dialog/message.html", []).run(["$templateCache", function($templateCache){  $templateCache.put("template/dialog/message.html","<div class=\"modal-header\">	<h1>{{ title }}</h1></div><div class=\"modal-body\">	<p>{{ message }}</p></div><div class=\"modal-footer\">	<button ng-repeat=\"btn in buttons\" ng-click=\"close(btn.result)\" class=btn ng-class=\"btn.cssClass\">{{ btn.label }}</button></div>");}]);
angular.module("template/pagination/pagination.html", []).run(["$templateCache", function($templateCache){  $templateCache.put("template/pagination/pagination.html","<div class=\"pagination\"><ul>  <li ng-class=\"{disabled: noPrevious()}\"><a ng-click=\"selectPrevious()\">{{previousText || 'Previous'}}</a></li>  <li ng-repeat=\"page in pages\" ng-class=\"{active: isActive(page)}\"><a ng-click=\"selectPage(page)\">{{page}}</a></li>  <li ng-class=\"{disabled: noNext()}\"><a ng-click=\"selectNext()\">{{nextText || 'Next'}}</a></li>  </ul></div>");}]);
angular.module("template/popover/popover.html", []).run(["$templateCache", function($templateCache){  $templateCache.put("template/popover/popover.html","<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">  <div class=\"arrow\"></div>  <div class=\"popover-inner\"> <h3 class=\"popover-title\" ng-bind=\"popoverTitle\" ng-show=\"popoverTitle\"></h3> <div class=\"popover-content\" ng-bind=\"popoverContent\"></div>  </div></div>");}]);
angular.module("template/tabs/pane.html", []).run(["$templateCache", function($templateCache){  $templateCache.put("template/tabs/pane.html","<div class=\"tab-pane\" ng-class=\"{active: selected}\" ng-show=\"selected\" ng-transclude></div>");}]);
angular.module("template/tabs/tabs.html", []).run(["$templateCache", function($templateCache){  $templateCache.put("template/tabs/tabs.html","<div class=\"tabbable\">  <ul class=\"nav nav-tabs\">    <li ng-repeat=\"pane in panes\" ng-class=\"{active:pane.selected}\"> <a href=\"\" ng-click=\"select(pane)\">{{pane.heading}}</a>    </li>  </ul>  <div class=\"tab-content\" ng-transclude></div></div>");}]);
angular.module("template/tooltip/tooltip-popup.html", []).run(["$templateCache", function($templateCache){  $templateCache.put("template/tooltip/tooltip-popup.html","<div class=\"tooltip {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">  <div class=\"tooltip-arrow\"></div>  <div class=\"tooltip-inner\" ng-bind=\"tooltipTitle\"></div></div>");}]);