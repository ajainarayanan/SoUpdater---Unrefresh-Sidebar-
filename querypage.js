/*
**********************************************************************************
* Script Name: Content-Script1 - This script is about handling the interactions  *
* 			   pertaining to the add-on (the iframe). This package defines the   *
*			   operations that could be done with the add-on by a user. 	     *
* Date: 	   25-Dec-2011														 *
* Developer:   Ananthanarayanan,Ajai											 *
**********************************************************************************
*/
//Var to hold the no.of threads to be displayed in Sidebar 
// (passed as querystring).
var PageSize;
var favTags = new Array();

var SOUpdater = { sideBar: {} };

var initialized = false;
//Class for interacting with background page.

//This is going to be the element that will be toggled for the mini version and expanded version.
SOUpdater.sideBar.Element = function () {
    // vars and methods declared in this scope will be shared by instances and are private
    var _element;
	var _toggle;
	var _state;
	
	
    // private static functions
    function _getElement() { return _element }
    function _setElement(element) { _element = $(element); _toggle = "expanded";}

	
    // Create a function that will be returned as the Foo class constructor
    // referencing static vars and methods along with instance 
    function InstanceConstructor(instance_seed) {
        return {
            getElement : _getElement, 			// method affecting static class vars
            setElement : _setElement, 			// get the shared static value
			printElement: function(){ 			// Sample function to test the code. Just a stub.
				var tElement = new Element;
				var vElement = new Element;
				tElement.setElement('Common Element');
				alert('tElement\'s: ' + tElement.getElement());
				alert('vElement\'s: ' + vElement.getElement());
				
			},
			attachClickEvent: attach, 			// attach click event to mini add-on
			detachClickEvent: detach, 			// when disabled remove the click event.
			setStateOfAddon: _setStateOfAddon,	// set the state of the add-on whether it be minified or expanded.
			getStateOfAddon: _getStateOfAddon,
			_toggle: toggle,
			attachHoverEvent : attachhoverevent,
			attachMouseOutEvent: attachmouseoutevent
		}
    }
	//attachHoverEvent('#L-SOUpdaterBarTrigger', '.L-SOUpdater_widget_container', 'auto');
	function attachhoverevent(selector,widgetSelector){
		_element.find(selector).hover(function(){
		 var tempIcon = chrome.extension.getURL("images/SOLogo1.png");
		  var sidebarTrigger = _element.find('#L-SOUpdaterBarTrigger');
		  sidebarTrigger[0].style.backgroundImage = "url(" + tempIcon + ")";
		  
		if(_getStateOfAddon("_state") == "expanded"){
			$(this).animate({width: "50px" , right: "560px"} , {duration: 400, queue: false}).css('overflow','visible');
			//$(this).animate({width: "35px"} , {duration: 200, queue: false});
			$(this).prevAll(widgetSelector).animate({opacity: "0"}, {duration: 400 , queue : false});
			
		}else{
			$(this).animate({width: "50px" , right: "0px"} , {duration: 400, queue: false}).css('overflow','visible');
			//$(this).animate({width: "35px"} , {duration: 200, queue: false});
			$(this).prevAll(widgetSelector).animate({opacity: "0"}, {duration: 400 , queue : false});
			$('#L-miniSideBar').animate({opacity : "0"}, {duration: 400, queue: false});
		}
	
		});
	}
	
	function attachmouseoutevent(selector,widgetSelector){
		$(selector).mouseleave(function(){
		if(_getStateOfAddon("_state") == "expanded"){
			$(this).animate({width: "39px" , right: "560px"} , {duration : 200, queue: false}).css('overflow','visible');	
			//$(this).animate({width: "25px"} , {duration : 200, queue: false});	
			$(this).prevAll(widgetSelector).animate({opacity: "1"}, {duration: 400 , queue : false});
		}else{
			$(this).animate({width: "39px" , right: "0px"} , {duration : 200, queue: false}).css('overflow','visible');	
			//$(this).animate({width: "25px"} , {duration : 200, queue: false});	
			$(this).prevAll(widgetSelector).animate({opacity: "1"}, {duration: 200 , queue : false});
			$('#L-miniSideBar').animate({opacity : "1"}, {duration: 400, queue: false});
		}
		  var tempIcon = chrome.extension.getURL("images/SOLogo1.png");
		   var sidebarTrigger = _element.find('#L-SOUpdaterBarTrigger');
		  sidebarTrigger[0].style.backgroundImage = "url(" + tempIcon + ")";
		});
	}
	
	//This function is to pull up the frame in the expanded mode. 
	function _pullUpIFrame(){
		_element.find('#L-SOUpdaterBarTrigger').toggleClass('opened', true).show();
		_element.find('.L-SOUpdater_widget_container').show();
		_element.find('.L-SOUpdater_widget_container').css('cssText', 'display: block !important');
		_element.find('.L-SOUpdater_view_control a').toggleClass('selected', false);
		
		_element.find('.L-SOUpdater_widget_container').animate({opacity:1, right: "0px"}, {
			duration: 400,
			queue: false,
			complete: function() {
				//Have to shrink the body here.
				_element.find('.L-SOUpdater_view_control').fadeIn('fast').css({top: '10px', bottom: 'auto', right: '23px'});
			} 
		});
		 _element.find('#L-SOUpdaterBarTrigger').animate({right: "560px",}, { duration: 400, queue: false }).css('overflow', 'visible');
		 //_element.find('#L-SOUpdaterBarTrigger').animate({right: "560px",}, { duration: 400, queue: false });
		 var element = $(_element.find('script#L-full-template').html());
		 _element.find('#L-SOUpdaterBarTrigger').before(element);
         element.load(function(){
			_element.find('#L-SOUpdaterBarTrigger').toggleClass('loading', false).toggleClass('opened', true);
			_element.find('#L-SOUpdaterBarTrigger .L-loader').hide();
		 });
	}
	
	//Function to slide the Iframe back inside.
	function _pullOutIFrame(){
		if (_element.find('.L-SOUpdater_widget_container').length == 1) {
		 _element.find('#L-SOUpdaterBarTrigger').prevAll('.L-SOUpdater_widget_container').animate({
		   opacity: 0,
		   right: "-560px"
		 }, 400);
		  _element.find('#L-SOUpdaterBarTrigger').toggleClass('opened', false);
		}
		_element.find('.L-SOUpdater_widget_container').animate({opacity:1, right: "-560px"}, {
			duration: 400,
			queue: false,
			complete: function() {
				_element.find('.L-SOUpdater_view_control').hide();
			} 
		});
		_element.find('.L-SOUpdater_widget_container').hide();
		//_element.find('#L-SOUpdaterBarTrigger').animate({ right: "30px"}, 400).css('overflow', 'visible');			
		_element.find('#L-SOUpdaterBarTrigger').animate({ right: "0px"}, 400);	
	}
	
	//Click handler to attach events to respective elements.
	function attach(element) {
		$(element).bind('click',toggle);
	}

	function detach(element){	
		$(element).unbind('click',toggle);
	}
	
	//Function to toggle between shrinked mode and expanded mode.
	var  toggle = function(){
	    if(_getStateOfAddon("_state") == "expanded"){
			_setStateOfAddon("_state","minified");
			_pullOutIFrame();
			$('.miniSideBar').animate({right: "30px"},400).css('display','block');
			$('.miniSideBar').animate({right: "0px"},400).css('display','block');
			if($('#L-miniSideBar').attr('opacity') != 1){
				$('#L-miniSideBar').css('opacity','1');
			}
			return _getStateOfAddon("_state");
		}
		else {
			_setStateOfAddon("_state","expanded");
			var inject = new SOUpdater.sideBar.insertIframeIntoDOM;
			$('.miniSideBar').css({ 'display' : 'none'});
			inject.showMargin(_element.find('#L-SOUpdaterBarTrigger')[0]);
			return _getStateOfAddon("_state");
		}
	}
	
	//Getters and Setters for "state" of the add-on stored in the background.
	function _setStateOfAddon(key,value){
		_state = value;
	}
	
	function _getStateOfAddon(key,value){
		return _state == "expanded" ? "expanded": "minified";
	}
	
	// return the function that will be used to construct the instances
    return InstanceConstructor;
}();

