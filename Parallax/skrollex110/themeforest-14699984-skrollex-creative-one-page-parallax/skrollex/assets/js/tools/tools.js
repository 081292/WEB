"use strict"; var $ = jQuery;
module.exports = new (function(){
	var me = this;
	var script = require('../script.js');
	var isAndroidBrowser4_3minus = $('html').hasClass('android-browser-4_3minus');
	this.animationEnd = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd';
	this.transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';
	this.transition = ['-webkit-transition', '-moz-transition', '-ms-transition', '-o-transition', 'transition'];
	this.transform = ["-webkit-transform", "-moz-transform", "-ms-transform", "-o-transform", "transform"];
	this.property = function(keys, value, obj){
		var res = obj ? obj : {};
		for(var i=0; i<keys.length; i++){
			res[keys[i]]=value;
		}
		return res;
	}
	this.windowYOffset = window.pageYOffset !== undefined ? function(){return window.pageYOffset;} : (document.compatMode === "CSS1Compat" ? function(){return document.documentElement.scrollTop;} : function(){return document.body.scrollTop;});
	this.getUrlParameter = function(sParam){
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) {
				return decodeURI(sParameterName[1]);
			}
		}
	}
	this.selectTextarea = function($el){
		$el.focus(function() {
			var $this = $(this);
			$this.select();
			// Work around Chrome's little problem
			$this.mouseup(function() {
				// Prevent further mouseup intervention
				$this.unbind("mouseup");
				return false;
			});
		});
	}
	var timer;
	this.time = function(label){
		if(!timer){
			timer = Date.now();
			console.log('==== Timer started'+(label ? ' | '+label : ''))
		}else{
			var t = Date.now();
			console.log('==== '+(t-timer)+' ms'+(label ? ' | '+label : ''));
			timer = t;
		}
	}
	this.scrollTo = function (y, callback, time) {
		if(time === undefined) time = 1200;
		new TWEEN.Tween({y: me.windowYOffset()})
			.to({y: Math.round(y)}, time)
			.onUpdate(function(){
				window.scrollTo(0, this.y);
			})
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onComplete(function () {
				if(callback){
					callback();
				}
			})
			.start();
	}
	this.androidStylesFix = function($q){
		if(isAndroidBrowser4_3minus){
			$q.hide();
			$q.get(0).offsetHeight;
			$q.show();
		}
	}
	this.transformCss = function(str, origin){
		var res = {
			'-webkit-transform': str,
			'-moz-transform': str,
			'-ms-transform': str,
			'-o-transform': str,
			'transform':  str
		};
		if(origin){
			res['-webkit-transform-origin'] = origin;
			res['-moz-transform-origin'] = origin;
			res['-ms-transform-origin'] = origin;
			res['-o-transform-origin'] = origin;
			res['transform-origin'] = origin;
		}
		return res;
	}
	this.snapUrl = function(el){
		if (skrollexConfig.isCustomizer) {
			var url = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search + '#' + el.attr('id');
			return "url('" + url + "')";
		}else{
			return el;
		}
	}
})();