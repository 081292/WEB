"use strict"; var $ = jQuery;
module.exports = function(script){
	var me = this;
	var tools = require('../tools/tools.js');
	var ScrollAnimation = require('../app/scroll-animation.js');
	var $window = $(window);
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var scrollAnimation = new ScrollAnimation(me, script);
	this.windowTopPos = undefined;
	this.windowBottomPos = undefined;
	this.windowH = undefined;
	this.scroll = function(windowTopP){
		me.windowH = $window.height();
		me.windowBottomPos = windowTopP+me.windowH;
		if(windowTopP < script.topNav.state1Top()){
			if(me.windowTopPos === undefined){
				setTimeout(function(){script.topNav.state1();});
			}else{
				script.topNav.state1();
			}
		}else{
			if(me.windowTopPos === undefined){
				setTimeout(function(){script.topNav.state2();});
			}else{
				script.topNav.state2();
			}
		}
		me.windowTopPos = windowTopP;
		scrollAnimation.scroll()
		for(var i=0; i<script.players.length; i++){
			var viewPos = me.calcPosition(script.players[i].$view);
			if(viewPos.visible){
				script.players[i].play();
			}else{
				script.players[i].pause();
			}
		}
	}
	this.calcPosition = function ($block){
		var blockH = $block.height();
		var blockTopPos = $block.data('position');
		var blockBottomPos = blockTopPos + blockH;
		return {
			top: blockTopPos,
			bottom: blockBottomPos,
			height: blockH,
			visible: blockTopPos<me.windowBottomPos && blockBottomPos>me.windowTopPos
		};
	}
};