//This doesn't need to be a class. I will most probably make it as function.
SOUpdater.sideBar.insertIframeIntoDOM = function() {}

   SOUpdater.sideBar.insertIframeIntoDOM.prototype.insert = function(){
	  var sidebarTriggerImageSrc = chrome.extension.getURL("images/SOLogo1.png");
	  var pagesize = (PageSize == "undefined")? 10: PageSize;
	  var favtags =  (favTags  == "undefined")? [""]: favTags;
	  var element = $(['<div id="L-SOUpdaterWidget" class="SOUpdater_widget" style="display:none;">',
						'<script type="text/html" id="L-full-template">',
						'<iframe id="L-SOUpdater" class="SOUpdater_widget_container L-SOUpdater_widget_container" src="http://www.edjai.com/ResearchTest/extensionSO/soupdater.htm?ps='+ pagesize +'&favTags='+ favtags +'"style="display: none;">',
							 '<p>Your browser does not support iframes.</p>',		/*  */
						   '</iframe>',
						 '</script>', '',
						 '<div id="L-SOUpdaterBarTrigger" class="SOUpdater_widget_trigger hide_txt">  <div id="L-preview-trigger" class="action_ctrl"> <a href="javascript:void(0);" class="hide_txt full_mode" title="">Preview Mode</a></div></div>',
					   '</div>'].join(""));

	  var sidebarTrigger = element.find('#L-SOUpdaterBarTrigger');
	  sidebarTrigger[0].style.backgroundImage = "url(" + sidebarTriggerImageSrc + ")";
	  document.body.appendChild(element[0]);
	  var aElement = new SOUpdater.sideBar.Element;
	  aElement.setElement('#L-SOUpdaterWidget');
	  aElement.attachHoverEvent('#L-SOUpdaterBarTrigger','.L-SOUpdater_widget_container');
	  aElement.attachMouseOutEvent('#L-SOUpdaterBarTrigger','.L-SOUpdater_widget_container');
	  initialized = true;
   }

   SOUpdater.sideBar.insertIframeIntoDOM.prototype.showContainer = function(state){
    var aElement = new SOUpdater.sideBar.Element;
	aElement.getElement().show();
	aElement.attachClickEvent('#L-SOUpdaterWidget');
    if(state == "expanded"){		
	  aElement.getElement().find('#L-SOUpdaterBarTrigger').animate({right: "0px"}, { duration: 400, queue: false});
    }
    if (aElement.getElement().find('.L-SOUpdater_widget_container').length != 1) {
      var inject = new SOUpdater.sideBar.insertIframeIntoDOM;
		inject.loadHiddenIframe();
    }
  }
  
   SOUpdater.sideBar.insertIframeIntoDOM.prototype.loadHiddenIframe = function(){
  	var aElement = new SOUpdater.sideBar.Element;
    var element = $(aElement.getElement().find('script#L-full-template').html());
    aElement.getElement().find('#L-SOUpdaterBarTrigger').before(element);
    element.load(function(){
	   if(aElement.getStateOfAddon("_state") == "expanded"){
        aElement.getElement().find('#L-SOUpdaterBarTrigger').toggleClass('loading', false).toggleClass('opened', true);
        aElement.getElement().find('#L-SOUpdaterBarTrigger .L-loader').hide();
      }
    });
  }
  
   SOUpdater.sideBar.insertIframeIntoDOM.prototype.showMargin = function(link){
 	var inject = new SOUpdater.sideBar.insertIframeIntoDOM;
	var aElement = new SOUpdater.sideBar.Element;
    var marginFound = (aElement.getElement().find('.L-SOUpdater_widget_container').length ==1) ;
    if (marginFound /*&& !marginLoading*/) {
	    inject._pullUpIFrame();
    }
    else {
      $(link).toggleClass('loading', true);
      $(link).find('.L-loader').show();
      $(link).animate({
        right: "0px",
        width: "38px",
        height: "166px"
      }, {
        duration: 200,
        queue: false
      }).css('overflow', 'visible');

      if(!marginFound){
         inject.loadHiddenIframe();
      }
    }
  }
  
   SOUpdater.sideBar.insertIframeIntoDOM.prototype._pullUpIFrame = function() {
   var aElement = new SOUpdater.sideBar.Element;
   aElement.getElement().find('#L-SOUpdaterBarTrigger').toggleClass('opened', true).show();
   aElement.getElement().find('.L-SOUpdater_widget_container').show();
   aElement.getElement().find('.L-SOUpdater_widget_container').css('cssText', 'display: block !important');
   aElement.getElement().find('.L-SOUpdater_view_control a').toggleClass('selected', false);
   if(aElement.getStateOfAddon("_state") == "expanded"){
	  aElement.getElement().find('.L-SOUpdater_widget_container').animate({opacity:1, right: "0px"}, {
      duration: 400,
      queue: false,
      complete: function() {
        //Common.shrinkBody();
        aElement.getElement().find('.L-SOUpdater_view_control').fadeIn('fast').css({top: '10px', bottom: 'auto', right: '23px'});
        triggerEnabled = true;
      } 
    });
   
   aElement.getElement().find('#L-SOUpdaterBarTrigger').animate({right: "560px",}, { duration: 400, queue: false }).css('overflow', 'visible');
   //aElement.getElement().find('#L-SOUpdaterBarTrigger').animate({right: "560px",}, { duration: 400, queue: false });
  }
  else{
	//aElement.getElement().find('#L-SOUpdaterBarTrigger').animate({right: "30px",}, { duration: 400, queue: false }).css('overflow', 'visible');
	aElement.getElement().find('#L-SOUpdaterBarTrigger').animate({right: "0px",}, { duration: 400, queue: false });
  }
 }

 
