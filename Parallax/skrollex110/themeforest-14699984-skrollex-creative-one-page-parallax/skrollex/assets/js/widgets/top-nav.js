"use strict"; var $ = jQuery;
module.exports = function(){
	var tools = require('../tools/tools.js');
	var $topNav =  $('#top-nav:visible');
	var $styleFix =  $('#top-nav, .page-border');
	var $html = $('html');
	var decorB = $('html').hasClass('site-decoration-b')
	var isTwoState = $('body').hasClass('page-template-builder')
	var isTopNav = $topNav.length > 0;
	var topNavState1Top = (function(){
		if(isTopNav){
			return 20;
		}else{
			return 0;
		}
	})();
	var forcedState = false;
	var doForce = false;
	var doUnforce = false;
	var forceSrcs = [];
	var me = this;
	var state1Colors = $topNav.data('colors-2');
	var state2Colors = $topNav.data('colors-1');
	this.isState1 = false;
	this.isState2 = false;
	this.state2H = isTopNav ? (decorB ? 40 : 48) : 0;
	this.state1Top = function(){ return topNavState1Top; };
	this.state1 = function(){
		$html.addClass('on-top');
		if(isTwoState){
			if(isTopNav && (!me.isState1 || doUnforce)){
				if(!forcedState){
					$html.removeClass('state2').addClass('state1');
					$topNav.removeClass(state2Colors).addClass(state1Colors);
					tools.androidStylesFix($styleFix);
				}
				if(!doForce){
					me.isState1 = true;
					me.isState2 = false;
				}
			}
		}else{
			me.state2(true);
		}
	};
	this.state2 = function(pseudo){
		if(!pseudo){
			$html.removeClass('on-top');
		}
		if(isTopNav && (!me.isState2 || doUnforce)){
			if(!forcedState){
				$html.removeClass('state1').addClass('state2');
				$topNav.removeClass(state1Colors).addClass(state2Colors);
				tools.androidStylesFix($styleFix);
			}
			if(!doForce){
				me.isState1 = false;
				me.isState2 = true;
			}
		}
	};
	this.forceState = function(src){
		if(forceSrcs.indexOf(src) < 0){
			forceSrcs.push(src);
			doForce = true;
			me.state2();
			doForce = false;
			forcedState = true;
		}
	}
	this.unforceState = function(src){
		var ind = forceSrcs.indexOf(src);
		if(ind >= 0){
			forceSrcs.splice(ind, 1);
			if(forceSrcs.length === 0){
				forcedState = false;
				doUnforce = true;
				if(me.isState1){
					me.state1();
				}else{
					me.state2();
				}
				doUnforce = false;
			}
		}
	}
	var resize = function(){
		if($(window).width()>767){
			me.unforceState('size');
		}else{
			me.forceState('size');
		}
	}
	$(window).resize(resize);
	resize();
};