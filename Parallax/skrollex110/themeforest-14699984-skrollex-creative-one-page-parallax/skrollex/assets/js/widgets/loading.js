"use strict"; var $ = jQuery;
module.exports = new (function(){
	var tools = require('../tools/tools.js');
	var $gate = $('.gate');
	var $gateBar = $gate.find('.gate-bar');
	var isAndroidBrowser4_3minus = $('html').hasClass('android-browser-4_3minus');
	var me = this;
	this.queue = [];
	this.load = function(callback){
		var urls = [];
		var finish = false;
		var $excl = $('.non-preloading, .non-preloading img');
		if(!skrollexConfig.isCustomizer){
			$('img:visible').not($excl).each(function(){
				var $el = $(this);
				var src = $el.attr('src');
				if(src && $.inArray(src, urls) === -1){
					urls.push(src);
				}
			});
			$('div.bg:visible').not($excl).each(function(){
				var $el = $(this);
				var bImg = $el.css("background-image");
				if (bImg != 'none'){
					var murl = bImg.match(/url\(['"]?([^'")]*)/i);
					if(murl && murl.length>1 && !murl[1].match(/data:/i) && $.inArray(murl[1], urls) === -1){
						urls.push(murl[1]);
					}
				}
			});
		}
		$('.loading-func:visible').not($excl).each(function(){
			var $el = $(this);
			var func = $el.data('loading');
			if(func){
				urls.push(func);
			}
		});
		var loaded = 0;
		if(urls.length === 0){
			finish = true;
			callback();
		}else{
			var timer = setTimeout(function(){
				if(!finish){
					finish = true;
					callback();
				}
			}, 20000);
			if(!skrollexConfig.isCustomizer){
				$gate.addClass('load-animation');
			}
			$('html').addClass('page-loading');
			var waterPerc = 0;
			var done = function(){
				loaded++;
				waterPerc = loaded/urls.length * 100;
				$gateBar.css({width: waterPerc+'%'});
				if(loaded === urls.length && !finish){
					clearTimeout(timer);
					finish = true;
					callback();
				}
			}
			for(var i=0; i<urls.length; i++){
				if(typeof(urls[i]) == 'function'){
					urls[i](done);
				}else{
					var img = new Image();
					$(img).one('load error', function(){me.queue.push(done)});
					img.src = urls[i];
				}
			}
		}
	}
	this.gate = function(callback){
		$('html').addClass('page-is-gated');
		$gateBar.css({width: '0%'});
		$gate.transitionEnd(function(){
			if(callback){
				callback();
			}
		}).css({opacity: 1, visibility: 'visible'});
	}
	this.ungate = function(callback){
		$('html').removeClass('page-is-gated page-loading').addClass('page-is-loaded');
		$gate.transitionEnd(function(){
			if(isAndroidBrowser4_3minus){
				tools.androidStylesFix($('body'));
			}
			if(callback){
				callback();
			}
			$gate.removeClass('load-animation');
		}).css({opacity: 0, visibility: 'hidden'});
	};
})();