//Listener functions for communication. The backgroundInteraction is for sending the request.
chrome.extension.onRequest.addListener(function(request, sender, sendResponse1) {
   
  if(request.Meta == "changeTriggered"){
   var aElement = new SOUpdater.sideBar.Element;
   var service = request.messageContent.service;
   PageSize = request.messageContent.PageSize;
   favTags = request.messageContent.favTags;
   if(service){		
	    if(!initialized){
			var inframe = new SOUpdater.sideBar.insertIframeIntoDOM();
			inframe.insert();
			var inframe = new SOUpdater.sideBar.insertIframeIntoDOM;
			inframe.showContainer(aElement.getStateOfAddon("_state"));
			var inject = new SOUpdater.sideBar.insertIframeIntoDOM;
			inject.showMargin(aElement.getElement().find('#L-SOUpdaterBarTrigger')[0]);
			initialized = true;
		}
		aElement.getElement().show();
		aElement.attachClickEvent('#L-SOUpdaterWidget');
	}
	else{
		$('#L-SOUpdaterWidget').hide();
		aElement.detachClickEvent('#L-SOUpdaterWidget');
	}	
  }
  
  else if(request.Meta == "tabChanged"){
  var service = request.messageContent.service;
  PageSize = request.messageContent.PageSize;
  favTags = request.messageContent.favTags;
	   var inframe = new SOUpdater.sideBar.insertIframeIntoDOM;
  	   var aElement = new SOUpdater.sideBar.Element;
	   if(service){
		if(!initialized){inframe.insert();}
		inframe.showContainer(aElement.getStateOfAddon("_state"));
		var inject = new SOUpdater.sideBar.insertIframeIntoDOM;
		inject.showMargin(aElement.getElement().find('#L-SOUpdaterBarTrigger')[0]);
	   }
	 else{
		aElement.getElement().hide();
		aElement.getElement().find('#L-SOUpdaterBarTrigger').animate({ right: "0px" }, 400).css('overflow', 'visible');
		aElement.detachClickEvent('#L-SOUpdaterWidget');
	 }
	
   }
  
  else if(request.Meta == "questionChanged"){
		var aElement = new SOUpdater.sideBar.Element;
		if(aElement.getStateOfAddon("_state") == "minified"){
			var sidebarTriggerImageSrc = chrome.extension.getURL("images/SOLogoUpdated.png");
			var aElement = new SOUpdater.sideBar.Element;
			var sidebarTrigger = aElement.getElement().find('#L-SOUpdaterBarTrigger');
			sidebarTrigger[0].style.backgroundImage = "url(" + sidebarTriggerImageSrc + ")";
	    }
  }
	
  else {
    sendResponse1({}); // snub them.
  }
});
