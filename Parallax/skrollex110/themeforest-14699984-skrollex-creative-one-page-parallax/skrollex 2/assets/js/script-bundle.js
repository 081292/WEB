(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function($context, script){
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var isNoAnimations = $('html').hasClass('no-animations');
	if(!Modernizr.cssanimations || isPoorBrowser || isNoAnimations){
		$('.scroll-in-animation').removeClass('scroll-in-animation');
		$('.scroll-animation').removeClass('scroll-animation');
		return;
	}
	$('.safari i.scroll-in-animation').removeClass('scroll-in-animation');
	$('.safari i.scroll-animation').removeClass('scroll-animation');
	$context.find('.scroll-in-animation, .scroll-animation').each(function(){
		var $this = $(this);
		var delay = $this.data('delay');
		var animation = $this.data('animation')+' css-animation-show';
		$this.removeClass(animation);
		var pause = function(){
			if(delay){
				setTimeout(function(){$this.removeClass(animation);}, delay);
			}else{
				$this.removeClass(animation);
			}
		}
		var resume = function(){
			if(delay){
				setTimeout(function(){$this.addClass(animation);}, delay);
			}else{
				$this.addClass(animation);
			}
		}
		var start = resume;
		script.players.addPlayer($this, start, pause, resume);
	});
};
},{}],2:[function(require,module,exports){
"use strict"; var $ = jQuery;
var players=[];
players.addPlayer = function($view, startFunc, pauseFunc, resumeFunc){
	players.push(
		new (function(){
			var played = false;
			var started = false;
			this.$view = $view;
			$view.addClass('player').data('player-ind', players.length);
			this.play = function(){
				if(!played){
					played = true;
					if(!started){
						started = true;
						startFunc();
					}else{
						resumeFunc();
					}
				}
			};
			this.pause = function(){
				if(played){
					played = false;
					pauseFunc();
				}
			};
		})()
	);
};
module.exports = players;
},{}],3:[function(require,module,exports){
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
},{"../app/scroll-animation.js":7,"../tools/tools.js":12}],4:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function(){
	var appShare = require('../app/app-share.js');
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var isNoAnimations = $('html').hasClass('no-animations');
	var fadeTime = 4000;
	var moveTime = 12000;
	var st0 = {scale: 1};
	var st1 = {scale: 1.1};
	var rules = [
		[st0, st1],
		[st1, st0]
	];
	var origins = [
		{or: 'left top', xr: 0, yr: 0},
		{or: 'left center', xr: 0, yr: 1},
		{or: 'right top', xr: 2, yr: 0},
		{or: 'right center', xr: 2, yr: 1}
	]
	var lastRule = rules.length -1;
	var lastOrigin = origins.length -1;
	var fadeEase = TWEEN.Easing.Quartic.InOut;
	var moveEase = TWEEN.Easing.Linear.None;
	this.run = function($slides) {
		if(isPoorBrowser || window.skrollexConfig.screenshotMode || isNoAnimations) return;
		var lastI = $slides.length - 1;
		show(lastI, true);
		function show(i, isFirstRun) {
			var slide = $slides.get(i);
			var $slide = $(slide);
			var cfg = $slide.data();
			var ri = Math.round(Math.random() * lastRule);
			var ori = Math.round(Math.random() * lastOrigin);
			var rule = rules[ri];
			cfg.ssScale = rule[0]['scale'];
			cfg.ssOrig = origins[ori];
			cfg.ssOpacity = (i === lastI && !isFirstRun) ? 0 : 1;
			if (i === lastI && !isFirstRun) {
				new TWEEN.Tween(cfg)
					.to({ssOpacity: 1}, fadeTime)
					.easing(fadeEase)
					.onComplete(function(){
						$slides.each(function(){
							$(this).data().ssOpacity = 1;
						});
					})
					.start();
			}
			new TWEEN.Tween(cfg)
				.to({ssScale: rule[1]['scale']}, moveTime)
				.easing(moveEase)
				.start();
			if (i > 0) {
				new TWEEN.Tween({ssOpacity: 1})
					.to({ssOpacity: 0}, fadeTime)
					.onUpdate(function(){
						cfg.ssOpacity = this.ssOpacity;
					})
					.easing(fadeEase)
					.delay(moveTime - fadeTime)
					.onStart(function(){
						show(i - 1);
					})
					.start();
			}else{
				new TWEEN.Tween(cfg)
					.to({}, 0)
					.easing(fadeEase)
					.delay(moveTime - fadeTime)
					.onStart(function(){
						show(lastI);
					})
					.start();
			}
		}
	};
};
},{"../app/app-share.js":5}],5:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = new (function(){
	var me = this;
	var isOldWin =
			(navigator.appVersion.indexOf("Windows NT 6.1")!=-1) || //Win7
			(navigator.appVersion.indexOf("Windows NT 6.0")!=-1) || //Vista
			(navigator.appVersion.indexOf("Windows NT 5.1")!=-1) || //XP
			(navigator.appVersion.indexOf("Windows NT 5.0")!=-1);   //Win2000
	var isIE9 = $('html').hasClass('ie9');
	var isIE10 = $('html').hasClass('ie10');
	var isIE11 = $('html').hasClass('ie11');
	var isEdge = $('html').hasClass('edge');
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var isMobile = $('html').hasClass('mobile');
	var factor = (function(){
		if(isIE9 || isIE10 || (isIE11 && isOldWin)){
			return 0;
		}else if(isIE11){
			return -0.15;
		}else if(isEdge){
			return -0.15;
		}else if(isPoorBrowser){
			return 0;
		}else{
			return -0.25;
		}
	})();
	this.force3D = isMobile ? false : true;
	this.parallaxMargin = function(script, secInd, viewOffsetFromWindowTop){
		var viewOffsetFromNavPoint = (viewOffsetFromWindowTop - (secInd === 0 ? 0 : script.topNav.state2H));
		return Math.round(factor * viewOffsetFromNavPoint);
	};
})();
},{}],6:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = new (function(){
	var appShare = require('./app-share.js');
	var themes = require('./themes.js');
	var SlideShow = require('../animation/slide-show.js');
	var slideShow = new SlideShow();
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var isNoAnimations = $('html').hasClass('no-animations');
	var isMobile = $('html').hasClass('mobile');
	var isDecorB = $('html').hasClass('site-decoration-b');
	var skewH = 60;
	var $bord = $('#top-nav, .page-border, #dot-scroll');
	var $topNav = $('#top-nav');
	var state1Colors = $topNav.data('state1-colors');
	var state2Colors = $topNav.data('state2-colors');
	var $body = $('body');
	var $views = $('.view');
	var $bacgrounds;
	this.prepare = function(callback){
		if(window.location.protocol === 'file:' && !$('body').hasClass('example-page')){
			$('<div class="file-protocol-alert alert colors-d background-80 heading fade in">	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button> Upload files to web server and open template from web server. If template is opened from local file system, some links, functions and examples may work incorrectly.</div>')
					.appendTo('body');
		}
		if(appShare.force3D === true){
			$('html').addClass('force3d');
		}
		$('.wrapper-content, .view').each(function(){
			var $this = $(this)
			var $holders = isPoorBrowser ? $this.children('.bg-holder:last') : $this.children('.bg-holder');
			$holders.each(function(){
				var $holder = $(this);
				$holder.after('<img alt="" class="bg" src="'+$holder.data('src')+'" />');
			});
		});
		$('.bg-holder').remove();
		if(isPoorBrowser || isNoAnimations){
			var $bodyBg = $('.wrapper-content>.bg');
			$bodyBg.each(function(i){
				if(i === ($bodyBg.length - 1)){
					$(this).css('display', 'block');
				}else{
					$(this).remove();
				}
			});
			$('.view').each(function(){
				var $viewBg = $(this).children('.bg');
				$viewBg.each(function(i){
					if(i === 0){
						$(this).css('display', 'block');
					}else{
						$(this).remove();
					}
				});
			});
		}
		if(isMobile){
			var $bodyImg = $('.wrapper-content>img.bg');
			var $defImgSet = $bodyImg.length>0 ? $bodyImg : $('.view>img.bg');
			if($defImgSet.length > 0){
				var $defImg = $($defImgSet[0]);
				$('.view').each(function(){
					var $sec = $(this);
					var $bg = $sec.children('img.bg');
					if($bg.length<1){
						$defImg.clone().prependTo($sec);
					}
				});
			}
			$('.wrapper-content>img.bg').remove();
		}
		$bacgrounds = $('.bg');
		callback();
	};
	this.setup = function(callback){
		var goodColor = function($el){
			var bg = $el.css('background-color');
			return (
					bg.match(/#/i) ||
					bg.match(/rgb\(/i) ||
					bg.match(/rgba.*,0\)/i)
			);
		};
		$('.view.section-header').each(function(){
			var $this = $(this);
			var $next = $this.nextAll('.view').first().children('.fg');
			if($next.length>0 && goodColor($next)){
				$this.children('.fg').addClass('skew-bottom-right');
			}
		});
		$('.view.section-footer').each(function(){
			var $this = $(this);
			var $prev = $this.prevAll('.view').first().children('.fg');
			if($prev.length>0 && goodColor($prev)){
				$this.children('.fg').addClass('skew-top-right');
			}
		});
		$views.find('.fg').filter('.skew-top-right, .skew-top-left, .skew-bottom-left, .skew-bottom-right').each(function(){
			var $content = $(this);
			var $view = $content.parent();
			if($content.hasClass('skew-top-right') || $content.hasClass('skew-top-left')){
				var $prev = $view.prevAll('.view').first().children('.fg');
				if($prev.length>0 && goodColor($prev)){
					var type = $content.hasClass('skew-top-right') ? 1 : 2;
					$('<div class="skew skew-top-'+(type === 1 ? 'right' : 'left')+'"></div>').appendTo($content).css({
						position: "absolute",
						top: "0px",
						width: "0px",
						height: "0px",
						"border-top-width": type === 2 ? (skewH+"px") : "0px",
						"border-right-width": "2880px",
						"border-bottom-width": type === 1 ? (skewH+"px") : "0px",
						"border-left-width": "0px",
						"border-style": "solid solid solid dashed",
						"border-bottom-color": "transparent",
						"border-left-color":  "transparent"
					}).addClass(getColorClass($prev));
				}
			}
			if($content.hasClass('skew-bottom-left') || $content.hasClass('skew-bottom-right')){
				var $next = $view.nextAll('.view').first().children('.fg');
				if($next.length>0 && goodColor($next)){
					var type = $content.hasClass('skew-bottom-left') ? 1 : 2;
					$('<div class="skew skew-bottom-'+(type === 1 ? 'left' : 'right')+'"></div>').appendTo($content).css({
						position: "absolute",
						bottom: "0px",
						width: "0px",
						height: "0px",
						"border-top-width": type === 1 ? (skewH+"px") : "0px",
						"border-right-width": "0px",
						"border-bottom-width": type === 2 ? (skewH+"px") : "0px",
						"border-left-width": "2880px",
						"border-style": "solid dashed solid solid",
						"border-top-color": "transparent",
						"border-right-color": "transparent"
					}).addClass(getColorClass($next));
				}
			}
		});
		callback();
		function getColorClass($el){
			for(var i=0; i<themes.colors; i++){
				var colorClass = 'colors-'+String.fromCharCode(65+i).toLowerCase();
				if($el.hasClass(colorClass)){
					return colorClass;
				}
			}
		}
	};
	this.ungated = function(){
		$('.wrapper-content, .view').each(function(){
			var $bg = $(this).children('.bg');
			if($bg.length > 1) slideShow.run($bg);
		});
	}
	this.tick = function(){
		$bacgrounds.each(function(){
			var $this = $(this);
			var cfg = $this.data();
			var opa, xr, yr, or;
			if(cfg.ssOpacity !== undefined){
				opa = cfg.ssOpacity;
				xr = cfg.ssOrig.xr;
				yr = cfg.ssOrig.yr;
				or = cfg.ssOrig.or;
			}else{
				opa = 1;
				xr = 1;
				yr = 1;
				or = 'center center';
			}
			var x = cfg.normalX + (cfg.zoomXDelta * xr);
			var y = cfg.normalY + (cfg.zoomYDelta * yr) + (cfg.parallaxY !== undefined ? cfg.parallaxY : 0);
			var sc = cfg.normalScale * (cfg.ssScale !== undefined ? cfg.ssScale : 1);
			if(Modernizr.csstransforms3d && appShare.force3D){
				$this.css({transform: 'translate3d('+x+'px, '+y+'px, 0px) scale('+sc+', '+sc+')', opacity: opa, 'transform-origin': or+' 0px'});
			}else{
				$this.css({transform: 'translate('+x+'px, '+y+'px) scale('+sc+', '+sc+')', opacity: opa, 'transform-origin': or});
			}
		});
	}
	this.buildSizes = function(script){
		var $window = $(window);
		var wh = $window.height();
		var ww = $window.width();
		var $tnav = $('#top-nav:visible');
		var sh = isDecorB ? wh : (wh - ($tnav.length > 0 ? script.topNav.state2H : 0));
		var $bbord = $('.page-border.bottom:visible');
		var borderH = $bbord.length > 0 ? $bbord.height() : 0;
		$('.full-size, .half-size, .one-third-size').each(function() {
			var $this = $(this);
			var minPaddingTop = parseInt($this.css({
				'padding-top': '',
			}).css('padding-top').replace('px', ''));
			var minPaddingBottom = parseInt($this.css({
				'padding-bottom': '',
			}).css('padding-bottom').replace('px', ''));
			var minFullH = isDecorB ? sh : (sh - ($bbord.length > 0 ? borderH : 0));
			var minHalfH = Math.ceil(minFullH / 2);
			var min13H = Math.ceil(minFullH / 3);
			var min = $this.hasClass('full-size') ? minFullH : ($this.hasClass('half-size') ? minHalfH : min13H);
			$this.css({
				'padding-top': minPaddingTop + 'px',
				'padding-bottom': minPaddingBottom + 'px'
			});
			if($this.hasClass('stretch-height') || $this.hasClass('stretch-full-height')){
				$this.css({height: ''});
			}
			var thisH = $this.height();
			if (thisH < min) {
				var delta = min - thisH - minPaddingTop - minPaddingBottom;
				if(delta<0){
					delta=0;
				}
				var topPlus = Math.round(delta / 2);
				var bottomPlus = delta - topPlus;
				var newPaddingTop = minPaddingTop + topPlus;
				var newPaddingBottom = minPaddingBottom + bottomPlus;
				$this.css({
					'padding-top': newPaddingTop + 'px',
					'padding-bottom': newPaddingBottom + 'px'
				});
			}
		});
		$('.stretch-height').each(function(){
			var $this = $(this);
			var $par = $this.parent();
			var $strs = $par.find('.stretch-height');
			$strs.css('height', '');
			if($this.outerWidth()<$par.innerWidth()){
				$strs.css('height', $par.innerHeight()+'px');
			}
		});
		$('.stretch-full-height').each(function(){
			var $this = $(this);
			var $par = $this.parent();
			var $strs = $par.find('.stretch-full-height');
			$strs.css('height', '');
			if($this.outerWidth()<$par.innerWidth()){
				var parH = $par.innerHeight();
				var strsH = wh < parH ? parH : wh;
				$strs.css('height', strsH+'px');
			}
		});
		$views.each(function(i){
			var $view = $(this);
			var $content = $view.find('.fg');
			var $skewTop = $content.find('.skew.skew-top-right, .skew.skew-top-left');
			var $skewBottom = $content.find('.skew.skew-bottom-left, .skew.skew-bottom-right');
			var contentWPx = $content.width()+"px";
			$skewBottom.css({
				"border-left-width": contentWPx
			});
			$skewTop.css({
				"border-right-width": contentWPx
			});
			var viewH = $view.height();
			var viewW = $view.width();
			var targetH = (function(){
				var viewOffset1 = -1 * viewH;
				var viewOffset2 = 0;
				var viewOffset3 = wh - viewH;
				var viewOffset4 = wh;
				var marg1 = appShare.parallaxMargin(script, i, viewOffset1);
				var marg2 = appShare.parallaxMargin(script, i, viewOffset2);
				var marg3 = appShare.parallaxMargin(script, i, viewOffset3);
				var marg4 = appShare.parallaxMargin(script, i, viewOffset4);
				var topDelta = function(viewOffset, marg){
					return marg + (viewOffset > 0 ? 0 : viewOffset);
				};
				var bottomDelta = function(viewOffset, marg){
					var bottomOffset = viewOffset + viewH;
					return -marg - (bottomOffset < wh ? 0 : bottomOffset - wh);
				};
				var delta = 0;
				var curDelta;
				curDelta = topDelta(viewOffset1, marg1); if(curDelta > delta) delta = curDelta;
				curDelta = topDelta(viewOffset2, marg2); if(curDelta > delta) delta = curDelta;
				curDelta = topDelta(viewOffset3, marg3); if(curDelta > delta) delta = curDelta;
				curDelta = topDelta(viewOffset4, marg4); if(curDelta > delta) delta = curDelta;
				curDelta = bottomDelta(viewOffset1, marg1); if(curDelta > delta) delta = curDelta;
				curDelta = bottomDelta(viewOffset2, marg2); if(curDelta > delta) delta = curDelta;
				curDelta = bottomDelta(viewOffset3, marg3); if(curDelta > delta) delta = curDelta;
				curDelta = bottomDelta(viewOffset4, marg4); if(curDelta > delta) delta = curDelta;
				return viewH + (2 * delta);
			})();
			$view.children('img.bg').each(function(){ 
				bgSize($(this), targetH, viewW, viewH);
			});
			$view.data('position', $view.offset().top);
		});
		$('.view').each(function(){
			var $this = $(this);
			$this.data('position', $this.offset().top);
		});
		$('.view>.fg').each(function(){
			var $this = $(this);
			$this.data('position', $this.offset().top);
		});
		$('.wrapper-content').children('img.bg').each(function(){ 
			bgSize($(this), wh, ww, wh);
		});
		var $last = $('.x40-widget, .footer-bottom').last();
		if($last.length > 0){
			$last.css('padding-bottom',  '');
			var compWrapperH = parseFloat(window.getComputedStyle($('.wrapper-site')[0], null).getPropertyValue("height").replace('px',''));
			if(!isNaN(compWrapperH)){
				var dig = compWrapperH - Math.floor(compWrapperH);
				if(dig > 0){
					var compLastP = parseFloat(window.getComputedStyle($last[0], null).getPropertyValue("padding-bottom").replace('px',''));
					if(!isNaN(compLastP)){
						var newP = compLastP + (1-dig);
						$last.css('padding-bottom',  newP + 'px');
					}
				}
			}
		}
		function bgSize($bg, targetH, viewW, viewH){
			var nat = natSize($bg);
			var scale = (viewW/targetH > nat.w/nat.h) ? viewW / nat.w : targetH / nat.h;
			var newW = nat.w * scale;
			var newH = nat.h * scale;
			var zoomXDelta = (newW - nat.w)/2;
			var zoomYDelta = (newH - nat.h)/2;
			var x = Math.round((viewW - newW)/2);
			var y = Math.round((viewH - newH)/2);
			var cfg = $bg.data();
			cfg.normalScale = scale;
			cfg.normalX = x;
			cfg.normalY = y;
			cfg.zoomXDelta = zoomXDelta;
			cfg.zoomYDelta = zoomYDelta;
		}
	};
	this.changeSection = function(script, sectionHash){
		var $sect = $(sectionHash);
		var cls = $sect.data('border-colors');
		if(cls){
			$bord.removeClass(themes.colorClasses);
			$bord.addClass(cls);
		}else{
			if($body.hasClass('state2') && state2Colors){
				$bord.removeClass(themes.colorClasses);
				$bord.addClass(state2Colors);
			}else if(state1Colors){
				$bord.removeClass(themes.colorClasses);
				$bord.addClass(state1Colors);
			}
		}
	};
	function natSize($bg){
		var elem = $bg.get(0);
		var natW, natH;
		if(elem.tagName.toLowerCase() === 'img'){
			natW = elem.width;
			natH = elem.height;
		}else if(elem.naturalWidth){
			natW = elem.naturalWidth;
			natH = elem.naturalHeight;
		}else{
			var orig = $bg.width();
			$bg.css({width: '', height: ''});
			natW = $bg.width();
			natH = $bg.height();
			$bg.css({width: orig});
		}
		return {w: natW, h: natH};
	}
})();
},{"../animation/slide-show.js":4,"./app-share.js":5,"./themes.js":8}],7:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function(scrolling, script){
	var $views = $('.view');
	var appShare = require('./app-share.js');
	var isPoorBrowser = $('html').hasClass('poor-browser');
	this.scroll = function(){
		if(isPoorBrowser) return;
		$views.each(function(i){
			var $view = $(this);
			var viewPos = scrolling.calcPosition($view);
			if(viewPos.visible){
				var viewOffset = viewPos.top - scrolling.windowTopPos;
				$view.children('.bg:not(.static)').each(function(){
					var cfg = $(this).data();
					cfg.parallaxY = appShare.parallaxMargin(script, i, viewOffset);
				});
			}
		});
	};
};
},{"./app-share.js":5}],8:[function(require,module,exports){
"use strict";
module.exports = new (function(){
	var me = this;
	this.colors = 26;
	this.colorClasses = (function(){
		var res = '';
		for(var i=0; i<me.colors; i++){
			var sep = i === 0 ? '' : ' ';
			res += sep + 'colors-'+String.fromCharCode(65+i).toLowerCase();
		}
		return res;
	})();
})();
},{}],9:[function(require,module,exports){
/**
 * Swiper 3.3.0
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * 
 * http://www.idangero.us/swiper/
 * 
 * Copyright 2016, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 * 
 * Licensed under MIT
 * 
 * Released on: January 10, 2016
 */
(function () {
    'use strict';
    var $;
    /*===========================
    Swiper
    ===========================*/
    var Swiper = function (container, params) {
        if (!(this instanceof Swiper)) return new Swiper(container, params);

        var defaults = {
            direction: 'horizontal',
            touchEventsTarget: 'container',
            initialSlide: 0,
            speed: 300,
            // autoplay
            autoplay: false,
            autoplayDisableOnInteraction: true,
            autoplayStopOnLast: false,
            // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
            iOSEdgeSwipeDetection: false,
            iOSEdgeSwipeThreshold: 20,
            // Free mode
            freeMode: false,
            freeModeMomentum: true,
            freeModeMomentumRatio: 1,
            freeModeMomentumBounce: true,
            freeModeMomentumBounceRatio: 1,
            freeModeSticky: false,
            freeModeMinimumVelocity: 0.02,
            // Autoheight
            autoHeight: false,
            // Set wrapper width
            setWrapperSize: false,
            // Virtual Translate
            virtualTranslate: false,
            // Effects
            effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
            coverflow: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows : true
            },
            flip: {
                slideShadows : true,
                limitRotation: true
            },
            cube: {
                slideShadows: true,
                shadow: true,
                shadowOffset: 20,
                shadowScale: 0.94
            },
            fade: {
                crossFade: false
            },
            // Parallax
            parallax: false,
            // Scrollbar
            scrollbar: null,
            scrollbarHide: true,
            scrollbarDraggable: false,
            scrollbarSnapOnRelease: false,
            // Keyboard Mousewheel
            keyboardControl: false,
            mousewheelControl: false,
            mousewheelReleaseOnEdges: false,
            mousewheelInvert: false,
            mousewheelForceToAxis: false,
            mousewheelSensitivity: 1,
            // Hash Navigation
            hashnav: false,
            // Breakpoints
            breakpoints: undefined,
            // Slides grid
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerColumnFill: 'column',
            slidesPerGroup: 1,
            centeredSlides: false,
            slidesOffsetBefore: 0, // in px
            slidesOffsetAfter: 0, // in px
            // Round length
            roundLengths: false,
            // Touches
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: true,
            shortSwipes: true,
            longSwipes: true,
            longSwipesRatio: 0.5,
            longSwipesMs: 300,
            followFinger: true,
            onlyExternal: false,
            threshold: 0,
            touchMoveStopPropagation: true,
            // Pagination
            pagination: null,
            paginationElement: 'span',
            paginationClickable: false,
            paginationHide: false,
            paginationBulletRender: null,
            paginationProgressRender: null,
            paginationFractionRender: null,
            paginationCustomRender: null,
            paginationType: 'bullets', // 'bullets' or 'progress' or 'fraction' or 'custom'
            // Resistance
            resistance: true,
            resistanceRatio: 0.85,
            // Next/prev buttons
            nextButton: null,
            prevButton: null,
            // Progress
            watchSlidesProgress: false,
            watchSlidesVisibility: false,
            // Cursor
            grabCursor: false,
            // Clicks
            preventClicks: true,
            preventClicksPropagation: true,
            slideToClickedSlide: false,
            // Lazy Loading
            lazyLoading: false,
            lazyLoadingInPrevNext: false,
            lazyLoadingInPrevNextAmount: 1,
            lazyLoadingOnTransitionStart: false,
            // Images
            preloadImages: true,
            updateOnImagesReady: true,
            // loop
            loop: false,
            loopAdditionalSlides: 0,
            loopedSlides: null,
            // Control
            control: undefined,
            controlInverse: false,
            controlBy: 'slide', //or 'container'
            // Swiping/no swiping
            allowSwipeToPrev: true,
            allowSwipeToNext: true,
            swipeHandler: null, //'.swipe-handler',
            noSwiping: true,
            noSwipingClass: 'swiper-no-swiping',
            // NS
            slideClass: 'swiper-slide',
            slideActiveClass: 'swiper-slide-active',
            slideVisibleClass: 'swiper-slide-visible',
            slideDuplicateClass: 'swiper-slide-duplicate',
            slideNextClass: 'swiper-slide-next',
            slidePrevClass: 'swiper-slide-prev',
            wrapperClass: 'swiper-wrapper',
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
            buttonDisabledClass: 'swiper-button-disabled',
            paginationCurrentClass: 'swiper-pagination-current',
            paginationTotalClass: 'swiper-pagination-total',
            paginationHiddenClass: 'swiper-pagination-hidden',
            paginationProgressbarClass: 'swiper-pagination-progressbar',
            // Observer
            observer: false,
            observeParents: false,
            // Accessibility
            a11y: false,
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            firstSlideMessage: 'This is the first slide',
            lastSlideMessage: 'This is the last slide',
            paginationBulletMessage: 'Go to slide {{index}}',
            // Callbacks
            runCallbacksOnInit: true
            /*
            Callbacks:
            onInit: function (swiper)
            onDestroy: function (swiper)
            onClick: function (swiper, e)
            onTap: function (swiper, e)
            onDoubleTap: function (swiper, e)
            onSliderMove: function (swiper, e)
            onSlideChangeStart: function (swiper)
            onSlideChangeEnd: function (swiper)
            onTransitionStart: function (swiper)
            onTransitionEnd: function (swiper)
            onImagesReady: function (swiper)
            onProgress: function (swiper, progress)
            onTouchStart: function (swiper, e)
            onTouchMove: function (swiper, e)
            onTouchMoveOpposite: function (swiper, e)
            onTouchEnd: function (swiper, e)
            onReachBeginning: function (swiper)
            onReachEnd: function (swiper)
            onSetTransition: function (swiper, duration)
            onSetTranslate: function (swiper, translate)
            onAutoplayStart: function (swiper)
            onAutoplayStop: function (swiper),
            onLazyImageLoad: function (swiper, slide, image)
            onLazyImageReady: function (swiper, slide, image)
            */
        
        };
        var initialVirtualTranslate = params && params.virtualTranslate;
        
        params = params || {};
        var originalParams = {};
        for (var param in params) {
            if (typeof params[param] === 'object' && params[param] !== null && !(params[param].nodeType || params[param] === window || params[param] === document || (typeof Dom7 !== 'undefined' && params[param] instanceof Dom7) || (typeof jQuery !== 'undefined' && params[param] instanceof jQuery))) {
                originalParams[param] = {};
                for (var deepParam in params[param]) {
                    originalParams[param][deepParam] = params[param][deepParam];
                }
            }
            else {
                originalParams[param] = params[param];
            }
        }
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
            else if (typeof params[def] === 'object') {
                for (var deepDef in defaults[def]) {
                    if (typeof params[def][deepDef] === 'undefined') {
                        params[def][deepDef] = defaults[def][deepDef];
                    }
                }
            }
        }
        
        // Swiper
        var s = this;
        
        // Params
        s.params = params;
        s.originalParams = originalParams;
        
        // Classname
        s.classNames = [];
        /*=========================
          Dom Library and plugins
          ===========================*/
        if (typeof $ !== 'undefined' && typeof Dom7 !== 'undefined'){
            $ = Dom7;
        }
        if (typeof $ === 'undefined') {
            if (typeof Dom7 === 'undefined') {
                $ = window.Dom7 || window.Zepto || window.jQuery;
            }
            else {
                $ = Dom7;
            }
            if (!$) return;
        }
        // Export it to Swiper instance
        s.$ = $;
        
        /*=========================
          Breakpoints
          ===========================*/
        s.currentBreakpoint = undefined;
        s.getActiveBreakpoint = function () {
            //Get breakpoint for window width
            if (!s.params.breakpoints) return false;
            var breakpoint = false;
            var points = [], point;
            for ( point in s.params.breakpoints ) {
                if (s.params.breakpoints.hasOwnProperty(point)) {
                    points.push(point);
                }
            }
            points.sort(function (a, b) {
                return parseInt(a, 10) > parseInt(b, 10);
            });
            for (var i = 0; i < points.length; i++) {
                point = points[i];
                if (point >= window.innerWidth && !breakpoint) {
                    breakpoint = point;
                }
            }
            return breakpoint || 'max';
        };
        s.setBreakpoint = function () {
            //Set breakpoint for window width and update parameters
            var breakpoint = s.getActiveBreakpoint();
            if (breakpoint && s.currentBreakpoint !== breakpoint) {
                var breakPointsParams = breakpoint in s.params.breakpoints ? s.params.breakpoints[breakpoint] : s.originalParams;
                for ( var param in breakPointsParams ) {
                    s.params[param] = breakPointsParams[param];
                }
                s.currentBreakpoint = breakpoint;
            }
        };
        // Set breakpoint on load
        if (s.params.breakpoints) {
            s.setBreakpoint();
        }
        
        /*=========================
          Preparation - Define Container, Wrapper and Pagination
          ===========================*/
        s.container = $(container);
        if (s.container.length === 0) return;
        if (s.container.length > 1) {
            s.container.each(function () {
                new Swiper(this, params);
            });
            return;
        }
        
        // Save instance in container HTML Element and in data
        s.container[0].swiper = s;
        s.container.data('swiper', s);
        
        s.classNames.push('swiper-container-' + s.params.direction);
        
        if (s.params.freeMode) {
            s.classNames.push('swiper-container-free-mode');
        }
        if (!s.support.flexbox) {
            s.classNames.push('swiper-container-no-flexbox');
            s.params.slidesPerColumn = 1;
        }
        if (s.params.autoHeight) {
            s.classNames.push('swiper-container-autoheight');
        }
        // Enable slides progress when required
        if (s.params.parallax || s.params.watchSlidesVisibility) {
            s.params.watchSlidesProgress = true;
        }
        // Coverflow / 3D
        if (['cube', 'coverflow', 'flip'].indexOf(s.params.effect) >= 0) {
            if (s.support.transforms3d) {
                s.params.watchSlidesProgress = true;
                s.classNames.push('swiper-container-3d');
            }
            else {
                s.params.effect = 'slide';
            }
        }
        if (s.params.effect !== 'slide') {
            s.classNames.push('swiper-container-' + s.params.effect);
        }
        if (s.params.effect === 'cube') {
            s.params.resistanceRatio = 0;
            s.params.slidesPerView = 1;
            s.params.slidesPerColumn = 1;
            s.params.slidesPerGroup = 1;
            s.params.centeredSlides = false;
            s.params.spaceBetween = 0;
            s.params.virtualTranslate = true;
            s.params.setWrapperSize = false;
        }
        if (s.params.effect === 'fade' || s.params.effect === 'flip') {
            s.params.slidesPerView = 1;
            s.params.slidesPerColumn = 1;
            s.params.slidesPerGroup = 1;
            s.params.watchSlidesProgress = true;
            s.params.spaceBetween = 0;
            s.params.setWrapperSize = false;
            if (typeof initialVirtualTranslate === 'undefined') {
                s.params.virtualTranslate = true;
            }
        }
        
        // Grab Cursor
        if (s.params.grabCursor && s.support.touch) {
            s.params.grabCursor = false;
        }
        
        // Wrapper
        s.wrapper = s.container.children('.' + s.params.wrapperClass);
        
        // Pagination
        if (s.params.pagination) {
            s.paginationContainer = $(s.params.pagination);
            if (s.params.paginationType === 'bullets' && s.params.paginationClickable) {
                s.paginationContainer.addClass('swiper-pagination-clickable');
            }
            else {
                s.params.paginationClickable = false;
            }
            s.paginationContainer.addClass('swiper-pagination-' + s.params.paginationType);
        }
        
        // Is Horizontal
        s.isHorizontal = function () {
            return s.params.direction === 'horizontal';
        };
        // s.isH = isH;
        
        // RTL
        s.rtl = s.isHorizontal() && (s.container[0].dir.toLowerCase() === 'rtl' || s.container.css('direction') === 'rtl');
        if (s.rtl) {
            s.classNames.push('swiper-container-rtl');
        }
        
        // Wrong RTL support
        if (s.rtl) {
            s.wrongRTL = s.wrapper.css('display') === '-webkit-box';
        }
        
        // Columns
        if (s.params.slidesPerColumn > 1) {
            s.classNames.push('swiper-container-multirow');
        }
        
        // Check for Android
        if (s.device.android) {
            s.classNames.push('swiper-container-android');
        }
        
        // Add classes
        s.container.addClass(s.classNames.join(' '));
        
        // Translate
        s.translate = 0;
        
        // Progress
        s.progress = 0;
        
        // Velocity
        s.velocity = 0;
        
        /*=========================
          Locks, unlocks
          ===========================*/
        s.lockSwipeToNext = function () {
            s.params.allowSwipeToNext = false;
        };
        s.lockSwipeToPrev = function () {
            s.params.allowSwipeToPrev = false;
        };
        s.lockSwipes = function () {
            s.params.allowSwipeToNext = s.params.allowSwipeToPrev = false;
        };
        s.unlockSwipeToNext = function () {
            s.params.allowSwipeToNext = true;
        };
        s.unlockSwipeToPrev = function () {
            s.params.allowSwipeToPrev = true;
        };
        s.unlockSwipes = function () {
            s.params.allowSwipeToNext = s.params.allowSwipeToPrev = true;
        };
        
        /*=========================
          Round helper
          ===========================*/
        function round(a) {
            return Math.floor(a);
        }
        /*=========================
          Set grab cursor
          ===========================*/
        if (s.params.grabCursor) {
            s.container[0].style.cursor = 'move';
            s.container[0].style.cursor = '-webkit-grab';
            s.container[0].style.cursor = '-moz-grab';
            s.container[0].style.cursor = 'grab';
        }
        /*=========================
          Update on Images Ready
          ===========================*/
        s.imagesToLoad = [];
        s.imagesLoaded = 0;
        
        s.loadImage = function (imgElement, src, srcset, checkForComplete, callback) {
            var image;
            function onReady () {
                if (callback) callback();
            }
            if (!imgElement.complete || !checkForComplete) {
                if (src) {
                    image = new window.Image();
                    image.onload = onReady;
                    image.onerror = onReady;
                    if (srcset) {
                        image.srcset = srcset;
                    }
                    if (src) {
                        image.src = src;
                    }
                } else {
                    onReady();
                }
        
            } else {//image already loaded...
                onReady();
            }
        };
        s.preloadImages = function () {
            s.imagesToLoad = s.container.find('img');
            function _onReady() {
                if (typeof s === 'undefined' || s === null) return;
                if (s.imagesLoaded !== undefined) s.imagesLoaded++;
                if (s.imagesLoaded === s.imagesToLoad.length) {
                    if (s.params.updateOnImagesReady) s.update();
                    s.emit('onImagesReady', s);
                }
            }
            for (var i = 0; i < s.imagesToLoad.length; i++) {
                s.loadImage(s.imagesToLoad[i], (s.imagesToLoad[i].currentSrc || s.imagesToLoad[i].getAttribute('src')), (s.imagesToLoad[i].srcset || s.imagesToLoad[i].getAttribute('srcset')), true, _onReady);
            }
        };
        
        /*=========================
          Autoplay
          ===========================*/
        s.autoplayTimeoutId = undefined;
        s.autoplaying = false;
        s.autoplayPaused = false;
        function autoplay() {
            s.autoplayTimeoutId = setTimeout(function () {
                if (s.params.loop) {
                    s.fixLoop();
                    s._slideNext();
                    s.emit('onAutoplay', s);
                }
                else {
                    if (!s.isEnd) {
                        s._slideNext();
                        s.emit('onAutoplay', s);
                    }
                    else {
                        if (!params.autoplayStopOnLast) {
                            s._slideTo(0);
                            s.emit('onAutoplay', s);
                        }
                        else {
                            s.stopAutoplay();
                        }
                    }
                }
            }, s.params.autoplay);
        }
        s.startAutoplay = function () {
            if (typeof s.autoplayTimeoutId !== 'undefined') return false;
            if (!s.params.autoplay) return false;
            if (s.autoplaying) return false;
            s.autoplaying = true;
            s.emit('onAutoplayStart', s);
            autoplay();
        };
        s.stopAutoplay = function (internal) {
            if (!s.autoplayTimeoutId) return;
            if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
            s.autoplaying = false;
            s.autoplayTimeoutId = undefined;
            s.emit('onAutoplayStop', s);
        };
        s.pauseAutoplay = function (speed) {
            if (s.autoplayPaused) return;
            if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
            s.autoplayPaused = true;
            if (speed === 0) {
                s.autoplayPaused = false;
                autoplay();
            }
            else {
                s.wrapper.transitionEnd(function () {
                    if (!s) return;
                    s.autoplayPaused = false;
                    if (!s.autoplaying) {
                        s.stopAutoplay();
                    }
                    else {
                        autoplay();
                    }
                });
            }
        };
        /*=========================
          Min/Max Translate
          ===========================*/
        s.minTranslate = function () {
            return (-s.snapGrid[0]);
        };
        s.maxTranslate = function () {
            return (-s.snapGrid[s.snapGrid.length - 1]);
        };
        /*=========================
          Slider/slides sizes
          ===========================*/
        s.updateAutoHeight = function () {
            // Update Height
            var slide = s.slides.eq(s.activeIndex)[0];
            if (typeof slide !== 'undefined') {
                var newHeight = slide.offsetHeight;
                if (newHeight) s.wrapper.css('height', newHeight + 'px');
            }
        };
        s.updateContainerSize = function () {
            var width, height;
            if (typeof s.params.width !== 'undefined') {
                width = s.params.width;
            }
            else {
                width = s.container[0].clientWidth;
            }
            if (typeof s.params.height !== 'undefined') {
                height = s.params.height;
            }
            else {
                height = s.container[0].clientHeight;
            }
            if (width === 0 && s.isHorizontal() || height === 0 && !s.isHorizontal()) {
                return;
            }
        
            //Subtract paddings
            width = width - parseInt(s.container.css('padding-left'), 10) - parseInt(s.container.css('padding-right'), 10);
            height = height - parseInt(s.container.css('padding-top'), 10) - parseInt(s.container.css('padding-bottom'), 10);
        
            // Store values
            s.width = width;
            s.height = height;
            s.size = s.isHorizontal() ? s.width : s.height;
        };
        
        s.updateSlidesSize = function () {
            s.slides = s.wrapper.children('.' + s.params.slideClass);
            s.snapGrid = [];
            s.slidesGrid = [];
            s.slidesSizesGrid = [];
        
            var spaceBetween = s.params.spaceBetween,
                slidePosition = -s.params.slidesOffsetBefore,
                i,
                prevSlideSize = 0,
                index = 0;
            if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
                spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * s.size;
            }
        
            s.virtualSize = -spaceBetween;
            // reset margins
            if (s.rtl) s.slides.css({marginLeft: '', marginTop: ''});
            else s.slides.css({marginRight: '', marginBottom: ''});
        
            var slidesNumberEvenToRows;
            if (s.params.slidesPerColumn > 1) {
                if (Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn) {
                    slidesNumberEvenToRows = s.slides.length;
                }
                else {
                    slidesNumberEvenToRows = Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn;
                }
                if (s.params.slidesPerView !== 'auto' && s.params.slidesPerColumnFill === 'row') {
                    slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, s.params.slidesPerView * s.params.slidesPerColumn);
                }
            }
        
            // Calc slides
            var slideSize;
            var slidesPerColumn = s.params.slidesPerColumn;
            var slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
            var numFullColumns = slidesPerRow - (s.params.slidesPerColumn * slidesPerRow - s.slides.length);
            for (i = 0; i < s.slides.length; i++) {
                slideSize = 0;
                var slide = s.slides.eq(i);
                if (s.params.slidesPerColumn > 1) {
                    // Set slides order
                    var newSlideOrderIndex;
                    var column, row;
                    if (s.params.slidesPerColumnFill === 'column') {
                        column = Math.floor(i / slidesPerColumn);
                        row = i - column * slidesPerColumn;
                        if (column > numFullColumns || (column === numFullColumns && row === slidesPerColumn-1)) {
                            if (++row >= slidesPerColumn) {
                                row = 0;
                                column++;
                            }
                        }
                        newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
                        slide
                            .css({
                                '-webkit-box-ordinal-group': newSlideOrderIndex,
                                '-moz-box-ordinal-group': newSlideOrderIndex,
                                '-ms-flex-order': newSlideOrderIndex,
                                '-webkit-order': newSlideOrderIndex,
                                'order': newSlideOrderIndex
                            });
                    }
                    else {
                        row = Math.floor(i / slidesPerRow);
                        column = i - row * slidesPerRow;
                    }
                    slide
                        .css({
                            'margin-top': (row !== 0 && s.params.spaceBetween) && (s.params.spaceBetween + 'px')
                        })
                        .attr('data-swiper-column', column)
                        .attr('data-swiper-row', row);
        
                }
                if (slide.css('display') === 'none') continue;
                if (s.params.slidesPerView === 'auto') {
                    slideSize = s.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
                    if (s.params.roundLengths) slideSize = round(slideSize);
                }
                else {
                    slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;
                    if (s.params.roundLengths) slideSize = round(slideSize);
        
                    if (s.isHorizontal()) {
                        s.slides[i].style.width = slideSize + 'px';
                    }
                    else {
                        s.slides[i].style.height = slideSize + 'px';
                    }
                }
                s.slides[i].swiperSlideSize = slideSize;
                s.slidesSizesGrid.push(slideSize);
        
        
                if (s.params.centeredSlides) {
                    slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                    if (i === 0) slidePosition = slidePosition - s.size / 2 - spaceBetween;
                    if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
                    if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                    s.slidesGrid.push(slidePosition);
                }
                else {
                    if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                    s.slidesGrid.push(slidePosition);
                    slidePosition = slidePosition + slideSize + spaceBetween;
                }
        
                s.virtualSize += slideSize + spaceBetween;
        
                prevSlideSize = slideSize;
        
                index ++;
            }
            s.virtualSize = Math.max(s.virtualSize, s.size) + s.params.slidesOffsetAfter;
            var newSlidesGrid;
        
            if (
                s.rtl && s.wrongRTL && (s.params.effect === 'slide' || s.params.effect === 'coverflow')) {
                s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
            }
            if (!s.support.flexbox || s.params.setWrapperSize) {
                if (s.isHorizontal()) s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
                else s.wrapper.css({height: s.virtualSize + s.params.spaceBetween + 'px'});
            }
        
            if (s.params.slidesPerColumn > 1) {
                s.virtualSize = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;
                s.virtualSize = Math.ceil(s.virtualSize / s.params.slidesPerColumn) - s.params.spaceBetween;
                s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
                if (s.params.centeredSlides) {
                    newSlidesGrid = [];
                    for (i = 0; i < s.snapGrid.length; i++) {
                        if (s.snapGrid[i] < s.virtualSize + s.snapGrid[0]) newSlidesGrid.push(s.snapGrid[i]);
                    }
                    s.snapGrid = newSlidesGrid;
                }
            }
        
            // Remove last grid elements depending on width
            if (!s.params.centeredSlides) {
                newSlidesGrid = [];
                for (i = 0; i < s.snapGrid.length; i++) {
                    if (s.snapGrid[i] <= s.virtualSize - s.size) {
                        newSlidesGrid.push(s.snapGrid[i]);
                    }
                }
                s.snapGrid = newSlidesGrid;
                if (Math.floor(s.virtualSize - s.size) > Math.floor(s.snapGrid[s.snapGrid.length - 1])) {
                    s.snapGrid.push(s.virtualSize - s.size);
                }
            }
            if (s.snapGrid.length === 0) s.snapGrid = [0];
        
            if (s.params.spaceBetween !== 0) {
                if (s.isHorizontal()) {
                    if (s.rtl) s.slides.css({marginLeft: spaceBetween + 'px'});
                    else s.slides.css({marginRight: spaceBetween + 'px'});
                }
                else s.slides.css({marginBottom: spaceBetween + 'px'});
            }
            if (s.params.watchSlidesProgress) {
                s.updateSlidesOffset();
            }
        };
        s.updateSlidesOffset = function () {
            for (var i = 0; i < s.slides.length; i++) {
                s.slides[i].swiperSlideOffset = s.isHorizontal() ? s.slides[i].offsetLeft : s.slides[i].offsetTop;
            }
        };
        
        /*=========================
          Slider/slides progress
          ===========================*/
        s.updateSlidesProgress = function (translate) {
            if (typeof translate === 'undefined') {
                translate = s.translate || 0;
            }
            if (s.slides.length === 0) return;
            if (typeof s.slides[0].swiperSlideOffset === 'undefined') s.updateSlidesOffset();
        
            var offsetCenter = -translate;
            if (s.rtl) offsetCenter = translate;
        
            // Visible Slides
            s.slides.removeClass(s.params.slideVisibleClass);
            for (var i = 0; i < s.slides.length; i++) {
                var slide = s.slides[i];
                var slideProgress = (offsetCenter - slide.swiperSlideOffset) / (slide.swiperSlideSize + s.params.spaceBetween);
                if (s.params.watchSlidesVisibility) {
                    var slideBefore = -(offsetCenter - slide.swiperSlideOffset);
                    var slideAfter = slideBefore + s.slidesSizesGrid[i];
                    var isVisible =
                        (slideBefore >= 0 && slideBefore < s.size) ||
                        (slideAfter > 0 && slideAfter <= s.size) ||
                        (slideBefore <= 0 && slideAfter >= s.size);
                    if (isVisible) {
                        s.slides.eq(i).addClass(s.params.slideVisibleClass);
                    }
                }
                slide.progress = s.rtl ? -slideProgress : slideProgress;
            }
        };
        s.updateProgress = function (translate) {
            if (typeof translate === 'undefined') {
                translate = s.translate || 0;
            }
            var translatesDiff = s.maxTranslate() - s.minTranslate();
            var wasBeginning = s.isBeginning;
            var wasEnd = s.isEnd;
            if (translatesDiff === 0) {
                s.progress = 0;
                s.isBeginning = s.isEnd = true;
            }
            else {
                s.progress = (translate - s.minTranslate()) / (translatesDiff);
                s.isBeginning = s.progress <= 0;
                s.isEnd = s.progress >= 1;
            }
            if (s.isBeginning && !wasBeginning) s.emit('onReachBeginning', s);
            if (s.isEnd && !wasEnd) s.emit('onReachEnd', s);
        
            if (s.params.watchSlidesProgress) s.updateSlidesProgress(translate);
            s.emit('onProgress', s, s.progress);
        };
        s.updateActiveIndex = function () {
            var translate = s.rtl ? s.translate : -s.translate;
            var newActiveIndex, i, snapIndex;
            for (i = 0; i < s.slidesGrid.length; i ++) {
                if (typeof s.slidesGrid[i + 1] !== 'undefined') {
                    if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2) {
                        newActiveIndex = i;
                    }
                    else if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1]) {
                        newActiveIndex = i + 1;
                    }
                }
                else {
                    if (translate >= s.slidesGrid[i]) {
                        newActiveIndex = i;
                    }
                }
            }
            // Normalize slideIndex
            if (newActiveIndex < 0 || typeof newActiveIndex === 'undefined') newActiveIndex = 0;
            // for (i = 0; i < s.slidesGrid.length; i++) {
                // if (- translate >= s.slidesGrid[i]) {
                    // newActiveIndex = i;
                // }
            // }
            snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup);
            if (snapIndex >= s.snapGrid.length) snapIndex = s.snapGrid.length - 1;
        
            if (newActiveIndex === s.activeIndex) {
                return;
            }
            s.snapIndex = snapIndex;
            s.previousIndex = s.activeIndex;
            s.activeIndex = newActiveIndex;
            s.updateClasses();
        };
        
        /*=========================
          Classes
          ===========================*/
        s.updateClasses = function () {
            s.slides.removeClass(s.params.slideActiveClass + ' ' + s.params.slideNextClass + ' ' + s.params.slidePrevClass);
            var activeSlide = s.slides.eq(s.activeIndex);
            // Active classes
            activeSlide.addClass(s.params.slideActiveClass);
            activeSlide.next('.' + s.params.slideClass).addClass(s.params.slideNextClass);
            activeSlide.prev('.' + s.params.slideClass).addClass(s.params.slidePrevClass);
        
            // Pagination
            if (s.paginationContainer && s.paginationContainer.length > 0) {
                // Current/Total
                var current,
                    total = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
                if (s.params.loop) {
                    current = Math.ceil(s.activeIndex - s.loopedSlides)/s.params.slidesPerGroup;
                    if (current > s.slides.length - 1 - s.loopedSlides * 2) {
                        current = current - (s.slides.length - s.loopedSlides * 2);
                    }
                    if (current > total - 1) current = current - total;
                    if (current < 0 && s.params.paginationType !== 'bullets') current = total + current;
                }
                else {
                    if (typeof s.snapIndex !== 'undefined') {
                        current = s.snapIndex;
                    }
                    else {
                        current = s.activeIndex || 0;
                    }
                }
                // Types
                if (s.params.paginationType === 'bullets' && s.bullets && s.bullets.length > 0) {
                    s.bullets.removeClass(s.params.bulletActiveClass);
                    if (s.paginationContainer.length > 1) {
                        s.bullets.each(function () {
                            if ($(this).index() === current) $(this).addClass(s.params.bulletActiveClass);
                        });
                    }
                    else {
                        s.bullets.eq(current).addClass(s.params.bulletActiveClass);
                    }
                }
                if (s.params.paginationType === 'fraction') {
                    s.paginationContainer.find('.' + s.params.paginationCurrentClass).text(current + 1);
                    s.paginationContainer.find('.' + s.params.paginationTotalClass).text(total);
                }
                if (s.params.paginationType === 'progress') {
                    var scale = (current + 1) / total,
                        scaleX = scale,
                        scaleY = 1;
                    if (!s.isHorizontal()) {
                        scaleY = scale;
                        scaleX = 1;
                    }
                    s.paginationContainer.find('.' + s.params.paginationProgressbarClass).transform('translate3d(0,0,0) scaleX(' + scaleX + ') scaleY(' + scaleY + ')').transition(s.params.speed);
                }
                if (s.params.paginationType === 'custom' && s.params.paginationCustomRender) {
                    s.paginationContainer.html(s.params.paginationCustomRender(s, current + 1, total));
                }
            }
        
            // Next/active buttons
            if (!s.params.loop) {
                if (s.params.prevButton) {
                    if (s.isBeginning) {
                        $(s.params.prevButton).addClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.disable($(s.params.prevButton));
                    }
                    else {
                        $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.enable($(s.params.prevButton));
                    }
                }
                if (s.params.nextButton) {
                    if (s.isEnd) {
                        $(s.params.nextButton).addClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.disable($(s.params.nextButton));
                    }
                    else {
                        $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.enable($(s.params.nextButton));
                    }
                }
            }
        };
        
        /*=========================
          Pagination
          ===========================*/
        s.updatePagination = function () {
            if (!s.params.pagination) return;
            if (s.paginationContainer && s.paginationContainer.length > 0) {
                var paginationHTML = '';
                if (s.params.paginationType === 'bullets') {
                    var numberOfBullets = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
                    for (var i = 0; i < numberOfBullets; i++) {
                        if (s.params.paginationBulletRender) {
                            paginationHTML += s.params.paginationBulletRender(i, s.params.bulletClass);
                        }
                        else {
                            paginationHTML += '<' + s.params.paginationElement+' class="' + s.params.bulletClass + '"></' + s.params.paginationElement + '>';
                        }
                    }
                    s.paginationContainer.html(paginationHTML);
                    s.bullets = s.paginationContainer.find('.' + s.params.bulletClass);
                    if (s.params.paginationClickable && s.params.a11y && s.a11y) {
                        s.a11y.initPagination();
                    }
                }
                if (s.params.paginationType === 'fraction') {
                    if (s.params.paginationFractionRender) {
                        paginationHTML = s.params.paginationFractionRender(s, s.params.paginationCurrentClass, s.params.paginationTotalClass);
                    }
                    else {
                        paginationHTML =
                            '<span class="' + s.params.paginationCurrentClass + '"></span>' +
                            ' / ' +
                            '<span class="' + s.params.paginationTotalClass+'"></span>';
                    }
                    s.paginationContainer.html(paginationHTML);
                }
                if (s.params.paginationType === 'progress') {
                    if (s.params.paginationProgressRender) {
                        paginationHTML = s.params.paginationProgressRender(s, s.params.paginationProgressbarClass);
                    }
                    else {
                        paginationHTML = '<span class="' + s.params.paginationProgressbarClass + '"></span>';
                    }
                    s.paginationContainer.html(paginationHTML);
                }
            }
        };
        /*=========================
          Common update method
          ===========================*/
        s.update = function (updateTranslate) {
            s.updateContainerSize();
            s.updateSlidesSize();
            s.updateProgress();
            s.updatePagination();
            s.updateClasses();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
            }
            function forceSetTranslate() {
                newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                s.setWrapperTranslate(newTranslate);
                s.updateActiveIndex();
                s.updateClasses();
            }
            if (updateTranslate) {
                var translated, newTranslate;
                if (s.controller && s.controller.spline) {
                    s.controller.spline = undefined;
                }
                if (s.params.freeMode) {
                    forceSetTranslate();
                    if (s.params.autoHeight) {
                        s.updateAutoHeight();
                    }
                }
                else {
                    if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
                        translated = s.slideTo(s.slides.length - 1, 0, false, true);
                    }
                    else {
                        translated = s.slideTo(s.activeIndex, 0, false, true);
                    }
                    if (!translated) {
                        forceSetTranslate();
                    }
                }
            }
            else if (s.params.autoHeight) {
                s.updateAutoHeight();
            }
        };
        
        /*=========================
          Resize Handler
          ===========================*/
        s.onResize = function (forceUpdatePagination) {
            //Breakpoints
            if (s.params.breakpoints) {
                s.setBreakpoint();
            }
        
            // Disable locks on resize
            var allowSwipeToPrev = s.params.allowSwipeToPrev;
            var allowSwipeToNext = s.params.allowSwipeToNext;
            s.params.allowSwipeToPrev = s.params.allowSwipeToNext = true;
        
            s.updateContainerSize();
            s.updateSlidesSize();
            if (s.params.slidesPerView === 'auto' || s.params.freeMode || forceUpdatePagination) s.updatePagination();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
            }
            if (s.controller && s.controller.spline) {
                s.controller.spline = undefined;
            }
            if (s.params.freeMode) {
                var newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                s.setWrapperTranslate(newTranslate);
                s.updateActiveIndex();
                s.updateClasses();
        
                if (s.params.autoHeight) {
                    s.updateAutoHeight();
                }
            }
            else {
                s.updateClasses();
                if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
                    s.slideTo(s.slides.length - 1, 0, false, true);
                }
                else {
                    s.slideTo(s.activeIndex, 0, false, true);
                }
            }
            // Return locks after resize
            s.params.allowSwipeToPrev = allowSwipeToPrev;
            s.params.allowSwipeToNext = allowSwipeToNext;
        };
        
        /*=========================
          Events
          ===========================*/
        
        //Define Touch Events
        var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
        if (window.navigator.pointerEnabled) desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
        else if (window.navigator.msPointerEnabled) desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
        s.touchEvents = {
            start : s.support.touch || !s.params.simulateTouch  ? 'touchstart' : desktopEvents[0],
            move : s.support.touch || !s.params.simulateTouch ? 'touchmove' : desktopEvents[1],
            end : s.support.touch || !s.params.simulateTouch ? 'touchend' : desktopEvents[2]
        };
        
        
        // WP8 Touch Events Fix
        if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) {
            (s.params.touchEventsTarget === 'container' ? s.container : s.wrapper).addClass('swiper-wp8-' + s.params.direction);
        }
        
        // Attach/detach events
        s.initEvents = function (detach) {
            var actionDom = detach ? 'off' : 'on';
            var action = detach ? 'removeEventListener' : 'addEventListener';
            var touchEventsTarget = s.params.touchEventsTarget === 'container' ? s.container[0] : s.wrapper[0];
            var target = s.support.touch ? touchEventsTarget : document;
        
            var moveCapture = s.params.nested ? true : false;
        
            //Touch Events
            if (s.browser.ie) {
                touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
                target[action](s.touchEvents.move, s.onTouchMove, moveCapture);
                target[action](s.touchEvents.end, s.onTouchEnd, false);
            }
            else {
                if (s.support.touch) {
                    touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
                    touchEventsTarget[action](s.touchEvents.move, s.onTouchMove, moveCapture);
                    touchEventsTarget[action](s.touchEvents.end, s.onTouchEnd, false);
                }
                if (params.simulateTouch && !s.device.ios && !s.device.android) {
                    touchEventsTarget[action]('mousedown', s.onTouchStart, false);
                    document[action]('mousemove', s.onTouchMove, moveCapture);
                    document[action]('mouseup', s.onTouchEnd, false);
                }
            }
            window[action]('resize', s.onResize);
        
            // Next, Prev, Index
            if (s.params.nextButton) {
                $(s.params.nextButton)[actionDom]('click', s.onClickNext);
                if (s.params.a11y && s.a11y) $(s.params.nextButton)[actionDom]('keydown', s.a11y.onEnterKey);
            }
            if (s.params.prevButton) {
                $(s.params.prevButton)[actionDom]('click', s.onClickPrev);
                if (s.params.a11y && s.a11y) $(s.params.prevButton)[actionDom]('keydown', s.a11y.onEnterKey);
            }
            if (s.params.pagination && s.params.paginationClickable) {
                $(s.paginationContainer)[actionDom]('click', '.' + s.params.bulletClass, s.onClickIndex);
                if (s.params.a11y && s.a11y) $(s.paginationContainer)[actionDom]('keydown', '.' + s.params.bulletClass, s.a11y.onEnterKey);
            }
        
            // Prevent Links Clicks
            if (s.params.preventClicks || s.params.preventClicksPropagation) touchEventsTarget[action]('click', s.preventClicks, true);
        };
        s.attachEvents = function (detach) {
            s.initEvents();
        };
        s.detachEvents = function () {
            s.initEvents(true);
        };
        
        /*=========================
          Handle Clicks
          ===========================*/
        // Prevent Clicks
        s.allowClick = true;
        s.preventClicks = function (e) {
            if (!s.allowClick) {
                if (s.params.preventClicks) e.preventDefault();
                if (s.params.preventClicksPropagation && s.animating) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            }
        };
        // Clicks
        s.onClickNext = function (e) {
            e.preventDefault();
            if (s.isEnd && !s.params.loop) return;
            s.slideNext();
        };
        s.onClickPrev = function (e) {
            e.preventDefault();
            if (s.isBeginning && !s.params.loop) return;
            s.slidePrev();
        };
        s.onClickIndex = function (e) {
            e.preventDefault();
            var index = $(this).index() * s.params.slidesPerGroup;
            if (s.params.loop) index = index + s.loopedSlides;
            s.slideTo(index);
        };
        
        /*=========================
          Handle Touches
          ===========================*/
        function findElementInEvent(e, selector) {
            var el = $(e.target);
            if (!el.is(selector)) {
                if (typeof selector === 'string') {
                    el = el.parents(selector);
                }
                else if (selector.nodeType) {
                    var found;
                    el.parents().each(function (index, _el) {
                        if (_el === selector) found = selector;
                    });
                    if (!found) return undefined;
                    else return selector;
                }
            }
            if (el.length === 0) {
                return undefined;
            }
            return el[0];
        }
        s.updateClickedSlide = function (e) {
            var slide = findElementInEvent(e, '.' + s.params.slideClass);
            var slideFound = false;
            if (slide) {
                for (var i = 0; i < s.slides.length; i++) {
                    if (s.slides[i] === slide) slideFound = true;
                }
            }
        
            if (slide && slideFound) {
                s.clickedSlide = slide;
                s.clickedIndex = $(slide).index();
            }
            else {
                s.clickedSlide = undefined;
                s.clickedIndex = undefined;
                return;
            }
            if (s.params.slideToClickedSlide && s.clickedIndex !== undefined && s.clickedIndex !== s.activeIndex) {
                var slideToIndex = s.clickedIndex,
                    realIndex,
                    duplicatedSlides;
                if (s.params.loop) {
                    if (s.animating) return;
                    realIndex = $(s.clickedSlide).attr('data-swiper-slide-index');
                    if (s.params.centeredSlides) {
                        if ((slideToIndex < s.loopedSlides - s.params.slidesPerView/2) || (slideToIndex > s.slides.length - s.loopedSlides + s.params.slidesPerView/2)) {
                            s.fixLoop();
                            slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.swiper-slide-duplicate)').eq(0).index();
                            setTimeout(function () {
                                s.slideTo(slideToIndex);
                            }, 0);
                        }
                        else {
                            s.slideTo(slideToIndex);
                        }
                    }
                    else {
                        if (slideToIndex > s.slides.length - s.params.slidesPerView) {
                            s.fixLoop();
                            slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.swiper-slide-duplicate)').eq(0).index();
                            setTimeout(function () {
                                s.slideTo(slideToIndex);
                            }, 0);
                        }
                        else {
                            s.slideTo(slideToIndex);
                        }
                    }
                }
                else {
                    s.slideTo(slideToIndex);
                }
            }
        };
        
        var isTouched,
            isMoved,
            allowTouchCallbacks,
            touchStartTime,
            isScrolling,
            currentTranslate,
            startTranslate,
            allowThresholdMove,
            // Form elements to match
            formElements = 'input, select, textarea, button',
            // Last click time
            lastClickTime = Date.now(), clickTimeout,
            //Velocities
            velocities = [],
            allowMomentumBounce;
        
        // Animating Flag
        s.animating = false;
        
        // Touches information
        s.touches = {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            diff: 0
        };
        
        // Touch handlers
        var isTouchEvent, startMoving;
        s.onTouchStart = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            isTouchEvent = e.type === 'touchstart';
            if (!isTouchEvent && 'which' in e && e.which === 3) return;
            if (s.params.noSwiping && findElementInEvent(e, '.' + s.params.noSwipingClass)) {
                s.allowClick = true;
                return;
            }
            if (s.params.swipeHandler) {
                if (!findElementInEvent(e, s.params.swipeHandler)) return;
            }
        
            var startX = s.touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            var startY = s.touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
        
            // Do NOT start if iOS edge swipe is detected. Otherwise iOS app (UIWebView) cannot swipe-to-go-back anymore
            if(s.device.ios && s.params.iOSEdgeSwipeDetection && startX <= s.params.iOSEdgeSwipeThreshold) {
                return;
            }
        
            isTouched = true;
            isMoved = false;
            allowTouchCallbacks = true;
            isScrolling = undefined;
            startMoving = undefined;
            s.touches.startX = startX;
            s.touches.startY = startY;
            touchStartTime = Date.now();
            s.allowClick = true;
            s.updateContainerSize();
            s.swipeDirection = undefined;
            if (s.params.threshold > 0) allowThresholdMove = false;
            if (e.type !== 'touchstart') {
                var preventDefault = true;
                if ($(e.target).is(formElements)) preventDefault = false;
                if (document.activeElement && $(document.activeElement).is(formElements)) {
                    document.activeElement.blur();
                }
                if (preventDefault) {
                    e.preventDefault();
                }
            }
            s.emit('onTouchStart', s, e);
        };
        
        s.onTouchMove = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            if (isTouchEvent && e.type === 'mousemove') return;
            if (e.preventedByNestedSwiper) return;
            if (s.params.onlyExternal) {
                // isMoved = true;
                s.allowClick = false;
                if (isTouched) {
                    s.touches.startX = s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                    s.touches.startY = s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                    touchStartTime = Date.now();
                }
                return;
            }
            if (isTouchEvent && document.activeElement) {
                if (e.target === document.activeElement && $(e.target).is(formElements)) {
                    isMoved = true;
                    s.allowClick = false;
                    return;
                }
            }
            if (allowTouchCallbacks) {
                s.emit('onTouchMove', s, e);
            }
            if (e.targetTouches && e.targetTouches.length > 1) return;
        
            s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
        
            if (typeof isScrolling === 'undefined') {
                var touchAngle = Math.atan2(Math.abs(s.touches.currentY - s.touches.startY), Math.abs(s.touches.currentX - s.touches.startX)) * 180 / Math.PI;
                isScrolling = s.isHorizontal() ? touchAngle > s.params.touchAngle : (90 - touchAngle > s.params.touchAngle);
            }
            if (isScrolling) {
                s.emit('onTouchMoveOpposite', s, e);
            }
            if (typeof startMoving === 'undefined' && s.browser.ieTouch) {
                if (s.touches.currentX !== s.touches.startX || s.touches.currentY !== s.touches.startY) {
                    startMoving = true;
                }
            }
            if (!isTouched) return;
            if (isScrolling)  {
                isTouched = false;
                return;
            }
            if (!startMoving && s.browser.ieTouch) {
                return;
            }
            s.allowClick = false;
            s.emit('onSliderMove', s, e);
            e.preventDefault();
            if (s.params.touchMoveStopPropagation && !s.params.nested) {
                e.stopPropagation();
            }
        
            if (!isMoved) {
                if (params.loop) {
                    s.fixLoop();
                }
                startTranslate = s.getWrapperTranslate();
                s.setWrapperTransition(0);
                if (s.animating) {
                    s.wrapper.trigger('webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd');
                }
                if (s.params.autoplay && s.autoplaying) {
                    if (s.params.autoplayDisableOnInteraction) {
                        s.stopAutoplay();
                    }
                    else {
                        s.pauseAutoplay();
                    }
                }
                allowMomentumBounce = false;
                //Grab Cursor
                if (s.params.grabCursor) {
                    s.container[0].style.cursor = 'move';
                    s.container[0].style.cursor = '-webkit-grabbing';
                    s.container[0].style.cursor = '-moz-grabbin';
                    s.container[0].style.cursor = 'grabbing';
                }
            }
            isMoved = true;
        
            var diff = s.touches.diff = s.isHorizontal() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
        
            diff = diff * s.params.touchRatio;
            if (s.rtl) diff = -diff;
        
            s.swipeDirection = diff > 0 ? 'prev' : 'next';
            currentTranslate = diff + startTranslate;
        
            var disableParentSwiper = true;
            if ((diff > 0 && currentTranslate > s.minTranslate())) {
                disableParentSwiper = false;
                if (s.params.resistance) currentTranslate = s.minTranslate() - 1 + Math.pow(-s.minTranslate() + startTranslate + diff, s.params.resistanceRatio);
            }
            else if (diff < 0 && currentTranslate < s.maxTranslate()) {
                disableParentSwiper = false;
                if (s.params.resistance) currentTranslate = s.maxTranslate() + 1 - Math.pow(s.maxTranslate() - startTranslate - diff, s.params.resistanceRatio);
            }
        
            if (disableParentSwiper) {
                e.preventedByNestedSwiper = true;
            }
        
            // Directions locks
            if (!s.params.allowSwipeToNext && s.swipeDirection === 'next' && currentTranslate < startTranslate) {
                currentTranslate = startTranslate;
            }
            if (!s.params.allowSwipeToPrev && s.swipeDirection === 'prev' && currentTranslate > startTranslate) {
                currentTranslate = startTranslate;
            }
        
            if (!s.params.followFinger) return;
        
            // Threshold
            if (s.params.threshold > 0) {
                if (Math.abs(diff) > s.params.threshold || allowThresholdMove) {
                    if (!allowThresholdMove) {
                        allowThresholdMove = true;
                        s.touches.startX = s.touches.currentX;
                        s.touches.startY = s.touches.currentY;
                        currentTranslate = startTranslate;
                        s.touches.diff = s.isHorizontal() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
                        return;
                    }
                }
                else {
                    currentTranslate = startTranslate;
                    return;
                }
            }
            // Update active index in free mode
            if (s.params.freeMode || s.params.watchSlidesProgress) {
                s.updateActiveIndex();
            }
            if (s.params.freeMode) {
                //Velocity
                if (velocities.length === 0) {
                    velocities.push({
                        position: s.touches[s.isHorizontal() ? 'startX' : 'startY'],
                        time: touchStartTime
                    });
                }
                velocities.push({
                    position: s.touches[s.isHorizontal() ? 'currentX' : 'currentY'],
                    time: (new window.Date()).getTime()
                });
            }
            // Update progress
            s.updateProgress(currentTranslate);
            // Update translate
            s.setWrapperTranslate(currentTranslate);
        };
        s.onTouchEnd = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            if (allowTouchCallbacks) {
                s.emit('onTouchEnd', s, e);
            }
            allowTouchCallbacks = false;
            if (!isTouched) return;
            //Return Grab Cursor
            if (s.params.grabCursor && isMoved && isTouched) {
                s.container[0].style.cursor = 'move';
                s.container[0].style.cursor = '-webkit-grab';
                s.container[0].style.cursor = '-moz-grab';
                s.container[0].style.cursor = 'grab';
            }
        
            // Time diff
            var touchEndTime = Date.now();
            var timeDiff = touchEndTime - touchStartTime;
        
            // Tap, doubleTap, Click
            if (s.allowClick) {
                s.updateClickedSlide(e);
                s.emit('onTap', s, e);
                if (timeDiff < 300 && (touchEndTime - lastClickTime) > 300) {
                    if (clickTimeout) clearTimeout(clickTimeout);
                    clickTimeout = setTimeout(function () {
                        if (!s) return;
                        if (s.params.paginationHide && s.paginationContainer.length > 0 && !$(e.target).hasClass(s.params.bulletClass)) {
                            s.paginationContainer.toggleClass(s.params.paginationHiddenClass);
                        }
                        s.emit('onClick', s, e);
                    }, 300);
        
                }
                if (timeDiff < 300 && (touchEndTime - lastClickTime) < 300) {
                    if (clickTimeout) clearTimeout(clickTimeout);
                    s.emit('onDoubleTap', s, e);
                }
            }
        
            lastClickTime = Date.now();
            setTimeout(function () {
                if (s) s.allowClick = true;
            }, 0);
        
            if (!isTouched || !isMoved || !s.swipeDirection || s.touches.diff === 0 || currentTranslate === startTranslate) {
                isTouched = isMoved = false;
                return;
            }
            isTouched = isMoved = false;
        
            var currentPos;
            if (s.params.followFinger) {
                currentPos = s.rtl ? s.translate : -s.translate;
            }
            else {
                currentPos = -currentTranslate;
            }
            if (s.params.freeMode) {
                if (currentPos < -s.minTranslate()) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                else if (currentPos > -s.maxTranslate()) {
                    if (s.slides.length < s.snapGrid.length) {
                        s.slideTo(s.snapGrid.length - 1);
                    }
                    else {
                        s.slideTo(s.slides.length - 1);
                    }
                    return;
                }
        
                if (s.params.freeModeMomentum) {
                    if (velocities.length > 1) {
                        var lastMoveEvent = velocities.pop(), velocityEvent = velocities.pop();
        
                        var distance = lastMoveEvent.position - velocityEvent.position;
                        var time = lastMoveEvent.time - velocityEvent.time;
                        s.velocity = distance / time;
                        s.velocity = s.velocity / 2;
                        if (Math.abs(s.velocity) < s.params.freeModeMinimumVelocity) {
                            s.velocity = 0;
                        }
                        // this implies that the user stopped moving a finger then released.
                        // There would be no events with distance zero, so the last event is stale.
                        if (time > 150 || (new window.Date().getTime() - lastMoveEvent.time) > 300) {
                            s.velocity = 0;
                        }
                    } else {
                        s.velocity = 0;
                    }
        
                    velocities.length = 0;
                    var momentumDuration = 1000 * s.params.freeModeMomentumRatio;
                    var momentumDistance = s.velocity * momentumDuration;
        
                    var newPosition = s.translate + momentumDistance;
                    if (s.rtl) newPosition = - newPosition;
                    var doBounce = false;
                    var afterBouncePosition;
                    var bounceAmount = Math.abs(s.velocity) * 20 * s.params.freeModeMomentumBounceRatio;
                    if (newPosition < s.maxTranslate()) {
                        if (s.params.freeModeMomentumBounce) {
                            if (newPosition + s.maxTranslate() < -bounceAmount) {
                                newPosition = s.maxTranslate() - bounceAmount;
                            }
                            afterBouncePosition = s.maxTranslate();
                            doBounce = true;
                            allowMomentumBounce = true;
                        }
                        else {
                            newPosition = s.maxTranslate();
                        }
                    }
                    else if (newPosition > s.minTranslate()) {
                        if (s.params.freeModeMomentumBounce) {
                            if (newPosition - s.minTranslate() > bounceAmount) {
                                newPosition = s.minTranslate() + bounceAmount;
                            }
                            afterBouncePosition = s.minTranslate();
                            doBounce = true;
                            allowMomentumBounce = true;
                        }
                        else {
                            newPosition = s.minTranslate();
                        }
                    }
                    else if (s.params.freeModeSticky) {
                        var j = 0,
                            nextSlide;
                        for (j = 0; j < s.snapGrid.length; j += 1) {
                            if (s.snapGrid[j] > -newPosition) {
                                nextSlide = j;
                                break;
                            }
        
                        }
                        if (Math.abs(s.snapGrid[nextSlide] - newPosition) < Math.abs(s.snapGrid[nextSlide - 1] - newPosition) || s.swipeDirection === 'next') {
                            newPosition = s.snapGrid[nextSlide];
                        } else {
                            newPosition = s.snapGrid[nextSlide - 1];
                        }
                        if (!s.rtl) newPosition = - newPosition;
                    }
                    //Fix duration
                    if (s.velocity !== 0) {
                        if (s.rtl) {
                            momentumDuration = Math.abs((-newPosition - s.translate) / s.velocity);
                        }
                        else {
                            momentumDuration = Math.abs((newPosition - s.translate) / s.velocity);
                        }
                    }
                    else if (s.params.freeModeSticky) {
                        s.slideReset();
                        return;
                    }
        
                    if (s.params.freeModeMomentumBounce && doBounce) {
                        s.updateProgress(afterBouncePosition);
                        s.setWrapperTransition(momentumDuration);
                        s.setWrapperTranslate(newPosition);
                        s.onTransitionStart();
                        s.animating = true;
                        s.wrapper.transitionEnd(function () {
                            if (!s || !allowMomentumBounce) return;
                            s.emit('onMomentumBounce', s);
        
                            s.setWrapperTransition(s.params.speed);
                            s.setWrapperTranslate(afterBouncePosition);
                            s.wrapper.transitionEnd(function () {
                                if (!s) return;
                                s.onTransitionEnd();
                            });
                        });
                    } else if (s.velocity) {
                        s.updateProgress(newPosition);
                        s.setWrapperTransition(momentumDuration);
                        s.setWrapperTranslate(newPosition);
                        s.onTransitionStart();
                        if (!s.animating) {
                            s.animating = true;
                            s.wrapper.transitionEnd(function () {
                                if (!s) return;
                                s.onTransitionEnd();
                            });
                        }
        
                    } else {
                        s.updateProgress(newPosition);
                    }
        
                    s.updateActiveIndex();
                }
                if (!s.params.freeModeMomentum || timeDiff >= s.params.longSwipesMs) {
                    s.updateProgress();
                    s.updateActiveIndex();
                }
                return;
            }
        
            // Find current slide
            var i, stopIndex = 0, groupSize = s.slidesSizesGrid[0];
            for (i = 0; i < s.slidesGrid.length; i += s.params.slidesPerGroup) {
                if (typeof s.slidesGrid[i + s.params.slidesPerGroup] !== 'undefined') {
                    if (currentPos >= s.slidesGrid[i] && currentPos < s.slidesGrid[i + s.params.slidesPerGroup]) {
                        stopIndex = i;
                        groupSize = s.slidesGrid[i + s.params.slidesPerGroup] - s.slidesGrid[i];
                    }
                }
                else {
                    if (currentPos >= s.slidesGrid[i]) {
                        stopIndex = i;
                        groupSize = s.slidesGrid[s.slidesGrid.length - 1] - s.slidesGrid[s.slidesGrid.length - 2];
                    }
                }
            }
        
            // Find current slide size
            var ratio = (currentPos - s.slidesGrid[stopIndex]) / groupSize;
        
            if (timeDiff > s.params.longSwipesMs) {
                // Long touches
                if (!s.params.longSwipes) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                if (s.swipeDirection === 'next') {
                    if (ratio >= s.params.longSwipesRatio) s.slideTo(stopIndex + s.params.slidesPerGroup);
                    else s.slideTo(stopIndex);
        
                }
                if (s.swipeDirection === 'prev') {
                    if (ratio > (1 - s.params.longSwipesRatio)) s.slideTo(stopIndex + s.params.slidesPerGroup);
                    else s.slideTo(stopIndex);
                }
            }
            else {
                // Short swipes
                if (!s.params.shortSwipes) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                if (s.swipeDirection === 'next') {
                    s.slideTo(stopIndex + s.params.slidesPerGroup);
        
                }
                if (s.swipeDirection === 'prev') {
                    s.slideTo(stopIndex);
                }
            }
        };
        /*=========================
          Transitions
          ===========================*/
        s._slideTo = function (slideIndex, speed) {
            return s.slideTo(slideIndex, speed, true, true);
        };
        s.slideTo = function (slideIndex, speed, runCallbacks, internal) {
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (typeof slideIndex === 'undefined') slideIndex = 0;
            if (slideIndex < 0) slideIndex = 0;
            s.snapIndex = Math.floor(slideIndex / s.params.slidesPerGroup);
            if (s.snapIndex >= s.snapGrid.length) s.snapIndex = s.snapGrid.length - 1;
        
            var translate = - s.snapGrid[s.snapIndex];
            // Stop autoplay
            if (s.params.autoplay && s.autoplaying) {
                if (internal || !s.params.autoplayDisableOnInteraction) {
                    s.pauseAutoplay(speed);
                }
                else {
                    s.stopAutoplay();
                }
            }
            // Update progress
            s.updateProgress(translate);
        
            // Normalize slideIndex
            for (var i = 0; i < s.slidesGrid.length; i++) {
                if (- Math.floor(translate * 100) >= Math.floor(s.slidesGrid[i] * 100)) {
                    slideIndex = i;
                }
            }
        
            // Directions locks
            if (!s.params.allowSwipeToNext && translate < s.translate && translate < s.minTranslate()) {
                return false;
            }
            if (!s.params.allowSwipeToPrev && translate > s.translate && translate > s.maxTranslate()) {
                if ((s.activeIndex || 0) !== slideIndex ) return false;
            }
        
            // Update Index
            if (typeof speed === 'undefined') speed = s.params.speed;
            s.previousIndex = s.activeIndex || 0;
            s.activeIndex = slideIndex;
        
            if ((s.rtl && -translate === s.translate) || (!s.rtl && translate === s.translate)) {
                // Update Height
                if (s.params.autoHeight) {
                    s.updateAutoHeight();
                }
                s.updateClasses();
                if (s.params.effect !== 'slide') {
                    s.setWrapperTranslate(translate);
                }
                return false;
            }
            s.updateClasses();
            s.onTransitionStart(runCallbacks);
        
            if (speed === 0) {
                s.setWrapperTranslate(translate);
                s.setWrapperTransition(0);
                s.onTransitionEnd(runCallbacks);
            }
            else {
                s.setWrapperTranslate(translate);
                s.setWrapperTransition(speed);
                if (!s.animating) {
                    s.animating = true;
                    s.wrapper.transitionEnd(function () {
                        if (!s) return;
                        s.onTransitionEnd(runCallbacks);
                    });
                }
        
            }
        
            return true;
        };
        
        s.onTransitionStart = function (runCallbacks) {
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (s.params.autoHeight) {
                s.updateAutoHeight();
            }
            if (s.lazy) s.lazy.onTransitionStart();
            if (runCallbacks) {
                s.emit('onTransitionStart', s);
                if (s.activeIndex !== s.previousIndex) {
                    s.emit('onSlideChangeStart', s);
                    if (s.activeIndex > s.previousIndex) {
                        s.emit('onSlideNextStart', s);
                    }
                    else {
                        s.emit('onSlidePrevStart', s);
                    }
                }
        
            }
        };
        s.onTransitionEnd = function (runCallbacks) {
            s.animating = false;
            s.setWrapperTransition(0);
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (s.lazy) s.lazy.onTransitionEnd();
            if (runCallbacks) {
                s.emit('onTransitionEnd', s);
                if (s.activeIndex !== s.previousIndex) {
                    s.emit('onSlideChangeEnd', s);
                    if (s.activeIndex > s.previousIndex) {
                        s.emit('onSlideNextEnd', s);
                    }
                    else {
                        s.emit('onSlidePrevEnd', s);
                    }
                }
            }
            if (s.params.hashnav && s.hashnav) {
                s.hashnav.setHash();
            }
        
        };
        s.slideNext = function (runCallbacks, speed, internal) {
            if (s.params.loop) {
                if (s.animating) return false;
                s.fixLoop();
                var clientLeft = s.container[0].clientLeft;
                return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
            }
            else return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
        };
        s._slideNext = function (speed) {
            return s.slideNext(true, speed, true);
        };
        s.slidePrev = function (runCallbacks, speed, internal) {
            if (s.params.loop) {
                if (s.animating) return false;
                s.fixLoop();
                var clientLeft = s.container[0].clientLeft;
                return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
            }
            else return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
        };
        s._slidePrev = function (speed) {
            return s.slidePrev(true, speed, true);
        };
        s.slideReset = function (runCallbacks, speed, internal) {
            return s.slideTo(s.activeIndex, speed, runCallbacks);
        };
        
        /*=========================
          Translate/transition helpers
          ===========================*/
        s.setWrapperTransition = function (duration, byController) {
            s.wrapper.transition(duration);
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                s.effects[s.params.effect].setTransition(duration);
            }
            if (s.params.parallax && s.parallax) {
                s.parallax.setTransition(duration);
            }
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.setTransition(duration);
            }
            if (s.params.control && s.controller) {
                s.controller.setTransition(duration, byController);
            }
            s.emit('onSetTransition', s, duration);
        };
        s.setWrapperTranslate = function (translate, updateActiveIndex, byController) {
            var x = 0, y = 0, z = 0;
            if (s.isHorizontal()) {
                x = s.rtl ? -translate : translate;
            }
            else {
                y = translate;
            }
        
            if (s.params.roundLengths) {
                x = round(x);
                y = round(y);
            }
        
            if (!s.params.virtualTranslate) {
                if (s.support.transforms3d) s.wrapper.transform('translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
                else s.wrapper.transform('translate(' + x + 'px, ' + y + 'px)');
            }
        
            s.translate = s.isHorizontal() ? x : y;
        
            // Check if we need to update progress
            var progress;
            var translatesDiff = s.maxTranslate() - s.minTranslate();
            if (translatesDiff === 0) {
                progress = 0;
            }
            else {
                progress = (translate - s.minTranslate()) / (translatesDiff);
            }
            if (progress !== s.progress) {
                s.updateProgress(translate);
            }
        
            if (updateActiveIndex) s.updateActiveIndex();
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                s.effects[s.params.effect].setTranslate(s.translate);
            }
            if (s.params.parallax && s.parallax) {
                s.parallax.setTranslate(s.translate);
            }
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.setTranslate(s.translate);
            }
            if (s.params.control && s.controller) {
                s.controller.setTranslate(s.translate, byController);
            }
            s.emit('onSetTranslate', s, s.translate);
        };
        
        s.getTranslate = function (el, axis) {
            var matrix, curTransform, curStyle, transformMatrix;
        
            // automatic axis detection
            if (typeof axis === 'undefined') {
                axis = 'x';
            }
        
            if (s.params.virtualTranslate) {
                return s.rtl ? -s.translate : s.translate;
            }
        
            curStyle = window.getComputedStyle(el, null);
            if (window.WebKitCSSMatrix) {
                curTransform = curStyle.transform || curStyle.webkitTransform;
                if (curTransform.split(',').length > 6) {
                    curTransform = curTransform.split(', ').map(function(a){
                        return a.replace(',','.');
                    }).join(', ');
                }
                // Some old versions of Webkit choke when 'none' is passed; pass
                // empty string instead in this case
                transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
            }
            else {
                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
                matrix = transformMatrix.toString().split(',');
            }
        
            if (axis === 'x') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m41;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[12]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[4]);
            }
            if (axis === 'y') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m42;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[13]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[5]);
            }
            if (s.rtl && curTransform) curTransform = -curTransform;
            return curTransform || 0;
        };
        s.getWrapperTranslate = function (axis) {
            if (typeof axis === 'undefined') {
                axis = s.isHorizontal() ? 'x' : 'y';
            }
            return s.getTranslate(s.wrapper[0], axis);
        };
        
        /*=========================
          Observer
          ===========================*/
        s.observers = [];
        function initObserver(target, options) {
            options = options || {};
            // create an observer instance
            var ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            var observer = new ObserverFunc(function (mutations) {
                mutations.forEach(function (mutation) {
                    s.onResize(true);
                    s.emit('onObserverUpdate', s, mutation);
                });
            });
        
            observer.observe(target, {
                attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
                childList: typeof options.childList === 'undefined' ? true : options.childList,
                characterData: typeof options.characterData === 'undefined' ? true : options.characterData
            });
        
            s.observers.push(observer);
        }
        s.initObservers = function () {
            if (s.params.observeParents) {
                var containerParents = s.container.parents();
                for (var i = 0; i < containerParents.length; i++) {
                    initObserver(containerParents[i]);
                }
            }
        
            // Observe container
            initObserver(s.container[0], {childList: false});
        
            // Observe wrapper
            initObserver(s.wrapper[0], {attributes: false});
        };
        s.disconnectObservers = function () {
            for (var i = 0; i < s.observers.length; i++) {
                s.observers[i].disconnect();
            }
            s.observers = [];
        };
        /*=========================
          Loop
          ===========================*/
        // Create looped slides
        s.createLoop = function () {
            // Remove duplicated slides
            s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();
        
            var slides = s.wrapper.children('.' + s.params.slideClass);
        
            if(s.params.slidesPerView === 'auto' && !s.params.loopedSlides) s.params.loopedSlides = slides.length;
        
            s.loopedSlides = parseInt(s.params.loopedSlides || s.params.slidesPerView, 10);
            s.loopedSlides = s.loopedSlides + s.params.loopAdditionalSlides;
            if (s.loopedSlides > slides.length) {
                s.loopedSlides = slides.length;
            }
        
            var prependSlides = [], appendSlides = [], i;
            slides.each(function (index, el) {
                var slide = $(this);
                if (index < s.loopedSlides) appendSlides.push(el);
                if (index < slides.length && index >= slides.length - s.loopedSlides) prependSlides.push(el);
                slide.attr('data-swiper-slide-index', index);
            });
            for (i = 0; i < appendSlides.length; i++) {
                s.wrapper.append($(appendSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
            }
            for (i = prependSlides.length - 1; i >= 0; i--) {
                s.wrapper.prepend($(prependSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
            }
        };
        s.destroyLoop = function () {
            s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();
            s.slides.removeAttr('data-swiper-slide-index');
        };
        s.fixLoop = function () {
            var newIndex;
            //Fix For Negative Oversliding
            if (s.activeIndex < s.loopedSlides) {
                newIndex = s.slides.length - s.loopedSlides * 3 + s.activeIndex;
                newIndex = newIndex + s.loopedSlides;
                s.slideTo(newIndex, 0, false, true);
            }
            //Fix For Positive Oversliding
            else if ((s.params.slidesPerView === 'auto' && s.activeIndex >= s.loopedSlides * 2) || (s.activeIndex > s.slides.length - s.params.slidesPerView * 2)) {
                newIndex = -s.slides.length + s.activeIndex + s.loopedSlides;
                newIndex = newIndex + s.loopedSlides;
                s.slideTo(newIndex, 0, false, true);
            }
        };
        /*=========================
          Append/Prepend/Remove Slides
          ===========================*/
        s.appendSlide = function (slides) {
            if (s.params.loop) {
                s.destroyLoop();
            }
            if (typeof slides === 'object' && slides.length) {
                for (var i = 0; i < slides.length; i++) {
                    if (slides[i]) s.wrapper.append(slides[i]);
                }
            }
            else {
                s.wrapper.append(slides);
            }
            if (s.params.loop) {
                s.createLoop();
            }
            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
        };
        s.prependSlide = function (slides) {
            if (s.params.loop) {
                s.destroyLoop();
            }
            var newActiveIndex = s.activeIndex + 1;
            if (typeof slides === 'object' && slides.length) {
                for (var i = 0; i < slides.length; i++) {
                    if (slides[i]) s.wrapper.prepend(slides[i]);
                }
                newActiveIndex = s.activeIndex + slides.length;
            }
            else {
                s.wrapper.prepend(slides);
            }
            if (s.params.loop) {
                s.createLoop();
            }
            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
            s.slideTo(newActiveIndex, 0, false);
        };
        s.removeSlide = function (slidesIndexes) {
            if (s.params.loop) {
                s.destroyLoop();
                s.slides = s.wrapper.children('.' + s.params.slideClass);
            }
            var newActiveIndex = s.activeIndex,
                indexToRemove;
            if (typeof slidesIndexes === 'object' && slidesIndexes.length) {
                for (var i = 0; i < slidesIndexes.length; i++) {
                    indexToRemove = slidesIndexes[i];
                    if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
                    if (indexToRemove < newActiveIndex) newActiveIndex--;
                }
                newActiveIndex = Math.max(newActiveIndex, 0);
            }
            else {
                indexToRemove = slidesIndexes;
                if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
                if (indexToRemove < newActiveIndex) newActiveIndex--;
                newActiveIndex = Math.max(newActiveIndex, 0);
            }
        
            if (s.params.loop) {
                s.createLoop();
            }
        
            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
            if (s.params.loop) {
                s.slideTo(newActiveIndex + s.loopedSlides, 0, false);
            }
            else {
                s.slideTo(newActiveIndex, 0, false);
            }
        
        };
        s.removeAllSlides = function () {
            var slidesIndexes = [];
            for (var i = 0; i < s.slides.length; i++) {
                slidesIndexes.push(i);
            }
            s.removeSlide(slidesIndexes);
        };
        

        /*=========================
          Effects
          ===========================*/
        s.effects = {
            fade: {
                setTranslate: function () {
                    for (var i = 0; i < s.slides.length; i++) {
                        var slide = s.slides.eq(i);
                        var offset = slide[0].swiperSlideOffset;
                        var tx = -offset;
                        if (!s.params.virtualTranslate) tx = tx - s.translate;
                        var ty = 0;
                        if (!s.isHorizontal()) {
                            ty = tx;
                            tx = 0;
                        }
                        var slideOpacity = s.params.fade.crossFade ?
                                Math.max(1 - Math.abs(slide[0].progress), 0) :
                                1 + Math.min(Math.max(slide[0].progress, -1), 0);
                        slide
                            .css({
                                opacity: slideOpacity
                            })
                            .transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px)');
        
                    }
        
                },
                setTransition: function (duration) {
                    s.slides.transition(duration);
                    if (s.params.virtualTranslate && duration !== 0) {
                        var eventTriggered = false;
                        s.slides.transitionEnd(function () {
                            if (eventTriggered) return;
                            if (!s) return;
                            eventTriggered = true;
                            s.animating = false;
                            var triggerEvents = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
                            for (var i = 0; i < triggerEvents.length; i++) {
                                s.wrapper.trigger(triggerEvents[i]);
                            }
                        });
                    }
                }
            },
            flip: {
                setTranslate: function () {
                    for (var i = 0; i < s.slides.length; i++) {
                        var slide = s.slides.eq(i);
                        var progress = slide[0].progress;
                        if (s.params.flip.limitRotation) {
                            progress = Math.max(Math.min(slide[0].progress, 1), -1);
                        }
                        var offset = slide[0].swiperSlideOffset;
                        var rotate = -180 * progress,
                            rotateY = rotate,
                            rotateX = 0,
                            tx = -offset,
                            ty = 0;
                        if (!s.isHorizontal()) {
                            ty = tx;
                            tx = 0;
                            rotateX = -rotateY;
                            rotateY = 0;
                        }
                        else if (s.rtl) {
                            rotateY = -rotateY;
                        }
        
                        slide[0].style.zIndex = -Math.abs(Math.round(progress)) + s.slides.length;
        
                        if (s.params.flip.slideShadows) {
                            //Set shadows
                            var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                            var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                            if (shadowBefore.length === 0) {
                                shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
                                slide.append(shadowBefore);
                            }
                            if (shadowAfter.length === 0) {
                                shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
                                slide.append(shadowAfter);
                            }
                            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
                            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
                        }
        
                        slide
                            .transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
                    }
                },
                setTransition: function (duration) {
                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                    if (s.params.virtualTranslate && duration !== 0) {
                        var eventTriggered = false;
                        s.slides.eq(s.activeIndex).transitionEnd(function () {
                            if (eventTriggered) return;
                            if (!s) return;
                            if (!$(this).hasClass(s.params.slideActiveClass)) return;
                            eventTriggered = true;
                            s.animating = false;
                            var triggerEvents = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
                            for (var i = 0; i < triggerEvents.length; i++) {
                                s.wrapper.trigger(triggerEvents[i]);
                            }
                        });
                    }
                }
            },
            cube: {
                setTranslate: function () {
                    var wrapperRotate = 0, cubeShadow;
                    if (s.params.cube.shadow) {
                        if (s.isHorizontal()) {
                            cubeShadow = s.wrapper.find('.swiper-cube-shadow');
                            if (cubeShadow.length === 0) {
                                cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                                s.wrapper.append(cubeShadow);
                            }
                            cubeShadow.css({height: s.width + 'px'});
                        }
                        else {
                            cubeShadow = s.container.find('.swiper-cube-shadow');
                            if (cubeShadow.length === 0) {
                                cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                                s.container.append(cubeShadow);
                            }
                        }
                    }
                    for (var i = 0; i < s.slides.length; i++) {
                        var slide = s.slides.eq(i);
                        var slideAngle = i * 90;
                        var round = Math.floor(slideAngle / 360);
                        if (s.rtl) {
                            slideAngle = -slideAngle;
                            round = Math.floor(-slideAngle / 360);
                        }
                        var progress = Math.max(Math.min(slide[0].progress, 1), -1);
                        var tx = 0, ty = 0, tz = 0;
                        if (i % 4 === 0) {
                            tx = - round * 4 * s.size;
                            tz = 0;
                        }
                        else if ((i - 1) % 4 === 0) {
                            tx = 0;
                            tz = - round * 4 * s.size;
                        }
                        else if ((i - 2) % 4 === 0) {
                            tx = s.size + round * 4 * s.size;
                            tz = s.size;
                        }
                        else if ((i - 3) % 4 === 0) {
                            tx = - s.size;
                            tz = 3 * s.size + s.size * 4 * round;
                        }
                        if (s.rtl) {
                            tx = -tx;
                        }
        
                        if (!s.isHorizontal()) {
                            ty = tx;
                            tx = 0;
                        }
        
                        var transform = 'rotateX(' + (s.isHorizontal() ? 0 : -slideAngle) + 'deg) rotateY(' + (s.isHorizontal() ? slideAngle : 0) + 'deg) translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px)';
                        if (progress <= 1 && progress > -1) {
                            wrapperRotate = i * 90 + progress * 90;
                            if (s.rtl) wrapperRotate = -i * 90 - progress * 90;
                        }
                        slide.transform(transform);
                        if (s.params.cube.slideShadows) {
                            //Set shadows
                            var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                            var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                            if (shadowBefore.length === 0) {
                                shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
                                slide.append(shadowBefore);
                            }
                            if (shadowAfter.length === 0) {
                                shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
                                slide.append(shadowAfter);
                            }
                            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
                            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
                        }
                    }
                    s.wrapper.css({
                        '-webkit-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        '-moz-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        '-ms-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        'transform-origin': '50% 50% -' + (s.size / 2) + 'px'
                    });
        
                    if (s.params.cube.shadow) {
                        if (s.isHorizontal()) {
                            cubeShadow.transform('translate3d(0px, ' + (s.width / 2 + s.params.cube.shadowOffset) + 'px, ' + (-s.width / 2) + 'px) rotateX(90deg) rotateZ(0deg) scale(' + (s.params.cube.shadowScale) + ')');
                        }
                        else {
                            var shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
                            var multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
                            var scale1 = s.params.cube.shadowScale,
                                scale2 = s.params.cube.shadowScale / multiplier,
                                offset = s.params.cube.shadowOffset;
                            cubeShadow.transform('scale3d(' + scale1 + ', 1, ' + scale2 + ') translate3d(0px, ' + (s.height / 2 + offset) + 'px, ' + (-s.height / 2 / scale2) + 'px) rotateX(-90deg)');
                        }
                    }
                    var zFactor = (s.isSafari || s.isUiWebView) ? (-s.size / 2) : 0;
                    s.wrapper.transform('translate3d(0px,0,' + zFactor + 'px) rotateX(' + (s.isHorizontal() ? 0 : wrapperRotate) + 'deg) rotateY(' + (s.isHorizontal() ? -wrapperRotate : 0) + 'deg)');
                },
                setTransition: function (duration) {
                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                    if (s.params.cube.shadow && !s.isHorizontal()) {
                        s.container.find('.swiper-cube-shadow').transition(duration);
                    }
                }
            },
            coverflow: {
                setTranslate: function () {
                    var transform = s.translate;
                    var center = s.isHorizontal() ? -transform + s.width / 2 : -transform + s.height / 2;
                    var rotate = s.isHorizontal() ? s.params.coverflow.rotate: -s.params.coverflow.rotate;
                    var translate = s.params.coverflow.depth;
                    //Each slide offset from center
                    for (var i = 0, length = s.slides.length; i < length; i++) {
                        var slide = s.slides.eq(i);
                        var slideSize = s.slidesSizesGrid[i];
                        var slideOffset = slide[0].swiperSlideOffset;
                        var offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * s.params.coverflow.modifier;
        
                        var rotateY = s.isHorizontal() ? rotate * offsetMultiplier : 0;
                        var rotateX = s.isHorizontal() ? 0 : rotate * offsetMultiplier;
                        // var rotateZ = 0
                        var translateZ = -translate * Math.abs(offsetMultiplier);
        
                        var translateY = s.isHorizontal() ? 0 : s.params.coverflow.stretch * (offsetMultiplier);
                        var translateX = s.isHorizontal() ? s.params.coverflow.stretch * (offsetMultiplier) : 0;
        
                        //Fix for ultra small values
                        if (Math.abs(translateX) < 0.001) translateX = 0;
                        if (Math.abs(translateY) < 0.001) translateY = 0;
                        if (Math.abs(translateZ) < 0.001) translateZ = 0;
                        if (Math.abs(rotateY) < 0.001) rotateY = 0;
                        if (Math.abs(rotateX) < 0.001) rotateX = 0;
        
                        var slideTransform = 'translate3d(' + translateX + 'px,' + translateY + 'px,' + translateZ + 'px)  rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        
                        slide.transform(slideTransform);
                        slide[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
                        if (s.params.coverflow.slideShadows) {
                            //Set shadows
                            var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                            var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                            if (shadowBefore.length === 0) {
                                shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
                                slide.append(shadowBefore);
                            }
                            if (shadowAfter.length === 0) {
                                shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
                                slide.append(shadowAfter);
                            }
                            if (shadowBefore.length) shadowBefore[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
                            if (shadowAfter.length) shadowAfter[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
                        }
                    }
        
                    //Set correct perspective for IE10
                    if (s.browser.ie) {
                        var ws = s.wrapper[0].style;
                        ws.perspectiveOrigin = center + 'px 50%';
                    }
                },
                setTransition: function (duration) {
                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                }
            }
        };

        /*=========================
          Images Lazy Loading
          ===========================*/
        s.lazy = {
            initialImageLoaded: false,
            loadImageInSlide: function (index, loadInDuplicate) {
                if (typeof index === 'undefined') return;
                if (typeof loadInDuplicate === 'undefined') loadInDuplicate = true;
                if (s.slides.length === 0) return;
        
                var slide = s.slides.eq(index);
                var img = slide.find('.swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)');
                if (slide.hasClass('swiper-lazy') && !slide.hasClass('swiper-lazy-loaded') && !slide.hasClass('swiper-lazy-loading')) {
                    img = img.add(slide[0]);
                }
                if (img.length === 0) return;
        
                img.each(function () {
                    var _img = $(this);
                    _img.addClass('swiper-lazy-loading');
                    var background = _img.attr('data-background');
                    var src = _img.attr('data-src'),
                        srcset = _img.attr('data-srcset');
                    s.loadImage(_img[0], (src || background), srcset, false, function () {
                        if (background) {
                            _img.css('background-image', 'url(' + background + ')');
                            _img.removeAttr('data-background');
                        }
                        else {
                            if (srcset) {
                                _img.attr('srcset', srcset);
                                _img.removeAttr('data-srcset');
                            }
                            if (src) {
                                _img.attr('src', src);
                                _img.removeAttr('data-src');
                            }
        
                        }
        
                        _img.addClass('swiper-lazy-loaded').removeClass('swiper-lazy-loading');
                        slide.find('.swiper-lazy-preloader, .preloader').remove();
                        if (s.params.loop && loadInDuplicate) {
                            var slideOriginalIndex = slide.attr('data-swiper-slide-index');
                            if (slide.hasClass(s.params.slideDuplicateClass)) {
                                var originalSlide = s.wrapper.children('[data-swiper-slide-index="' + slideOriginalIndex + '"]:not(.' + s.params.slideDuplicateClass + ')');
                                s.lazy.loadImageInSlide(originalSlide.index(), false);
                            }
                            else {
                                var duplicatedSlide = s.wrapper.children('.' + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + slideOriginalIndex + '"]');
                                s.lazy.loadImageInSlide(duplicatedSlide.index(), false);
                            }
                        }
                        s.emit('onLazyImageReady', s, slide[0], _img[0]);
                    });
        
                    s.emit('onLazyImageLoad', s, slide[0], _img[0]);
                });
        
            },
            load: function () {
                var i;
                if (s.params.watchSlidesVisibility) {
                    s.wrapper.children('.' + s.params.slideVisibleClass).each(function () {
                        s.lazy.loadImageInSlide($(this).index());
                    });
                }
                else {
                    if (s.params.slidesPerView > 1) {
                        for (i = s.activeIndex; i < s.activeIndex + s.params.slidesPerView ; i++) {
                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
                        }
                    }
                    else {
                        s.lazy.loadImageInSlide(s.activeIndex);
                    }
                }
                if (s.params.lazyLoadingInPrevNext) {
                    if (s.params.slidesPerView > 1 || (s.params.lazyLoadingInPrevNextAmount && s.params.lazyLoadingInPrevNextAmount > 1)) {
                        var amount = s.params.lazyLoadingInPrevNextAmount;
                        var spv = s.params.slidesPerView;
                        var maxIndex = Math.min(s.activeIndex + spv + Math.max(amount, spv), s.slides.length);
                        var minIndex = Math.max(s.activeIndex - Math.max(spv, amount), 0);
                        // Next Slides
                        for (i = s.activeIndex + s.params.slidesPerView; i < maxIndex; i++) {
                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
                        }
                        // Prev Slides
                        for (i = minIndex; i < s.activeIndex ; i++) {
                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
                        }
                    }
                    else {
                        var nextSlide = s.wrapper.children('.' + s.params.slideNextClass);
                        if (nextSlide.length > 0) s.lazy.loadImageInSlide(nextSlide.index());
        
                        var prevSlide = s.wrapper.children('.' + s.params.slidePrevClass);
                        if (prevSlide.length > 0) s.lazy.loadImageInSlide(prevSlide.index());
                    }
                }
            },
            onTransitionStart: function () {
                if (s.params.lazyLoading) {
                    if (s.params.lazyLoadingOnTransitionStart || (!s.params.lazyLoadingOnTransitionStart && !s.lazy.initialImageLoaded)) {
                        s.lazy.load();
                    }
                }
            },
            onTransitionEnd: function () {
                if (s.params.lazyLoading && !s.params.lazyLoadingOnTransitionStart) {
                    s.lazy.load();
                }
            }
        };
        

        /*=========================
          Scrollbar
          ===========================*/
        s.scrollbar = {
            isTouched: false,
            setDragPosition: function (e) {
                var sb = s.scrollbar;
                var x = 0, y = 0;
                var translate;
                var pointerPosition = s.isHorizontal() ?
                    ((e.type === 'touchstart' || e.type === 'touchmove') ? e.targetTouches[0].pageX : e.pageX || e.clientX) :
                    ((e.type === 'touchstart' || e.type === 'touchmove') ? e.targetTouches[0].pageY : e.pageY || e.clientY) ;
                var position = (pointerPosition) - sb.track.offset()[s.isHorizontal() ? 'left' : 'top'] - sb.dragSize / 2;
                var positionMin = -s.minTranslate() * sb.moveDivider;
                var positionMax = -s.maxTranslate() * sb.moveDivider;
                if (position < positionMin) {
                    position = positionMin;
                }
                else if (position > positionMax) {
                    position = positionMax;
                }
                position = -position / sb.moveDivider;
                s.updateProgress(position);
                s.setWrapperTranslate(position, true);
            },
            dragStart: function (e) {
                var sb = s.scrollbar;
                sb.isTouched = true;
                e.preventDefault();
                e.stopPropagation();
        
                sb.setDragPosition(e);
                clearTimeout(sb.dragTimeout);
        
                sb.track.transition(0);
                if (s.params.scrollbarHide) {
                    sb.track.css('opacity', 1);
                }
                s.wrapper.transition(100);
                sb.drag.transition(100);
                s.emit('onScrollbarDragStart', s);
            },
            dragMove: function (e) {
                var sb = s.scrollbar;
                if (!sb.isTouched) return;
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false;
                sb.setDragPosition(e);
                s.wrapper.transition(0);
                sb.track.transition(0);
                sb.drag.transition(0);
                s.emit('onScrollbarDragMove', s);
            },
            dragEnd: function (e) {
                var sb = s.scrollbar;
                if (!sb.isTouched) return;
                sb.isTouched = false;
                if (s.params.scrollbarHide) {
                    clearTimeout(sb.dragTimeout);
                    sb.dragTimeout = setTimeout(function () {
                        sb.track.css('opacity', 0);
                        sb.track.transition(400);
                    }, 1000);
        
                }
                s.emit('onScrollbarDragEnd', s);
                if (s.params.scrollbarSnapOnRelease) {
                    s.slideReset();
                }
            },
            enableDraggable: function () {
                var sb = s.scrollbar;
                var target = s.support.touch ? sb.track : document;
                $(sb.track).on(s.touchEvents.start, sb.dragStart);
                $(target).on(s.touchEvents.move, sb.dragMove);
                $(target).on(s.touchEvents.end, sb.dragEnd);
            },
            disableDraggable: function () {
                var sb = s.scrollbar;
                var target = s.support.touch ? sb.track : document;
                $(sb.track).off(s.touchEvents.start, sb.dragStart);
                $(target).off(s.touchEvents.move, sb.dragMove);
                $(target).off(s.touchEvents.end, sb.dragEnd);
            },
            set: function () {
                if (!s.params.scrollbar) return;
                var sb = s.scrollbar;
                sb.track = $(s.params.scrollbar);
                sb.drag = sb.track.find('.swiper-scrollbar-drag');
                if (sb.drag.length === 0) {
                    sb.drag = $('<div class="swiper-scrollbar-drag"></div>');
                    sb.track.append(sb.drag);
                }
                sb.drag[0].style.width = '';
                sb.drag[0].style.height = '';
                sb.trackSize = s.isHorizontal() ? sb.track[0].offsetWidth : sb.track[0].offsetHeight;
        
                sb.divider = s.size / s.virtualSize;
                sb.moveDivider = sb.divider * (sb.trackSize / s.size);
                sb.dragSize = sb.trackSize * sb.divider;
        
                if (s.isHorizontal()) {
                    sb.drag[0].style.width = sb.dragSize + 'px';
                }
                else {
                    sb.drag[0].style.height = sb.dragSize + 'px';
                }
        
                if (sb.divider >= 1) {
                    sb.track[0].style.display = 'none';
                }
                else {
                    sb.track[0].style.display = '';
                }
                if (s.params.scrollbarHide) {
                    sb.track[0].style.opacity = 0;
                }
            },
            setTranslate: function () {
                if (!s.params.scrollbar) return;
                var diff;
                var sb = s.scrollbar;
                var translate = s.translate || 0;
                var newPos;
        
                var newSize = sb.dragSize;
                newPos = (sb.trackSize - sb.dragSize) * s.progress;
                if (s.rtl && s.isHorizontal()) {
                    newPos = -newPos;
                    if (newPos > 0) {
                        newSize = sb.dragSize - newPos;
                        newPos = 0;
                    }
                    else if (-newPos + sb.dragSize > sb.trackSize) {
                        newSize = sb.trackSize + newPos;
                    }
                }
                else {
                    if (newPos < 0) {
                        newSize = sb.dragSize + newPos;
                        newPos = 0;
                    }
                    else if (newPos + sb.dragSize > sb.trackSize) {
                        newSize = sb.trackSize - newPos;
                    }
                }
                if (s.isHorizontal()) {
                    if (s.support.transforms3d) {
                        sb.drag.transform('translate3d(' + (newPos) + 'px, 0, 0)');
                    }
                    else {
                        sb.drag.transform('translateX(' + (newPos) + 'px)');
                    }
                    sb.drag[0].style.width = newSize + 'px';
                }
                else {
                    if (s.support.transforms3d) {
                        sb.drag.transform('translate3d(0px, ' + (newPos) + 'px, 0)');
                    }
                    else {
                        sb.drag.transform('translateY(' + (newPos) + 'px)');
                    }
                    sb.drag[0].style.height = newSize + 'px';
                }
                if (s.params.scrollbarHide) {
                    clearTimeout(sb.timeout);
                    sb.track[0].style.opacity = 1;
                    sb.timeout = setTimeout(function () {
                        sb.track[0].style.opacity = 0;
                        sb.track.transition(400);
                    }, 1000);
                }
            },
            setTransition: function (duration) {
                if (!s.params.scrollbar) return;
                s.scrollbar.drag.transition(duration);
            }
        };

        /*=========================
          Controller
          ===========================*/
        s.controller = {
            LinearSpline: function (x, y) {
                this.x = x;
                this.y = y;
                this.lastIndex = x.length - 1;
                // Given an x value (x2), return the expected y2 value:
                // (x1,y1) is the known point before given value,
                // (x3,y3) is the known point after given value.
                var i1, i3;
                var l = this.x.length;
        
                this.interpolate = function (x2) {
                    if (!x2) return 0;
        
                    // Get the indexes of x1 and x3 (the array indexes before and after given x2):
                    i3 = binarySearch(this.x, x2);
                    i1 = i3 - 1;
        
                    // We have our indexes i1 & i3, so we can calculate already:
                    // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1
                    return ((x2 - this.x[i1]) * (this.y[i3] - this.y[i1])) / (this.x[i3] - this.x[i1]) + this.y[i1];
                };
        
                var binarySearch = (function() {
                    var maxIndex, minIndex, guess;
                    return function(array, val) {
                        minIndex = -1;
                        maxIndex = array.length;
                        while (maxIndex - minIndex > 1)
                            if (array[guess = maxIndex + minIndex >> 1] <= val) {
                                minIndex = guess;
                            } else {
                                maxIndex = guess;
                            }
                        return maxIndex;
                    };
                })();
            },
            //xxx: for now i will just save one spline function to to
            getInterpolateFunction: function(c){
                if(!s.controller.spline) s.controller.spline = s.params.loop ?
                    new s.controller.LinearSpline(s.slidesGrid, c.slidesGrid) :
                    new s.controller.LinearSpline(s.snapGrid, c.snapGrid);
            },
            setTranslate: function (translate, byController) {
               var controlled = s.params.control;
               var multiplier, controlledTranslate;
               function setControlledTranslate(c) {
                    // this will create an Interpolate function based on the snapGrids
                    // x is the Grid of the scrolled scroller and y will be the controlled scroller
                    // it makes sense to create this only once and recall it for the interpolation
                    // the function does a lot of value caching for performance
                    translate = c.rtl && c.params.direction === 'horizontal' ? -s.translate : s.translate;
                    if (s.params.controlBy === 'slide') {
                        s.controller.getInterpolateFunction(c);
                        // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
                        // but it did not work out
                        controlledTranslate = -s.controller.spline.interpolate(-translate);
                    }
        
                    if(!controlledTranslate || s.params.controlBy === 'container'){
                        multiplier = (c.maxTranslate() - c.minTranslate()) / (s.maxTranslate() - s.minTranslate());
                        controlledTranslate = (translate - s.minTranslate()) * multiplier + c.minTranslate();
                    }
        
                    if (s.params.controlInverse) {
                        controlledTranslate = c.maxTranslate() - controlledTranslate;
                    }
                    c.updateProgress(controlledTranslate);
                    c.setWrapperTranslate(controlledTranslate, false, s);
                    c.updateActiveIndex();
               }
               if (s.isArray(controlled)) {
                   for (var i = 0; i < controlled.length; i++) {
                       if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                           setControlledTranslate(controlled[i]);
                       }
                   }
               }
               else if (controlled instanceof Swiper && byController !== controlled) {
        
                   setControlledTranslate(controlled);
               }
            },
            setTransition: function (duration, byController) {
                var controlled = s.params.control;
                var i;
                function setControlledTransition(c) {
                    c.setWrapperTransition(duration, s);
                    if (duration !== 0) {
                        c.onTransitionStart();
                        c.wrapper.transitionEnd(function(){
                            if (!controlled) return;
                            if (c.params.loop && s.params.controlBy === 'slide') {
                                c.fixLoop();
                            }
                            c.onTransitionEnd();
        
                        });
                    }
                }
                if (s.isArray(controlled)) {
                    for (i = 0; i < controlled.length; i++) {
                        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                            setControlledTransition(controlled[i]);
                        }
                    }
                }
                else if (controlled instanceof Swiper && byController !== controlled) {
                    setControlledTransition(controlled);
                }
            }
        };

        /*=========================
          Hash Navigation
          ===========================*/
        s.hashnav = {
            init: function () {
                if (!s.params.hashnav) return;
                s.hashnav.initialized = true;
                var hash = document.location.hash.replace('#', '');
                if (!hash) return;
                var speed = 0;
                for (var i = 0, length = s.slides.length; i < length; i++) {
                    var slide = s.slides.eq(i);
                    var slideHash = slide.attr('data-hash');
                    if (slideHash === hash && !slide.hasClass(s.params.slideDuplicateClass)) {
                        var index = slide.index();
                        s.slideTo(index, speed, s.params.runCallbacksOnInit, true);
                    }
                }
            },
            setHash: function () {
                if (!s.hashnav.initialized || !s.params.hashnav) return;
                document.location.hash = s.slides.eq(s.activeIndex).attr('data-hash') || '';
            }
        };

        /*=========================
          Keyboard Control
          ===========================*/
        function handleKeyboard(e) {
            if (e.originalEvent) e = e.originalEvent; //jquery fix
            var kc = e.keyCode || e.charCode;
            // Directions locks
            if (!s.params.allowSwipeToNext && (s.isHorizontal() && kc === 39 || !s.isHorizontal() && kc === 40)) {
                return false;
            }
            if (!s.params.allowSwipeToPrev && (s.isHorizontal() && kc === 37 || !s.isHorizontal() && kc === 38)) {
                return false;
            }
            if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
                return;
            }
            if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
                return;
            }
            if (kc === 37 || kc === 39 || kc === 38 || kc === 40) {
                var inView = false;
                //Check that swiper should be inside of visible area of window
                if (s.container.parents('.swiper-slide').length > 0 && s.container.parents('.swiper-slide-active').length === 0) {
                    return;
                }
                var windowScroll = {
                    left: window.pageXOffset,
                    top: window.pageYOffset
                };
                var windowWidth = window.innerWidth;
                var windowHeight = window.innerHeight;
                var swiperOffset = s.container.offset();
                if (s.rtl) swiperOffset.left = swiperOffset.left - s.container[0].scrollLeft;
                var swiperCoord = [
                    [swiperOffset.left, swiperOffset.top],
                    [swiperOffset.left + s.width, swiperOffset.top],
                    [swiperOffset.left, swiperOffset.top + s.height],
                    [swiperOffset.left + s.width, swiperOffset.top + s.height]
                ];
                for (var i = 0; i < swiperCoord.length; i++) {
                    var point = swiperCoord[i];
                    if (
                        point[0] >= windowScroll.left && point[0] <= windowScroll.left + windowWidth &&
                        point[1] >= windowScroll.top && point[1] <= windowScroll.top + windowHeight
                    ) {
                        inView = true;
                    }
        
                }
                if (!inView) return;
            }
            if (s.isHorizontal()) {
                if (kc === 37 || kc === 39) {
                    if (e.preventDefault) e.preventDefault();
                    else e.returnValue = false;
                }
                if ((kc === 39 && !s.rtl) || (kc === 37 && s.rtl)) s.slideNext();
                if ((kc === 37 && !s.rtl) || (kc === 39 && s.rtl)) s.slidePrev();
            }
            else {
                if (kc === 38 || kc === 40) {
                    if (e.preventDefault) e.preventDefault();
                    else e.returnValue = false;
                }
                if (kc === 40) s.slideNext();
                if (kc === 38) s.slidePrev();
            }
        }
        s.disableKeyboardControl = function () {
            s.params.keyboardControl = false;
            $(document).off('keydown', handleKeyboard);
        };
        s.enableKeyboardControl = function () {
            s.params.keyboardControl = true;
            $(document).on('keydown', handleKeyboard);
        };
        

        /*=========================
          Mousewheel Control
          ===========================*/
        s.mousewheel = {
            event: false,
            lastScrollTime: (new window.Date()).getTime()
        };
        if (s.params.mousewheelControl) {
            try {
                new window.WheelEvent('wheel');
                s.mousewheel.event = 'wheel';
            } catch (e) {}
        
            if (!s.mousewheel.event && document.onmousewheel !== undefined) {
                s.mousewheel.event = 'mousewheel';
            }
            if (!s.mousewheel.event) {
                s.mousewheel.event = 'DOMMouseScroll';
            }
        }
        function handleMousewheel(e) {
            if (e.originalEvent) e = e.originalEvent; //jquery fix
            var we = s.mousewheel.event;
            var delta = 0;
            var rtlFactor = s.rtl ? -1 : 1;
            //Opera & IE
            if (e.detail) delta = -e.detail;
            //WebKits
            else if (we === 'mousewheel') {
                if (s.params.mousewheelForceToAxis) {
                    if (s.isHorizontal()) {
                        if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) delta = e.wheelDeltaX * rtlFactor;
                        else return;
                    }
                    else {
                        if (Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX)) delta = e.wheelDeltaY;
                        else return;
                    }
                }
                else {
                    delta = Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY) ? - e.wheelDeltaX * rtlFactor : - e.wheelDeltaY;
                }
            }
            //Old FireFox
            else if (we === 'DOMMouseScroll') delta = -e.detail;
            //New FireFox
            else if (we === 'wheel') {
                if (s.params.mousewheelForceToAxis) {
                    if (s.isHorizontal()) {
                        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) delta = -e.deltaX * rtlFactor;
                        else return;
                    }
                    else {
                        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) delta = -e.deltaY;
                        else return;
                    }
                }
                else {
                    delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? - e.deltaX * rtlFactor : - e.deltaY;
                }
            }
            if (delta === 0) return;
        
            if (s.params.mousewheelInvert) delta = -delta;
        
            if (!s.params.freeMode) {
                if ((new window.Date()).getTime() - s.mousewheel.lastScrollTime > 60) {
                    if (delta < 0) {
                        if ((!s.isEnd || s.params.loop) && !s.animating) s.slideNext();
                        else if (s.params.mousewheelReleaseOnEdges) return true;
                    }
                    else {
                        if ((!s.isBeginning || s.params.loop) && !s.animating) s.slidePrev();
                        else if (s.params.mousewheelReleaseOnEdges) return true;
                    }
                }
                s.mousewheel.lastScrollTime = (new window.Date()).getTime();
        
            }
            else {
                //Freemode or scrollContainer:
                var position = s.getWrapperTranslate() + delta * s.params.mousewheelSensitivity;
                var wasBeginning = s.isBeginning,
                    wasEnd = s.isEnd;
        
                if (position >= s.minTranslate()) position = s.minTranslate();
                if (position <= s.maxTranslate()) position = s.maxTranslate();
        
                s.setWrapperTransition(0);
                s.setWrapperTranslate(position);
                s.updateProgress();
                s.updateActiveIndex();
        
                if (!wasBeginning && s.isBeginning || !wasEnd && s.isEnd) {
                    s.updateClasses();
                }
        
                if (s.params.freeModeSticky) {
                    clearTimeout(s.mousewheel.timeout);
                    s.mousewheel.timeout = setTimeout(function () {
                        s.slideReset();
                    }, 300);
                }
                else {
                    if (s.params.lazyLoading && s.lazy) {
                        s.lazy.load();
                    }
                }
        
                // Return page scroll on edge positions
                if (position === 0 || position === s.maxTranslate()) return;
            }
            if (s.params.autoplay) s.stopAutoplay();
        
            if (e.preventDefault) e.preventDefault();
            else e.returnValue = false;
            return false;
        }
        s.disableMousewheelControl = function () {
            if (!s.mousewheel.event) return false;
            s.container.off(s.mousewheel.event, handleMousewheel);
            return true;
        };
        
        s.enableMousewheelControl = function () {
            if (!s.mousewheel.event) return false;
            s.container.on(s.mousewheel.event, handleMousewheel);
            return true;
        };
        

        /*=========================
          Parallax
          ===========================*/
        function setParallaxTransform(el, progress) {
            el = $(el);
            var p, pX, pY;
            var rtlFactor = s.rtl ? -1 : 1;
        
            p = el.attr('data-swiper-parallax') || '0';
            pX = el.attr('data-swiper-parallax-x');
            pY = el.attr('data-swiper-parallax-y');
            if (pX || pY) {
                pX = pX || '0';
                pY = pY || '0';
            }
            else {
                if (s.isHorizontal()) {
                    pX = p;
                    pY = '0';
                }
                else {
                    pY = p;
                    pX = '0';
                }
            }
        
            if ((pX).indexOf('%') >= 0) {
                pX = parseInt(pX, 10) * progress * rtlFactor + '%';
            }
            else {
                pX = pX * progress * rtlFactor + 'px' ;
            }
            if ((pY).indexOf('%') >= 0) {
                pY = parseInt(pY, 10) * progress + '%';
            }
            else {
                pY = pY * progress + 'px' ;
            }
        
            el.transform('translate3d(' + pX + ', ' + pY + ',0px)');
        }
        s.parallax = {
            setTranslate: function () {
                s.container.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){
                    setParallaxTransform(this, s.progress);
        
                });
                s.slides.each(function () {
                    var slide = $(this);
                    slide.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function () {
                        var progress = Math.min(Math.max(slide[0].progress, -1), 1);
                        setParallaxTransform(this, progress);
                    });
                });
            },
            setTransition: function (duration) {
                if (typeof duration === 'undefined') duration = s.params.speed;
                s.container.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){
                    var el = $(this);
                    var parallaxDuration = parseInt(el.attr('data-swiper-parallax-duration'), 10) || duration;
                    if (duration === 0) parallaxDuration = 0;
                    el.transition(parallaxDuration);
                });
            }
        };
        

        /*=========================
          Plugins API. Collect all and init all plugins
          ===========================*/
        s._plugins = [];
        for (var plugin in s.plugins) {
            var p = s.plugins[plugin](s, s.params[plugin]);
            if (p) s._plugins.push(p);
        }
        // Method to call all plugins event/method
        s.callPlugins = function (eventName) {
            for (var i = 0; i < s._plugins.length; i++) {
                if (eventName in s._plugins[i]) {
                    s._plugins[i][eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
        };

        /*=========================
          Events/Callbacks/Plugins Emitter
          ===========================*/
        function normalizeEventName (eventName) {
            if (eventName.indexOf('on') !== 0) {
                if (eventName[0] !== eventName[0].toUpperCase()) {
                    eventName = 'on' + eventName[0].toUpperCase() + eventName.substring(1);
                }
                else {
                    eventName = 'on' + eventName;
                }
            }
            return eventName;
        }
        s.emitterEventListeners = {
        
        };
        s.emit = function (eventName) {
            // Trigger callbacks
            if (s.params[eventName]) {
                s.params[eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            }
            var i;
            // Trigger events
            if (s.emitterEventListeners[eventName]) {
                for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
                    s.emitterEventListeners[eventName][i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
            // Trigger plugins
            if (s.callPlugins) s.callPlugins(eventName, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        };
        s.on = function (eventName, handler) {
            eventName = normalizeEventName(eventName);
            if (!s.emitterEventListeners[eventName]) s.emitterEventListeners[eventName] = [];
            s.emitterEventListeners[eventName].push(handler);
            return s;
        };
        s.off = function (eventName, handler) {
            var i;
            eventName = normalizeEventName(eventName);
            if (typeof handler === 'undefined') {
                // Remove all handlers for such event
                s.emitterEventListeners[eventName] = [];
                return s;
            }
            if (!s.emitterEventListeners[eventName] || s.emitterEventListeners[eventName].length === 0) return;
            for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
                if(s.emitterEventListeners[eventName][i] === handler) s.emitterEventListeners[eventName].splice(i, 1);
            }
            return s;
        };
        s.once = function (eventName, handler) {
            eventName = normalizeEventName(eventName);
            var _handler = function () {
                handler(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                s.off(eventName, _handler);
            };
            s.on(eventName, _handler);
            return s;
        };

        // Accessibility tools
        s.a11y = {
            makeFocusable: function ($el) {
                $el.attr('tabIndex', '0');
                return $el;
            },
            addRole: function ($el, role) {
                $el.attr('role', role);
                return $el;
            },
        
            addLabel: function ($el, label) {
                $el.attr('aria-label', label);
                return $el;
            },
        
            disable: function ($el) {
                $el.attr('aria-disabled', true);
                return $el;
            },
        
            enable: function ($el) {
                $el.attr('aria-disabled', false);
                return $el;
            },
        
            onEnterKey: function (event) {
                if (event.keyCode !== 13) return;
                if ($(event.target).is(s.params.nextButton)) {
                    s.onClickNext(event);
                    if (s.isEnd) {
                        s.a11y.notify(s.params.lastSlideMessage);
                    }
                    else {
                        s.a11y.notify(s.params.nextSlideMessage);
                    }
                }
                else if ($(event.target).is(s.params.prevButton)) {
                    s.onClickPrev(event);
                    if (s.isBeginning) {
                        s.a11y.notify(s.params.firstSlideMessage);
                    }
                    else {
                        s.a11y.notify(s.params.prevSlideMessage);
                    }
                }
                if ($(event.target).is('.' + s.params.bulletClass)) {
                    $(event.target)[0].click();
                }
            },
        
            liveRegion: $('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),
        
            notify: function (message) {
                var notification = s.a11y.liveRegion;
                if (notification.length === 0) return;
                notification.html('');
                notification.html(message);
            },
            init: function () {
                // Setup accessibility
                if (s.params.nextButton) {
                    var nextButton = $(s.params.nextButton);
                    s.a11y.makeFocusable(nextButton);
                    s.a11y.addRole(nextButton, 'button');
                    s.a11y.addLabel(nextButton, s.params.nextSlideMessage);
                }
                if (s.params.prevButton) {
                    var prevButton = $(s.params.prevButton);
                    s.a11y.makeFocusable(prevButton);
                    s.a11y.addRole(prevButton, 'button');
                    s.a11y.addLabel(prevButton, s.params.prevSlideMessage);
                }
        
                $(s.container).append(s.a11y.liveRegion);
            },
            initPagination: function () {
                if (s.params.pagination && s.params.paginationClickable && s.bullets && s.bullets.length) {
                    s.bullets.each(function () {
                        var bullet = $(this);
                        s.a11y.makeFocusable(bullet);
                        s.a11y.addRole(bullet, 'button');
                        s.a11y.addLabel(bullet, s.params.paginationBulletMessage.replace(/{{index}}/, bullet.index() + 1));
                    });
                }
            },
            destroy: function () {
                if (s.a11y.liveRegion && s.a11y.liveRegion.length > 0) s.a11y.liveRegion.remove();
            }
        };
        

        /*=========================
          Init/Destroy
          ===========================*/
        s.init = function () {
            if (s.params.loop) s.createLoop();
            s.updateContainerSize();
            s.updateSlidesSize();
            s.updatePagination();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
                if (s.params.scrollbarDraggable) {
                    s.scrollbar.enableDraggable();
                }
            }
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                if (!s.params.loop) s.updateProgress();
                s.effects[s.params.effect].setTranslate();
            }
            if (s.params.loop) {
                s.slideTo(s.params.initialSlide + s.loopedSlides, 0, s.params.runCallbacksOnInit);
            }
            else {
                s.slideTo(s.params.initialSlide, 0, s.params.runCallbacksOnInit);
                if (s.params.initialSlide === 0) {
                    if (s.parallax && s.params.parallax) s.parallax.setTranslate();
                    if (s.lazy && s.params.lazyLoading) {
                        s.lazy.load();
                        s.lazy.initialImageLoaded = true;
                    }
                }
            }
            s.attachEvents();
            if (s.params.observer && s.support.observer) {
                s.initObservers();
            }
            if (s.params.preloadImages && !s.params.lazyLoading) {
                s.preloadImages();
            }
            if (s.params.autoplay) {
                s.startAutoplay();
            }
            if (s.params.keyboardControl) {
                if (s.enableKeyboardControl) s.enableKeyboardControl();
            }
            if (s.params.mousewheelControl) {
                if (s.enableMousewheelControl) s.enableMousewheelControl();
            }
            if (s.params.hashnav) {
                if (s.hashnav) s.hashnav.init();
            }
            if (s.params.a11y && s.a11y) s.a11y.init();
            s.emit('onInit', s);
        };
        
        // Cleanup dynamic styles
        s.cleanupStyles = function () {
            // Container
            s.container.removeClass(s.classNames.join(' ')).removeAttr('style');
        
            // Wrapper
            s.wrapper.removeAttr('style');
        
            // Slides
            if (s.slides && s.slides.length) {
                s.slides
                    .removeClass([
                      s.params.slideVisibleClass,
                      s.params.slideActiveClass,
                      s.params.slideNextClass,
                      s.params.slidePrevClass
                    ].join(' '))
                    .removeAttr('style')
                    .removeAttr('data-swiper-column')
                    .removeAttr('data-swiper-row');
            }
        
            // Pagination/Bullets
            if (s.paginationContainer && s.paginationContainer.length) {
                s.paginationContainer.removeClass(s.params.paginationHiddenClass);
            }
            if (s.bullets && s.bullets.length) {
                s.bullets.removeClass(s.params.bulletActiveClass);
            }
        
            // Buttons
            if (s.params.prevButton) $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
            if (s.params.nextButton) $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);
        
            // Scrollbar
            if (s.params.scrollbar && s.scrollbar) {
                if (s.scrollbar.track && s.scrollbar.track.length) s.scrollbar.track.removeAttr('style');
                if (s.scrollbar.drag && s.scrollbar.drag.length) s.scrollbar.drag.removeAttr('style');
            }
        };
        
        // Destroy
        s.destroy = function (deleteInstance, cleanupStyles) {
            // Detach evebts
            s.detachEvents();
            // Stop autoplay
            s.stopAutoplay();
            // Disable draggable
            if (s.params.scrollbar && s.scrollbar) {
                if (s.params.scrollbarDraggable) {
                    s.scrollbar.disableDraggable();
                }
            }
            // Destroy loop
            if (s.params.loop) {
                s.destroyLoop();
            }
            // Cleanup styles
            if (cleanupStyles) {
                s.cleanupStyles();
            }
            // Disconnect observer
            s.disconnectObservers();
            // Disable keyboard/mousewheel
            if (s.params.keyboardControl) {
                if (s.disableKeyboardControl) s.disableKeyboardControl();
            }
            if (s.params.mousewheelControl) {
                if (s.disableMousewheelControl) s.disableMousewheelControl();
            }
            // Disable a11y
            if (s.params.a11y && s.a11y) s.a11y.destroy();
            // Destroy callback
            s.emit('onDestroy');
            // Delete instance
            if (deleteInstance !== false) s = null;
        };
        
        s.init();
        

    
        // Return swiper instance
        return s;
    };
    

    /*==================================================
        Prototype
    ====================================================*/
    Swiper.prototype = {
        isSafari: (function () {
            var ua = navigator.userAgent.toLowerCase();
            return (ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0);
        })(),
        isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
        isArray: function (arr) {
            return Object.prototype.toString.apply(arr) === '[object Array]';
        },
        /*==================================================
        Browser
        ====================================================*/
        browser: {
            ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
            ieTouch: (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1) || (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1)
        },
        /*==================================================
        Devices
        ====================================================*/
        device: (function () {
            var ua = navigator.userAgent;
            var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
            var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
            var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
            return {
                ios: ipad || iphone || ipod,
                android: android
            };
        })(),
        /*==================================================
        Feature Detection
        ====================================================*/
        support: {
            touch : (window.Modernizr && Modernizr.touch === true) || (function () {
                return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
            })(),
    
            transforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
                var div = document.createElement('div').style;
                return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
            })(),
    
            flexbox: (function () {
                var div = document.createElement('div').style;
                var styles = ('alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient').split(' ');
                for (var i = 0; i < styles.length; i++) {
                    if (styles[i] in div) return true;
                }
            })(),
    
            observer: (function () {
                return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
            })()
        },
        /*==================================================
        Plugins
        ====================================================*/
        plugins: {}
    };
    

    /*===========================
     Get Dom libraries
     ===========================*/
    var swiperDomPlugins = ['jQuery', 'Zepto', 'Dom7'];
    for (var i = 0; i < swiperDomPlugins.length; i++) {
    	if (window[swiperDomPlugins[i]]) {
    		addLibraryPlugin(window[swiperDomPlugins[i]]);
    	}
    }
    // Required DOM Plugins
    var domLib;
    if (typeof Dom7 === 'undefined') {
    	domLib = window.Dom7 || window.Zepto || window.jQuery;
    }
    else {
    	domLib = Dom7;
    }

    /*===========================
    Add .swiper plugin from Dom libraries
    ===========================*/
    function addLibraryPlugin(lib) {
        lib.fn.swiper = function (params) {
            var firstInstance;
            lib(this).each(function () {
                var s = new Swiper(this, params);
                if (!firstInstance) firstInstance = s;
            });
            return firstInstance;
        };
    }
    
    if (domLib) {
        if (!('transitionEnd' in domLib.fn)) {
            domLib.fn.transitionEnd = function (callback) {
                var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
                    i, j, dom = this;
                function fireCallBack(e) {
                    /*jshint validthis:true */
                    if (e.target !== this) return;
                    callback.call(this, e);
                    for (i = 0; i < events.length; i++) {
                        dom.off(events[i], fireCallBack);
                    }
                }
                if (callback) {
                    for (i = 0; i < events.length; i++) {
                        dom.on(events[i], fireCallBack);
                    }
                }
                return this;
            };
        }
        if (!('transform' in domLib.fn)) {
            domLib.fn.transform = function (transform) {
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
                }
                return this;
            };
        }
        if (!('transition' in domLib.fn)) {
            domLib.fn.transition = function (duration) {
                if (typeof duration !== 'string') {
                    duration = duration + 'ms';
                }
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
                }
                return this;
            };
        }
    }

    window.Swiper = Swiper;
})();
/*===========================
Swiper AMD Export
===========================*/
if (typeof(module) !== 'undefined')
{
    module.exports = window.Swiper;
}
else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.Swiper;
    });
}
},{}],10:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function(script){
	var themes = require('../app/themes.js');
	var tools = require('../tools/tools.js');
	var loading = require('../widgets/loading.js');
	var appShare = require('../app/app-share.js');
	var themes = require('../app/themes.js');
	var colors = themes.colors;
	var me = this;
	var cPath = '/';
	var customCss;
	var $window = $(window);
	var $panel;
	var $opt;
	var $toggle;
	var optW;
	var $customCss;
	var $colors;
	var isInitialized = false;
	var ems = 'edit-mode-styles';
	var $gateLoader = $('.gate .loader');
	var isMobile = $('html').hasClass('mobile');
	var sessionJsonSet = function(name, val){
		sessionStorage.setItem(name, JSON.stringify(val));
	}
	var sessionJsonGet = function(name){
		return JSON.parse(sessionStorage.getItem(name));
	}
	var sessionSet = function(name, val){
		sessionStorage.setItem(name, val);
	}
	var sessionGet = function(name){
		return sessionStorage.getItem(name);
	}
	this.lessVars = {};
	this.isShowPanel = (function(){
		if(isMobile){
			return false;
		}else if(skrollexConfig.isInitColorPanel){
			sessionSet('skrollexCustomize', "yes");
			return true;
		}else if($('html').hasClass('select-theme')){
			sessionSet('skrollexCustomize', "yes");
			return false;
		}else{
			return (sessionGet('skrollexCustomize') ? true : false);
		}
	})();
	this.show = function(){
		$panel.css({left: '0px'});
		$panel.addClass('on');
		$panel.transitionEnd(function(){
			for(var i=0; i<themes.colors; i++){
				var uC = String.fromCharCode(65+i);
				var lC = uC.toLowerCase();
				$('.colors-'+lC+', .background-'+lC+', .background-lite-'+lC+', .background-hard-'+lC).not('.no-colors-label').each(function(){
					var $this = $(this);
					var $label = $('<span class="colors-label">Colors '+uC+'</span>');
					var to = $this.offset();
					var th = $this.height();
					var tw = $this.width();
					if((to.left + tw) > 200){
						$label.css('right', '10%');
					}else{
						$label.css('left', '10%');
					}
					if(th<30){
						if(to.top > 10){
							$label.css('top', '-6px');
						}else{
							$label.css('top', '0px');
						}
					}if(th<400){
						$label.css('top', '25%');
					}else{
						$label.css('top', '100px');
					}
					$label.hover(function(){
						$this.addClass('light-colors-block');
					},function(){
						$this.removeClass('light-colors-block');
					}).appendTo($this);
				});
			}
			if(!isInitialized){
				isInitialized = true;
				createCss(true);
				initLessVars();
				var $gate = $opt.find('.options-gate');
				$gate.css({opacity: 0, visibility: 'hidden'});
			}
			$('.colors-label').addClass('show');
		}, 500);
	};
	this.hide = function(){
		$panel.css({left: -1*optW+'px'});
		$panel.removeClass('on');
		$('.colors-label').off('hover').removeClass('show');
		setTimeout(function(){$('.colors-label').remove();}, 1000);
	};
	function resize(){
		$opt.css({
			height: ($window.height() - parseInt($panel.css('top').replace('px','')) - 75) + 'px'
		});
	}
	function setCustomized(){
		sessionSet('skrollexThemeCustomized', 'yes');
	}
	function setNonCustomized(){
		sessionSet('skrollexThemeCustomized', "");
	}
	function isCustomized(){
		var tc = sessionGet('skrollexThemeCustomized');
		return ( tc === 'yes' );
	}
	function initLessVars(){
		for(var i=0; i<colors; i++){
			initGroup(String.fromCharCode(65+i).toLowerCase());
		}
		initLessVar('<span><span class="primary-color"></span></span>', '.primary-color', 'color', 'input.primary-bg', 'primary-bg', toHex);
		initLessVar('<span><span class="out-primary"></span></span>', '.out-primary', 'opacity', 'input.primary-out', 'primary-out', outTranslator, outSetTranslator);
		initLessVar('<span><span class="success-color"></span></span>', '.success-color', 'color', 'input.success-bg', 'success-bg', toHex);
		initLessVar('<span><span class="out-success"></span></span>', '.out-success', 'opacity', 'input.success-out', 'success-out', outTranslator, outSetTranslator);
		initLessVar('<span><span class="info-color"></span></span>', '.info-color', 'color', 'input.info-bg', 'info-bg', toHex);
		initLessVar('<span><span class="out-info"></span></span>', '.out-info', 'opacity', 'input.info-out', 'info-out', outTranslator, outSetTranslator);
		initLessVar('<span><span class="warning-color"></span></span>', '.warning-color', 'color', 'input.warning-bg', 'warning-bg', toHex);
		initLessVar('<span><span class="out-warning"></span></span>', '.out-warning', 'opacity', 'input.warning-out', 'warning-out', outTranslator, outSetTranslator);
		initLessVar('<span><span class="danger-color"></span></span>', '.danger-color', 'color', 'input.danger-bg', 'danger-bg', toHex);
		initLessVar('<span><span class="out-danger"></span></span>', '.out-danger', 'opacity', 'input.danger-out', 'danger-out', outTranslator, outSetTranslator);
	}
	function initGroup(grp){
		initLessVar('<span class="colors-'+grp+'"><span class="bg-color"></span></span>', '.bg-color', 'color', 'input.'+grp+'-bg', grp+'-bg', toHex);
		initLessVar('<span class="colors-'+grp+'"><span class="text"></span></span>', '.text', 'color', 'input.'+grp+'-text', grp+'-text', toHex);
		initLessVar('<span class="colors-'+grp+'"><span class="highlight"></span></span>', '.highlight', 'color', 'input.'+grp+'-highlight', grp+'-highlight', toHex);
		initLessVar('<span class="colors-'+grp+'"><span class="link"></span></span>', '.link', 'color', 'input.'+grp+'-link', grp+'-link', toHex);
		initLessVar('<span class="colors-'+grp+'"><span class="heading"></span></span>', '.heading', 'color', 'input.'+grp+'-heading', grp+'-heading', toHex);
		initLessVar('<span class="colors-'+grp+'"><span class="out"></span></span>', '.out', 'opacity', 'input.'+grp+'-out', grp+'-out', outTranslator, outSetTranslator);
	}
	function outTranslator(v){return Math.round((1-v)*100);}
	function outSetTranslator(v){return Math.round(v);}
	function initLessVar(getterHtml, getterQ, cssProperty, inputQ, lessVar, translator, setTranslator){
		var changeDelay = 300;
		var $g = $('<span class="getter"></span>').appendTo('body');
		$(getterHtml).appendTo($g);
		var getted = $g.find(getterQ).css(cssProperty);
		$g.remove();
		if(getted){
			if(translator) getted = translator(getted);
		}
		me.lessVars[lessVar] = getted;
		var $inp = $opt.find(inputQ);
		$inp.val(getted);
		if(cssProperty === 'color'){
			$inp.data('getted', getted);
			if(!$inp.data('color-pane')){
				$inp.data('color-pane', true);
				$inp.minicolors({
					control: $(this).attr('data-control') || 'hue',
					defaultValue: $(this).attr('data-defaultValue') || '',
					inline: $(this).attr('data-inline') === 'true',
					letterCase: $(this).attr('data-letterCase') || 'lowercase',
					opacity: false,
					position: $(this).attr('data-position') || 'top left',
					changeDelay: changeDelay,
					change: function(hex, opacity) {
						if(hex != $inp.data('getted')){
							$inp.data('getted', hex);
							setCustomized();
							me.lessVars[lessVar] = hex;
							createCss();
						}
					},
					show: function(){
						var $mc = $inp.parent();
						var $mcPanel = $mc.children('.minicolors-panel');
						var mcPanelH = $mcPanel.outerHeight(true);
						var mcPanelW = $mcPanel.outerWidth(true);
						var $window = $(window);
						var wW = $window.width();
						var wH = $window.height();
						var offset = $mcPanel.offset();
						var left = offset.left - $(document).scrollLeft();
						var top = offset.top - $(document).scrollTop();
						if( (left+mcPanelW) > wW ){
							left = wW - mcPanelW - 5;
						}
						if( (top+mcPanelH) > wH ){
							top = wH - mcPanelH - 2;
						}
						if( top < 0 ){
							top = 2;
						}
						$mcPanel.css({
							position: 'fixed',
							left: left+'px',
							top: top+'px'
						});
					},
					hide: function(){
						$inp.parent().children('.minicolors-panel').css({
							position: '',
							left: '',
							top: ''
						});
					},
					theme: 'bootstrap'
				});
			}else{
				$inp.minicolors('value', getted);
			}
		}else{
			var timer;
			$inp.change(function(){
				var $el = $(this);
				var val = $el.val();
				if (timer){
					clearTimeout(timer);
				}
				setCustomized();
				me.lessVars[lessVar] = val;
				createCss();
			});
		}
		function colorFormat(val){
			if(!val.match(/^#[0-9a-fA-f][0-9a-fA-f][0-9a-fA-f][0-9a-fA-f][0-9a-fA-f][0-9a-fA-f]$/i)){
				if(val.match(/^#[0-9a-fA-f][0-9a-fA-f][0-9a-fA-f]$/i)){
					return "#"+val.charAt(1)+val.charAt(1)+val.charAt(2)+val.charAt(2)+val.charAt(3)+val.charAt(3);
				}else{
					return null;
				}
			}else{
				return val;
			}
		}
	}
	function buildPanel(){
		if(!me.isShowPanel){
			$panel.hide();
			return;
		}else{
			$('.top-pane .reset').click(function(e){
				e.preventDefault();
				setNonCustomized();
				me.hide();
				$('#' + ems).remove();
				isInitialized = false;
				var $gate = $opt.find('.options-gate');
				$gate.css({visibility: 'visible'});
				$gate.css({opacity: 1});
				sessionStorage.setItem('lessVars', JSON.stringify({}));
				me.lessVars = {};
				return false;
			});
			$panel.css({left: -1*optW+'px'});
			$toggle.click(function(e){
				e.preventDefault();
				if(skrollexConfig.isCustomizer){
					sessionSet('skrollexShowColorPanel', 'yes');
					window.parent.location = skrollexConfig.permalink;
				}else{
					if($panel.hasClass('on')){
						me.hide();
					}else{
						me.show();
					}
				}
				return false;
			});
			$opt.find('.save-custom-css').click(function(e){
				e.preventDefault();
				var $content = $customCss.find('.css-content');
				if(e.shiftKey){
					var contentText='@import "theme.less";\r\n\r\n';
					for(var key in me.lessVars){
						contentText = contentText+'@'+key+': '+me.lessVars[key]+';\r\n';
					}
					$customCss.find('.css-content').text(contentText);
					new TWEEN.Tween({autoAlpha: 0, x:-450})
						.to({autoAlpha: 1, x: 0}, 400)
						.onUpdate(function(){
							$customCss.css({opacity: this.autoAlpha, visibility: (this.autoAlpha > 0 ? 'visible' : 'hidden')});
							if(Modernizr.csstransforms3d && appShare.force3D){
								$customCss.css({transform: 'translate3d('+this.x+'px, 0px, 0px)'});
							}else{
								$customCss.css({transform: 'translate('+this.x+'px, 0px)'});
							}
						})
						.easing(TWEEN.Easing.Quadratic.Out)
						.start();
				}else{
					if($('body').hasClass('admin-bar')){
						if(!customCss) createCss();
						var contentText = customCss.replace(/(\r\n|\r|\n)/g,'\r\n');
						var $form = $('#save-custom-css');
						var $inp = $('<input type="hidden" id="content" name="content">').val(contentText).appendTo($form);
						$form.submit();
						$inp.remove();
					}else{
						alert('Saving is not allowed in demo mode.');
					}
				}
				return false;
			});
			$customCss.find('.close-panel').click(function(e){
				e.preventDefault();
				new TWEEN.Tween({autoAlpha: 1, x: 0})
					.to({autoAlpha: 0, x: -450}, 400)
					.onUpdate(function(){
						$customCss.css({opacity: this.autoAlpha, visibility: (this.autoAlpha > 0 ? 'visible' : 'hidden')});
						if(Modernizr.csstransforms3d && appShare.force3D){
							$customCss.css({transform: 'translate3d('+this.x+'px, 0px, 0px)'});
						}else{
							$customCss.css({transform: 'translate('+this.x+'px, 0px)'});
						}
					})
					.easing(TWEEN.Easing.Linear.None)
					.start();
				return false;
			});
			tools.selectTextarea($customCss.find("textarea"));
		}
	}
	function createCss(isInitOnly){
		var custom = atob(customLess);
		sessionStorage.setItem('lessVars', JSON.stringify(me.lessVars));
		doLess(custom, function(css){
			if(!isInitOnly){
				customCss = css;
				var $cur = $('#'+ems);
				if($cur.length<1){
					$('<style type="text/css" id="'+ems+'">\n'+css+'</style>').appendTo('head');
				}else{
					if($cur[0].innerHTML){
						$cur[0].innerHTML = customCss;
					}else{
						$cur[0].styleSheet.cssText = customCss;
					}
				}
			}
		});
	}
	function doLess(data, callback){
		less.render(
			data,
			{	currentDirectory: "assets/css/src/schemes/",
				filename: skrollexConfig.themeUri + "assets/css/src/schemes/colors-custom.less",
				entryPath: "assets/css/src/schemes/",
				rootpath: "assets/css/src/schemes/",
				rootFilename: "assets/css/src/schemes/colors-custom.less",
				relativeUrls: false,
				useFileCache: false,
				compress: false,
				modifyVars: me.lessVars,
				globalVars: less.globalVars
			},
			function(e, output) {
				callback(output.css);
			}
		);
	}
	function toHex(rgb){
		if(rgb.indexOf('rgb') === -1){
			return rgb;
		}else{
			var triplet = rgb.match(/[^0-9]*([0-9]*)[^0-9]*([0-9]*)[^0-9]*([0-9]*)[^0-9]*/i);
			return "#"+digitToHex(triplet[1])+digitToHex(triplet[2])+digitToHex(triplet[3]);
		}
		function digitToHex(dig){
			if(isNaN(dig)){
				return "00";
			}else{
				var hx = parseInt(dig).toString(16);
				return hx.length == 1 ? "0"+hx : hx;
			}
		}
	}
	
	if(me.isShowPanel){
		$('<div id="customize-panel"></div>').appendTo('body').load(skrollexConfig.themeUri + 'includes/generated/colors/color-panel.php #customize-panel>*', function(xhr, statusText, request){
			if(statusText !== "success" && statusText !== "notmodified"){
				$('#customize-panel').remove();
				script.afterConfigure();
			}else{
				$.getScript( skrollexConfig.themeUri + "assets/js/custom-less.js?"+(new Date().getTime()), function( data, lessStatusText, jqxhr ) {
					if(lessStatusText !== "success" && lessStatusText !== "notmodified"){
						$('#customize-panel').remove();
						script.afterConfigure();
					}else{
						$panel = $('#customize-panel');
						$opt = $panel.find('.options');
						$toggle = $panel.find('.toggle-button');
						optW = $opt.outerWidth();
						$customCss = $panel.find('.custom-css');
						$colors = $opt.find('.colors');
						buildPanel();
						var skrollexLastColors = sessionGet('skrollexLastColors');
						if(skrollexLastColors && skrollexLastColors !== skrollexConfig.colors){
							setNonCustomized();
						}
						if( isCustomized() ){
							isInitialized = true;
							me.lessVars = JSON.parse(sessionStorage.getItem('lessVars'));
							createCss();
							initLessVars();
							$opt.find('.options-gate').css({visibility: 'hidden'});
						}
						$window.resize(resize);
						resize();
						if((sessionGet('skrollexShowColorPanel') === 'yes' && !skrollexConfig.isCustomizer) || tools.getUrlParameter('show-color-panel') === 'yes'){
							sessionSet('skrollexShowColorPanel', 'no');
							me.show();
						}
						sessionSet('skrollexLastColors', skrollexConfig.colors);
						script.afterConfigure();
					}
				});
			}
		});
	}else{
		script.afterConfigure();
	}
};
},{"../app/app-share.js":5,"../app/themes.js":8,"../tools/tools.js":12,"../widgets/loading.js":19}],11:[function(require,module,exports){
"use strict"; var $ = jQuery;
$(function() { new (function(){
	(function(){
		window.skrollexConfig = eval('(' + $('html').data('skrollex-config') + ')');
		window.skrollexConfig.screenshotMode = false;
		window.skrollexConfig.animations = false;
		if(window.skrollexConfig.animations){
			$('html').addClass('no-animations');
		}
		$('html').addClass('dom-ready');
		var disableMobileAnimations = true;
		var isWin = navigator.appVersion.indexOf("Win")!==-1;
		if(isWin) $('html').addClass('win');
		var ua = navigator.userAgent.toLowerCase();
		var isEdge = ua.indexOf('edge') > -1;
		if(isEdge) $('html').addClass('edge');
		var isChrome = !isEdge && ua.indexOf('chrome') > -1;
		if(isChrome) $('html').addClass('chrome');
		var isAndroidBrowser4_3minus = ((ua.indexOf('mozilla/5.0') > -1 && ua.indexOf('android ') > -1 && ua.indexOf('applewebkit') > -1) && !(ua.indexOf('chrome') > -1));
		if(isAndroidBrowser4_3minus) $('html').addClass('android-browser-4_3minus');
		var nua = navigator.userAgent;
		var isAndroidBrowser = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));
		if(isAndroidBrowser) $('html').addClass('android-browser');
		var isSafari = !isChrome && ua.indexOf('safari') !== -1 && ua.indexOf('windows') < 0;
		if(isSafari) $('html').addClass('safari');
		var isMobile = Modernizr.touch;
		if(isMobile){
			$('html').addClass('mobile');
			if (disableMobileAnimations) $('html').addClass('poor-browser');
		}else{
			$('html').addClass('non-mobile');
		}
		if(isWin && isSafari){
			$('html').addClass('flat-animation');
		}
		if (navigator.userAgent.indexOf('MSIE 9.') > -1){
			$('html').addClass('ie9');
		}else if (navigator.userAgent.indexOf('MSIE 10.') > -1){
			$('html').addClass('ie10');
		}else if (!!navigator.userAgent.match(/Trident.*rv\:11\./)){
			$('html').addClass('ie11');
		}
		if(window.skrollexConfig.screenshotMode){
			$('html').addClass('hide-skroll-bar');
		}
		if(!window.console){
			window.console = {log: function(){}};
		}else if(!window.console.log){
			window.console.log = function(){};
		}
		if (typeof(window.atob) == "undefined"){
			window.atob = function(x){
				return base64.decode(x);
			}
		}
	})();
	var Customize = require('./customize/customize.js');
	var TopNav = require('./widgets/top-nav.js');
	var MenuToggle = require('./widgets/menu-toggle.js');
	var Players = require('./animation/players.js');
	var Scrolling = require('./animation/scrolling.js');
	var tools = require('./tools/tools.js');
	var Gallery = require('./widgets/gallery.js');
	var fluid = require('./widgets/fluid.js');
	var Counter = require('./widgets/counter.js');
	var ChangeColors = require('./widgets/change-colors.js');
	var Sliders = require('./widgets/sliders.js');
	var loading = require('./widgets/loading.js');
	var CssAnimation = require('./animation/css-animation.js');
	var dotScroll = require('./widgets/dot-scroll.js');
	var Map = require('./widgets/map.js');
	var Skillbar = require('./widgets/skillbar.js');
	var TextBg = require('./widgets/text-bg.js');
	var TextMask = require('./widgets/text-mask.js');
	var TextFit = require('./widgets/text-fit.js');
	var TextFullscreen = require('./widgets/text-fullscreen.js');
	var AjaxForm = require('./widgets/ajax-form.js');
	var YoutubeBG = require('./widgets/youtube-bg.js');
	var VimeoBG = require('./widgets/vimeo-bg.js');
	var VideoBG = require('./widgets/video-bg.js');
	var app = require('./app/app.js');
	var OverlayWindow = require('./widgets/overlay-window.js');
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var isAndroid43minus = $('html').hasClass('android-browser-4_3minus');
	var $pageTransition = $('.page-transition, .nav-links, .sidebar, .post-meta, .post-title, .post-image');
	var me = this;
	var $window = $(window);
	var sectionQ = '.view>.fg';
	var $sections = $(sectionQ);
	var sectionTriggers = [];
	var lastActiveSectionHash;
	var customizerUrl = function(url){
		var res = url;
		if(skrollexConfig.isCustomizer){
			var part1 = 'wp-admin/customize.php?url=';
			var iop1 = res.indexOf(part1);
			if(iop1>=0){
				res = decodeURIComponent(res.substring(iop1 + part1.length));
			}else{
				var part2 = 'wp-admin/customize.php';
				var iop2 = res.indexOf(part2);
				if(iop2>=0){
					res = res.substring(0, iop2);
				}
			}
		}
		return res;
	}
	var deleteHash = function(url){
		var hp = url.indexOf('#');
		if(hp >= 0){
			return url.substr(0, hp);
		}else{
			return url;
		}
	}
	var getHash = function(url){
		var hp = url.indexOf('#');
		if(hp >= 0){
			return url.substr(hp);
		}else{
			return null;
		}
	}
	var location = deleteHash(customizerUrl(document.location.href));
	var $navLinks = (function(){
		var $res = jQuery();
		$('#top-nav nav a').each(function(){
			var $this = $(this);
			if(
				(!this.hash) ||
				(
					(this.href === location+this.hash) &&
					($(sectionQ+this.hash).length > 0)
				)
			){
				$this.data('navigation-group', 'top-nav');
				$res = $res.add($this);
			}
		});
		return $res;
	})();
	var isMobile = $('html').hasClass('mobile');
	var scrolling;
	var maxScrollPosition;
	var ticker = new (function(){
		var me = this;
		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function(/* function */ callback, /* DOMElement */ element){
					window.setTimeout(callback, 1000 / 60);
				};
		})();
		var lastPosition = -1;
		this.pageIsReady = false;
		(function animate(time){
			if(me.pageIsReady){
				var windowTopPos = tools.windowYOffset();
				if (lastPosition !== windowTopPos) {
					scrolling.scroll(windowTopPos);
					trigNavigationLinks(windowTopPos);
				}
				lastPosition = windowTopPos;
				TWEEN.update();
				app.tick();
			}
			if(loading.queue.length > 0) {
				(loading.queue.pop())();
			}
			requestAnimFrame(animate);
		})();
	})();
	
	this.topNav = undefined;
	this.players = Players;
	this.afterConfigure = function(){
		var hash = getHash(customizerUrl(window.location.href));
		new YoutubeBG();
		new VimeoBG();
		new VideoBG();
		app.prepare(function(){
			loading.load(function (){
				$navLinks = $navLinks.add(dotScroll.links()).click(function(){
					$navLinks.removeClass('target');
					$(this).addClass('target');
				});
				me.topNav = new TopNav();
				new MenuToggle(me);
				scrolling = new Scrolling(me);
				$('#footer.animated .section-cols').addClass('scroll-in-animation').attr('data-animation', 'fadeInDown')
				widgets($('body'));
				new Gallery(onBodyHeightResize, widgets, unwidgets);
				var windowW = $window.width();
				var windowH = $window.height();
				$window.resize(function(){
					var newWindowW = $window.width();
					var newWindowH = $window.height();
					if(newWindowW!==windowW || newWindowH!==windowH){ //IE 8 fix
						windowW = newWindowW;
						windowH = newWindowH;
						fluid.setup($('body'));
						onBodyHeightResize();
					}
				});
				$('.masonry-grd').each(function(){
					$(this).masonry('on', 'layoutComplete', function(){ onBodyHeightResize(); });
				});
				app.setup(function(){
					var finish = function(){
						buildSizes();
						calcNavigationLinkTriggers();
						ticker.pageIsReady = true;
						$navLinks.each(function(){
							if(this.href==location){
								$(this).addClass('active');
							}
						});
						$('.bigtext').each(function(){
							$(this).bigtext();
						});
						app.ungated();
						setTimeout(function(){
							loading.ungate();
							var nav = sessionStorage.getItem('navigate');
							if(skrollexConfig.isCustomizer && nav){
								navigate(nav, getHash(nav));
							}else if(!skrollexConfig.isCustomizer){
								navigate(customizerUrl(window.location.href), hash);
							}
						});
					};
					var test = function(){
						var $excl = $('.non-preloading, .non-preloading img');
						var $imgs = $('img').not($excl);
						for(var i=0; i<$imgs.length; i++){
							if( (!$imgs[i].width || !$imgs[i].height) && (!$imgs[i].naturalWidth || !$imgs[i].naturalHeight) ){
								setTimeout(test, 100);
								return;
							}
						}
						finish();
					}
					test();
				});
			});
		});
	}
	function onBodyHeightResize() {
		buildSizes();
		scrolling.scroll(tools.windowYOffset());
		calcNavigationLinkTriggers();
	}
	function widgets($context){
		new Sliders($context);
		if(!isMobile) $context.find('.hover-dir').each( function() { $(this).hoverdir({speed: 300}); } );
		$context.find("a").click(function(e){
			var $this = $(this);
			if($this.data('toggle') || $this.hasClass('menu-toggle')) return;
			var cUrl = customizerUrl(document.location.href);
			if(skrollexConfig.isCustomizer && $this.attr('href') && (cUrl === this.href || (cUrl+'/') === this.href || cUrl === (this.href+'/')) && !getHash(this.href)){
				tools.scrollTo(0);
				e.preventDefault();
				return false;
			}
			return navigate(this.href, this.hash, e, $this);
		});
		fluid.setup($context);
		new Map($context);
		new Counter($context, me);
		new ChangeColors($context);
		new Skillbar($context, me);
		new TextBg($context, me);
		new TextMask($context);
		new TextFit($context);
		new TextFullscreen($context);
		new AjaxForm($context);
		new CssAnimation($context, me);
		$('.widget-tabs a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
			return false;
		});
		$context.find('video').each(function(){ // IE 9 Fix
			if($(this).attr('muted')!==undefined){
				this.muted=true;
			}
		});
		$context.find('.open-overlay-window').each(function(){
			var $this = $(this);
			var $overlay = $($this.data('overlay-window'));
			var overlayWindow = new OverlayWindow($overlay);
			$this.click(function(e){
				e.preventDefault();
				overlayWindow.show();
				return false;
			})
		});
		var $fbox = $context.find('.fancybox');
		if (typeof $fbox.fancybox == 'function') {
			var opts = { 'overlayShow' : true, 'hideOnOverlayClick' : true, 'overlayOpacity' : 0.93, 'overlayColor' : '#000004', 'showCloseButton' : true, 'padding' : 0, 'centerOnScroll' : true, 'enableEscapeButton' : true, 'autoScale' : true };
			jQuery('.youtube-popup')
					.addClass('nofancybox')
					.fancybox( jQuery.extend({}, opts, { 'type' : 'iframe', 'width' : 1280, 'height' : 720, 'padding' : 0, 'titleShow' : false, 'titlePosition' : 'float', 'titleFromAlt' : true, 'onStart' : function(selectedArray, selectedIndex, selectedOpts) { selectedOpts.href = selectedArray[selectedIndex].href.replace(new RegExp('youtu.be', 'i'), 'www.youtube.com/embed').replace(new RegExp('watch\\?(.*)v=([a-z0-9\_\-]+)(&amp;|&|\\?)?(.*)', 'i'), 'embed/$2?$1$4'); var splitOn = selectedOpts.href.indexOf('?'); var urlParms = ( splitOn > -1 ) ? selectedOpts.href.substring(splitOn) : ""; selectedOpts.allowfullscreen = ( urlParms.indexOf('fs=0') > -1 ) ? false : true } }) );
		}
		if(isMobile){
			$context.find('.textillate').children('.texts').css({display: 'inline'}).children(':not(span:first-of-type)').css({display: 'none'});
		}else{
			var $tlt = $context.find('.textillate');
			$tlt.textillate(eval('('+$tlt.data('textillate-options')+')'));
		}
		var columnH = function(){
			$context.find('.col-height').each(function(){
				var $this = $(this);
				if($this.width() === $this.parent().width()){
					$this.css({'min-height': '0'});
					$this.children('.position-middle-center').removeClass('position-middle-center').addClass('position-middle-center-mark').css({padding: '20px'});
				}else{
					$this.css({'min-height': ''});
					$this.children('.position-middle-center-mark').removeClass('position-middle-center-mark').addClass('position-middle-center').css({padding: ''});
				}
			});
		};
		$(window).resize(columnH);
		columnH();
		var svgOverlays = function(){
			$context.find('svg.fg-overlay').each(function(){
				var $this = $(this);
				var w = $this.parent().width();
				var h = $this.parent().height();
				var size = w > h ? w : h;
				$this.attr('width',size).attr('height',size);
			});
		}
		$(window).resize(svgOverlays);
		svgOverlays();
		if (skrollexConfig.isCustomizer) {
			var svgUrlFix = function(){
				$context.find('svg').each(function(){
					var s = Snap($(this)[0]);
					var change = function(entry, name){
						var pref = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search+"#";
						entry.node.setAttribute(name, entry.node.getAttribute(name)
							.replace("url('#", "url('"+pref)
							.replace('url("#', 'url("'+pref)
							.replace("url(#", 'url('+pref)
						);
					}
					s.selectAll('[mask]').forEach(function(entry) {
						change(entry, 'mask');
					});
					s.selectAll('[fill]').forEach(function(entry) {
						change(entry, 'fill');
					});
					s.selectAll('[filter]').forEach(function(entry) {
						change(entry, 'filter');
					});
				});
			}
			$(window).resize(svgUrlFix);
			svgUrlFix();
		}
		$context.find('.masonry-grd').each(function(){
			$(this).masonry({
				itemSelector: '.masonry-item:not(.hidden-item)',
				layoutMode: 'masonry',
				gutter: 0,
				percentPosition: true,
				isFitWidth: false
			});
		});
	}
	function unwidgets($context){
		new Sliders($context, true);
		$context.find('.player').each(function(){
			var ind = $(this).data('player-ind');
			me.players[ind].pause();
			me.players.splice(ind, 1);
		});
		$context.find('.overlay-content, .loaded-content').empty();
	}
	function navigate(href, hash, e, $elem) {
		var hrefBH = deleteHash(href);
		if(hash && (location === hrefBH || (location+'/') === hrefBH || location === (hrefBH+'/')) && hash.indexOf("!") === -1){
			var $content = (function(){
				if(hash === '#scroll-down' && e){
					var $v = false;
					var $tag = $(e.target);
					var tagTop = $tag.offset().top;
					$('.wrapper-content .view').each(function(){
						var $found = $(this);
						if( $found.offset().top + 100 > tagTop ){
							$v = $found;
							return false;
						}
					});
					if($v && $v.length > 0){
						return $v;
					}else{
						$v = $('.wrapper-content .view');
						if($v.length > 1){
							return $($v.get(1));
						}else if($v.length === 1 && $v.offset().top > 300){
							return $v;
						}else{
							return null;
						}
					}
				}else{
					return $(hash);
				}
			})();
			if (e) {
				e.preventDefault();
			}
			if($content !== null && $content.length > 0){
				var offset = $content.offset().top - me.topNav.state2H;
				var tn = $content.get(0).tagName.toLowerCase();
				if(tn === 'h1' || tn === 'h2' || tn === 'h3' || tn === 'h4' || tn === 'h5' || tn === 'h6'){
					offset -= 20;
				}
				if (offset < 0) offset = 0;
				tools.scrollTo(offset);
			}else{
				if(hash === '#scroll-down'){
					tools.scrollTo(Math.round($(window).height()/2));
				}else{
					tools.scrollTo(0);
				}
			}
			if(skrollexConfig.isCustomizer){
				sessionStorage.setItem('navigate', '');
			}
			return false;
		}else if(e && (href !== location+'#')){
			if(!$elem.attr('target')){
				var pageTransition = function(){
					e.preventDefault();
					var isCurState1 = me.topNav.isState1;
					me.topNav.state2();
					loading.gate(function(){
						window.location = href;
					});
					$(window).one('pageshow popstate', function(e){
						loading.ungate();
						if(isCurState1){
							me.topNav.state1();
						}
					});
				};
				if(!skrollexConfig.isCustomizer){
					if($elem.hasClass('page-transition')){
						pageTransition();
					}else{
						$pageTransition.each(function(){
							var container = $(this).get(0);
							if($.contains(container, $elem[0])){
								pageTransition();
							}
						});
					}
				}else{
					if(href.indexOf(skrollexConfig.homeUri) === 0){
						sessionStorage.setItem('navigate', href);
					}
				}
			}
		}else if(skrollexConfig.isCustomizer){
			sessionStorage.setItem('navigate', '');
		}
	}
	function calcNavigationLinkTriggers(){
		var wh = $window.height();
		var triggerDelta = wh/3;
		sectionTriggers = [];
		$sections.each(function(i){
			var $s = $(this);
			var id = $s.attr('id');
			if(id){
				var pos =  $s.data('position');
				sectionTriggers.push({hash: '#'+id, triggerOffset: pos-triggerDelta, position: pos});
			}
		});
		trigNavigationLinks(tools.windowYOffset());
	}
	function trigNavigationLinks(windowTopPos){
		var activeSectionHash;
		for(var i=0; i<sectionTriggers.length; i++){
			if(sectionTriggers[i].triggerOffset<windowTopPos && (i === 0 || sectionTriggers[i-1].position<windowTopPos)){
				activeSectionHash = sectionTriggers[i].hash;
			}
		}
		if(activeSectionHash!=lastActiveSectionHash){
			var sectionLink = location + activeSectionHash;
			lastActiveSectionHash = activeSectionHash;
			var found = [];
			$navLinks.each(function(){
				var $a = $(this);
				if(this.href === sectionLink){
					$a.addClass('active');
					$a.removeClass('target');
					found.push($a.data('navigation-group'));
				}
			});
			for (i = 0; i < found.length; i++) {
				$navLinks.each(function(){
					var $a = $(this);
					if(this.href !== sectionLink && found[i] === $a.data('navigation-group')){
						$a.removeClass('active');
					}
				});
			}
			app.changeSection(me, activeSectionHash);
		}
	}
	function buildSizes(){
		app.buildSizes(me);
		maxScrollPosition = $('body').height() - $window.height();
		for(var i=0; i<me.players.length; i++){
			var $v = me.players[i].$view;
			$v.data('position', $v.offset().top);
		}
	}
	var animEnd = function(elems, end, modern, callback, time){
		var additionTime = 100;
		var defaultTime = 1000;
		return elems.each(function() {
			var elem = this;
			if (modern && !isAndroid43minus) {
				var done = false;
				$(elem).bind(end, function() {
					done = true;
					$(elem).unbind(end);
					return callback.call(elem);
				});
				if(time >= 0 || time === undefined){
					var wTime = time === undefined ? 1000 : defaultTime + additionTime;
					setTimeout(function(){
						if(!done){
							$(elem).unbind(end);
							callback.call(elem);
						}
					}, wTime)
				}
			}else{
				callback.call(elem);
			}
		});
	}
	$.fn.animationEnd = function(callback, time) {
		return animEnd(this, tools.animationEnd, Modernizr.cssanimations, callback, time);
	};
	$.fn.transitionEnd = function(callback, time) {
		return animEnd(this, tools.transitionEnd, Modernizr.csstransitions, callback, time);
	};
	$.fn.stopTransition = function(){
		return this.css({
			'-webkit-transition': 'none',
			'-moz-transition': 'none',
			'-ms-transition': 'none',
			'-o-transition': 'none',
			'transition':  'none'
		});
	}
	$.fn.cleanTransition = function(){
		return this.css({
			'-webkit-transition': '',
			'-moz-transition': '',
			'-ms-transition': '',
			'-o-transition': '',
			'transition':  ''
		});
	}
	$.fn.nonTransition =  function(css) {
		return this.stopTransition().css(css).cleanTransition();
	};
	$.fn.transform =  function(str, origin) {
		return this.css(tools.transformCss(str, origin));
	};
	$('video').each(function(){ // IE 9 Fix
		if($(this).attr('muted')!==undefined){
			this.muted=true;
		}
	});
	new Customize(me);
	if(!isMobile && !isPoorBrowser){
		$(document).bind('mousewheel DOMMouseScroll', function (event) {
			if (event.ctrlKey == true) {
				event.preventDefault();
				return true;
			}

		});
	}
})();});
},{"./animation/css-animation.js":1,"./animation/players.js":2,"./animation/scrolling.js":3,"./app/app.js":6,"./customize/customize.js":10,"./tools/tools.js":12,"./widgets/ajax-form.js":13,"./widgets/change-colors.js":14,"./widgets/counter.js":15,"./widgets/dot-scroll.js":16,"./widgets/fluid.js":17,"./widgets/gallery.js":18,"./widgets/loading.js":19,"./widgets/map.js":20,"./widgets/menu-toggle.js":21,"./widgets/overlay-window.js":22,"./widgets/skillbar.js":23,"./widgets/sliders.js":24,"./widgets/text-bg.js":25,"./widgets/text-fit.js":26,"./widgets/text-fullscreen.js":27,"./widgets/text-mask.js":28,"./widgets/top-nav.js":29,"./widgets/video-bg.js":30,"./widgets/vimeo-bg.js":31,"./widgets/youtube-bg.js":32}],12:[function(require,module,exports){
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
},{"../script.js":11}],13:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function($context) {
	var loading = require('./loading.js');
	var $gateLoader = $('.gate .loader');
	$context.find('.ajax-form').each(function() {
		var $frm = $(this);
		$frm.submit(function(e) {
			if($frm.find('.help-block ul').length < 1){
				$gateLoader.addClass('show');
				loading.gate(function() {
					var message = function(msg) {
						$('<div class="ajax-form-alert alert heading fade in text-center">	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button> ' + msg + '</div>')
								.addClass($frm.data('message-class')).appendTo('body');
						loading.ungate();
						$gateLoader.removeClass('show');
					};
					$.ajax({
						type: $frm.attr('method'),
						url: $frm.attr('action'),
						data: $frm.serialize(),
						success: function(data) {
							$frm[0].reset();
							message(data);
						},
						error: function(xhr, str) {
							message('Error: ' + xhr.responseCode);
						}
					});
				});
				e.preventDefault();
			}
		});
	});
};


},{"./loading.js":19}],14:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function($context){
	var themes = require('../app/themes.js');
	$context.find('.change-colors').each(function(){
		var $group = $(this);
		var $target = $($group.data('target'));
		var $links = $group.find('a');
		var currentColors;
		for(var i=0; i<themes.colors; i++){
			var colors = 'colors-'+String.fromCharCode(65+i).toLowerCase();
			if($target.hasClass(colors)){
				currentColors = colors;
				$links.each(function(){
					var $el = $(this);
					if($el.data('colors') === currentColors){
						$el.addClass('active');
					}
				})
			}
		}
		$links.click(function(e){
			e.preventDefault();
			var $link = $(this);
			$target.removeClass(currentColors);
			currentColors = $link.data('colors');
			$target.addClass(currentColors);
			$links.removeClass('active');
			$link.addClass('active');
			return false;
		});
	});
};
},{"../app/themes.js":8}],15:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function($context, script){
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var isNoAnimations = $('html').hasClass('no-animations');
	if(isPoorBrowser || isNoAnimations) return;
	$context.find('.counter .count').each(function(){
		var $this = $(this);
		var count = parseInt($this.text());
		var cnt = {n: 0}
		var tw = new TWEEN.Tween(cnt)
			.to({n: count}, 1000)
			.onUpdate(function(){
				$this.text(Math.round(this.n));
			})
			.easing(TWEEN.Easing.Quartic.InOut);
		var pause = function(){
			tw.stop();
		}
		var resume = function(){
			cnt.n = 0;
			tw.start();
		}
		var start = resume;
		script.players.addPlayer($this, start, pause, resume);
	});
};
},{}],16:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = new (function(){
	var isMobile = $('html').hasClass('mobile');
	var $sec = $('.wrapper-content>.view>.fg[id]');
	var $lnks;
	if(!isMobile && $sec.length>1){
		var $ul = $('#dot-scroll');
		$sec.each(function(){
			$ul.append('<li><a href="#'+$(this).attr('id')+'"><span></span></a></li>');
		});
		$lnks = $ul.find('a').data('navigation-group', 'dot-scroll');
	}else{
		$lnks = jQuery();
	}
	this.links = function(){
		return $lnks;
	}
})();
},{}],17:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = new (function(){
	this.setup = function($context){
		$context.find('.fluid *').each(function() {
			var $el = $(this);
			var $wrap = $el.parent('.fluid');
			var newWidth = $wrap.width();
			var ar = $el.attr('data-aspect-ratio');
			if(!ar){
				ar = this.height / this.width;
				$el
					// jQuery .data does not work on object/embed elements
					.attr('data-aspect-ratio', ar)
					.removeAttr('height')
					.removeAttr('width');
			}
			var newHeight = Math.round(newWidth * ar);
			$el.width(Math.round(newWidth)).height(newHeight);
			$wrap.height(newHeight);
		});
	};
})();
},{}],18:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function(onBodyHeightResize, widgets, unwidgets){
	var tools = require('../tools/tools.js');
	var OverlayWindow = require('./overlay-window.js');
	var $topNav = $('#top-nav');
	$('.fg').each(function(i){
		var $gallery = $(this);
		var $grid = $gallery.find('.gallery-grd');
		var $items = $grid.find('.item');
		var $gItems = $gallery.find('.gallery-item');
		if($items.length < 1 && $gItems.length < 1){
			return;
		}
		var $mGrid = $gallery.find('.masonry-grd');
		var $overlay = $('.gallery-overlay');
		var $loader = $overlay.find('.loader');
		var $overlayContent = $overlay.find('.overlay-content');
		var overlayWindow = new OverlayWindow($overlay, widgets, unwidgets);
		var $overlayNext = $overlay.find('.next');
		var $overlayPrevios = $overlay.find('.previos');
		var isFilter = false;
		var defaultGroup = $gallery.data('default-group') ? $gallery.data('default-group') : 'all';
		var $btns = $gallery.find('.filter a');
		var $all = $gallery.find('.filter a[data-group=all]');
		var currentGroup = defaultGroup;
		var $currentItem;
		$gallery.find('.filter a[data-group='+defaultGroup+']').addClass('active');
		$btns.click(function(e){
			e.preventDefault();
			if(isFilter) return false;
			var $this = $(this);
			var isActive = $this.hasClass( 'active' );
			var	group = isActive ? 'all' : $this.data('group');
			if(currentGroup !== group){
				currentGroup = group;
				$btns.removeClass('active');
				if(!isActive){
					$this.addClass('active');
				}else{
					$all.addClass('active');
				}
				$items.each(function(){
					var $i = $(this);
					var dataGrps = $i.data('groups')
					var filter = dataGrps ? dataGrps.split(/\s+/) : [];
					if( group == 'all' || $.inArray(group, filter)!=-1 ){
						$i.removeClass('hidden-item');
					}else{
						$i.addClass('hidden-item');
					}
				});
				$mGrid.masonry( 'reloadItems' );
				$mGrid.masonry( 'layout' );
			}
			return false;
		});
		$gItems.click(function(e){
			e.preventDefault();
			openItem($(this));
			return false;
		});
		function openItem($item){
			$currentItem = $item;
			overlayWindow.show(null, function(){
				$loader.removeClass('show');
				$overlayContent.addClass('show');
			}, function(end){
				$loader.addClass('show');
				var $itemContent = $item.find('.gallery-item-content');
				$overlayContent.removeClass('show');
				$overlayContent.html($itemContent.html());
				var $container = $overlayContent.find('.swiper-container');
				$container.removeClass('hold');
				var $slides = $container.find('.swiper-slide');
				$slides.each(function(i){
					var $slide = $(this);
					if($slide.data('as-bg') === 'yes'){
						$slide.css({
							'background-image': 'url(' + $slide.data('hold-img') + ')'
						});
					}else{
						$slide.after('<div class="swiper-slide"><img alt="" src="' + $slide.data('hold-img') + '" /></div>').remove();
					}
				});
				var $images = $overlayContent.find('img');
				var nimages = $images.length;
				if (nimages > 0) {
					$images.load(function() {
						nimages--;
						if (nimages === 0) {
							end();
						}
					});
				} else {
					end();
				}
			});
		}
		$overlayNext.click(function(e){
			e.preventDefault();
			var $i = $currentItem.nextAll('.gallery-item:not(.hidden-item)').first();
			if($i.length<1){
				$i = $gItems.filter('.gallery-item:not(.hidden-item)').first();
			}
			openItem($i);
			return false;
		});
		$overlayPrevios.click(function(e){
			e.preventDefault();
			var $i = $currentItem.prevAll('.gallery-item:not(.hidden-item)').first();
			if($i.length<1){
				$i = $gItems.filter('.gallery-item:not(.hidden-item)').last();
			}
			openItem($i);
			return false;
		});
	});
};
},{"../tools/tools.js":12,"./overlay-window.js":22}],19:[function(require,module,exports){
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
},{"../tools/tools.js":12}],20:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function($context){
	var OverlayWindow = require('./overlay-window.js');
	if(typeof(google) == "undefined") return;
	$context.find('.map-open').each(function(){
		var $mapOpen = $(this);
		var $overlay = $($mapOpen.data('map-overlay')).clone().appendTo('body');
		$overlay.find('.overlay-view').append($mapOpen.parent().find('.map-canvas').clone());
		var $mapCanvas = $overlay.find('.map-canvas');
		var mapOptions = {
			center: new google.maps.LatLng($mapCanvas.data('latitude'), $mapCanvas.data('longitude')),
			zoom: $mapCanvas.data('zoom'),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		var markers = [];
		$mapCanvas.find('.map-marker').each(function(){
			var $marker = $(this);
			markers.push({
				latitude: $marker.data('latitude'),
				longitude: $marker.data('longitude'),
				text: $marker.data('text')
			});
		});
		$mapCanvas.addClass('close-map').wrap('<div class="map-view"></div>');
		var $mapView = $mapCanvas.parent();
		var overlayWindow = new OverlayWindow($overlay, false, false, function(){
			new TWEEN.Tween({autoAlpha: 1})
					.to({autoAlpha: 0}, 500)
					.onUpdate(function(){
						$mapView.css({opacity: this.autoAlpha, visibility: (this.autoAlpha > 0 ? 'visible' : 'hidden')});
					})
					.easing(TWEEN.Easing.Linear.None)
					.start();
		});
		var isInited = false;
		$mapOpen.click(function(event) {
			event.preventDefault();
			overlayWindow.show(false, function() {
				var $oc = $overlay.find('.overlay-control');
				var $ov = $overlay.find('.overlay-view');
				$mapView.css({height: ($(window).height() - $oc.height() - parseInt($ov.css('bottom').replace('px','')) ) + 'px'});
				$mapView.css({opacity: 1, visibility: 'visible'});
				if (!isInited) {
					isInited = true;
					var map = new google.maps.Map($mapCanvas[0], mapOptions);
					var addListener = function(marker, text) {
						var infowindow = new google.maps.InfoWindow({
							content: text
						});
						google.maps.event.addListener(marker, "click", function() {
							infowindow.open(map, marker);
						});
					}
					for (var i = 0; i < markers.length; i++) {
						var marker = new google.maps.Marker({
							map: map,
							position: new google.maps.LatLng(markers[i].latitude, markers[i].longitude)
						});
						var text = markers[i].text;
						if (text) {
							addListener(marker, text);
						}
					}
				}
			});
			return false;
		});
	});
}
},{"./overlay-window.js":22}],21:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function(script){
	var toggleSel = '.ext-nav-toggle, .responsive-nav';
	var $toggle = $(toggleSel);
	var isMobile = $('html').hasClass('mobile');
	var closeResp = function(){
		$('.responsive-nav').removeClass('show');
		$('body').removeClass('responsive-nav-show');
		if(!isMobile){
			$('.textillate').children('span:nth-of-type(1)').css({display: ''});
			$('.textillate').children('span:nth-of-type(2)').css({display: 'none'});
			$('.textillate').children('span:nth-of-type(2)').children().css({display: ''});
		}
	};
	$(window).resize(function(){
		$("div[class*='off-canvas']").removeClass('open');
		closeResp();
	});
	$toggle.click(function(e){
		e.preventDefault();
		var $tg = $(this);
		if($tg.hasClass('ext-nav-toggle')){
			var targetQ = $tg.data('target');
			var $extNav = $(targetQ);
			var $clickEls = $(targetQ+' a,#top-nav a:not('+toggleSel+'),.page-border a, #dot-scroll a');
			var clickHnd = function() {
				$extNav.removeClass('show');
				$tg.removeClass('show');
				$('body').removeClass('ext-nav-show');
				script.topNav.unforceState('ext-nav');
				$('html, body').css({overflow: '', position: ''});
				$clickEls.unbind('click', clickHnd);
			}
			if($tg.hasClass('show')){
				$extNav.removeClass('show');
				$tg.removeClass('show');
				$('body').removeClass('ext-nav-show');
				$clickEls.unbind('click', clickHnd);
				script.topNav.unforceState('ext-nav');
			}else{
				$extNav.addClass('show');
				$tg.addClass('show');
				$('body').addClass('ext-nav-show');
				$clickEls.bind('click', clickHnd);
				script.topNav.forceState('ext-nav');
			}
		}else{
			if($tg.hasClass('show')){
				closeResp();
			}else{
				if(!isMobile){
					$('.textillate').children('span:nth-of-type(1)').css({display: 'none'});
					$('.textillate').children('span:nth-of-type(2)').css({display: 'inline'});
					$('.textillate').children('span:nth-of-type(2)').children(':not(.current)').css({display: 'none'});
				}
				$tg.addClass('show');
				$('body').addClass('responsive-nav-show');
			}
		}
	});
};
},{}],22:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function($overlay, widgets, unwidgets, hideFunc){
	var $overlayClose = $overlay.find('.cross');
	var $overlayZoom = $($overlay.data('overlay-zoom'));
	var $overlayView = $overlay.find('.overlay-view');
	var me = this;
	this.$overlay = $overlay;
	this.show = function(load, callback, init) {
		var open = function(inited) {
			if(init && !inited){
				init(function(){ open(true); });
				return;
			}
			$overlayZoom.addClass('overlay-zoom');
			$overlay.transitionEnd(function(){
				var ifInit = function(){
					$overlayView.find('iframe').each(function(){
						var $this = $(this);
						var hold = $this.data('hold-src');
						if(hold && !$this.attr('src')){
							$this[0].src = hold;
						}
						$this.addClass('show');
					});
				}
				if (load) {
					var $loader = $overlay.find('.loader');
					var $loadedContent = $('<div class="loaded-content"></div>');
					$loader.addClass('show');
					$loadedContent.addClass('content-container').appendTo($overlayView);
					$loadedContent.load(load, function(xhr, statusText, request) {
						if (statusText !== "success" && statusText !== "notmodified") {
							$loadedContent.text(statusText);
							return;
						}
						$overlay.find('iframe').addClass('show');
						var $images = $loadedContent.find('img');
						var nimages = $images.length;
						if (nimages > 0) {
							$images.load(function() {
								nimages--;
								if (nimages === 0) {
									show();
								}
							});
						} else {
							show();
						}
						function show() {
							ifInit();
							if(widgets){
								widgets($loadedContent);
							}
							$loadedContent.addClass('show');
							$loader.removeClass('show');
							if(callback){
								callback();
							}
						}
					});
				}else{
					ifInit();
					if(widgets){
						widgets($overlayView);
					}
					if(callback){
						callback();
					}
				}
			}).addClass('show');
		};
		if ($overlay.hasClass('show')) {
			me.hide(open);
		} else {
			open();
		}
	}
	this.hide = function(callback) {
		$overlayZoom.removeClass('overlay-zoom');
		$overlay.removeClass('show');
		setTimeout(function() {
			var $loadedContent = $overlay.find('.loaded-content');
			if($loadedContent.length>0){
				if(unwidgets){
					$overlay.find('iframe').removeClass('show');
					unwidgets($overlay);
				}
				stopIframeBeforeRemove($loadedContent, function() {
					$loadedContent.remove();
					if(hideFunc){
						hideFunc();
					}
					if (callback) {
						callback();
					}
				});
			}else{
				if(unwidgets){
					$overlay.find('iframe').removeClass('show');
					unwidgets($overlay);
				}
				if(hideFunc){
					hideFunc();
				}
				if (callback) {
					callback();
				}
			}
		}, 500);
	}
	function stopIframeBeforeRemove($context, callback) {
		var isDoStop = $('html').hasClass('ie9')
				|| $('html').hasClass('ie10');
		if (isDoStop) {
			$context.find('iframe').attr('src', '');
			setTimeout(function() {
				callback();
			}, 300);
		} else {
			callback();
		}
	}
	$overlayClose.click(function(e){
		e.preventDefault();
		me.hide();
		return false;
	});
};
},{}],23:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function($context, script){
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var isNoAnimations = $('html').hasClass('no-animations');
	$context.find('.skillbar').each(function(){
		var $this = $(this)
		var $bar = $this.find('.skillbar-bar');
		var perc =  parseInt($this.attr('data-percent').replace('%',''));
		if(isPoorBrowser || isNoAnimations){
			$bar.css({width: perc+'%'});
		}else{
			var w = {width: 0}
			var tw = new TWEEN.Tween(w)
				.to({width: perc}, 1000)
				.onUpdate(function(){
					$bar.css({width: this.width+'%'});
				})
				.easing(TWEEN.Easing.Quartic.Out);
			var pause = function(){
				tw.stop();
			};
			var resume = function(){
				w.width = 0;
				tw.start();
			};
			var start = resume;
			script.players.addPlayer($this, start, pause, resume);
		}
	});
};
},{}],24:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function($context, isRemoved){
	var Swiper = require('../bower_components/swiper/dist/js/swiper.jquery.js');
	if(isRemoved){
		$context.find(".swiper-container.default-slider").each(function(){
			var swiper = $(this)[0].swiper;
			swiper.destroy(true, true);
		});
		return;
	}
	$context.find('.swiper-container.default-slider:not(.hold)').each(function () {
		var $this = $(this);
		var el = $this[0];
		var $el = $(el);
		var sopt = $el.data('swiper-options');
		var opt = sopt ? eval('('+sopt+')') : {};
		var swiper = new Swiper(el,
			$.extend(
				{	pagination: $el.find('.swiper-pagination')[0],
					paginationClickable: $el.find('.swiper-pagination')[0],
					nextButton: $el.find('.swiper-button-next')[0],
					prevButton: $el.find('.swiper-button-prev')[0],
				},
				opt
			)
		);
	});
};
},{"../bower_components/swiper/dist/js/swiper.jquery.js":9}],25:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function($context, script){
	var tools = require('../tools/tools.js');
	var isAndroid = $('html').hasClass('android-browser');
	var isNoAnimations = $('html').hasClass('no-animations');
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var isSafari = $('html').hasClass('safari');
	if(isAndroid || isNoAnimations || isPoorBrowser){
		return;
	}
	$context.find('.text-bg').each(function(i){
		var $cont = $(this);
		$cont.find($cont.data('text-effect-selector')).each(function(j){
			var $el = $(this).addClass('text-bg-svg svg-effect');
			var lines = [];
			$el.contents().filter(function() { 
				return !!$.trim( this.innerHTML || this.data ); 
			}).each(function(i){
				var $line = $(this);
				lines.push($line.text());
			});
			var onResize = function(){
				var svgW;
				var svgH;
				var effect = function(pat, s, svg) {
					s.attr({width: '100%', height: '100%'})
					var text = s.text(0, 0, lines).attr({fill:tools.snapUrl(pat)});
					$el.empty().append(svg);
					svgW = $el.width();
					var lh = parseFloat($el.css('line-height').replace('px', ''));
					var elAl = $el.css('text-align');
					text.selectAll("tspan").forEach(function(tspan, i){
						tspan.attr({dy: lh});
						if(elAl === 'right'){
							tspan.attr({x: svgW, 'text-anchor': 'end'});
						}else if(elAl === 'center'){
							tspan.attr({x: Math.round(svgW/2), 'text-anchor': 'middle'});
						}else{
							tspan.attr({x: 0, 'text-anchor': 'start'});
						}
					});
					svgH = Math.round(lines.length * lh + lh/5);
					$el.height(svgH);
					s.attr({viewBox: '0 0 '+svgW+' '+svgH});
				}
				var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				var s = Snap(svg);
				var animate = function(pat, inAttr, outAttr, dur, ease){
					var animIn = function(){
						this.animate(inAttr, dur, ease, animOut);
					}
					var animOut = function(){
						this.animate(outAttr, dur, ease, animIn);
					};

					if($cont.data('text-effect').indexOf('animated') !== -1){
						var playerPause = false;
						var paused = false;
						pat.animate(outAttr, dur, ease, animIn);
						if($cont.data('text-effect') === 'custom-animated' || isSafari){
							var timer = null;
							$(window).scroll(function(e){
								clearTimeout(timer);
								if(!paused){
									paused = true;
									if(!playerPause){
										pat.inAnim()[0].mina.pause();
									}
								}
								timer = setTimeout(function(){
									paused = false;
									if(!playerPause){
										pat.animate({ dummy: 0 } ,1);
										pat.inAnim()[0].mina.resume();
									}
								}, 100);
							});
						}
						var pause = function(){
							playerPause = true;
							if(!paused){
								pat.inAnim()[0].mina.pause();
							}
						}
						var resume = function(){
							playerPause = false;
							if(!paused){
								pat.animate({ dummy: 0 } ,1);
								pat.inAnim()[0].mina.resume();
							}
						}
						var start = resume;
						script.players.addPlayer($cont, start, pause, resume);
					}
				};
				if($cont.data('text-effect').indexOf('custom') !== -1){
					var imgUrl = $cont.data('text-bg');
					if(imgUrl){
						var img = new Image();
						img.onload = function() {
							var iw = this.width;
							var ih = this.height;
							var dur = 30000;
							var ease = mina.easeinout;
							var pat = s.image(imgUrl, 0, 0, iw, ih)
								.toPattern(0, 0, iw, ih)
								.attr({patternUnits: 'userSpaceOnUse'});
							effect(pat, s, svg);
							var outAttr = {x:(svgW - iw), y:(svgH - ih)};
							var inAttr = {x:0, y:0};
							animate(pat, inAttr, outAttr, dur, ease);
						}
						img.src = imgUrl;
					}
				}else if($cont.data('text-effect') !== 'no'){
					var pw = 300;
					var dur = 30000;
					var ease = mina.easeinout;
					var ph = $el.height();
					var r1 = s.rect().attr({width: "100%", height: ph}).addClass('fill-highlight');
					var r2 = s.rect().attr({width: "90%", height: ph}).addClass('fill-heading');
					var r3 = s.rect().attr({width: "50%", height: ph}).addClass('fill-highlight');
					var r4 = s.rect().attr({width: "20%", height: ph}).addClass('fill-heading');
					var pat = s.g(r1, r2, r3, r4)
						.toPattern(0, 0, pw, ph)
						.attr({patternUnits: 'userSpaceOnUse', preserveAspectRatio: 'none'});
					if($cont.data('text-effect').indexOf('effect-b-') !== -1){
						pat.attr({transform: 'rotate(-45deg)'});
					}
					effect(pat, s, svg);
					var outAttr = {width: 50};
					var inAttr = {width: pw};
					animate(pat, inAttr, outAttr, dur, ease);
				}
			};
			$(window).resize(onResize);
			onResize();
		});
	});
};


},{"../tools/tools.js":12}],26:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function ($context) {
	var isAndroid = $('html').hasClass('android-browser');
	if(isAndroid){
		return;
	}
	$context.find('.text-fit').each(function(){
		var $cont = $(this);
		$cont.find($cont.data('text-effect-selector')).each(function(j){
			var $headers = $(this).addClass('text-fit-svg svg-effect');
			var $link = $headers.find('a');
			var $el = $link.length > 0 ? $($link[0]) : $headers;
			var lines = [];
			$el.contents().filter(function () {
				return !!$.trim(this.innerHTML || this.data);
			}).each(function (i) {
				var $line = $(this);
				lines.push($line.text());
			});
			$el.addClass('normal-letter-spacing');
			var svgSize = function () {
				var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				var s = Snap(svg);
				$el.empty().append(svg);
				var sw = $el.innerWidth();
				if(sw > 391){
					sw = 391;
				}
				var fs = parseFloat($el.css('font-size').replace('px', ''));
				var dlh = 10;
				var y = 0;
				var pad = 20;
				for (var i = 0; i < lines.length; i++) {
					var text = s.text(0, 0, lines[i]);
					var tw = text.getBBox().width;
					var cfs = fs * sw / tw;
					var clh = dlh + cfs;
					y += i > 0 ? clh : (cfs + pad);
					text.attr({x: 0, y: y, 'font-size': cfs + 'px'}).addClass('fill-heading');
				}
				var he = y + pad;
				s.attr({width: sw, height: he});
				$el.height(he);
			};
			$(window).resize(svgSize);
			svgSize();
		});
	});
};


},{}],27:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function ($context) {
	var tools = require('../tools/tools.js');
	var isAndroid = $('html').hasClass('android-browser');
	if(isAndroid){
		return;
	}
	$context.find('.text-fullscreen').each(function(){
		var $cont = $(this);
		$cont.find('.fg').addClass('background-transparent');
		$cont.find($cont.data('text-effect-selector')).each(function(j){
			var $headers = $(this).addClass('text-fullscreen-svg svg-effect');
			var $link = $headers.find('a');
			var $el = $link.length > 0 ? $($link[0]) : $headers;
			var lines = [];
			$el.contents().filter(function () {
				return !!$.trim(this.innerHTML || this.data);
			}).each(function (i) {
				var $line = $(this);
				lines.push($line.text());
			});
			$el.addClass('normal-letter-spacing');
			var svgSize = function () {
				var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				var s = Snap(svg);
				s.attr({width: '100%', height: '100%'});
				$el.empty().append(svg);
				var mask = s.mask().attr({x: 0, y: 0, width: '100%', height: '100%'});
				mask.toDefs();
				var sw = Math.round(0.7 * $(window).width());
				if(sw > 391){
					sw = 391;
				}else if(sw < 200){
					sw = 200;
				}
				var fs = parseFloat($el.css('font-size').replace('px', ''));
				var lh = parseFloat($el.css('line-height').replace('px', ''));
				var lhr = lh/fs;
				var y = 0;
				var grp = mask.g();
				for (var i = 0; i < lines.length; i++) {
					var text = s.text(0, 0, lines[i]);
					var tw = text.getBBox().width;
					var cfs = fs * sw / tw;
					var clh = lhr * cfs;
					y += i > 0 ? clh : (cfs * 0.85)
					text.attr({x: 0, y: y, 'font-size': cfs + 'px'});
					grp.add(text);
				}
				var imgSrc = $cont.data('text-bg');
				var pat = s.g(
					imgSrc ? s.image(imgSrc, 0, 0, '100%', '100%').attr({preserveAspectRatio: 'xMidYMid slice'}) : s.rect({x: 0, y: 0, width: '100%', height: '100%', fill: '#ffffff'})
				).toPattern(0, 0, $(window).width(), $(window).height());
				s.rect({x: 0, y: 0, width: '100%', height: '100%', fill: pat, stroke: 'none'}).prependTo(mask);
				s.rect({x: 0, y: 0, width: '100%', height: '100%', mask: mask, stroke: 'none'}).addClass('fill-bg');
				var grpx = Math.round(($(window).width() - sw)/2);
				var grpy = Math.round(($(window).height() - y)/2);
				grp.attr({transform: 'translate('+grpx+', '+grpy+')'});
			};
			$(window).resize(svgSize);
			svgSize();
		});
	});
};


},{"../tools/tools.js":12}],28:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function ($context) {
	var tools = require('../tools/tools.js');
	var isAndroid = $('html').hasClass('android-browser');
	if(isAndroid){
		return;
	}
	$context.find('.text-mask').each(function(){
		var $cont = $(this);
		$cont.find($cont.data('text-effect-selector')).each(function(j){
			var $headers = $(this).addClass('text-mask-svg svg-effect');
			var $link = $headers.find('a');
			var $el = $link.length > 0 ? $($link[0]) : $headers;
			var lines = [];
			$el.contents().filter(function () {
				return !!$.trim(this.innerHTML || this.data);
			}).each(function (i) {
				var $line = $(this);
				lines.push($line.text());
			});
			$el.addClass('normal-letter-spacing');
			var svgSize = function () {
				var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				var s = Snap(svg);
				s.attr({width: '100%', height: '100%'});
				$el.empty().append(svg);
				var mask = s.mask().attr({x: 0, y: 0, width: '100%', height: '100%'});
				mask.toDefs();
				var sw = Math.round(0.7 * $el.innerWidth());
				if(sw > 391){
					sw = 391;
				}
				var fs = parseFloat($el.css('font-size').replace('px', ''));
				var dlh = 10;
				var pad = Math.round(sw * 0.15);
				var y = 0;
				var grp = mask.g();
				for (var i = 0; i < lines.length; i++) {
					var text = s.text(0, 0, lines[i])
					var tw = text.getBBox().width;
					var cfs = fs * (sw - pad - pad) / tw;
					var clh = dlh  + cfs;
					y += i > 0 ? clh : (cfs * 0.85)
					text.attr({x: pad, y: y, 'font-size': cfs + 'px'});
					grp.add(text);
				}
				var h = y + 2 * pad;
				var rad = Math.floor(h > sw ? h/2 : sw/2);
				var diam = 2 * rad;
				var imw = diam;
				var imh = diam;
				var imgSrc = $cont.data('text-bg');
				var pat = s.g(
					imgSrc ? s.image(imgSrc, 0, 0, imw, imh).attr({preserveAspectRatio: 'xMidYMid slice'}) : s.rect(0, 0, imw, imh).attr({fill: '#ffffff'})
				).toPattern(0, 0, imw, imh);
				s.rect({x: 0, y: 0, width: '100%', height: '100%', fill: pat, stroke: 'none'}).prependTo(mask);
				s.circle(rad, rad, rad).attr({mask: mask, stroke: 'none'})
					.addClass('fill-heading text-box');
				grp.attr({transform: 'translate(0, ' + Math.round((diam - y)/2) + ')'})
				s.attr({viewBox: '0 0 ' + diam + ' ' + diam, width: diam, height: diam});
				$el.height(diam);
			};
			$(window).resize(svgSize);
			svgSize();
		});
	});
};


},{"../tools/tools.js":12}],29:[function(require,module,exports){
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
},{"../tools/tools.js":12}],30:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function(){
	var $videoBgs = $(".video-bg");
	if($videoBgs.length <1){
		return;
	}
	var isPlayVideo = (function(){
		var isMobile = $('html').hasClass('mobile');
		var v=document.createElement('video');
		var canMP4 = v.canPlayType ? v.canPlayType('video/mp4') : false;
		return canMP4 && !isMobile;
	})();
	if( !isPlayVideo ){
		$videoBgs.each(function(){
			var $videoBg = $(this);
			var alt = $videoBg.data('alternative');
			if(alt){
				var $img = $('<img alt class="bg" src="'+alt+'"/>');
				$videoBg.after($img).remove();
			}
		});
		return;
	}
	$videoBgs.each(function(){
		var $divBg = $(this);
		$divBg.addClass('loading-func').data('loading', function(done){
			var $videoBg = $('<video class="video-bg"></video>');
			if($divBg.data('mute')==='yes') $videoBg[0].muted = true;
			var vol = $divBg.data('volume');
			if(vol !== undefined) $videoBg[0].volume= vol/100;
			var doDone = function(){
				var vw = $videoBg.width();
				var vh = $videoBg.height();
				var vr = vw/vh;
				var $window = $(window);
				var resize = function(){
					var ww = $window.width();
					var wh = $window.height();
					var wr = ww/wh;
					var w, h;
					if(vr > wr){
						h = Math.ceil(wh);
						w = Math.ceil(h * vr);
					}else{
						w = Math.ceil(ww);
						h = Math.ceil(w / vr);
					}
					$videoBg.css({
						width:  w+'px',
						height: h+'px',
						top: Math.round((wh - h)/2)+'px',
						left: Math.round((ww - w)/2)+'px'
					});
				};
				$window.resize(resize);
				resize();
				$videoBg[0].play();
				done();
			};
			$videoBg.on('ended', function(){
				this.currentTime = 0;
				this.play();
				if(this.ended) {
					this.load();
				}
			});
			var isNotDone = true;
			$videoBg.on('canplaythrough', function(){
				if(isNotDone){
					isNotDone = false;
					doDone();
				}else{
					this.play();
				}
			});
			$videoBg.on('error', function(){
				if(isNotDone){
					isNotDone = false;
					doDone();
				}
			});
			$videoBg[0].src = $divBg.data('video');
			$videoBg[0].preload="auto";
			$divBg.after($videoBg);
			$divBg.remove();
		});
	});
};
},{}],31:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function(){
	var $vimeoBgs = $(".vimeo-bg");
	if($vimeoBgs.length <1){
		return;
	}
	if($('html').hasClass('mobile')){
		$vimeoBgs.each(function(){
			var $vimeoBg = $(this);
			var alt = $vimeoBg.data('alternative');
			if(alt){
				var $img = $('<img alt class="bg" src="'+alt+'"/>');
				$vimeoBg.after($img).remove();
			}
		});
		return;
	}
	var dones = [];
	$vimeoBgs.each(function(i){
		var $vimeoBg = $(this);
		var elId = $vimeoBg.attr('id');
		if(!elId) {
			elId = 'vimeo-bg-'+i;
			$vimeoBg.attr('id', elId);
		}
		$vimeoBg.addClass('loading-func').data('loading', function(done){
			dones[elId] = done;
		});
	});
	$.getScript( "https://f.vimeocdn.com/js/froogaloop2.min.js" )
		.done(function( script, textStatus ) {
			$vimeoBgs.each(function(){
				var $vimeoBgDiv = $(this);
				var id = $vimeoBgDiv.attr('id');
				var volume = (function(){
					var r = $vimeoBgDiv.data('volume');
					return r === undefined ? 0 : r;
				})();
				var videoId = $vimeoBgDiv.data('video');
				var $vimeoBg = $('<iframe class="vimeo-bg" src="https://player.vimeo.com/video/'+videoId+'?api=1&badge=0&byline=0&portrait=0&title=0&autopause=0&player_id='+id+'&amp;loop=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
				$vimeoBgDiv.after($vimeoBg);
				$vimeoBgDiv.remove();
				$vimeoBg.attr('id', id);
				var player = $f($vimeoBg[0]);
				player.addEvent('ready', function() {
					var resize = function(vRatio){
						var windowW = $(window).width();
						var windowH = $(window).height();
						var iFrameW = $vimeoBg.width();
						var iFrameH = $vimeoBg.height();
						var ifRatio = iFrameW/iFrameH;
						var wRatio = windowW/windowH;
						var setSize = function(vw, vh){
							var ifw, ifh;
							if(ifRatio > vRatio){
								ifh = Math.ceil(vh);
								ifw = Math.ceil(ifh * ifRatio);
							}else{
								ifw = Math.ceil(vw);
								ifh = Math.ceil(ifw / ifRatio);
							}
							$vimeoBg.css({
								width:  ifw+'px',
								height: ifh+'px',
								top: Math.round((windowH - ifh)/2)+'px',
								left: Math.round((windowW - ifw)/2)+'px',
							});
						}
						if(wRatio > vRatio){
							var vw = windowW;
							var vh = vw/vRatio;
							setSize(vw, vh);
						}else{
							var vh = windowH;
							var vw = vh * vRatio;
							setSize(vw, vh);
						}
					};
					player.addEvent('finish', function(){
						player.api('play');
					});
					var isNotDone = true;
					player.addEvent('play', function(){
						if(isNotDone){
							isNotDone = false;
							dones[id]();
						}
					});
					player.api('setVolume', volume);
					player.api('getVideoWidth', function (value, player_id) {
						var w = value
						player.api('getVideoHeight', function (value, player_id) {
							var h = value;
							var vRatio = w / h;
							$(window).resize(function(){resize(vRatio);});
							resize(vRatio);
							player.api('play');
						});
					});
				});
			});
		})
		.fail(function( jqxhr, settings, exception ) {
			console.log( 'Triggered ajaxError handler.' );
		});
};
},{}],32:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function(){
	var $youtubeBgs = $(".youtube-bg");
	if($youtubeBgs.length <1){
		return;
	}
	if($('html').hasClass('mobile')){
		$youtubeBgs.each(function(){
			var $youtubeBg = $(this);
			var alt = $youtubeBg.data('alternative');
			if(alt){
				var $img = $('<img alt class="bg" src="'+alt+'"/>');
				$youtubeBg.after($img).remove();
			}
		});
		return;
	}
	var dones = [];
	$youtubeBgs.each(function(i){
		var $youtubeBg = $(this);
		var elId = $youtubeBg.attr('id');
		if(!elId) {
			elId = 'youtube-bg-'+i;
			$youtubeBg.attr('id', elId);
		}
		$youtubeBg.addClass('loading-func').data('loading', function(done){
			dones[elId] = done;
		});
	});
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	window.onYouTubeIframeAPIReady = function(){
		$youtubeBgs.each(function(){
			var $youtubeBg = $(this);
			var videoId = $youtubeBg.data('video');
			var vol = $youtubeBg.data('volume');
			var mute = $youtubeBg.data('mute');
			var elId = $youtubeBg.attr('id');
			var isNotDone = true;
			var player = new YT.Player(elId, {
				videoId: videoId,
				playerVars: {html5: 1, controls: 0, 'showinfo': 0, 'modestbranding': 1, 'rel': 0, 'allowfullscreen': true, 'iv_load_policy': 3, wmode: 'transparent' },
				events: {
					onReady: function(event){
						var resize = function(){
							var $iFrame = $(event.target.getIframe());
							var windowW = $(window).width();
							var windowH = $(window).height();
							var iFrameW = $iFrame.width();
							var iFrameH = $iFrame.height();
							var ifRatio = iFrameW/iFrameH;
							var wRatio = windowW/windowH;
							var vRatio = (function(){
								var r = $youtubeBg.data('ratio');
								return r === undefined ? ifRatio : eval(r);
							})(); 
							var setSize = function(vw, vh){
								var ifw, ifh;
								if(ifRatio > vRatio){
									ifh = Math.ceil(vh);
									ifw = Math.ceil(ifh * ifRatio);
								}else{
									ifw = Math.ceil(vw);
									ifh = Math.ceil(ifw / ifRatio);
								}
								$iFrame.css({
									width:  ifw+'px',
									height: ifh+'px',
									top: Math.round((windowH - ifh)/2)+'px',
									left: Math.round((windowW - ifw)/2)+'px',
								});
							}
							if(wRatio > vRatio){
								var vw = windowW;
								var vh = vw/vRatio;
								setSize(vw, vh);
							}else{
								var vh = windowH;
								var vw = vh * vRatio;
								setSize(vw, vh);
							}
						};
						$(window).resize(resize);
						resize();
						event.target.setPlaybackQuality('highres');
						if(vol !== undefined) event.target.setVolume(vol);
						if(mute === 'yes' || mute === undefined) event.target.mute();
						event.target.playVideo();
					},
					onStateChange: function(event){
						if(isNotDone && event.data === YT.PlayerState.PLAYING){
							isNotDone = false;
							(dones[elId])();
						}else if(event.data === YT.PlayerState.ENDED){
							event.target.playVideo();
						}
					},
					onError: function(event){
						if(isNotDone){
							isNotDone = false;
							(dones[elId])();
							console.log('YouTube Error: ' + event.data + ', video ID: ' + videoId);
						}
					}
				}
			});
		});	
	};
};
},{}]},{},[11])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6XFwwMDBcXF9iaXRidWNrZXRcXHNrcm9sbGV4LXdwXFxub2RlX21vZHVsZXNcXGdydW50LWJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiZjovMDAwL19iaXRidWNrZXQvc2tyb2xsZXgtd3Avc3JjL3NjcmlwdHMvYW5pbWF0aW9uL2Nzcy1hbmltYXRpb24uanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy9hbmltYXRpb24vcGxheWVycy5qcyIsImY6LzAwMC9fYml0YnVja2V0L3Nrcm9sbGV4LXdwL3NyYy9zY3JpcHRzL2FuaW1hdGlvbi9zY3JvbGxpbmcuanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy9hbmltYXRpb24vc2xpZGUtc2hvdy5qcyIsImY6LzAwMC9fYml0YnVja2V0L3Nrcm9sbGV4LXdwL3NyYy9zY3JpcHRzL2FwcC9hcHAtc2hhcmUuanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy9hcHAvYXBwLmpzIiwiZjovMDAwL19iaXRidWNrZXQvc2tyb2xsZXgtd3Avc3JjL3NjcmlwdHMvYXBwL3Njcm9sbC1hbmltYXRpb24uanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy9hcHAvdGhlbWVzLmpzIiwiZjovMDAwL19iaXRidWNrZXQvc2tyb2xsZXgtd3Avc3JjL3NjcmlwdHMvYm93ZXJfY29tcG9uZW50cy9zd2lwZXIvZGlzdC9qcy9zd2lwZXIuanF1ZXJ5LmpzIiwiZjovMDAwL19iaXRidWNrZXQvc2tyb2xsZXgtd3Avc3JjL3NjcmlwdHMvY3VzdG9taXplL2N1c3RvbWl6ZS5qcyIsImY6LzAwMC9fYml0YnVja2V0L3Nrcm9sbGV4LXdwL3NyYy9zY3JpcHRzL3NjcmlwdC5qcyIsImY6LzAwMC9fYml0YnVja2V0L3Nrcm9sbGV4LXdwL3NyYy9zY3JpcHRzL3Rvb2xzL3Rvb2xzLmpzIiwiZjovMDAwL19iaXRidWNrZXQvc2tyb2xsZXgtd3Avc3JjL3NjcmlwdHMvd2lkZ2V0cy9hamF4LWZvcm0uanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy93aWRnZXRzL2NoYW5nZS1jb2xvcnMuanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy93aWRnZXRzL2NvdW50ZXIuanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy93aWRnZXRzL2RvdC1zY3JvbGwuanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy93aWRnZXRzL2ZsdWlkLmpzIiwiZjovMDAwL19iaXRidWNrZXQvc2tyb2xsZXgtd3Avc3JjL3NjcmlwdHMvd2lkZ2V0cy9nYWxsZXJ5LmpzIiwiZjovMDAwL19iaXRidWNrZXQvc2tyb2xsZXgtd3Avc3JjL3NjcmlwdHMvd2lkZ2V0cy9sb2FkaW5nLmpzIiwiZjovMDAwL19iaXRidWNrZXQvc2tyb2xsZXgtd3Avc3JjL3NjcmlwdHMvd2lkZ2V0cy9tYXAuanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy93aWRnZXRzL21lbnUtdG9nZ2xlLmpzIiwiZjovMDAwL19iaXRidWNrZXQvc2tyb2xsZXgtd3Avc3JjL3NjcmlwdHMvd2lkZ2V0cy9vdmVybGF5LXdpbmRvdy5qcyIsImY6LzAwMC9fYml0YnVja2V0L3Nrcm9sbGV4LXdwL3NyYy9zY3JpcHRzL3dpZGdldHMvc2tpbGxiYXIuanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy93aWRnZXRzL3NsaWRlcnMuanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy93aWRnZXRzL3RleHQtYmcuanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy93aWRnZXRzL3RleHQtZml0LmpzIiwiZjovMDAwL19iaXRidWNrZXQvc2tyb2xsZXgtd3Avc3JjL3NjcmlwdHMvd2lkZ2V0cy90ZXh0LWZ1bGxzY3JlZW4uanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy93aWRnZXRzL3RleHQtbWFzay5qcyIsImY6LzAwMC9fYml0YnVja2V0L3Nrcm9sbGV4LXdwL3NyYy9zY3JpcHRzL3dpZGdldHMvdG9wLW5hdi5qcyIsImY6LzAwMC9fYml0YnVja2V0L3Nrcm9sbGV4LXdwL3NyYy9zY3JpcHRzL3dpZGdldHMvdmlkZW8tYmcuanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy93aWRnZXRzL3ZpbWVvLWJnLmpzIiwiZjovMDAwL19iaXRidWNrZXQvc2tyb2xsZXgtd3Avc3JjL3NjcmlwdHMvd2lkZ2V0cy95b3V0dWJlLWJnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9XQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmxCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7IHZhciAkID0galF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkY29udGV4dCwgc2NyaXB0KXtcblx0dmFyIGlzUG9vckJyb3dzZXIgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ3Bvb3ItYnJvd3NlcicpO1xuXHR2YXIgaXNOb0FuaW1hdGlvbnMgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ25vLWFuaW1hdGlvbnMnKTtcblx0aWYoIU1vZGVybml6ci5jc3NhbmltYXRpb25zIHx8IGlzUG9vckJyb3dzZXIgfHwgaXNOb0FuaW1hdGlvbnMpe1xuXHRcdCQoJy5zY3JvbGwtaW4tYW5pbWF0aW9uJykucmVtb3ZlQ2xhc3MoJ3Njcm9sbC1pbi1hbmltYXRpb24nKTtcblx0XHQkKCcuc2Nyb2xsLWFuaW1hdGlvbicpLnJlbW92ZUNsYXNzKCdzY3JvbGwtYW5pbWF0aW9uJyk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdCQoJy5zYWZhcmkgaS5zY3JvbGwtaW4tYW5pbWF0aW9uJykucmVtb3ZlQ2xhc3MoJ3Njcm9sbC1pbi1hbmltYXRpb24nKTtcblx0JCgnLnNhZmFyaSBpLnNjcm9sbC1hbmltYXRpb24nKS5yZW1vdmVDbGFzcygnc2Nyb2xsLWFuaW1hdGlvbicpO1xuXHQkY29udGV4dC5maW5kKCcuc2Nyb2xsLWluLWFuaW1hdGlvbiwgLnNjcm9sbC1hbmltYXRpb24nKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHR2YXIgZGVsYXkgPSAkdGhpcy5kYXRhKCdkZWxheScpO1xuXHRcdHZhciBhbmltYXRpb24gPSAkdGhpcy5kYXRhKCdhbmltYXRpb24nKSsnIGNzcy1hbmltYXRpb24tc2hvdyc7XG5cdFx0JHRoaXMucmVtb3ZlQ2xhc3MoYW5pbWF0aW9uKTtcblx0XHR2YXIgcGF1c2UgPSBmdW5jdGlvbigpe1xuXHRcdFx0aWYoZGVsYXkpe1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7JHRoaXMucmVtb3ZlQ2xhc3MoYW5pbWF0aW9uKTt9LCBkZWxheSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0JHRoaXMucmVtb3ZlQ2xhc3MoYW5pbWF0aW9uKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dmFyIHJlc3VtZSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZihkZWxheSl7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXskdGhpcy5hZGRDbGFzcyhhbmltYXRpb24pO30sIGRlbGF5KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHQkdGhpcy5hZGRDbGFzcyhhbmltYXRpb24pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgc3RhcnQgPSByZXN1bWU7XG5cdFx0c2NyaXB0LnBsYXllcnMuYWRkUGxheWVyKCR0aGlzLCBzdGFydCwgcGF1c2UsIHJlc3VtZSk7XG5cdH0pO1xufTsiLCJcInVzZSBzdHJpY3RcIjsgdmFyICQgPSBqUXVlcnk7XG52YXIgcGxheWVycz1bXTtcbnBsYXllcnMuYWRkUGxheWVyID0gZnVuY3Rpb24oJHZpZXcsIHN0YXJ0RnVuYywgcGF1c2VGdW5jLCByZXN1bWVGdW5jKXtcblx0cGxheWVycy5wdXNoKFxuXHRcdG5ldyAoZnVuY3Rpb24oKXtcblx0XHRcdHZhciBwbGF5ZWQgPSBmYWxzZTtcblx0XHRcdHZhciBzdGFydGVkID0gZmFsc2U7XG5cdFx0XHR0aGlzLiR2aWV3ID0gJHZpZXc7XG5cdFx0XHQkdmlldy5hZGRDbGFzcygncGxheWVyJykuZGF0YSgncGxheWVyLWluZCcsIHBsYXllcnMubGVuZ3RoKTtcblx0XHRcdHRoaXMucGxheSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKCFwbGF5ZWQpe1xuXHRcdFx0XHRcdHBsYXllZCA9IHRydWU7XG5cdFx0XHRcdFx0aWYoIXN0YXJ0ZWQpe1xuXHRcdFx0XHRcdFx0c3RhcnRlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRzdGFydEZ1bmMoKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHJlc3VtZUZ1bmMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHR0aGlzLnBhdXNlID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYocGxheWVkKXtcblx0XHRcdFx0XHRwbGF5ZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRwYXVzZUZ1bmMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9KSgpXG5cdCk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBwbGF5ZXJzOyIsIlwidXNlIHN0cmljdFwiOyB2YXIgJCA9IGpRdWVyeTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2NyaXB0KXtcblx0dmFyIG1lID0gdGhpcztcblx0dmFyIHRvb2xzID0gcmVxdWlyZSgnLi4vdG9vbHMvdG9vbHMuanMnKTtcblx0dmFyIFNjcm9sbEFuaW1hdGlvbiA9IHJlcXVpcmUoJy4uL2FwcC9zY3JvbGwtYW5pbWF0aW9uLmpzJyk7XG5cdHZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xuXHR2YXIgaXNQb29yQnJvd3NlciA9ICQoJ2h0bWwnKS5oYXNDbGFzcygncG9vci1icm93c2VyJyk7XG5cdHZhciBzY3JvbGxBbmltYXRpb24gPSBuZXcgU2Nyb2xsQW5pbWF0aW9uKG1lLCBzY3JpcHQpO1xuXHR0aGlzLndpbmRvd1RvcFBvcyA9IHVuZGVmaW5lZDtcblx0dGhpcy53aW5kb3dCb3R0b21Qb3MgPSB1bmRlZmluZWQ7XG5cdHRoaXMud2luZG93SCA9IHVuZGVmaW5lZDtcblx0dGhpcy5zY3JvbGwgPSBmdW5jdGlvbih3aW5kb3dUb3BQKXtcblx0XHRtZS53aW5kb3dIID0gJHdpbmRvdy5oZWlnaHQoKTtcblx0XHRtZS53aW5kb3dCb3R0b21Qb3MgPSB3aW5kb3dUb3BQK21lLndpbmRvd0g7XG5cdFx0aWYod2luZG93VG9wUCA8IHNjcmlwdC50b3BOYXYuc3RhdGUxVG9wKCkpe1xuXHRcdFx0aWYobWUud2luZG93VG9wUG9zID09PSB1bmRlZmluZWQpe1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7c2NyaXB0LnRvcE5hdi5zdGF0ZTEoKTt9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRzY3JpcHQudG9wTmF2LnN0YXRlMSgpO1xuXHRcdFx0fVxuXHRcdH1lbHNle1xuXHRcdFx0aWYobWUud2luZG93VG9wUG9zID09PSB1bmRlZmluZWQpe1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7c2NyaXB0LnRvcE5hdi5zdGF0ZTIoKTt9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRzY3JpcHQudG9wTmF2LnN0YXRlMigpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRtZS53aW5kb3dUb3BQb3MgPSB3aW5kb3dUb3BQO1xuXHRcdHNjcm9sbEFuaW1hdGlvbi5zY3JvbGwoKVxuXHRcdGZvcih2YXIgaT0wOyBpPHNjcmlwdC5wbGF5ZXJzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciB2aWV3UG9zID0gbWUuY2FsY1Bvc2l0aW9uKHNjcmlwdC5wbGF5ZXJzW2ldLiR2aWV3KTtcblx0XHRcdGlmKHZpZXdQb3MudmlzaWJsZSl7XG5cdFx0XHRcdHNjcmlwdC5wbGF5ZXJzW2ldLnBsYXkoKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRzY3JpcHQucGxheWVyc1tpXS5wYXVzZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHR0aGlzLmNhbGNQb3NpdGlvbiA9IGZ1bmN0aW9uICgkYmxvY2spe1xuXHRcdHZhciBibG9ja0ggPSAkYmxvY2suaGVpZ2h0KCk7XG5cdFx0dmFyIGJsb2NrVG9wUG9zID0gJGJsb2NrLmRhdGEoJ3Bvc2l0aW9uJyk7XG5cdFx0dmFyIGJsb2NrQm90dG9tUG9zID0gYmxvY2tUb3BQb3MgKyBibG9ja0g7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRvcDogYmxvY2tUb3BQb3MsXG5cdFx0XHRib3R0b206IGJsb2NrQm90dG9tUG9zLFxuXHRcdFx0aGVpZ2h0OiBibG9ja0gsXG5cdFx0XHR2aXNpYmxlOiBibG9ja1RvcFBvczxtZS53aW5kb3dCb3R0b21Qb3MgJiYgYmxvY2tCb3R0b21Qb3M+bWUud2luZG93VG9wUG9zXG5cdFx0fTtcblx0fVxufTsiLCJcInVzZSBzdHJpY3RcIjsgdmFyICQgPSBqUXVlcnk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG5cdHZhciBhcHBTaGFyZSA9IHJlcXVpcmUoJy4uL2FwcC9hcHAtc2hhcmUuanMnKTtcblx0dmFyIGlzUG9vckJyb3dzZXIgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ3Bvb3ItYnJvd3NlcicpO1xuXHR2YXIgaXNOb0FuaW1hdGlvbnMgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ25vLWFuaW1hdGlvbnMnKTtcblx0dmFyIGZhZGVUaW1lID0gNDAwMDtcblx0dmFyIG1vdmVUaW1lID0gMTIwMDA7XG5cdHZhciBzdDAgPSB7c2NhbGU6IDF9O1xuXHR2YXIgc3QxID0ge3NjYWxlOiAxLjF9O1xuXHR2YXIgcnVsZXMgPSBbXG5cdFx0W3N0MCwgc3QxXSxcblx0XHRbc3QxLCBzdDBdXG5cdF07XG5cdHZhciBvcmlnaW5zID0gW1xuXHRcdHtvcjogJ2xlZnQgdG9wJywgeHI6IDAsIHlyOiAwfSxcblx0XHR7b3I6ICdsZWZ0IGNlbnRlcicsIHhyOiAwLCB5cjogMX0sXG5cdFx0e29yOiAncmlnaHQgdG9wJywgeHI6IDIsIHlyOiAwfSxcblx0XHR7b3I6ICdyaWdodCBjZW50ZXInLCB4cjogMiwgeXI6IDF9XG5cdF1cblx0dmFyIGxhc3RSdWxlID0gcnVsZXMubGVuZ3RoIC0xO1xuXHR2YXIgbGFzdE9yaWdpbiA9IG9yaWdpbnMubGVuZ3RoIC0xO1xuXHR2YXIgZmFkZUVhc2UgPSBUV0VFTi5FYXNpbmcuUXVhcnRpYy5Jbk91dDtcblx0dmFyIG1vdmVFYXNlID0gVFdFRU4uRWFzaW5nLkxpbmVhci5Ob25lO1xuXHR0aGlzLnJ1biA9IGZ1bmN0aW9uKCRzbGlkZXMpIHtcblx0XHRpZihpc1Bvb3JCcm93c2VyIHx8IHdpbmRvdy5za3JvbGxleENvbmZpZy5zY3JlZW5zaG90TW9kZSB8fCBpc05vQW5pbWF0aW9ucykgcmV0dXJuO1xuXHRcdHZhciBsYXN0SSA9ICRzbGlkZXMubGVuZ3RoIC0gMTtcblx0XHRzaG93KGxhc3RJLCB0cnVlKTtcblx0XHRmdW5jdGlvbiBzaG93KGksIGlzRmlyc3RSdW4pIHtcblx0XHRcdHZhciBzbGlkZSA9ICRzbGlkZXMuZ2V0KGkpO1xuXHRcdFx0dmFyICRzbGlkZSA9ICQoc2xpZGUpO1xuXHRcdFx0dmFyIGNmZyA9ICRzbGlkZS5kYXRhKCk7XG5cdFx0XHR2YXIgcmkgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiBsYXN0UnVsZSk7XG5cdFx0XHR2YXIgb3JpID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogbGFzdE9yaWdpbik7XG5cdFx0XHR2YXIgcnVsZSA9IHJ1bGVzW3JpXTtcblx0XHRcdGNmZy5zc1NjYWxlID0gcnVsZVswXVsnc2NhbGUnXTtcblx0XHRcdGNmZy5zc09yaWcgPSBvcmlnaW5zW29yaV07XG5cdFx0XHRjZmcuc3NPcGFjaXR5ID0gKGkgPT09IGxhc3RJICYmICFpc0ZpcnN0UnVuKSA/IDAgOiAxO1xuXHRcdFx0aWYgKGkgPT09IGxhc3RJICYmICFpc0ZpcnN0UnVuKSB7XG5cdFx0XHRcdG5ldyBUV0VFTi5Ud2VlbihjZmcpXG5cdFx0XHRcdFx0LnRvKHtzc09wYWNpdHk6IDF9LCBmYWRlVGltZSlcblx0XHRcdFx0XHQuZWFzaW5nKGZhZGVFYXNlKVxuXHRcdFx0XHRcdC5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHQkc2xpZGVzLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0JCh0aGlzKS5kYXRhKCkuc3NPcGFjaXR5ID0gMTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0YXJ0KCk7XG5cdFx0XHR9XG5cdFx0XHRuZXcgVFdFRU4uVHdlZW4oY2ZnKVxuXHRcdFx0XHQudG8oe3NzU2NhbGU6IHJ1bGVbMV1bJ3NjYWxlJ119LCBtb3ZlVGltZSlcblx0XHRcdFx0LmVhc2luZyhtb3ZlRWFzZSlcblx0XHRcdFx0LnN0YXJ0KCk7XG5cdFx0XHRpZiAoaSA+IDApIHtcblx0XHRcdFx0bmV3IFRXRUVOLlR3ZWVuKHtzc09wYWNpdHk6IDF9KVxuXHRcdFx0XHRcdC50byh7c3NPcGFjaXR5OiAwfSwgZmFkZVRpbWUpXG5cdFx0XHRcdFx0Lm9uVXBkYXRlKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRjZmcuc3NPcGFjaXR5ID0gdGhpcy5zc09wYWNpdHk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZWFzaW5nKGZhZGVFYXNlKVxuXHRcdFx0XHRcdC5kZWxheShtb3ZlVGltZSAtIGZhZGVUaW1lKVxuXHRcdFx0XHRcdC5vblN0YXJ0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRzaG93KGkgLSAxKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdGFydCgpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdG5ldyBUV0VFTi5Ud2VlbihjZmcpXG5cdFx0XHRcdFx0LnRvKHt9LCAwKVxuXHRcdFx0XHRcdC5lYXNpbmcoZmFkZUVhc2UpXG5cdFx0XHRcdFx0LmRlbGF5KG1vdmVUaW1lIC0gZmFkZVRpbWUpXG5cdFx0XHRcdFx0Lm9uU3RhcnQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHNob3cobGFzdEkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnN0YXJ0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTsiLCJcInVzZSBzdHJpY3RcIjsgdmFyICQgPSBqUXVlcnk7XG5tb2R1bGUuZXhwb3J0cyA9IG5ldyAoZnVuY3Rpb24oKXtcblx0dmFyIG1lID0gdGhpcztcblx0dmFyIGlzT2xkV2luID1cblx0XHRcdChuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiV2luZG93cyBOVCA2LjFcIikhPS0xKSB8fCAvL1dpbjdcblx0XHRcdChuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiV2luZG93cyBOVCA2LjBcIikhPS0xKSB8fCAvL1Zpc3RhXG5cdFx0XHQobmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIldpbmRvd3MgTlQgNS4xXCIpIT0tMSkgfHwgLy9YUFxuXHRcdFx0KG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJXaW5kb3dzIE5UIDUuMFwiKSE9LTEpOyAgIC8vV2luMjAwMFxuXHR2YXIgaXNJRTkgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ2llOScpO1xuXHR2YXIgaXNJRTEwID0gJCgnaHRtbCcpLmhhc0NsYXNzKCdpZTEwJyk7XG5cdHZhciBpc0lFMTEgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ2llMTEnKTtcblx0dmFyIGlzRWRnZSA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnZWRnZScpO1xuXHR2YXIgaXNQb29yQnJvd3NlciA9ICQoJ2h0bWwnKS5oYXNDbGFzcygncG9vci1icm93c2VyJyk7XG5cdHZhciBpc01vYmlsZSA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnbW9iaWxlJyk7XG5cdHZhciBmYWN0b3IgPSAoZnVuY3Rpb24oKXtcblx0XHRpZihpc0lFOSB8fCBpc0lFMTAgfHwgKGlzSUUxMSAmJiBpc09sZFdpbikpe1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fWVsc2UgaWYoaXNJRTExKXtcblx0XHRcdHJldHVybiAtMC4xNTtcblx0XHR9ZWxzZSBpZihpc0VkZ2Upe1xuXHRcdFx0cmV0dXJuIC0wLjE1O1xuXHRcdH1lbHNlIGlmKGlzUG9vckJyb3dzZXIpe1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm4gLTAuMjU7XG5cdFx0fVxuXHR9KSgpO1xuXHR0aGlzLmZvcmNlM0QgPSBpc01vYmlsZSA/IGZhbHNlIDogdHJ1ZTtcblx0dGhpcy5wYXJhbGxheE1hcmdpbiA9IGZ1bmN0aW9uKHNjcmlwdCwgc2VjSW5kLCB2aWV3T2Zmc2V0RnJvbVdpbmRvd1RvcCl7XG5cdFx0dmFyIHZpZXdPZmZzZXRGcm9tTmF2UG9pbnQgPSAodmlld09mZnNldEZyb21XaW5kb3dUb3AgLSAoc2VjSW5kID09PSAwID8gMCA6IHNjcmlwdC50b3BOYXYuc3RhdGUySCkpO1xuXHRcdHJldHVybiBNYXRoLnJvdW5kKGZhY3RvciAqIHZpZXdPZmZzZXRGcm9tTmF2UG9pbnQpO1xuXHR9O1xufSkoKTsiLCJcInVzZSBzdHJpY3RcIjsgdmFyICQgPSBqUXVlcnk7XG5tb2R1bGUuZXhwb3J0cyA9IG5ldyAoZnVuY3Rpb24oKXtcblx0dmFyIGFwcFNoYXJlID0gcmVxdWlyZSgnLi9hcHAtc2hhcmUuanMnKTtcblx0dmFyIHRoZW1lcyA9IHJlcXVpcmUoJy4vdGhlbWVzLmpzJyk7XG5cdHZhciBTbGlkZVNob3cgPSByZXF1aXJlKCcuLi9hbmltYXRpb24vc2xpZGUtc2hvdy5qcycpO1xuXHR2YXIgc2xpZGVTaG93ID0gbmV3IFNsaWRlU2hvdygpO1xuXHR2YXIgaXNQb29yQnJvd3NlciA9ICQoJ2h0bWwnKS5oYXNDbGFzcygncG9vci1icm93c2VyJyk7XG5cdHZhciBpc05vQW5pbWF0aW9ucyA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnbm8tYW5pbWF0aW9ucycpO1xuXHR2YXIgaXNNb2JpbGUgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ21vYmlsZScpO1xuXHR2YXIgaXNEZWNvckIgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ3NpdGUtZGVjb3JhdGlvbi1iJyk7XG5cdHZhciBza2V3SCA9IDYwO1xuXHR2YXIgJGJvcmQgPSAkKCcjdG9wLW5hdiwgLnBhZ2UtYm9yZGVyLCAjZG90LXNjcm9sbCcpO1xuXHR2YXIgJHRvcE5hdiA9ICQoJyN0b3AtbmF2Jyk7XG5cdHZhciBzdGF0ZTFDb2xvcnMgPSAkdG9wTmF2LmRhdGEoJ3N0YXRlMS1jb2xvcnMnKTtcblx0dmFyIHN0YXRlMkNvbG9ycyA9ICR0b3BOYXYuZGF0YSgnc3RhdGUyLWNvbG9ycycpO1xuXHR2YXIgJGJvZHkgPSAkKCdib2R5Jyk7XG5cdHZhciAkdmlld3MgPSAkKCcudmlldycpO1xuXHR2YXIgJGJhY2dyb3VuZHM7XG5cdHRoaXMucHJlcGFyZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0XHRpZih3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT09ICdmaWxlOicgJiYgISQoJ2JvZHknKS5oYXNDbGFzcygnZXhhbXBsZS1wYWdlJykpe1xuXHRcdFx0JCgnPGRpdiBjbGFzcz1cImZpbGUtcHJvdG9jb2wtYWxlcnQgYWxlcnQgY29sb3JzLWQgYmFja2dyb3VuZC04MCBoZWFkaW5nIGZhZGUgaW5cIj5cdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9idXR0b24+IFVwbG9hZCBmaWxlcyB0byB3ZWIgc2VydmVyIGFuZCBvcGVuIHRlbXBsYXRlIGZyb20gd2ViIHNlcnZlci4gSWYgdGVtcGxhdGUgaXMgb3BlbmVkIGZyb20gbG9jYWwgZmlsZSBzeXN0ZW0sIHNvbWUgbGlua3MsIGZ1bmN0aW9ucyBhbmQgZXhhbXBsZXMgbWF5IHdvcmsgaW5jb3JyZWN0bHkuPC9kaXY+Jylcblx0XHRcdFx0XHQuYXBwZW5kVG8oJ2JvZHknKTtcblx0XHR9XG5cdFx0aWYoYXBwU2hhcmUuZm9yY2UzRCA9PT0gdHJ1ZSl7XG5cdFx0XHQkKCdodG1sJykuYWRkQ2xhc3MoJ2ZvcmNlM2QnKTtcblx0XHR9XG5cdFx0JCgnLndyYXBwZXItY29udGVudCwgLnZpZXcnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpXG5cdFx0XHR2YXIgJGhvbGRlcnMgPSBpc1Bvb3JCcm93c2VyID8gJHRoaXMuY2hpbGRyZW4oJy5iZy1ob2xkZXI6bGFzdCcpIDogJHRoaXMuY2hpbGRyZW4oJy5iZy1ob2xkZXInKTtcblx0XHRcdCRob2xkZXJzLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyICRob2xkZXIgPSAkKHRoaXMpO1xuXHRcdFx0XHQkaG9sZGVyLmFmdGVyKCc8aW1nIGFsdD1cIlwiIGNsYXNzPVwiYmdcIiBzcmM9XCInKyRob2xkZXIuZGF0YSgnc3JjJykrJ1wiIC8+Jyk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHQkKCcuYmctaG9sZGVyJykucmVtb3ZlKCk7XG5cdFx0aWYoaXNQb29yQnJvd3NlciB8fCBpc05vQW5pbWF0aW9ucyl7XG5cdFx0XHR2YXIgJGJvZHlCZyA9ICQoJy53cmFwcGVyLWNvbnRlbnQ+LmJnJyk7XG5cdFx0XHQkYm9keUJnLmVhY2goZnVuY3Rpb24oaSl7XG5cdFx0XHRcdGlmKGkgPT09ICgkYm9keUJnLmxlbmd0aCAtIDEpKXtcblx0XHRcdFx0XHQkKHRoaXMpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHQkKHRoaXMpLnJlbW92ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdCQoJy52aWV3JykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgJHZpZXdCZyA9ICQodGhpcykuY2hpbGRyZW4oJy5iZycpO1xuXHRcdFx0XHQkdmlld0JnLmVhY2goZnVuY3Rpb24oaSl7XG5cdFx0XHRcdFx0aWYoaSA9PT0gMCl7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGlmKGlzTW9iaWxlKXtcblx0XHRcdHZhciAkYm9keUltZyA9ICQoJy53cmFwcGVyLWNvbnRlbnQ+aW1nLmJnJyk7XG5cdFx0XHR2YXIgJGRlZkltZ1NldCA9ICRib2R5SW1nLmxlbmd0aD4wID8gJGJvZHlJbWcgOiAkKCcudmlldz5pbWcuYmcnKTtcblx0XHRcdGlmKCRkZWZJbWdTZXQubGVuZ3RoID4gMCl7XG5cdFx0XHRcdHZhciAkZGVmSW1nID0gJCgkZGVmSW1nU2V0WzBdKTtcblx0XHRcdFx0JCgnLnZpZXcnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0dmFyICRzZWMgPSAkKHRoaXMpO1xuXHRcdFx0XHRcdHZhciAkYmcgPSAkc2VjLmNoaWxkcmVuKCdpbWcuYmcnKTtcblx0XHRcdFx0XHRpZigkYmcubGVuZ3RoPDEpe1xuXHRcdFx0XHRcdFx0JGRlZkltZy5jbG9uZSgpLnByZXBlbmRUbygkc2VjKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0JCgnLndyYXBwZXItY29udGVudD5pbWcuYmcnKS5yZW1vdmUoKTtcblx0XHR9XG5cdFx0JGJhY2dyb3VuZHMgPSAkKCcuYmcnKTtcblx0XHRjYWxsYmFjaygpO1xuXHR9O1xuXHR0aGlzLnNldHVwID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuXHRcdHZhciBnb29kQ29sb3IgPSBmdW5jdGlvbigkZWwpe1xuXHRcdFx0dmFyIGJnID0gJGVsLmNzcygnYmFja2dyb3VuZC1jb2xvcicpO1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRiZy5tYXRjaCgvIy9pKSB8fFxuXHRcdFx0XHRcdGJnLm1hdGNoKC9yZ2JcXCgvaSkgfHxcblx0XHRcdFx0XHRiZy5tYXRjaCgvcmdiYS4qLDBcXCkvaSlcblx0XHRcdCk7XG5cdFx0fTtcblx0XHQkKCcudmlldy5zZWN0aW9uLWhlYWRlcicpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgJG5leHQgPSAkdGhpcy5uZXh0QWxsKCcudmlldycpLmZpcnN0KCkuY2hpbGRyZW4oJy5mZycpO1xuXHRcdFx0aWYoJG5leHQubGVuZ3RoPjAgJiYgZ29vZENvbG9yKCRuZXh0KSl7XG5cdFx0XHRcdCR0aGlzLmNoaWxkcmVuKCcuZmcnKS5hZGRDbGFzcygnc2tldy1ib3R0b20tcmlnaHQnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkKCcudmlldy5zZWN0aW9uLWZvb3RlcicpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgJHByZXYgPSAkdGhpcy5wcmV2QWxsKCcudmlldycpLmZpcnN0KCkuY2hpbGRyZW4oJy5mZycpO1xuXHRcdFx0aWYoJHByZXYubGVuZ3RoPjAgJiYgZ29vZENvbG9yKCRwcmV2KSl7XG5cdFx0XHRcdCR0aGlzLmNoaWxkcmVuKCcuZmcnKS5hZGRDbGFzcygnc2tldy10b3AtcmlnaHQnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkdmlld3MuZmluZCgnLmZnJykuZmlsdGVyKCcuc2tldy10b3AtcmlnaHQsIC5za2V3LXRvcC1sZWZ0LCAuc2tldy1ib3R0b20tbGVmdCwgLnNrZXctYm90dG9tLXJpZ2h0JykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0dmFyICRjb250ZW50ID0gJCh0aGlzKTtcblx0XHRcdHZhciAkdmlldyA9ICRjb250ZW50LnBhcmVudCgpO1xuXHRcdFx0aWYoJGNvbnRlbnQuaGFzQ2xhc3MoJ3NrZXctdG9wLXJpZ2h0JykgfHwgJGNvbnRlbnQuaGFzQ2xhc3MoJ3NrZXctdG9wLWxlZnQnKSl7XG5cdFx0XHRcdHZhciAkcHJldiA9ICR2aWV3LnByZXZBbGwoJy52aWV3JykuZmlyc3QoKS5jaGlsZHJlbignLmZnJyk7XG5cdFx0XHRcdGlmKCRwcmV2Lmxlbmd0aD4wICYmIGdvb2RDb2xvcigkcHJldikpe1xuXHRcdFx0XHRcdHZhciB0eXBlID0gJGNvbnRlbnQuaGFzQ2xhc3MoJ3NrZXctdG9wLXJpZ2h0JykgPyAxIDogMjtcblx0XHRcdFx0XHQkKCc8ZGl2IGNsYXNzPVwic2tldyBza2V3LXRvcC0nKyh0eXBlID09PSAxID8gJ3JpZ2h0JyA6ICdsZWZ0JykrJ1wiPjwvZGl2PicpLmFwcGVuZFRvKCRjb250ZW50KS5jc3Moe1xuXHRcdFx0XHRcdFx0cG9zaXRpb246IFwiYWJzb2x1dGVcIixcblx0XHRcdFx0XHRcdHRvcDogXCIwcHhcIixcblx0XHRcdFx0XHRcdHdpZHRoOiBcIjBweFwiLFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiBcIjBweFwiLFxuXHRcdFx0XHRcdFx0XCJib3JkZXItdG9wLXdpZHRoXCI6IHR5cGUgPT09IDIgPyAoc2tld0grXCJweFwiKSA6IFwiMHB4XCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci1yaWdodC13aWR0aFwiOiBcIjI4ODBweFwiLFxuXHRcdFx0XHRcdFx0XCJib3JkZXItYm90dG9tLXdpZHRoXCI6IHR5cGUgPT09IDEgPyAoc2tld0grXCJweFwiKSA6IFwiMHB4XCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci1sZWZ0LXdpZHRoXCI6IFwiMHB4XCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci1zdHlsZVwiOiBcInNvbGlkIHNvbGlkIHNvbGlkIGRhc2hlZFwiLFxuXHRcdFx0XHRcdFx0XCJib3JkZXItYm90dG9tLWNvbG9yXCI6IFwidHJhbnNwYXJlbnRcIixcblx0XHRcdFx0XHRcdFwiYm9yZGVyLWxlZnQtY29sb3JcIjogIFwidHJhbnNwYXJlbnRcIlxuXHRcdFx0XHRcdH0pLmFkZENsYXNzKGdldENvbG9yQ2xhc3MoJHByZXYpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoJGNvbnRlbnQuaGFzQ2xhc3MoJ3NrZXctYm90dG9tLWxlZnQnKSB8fCAkY29udGVudC5oYXNDbGFzcygnc2tldy1ib3R0b20tcmlnaHQnKSl7XG5cdFx0XHRcdHZhciAkbmV4dCA9ICR2aWV3Lm5leHRBbGwoJy52aWV3JykuZmlyc3QoKS5jaGlsZHJlbignLmZnJyk7XG5cdFx0XHRcdGlmKCRuZXh0Lmxlbmd0aD4wICYmIGdvb2RDb2xvcigkbmV4dCkpe1xuXHRcdFx0XHRcdHZhciB0eXBlID0gJGNvbnRlbnQuaGFzQ2xhc3MoJ3NrZXctYm90dG9tLWxlZnQnKSA/IDEgOiAyO1xuXHRcdFx0XHRcdCQoJzxkaXYgY2xhc3M9XCJza2V3IHNrZXctYm90dG9tLScrKHR5cGUgPT09IDEgPyAnbGVmdCcgOiAncmlnaHQnKSsnXCI+PC9kaXY+JykuYXBwZW5kVG8oJGNvbnRlbnQpLmNzcyh7XG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuXHRcdFx0XHRcdFx0Ym90dG9tOiBcIjBweFwiLFxuXHRcdFx0XHRcdFx0d2lkdGg6IFwiMHB4XCIsXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IFwiMHB4XCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci10b3Atd2lkdGhcIjogdHlwZSA9PT0gMSA/IChza2V3SCtcInB4XCIpIDogXCIwcHhcIixcblx0XHRcdFx0XHRcdFwiYm9yZGVyLXJpZ2h0LXdpZHRoXCI6IFwiMHB4XCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci1ib3R0b20td2lkdGhcIjogdHlwZSA9PT0gMiA/IChza2V3SCtcInB4XCIpIDogXCIwcHhcIixcblx0XHRcdFx0XHRcdFwiYm9yZGVyLWxlZnQtd2lkdGhcIjogXCIyODgwcHhcIixcblx0XHRcdFx0XHRcdFwiYm9yZGVyLXN0eWxlXCI6IFwic29saWQgZGFzaGVkIHNvbGlkIHNvbGlkXCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlci10b3AtY29sb3JcIjogXCJ0cmFuc3BhcmVudFwiLFxuXHRcdFx0XHRcdFx0XCJib3JkZXItcmlnaHQtY29sb3JcIjogXCJ0cmFuc3BhcmVudFwiXG5cdFx0XHRcdFx0fSkuYWRkQ2xhc3MoZ2V0Q29sb3JDbGFzcygkbmV4dCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Y2FsbGJhY2soKTtcblx0XHRmdW5jdGlvbiBnZXRDb2xvckNsYXNzKCRlbCl7XG5cdFx0XHRmb3IodmFyIGk9MDsgaTx0aGVtZXMuY29sb3JzOyBpKyspe1xuXHRcdFx0XHR2YXIgY29sb3JDbGFzcyA9ICdjb2xvcnMtJytTdHJpbmcuZnJvbUNoYXJDb2RlKDY1K2kpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdGlmKCRlbC5oYXNDbGFzcyhjb2xvckNsYXNzKSl7XG5cdFx0XHRcdFx0cmV0dXJuIGNvbG9yQ2xhc3M7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHRoaXMudW5nYXRlZCA9IGZ1bmN0aW9uKCl7XG5cdFx0JCgnLndyYXBwZXItY29udGVudCwgLnZpZXcnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgJGJnID0gJCh0aGlzKS5jaGlsZHJlbignLmJnJyk7XG5cdFx0XHRpZigkYmcubGVuZ3RoID4gMSkgc2xpZGVTaG93LnJ1bigkYmcpO1xuXHRcdH0pO1xuXHR9XG5cdHRoaXMudGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0JGJhY2dyb3VuZHMuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdHZhciBjZmcgPSAkdGhpcy5kYXRhKCk7XG5cdFx0XHR2YXIgb3BhLCB4ciwgeXIsIG9yO1xuXHRcdFx0aWYoY2ZnLnNzT3BhY2l0eSAhPT0gdW5kZWZpbmVkKXtcblx0XHRcdFx0b3BhID0gY2ZnLnNzT3BhY2l0eTtcblx0XHRcdFx0eHIgPSBjZmcuc3NPcmlnLnhyO1xuXHRcdFx0XHR5ciA9IGNmZy5zc09yaWcueXI7XG5cdFx0XHRcdG9yID0gY2ZnLnNzT3JpZy5vcjtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRvcGEgPSAxO1xuXHRcdFx0XHR4ciA9IDE7XG5cdFx0XHRcdHlyID0gMTtcblx0XHRcdFx0b3IgPSAnY2VudGVyIGNlbnRlcic7XG5cdFx0XHR9XG5cdFx0XHR2YXIgeCA9IGNmZy5ub3JtYWxYICsgKGNmZy56b29tWERlbHRhICogeHIpO1xuXHRcdFx0dmFyIHkgPSBjZmcubm9ybWFsWSArIChjZmcuem9vbVlEZWx0YSAqIHlyKSArIChjZmcucGFyYWxsYXhZICE9PSB1bmRlZmluZWQgPyBjZmcucGFyYWxsYXhZIDogMCk7XG5cdFx0XHR2YXIgc2MgPSBjZmcubm9ybWFsU2NhbGUgKiAoY2ZnLnNzU2NhbGUgIT09IHVuZGVmaW5lZCA/IGNmZy5zc1NjYWxlIDogMSk7XG5cdFx0XHRpZihNb2Rlcm5penIuY3NzdHJhbnNmb3JtczNkICYmIGFwcFNoYXJlLmZvcmNlM0Qpe1xuXHRcdFx0XHQkdGhpcy5jc3Moe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKCcreCsncHgsICcreSsncHgsIDBweCkgc2NhbGUoJytzYysnLCAnK3NjKycpJywgb3BhY2l0eTogb3BhLCAndHJhbnNmb3JtLW9yaWdpbic6IG9yKycgMHB4J30pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdCR0aGlzLmNzcyh7dHJhbnNmb3JtOiAndHJhbnNsYXRlKCcreCsncHgsICcreSsncHgpIHNjYWxlKCcrc2MrJywgJytzYysnKScsIG9wYWNpdHk6IG9wYSwgJ3RyYW5zZm9ybS1vcmlnaW4nOiBvcn0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHRoaXMuYnVpbGRTaXplcyA9IGZ1bmN0aW9uKHNjcmlwdCl7XG5cdFx0dmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cdFx0dmFyIHdoID0gJHdpbmRvdy5oZWlnaHQoKTtcblx0XHR2YXIgd3cgPSAkd2luZG93LndpZHRoKCk7XG5cdFx0dmFyICR0bmF2ID0gJCgnI3RvcC1uYXY6dmlzaWJsZScpO1xuXHRcdHZhciBzaCA9IGlzRGVjb3JCID8gd2ggOiAod2ggLSAoJHRuYXYubGVuZ3RoID4gMCA/IHNjcmlwdC50b3BOYXYuc3RhdGUySCA6IDApKTtcblx0XHR2YXIgJGJib3JkID0gJCgnLnBhZ2UtYm9yZGVyLmJvdHRvbTp2aXNpYmxlJyk7XG5cdFx0dmFyIGJvcmRlckggPSAkYmJvcmQubGVuZ3RoID4gMCA/ICRiYm9yZC5oZWlnaHQoKSA6IDA7XG5cdFx0JCgnLmZ1bGwtc2l6ZSwgLmhhbGYtc2l6ZSwgLm9uZS10aGlyZC1zaXplJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgbWluUGFkZGluZ1RvcCA9IHBhcnNlSW50KCR0aGlzLmNzcyh7XG5cdFx0XHRcdCdwYWRkaW5nLXRvcCc6ICcnLFxuXHRcdFx0fSkuY3NzKCdwYWRkaW5nLXRvcCcpLnJlcGxhY2UoJ3B4JywgJycpKTtcblx0XHRcdHZhciBtaW5QYWRkaW5nQm90dG9tID0gcGFyc2VJbnQoJHRoaXMuY3NzKHtcblx0XHRcdFx0J3BhZGRpbmctYm90dG9tJzogJycsXG5cdFx0XHR9KS5jc3MoJ3BhZGRpbmctYm90dG9tJykucmVwbGFjZSgncHgnLCAnJykpO1xuXHRcdFx0dmFyIG1pbkZ1bGxIID0gaXNEZWNvckIgPyBzaCA6IChzaCAtICgkYmJvcmQubGVuZ3RoID4gMCA/IGJvcmRlckggOiAwKSk7XG5cdFx0XHR2YXIgbWluSGFsZkggPSBNYXRoLmNlaWwobWluRnVsbEggLyAyKTtcblx0XHRcdHZhciBtaW4xM0ggPSBNYXRoLmNlaWwobWluRnVsbEggLyAzKTtcblx0XHRcdHZhciBtaW4gPSAkdGhpcy5oYXNDbGFzcygnZnVsbC1zaXplJykgPyBtaW5GdWxsSCA6ICgkdGhpcy5oYXNDbGFzcygnaGFsZi1zaXplJykgPyBtaW5IYWxmSCA6IG1pbjEzSCk7XG5cdFx0XHQkdGhpcy5jc3Moe1xuXHRcdFx0XHQncGFkZGluZy10b3AnOiBtaW5QYWRkaW5nVG9wICsgJ3B4Jyxcblx0XHRcdFx0J3BhZGRpbmctYm90dG9tJzogbWluUGFkZGluZ0JvdHRvbSArICdweCdcblx0XHRcdH0pO1xuXHRcdFx0aWYoJHRoaXMuaGFzQ2xhc3MoJ3N0cmV0Y2gtaGVpZ2h0JykgfHwgJHRoaXMuaGFzQ2xhc3MoJ3N0cmV0Y2gtZnVsbC1oZWlnaHQnKSl7XG5cdFx0XHRcdCR0aGlzLmNzcyh7aGVpZ2h0OiAnJ30pO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHRoaXNIID0gJHRoaXMuaGVpZ2h0KCk7XG5cdFx0XHRpZiAodGhpc0ggPCBtaW4pIHtcblx0XHRcdFx0dmFyIGRlbHRhID0gbWluIC0gdGhpc0ggLSBtaW5QYWRkaW5nVG9wIC0gbWluUGFkZGluZ0JvdHRvbTtcblx0XHRcdFx0aWYoZGVsdGE8MCl7XG5cdFx0XHRcdFx0ZGVsdGE9MDtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgdG9wUGx1cyA9IE1hdGgucm91bmQoZGVsdGEgLyAyKTtcblx0XHRcdFx0dmFyIGJvdHRvbVBsdXMgPSBkZWx0YSAtIHRvcFBsdXM7XG5cdFx0XHRcdHZhciBuZXdQYWRkaW5nVG9wID0gbWluUGFkZGluZ1RvcCArIHRvcFBsdXM7XG5cdFx0XHRcdHZhciBuZXdQYWRkaW5nQm90dG9tID0gbWluUGFkZGluZ0JvdHRvbSArIGJvdHRvbVBsdXM7XG5cdFx0XHRcdCR0aGlzLmNzcyh7XG5cdFx0XHRcdFx0J3BhZGRpbmctdG9wJzogbmV3UGFkZGluZ1RvcCArICdweCcsXG5cdFx0XHRcdFx0J3BhZGRpbmctYm90dG9tJzogbmV3UGFkZGluZ0JvdHRvbSArICdweCdcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JCgnLnN0cmV0Y2gtaGVpZ2h0JykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdHZhciAkcGFyID0gJHRoaXMucGFyZW50KCk7XG5cdFx0XHR2YXIgJHN0cnMgPSAkcGFyLmZpbmQoJy5zdHJldGNoLWhlaWdodCcpO1xuXHRcdFx0JHN0cnMuY3NzKCdoZWlnaHQnLCAnJyk7XG5cdFx0XHRpZigkdGhpcy5vdXRlcldpZHRoKCk8JHBhci5pbm5lcldpZHRoKCkpe1xuXHRcdFx0XHQkc3Rycy5jc3MoJ2hlaWdodCcsICRwYXIuaW5uZXJIZWlnaHQoKSsncHgnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkKCcuc3RyZXRjaC1mdWxsLWhlaWdodCcpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgJHBhciA9ICR0aGlzLnBhcmVudCgpO1xuXHRcdFx0dmFyICRzdHJzID0gJHBhci5maW5kKCcuc3RyZXRjaC1mdWxsLWhlaWdodCcpO1xuXHRcdFx0JHN0cnMuY3NzKCdoZWlnaHQnLCAnJyk7XG5cdFx0XHRpZigkdGhpcy5vdXRlcldpZHRoKCk8JHBhci5pbm5lcldpZHRoKCkpe1xuXHRcdFx0XHR2YXIgcGFySCA9ICRwYXIuaW5uZXJIZWlnaHQoKTtcblx0XHRcdFx0dmFyIHN0cnNIID0gd2ggPCBwYXJIID8gcGFySCA6IHdoO1xuXHRcdFx0XHQkc3Rycy5jc3MoJ2hlaWdodCcsIHN0cnNIKydweCcpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCR2aWV3cy5lYWNoKGZ1bmN0aW9uKGkpe1xuXHRcdFx0dmFyICR2aWV3ID0gJCh0aGlzKTtcblx0XHRcdHZhciAkY29udGVudCA9ICR2aWV3LmZpbmQoJy5mZycpO1xuXHRcdFx0dmFyICRza2V3VG9wID0gJGNvbnRlbnQuZmluZCgnLnNrZXcuc2tldy10b3AtcmlnaHQsIC5za2V3LnNrZXctdG9wLWxlZnQnKTtcblx0XHRcdHZhciAkc2tld0JvdHRvbSA9ICRjb250ZW50LmZpbmQoJy5za2V3LnNrZXctYm90dG9tLWxlZnQsIC5za2V3LnNrZXctYm90dG9tLXJpZ2h0Jyk7XG5cdFx0XHR2YXIgY29udGVudFdQeCA9ICRjb250ZW50LndpZHRoKCkrXCJweFwiO1xuXHRcdFx0JHNrZXdCb3R0b20uY3NzKHtcblx0XHRcdFx0XCJib3JkZXItbGVmdC13aWR0aFwiOiBjb250ZW50V1B4XG5cdFx0XHR9KTtcblx0XHRcdCRza2V3VG9wLmNzcyh7XG5cdFx0XHRcdFwiYm9yZGVyLXJpZ2h0LXdpZHRoXCI6IGNvbnRlbnRXUHhcblx0XHRcdH0pO1xuXHRcdFx0dmFyIHZpZXdIID0gJHZpZXcuaGVpZ2h0KCk7XG5cdFx0XHR2YXIgdmlld1cgPSAkdmlldy53aWR0aCgpO1xuXHRcdFx0dmFyIHRhcmdldEggPSAoZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIHZpZXdPZmZzZXQxID0gLTEgKiB2aWV3SDtcblx0XHRcdFx0dmFyIHZpZXdPZmZzZXQyID0gMDtcblx0XHRcdFx0dmFyIHZpZXdPZmZzZXQzID0gd2ggLSB2aWV3SDtcblx0XHRcdFx0dmFyIHZpZXdPZmZzZXQ0ID0gd2g7XG5cdFx0XHRcdHZhciBtYXJnMSA9IGFwcFNoYXJlLnBhcmFsbGF4TWFyZ2luKHNjcmlwdCwgaSwgdmlld09mZnNldDEpO1xuXHRcdFx0XHR2YXIgbWFyZzIgPSBhcHBTaGFyZS5wYXJhbGxheE1hcmdpbihzY3JpcHQsIGksIHZpZXdPZmZzZXQyKTtcblx0XHRcdFx0dmFyIG1hcmczID0gYXBwU2hhcmUucGFyYWxsYXhNYXJnaW4oc2NyaXB0LCBpLCB2aWV3T2Zmc2V0Myk7XG5cdFx0XHRcdHZhciBtYXJnNCA9IGFwcFNoYXJlLnBhcmFsbGF4TWFyZ2luKHNjcmlwdCwgaSwgdmlld09mZnNldDQpO1xuXHRcdFx0XHR2YXIgdG9wRGVsdGEgPSBmdW5jdGlvbih2aWV3T2Zmc2V0LCBtYXJnKXtcblx0XHRcdFx0XHRyZXR1cm4gbWFyZyArICh2aWV3T2Zmc2V0ID4gMCA/IDAgOiB2aWV3T2Zmc2V0KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIGJvdHRvbURlbHRhID0gZnVuY3Rpb24odmlld09mZnNldCwgbWFyZyl7XG5cdFx0XHRcdFx0dmFyIGJvdHRvbU9mZnNldCA9IHZpZXdPZmZzZXQgKyB2aWV3SDtcblx0XHRcdFx0XHRyZXR1cm4gLW1hcmcgLSAoYm90dG9tT2Zmc2V0IDwgd2ggPyAwIDogYm90dG9tT2Zmc2V0IC0gd2gpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgZGVsdGEgPSAwO1xuXHRcdFx0XHR2YXIgY3VyRGVsdGE7XG5cdFx0XHRcdGN1ckRlbHRhID0gdG9wRGVsdGEodmlld09mZnNldDEsIG1hcmcxKTsgaWYoY3VyRGVsdGEgPiBkZWx0YSkgZGVsdGEgPSBjdXJEZWx0YTtcblx0XHRcdFx0Y3VyRGVsdGEgPSB0b3BEZWx0YSh2aWV3T2Zmc2V0MiwgbWFyZzIpOyBpZihjdXJEZWx0YSA+IGRlbHRhKSBkZWx0YSA9IGN1ckRlbHRhO1xuXHRcdFx0XHRjdXJEZWx0YSA9IHRvcERlbHRhKHZpZXdPZmZzZXQzLCBtYXJnMyk7IGlmKGN1ckRlbHRhID4gZGVsdGEpIGRlbHRhID0gY3VyRGVsdGE7XG5cdFx0XHRcdGN1ckRlbHRhID0gdG9wRGVsdGEodmlld09mZnNldDQsIG1hcmc0KTsgaWYoY3VyRGVsdGEgPiBkZWx0YSkgZGVsdGEgPSBjdXJEZWx0YTtcblx0XHRcdFx0Y3VyRGVsdGEgPSBib3R0b21EZWx0YSh2aWV3T2Zmc2V0MSwgbWFyZzEpOyBpZihjdXJEZWx0YSA+IGRlbHRhKSBkZWx0YSA9IGN1ckRlbHRhO1xuXHRcdFx0XHRjdXJEZWx0YSA9IGJvdHRvbURlbHRhKHZpZXdPZmZzZXQyLCBtYXJnMik7IGlmKGN1ckRlbHRhID4gZGVsdGEpIGRlbHRhID0gY3VyRGVsdGE7XG5cdFx0XHRcdGN1ckRlbHRhID0gYm90dG9tRGVsdGEodmlld09mZnNldDMsIG1hcmczKTsgaWYoY3VyRGVsdGEgPiBkZWx0YSkgZGVsdGEgPSBjdXJEZWx0YTtcblx0XHRcdFx0Y3VyRGVsdGEgPSBib3R0b21EZWx0YSh2aWV3T2Zmc2V0NCwgbWFyZzQpOyBpZihjdXJEZWx0YSA+IGRlbHRhKSBkZWx0YSA9IGN1ckRlbHRhO1xuXHRcdFx0XHRyZXR1cm4gdmlld0ggKyAoMiAqIGRlbHRhKTtcblx0XHRcdH0pKCk7XG5cdFx0XHQkdmlldy5jaGlsZHJlbignaW1nLmJnJykuZWFjaChmdW5jdGlvbigpeyBcblx0XHRcdFx0YmdTaXplKCQodGhpcyksIHRhcmdldEgsIHZpZXdXLCB2aWV3SCk7XG5cdFx0XHR9KTtcblx0XHRcdCR2aWV3LmRhdGEoJ3Bvc2l0aW9uJywgJHZpZXcub2Zmc2V0KCkudG9wKTtcblx0XHR9KTtcblx0XHQkKCcudmlldycpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHQkdGhpcy5kYXRhKCdwb3NpdGlvbicsICR0aGlzLm9mZnNldCgpLnRvcCk7XG5cdFx0fSk7XG5cdFx0JCgnLnZpZXc+LmZnJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdCR0aGlzLmRhdGEoJ3Bvc2l0aW9uJywgJHRoaXMub2Zmc2V0KCkudG9wKTtcblx0XHR9KTtcblx0XHQkKCcud3JhcHBlci1jb250ZW50JykuY2hpbGRyZW4oJ2ltZy5iZycpLmVhY2goZnVuY3Rpb24oKXsgXG5cdFx0XHRiZ1NpemUoJCh0aGlzKSwgd2gsIHd3LCB3aCk7XG5cdFx0fSk7XG5cdFx0dmFyICRsYXN0ID0gJCgnLng0MC13aWRnZXQsIC5mb290ZXItYm90dG9tJykubGFzdCgpO1xuXHRcdGlmKCRsYXN0Lmxlbmd0aCA+IDApe1xuXHRcdFx0JGxhc3QuY3NzKCdwYWRkaW5nLWJvdHRvbScsICAnJyk7XG5cdFx0XHR2YXIgY29tcFdyYXBwZXJIID0gcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSgkKCcud3JhcHBlci1zaXRlJylbMF0sIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJoZWlnaHRcIikucmVwbGFjZSgncHgnLCcnKSk7XG5cdFx0XHRpZighaXNOYU4oY29tcFdyYXBwZXJIKSl7XG5cdFx0XHRcdHZhciBkaWcgPSBjb21wV3JhcHBlckggLSBNYXRoLmZsb29yKGNvbXBXcmFwcGVySCk7XG5cdFx0XHRcdGlmKGRpZyA+IDApe1xuXHRcdFx0XHRcdHZhciBjb21wTGFzdFAgPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCRsYXN0WzBdLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwicGFkZGluZy1ib3R0b21cIikucmVwbGFjZSgncHgnLCcnKSk7XG5cdFx0XHRcdFx0aWYoIWlzTmFOKGNvbXBMYXN0UCkpe1xuXHRcdFx0XHRcdFx0dmFyIG5ld1AgPSBjb21wTGFzdFAgKyAoMS1kaWcpO1xuXHRcdFx0XHRcdFx0JGxhc3QuY3NzKCdwYWRkaW5nLWJvdHRvbScsICBuZXdQICsgJ3B4Jyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGJnU2l6ZSgkYmcsIHRhcmdldEgsIHZpZXdXLCB2aWV3SCl7XG5cdFx0XHR2YXIgbmF0ID0gbmF0U2l6ZSgkYmcpO1xuXHRcdFx0dmFyIHNjYWxlID0gKHZpZXdXL3RhcmdldEggPiBuYXQudy9uYXQuaCkgPyB2aWV3VyAvIG5hdC53IDogdGFyZ2V0SCAvIG5hdC5oO1xuXHRcdFx0dmFyIG5ld1cgPSBuYXQudyAqIHNjYWxlO1xuXHRcdFx0dmFyIG5ld0ggPSBuYXQuaCAqIHNjYWxlO1xuXHRcdFx0dmFyIHpvb21YRGVsdGEgPSAobmV3VyAtIG5hdC53KS8yO1xuXHRcdFx0dmFyIHpvb21ZRGVsdGEgPSAobmV3SCAtIG5hdC5oKS8yO1xuXHRcdFx0dmFyIHggPSBNYXRoLnJvdW5kKCh2aWV3VyAtIG5ld1cpLzIpO1xuXHRcdFx0dmFyIHkgPSBNYXRoLnJvdW5kKCh2aWV3SCAtIG5ld0gpLzIpO1xuXHRcdFx0dmFyIGNmZyA9ICRiZy5kYXRhKCk7XG5cdFx0XHRjZmcubm9ybWFsU2NhbGUgPSBzY2FsZTtcblx0XHRcdGNmZy5ub3JtYWxYID0geDtcblx0XHRcdGNmZy5ub3JtYWxZID0geTtcblx0XHRcdGNmZy56b29tWERlbHRhID0gem9vbVhEZWx0YTtcblx0XHRcdGNmZy56b29tWURlbHRhID0gem9vbVlEZWx0YTtcblx0XHR9XG5cdH07XG5cdHRoaXMuY2hhbmdlU2VjdGlvbiA9IGZ1bmN0aW9uKHNjcmlwdCwgc2VjdGlvbkhhc2gpe1xuXHRcdHZhciAkc2VjdCA9ICQoc2VjdGlvbkhhc2gpO1xuXHRcdHZhciBjbHMgPSAkc2VjdC5kYXRhKCdib3JkZXItY29sb3JzJyk7XG5cdFx0aWYoY2xzKXtcblx0XHRcdCRib3JkLnJlbW92ZUNsYXNzKHRoZW1lcy5jb2xvckNsYXNzZXMpO1xuXHRcdFx0JGJvcmQuYWRkQ2xhc3MoY2xzKTtcblx0XHR9ZWxzZXtcblx0XHRcdGlmKCRib2R5Lmhhc0NsYXNzKCdzdGF0ZTInKSAmJiBzdGF0ZTJDb2xvcnMpe1xuXHRcdFx0XHQkYm9yZC5yZW1vdmVDbGFzcyh0aGVtZXMuY29sb3JDbGFzc2VzKTtcblx0XHRcdFx0JGJvcmQuYWRkQ2xhc3Moc3RhdGUyQ29sb3JzKTtcblx0XHRcdH1lbHNlIGlmKHN0YXRlMUNvbG9ycyl7XG5cdFx0XHRcdCRib3JkLnJlbW92ZUNsYXNzKHRoZW1lcy5jb2xvckNsYXNzZXMpO1xuXHRcdFx0XHQkYm9yZC5hZGRDbGFzcyhzdGF0ZTFDb2xvcnMpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0ZnVuY3Rpb24gbmF0U2l6ZSgkYmcpe1xuXHRcdHZhciBlbGVtID0gJGJnLmdldCgwKTtcblx0XHR2YXIgbmF0VywgbmF0SDtcblx0XHRpZihlbGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2ltZycpe1xuXHRcdFx0bmF0VyA9IGVsZW0ud2lkdGg7XG5cdFx0XHRuYXRIID0gZWxlbS5oZWlnaHQ7XG5cdFx0fWVsc2UgaWYoZWxlbS5uYXR1cmFsV2lkdGgpe1xuXHRcdFx0bmF0VyA9IGVsZW0ubmF0dXJhbFdpZHRoO1xuXHRcdFx0bmF0SCA9IGVsZW0ubmF0dXJhbEhlaWdodDtcblx0XHR9ZWxzZXtcblx0XHRcdHZhciBvcmlnID0gJGJnLndpZHRoKCk7XG5cdFx0XHQkYmcuY3NzKHt3aWR0aDogJycsIGhlaWdodDogJyd9KTtcblx0XHRcdG5hdFcgPSAkYmcud2lkdGgoKTtcblx0XHRcdG5hdEggPSAkYmcuaGVpZ2h0KCk7XG5cdFx0XHQkYmcuY3NzKHt3aWR0aDogb3JpZ30pO1xuXHRcdH1cblx0XHRyZXR1cm4ge3c6IG5hdFcsIGg6IG5hdEh9O1xuXHR9XG59KSgpOyIsIlwidXNlIHN0cmljdFwiOyB2YXIgJCA9IGpRdWVyeTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2Nyb2xsaW5nLCBzY3JpcHQpe1xuXHR2YXIgJHZpZXdzID0gJCgnLnZpZXcnKTtcblx0dmFyIGFwcFNoYXJlID0gcmVxdWlyZSgnLi9hcHAtc2hhcmUuanMnKTtcblx0dmFyIGlzUG9vckJyb3dzZXIgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ3Bvb3ItYnJvd3NlcicpO1xuXHR0aGlzLnNjcm9sbCA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYoaXNQb29yQnJvd3NlcikgcmV0dXJuO1xuXHRcdCR2aWV3cy5lYWNoKGZ1bmN0aW9uKGkpe1xuXHRcdFx0dmFyICR2aWV3ID0gJCh0aGlzKTtcblx0XHRcdHZhciB2aWV3UG9zID0gc2Nyb2xsaW5nLmNhbGNQb3NpdGlvbigkdmlldyk7XG5cdFx0XHRpZih2aWV3UG9zLnZpc2libGUpe1xuXHRcdFx0XHR2YXIgdmlld09mZnNldCA9IHZpZXdQb3MudG9wIC0gc2Nyb2xsaW5nLndpbmRvd1RvcFBvcztcblx0XHRcdFx0JHZpZXcuY2hpbGRyZW4oJy5iZzpub3QoLnN0YXRpYyknKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0dmFyIGNmZyA9ICQodGhpcykuZGF0YSgpO1xuXHRcdFx0XHRcdGNmZy5wYXJhbGxheFkgPSBhcHBTaGFyZS5wYXJhbGxheE1hcmdpbihzY3JpcHQsIGksIHZpZXdPZmZzZXQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5tb2R1bGUuZXhwb3J0cyA9IG5ldyAoZnVuY3Rpb24oKXtcblx0dmFyIG1lID0gdGhpcztcblx0dGhpcy5jb2xvcnMgPSAyNjtcblx0dGhpcy5jb2xvckNsYXNzZXMgPSAoZnVuY3Rpb24oKXtcblx0XHR2YXIgcmVzID0gJyc7XG5cdFx0Zm9yKHZhciBpPTA7IGk8bWUuY29sb3JzOyBpKyspe1xuXHRcdFx0dmFyIHNlcCA9IGkgPT09IDAgPyAnJyA6ICcgJztcblx0XHRcdHJlcyArPSBzZXAgKyAnY29sb3JzLScrU3RyaW5nLmZyb21DaGFyQ29kZSg2NStpKS50b0xvd2VyQ2FzZSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzO1xuXHR9KSgpO1xufSkoKTsiLCIvKipcbiAqIFN3aXBlciAzLjMuMFxuICogTW9zdCBtb2Rlcm4gbW9iaWxlIHRvdWNoIHNsaWRlciBhbmQgZnJhbWV3b3JrIHdpdGggaGFyZHdhcmUgYWNjZWxlcmF0ZWQgdHJhbnNpdGlvbnNcbiAqIFxuICogaHR0cDovL3d3dy5pZGFuZ2Vyby51cy9zd2lwZXIvXG4gKiBcbiAqIENvcHlyaWdodCAyMDE2LCBWbGFkaW1pciBLaGFybGFtcGlkaVxuICogVGhlIGlEYW5nZXJvLnVzXG4gKiBodHRwOi8vd3d3LmlkYW5nZXJvLnVzL1xuICogXG4gKiBMaWNlbnNlZCB1bmRlciBNSVRcbiAqIFxuICogUmVsZWFzZWQgb246IEphbnVhcnkgMTAsIDIwMTZcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyICQ7XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBTd2lwZXJcbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHZhciBTd2lwZXIgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBwYXJhbXMpIHtcbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFN3aXBlcikpIHJldHVybiBuZXcgU3dpcGVyKGNvbnRhaW5lciwgcGFyYW1zKTtcblxuICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcbiAgICAgICAgICAgIHRvdWNoRXZlbnRzVGFyZ2V0OiAnY29udGFpbmVyJyxcbiAgICAgICAgICAgIGluaXRpYWxTbGlkZTogMCxcbiAgICAgICAgICAgIHNwZWVkOiAzMDAsXG4gICAgICAgICAgICAvLyBhdXRvcGxheVxuICAgICAgICAgICAgYXV0b3BsYXk6IGZhbHNlLFxuICAgICAgICAgICAgYXV0b3BsYXlEaXNhYmxlT25JbnRlcmFjdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGF1dG9wbGF5U3RvcE9uTGFzdDogZmFsc2UsXG4gICAgICAgICAgICAvLyBUbyBzdXBwb3J0IGlPUydzIHN3aXBlLXRvLWdvLWJhY2sgZ2VzdHVyZSAod2hlbiBiZWluZyB1c2VkIGluLWFwcCwgd2l0aCBVSVdlYlZpZXcpLlxuICAgICAgICAgICAgaU9TRWRnZVN3aXBlRGV0ZWN0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgIGlPU0VkZ2VTd2lwZVRocmVzaG9sZDogMjAsXG4gICAgICAgICAgICAvLyBGcmVlIG1vZGVcbiAgICAgICAgICAgIGZyZWVNb2RlOiBmYWxzZSxcbiAgICAgICAgICAgIGZyZWVNb2RlTW9tZW50dW06IHRydWUsXG4gICAgICAgICAgICBmcmVlTW9kZU1vbWVudHVtUmF0aW86IDEsXG4gICAgICAgICAgICBmcmVlTW9kZU1vbWVudHVtQm91bmNlOiB0cnVlLFxuICAgICAgICAgICAgZnJlZU1vZGVNb21lbnR1bUJvdW5jZVJhdGlvOiAxLFxuICAgICAgICAgICAgZnJlZU1vZGVTdGlja3k6IGZhbHNlLFxuICAgICAgICAgICAgZnJlZU1vZGVNaW5pbXVtVmVsb2NpdHk6IDAuMDIsXG4gICAgICAgICAgICAvLyBBdXRvaGVpZ2h0XG4gICAgICAgICAgICBhdXRvSGVpZ2h0OiBmYWxzZSxcbiAgICAgICAgICAgIC8vIFNldCB3cmFwcGVyIHdpZHRoXG4gICAgICAgICAgICBzZXRXcmFwcGVyU2l6ZTogZmFsc2UsXG4gICAgICAgICAgICAvLyBWaXJ0dWFsIFRyYW5zbGF0ZVxuICAgICAgICAgICAgdmlydHVhbFRyYW5zbGF0ZTogZmFsc2UsXG4gICAgICAgICAgICAvLyBFZmZlY3RzXG4gICAgICAgICAgICBlZmZlY3Q6ICdzbGlkZScsIC8vICdzbGlkZScgb3IgJ2ZhZGUnIG9yICdjdWJlJyBvciAnY292ZXJmbG93JyBvciAnZmxpcCdcbiAgICAgICAgICAgIGNvdmVyZmxvdzoge1xuICAgICAgICAgICAgICAgIHJvdGF0ZTogNTAsXG4gICAgICAgICAgICAgICAgc3RyZXRjaDogMCxcbiAgICAgICAgICAgICAgICBkZXB0aDogMTAwLFxuICAgICAgICAgICAgICAgIG1vZGlmaWVyOiAxLFxuICAgICAgICAgICAgICAgIHNsaWRlU2hhZG93cyA6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmbGlwOiB7XG4gICAgICAgICAgICAgICAgc2xpZGVTaGFkb3dzIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsaW1pdFJvdGF0aW9uOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3ViZToge1xuICAgICAgICAgICAgICAgIHNsaWRlU2hhZG93czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaGFkb3c6IHRydWUsXG4gICAgICAgICAgICAgICAgc2hhZG93T2Zmc2V0OiAyMCxcbiAgICAgICAgICAgICAgICBzaGFkb3dTY2FsZTogMC45NFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhZGU6IHtcbiAgICAgICAgICAgICAgICBjcm9zc0ZhZGU6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gUGFyYWxsYXhcbiAgICAgICAgICAgIHBhcmFsbGF4OiBmYWxzZSxcbiAgICAgICAgICAgIC8vIFNjcm9sbGJhclxuICAgICAgICAgICAgc2Nyb2xsYmFyOiBudWxsLFxuICAgICAgICAgICAgc2Nyb2xsYmFySGlkZTogdHJ1ZSxcbiAgICAgICAgICAgIHNjcm9sbGJhckRyYWdnYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBzY3JvbGxiYXJTbmFwT25SZWxlYXNlOiBmYWxzZSxcbiAgICAgICAgICAgIC8vIEtleWJvYXJkIE1vdXNld2hlZWxcbiAgICAgICAgICAgIGtleWJvYXJkQ29udHJvbDogZmFsc2UsXG4gICAgICAgICAgICBtb3VzZXdoZWVsQ29udHJvbDogZmFsc2UsXG4gICAgICAgICAgICBtb3VzZXdoZWVsUmVsZWFzZU9uRWRnZXM6IGZhbHNlLFxuICAgICAgICAgICAgbW91c2V3aGVlbEludmVydDogZmFsc2UsXG4gICAgICAgICAgICBtb3VzZXdoZWVsRm9yY2VUb0F4aXM6IGZhbHNlLFxuICAgICAgICAgICAgbW91c2V3aGVlbFNlbnNpdGl2aXR5OiAxLFxuICAgICAgICAgICAgLy8gSGFzaCBOYXZpZ2F0aW9uXG4gICAgICAgICAgICBoYXNobmF2OiBmYWxzZSxcbiAgICAgICAgICAgIC8vIEJyZWFrcG9pbnRzXG4gICAgICAgICAgICBicmVha3BvaW50czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgLy8gU2xpZGVzIGdyaWRcbiAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMCxcbiAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDEsXG4gICAgICAgICAgICBzbGlkZXNQZXJDb2x1bW46IDEsXG4gICAgICAgICAgICBzbGlkZXNQZXJDb2x1bW5GaWxsOiAnY29sdW1uJyxcbiAgICAgICAgICAgIHNsaWRlc1Blckdyb3VwOiAxLFxuICAgICAgICAgICAgY2VudGVyZWRTbGlkZXM6IGZhbHNlLFxuICAgICAgICAgICAgc2xpZGVzT2Zmc2V0QmVmb3JlOiAwLCAvLyBpbiBweFxuICAgICAgICAgICAgc2xpZGVzT2Zmc2V0QWZ0ZXI6IDAsIC8vIGluIHB4XG4gICAgICAgICAgICAvLyBSb3VuZCBsZW5ndGhcbiAgICAgICAgICAgIHJvdW5kTGVuZ3RoczogZmFsc2UsXG4gICAgICAgICAgICAvLyBUb3VjaGVzXG4gICAgICAgICAgICB0b3VjaFJhdGlvOiAxLFxuICAgICAgICAgICAgdG91Y2hBbmdsZTogNDUsXG4gICAgICAgICAgICBzaW11bGF0ZVRvdWNoOiB0cnVlLFxuICAgICAgICAgICAgc2hvcnRTd2lwZXM6IHRydWUsXG4gICAgICAgICAgICBsb25nU3dpcGVzOiB0cnVlLFxuICAgICAgICAgICAgbG9uZ1N3aXBlc1JhdGlvOiAwLjUsXG4gICAgICAgICAgICBsb25nU3dpcGVzTXM6IDMwMCxcbiAgICAgICAgICAgIGZvbGxvd0ZpbmdlcjogdHJ1ZSxcbiAgICAgICAgICAgIG9ubHlFeHRlcm5hbDogZmFsc2UsXG4gICAgICAgICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgICAgICAgICB0b3VjaE1vdmVTdG9wUHJvcGFnYXRpb246IHRydWUsXG4gICAgICAgICAgICAvLyBQYWdpbmF0aW9uXG4gICAgICAgICAgICBwYWdpbmF0aW9uOiBudWxsLFxuICAgICAgICAgICAgcGFnaW5hdGlvbkVsZW1lbnQ6ICdzcGFuJyxcbiAgICAgICAgICAgIHBhZ2luYXRpb25DbGlja2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgcGFnaW5hdGlvbkhpZGU6IGZhbHNlLFxuICAgICAgICAgICAgcGFnaW5hdGlvbkJ1bGxldFJlbmRlcjogbnVsbCxcbiAgICAgICAgICAgIHBhZ2luYXRpb25Qcm9ncmVzc1JlbmRlcjogbnVsbCxcbiAgICAgICAgICAgIHBhZ2luYXRpb25GcmFjdGlvblJlbmRlcjogbnVsbCxcbiAgICAgICAgICAgIHBhZ2luYXRpb25DdXN0b21SZW5kZXI6IG51bGwsXG4gICAgICAgICAgICBwYWdpbmF0aW9uVHlwZTogJ2J1bGxldHMnLCAvLyAnYnVsbGV0cycgb3IgJ3Byb2dyZXNzJyBvciAnZnJhY3Rpb24nIG9yICdjdXN0b20nXG4gICAgICAgICAgICAvLyBSZXNpc3RhbmNlXG4gICAgICAgICAgICByZXNpc3RhbmNlOiB0cnVlLFxuICAgICAgICAgICAgcmVzaXN0YW5jZVJhdGlvOiAwLjg1LFxuICAgICAgICAgICAgLy8gTmV4dC9wcmV2IGJ1dHRvbnNcbiAgICAgICAgICAgIG5leHRCdXR0b246IG51bGwsXG4gICAgICAgICAgICBwcmV2QnV0dG9uOiBudWxsLFxuICAgICAgICAgICAgLy8gUHJvZ3Jlc3NcbiAgICAgICAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IGZhbHNlLFxuICAgICAgICAgICAgd2F0Y2hTbGlkZXNWaXNpYmlsaXR5OiBmYWxzZSxcbiAgICAgICAgICAgIC8vIEN1cnNvclxuICAgICAgICAgICAgZ3JhYkN1cnNvcjogZmFsc2UsXG4gICAgICAgICAgICAvLyBDbGlja3NcbiAgICAgICAgICAgIHByZXZlbnRDbGlja3M6IHRydWUsXG4gICAgICAgICAgICBwcmV2ZW50Q2xpY2tzUHJvcGFnYXRpb246IHRydWUsXG4gICAgICAgICAgICBzbGlkZVRvQ2xpY2tlZFNsaWRlOiBmYWxzZSxcbiAgICAgICAgICAgIC8vIExhenkgTG9hZGluZ1xuICAgICAgICAgICAgbGF6eUxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgbGF6eUxvYWRpbmdJblByZXZOZXh0OiBmYWxzZSxcbiAgICAgICAgICAgIGxhenlMb2FkaW5nSW5QcmV2TmV4dEFtb3VudDogMSxcbiAgICAgICAgICAgIGxhenlMb2FkaW5nT25UcmFuc2l0aW9uU3RhcnQ6IGZhbHNlLFxuICAgICAgICAgICAgLy8gSW1hZ2VzXG4gICAgICAgICAgICBwcmVsb2FkSW1hZ2VzOiB0cnVlLFxuICAgICAgICAgICAgdXBkYXRlT25JbWFnZXNSZWFkeTogdHJ1ZSxcbiAgICAgICAgICAgIC8vIGxvb3BcbiAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICAgICAgbG9vcEFkZGl0aW9uYWxTbGlkZXM6IDAsXG4gICAgICAgICAgICBsb29wZWRTbGlkZXM6IG51bGwsXG4gICAgICAgICAgICAvLyBDb250cm9sXG4gICAgICAgICAgICBjb250cm9sOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBjb250cm9sSW52ZXJzZTogZmFsc2UsXG4gICAgICAgICAgICBjb250cm9sQnk6ICdzbGlkZScsIC8vb3IgJ2NvbnRhaW5lcidcbiAgICAgICAgICAgIC8vIFN3aXBpbmcvbm8gc3dpcGluZ1xuICAgICAgICAgICAgYWxsb3dTd2lwZVRvUHJldjogdHJ1ZSxcbiAgICAgICAgICAgIGFsbG93U3dpcGVUb05leHQ6IHRydWUsXG4gICAgICAgICAgICBzd2lwZUhhbmRsZXI6IG51bGwsIC8vJy5zd2lwZS1oYW5kbGVyJyxcbiAgICAgICAgICAgIG5vU3dpcGluZzogdHJ1ZSxcbiAgICAgICAgICAgIG5vU3dpcGluZ0NsYXNzOiAnc3dpcGVyLW5vLXN3aXBpbmcnLFxuICAgICAgICAgICAgLy8gTlNcbiAgICAgICAgICAgIHNsaWRlQ2xhc3M6ICdzd2lwZXItc2xpZGUnLFxuICAgICAgICAgICAgc2xpZGVBY3RpdmVDbGFzczogJ3N3aXBlci1zbGlkZS1hY3RpdmUnLFxuICAgICAgICAgICAgc2xpZGVWaXNpYmxlQ2xhc3M6ICdzd2lwZXItc2xpZGUtdmlzaWJsZScsXG4gICAgICAgICAgICBzbGlkZUR1cGxpY2F0ZUNsYXNzOiAnc3dpcGVyLXNsaWRlLWR1cGxpY2F0ZScsXG4gICAgICAgICAgICBzbGlkZU5leHRDbGFzczogJ3N3aXBlci1zbGlkZS1uZXh0JyxcbiAgICAgICAgICAgIHNsaWRlUHJldkNsYXNzOiAnc3dpcGVyLXNsaWRlLXByZXYnLFxuICAgICAgICAgICAgd3JhcHBlckNsYXNzOiAnc3dpcGVyLXdyYXBwZXInLFxuICAgICAgICAgICAgYnVsbGV0Q2xhc3M6ICdzd2lwZXItcGFnaW5hdGlvbi1idWxsZXQnLFxuICAgICAgICAgICAgYnVsbGV0QWN0aXZlQ2xhc3M6ICdzd2lwZXItcGFnaW5hdGlvbi1idWxsZXQtYWN0aXZlJyxcbiAgICAgICAgICAgIGJ1dHRvbkRpc2FibGVkQ2xhc3M6ICdzd2lwZXItYnV0dG9uLWRpc2FibGVkJyxcbiAgICAgICAgICAgIHBhZ2luYXRpb25DdXJyZW50Q2xhc3M6ICdzd2lwZXItcGFnaW5hdGlvbi1jdXJyZW50JyxcbiAgICAgICAgICAgIHBhZ2luYXRpb25Ub3RhbENsYXNzOiAnc3dpcGVyLXBhZ2luYXRpb24tdG90YWwnLFxuICAgICAgICAgICAgcGFnaW5hdGlvbkhpZGRlbkNsYXNzOiAnc3dpcGVyLXBhZ2luYXRpb24taGlkZGVuJyxcbiAgICAgICAgICAgIHBhZ2luYXRpb25Qcm9ncmVzc2JhckNsYXNzOiAnc3dpcGVyLXBhZ2luYXRpb24tcHJvZ3Jlc3NiYXInLFxuICAgICAgICAgICAgLy8gT2JzZXJ2ZXJcbiAgICAgICAgICAgIG9ic2VydmVyOiBmYWxzZSxcbiAgICAgICAgICAgIG9ic2VydmVQYXJlbnRzOiBmYWxzZSxcbiAgICAgICAgICAgIC8vIEFjY2Vzc2liaWxpdHlcbiAgICAgICAgICAgIGExMXk6IGZhbHNlLFxuICAgICAgICAgICAgcHJldlNsaWRlTWVzc2FnZTogJ1ByZXZpb3VzIHNsaWRlJyxcbiAgICAgICAgICAgIG5leHRTbGlkZU1lc3NhZ2U6ICdOZXh0IHNsaWRlJyxcbiAgICAgICAgICAgIGZpcnN0U2xpZGVNZXNzYWdlOiAnVGhpcyBpcyB0aGUgZmlyc3Qgc2xpZGUnLFxuICAgICAgICAgICAgbGFzdFNsaWRlTWVzc2FnZTogJ1RoaXMgaXMgdGhlIGxhc3Qgc2xpZGUnLFxuICAgICAgICAgICAgcGFnaW5hdGlvbkJ1bGxldE1lc3NhZ2U6ICdHbyB0byBzbGlkZSB7e2luZGV4fX0nLFxuICAgICAgICAgICAgLy8gQ2FsbGJhY2tzXG4gICAgICAgICAgICBydW5DYWxsYmFja3NPbkluaXQ6IHRydWVcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBDYWxsYmFja3M6XG4gICAgICAgICAgICBvbkluaXQ6IGZ1bmN0aW9uIChzd2lwZXIpXG4gICAgICAgICAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uIChzd2lwZXIpXG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiAoc3dpcGVyLCBlKVxuICAgICAgICAgICAgb25UYXA6IGZ1bmN0aW9uIChzd2lwZXIsIGUpXG4gICAgICAgICAgICBvbkRvdWJsZVRhcDogZnVuY3Rpb24gKHN3aXBlciwgZSlcbiAgICAgICAgICAgIG9uU2xpZGVyTW92ZTogZnVuY3Rpb24gKHN3aXBlciwgZSlcbiAgICAgICAgICAgIG9uU2xpZGVDaGFuZ2VTdGFydDogZnVuY3Rpb24gKHN3aXBlcilcbiAgICAgICAgICAgIG9uU2xpZGVDaGFuZ2VFbmQ6IGZ1bmN0aW9uIChzd2lwZXIpXG4gICAgICAgICAgICBvblRyYW5zaXRpb25TdGFydDogZnVuY3Rpb24gKHN3aXBlcilcbiAgICAgICAgICAgIG9uVHJhbnNpdGlvbkVuZDogZnVuY3Rpb24gKHN3aXBlcilcbiAgICAgICAgICAgIG9uSW1hZ2VzUmVhZHk6IGZ1bmN0aW9uIChzd2lwZXIpXG4gICAgICAgICAgICBvblByb2dyZXNzOiBmdW5jdGlvbiAoc3dpcGVyLCBwcm9ncmVzcylcbiAgICAgICAgICAgIG9uVG91Y2hTdGFydDogZnVuY3Rpb24gKHN3aXBlciwgZSlcbiAgICAgICAgICAgIG9uVG91Y2hNb3ZlOiBmdW5jdGlvbiAoc3dpcGVyLCBlKVxuICAgICAgICAgICAgb25Ub3VjaE1vdmVPcHBvc2l0ZTogZnVuY3Rpb24gKHN3aXBlciwgZSlcbiAgICAgICAgICAgIG9uVG91Y2hFbmQ6IGZ1bmN0aW9uIChzd2lwZXIsIGUpXG4gICAgICAgICAgICBvblJlYWNoQmVnaW5uaW5nOiBmdW5jdGlvbiAoc3dpcGVyKVxuICAgICAgICAgICAgb25SZWFjaEVuZDogZnVuY3Rpb24gKHN3aXBlcilcbiAgICAgICAgICAgIG9uU2V0VHJhbnNpdGlvbjogZnVuY3Rpb24gKHN3aXBlciwgZHVyYXRpb24pXG4gICAgICAgICAgICBvblNldFRyYW5zbGF0ZTogZnVuY3Rpb24gKHN3aXBlciwgdHJhbnNsYXRlKVxuICAgICAgICAgICAgb25BdXRvcGxheVN0YXJ0OiBmdW5jdGlvbiAoc3dpcGVyKVxuICAgICAgICAgICAgb25BdXRvcGxheVN0b3A6IGZ1bmN0aW9uIChzd2lwZXIpLFxuICAgICAgICAgICAgb25MYXp5SW1hZ2VMb2FkOiBmdW5jdGlvbiAoc3dpcGVyLCBzbGlkZSwgaW1hZ2UpXG4gICAgICAgICAgICBvbkxhenlJbWFnZVJlYWR5OiBmdW5jdGlvbiAoc3dpcGVyLCBzbGlkZSwgaW1hZ2UpXG4gICAgICAgICAgICAqL1xuICAgICAgICBcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGluaXRpYWxWaXJ0dWFsVHJhbnNsYXRlID0gcGFyYW1zICYmIHBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlO1xuICAgICAgICBcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgICB2YXIgb3JpZ2luYWxQYXJhbXMgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgcGFyYW0gaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHBhcmFtc1twYXJhbV0gPT09ICdvYmplY3QnICYmIHBhcmFtc1twYXJhbV0gIT09IG51bGwgJiYgIShwYXJhbXNbcGFyYW1dLm5vZGVUeXBlIHx8IHBhcmFtc1twYXJhbV0gPT09IHdpbmRvdyB8fCBwYXJhbXNbcGFyYW1dID09PSBkb2N1bWVudCB8fCAodHlwZW9mIERvbTcgIT09ICd1bmRlZmluZWQnICYmIHBhcmFtc1twYXJhbV0gaW5zdGFuY2VvZiBEb203KSB8fCAodHlwZW9mIGpRdWVyeSAhPT0gJ3VuZGVmaW5lZCcgJiYgcGFyYW1zW3BhcmFtXSBpbnN0YW5jZW9mIGpRdWVyeSkpKSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQYXJhbXNbcGFyYW1dID0ge307XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgZGVlcFBhcmFtIGluIHBhcmFtc1twYXJhbV0pIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxQYXJhbXNbcGFyYW1dW2RlZXBQYXJhbV0gPSBwYXJhbXNbcGFyYW1dW2RlZXBQYXJhbV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQYXJhbXNbcGFyYW1dID0gcGFyYW1zW3BhcmFtXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBkZWYgaW4gZGVmYXVsdHMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGFyYW1zW2RlZl0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zW2RlZl0gPSBkZWZhdWx0c1tkZWZdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHBhcmFtc1tkZWZdID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGRlZXBEZWYgaW4gZGVmYXVsdHNbZGVmXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHBhcmFtc1tkZWZdW2RlZXBEZWZdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zW2RlZl1bZGVlcERlZl0gPSBkZWZhdWx0c1tkZWZdW2RlZXBEZWZdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBTd2lwZXJcbiAgICAgICAgdmFyIHMgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgLy8gUGFyYW1zXG4gICAgICAgIHMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICBzLm9yaWdpbmFsUGFyYW1zID0gb3JpZ2luYWxQYXJhbXM7XG4gICAgICAgIFxuICAgICAgICAvLyBDbGFzc25hbWVcbiAgICAgICAgcy5jbGFzc05hbWVzID0gW107XG4gICAgICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgIERvbSBMaWJyYXJ5IGFuZCBwbHVnaW5zXG4gICAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAgICAgaWYgKHR5cGVvZiAkICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgRG9tNyAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgJCA9IERvbTc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiAkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBEb203ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICQgPSB3aW5kb3cuRG9tNyB8fCB3aW5kb3cuWmVwdG8gfHwgd2luZG93LmpRdWVyeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICQgPSBEb203O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEkKSByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXhwb3J0IGl0IHRvIFN3aXBlciBpbnN0YW5jZVxuICAgICAgICBzLiQgPSAkO1xuICAgICAgICBcbiAgICAgICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgQnJlYWtwb2ludHNcbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBzLmN1cnJlbnRCcmVha3BvaW50ID0gdW5kZWZpbmVkO1xuICAgICAgICBzLmdldEFjdGl2ZUJyZWFrcG9pbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvL0dldCBicmVha3BvaW50IGZvciB3aW5kb3cgd2lkdGhcbiAgICAgICAgICAgIGlmICghcy5wYXJhbXMuYnJlYWtwb2ludHMpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHZhciBicmVha3BvaW50ID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgcG9pbnRzID0gW10sIHBvaW50O1xuICAgICAgICAgICAgZm9yICggcG9pbnQgaW4gcy5wYXJhbXMuYnJlYWtwb2ludHMgKSB7XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmJyZWFrcG9pbnRzLmhhc093blByb3BlcnR5KHBvaW50KSkge1xuICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChwb2ludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9pbnRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoYSwgMTApID4gcGFyc2VJbnQoYiwgMTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHBvaW50ID0gcG9pbnRzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChwb2ludCA+PSB3aW5kb3cuaW5uZXJXaWR0aCAmJiAhYnJlYWtwb2ludCkge1xuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50ID0gcG9pbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGJyZWFrcG9pbnQgfHwgJ21heCc7XG4gICAgICAgIH07XG4gICAgICAgIHMuc2V0QnJlYWtwb2ludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vU2V0IGJyZWFrcG9pbnQgZm9yIHdpbmRvdyB3aWR0aCBhbmQgdXBkYXRlIHBhcmFtZXRlcnNcbiAgICAgICAgICAgIHZhciBicmVha3BvaW50ID0gcy5nZXRBY3RpdmVCcmVha3BvaW50KCk7XG4gICAgICAgICAgICBpZiAoYnJlYWtwb2ludCAmJiBzLmN1cnJlbnRCcmVha3BvaW50ICE9PSBicmVha3BvaW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGJyZWFrUG9pbnRzUGFyYW1zID0gYnJlYWtwb2ludCBpbiBzLnBhcmFtcy5icmVha3BvaW50cyA/IHMucGFyYW1zLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdIDogcy5vcmlnaW5hbFBhcmFtcztcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgcGFyYW0gaW4gYnJlYWtQb2ludHNQYXJhbXMgKSB7XG4gICAgICAgICAgICAgICAgICAgIHMucGFyYW1zW3BhcmFtXSA9IGJyZWFrUG9pbnRzUGFyYW1zW3BhcmFtXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcy5jdXJyZW50QnJlYWtwb2ludCA9IGJyZWFrcG9pbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vIFNldCBicmVha3BvaW50IG9uIGxvYWRcbiAgICAgICAgaWYgKHMucGFyYW1zLmJyZWFrcG9pbnRzKSB7XG4gICAgICAgICAgICBzLnNldEJyZWFrcG9pbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgUHJlcGFyYXRpb24gLSBEZWZpbmUgQ29udGFpbmVyLCBXcmFwcGVyIGFuZCBQYWdpbmF0aW9uXG4gICAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAgICAgcy5jb250YWluZXIgPSAkKGNvbnRhaW5lcik7XG4gICAgICAgIGlmIChzLmNvbnRhaW5lci5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICAgICAgaWYgKHMuY29udGFpbmVyLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHMuY29udGFpbmVyLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG5ldyBTd2lwZXIodGhpcywgcGFyYW1zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBTYXZlIGluc3RhbmNlIGluIGNvbnRhaW5lciBIVE1MIEVsZW1lbnQgYW5kIGluIGRhdGFcbiAgICAgICAgcy5jb250YWluZXJbMF0uc3dpcGVyID0gcztcbiAgICAgICAgcy5jb250YWluZXIuZGF0YSgnc3dpcGVyJywgcyk7XG4gICAgICAgIFxuICAgICAgICBzLmNsYXNzTmFtZXMucHVzaCgnc3dpcGVyLWNvbnRhaW5lci0nICsgcy5wYXJhbXMuZGlyZWN0aW9uKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChzLnBhcmFtcy5mcmVlTW9kZSkge1xuICAgICAgICAgICAgcy5jbGFzc05hbWVzLnB1c2goJ3N3aXBlci1jb250YWluZXItZnJlZS1tb2RlJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzLnN1cHBvcnQuZmxleGJveCkge1xuICAgICAgICAgICAgcy5jbGFzc05hbWVzLnB1c2goJ3N3aXBlci1jb250YWluZXItbm8tZmxleGJveCcpO1xuICAgICAgICAgICAgcy5wYXJhbXMuc2xpZGVzUGVyQ29sdW1uID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocy5wYXJhbXMuYXV0b0hlaWdodCkge1xuICAgICAgICAgICAgcy5jbGFzc05hbWVzLnB1c2goJ3N3aXBlci1jb250YWluZXItYXV0b2hlaWdodCcpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEVuYWJsZSBzbGlkZXMgcHJvZ3Jlc3Mgd2hlbiByZXF1aXJlZFxuICAgICAgICBpZiAocy5wYXJhbXMucGFyYWxsYXggfHwgcy5wYXJhbXMud2F0Y2hTbGlkZXNWaXNpYmlsaXR5KSB7XG4gICAgICAgICAgICBzLnBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDb3ZlcmZsb3cgLyAzRFxuICAgICAgICBpZiAoWydjdWJlJywgJ2NvdmVyZmxvdycsICdmbGlwJ10uaW5kZXhPZihzLnBhcmFtcy5lZmZlY3QpID49IDApIHtcbiAgICAgICAgICAgIGlmIChzLnN1cHBvcnQudHJhbnNmb3JtczNkKSB7XG4gICAgICAgICAgICAgICAgcy5wYXJhbXMud2F0Y2hTbGlkZXNQcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcy5jbGFzc05hbWVzLnB1c2goJ3N3aXBlci1jb250YWluZXItM2QnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHMucGFyYW1zLmVmZmVjdCA9ICdzbGlkZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMucGFyYW1zLmVmZmVjdCAhPT0gJ3NsaWRlJykge1xuICAgICAgICAgICAgcy5jbGFzc05hbWVzLnB1c2goJ3N3aXBlci1jb250YWluZXItJyArIHMucGFyYW1zLmVmZmVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMucGFyYW1zLmVmZmVjdCA9PT0gJ2N1YmUnKSB7XG4gICAgICAgICAgICBzLnBhcmFtcy5yZXNpc3RhbmNlUmF0aW8gPSAwO1xuICAgICAgICAgICAgcy5wYXJhbXMuc2xpZGVzUGVyVmlldyA9IDE7XG4gICAgICAgICAgICBzLnBhcmFtcy5zbGlkZXNQZXJDb2x1bW4gPSAxO1xuICAgICAgICAgICAgcy5wYXJhbXMuc2xpZGVzUGVyR3JvdXAgPSAxO1xuICAgICAgICAgICAgcy5wYXJhbXMuY2VudGVyZWRTbGlkZXMgPSBmYWxzZTtcbiAgICAgICAgICAgIHMucGFyYW1zLnNwYWNlQmV0d2VlbiA9IDA7XG4gICAgICAgICAgICBzLnBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIHMucGFyYW1zLnNldFdyYXBwZXJTaXplID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMucGFyYW1zLmVmZmVjdCA9PT0gJ2ZhZGUnIHx8IHMucGFyYW1zLmVmZmVjdCA9PT0gJ2ZsaXAnKSB7XG4gICAgICAgICAgICBzLnBhcmFtcy5zbGlkZXNQZXJWaWV3ID0gMTtcbiAgICAgICAgICAgIHMucGFyYW1zLnNsaWRlc1BlckNvbHVtbiA9IDE7XG4gICAgICAgICAgICBzLnBhcmFtcy5zbGlkZXNQZXJHcm91cCA9IDE7XG4gICAgICAgICAgICBzLnBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgIHMucGFyYW1zLnNwYWNlQmV0d2VlbiA9IDA7XG4gICAgICAgICAgICBzLnBhcmFtcy5zZXRXcmFwcGVyU2l6ZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbml0aWFsVmlydHVhbFRyYW5zbGF0ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBzLnBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gR3JhYiBDdXJzb3JcbiAgICAgICAgaWYgKHMucGFyYW1zLmdyYWJDdXJzb3IgJiYgcy5zdXBwb3J0LnRvdWNoKSB7XG4gICAgICAgICAgICBzLnBhcmFtcy5ncmFiQ3Vyc29yID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFdyYXBwZXJcbiAgICAgICAgcy53cmFwcGVyID0gcy5jb250YWluZXIuY2hpbGRyZW4oJy4nICsgcy5wYXJhbXMud3JhcHBlckNsYXNzKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFBhZ2luYXRpb25cbiAgICAgICAgaWYgKHMucGFyYW1zLnBhZ2luYXRpb24pIHtcbiAgICAgICAgICAgIHMucGFnaW5hdGlvbkNvbnRhaW5lciA9ICQocy5wYXJhbXMucGFnaW5hdGlvbik7XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMucGFnaW5hdGlvblR5cGUgPT09ICdidWxsZXRzJyAmJiBzLnBhcmFtcy5wYWdpbmF0aW9uQ2xpY2thYmxlKSB7XG4gICAgICAgICAgICAgICAgcy5wYWdpbmF0aW9uQ29udGFpbmVyLmFkZENsYXNzKCdzd2lwZXItcGFnaW5hdGlvbi1jbGlja2FibGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHMucGFyYW1zLnBhZ2luYXRpb25DbGlja2FibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMucGFnaW5hdGlvbkNvbnRhaW5lci5hZGRDbGFzcygnc3dpcGVyLXBhZ2luYXRpb24tJyArIHMucGFyYW1zLnBhZ2luYXRpb25UeXBlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gSXMgSG9yaXpvbnRhbFxuICAgICAgICBzLmlzSG9yaXpvbnRhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBzLnBhcmFtcy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJztcbiAgICAgICAgfTtcbiAgICAgICAgLy8gcy5pc0ggPSBpc0g7XG4gICAgICAgIFxuICAgICAgICAvLyBSVExcbiAgICAgICAgcy5ydGwgPSBzLmlzSG9yaXpvbnRhbCgpICYmIChzLmNvbnRhaW5lclswXS5kaXIudG9Mb3dlckNhc2UoKSA9PT0gJ3J0bCcgfHwgcy5jb250YWluZXIuY3NzKCdkaXJlY3Rpb24nKSA9PT0gJ3J0bCcpO1xuICAgICAgICBpZiAocy5ydGwpIHtcbiAgICAgICAgICAgIHMuY2xhc3NOYW1lcy5wdXNoKCdzd2lwZXItY29udGFpbmVyLXJ0bCcpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBXcm9uZyBSVEwgc3VwcG9ydFxuICAgICAgICBpZiAocy5ydGwpIHtcbiAgICAgICAgICAgIHMud3JvbmdSVEwgPSBzLndyYXBwZXIuY3NzKCdkaXNwbGF5JykgPT09ICctd2Via2l0LWJveCc7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIENvbHVtbnNcbiAgICAgICAgaWYgKHMucGFyYW1zLnNsaWRlc1BlckNvbHVtbiA+IDEpIHtcbiAgICAgICAgICAgIHMuY2xhc3NOYW1lcy5wdXNoKCdzd2lwZXItY29udGFpbmVyLW11bHRpcm93Jyk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIENoZWNrIGZvciBBbmRyb2lkXG4gICAgICAgIGlmIChzLmRldmljZS5hbmRyb2lkKSB7XG4gICAgICAgICAgICBzLmNsYXNzTmFtZXMucHVzaCgnc3dpcGVyLWNvbnRhaW5lci1hbmRyb2lkJyk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIEFkZCBjbGFzc2VzXG4gICAgICAgIHMuY29udGFpbmVyLmFkZENsYXNzKHMuY2xhc3NOYW1lcy5qb2luKCcgJykpO1xuICAgICAgICBcbiAgICAgICAgLy8gVHJhbnNsYXRlXG4gICAgICAgIHMudHJhbnNsYXRlID0gMDtcbiAgICAgICAgXG4gICAgICAgIC8vIFByb2dyZXNzXG4gICAgICAgIHMucHJvZ3Jlc3MgPSAwO1xuICAgICAgICBcbiAgICAgICAgLy8gVmVsb2NpdHlcbiAgICAgICAgcy52ZWxvY2l0eSA9IDA7XG4gICAgICAgIFxuICAgICAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICBMb2NrcywgdW5sb2Nrc1xuICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgICAgIHMubG9ja1N3aXBlVG9OZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcy5wYXJhbXMuYWxsb3dTd2lwZVRvTmV4dCA9IGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICBzLmxvY2tTd2lwZVRvUHJldiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHMucGFyYW1zLmFsbG93U3dpcGVUb1ByZXYgPSBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcy5sb2NrU3dpcGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcy5wYXJhbXMuYWxsb3dTd2lwZVRvTmV4dCA9IHMucGFyYW1zLmFsbG93U3dpcGVUb1ByZXYgPSBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgcy51bmxvY2tTd2lwZVRvTmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHMucGFyYW1zLmFsbG93U3dpcGVUb05leHQgPSB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICBzLnVubG9ja1N3aXBlVG9QcmV2ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcy5wYXJhbXMuYWxsb3dTd2lwZVRvUHJldiA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIHMudW5sb2NrU3dpcGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcy5wYXJhbXMuYWxsb3dTd2lwZVRvTmV4dCA9IHMucGFyYW1zLmFsbG93U3dpcGVUb1ByZXYgPSB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgUm91bmQgaGVscGVyXG4gICAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAgICAgZnVuY3Rpb24gcm91bmQoYSkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoYSk7XG4gICAgICAgIH1cbiAgICAgICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgU2V0IGdyYWIgY3Vyc29yXG4gICAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAgICAgaWYgKHMucGFyYW1zLmdyYWJDdXJzb3IpIHtcbiAgICAgICAgICAgIHMuY29udGFpbmVyWzBdLnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcbiAgICAgICAgICAgIHMuY29udGFpbmVyWzBdLnN0eWxlLmN1cnNvciA9ICctd2Via2l0LWdyYWInO1xuICAgICAgICAgICAgcy5jb250YWluZXJbMF0uc3R5bGUuY3Vyc29yID0gJy1tb3otZ3JhYic7XG4gICAgICAgICAgICBzLmNvbnRhaW5lclswXS5zdHlsZS5jdXJzb3IgPSAnZ3JhYic7XG4gICAgICAgIH1cbiAgICAgICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgVXBkYXRlIG9uIEltYWdlcyBSZWFkeVxuICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgICAgIHMuaW1hZ2VzVG9Mb2FkID0gW107XG4gICAgICAgIHMuaW1hZ2VzTG9hZGVkID0gMDtcbiAgICAgICAgXG4gICAgICAgIHMubG9hZEltYWdlID0gZnVuY3Rpb24gKGltZ0VsZW1lbnQsIHNyYywgc3Jjc2V0LCBjaGVja0ZvckNvbXBsZXRlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIGltYWdlO1xuICAgICAgICAgICAgZnVuY3Rpb24gb25SZWFkeSAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpbWdFbGVtZW50LmNvbXBsZXRlIHx8ICFjaGVja0ZvckNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNyYykge1xuICAgICAgICAgICAgICAgICAgICBpbWFnZSA9IG5ldyB3aW5kb3cuSW1hZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gb25SZWFkeTtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2Uub25lcnJvciA9IG9uUmVhZHk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzcmNzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlLnNyY3NldCA9IHNyY3NldDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoc3JjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZS5zcmMgPSBzcmM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvblJlYWR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSB7Ly9pbWFnZSBhbHJlYWR5IGxvYWRlZC4uLlxuICAgICAgICAgICAgICAgIG9uUmVhZHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcy5wcmVsb2FkSW1hZ2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcy5pbWFnZXNUb0xvYWQgPSBzLmNvbnRhaW5lci5maW5kKCdpbWcnKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIF9vblJlYWR5KCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcyA9PT0gJ3VuZGVmaW5lZCcgfHwgcyA9PT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmIChzLmltYWdlc0xvYWRlZCAhPT0gdW5kZWZpbmVkKSBzLmltYWdlc0xvYWRlZCsrO1xuICAgICAgICAgICAgICAgIGlmIChzLmltYWdlc0xvYWRlZCA9PT0gcy5pbWFnZXNUb0xvYWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy51cGRhdGVPbkltYWdlc1JlYWR5KSBzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICBzLmVtaXQoJ29uSW1hZ2VzUmVhZHknLCBzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMuaW1hZ2VzVG9Mb2FkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcy5sb2FkSW1hZ2Uocy5pbWFnZXNUb0xvYWRbaV0sIChzLmltYWdlc1RvTG9hZFtpXS5jdXJyZW50U3JjIHx8IHMuaW1hZ2VzVG9Mb2FkW2ldLmdldEF0dHJpYnV0ZSgnc3JjJykpLCAocy5pbWFnZXNUb0xvYWRbaV0uc3Jjc2V0IHx8IHMuaW1hZ2VzVG9Mb2FkW2ldLmdldEF0dHJpYnV0ZSgnc3Jjc2V0JykpLCB0cnVlLCBfb25SZWFkeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICBBdXRvcGxheVxuICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgICAgIHMuYXV0b3BsYXlUaW1lb3V0SWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHMuYXV0b3BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgcy5hdXRvcGxheVBhdXNlZCA9IGZhbHNlO1xuICAgICAgICBmdW5jdGlvbiBhdXRvcGxheSgpIHtcbiAgICAgICAgICAgIHMuYXV0b3BsYXlUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMubG9vcCkge1xuICAgICAgICAgICAgICAgICAgICBzLmZpeExvb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgcy5fc2xpZGVOZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIHMuZW1pdCgnb25BdXRvcGxheScsIHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzLmlzRW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLl9zbGlkZU5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuZW1pdCgnb25BdXRvcGxheScsIHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXJhbXMuYXV0b3BsYXlTdG9wT25MYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5fc2xpZGVUbygwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLmVtaXQoJ29uQXV0b3BsYXknLCBzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMuc3RvcEF1dG9wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBzLnBhcmFtcy5hdXRvcGxheSk7XG4gICAgICAgIH1cbiAgICAgICAgcy5zdGFydEF1dG9wbGF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzLmF1dG9wbGF5VGltZW91dElkICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgaWYgKCFzLnBhcmFtcy5hdXRvcGxheSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgaWYgKHMuYXV0b3BsYXlpbmcpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHMuYXV0b3BsYXlpbmcgPSB0cnVlO1xuICAgICAgICAgICAgcy5lbWl0KCdvbkF1dG9wbGF5U3RhcnQnLCBzKTtcbiAgICAgICAgICAgIGF1dG9wbGF5KCk7XG4gICAgICAgIH07XG4gICAgICAgIHMuc3RvcEF1dG9wbGF5ID0gZnVuY3Rpb24gKGludGVybmFsKSB7XG4gICAgICAgICAgICBpZiAoIXMuYXV0b3BsYXlUaW1lb3V0SWQpIHJldHVybjtcbiAgICAgICAgICAgIGlmIChzLmF1dG9wbGF5VGltZW91dElkKSBjbGVhclRpbWVvdXQocy5hdXRvcGxheVRpbWVvdXRJZCk7XG4gICAgICAgICAgICBzLmF1dG9wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBzLmF1dG9wbGF5VGltZW91dElkID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcy5lbWl0KCdvbkF1dG9wbGF5U3RvcCcsIHMpO1xuICAgICAgICB9O1xuICAgICAgICBzLnBhdXNlQXV0b3BsYXkgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgICAgIGlmIChzLmF1dG9wbGF5UGF1c2VkKSByZXR1cm47XG4gICAgICAgICAgICBpZiAocy5hdXRvcGxheVRpbWVvdXRJZCkgY2xlYXJUaW1lb3V0KHMuYXV0b3BsYXlUaW1lb3V0SWQpO1xuICAgICAgICAgICAgcy5hdXRvcGxheVBhdXNlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAoc3BlZWQgPT09IDApIHtcbiAgICAgICAgICAgICAgICBzLmF1dG9wbGF5UGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYXV0b3BsYXkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHMud3JhcHBlci50cmFuc2l0aW9uRW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIHMuYXV0b3BsYXlQYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzLmF1dG9wbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLnN0b3BBdXRvcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXV0b3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICBNaW4vTWF4IFRyYW5zbGF0ZVxuICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgICAgIHMubWluVHJhbnNsYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICgtcy5zbmFwR3JpZFswXSk7XG4gICAgICAgIH07XG4gICAgICAgIHMubWF4VHJhbnNsYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICgtcy5zbmFwR3JpZFtzLnNuYXBHcmlkLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgU2xpZGVyL3NsaWRlcyBzaXplc1xuICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgICAgIHMudXBkYXRlQXV0b0hlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIFVwZGF0ZSBIZWlnaHRcbiAgICAgICAgICAgIHZhciBzbGlkZSA9IHMuc2xpZGVzLmVxKHMuYWN0aXZlSW5kZXgpWzBdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzbGlkZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3SGVpZ2h0ID0gc2xpZGUub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgIGlmIChuZXdIZWlnaHQpIHMud3JhcHBlci5jc3MoJ2hlaWdodCcsIG5ld0hlaWdodCArICdweCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzLnVwZGF0ZUNvbnRhaW5lclNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgd2lkdGgsIGhlaWdodDtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygcy5wYXJhbXMud2lkdGggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgd2lkdGggPSBzLnBhcmFtcy53aWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHdpZHRoID0gcy5jb250YWluZXJbMF0uY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIHMucGFyYW1zLmhlaWdodCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSBzLnBhcmFtcy5oZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSBzLmNvbnRhaW5lclswXS5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAod2lkdGggPT09IDAgJiYgcy5pc0hvcml6b250YWwoKSB8fCBoZWlnaHQgPT09IDAgJiYgIXMuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy9TdWJ0cmFjdCBwYWRkaW5nc1xuICAgICAgICAgICAgd2lkdGggPSB3aWR0aCAtIHBhcnNlSW50KHMuY29udGFpbmVyLmNzcygncGFkZGluZy1sZWZ0JyksIDEwKSAtIHBhcnNlSW50KHMuY29udGFpbmVyLmNzcygncGFkZGluZy1yaWdodCcpLCAxMCk7XG4gICAgICAgICAgICBoZWlnaHQgPSBoZWlnaHQgLSBwYXJzZUludChzLmNvbnRhaW5lci5jc3MoJ3BhZGRpbmctdG9wJyksIDEwKSAtIHBhcnNlSW50KHMuY29udGFpbmVyLmNzcygncGFkZGluZy1ib3R0b20nKSwgMTApO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIFN0b3JlIHZhbHVlc1xuICAgICAgICAgICAgcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICAgICAgcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICBzLnNpemUgPSBzLmlzSG9yaXpvbnRhbCgpID8gcy53aWR0aCA6IHMuaGVpZ2h0O1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgcy51cGRhdGVTbGlkZXNTaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcy5zbGlkZXMgPSBzLndyYXBwZXIuY2hpbGRyZW4oJy4nICsgcy5wYXJhbXMuc2xpZGVDbGFzcyk7XG4gICAgICAgICAgICBzLnNuYXBHcmlkID0gW107XG4gICAgICAgICAgICBzLnNsaWRlc0dyaWQgPSBbXTtcbiAgICAgICAgICAgIHMuc2xpZGVzU2l6ZXNHcmlkID0gW107XG4gICAgICAgIFxuICAgICAgICAgICAgdmFyIHNwYWNlQmV0d2VlbiA9IHMucGFyYW1zLnNwYWNlQmV0d2VlbixcbiAgICAgICAgICAgICAgICBzbGlkZVBvc2l0aW9uID0gLXMucGFyYW1zLnNsaWRlc09mZnNldEJlZm9yZSxcbiAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgIHByZXZTbGlkZVNpemUgPSAwLFxuICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3BhY2VCZXR3ZWVuID09PSAnc3RyaW5nJyAmJiBzcGFjZUJldHdlZW4uaW5kZXhPZignJScpID49IDApIHtcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW4gPSBwYXJzZUZsb2F0KHNwYWNlQmV0d2Vlbi5yZXBsYWNlKCclJywgJycpKSAvIDEwMCAqIHMuc2l6ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICBzLnZpcnR1YWxTaXplID0gLXNwYWNlQmV0d2VlbjtcbiAgICAgICAgICAgIC8vIHJlc2V0IG1hcmdpbnNcbiAgICAgICAgICAgIGlmIChzLnJ0bCkgcy5zbGlkZXMuY3NzKHttYXJnaW5MZWZ0OiAnJywgbWFyZ2luVG9wOiAnJ30pO1xuICAgICAgICAgICAgZWxzZSBzLnNsaWRlcy5jc3Moe21hcmdpblJpZ2h0OiAnJywgbWFyZ2luQm90dG9tOiAnJ30pO1xuICAgICAgICBcbiAgICAgICAgICAgIHZhciBzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzO1xuICAgICAgICAgICAgaWYgKHMucGFyYW1zLnNsaWRlc1BlckNvbHVtbiA+IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5mbG9vcihzLnNsaWRlcy5sZW5ndGggLyBzLnBhcmFtcy5zbGlkZXNQZXJDb2x1bW4pID09PSBzLnNsaWRlcy5sZW5ndGggLyBzLnBhcmFtcy5zbGlkZXNQZXJDb2x1bW4pIHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzTnVtYmVyRXZlblRvUm93cyA9IHMuc2xpZGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc051bWJlckV2ZW5Ub1Jvd3MgPSBNYXRoLmNlaWwocy5zbGlkZXMubGVuZ3RoIC8gcy5wYXJhbXMuc2xpZGVzUGVyQ29sdW1uKSAqIHMucGFyYW1zLnNsaWRlc1BlckNvbHVtbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLnNsaWRlc1BlclZpZXcgIT09ICdhdXRvJyAmJiBzLnBhcmFtcy5zbGlkZXNQZXJDb2x1bW5GaWxsID09PSAncm93Jykge1xuICAgICAgICAgICAgICAgICAgICBzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzID0gTWF0aC5tYXgoc2xpZGVzTnVtYmVyRXZlblRvUm93cywgcy5wYXJhbXMuc2xpZGVzUGVyVmlldyAqIHMucGFyYW1zLnNsaWRlc1BlckNvbHVtbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIENhbGMgc2xpZGVzXG4gICAgICAgICAgICB2YXIgc2xpZGVTaXplO1xuICAgICAgICAgICAgdmFyIHNsaWRlc1BlckNvbHVtbiA9IHMucGFyYW1zLnNsaWRlc1BlckNvbHVtbjtcbiAgICAgICAgICAgIHZhciBzbGlkZXNQZXJSb3cgPSBzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzIC8gc2xpZGVzUGVyQ29sdW1uO1xuICAgICAgICAgICAgdmFyIG51bUZ1bGxDb2x1bW5zID0gc2xpZGVzUGVyUm93IC0gKHMucGFyYW1zLnNsaWRlc1BlckNvbHVtbiAqIHNsaWRlc1BlclJvdyAtIHMuc2xpZGVzLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcy5zbGlkZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzbGlkZVNpemUgPSAwO1xuICAgICAgICAgICAgICAgIHZhciBzbGlkZSA9IHMuc2xpZGVzLmVxKGkpO1xuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5zbGlkZXNQZXJDb2x1bW4gPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCBzbGlkZXMgb3JkZXJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1NsaWRlT3JkZXJJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbHVtbiwgcm93O1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMuc2xpZGVzUGVyQ29sdW1uRmlsbCA9PT0gJ2NvbHVtbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbiA9IE1hdGguZmxvb3IoaSAvIHNsaWRlc1BlckNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3cgPSBpIC0gY29sdW1uICogc2xpZGVzUGVyQ29sdW1uO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbHVtbiA+IG51bUZ1bGxDb2x1bW5zIHx8IChjb2x1bW4gPT09IG51bUZ1bGxDb2x1bW5zICYmIHJvdyA9PT0gc2xpZGVzUGVyQ29sdW1uLTEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCsrcm93ID49IHNsaWRlc1BlckNvbHVtbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4rKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdTbGlkZU9yZGVySW5kZXggPSBjb2x1bW4gKyByb3cgKiBzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzIC8gc2xpZGVzUGVyQ29sdW1uO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJy13ZWJraXQtYm94LW9yZGluYWwtZ3JvdXAnOiBuZXdTbGlkZU9yZGVySW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICctbW96LWJveC1vcmRpbmFsLWdyb3VwJzogbmV3U2xpZGVPcmRlckluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLW1zLWZsZXgtb3JkZXInOiBuZXdTbGlkZU9yZGVySW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICctd2Via2l0LW9yZGVyJzogbmV3U2xpZGVPcmRlckluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb3JkZXInOiBuZXdTbGlkZU9yZGVySW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdyA9IE1hdGguZmxvb3IoaSAvIHNsaWRlc1BlclJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4gPSBpIC0gcm93ICogc2xpZGVzUGVyUm93O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlXG4gICAgICAgICAgICAgICAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbWFyZ2luLXRvcCc6IChyb3cgIT09IDAgJiYgcy5wYXJhbXMuc3BhY2VCZXR3ZWVuKSAmJiAocy5wYXJhbXMuc3BhY2VCZXR3ZWVuICsgJ3B4JylcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1zd2lwZXItY29sdW1uJywgY29sdW1uKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc3dpcGVyLXJvdycsIHJvdyk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2xpZGUuY3NzKCdkaXNwbGF5JykgPT09ICdub25lJykgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdhdXRvJykge1xuICAgICAgICAgICAgICAgICAgICBzbGlkZVNpemUgPSBzLmlzSG9yaXpvbnRhbCgpID8gc2xpZGUub3V0ZXJXaWR0aCh0cnVlKSA6IHNsaWRlLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMucm91bmRMZW5ndGhzKSBzbGlkZVNpemUgPSByb3VuZChzbGlkZVNpemUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVTaXplID0gKHMuc2l6ZSAtIChzLnBhcmFtcy5zbGlkZXNQZXJWaWV3IC0gMSkgKiBzcGFjZUJldHdlZW4pIC8gcy5wYXJhbXMuc2xpZGVzUGVyVmlldztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLnJvdW5kTGVuZ3Rocykgc2xpZGVTaXplID0gcm91bmQoc2xpZGVTaXplKTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChzLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLnNsaWRlc1tpXS5zdHlsZS53aWR0aCA9IHNsaWRlU2l6ZSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLnNsaWRlc1tpXS5zdHlsZS5oZWlnaHQgPSBzbGlkZVNpemUgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHMuc2xpZGVzW2ldLnN3aXBlclNsaWRlU2l6ZSA9IHNsaWRlU2l6ZTtcbiAgICAgICAgICAgICAgICBzLnNsaWRlc1NpemVzR3JpZC5wdXNoKHNsaWRlU2l6ZSk7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVQb3NpdGlvbiA9IHNsaWRlUG9zaXRpb24gKyBzbGlkZVNpemUgLyAyICsgcHJldlNsaWRlU2l6ZSAvIDIgKyBzcGFjZUJldHdlZW47XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSBzbGlkZVBvc2l0aW9uID0gc2xpZGVQb3NpdGlvbiAtIHMuc2l6ZSAvIDIgLSBzcGFjZUJldHdlZW47XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzbGlkZVBvc2l0aW9uKSA8IDEgLyAxMDAwKSBzbGlkZVBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChpbmRleCkgJSBzLnBhcmFtcy5zbGlkZXNQZXJHcm91cCA9PT0gMCkgcy5zbmFwR3JpZC5wdXNoKHNsaWRlUG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBzLnNsaWRlc0dyaWQucHVzaChzbGlkZVBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoaW5kZXgpICUgcy5wYXJhbXMuc2xpZGVzUGVyR3JvdXAgPT09IDApIHMuc25hcEdyaWQucHVzaChzbGlkZVBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgcy5zbGlkZXNHcmlkLnB1c2goc2xpZGVQb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlUG9zaXRpb24gPSBzbGlkZVBvc2l0aW9uICsgc2xpZGVTaXplICsgc3BhY2VCZXR3ZWVuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAgICAgcy52aXJ0dWFsU2l6ZSArPSBzbGlkZVNpemUgKyBzcGFjZUJldHdlZW47XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIHByZXZTbGlkZVNpemUgPSBzbGlkZVNpemU7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGluZGV4ICsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcy52aXJ0dWFsU2l6ZSA9IE1hdGgubWF4KHMudmlydHVhbFNpemUsIHMuc2l6ZSkgKyBzLnBhcmFtcy5zbGlkZXNPZmZzZXRBZnRlcjtcbiAgICAgICAgICAgIHZhciBuZXdTbGlkZXNHcmlkO1xuICAgICAgICBcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBzLnJ0bCAmJiBzLndyb25nUlRMICYmIChzLnBhcmFtcy5lZmZlY3QgPT09ICdzbGlkZScgfHwgcy5wYXJhbXMuZWZmZWN0ID09PSAnY292ZXJmbG93JykpIHtcbiAgICAgICAgICAgICAgICBzLndyYXBwZXIuY3NzKHt3aWR0aDogcy52aXJ0dWFsU2l6ZSArIHMucGFyYW1zLnNwYWNlQmV0d2VlbiArICdweCd9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcy5zdXBwb3J0LmZsZXhib3ggfHwgcy5wYXJhbXMuc2V0V3JhcHBlclNpemUpIHtcbiAgICAgICAgICAgICAgICBpZiAocy5pc0hvcml6b250YWwoKSkgcy53cmFwcGVyLmNzcyh7d2lkdGg6IHMudmlydHVhbFNpemUgKyBzLnBhcmFtcy5zcGFjZUJldHdlZW4gKyAncHgnfSk7XG4gICAgICAgICAgICAgICAgZWxzZSBzLndyYXBwZXIuY3NzKHtoZWlnaHQ6IHMudmlydHVhbFNpemUgKyBzLnBhcmFtcy5zcGFjZUJldHdlZW4gKyAncHgnfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKHMucGFyYW1zLnNsaWRlc1BlckNvbHVtbiA+IDEpIHtcbiAgICAgICAgICAgICAgICBzLnZpcnR1YWxTaXplID0gKHNsaWRlU2l6ZSArIHMucGFyYW1zLnNwYWNlQmV0d2VlbikgKiBzbGlkZXNOdW1iZXJFdmVuVG9Sb3dzO1xuICAgICAgICAgICAgICAgIHMudmlydHVhbFNpemUgPSBNYXRoLmNlaWwocy52aXJ0dWFsU2l6ZSAvIHMucGFyYW1zLnNsaWRlc1BlckNvbHVtbikgLSBzLnBhcmFtcy5zcGFjZUJldHdlZW47XG4gICAgICAgICAgICAgICAgcy53cmFwcGVyLmNzcyh7d2lkdGg6IHMudmlydHVhbFNpemUgKyBzLnBhcmFtcy5zcGFjZUJldHdlZW4gKyAncHgnfSk7XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmNlbnRlcmVkU2xpZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1NsaWRlc0dyaWQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHMuc25hcEdyaWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzLnNuYXBHcmlkW2ldIDwgcy52aXJ0dWFsU2l6ZSArIHMuc25hcEdyaWRbMF0pIG5ld1NsaWRlc0dyaWQucHVzaChzLnNuYXBHcmlkW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzLnNuYXBHcmlkID0gbmV3U2xpZGVzR3JpZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gUmVtb3ZlIGxhc3QgZ3JpZCBlbGVtZW50cyBkZXBlbmRpbmcgb24gd2lkdGhcbiAgICAgICAgICAgIGlmICghcy5wYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcbiAgICAgICAgICAgICAgICBuZXdTbGlkZXNHcmlkID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHMuc25hcEdyaWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMuc25hcEdyaWRbaV0gPD0gcy52aXJ0dWFsU2l6ZSAtIHMuc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2xpZGVzR3JpZC5wdXNoKHMuc25hcEdyaWRbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHMuc25hcEdyaWQgPSBuZXdTbGlkZXNHcmlkO1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmZsb29yKHMudmlydHVhbFNpemUgLSBzLnNpemUpID4gTWF0aC5mbG9vcihzLnNuYXBHcmlkW3Muc25hcEdyaWQubGVuZ3RoIC0gMV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuc25hcEdyaWQucHVzaChzLnZpcnR1YWxTaXplIC0gcy5zaXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5zbmFwR3JpZC5sZW5ndGggPT09IDApIHMuc25hcEdyaWQgPSBbMF07XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKHMucGFyYW1zLnNwYWNlQmV0d2VlbiAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChzLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLnJ0bCkgcy5zbGlkZXMuY3NzKHttYXJnaW5MZWZ0OiBzcGFjZUJldHdlZW4gKyAncHgnfSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2Ugcy5zbGlkZXMuY3NzKHttYXJnaW5SaWdodDogc3BhY2VCZXR3ZWVuICsgJ3B4J30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHMuc2xpZGVzLmNzcyh7bWFyZ2luQm90dG9tOiBzcGFjZUJldHdlZW4gKyAncHgnfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMud2F0Y2hTbGlkZXNQcm9ncmVzcykge1xuICAgICAgICAgICAgICAgIHMudXBkYXRlU2xpZGVzT2Zmc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHMudXBkYXRlU2xpZGVzT2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLnNsaWRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHMuc2xpZGVzW2ldLnN3aXBlclNsaWRlT2Zmc2V0ID0gcy5pc0hvcml6b250YWwoKSA/IHMuc2xpZGVzW2ldLm9mZnNldExlZnQgOiBzLnNsaWRlc1tpXS5vZmZzZXRUb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICBTbGlkZXIvc2xpZGVzIHByb2dyZXNzXG4gICAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAgICAgcy51cGRhdGVTbGlkZXNQcm9ncmVzcyA9IGZ1bmN0aW9uICh0cmFuc2xhdGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdHJhbnNsYXRlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSA9IHMudHJhbnNsYXRlIHx8IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5zbGlkZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgICAgICAgICBpZiAodHlwZW9mIHMuc2xpZGVzWzBdLnN3aXBlclNsaWRlT2Zmc2V0ID09PSAndW5kZWZpbmVkJykgcy51cGRhdGVTbGlkZXNPZmZzZXQoKTtcbiAgICAgICAgXG4gICAgICAgICAgICB2YXIgb2Zmc2V0Q2VudGVyID0gLXRyYW5zbGF0ZTtcbiAgICAgICAgICAgIGlmIChzLnJ0bCkgb2Zmc2V0Q2VudGVyID0gdHJhbnNsYXRlO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIFZpc2libGUgU2xpZGVzXG4gICAgICAgICAgICBzLnNsaWRlcy5yZW1vdmVDbGFzcyhzLnBhcmFtcy5zbGlkZVZpc2libGVDbGFzcyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMuc2xpZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNsaWRlID0gcy5zbGlkZXNbaV07XG4gICAgICAgICAgICAgICAgdmFyIHNsaWRlUHJvZ3Jlc3MgPSAob2Zmc2V0Q2VudGVyIC0gc2xpZGUuc3dpcGVyU2xpZGVPZmZzZXQpIC8gKHNsaWRlLnN3aXBlclNsaWRlU2l6ZSArIHMucGFyYW1zLnNwYWNlQmV0d2Vlbik7XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLndhdGNoU2xpZGVzVmlzaWJpbGl0eSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2xpZGVCZWZvcmUgPSAtKG9mZnNldENlbnRlciAtIHNsaWRlLnN3aXBlclNsaWRlT2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNsaWRlQWZ0ZXIgPSBzbGlkZUJlZm9yZSArIHMuc2xpZGVzU2l6ZXNHcmlkW2ldO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNWaXNpYmxlID1cbiAgICAgICAgICAgICAgICAgICAgICAgIChzbGlkZUJlZm9yZSA+PSAwICYmIHNsaWRlQmVmb3JlIDwgcy5zaXplKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKHNsaWRlQWZ0ZXIgPiAwICYmIHNsaWRlQWZ0ZXIgPD0gcy5zaXplKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKHNsaWRlQmVmb3JlIDw9IDAgJiYgc2xpZGVBZnRlciA+PSBzLnNpemUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNWaXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLnNsaWRlcy5lcShpKS5hZGRDbGFzcyhzLnBhcmFtcy5zbGlkZVZpc2libGVDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2xpZGUucHJvZ3Jlc3MgPSBzLnJ0bCA/IC1zbGlkZVByb2dyZXNzIDogc2xpZGVQcm9ncmVzcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcy51cGRhdGVQcm9ncmVzcyA9IGZ1bmN0aW9uICh0cmFuc2xhdGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdHJhbnNsYXRlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSA9IHMudHJhbnNsYXRlIHx8IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdHJhbnNsYXRlc0RpZmYgPSBzLm1heFRyYW5zbGF0ZSgpIC0gcy5taW5UcmFuc2xhdGUoKTtcbiAgICAgICAgICAgIHZhciB3YXNCZWdpbm5pbmcgPSBzLmlzQmVnaW5uaW5nO1xuICAgICAgICAgICAgdmFyIHdhc0VuZCA9IHMuaXNFbmQ7XG4gICAgICAgICAgICBpZiAodHJhbnNsYXRlc0RpZmYgPT09IDApIHtcbiAgICAgICAgICAgICAgICBzLnByb2dyZXNzID0gMDtcbiAgICAgICAgICAgICAgICBzLmlzQmVnaW5uaW5nID0gcy5pc0VuZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzLnByb2dyZXNzID0gKHRyYW5zbGF0ZSAtIHMubWluVHJhbnNsYXRlKCkpIC8gKHRyYW5zbGF0ZXNEaWZmKTtcbiAgICAgICAgICAgICAgICBzLmlzQmVnaW5uaW5nID0gcy5wcm9ncmVzcyA8PSAwO1xuICAgICAgICAgICAgICAgIHMuaXNFbmQgPSBzLnByb2dyZXNzID49IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5pc0JlZ2lubmluZyAmJiAhd2FzQmVnaW5uaW5nKSBzLmVtaXQoJ29uUmVhY2hCZWdpbm5pbmcnLCBzKTtcbiAgICAgICAgICAgIGlmIChzLmlzRW5kICYmICF3YXNFbmQpIHMuZW1pdCgnb25SZWFjaEVuZCcsIHMpO1xuICAgICAgICBcbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy53YXRjaFNsaWRlc1Byb2dyZXNzKSBzLnVwZGF0ZVNsaWRlc1Byb2dyZXNzKHRyYW5zbGF0ZSk7XG4gICAgICAgICAgICBzLmVtaXQoJ29uUHJvZ3Jlc3MnLCBzLCBzLnByb2dyZXNzKTtcbiAgICAgICAgfTtcbiAgICAgICAgcy51cGRhdGVBY3RpdmVJbmRleCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0cmFuc2xhdGUgPSBzLnJ0bCA/IHMudHJhbnNsYXRlIDogLXMudHJhbnNsYXRlO1xuICAgICAgICAgICAgdmFyIG5ld0FjdGl2ZUluZGV4LCBpLCBzbmFwSW5kZXg7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcy5zbGlkZXNHcmlkLmxlbmd0aDsgaSArKykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygcy5zbGlkZXNHcmlkW2kgKyAxXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyYW5zbGF0ZSA+PSBzLnNsaWRlc0dyaWRbaV0gJiYgdHJhbnNsYXRlIDwgcy5zbGlkZXNHcmlkW2kgKyAxXSAtIChzLnNsaWRlc0dyaWRbaSArIDFdIC0gcy5zbGlkZXNHcmlkW2ldKSAvIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0FjdGl2ZUluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0cmFuc2xhdGUgPj0gcy5zbGlkZXNHcmlkW2ldICYmIHRyYW5zbGF0ZSA8IHMuc2xpZGVzR3JpZFtpICsgMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0FjdGl2ZUluZGV4ID0gaSArIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0cmFuc2xhdGUgPj0gcy5zbGlkZXNHcmlkW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdBY3RpdmVJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBOb3JtYWxpemUgc2xpZGVJbmRleFxuICAgICAgICAgICAgaWYgKG5ld0FjdGl2ZUluZGV4IDwgMCB8fCB0eXBlb2YgbmV3QWN0aXZlSW5kZXggPT09ICd1bmRlZmluZWQnKSBuZXdBY3RpdmVJbmRleCA9IDA7XG4gICAgICAgICAgICAvLyBmb3IgKGkgPSAwOyBpIDwgcy5zbGlkZXNHcmlkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKC0gdHJhbnNsYXRlID49IHMuc2xpZGVzR3JpZFtpXSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBuZXdBY3RpdmVJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgc25hcEluZGV4ID0gTWF0aC5mbG9vcihuZXdBY3RpdmVJbmRleCAvIHMucGFyYW1zLnNsaWRlc1Blckdyb3VwKTtcbiAgICAgICAgICAgIGlmIChzbmFwSW5kZXggPj0gcy5zbmFwR3JpZC5sZW5ndGgpIHNuYXBJbmRleCA9IHMuc25hcEdyaWQubGVuZ3RoIC0gMTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAobmV3QWN0aXZlSW5kZXggPT09IHMuYWN0aXZlSW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzLnNuYXBJbmRleCA9IHNuYXBJbmRleDtcbiAgICAgICAgICAgIHMucHJldmlvdXNJbmRleCA9IHMuYWN0aXZlSW5kZXg7XG4gICAgICAgICAgICBzLmFjdGl2ZUluZGV4ID0gbmV3QWN0aXZlSW5kZXg7XG4gICAgICAgICAgICBzLnVwZGF0ZUNsYXNzZXMoKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgIENsYXNzZXNcbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBzLnVwZGF0ZUNsYXNzZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzLnNsaWRlcy5yZW1vdmVDbGFzcyhzLnBhcmFtcy5zbGlkZUFjdGl2ZUNsYXNzICsgJyAnICsgcy5wYXJhbXMuc2xpZGVOZXh0Q2xhc3MgKyAnICcgKyBzLnBhcmFtcy5zbGlkZVByZXZDbGFzcyk7XG4gICAgICAgICAgICB2YXIgYWN0aXZlU2xpZGUgPSBzLnNsaWRlcy5lcShzLmFjdGl2ZUluZGV4KTtcbiAgICAgICAgICAgIC8vIEFjdGl2ZSBjbGFzc2VzXG4gICAgICAgICAgICBhY3RpdmVTbGlkZS5hZGRDbGFzcyhzLnBhcmFtcy5zbGlkZUFjdGl2ZUNsYXNzKTtcbiAgICAgICAgICAgIGFjdGl2ZVNsaWRlLm5leHQoJy4nICsgcy5wYXJhbXMuc2xpZGVDbGFzcykuYWRkQ2xhc3Mocy5wYXJhbXMuc2xpZGVOZXh0Q2xhc3MpO1xuICAgICAgICAgICAgYWN0aXZlU2xpZGUucHJldignLicgKyBzLnBhcmFtcy5zbGlkZUNsYXNzKS5hZGRDbGFzcyhzLnBhcmFtcy5zbGlkZVByZXZDbGFzcyk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gUGFnaW5hdGlvblxuICAgICAgICAgICAgaWYgKHMucGFnaW5hdGlvbkNvbnRhaW5lciAmJiBzLnBhZ2luYXRpb25Db250YWluZXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIC8vIEN1cnJlbnQvVG90YWxcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgPSBzLnBhcmFtcy5sb29wID8gTWF0aC5jZWlsKChzLnNsaWRlcy5sZW5ndGggLSBzLmxvb3BlZFNsaWRlcyAqIDIpIC8gcy5wYXJhbXMuc2xpZGVzUGVyR3JvdXApIDogcy5zbmFwR3JpZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmxvb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IE1hdGguY2VpbChzLmFjdGl2ZUluZGV4IC0gcy5sb29wZWRTbGlkZXMpL3MucGFyYW1zLnNsaWRlc1Blckdyb3VwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudCA+IHMuc2xpZGVzLmxlbmd0aCAtIDEgLSBzLmxvb3BlZFNsaWRlcyAqIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50IC0gKHMuc2xpZGVzLmxlbmd0aCAtIHMubG9vcGVkU2xpZGVzICogMik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQgPiB0b3RhbCAtIDEpIGN1cnJlbnQgPSBjdXJyZW50IC0gdG90YWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50IDwgMCAmJiBzLnBhcmFtcy5wYWdpbmF0aW9uVHlwZSAhPT0gJ2J1bGxldHMnKSBjdXJyZW50ID0gdG90YWwgKyBjdXJyZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzLnNuYXBJbmRleCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBzLnNuYXBJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBzLmFjdGl2ZUluZGV4IHx8IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gVHlwZXNcbiAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMucGFnaW5hdGlvblR5cGUgPT09ICdidWxsZXRzJyAmJiBzLmJ1bGxldHMgJiYgcy5idWxsZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcy5idWxsZXRzLnJlbW92ZUNsYXNzKHMucGFyYW1zLmJ1bGxldEFjdGl2ZUNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMucGFnaW5hdGlvbkNvbnRhaW5lci5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLmJ1bGxldHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaW5kZXgoKSA9PT0gY3VycmVudCkgJCh0aGlzKS5hZGRDbGFzcyhzLnBhcmFtcy5idWxsZXRBY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuYnVsbGV0cy5lcShjdXJyZW50KS5hZGRDbGFzcyhzLnBhcmFtcy5idWxsZXRBY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLnBhZ2luYXRpb25UeXBlID09PSAnZnJhY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHMucGFnaW5hdGlvbkNvbnRhaW5lci5maW5kKCcuJyArIHMucGFyYW1zLnBhZ2luYXRpb25DdXJyZW50Q2xhc3MpLnRleHQoY3VycmVudCArIDEpO1xuICAgICAgICAgICAgICAgICAgICBzLnBhZ2luYXRpb25Db250YWluZXIuZmluZCgnLicgKyBzLnBhcmFtcy5wYWdpbmF0aW9uVG90YWxDbGFzcykudGV4dCh0b3RhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5wYWdpbmF0aW9uVHlwZSA9PT0gJ3Byb2dyZXNzJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGUgPSAoY3VycmVudCArIDEpIC8gdG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZVggPSBzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlWSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcy5pc0hvcml6b250YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVZID0gc2NhbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZVggPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHMucGFnaW5hdGlvbkNvbnRhaW5lci5maW5kKCcuJyArIHMucGFyYW1zLnBhZ2luYXRpb25Qcm9ncmVzc2JhckNsYXNzKS50cmFuc2Zvcm0oJ3RyYW5zbGF0ZTNkKDAsMCwwKSBzY2FsZVgoJyArIHNjYWxlWCArICcpIHNjYWxlWSgnICsgc2NhbGVZICsgJyknKS50cmFuc2l0aW9uKHMucGFyYW1zLnNwZWVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLnBhZ2luYXRpb25UeXBlID09PSAnY3VzdG9tJyAmJiBzLnBhcmFtcy5wYWdpbmF0aW9uQ3VzdG9tUmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHMucGFnaW5hdGlvbkNvbnRhaW5lci5odG1sKHMucGFyYW1zLnBhZ2luYXRpb25DdXN0b21SZW5kZXIocywgY3VycmVudCArIDEsIHRvdGFsKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIE5leHQvYWN0aXZlIGJ1dHRvbnNcbiAgICAgICAgICAgIGlmICghcy5wYXJhbXMubG9vcCkge1xuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5wcmV2QnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLmlzQmVnaW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHMucGFyYW1zLnByZXZCdXR0b24pLmFkZENsYXNzKHMucGFyYW1zLmJ1dHRvbkRpc2FibGVkQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmExMXkgJiYgcy5hMTF5KSBzLmExMXkuZGlzYWJsZSgkKHMucGFyYW1zLnByZXZCdXR0b24pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQocy5wYXJhbXMucHJldkJ1dHRvbikucmVtb3ZlQ2xhc3Mocy5wYXJhbXMuYnV0dG9uRGlzYWJsZWRDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMuYTExeSAmJiBzLmExMXkpIHMuYTExeS5lbmFibGUoJChzLnBhcmFtcy5wcmV2QnV0dG9uKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLm5leHRCdXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMuaXNFbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQocy5wYXJhbXMubmV4dEJ1dHRvbikuYWRkQ2xhc3Mocy5wYXJhbXMuYnV0dG9uRGlzYWJsZWRDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMuYTExeSAmJiBzLmExMXkpIHMuYTExeS5kaXNhYmxlKCQocy5wYXJhbXMubmV4dEJ1dHRvbikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChzLnBhcmFtcy5uZXh0QnV0dG9uKS5yZW1vdmVDbGFzcyhzLnBhcmFtcy5idXR0b25EaXNhYmxlZENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5hMTF5ICYmIHMuYTExeSkgcy5hMTF5LmVuYWJsZSgkKHMucGFyYW1zLm5leHRCdXR0b24pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgIFBhZ2luYXRpb25cbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBzLnVwZGF0ZVBhZ2luYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIXMucGFyYW1zLnBhZ2luYXRpb24pIHJldHVybjtcbiAgICAgICAgICAgIGlmIChzLnBhZ2luYXRpb25Db250YWluZXIgJiYgcy5wYWdpbmF0aW9uQ29udGFpbmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFnaW5hdGlvbkhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMucGFnaW5hdGlvblR5cGUgPT09ICdidWxsZXRzJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbnVtYmVyT2ZCdWxsZXRzID0gcy5wYXJhbXMubG9vcCA/IE1hdGguY2VpbCgocy5zbGlkZXMubGVuZ3RoIC0gcy5sb29wZWRTbGlkZXMgKiAyKSAvIHMucGFyYW1zLnNsaWRlc1Blckdyb3VwKSA6IHMuc25hcEdyaWQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bWJlck9mQnVsbGV0czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMucGFnaW5hdGlvbkJ1bGxldFJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25IVE1MICs9IHMucGFyYW1zLnBhZ2luYXRpb25CdWxsZXRSZW5kZXIoaSwgcy5wYXJhbXMuYnVsbGV0Q2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvbkhUTUwgKz0gJzwnICsgcy5wYXJhbXMucGFnaW5hdGlvbkVsZW1lbnQrJyBjbGFzcz1cIicgKyBzLnBhcmFtcy5idWxsZXRDbGFzcyArICdcIj48LycgKyBzLnBhcmFtcy5wYWdpbmF0aW9uRWxlbWVudCArICc+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzLnBhZ2luYXRpb25Db250YWluZXIuaHRtbChwYWdpbmF0aW9uSFRNTCk7XG4gICAgICAgICAgICAgICAgICAgIHMuYnVsbGV0cyA9IHMucGFnaW5hdGlvbkNvbnRhaW5lci5maW5kKCcuJyArIHMucGFyYW1zLmJ1bGxldENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLnBhZ2luYXRpb25DbGlja2FibGUgJiYgcy5wYXJhbXMuYTExeSAmJiBzLmExMXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuYTExeS5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5wYWdpbmF0aW9uVHlwZSA9PT0gJ2ZyYWN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMucGFnaW5hdGlvbkZyYWN0aW9uUmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uSFRNTCA9IHMucGFyYW1zLnBhZ2luYXRpb25GcmFjdGlvblJlbmRlcihzLCBzLnBhcmFtcy5wYWdpbmF0aW9uQ3VycmVudENsYXNzLCBzLnBhcmFtcy5wYWdpbmF0aW9uVG90YWxDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uSFRNTCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiJyArIHMucGFyYW1zLnBhZ2luYXRpb25DdXJyZW50Q2xhc3MgKyAnXCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgLyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCInICsgcy5wYXJhbXMucGFnaW5hdGlvblRvdGFsQ2xhc3MrJ1wiPjwvc3Bhbj4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHMucGFnaW5hdGlvbkNvbnRhaW5lci5odG1sKHBhZ2luYXRpb25IVE1MKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLnBhZ2luYXRpb25UeXBlID09PSAncHJvZ3Jlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5wYWdpbmF0aW9uUHJvZ3Jlc3NSZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25IVE1MID0gcy5wYXJhbXMucGFnaW5hdGlvblByb2dyZXNzUmVuZGVyKHMsIHMucGFyYW1zLnBhZ2luYXRpb25Qcm9ncmVzc2JhckNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25IVE1MID0gJzxzcGFuIGNsYXNzPVwiJyArIHMucGFyYW1zLnBhZ2luYXRpb25Qcm9ncmVzc2JhckNsYXNzICsgJ1wiPjwvc3Bhbj4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHMucGFnaW5hdGlvbkNvbnRhaW5lci5odG1sKHBhZ2luYXRpb25IVE1MKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgIENvbW1vbiB1cGRhdGUgbWV0aG9kXG4gICAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAgICAgcy51cGRhdGUgPSBmdW5jdGlvbiAodXBkYXRlVHJhbnNsYXRlKSB7XG4gICAgICAgICAgICBzLnVwZGF0ZUNvbnRhaW5lclNpemUoKTtcbiAgICAgICAgICAgIHMudXBkYXRlU2xpZGVzU2l6ZSgpO1xuICAgICAgICAgICAgcy51cGRhdGVQcm9ncmVzcygpO1xuICAgICAgICAgICAgcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICBzLnVwZGF0ZUNsYXNzZXMoKTtcbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5zY3JvbGxiYXIgJiYgcy5zY3JvbGxiYXIpIHtcbiAgICAgICAgICAgICAgICBzLnNjcm9sbGJhci5zZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZvcmNlU2V0VHJhbnNsYXRlKCkge1xuICAgICAgICAgICAgICAgIG5ld1RyYW5zbGF0ZSA9IE1hdGgubWluKE1hdGgubWF4KHMudHJhbnNsYXRlLCBzLm1heFRyYW5zbGF0ZSgpKSwgcy5taW5UcmFuc2xhdGUoKSk7XG4gICAgICAgICAgICAgICAgcy5zZXRXcmFwcGVyVHJhbnNsYXRlKG5ld1RyYW5zbGF0ZSk7XG4gICAgICAgICAgICAgICAgcy51cGRhdGVBY3RpdmVJbmRleCgpO1xuICAgICAgICAgICAgICAgIHMudXBkYXRlQ2xhc3NlcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVwZGF0ZVRyYW5zbGF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGVkLCBuZXdUcmFuc2xhdGU7XG4gICAgICAgICAgICAgICAgaWYgKHMuY29udHJvbGxlciAmJiBzLmNvbnRyb2xsZXIuc3BsaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuY29udHJvbGxlci5zcGxpbmUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5mcmVlTW9kZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3JjZVNldFRyYW5zbGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMuYXV0b0hlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcy51cGRhdGVBdXRvSGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgocy5wYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nIHx8IHMucGFyYW1zLnNsaWRlc1BlclZpZXcgPiAxKSAmJiBzLmlzRW5kICYmICFzLnBhcmFtcy5jZW50ZXJlZFNsaWRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlZCA9IHMuc2xpZGVUbyhzLnNsaWRlcy5sZW5ndGggLSAxLCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGVkID0gcy5zbGlkZVRvKHMuYWN0aXZlSW5kZXgsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRyYW5zbGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlU2V0VHJhbnNsYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzLnBhcmFtcy5hdXRvSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgcy51cGRhdGVBdXRvSGVpZ2h0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICBSZXNpemUgSGFuZGxlclxuICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgICAgIHMub25SZXNpemUgPSBmdW5jdGlvbiAoZm9yY2VVcGRhdGVQYWdpbmF0aW9uKSB7XG4gICAgICAgICAgICAvL0JyZWFrcG9pbnRzXG4gICAgICAgICAgICBpZiAocy5wYXJhbXMuYnJlYWtwb2ludHMpIHtcbiAgICAgICAgICAgICAgICBzLnNldEJyZWFrcG9pbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAvLyBEaXNhYmxlIGxvY2tzIG9uIHJlc2l6ZVxuICAgICAgICAgICAgdmFyIGFsbG93U3dpcGVUb1ByZXYgPSBzLnBhcmFtcy5hbGxvd1N3aXBlVG9QcmV2O1xuICAgICAgICAgICAgdmFyIGFsbG93U3dpcGVUb05leHQgPSBzLnBhcmFtcy5hbGxvd1N3aXBlVG9OZXh0O1xuICAgICAgICAgICAgcy5wYXJhbXMuYWxsb3dTd2lwZVRvUHJldiA9IHMucGFyYW1zLmFsbG93U3dpcGVUb05leHQgPSB0cnVlO1xuICAgICAgICBcbiAgICAgICAgICAgIHMudXBkYXRlQ29udGFpbmVyU2l6ZSgpO1xuICAgICAgICAgICAgcy51cGRhdGVTbGlkZXNTaXplKCk7XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMuc2xpZGVzUGVyVmlldyA9PT0gJ2F1dG8nIHx8IHMucGFyYW1zLmZyZWVNb2RlIHx8IGZvcmNlVXBkYXRlUGFnaW5hdGlvbikgcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMuc2Nyb2xsYmFyICYmIHMuc2Nyb2xsYmFyKSB7XG4gICAgICAgICAgICAgICAgcy5zY3JvbGxiYXIuc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5jb250cm9sbGVyICYmIHMuY29udHJvbGxlci5zcGxpbmUpIHtcbiAgICAgICAgICAgICAgICBzLmNvbnRyb2xsZXIuc3BsaW5lID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHMucGFyYW1zLmZyZWVNb2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1RyYW5zbGF0ZSA9IE1hdGgubWluKE1hdGgubWF4KHMudHJhbnNsYXRlLCBzLm1heFRyYW5zbGF0ZSgpKSwgcy5taW5UcmFuc2xhdGUoKSk7XG4gICAgICAgICAgICAgICAgcy5zZXRXcmFwcGVyVHJhbnNsYXRlKG5ld1RyYW5zbGF0ZSk7XG4gICAgICAgICAgICAgICAgcy51cGRhdGVBY3RpdmVJbmRleCgpO1xuICAgICAgICAgICAgICAgIHMudXBkYXRlQ2xhc3NlcygpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMuYXV0b0hlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBzLnVwZGF0ZUF1dG9IZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzLnVwZGF0ZUNsYXNzZXMoKTtcbiAgICAgICAgICAgICAgICBpZiAoKHMucGFyYW1zLnNsaWRlc1BlclZpZXcgPT09ICdhdXRvJyB8fCBzLnBhcmFtcy5zbGlkZXNQZXJWaWV3ID4gMSkgJiYgcy5pc0VuZCAmJiAhcy5wYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcy5zbGlkZVRvKHMuc2xpZGVzLmxlbmd0aCAtIDEsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHMuc2xpZGVUbyhzLmFjdGl2ZUluZGV4LCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUmV0dXJuIGxvY2tzIGFmdGVyIHJlc2l6ZVxuICAgICAgICAgICAgcy5wYXJhbXMuYWxsb3dTd2lwZVRvUHJldiA9IGFsbG93U3dpcGVUb1ByZXY7XG4gICAgICAgICAgICBzLnBhcmFtcy5hbGxvd1N3aXBlVG9OZXh0ID0gYWxsb3dTd2lwZVRvTmV4dDtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgIEV2ZW50c1xuICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgICAgIFxuICAgICAgICAvL0RlZmluZSBUb3VjaCBFdmVudHNcbiAgICAgICAgdmFyIGRlc2t0b3BFdmVudHMgPSBbJ21vdXNlZG93bicsICdtb3VzZW1vdmUnLCAnbW91c2V1cCddO1xuICAgICAgICBpZiAod2luZG93Lm5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCkgZGVza3RvcEV2ZW50cyA9IFsncG9pbnRlcmRvd24nLCAncG9pbnRlcm1vdmUnLCAncG9pbnRlcnVwJ107XG4gICAgICAgIGVsc2UgaWYgKHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCkgZGVza3RvcEV2ZW50cyA9IFsnTVNQb2ludGVyRG93bicsICdNU1BvaW50ZXJNb3ZlJywgJ01TUG9pbnRlclVwJ107XG4gICAgICAgIHMudG91Y2hFdmVudHMgPSB7XG4gICAgICAgICAgICBzdGFydCA6IHMuc3VwcG9ydC50b3VjaCB8fCAhcy5wYXJhbXMuc2ltdWxhdGVUb3VjaCAgPyAndG91Y2hzdGFydCcgOiBkZXNrdG9wRXZlbnRzWzBdLFxuICAgICAgICAgICAgbW92ZSA6IHMuc3VwcG9ydC50b3VjaCB8fCAhcy5wYXJhbXMuc2ltdWxhdGVUb3VjaCA/ICd0b3VjaG1vdmUnIDogZGVza3RvcEV2ZW50c1sxXSxcbiAgICAgICAgICAgIGVuZCA6IHMuc3VwcG9ydC50b3VjaCB8fCAhcy5wYXJhbXMuc2ltdWxhdGVUb3VjaCA/ICd0b3VjaGVuZCcgOiBkZXNrdG9wRXZlbnRzWzJdXG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgLy8gV1A4IFRvdWNoIEV2ZW50cyBGaXhcbiAgICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQgfHwgd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKSB7XG4gICAgICAgICAgICAocy5wYXJhbXMudG91Y2hFdmVudHNUYXJnZXQgPT09ICdjb250YWluZXInID8gcy5jb250YWluZXIgOiBzLndyYXBwZXIpLmFkZENsYXNzKCdzd2lwZXItd3A4LScgKyBzLnBhcmFtcy5kaXJlY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBBdHRhY2gvZGV0YWNoIGV2ZW50c1xuICAgICAgICBzLmluaXRFdmVudHMgPSBmdW5jdGlvbiAoZGV0YWNoKSB7XG4gICAgICAgICAgICB2YXIgYWN0aW9uRG9tID0gZGV0YWNoID8gJ29mZicgOiAnb24nO1xuICAgICAgICAgICAgdmFyIGFjdGlvbiA9IGRldGFjaCA/ICdyZW1vdmVFdmVudExpc3RlbmVyJyA6ICdhZGRFdmVudExpc3RlbmVyJztcbiAgICAgICAgICAgIHZhciB0b3VjaEV2ZW50c1RhcmdldCA9IHMucGFyYW1zLnRvdWNoRXZlbnRzVGFyZ2V0ID09PSAnY29udGFpbmVyJyA/IHMuY29udGFpbmVyWzBdIDogcy53cmFwcGVyWzBdO1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IHMuc3VwcG9ydC50b3VjaCA/IHRvdWNoRXZlbnRzVGFyZ2V0IDogZG9jdW1lbnQ7XG4gICAgICAgIFxuICAgICAgICAgICAgdmFyIG1vdmVDYXB0dXJlID0gcy5wYXJhbXMubmVzdGVkID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vVG91Y2ggRXZlbnRzXG4gICAgICAgICAgICBpZiAocy5icm93c2VyLmllKSB7XG4gICAgICAgICAgICAgICAgdG91Y2hFdmVudHNUYXJnZXRbYWN0aW9uXShzLnRvdWNoRXZlbnRzLnN0YXJ0LCBzLm9uVG91Y2hTdGFydCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRhcmdldFthY3Rpb25dKHMudG91Y2hFdmVudHMubW92ZSwgcy5vblRvdWNoTW92ZSwgbW92ZUNhcHR1cmUpO1xuICAgICAgICAgICAgICAgIHRhcmdldFthY3Rpb25dKHMudG91Y2hFdmVudHMuZW5kLCBzLm9uVG91Y2hFbmQsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChzLnN1cHBvcnQudG91Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgdG91Y2hFdmVudHNUYXJnZXRbYWN0aW9uXShzLnRvdWNoRXZlbnRzLnN0YXJ0LCBzLm9uVG91Y2hTdGFydCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB0b3VjaEV2ZW50c1RhcmdldFthY3Rpb25dKHMudG91Y2hFdmVudHMubW92ZSwgcy5vblRvdWNoTW92ZSwgbW92ZUNhcHR1cmUpO1xuICAgICAgICAgICAgICAgICAgICB0b3VjaEV2ZW50c1RhcmdldFthY3Rpb25dKHMudG91Y2hFdmVudHMuZW5kLCBzLm9uVG91Y2hFbmQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5zaW11bGF0ZVRvdWNoICYmICFzLmRldmljZS5pb3MgJiYgIXMuZGV2aWNlLmFuZHJvaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdG91Y2hFdmVudHNUYXJnZXRbYWN0aW9uXSgnbW91c2Vkb3duJywgcy5vblRvdWNoU3RhcnQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnRbYWN0aW9uXSgnbW91c2Vtb3ZlJywgcy5vblRvdWNoTW92ZSwgbW92ZUNhcHR1cmUpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudFthY3Rpb25dKCdtb3VzZXVwJywgcy5vblRvdWNoRW5kLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2luZG93W2FjdGlvbl0oJ3Jlc2l6ZScsIHMub25SZXNpemUpO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIE5leHQsIFByZXYsIEluZGV4XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMubmV4dEJ1dHRvbikge1xuICAgICAgICAgICAgICAgICQocy5wYXJhbXMubmV4dEJ1dHRvbilbYWN0aW9uRG9tXSgnY2xpY2snLCBzLm9uQ2xpY2tOZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMuYTExeSAmJiBzLmExMXkpICQocy5wYXJhbXMubmV4dEJ1dHRvbilbYWN0aW9uRG9tXSgna2V5ZG93bicsIHMuYTExeS5vbkVudGVyS2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5wcmV2QnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgJChzLnBhcmFtcy5wcmV2QnV0dG9uKVthY3Rpb25Eb21dKCdjbGljaycsIHMub25DbGlja1ByZXYpO1xuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5hMTF5ICYmIHMuYTExeSkgJChzLnBhcmFtcy5wcmV2QnV0dG9uKVthY3Rpb25Eb21dKCdrZXlkb3duJywgcy5hMTF5Lm9uRW50ZXJLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHMucGFyYW1zLnBhZ2luYXRpb24gJiYgcy5wYXJhbXMucGFnaW5hdGlvbkNsaWNrYWJsZSkge1xuICAgICAgICAgICAgICAgICQocy5wYWdpbmF0aW9uQ29udGFpbmVyKVthY3Rpb25Eb21dKCdjbGljaycsICcuJyArIHMucGFyYW1zLmJ1bGxldENsYXNzLCBzLm9uQ2xpY2tJbmRleCk7XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmExMXkgJiYgcy5hMTF5KSAkKHMucGFnaW5hdGlvbkNvbnRhaW5lcilbYWN0aW9uRG9tXSgna2V5ZG93bicsICcuJyArIHMucGFyYW1zLmJ1bGxldENsYXNzLCBzLmExMXkub25FbnRlcktleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gUHJldmVudCBMaW5rcyBDbGlja3NcbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5wcmV2ZW50Q2xpY2tzIHx8IHMucGFyYW1zLnByZXZlbnRDbGlja3NQcm9wYWdhdGlvbikgdG91Y2hFdmVudHNUYXJnZXRbYWN0aW9uXSgnY2xpY2snLCBzLnByZXZlbnRDbGlja3MsIHRydWUpO1xuICAgICAgICB9O1xuICAgICAgICBzLmF0dGFjaEV2ZW50cyA9IGZ1bmN0aW9uIChkZXRhY2gpIHtcbiAgICAgICAgICAgIHMuaW5pdEV2ZW50cygpO1xuICAgICAgICB9O1xuICAgICAgICBzLmRldGFjaEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHMuaW5pdEV2ZW50cyh0cnVlKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgIEhhbmRsZSBDbGlja3NcbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICAvLyBQcmV2ZW50IENsaWNrc1xuICAgICAgICBzLmFsbG93Q2xpY2sgPSB0cnVlO1xuICAgICAgICBzLnByZXZlbnRDbGlja3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKCFzLmFsbG93Q2xpY2spIHtcbiAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMucHJldmVudENsaWNrcykgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5wcmV2ZW50Q2xpY2tzUHJvcGFnYXRpb24gJiYgcy5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vIENsaWNrc1xuICAgICAgICBzLm9uQ2xpY2tOZXh0ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmIChzLmlzRW5kICYmICFzLnBhcmFtcy5sb29wKSByZXR1cm47XG4gICAgICAgICAgICBzLnNsaWRlTmV4dCgpO1xuICAgICAgICB9O1xuICAgICAgICBzLm9uQ2xpY2tQcmV2ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmIChzLmlzQmVnaW5uaW5nICYmICFzLnBhcmFtcy5sb29wKSByZXR1cm47XG4gICAgICAgICAgICBzLnNsaWRlUHJldigpO1xuICAgICAgICB9O1xuICAgICAgICBzLm9uQ2xpY2tJbmRleCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSAkKHRoaXMpLmluZGV4KCkgKiBzLnBhcmFtcy5zbGlkZXNQZXJHcm91cDtcbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5sb29wKSBpbmRleCA9IGluZGV4ICsgcy5sb29wZWRTbGlkZXM7XG4gICAgICAgICAgICBzLnNsaWRlVG8oaW5kZXgpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgSGFuZGxlIFRvdWNoZXNcbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBmdW5jdGlvbiBmaW5kRWxlbWVudEluRXZlbnQoZSwgc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIHZhciBlbCA9ICQoZS50YXJnZXQpO1xuICAgICAgICAgICAgaWYgKCFlbC5pcyhzZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBlbCA9IGVsLnBhcmVudHMoc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzZWxlY3Rvci5ub2RlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm91bmQ7XG4gICAgICAgICAgICAgICAgICAgIGVsLnBhcmVudHMoKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgX2VsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2VsID09PSBzZWxlY3RvcikgZm91bmQgPSBzZWxlY3RvcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIHNlbGVjdG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlbC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVsWzBdO1xuICAgICAgICB9XG4gICAgICAgIHMudXBkYXRlQ2xpY2tlZFNsaWRlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBzbGlkZSA9IGZpbmRFbGVtZW50SW5FdmVudChlLCAnLicgKyBzLnBhcmFtcy5zbGlkZUNsYXNzKTtcbiAgICAgICAgICAgIHZhciBzbGlkZUZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoc2xpZGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMuc2xpZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLnNsaWRlc1tpXSA9PT0gc2xpZGUpIHNsaWRlRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoc2xpZGUgJiYgc2xpZGVGb3VuZCkge1xuICAgICAgICAgICAgICAgIHMuY2xpY2tlZFNsaWRlID0gc2xpZGU7XG4gICAgICAgICAgICAgICAgcy5jbGlja2VkSW5kZXggPSAkKHNsaWRlKS5pbmRleCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcy5jbGlja2VkU2xpZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgcy5jbGlja2VkSW5kZXggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHMucGFyYW1zLnNsaWRlVG9DbGlja2VkU2xpZGUgJiYgcy5jbGlja2VkSW5kZXggIT09IHVuZGVmaW5lZCAmJiBzLmNsaWNrZWRJbmRleCAhPT0gcy5hY3RpdmVJbmRleCkge1xuICAgICAgICAgICAgICAgIHZhciBzbGlkZVRvSW5kZXggPSBzLmNsaWNrZWRJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgcmVhbEluZGV4LFxuICAgICAgICAgICAgICAgICAgICBkdXBsaWNhdGVkU2xpZGVzO1xuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5sb29wKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLmFuaW1hdGluZykgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICByZWFsSW5kZXggPSAkKHMuY2xpY2tlZFNsaWRlKS5hdHRyKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMuY2VudGVyZWRTbGlkZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoc2xpZGVUb0luZGV4IDwgcy5sb29wZWRTbGlkZXMgLSBzLnBhcmFtcy5zbGlkZXNQZXJWaWV3LzIpIHx8IChzbGlkZVRvSW5kZXggPiBzLnNsaWRlcy5sZW5ndGggLSBzLmxvb3BlZFNsaWRlcyArIHMucGFyYW1zLnNsaWRlc1BlclZpZXcvMikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLmZpeExvb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZVRvSW5kZXggPSBzLndyYXBwZXIuY2hpbGRyZW4oJy4nICsgcy5wYXJhbXMuc2xpZGVDbGFzcyArICdbZGF0YS1zd2lwZXItc2xpZGUtaW5kZXg9XCInICsgcmVhbEluZGV4ICsgJ1wiXTpub3QoLnN3aXBlci1zbGlkZS1kdXBsaWNhdGUpJykuZXEoMCkuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5zbGlkZVRvKHNsaWRlVG9JbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLnNsaWRlVG8oc2xpZGVUb0luZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzbGlkZVRvSW5kZXggPiBzLnNsaWRlcy5sZW5ndGggLSBzLnBhcmFtcy5zbGlkZXNQZXJWaWV3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5maXhMb29wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVUb0luZGV4ID0gcy53cmFwcGVyLmNoaWxkcmVuKCcuJyArIHMucGFyYW1zLnNsaWRlQ2xhc3MgKyAnW2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJyArIHJlYWxJbmRleCArICdcIl06bm90KC5zd2lwZXItc2xpZGUtZHVwbGljYXRlKScpLmVxKDApLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMuc2xpZGVUbyhzbGlkZVRvSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5zbGlkZVRvKHNsaWRlVG9JbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHMuc2xpZGVUbyhzbGlkZVRvSW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHZhciBpc1RvdWNoZWQsXG4gICAgICAgICAgICBpc01vdmVkLFxuICAgICAgICAgICAgYWxsb3dUb3VjaENhbGxiYWNrcyxcbiAgICAgICAgICAgIHRvdWNoU3RhcnRUaW1lLFxuICAgICAgICAgICAgaXNTY3JvbGxpbmcsXG4gICAgICAgICAgICBjdXJyZW50VHJhbnNsYXRlLFxuICAgICAgICAgICAgc3RhcnRUcmFuc2xhdGUsXG4gICAgICAgICAgICBhbGxvd1RocmVzaG9sZE1vdmUsXG4gICAgICAgICAgICAvLyBGb3JtIGVsZW1lbnRzIHRvIG1hdGNoXG4gICAgICAgICAgICBmb3JtRWxlbWVudHMgPSAnaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWEsIGJ1dHRvbicsXG4gICAgICAgICAgICAvLyBMYXN0IGNsaWNrIHRpbWVcbiAgICAgICAgICAgIGxhc3RDbGlja1RpbWUgPSBEYXRlLm5vdygpLCBjbGlja1RpbWVvdXQsXG4gICAgICAgICAgICAvL1ZlbG9jaXRpZXNcbiAgICAgICAgICAgIHZlbG9jaXRpZXMgPSBbXSxcbiAgICAgICAgICAgIGFsbG93TW9tZW50dW1Cb3VuY2U7XG4gICAgICAgIFxuICAgICAgICAvLyBBbmltYXRpbmcgRmxhZ1xuICAgICAgICBzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgLy8gVG91Y2hlcyBpbmZvcm1hdGlvblxuICAgICAgICBzLnRvdWNoZXMgPSB7XG4gICAgICAgICAgICBzdGFydFg6IDAsXG4gICAgICAgICAgICBzdGFydFk6IDAsXG4gICAgICAgICAgICBjdXJyZW50WDogMCxcbiAgICAgICAgICAgIGN1cnJlbnRZOiAwLFxuICAgICAgICAgICAgZGlmZjogMFxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLy8gVG91Y2ggaGFuZGxlcnNcbiAgICAgICAgdmFyIGlzVG91Y2hFdmVudCwgc3RhcnRNb3Zpbmc7XG4gICAgICAgIHMub25Ub3VjaFN0YXJ0ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQpIGUgPSBlLm9yaWdpbmFsRXZlbnQ7XG4gICAgICAgICAgICBpc1RvdWNoRXZlbnQgPSBlLnR5cGUgPT09ICd0b3VjaHN0YXJ0JztcbiAgICAgICAgICAgIGlmICghaXNUb3VjaEV2ZW50ICYmICd3aGljaCcgaW4gZSAmJiBlLndoaWNoID09PSAzKSByZXR1cm47XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMubm9Td2lwaW5nICYmIGZpbmRFbGVtZW50SW5FdmVudChlLCAnLicgKyBzLnBhcmFtcy5ub1N3aXBpbmdDbGFzcykpIHtcbiAgICAgICAgICAgICAgICBzLmFsbG93Q2xpY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5zd2lwZUhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWZpbmRFbGVtZW50SW5FdmVudChlLCBzLnBhcmFtcy5zd2lwZUhhbmRsZXIpKSByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgdmFyIHN0YXJ0WCA9IHMudG91Y2hlcy5jdXJyZW50WCA9IGUudHlwZSA9PT0gJ3RvdWNoc3RhcnQnID8gZS50YXJnZXRUb3VjaGVzWzBdLnBhZ2VYIDogZS5wYWdlWDtcbiAgICAgICAgICAgIHZhciBzdGFydFkgPSBzLnRvdWNoZXMuY3VycmVudFkgPSBlLnR5cGUgPT09ICd0b3VjaHN0YXJ0JyA/IGUudGFyZ2V0VG91Y2hlc1swXS5wYWdlWSA6IGUucGFnZVk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gRG8gTk9UIHN0YXJ0IGlmIGlPUyBlZGdlIHN3aXBlIGlzIGRldGVjdGVkLiBPdGhlcndpc2UgaU9TIGFwcCAoVUlXZWJWaWV3KSBjYW5ub3Qgc3dpcGUtdG8tZ28tYmFjayBhbnltb3JlXG4gICAgICAgICAgICBpZihzLmRldmljZS5pb3MgJiYgcy5wYXJhbXMuaU9TRWRnZVN3aXBlRGV0ZWN0aW9uICYmIHN0YXJ0WCA8PSBzLnBhcmFtcy5pT1NFZGdlU3dpcGVUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgaXNUb3VjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlzTW92ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGFsbG93VG91Y2hDYWxsYmFja3MgPSB0cnVlO1xuICAgICAgICAgICAgaXNTY3JvbGxpbmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBzdGFydE1vdmluZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHMudG91Y2hlcy5zdGFydFggPSBzdGFydFg7XG4gICAgICAgICAgICBzLnRvdWNoZXMuc3RhcnRZID0gc3RhcnRZO1xuICAgICAgICAgICAgdG91Y2hTdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgcy5hbGxvd0NsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIHMudXBkYXRlQ29udGFpbmVyU2l6ZSgpO1xuICAgICAgICAgICAgcy5zd2lwZURpcmVjdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy50aHJlc2hvbGQgPiAwKSBhbGxvd1RocmVzaG9sZE1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChlLnR5cGUgIT09ICd0b3VjaHN0YXJ0Jykge1xuICAgICAgICAgICAgICAgIHZhciBwcmV2ZW50RGVmYXVsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKCQoZS50YXJnZXQpLmlzKGZvcm1FbGVtZW50cykpIHByZXZlbnREZWZhdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KS5pcyhmb3JtRWxlbWVudHMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMuZW1pdCgnb25Ub3VjaFN0YXJ0JywgcywgZSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBzLm9uVG91Y2hNb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQpIGUgPSBlLm9yaWdpbmFsRXZlbnQ7XG4gICAgICAgICAgICBpZiAoaXNUb3VjaEV2ZW50ICYmIGUudHlwZSA9PT0gJ21vdXNlbW92ZScpIHJldHVybjtcbiAgICAgICAgICAgIGlmIChlLnByZXZlbnRlZEJ5TmVzdGVkU3dpcGVyKSByZXR1cm47XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMub25seUV4dGVybmFsKSB7XG4gICAgICAgICAgICAgICAgLy8gaXNNb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcy5hbGxvd0NsaWNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKGlzVG91Y2hlZCkge1xuICAgICAgICAgICAgICAgICAgICBzLnRvdWNoZXMuc3RhcnRYID0gcy50b3VjaGVzLmN1cnJlbnRYID0gZS50eXBlID09PSAndG91Y2htb3ZlJyA/IGUudGFyZ2V0VG91Y2hlc1swXS5wYWdlWCA6IGUucGFnZVg7XG4gICAgICAgICAgICAgICAgICAgIHMudG91Y2hlcy5zdGFydFkgPSBzLnRvdWNoZXMuY3VycmVudFkgPSBlLnR5cGUgPT09ICd0b3VjaG1vdmUnID8gZS50YXJnZXRUb3VjaGVzWzBdLnBhZ2VZIDogZS5wYWdlWTtcbiAgICAgICAgICAgICAgICAgICAgdG91Y2hTdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNUb3VjaEV2ZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgJChlLnRhcmdldCkuaXMoZm9ybUVsZW1lbnRzKSkge1xuICAgICAgICAgICAgICAgICAgICBpc01vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcy5hbGxvd0NsaWNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWxsb3dUb3VjaENhbGxiYWNrcykge1xuICAgICAgICAgICAgICAgIHMuZW1pdCgnb25Ub3VjaE1vdmUnLCBzLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlLnRhcmdldFRvdWNoZXMgJiYgZS50YXJnZXRUb3VjaGVzLmxlbmd0aCA+IDEpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgICAgICBzLnRvdWNoZXMuY3VycmVudFggPSBlLnR5cGUgPT09ICd0b3VjaG1vdmUnID8gZS50YXJnZXRUb3VjaGVzWzBdLnBhZ2VYIDogZS5wYWdlWDtcbiAgICAgICAgICAgIHMudG91Y2hlcy5jdXJyZW50WSA9IGUudHlwZSA9PT0gJ3RvdWNobW92ZScgPyBlLnRhcmdldFRvdWNoZXNbMF0ucGFnZVkgOiBlLnBhZ2VZO1xuICAgICAgICBcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaXNTY3JvbGxpbmcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvdWNoQW5nbGUgPSBNYXRoLmF0YW4yKE1hdGguYWJzKHMudG91Y2hlcy5jdXJyZW50WSAtIHMudG91Y2hlcy5zdGFydFkpLCBNYXRoLmFicyhzLnRvdWNoZXMuY3VycmVudFggLSBzLnRvdWNoZXMuc3RhcnRYKSkgKiAxODAgLyBNYXRoLlBJO1xuICAgICAgICAgICAgICAgIGlzU2Nyb2xsaW5nID0gcy5pc0hvcml6b250YWwoKSA/IHRvdWNoQW5nbGUgPiBzLnBhcmFtcy50b3VjaEFuZ2xlIDogKDkwIC0gdG91Y2hBbmdsZSA+IHMucGFyYW1zLnRvdWNoQW5nbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzU2Nyb2xsaW5nKSB7XG4gICAgICAgICAgICAgICAgcy5lbWl0KCdvblRvdWNoTW92ZU9wcG9zaXRlJywgcywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIHN0YXJ0TW92aW5nID09PSAndW5kZWZpbmVkJyAmJiBzLmJyb3dzZXIuaWVUb3VjaCkge1xuICAgICAgICAgICAgICAgIGlmIChzLnRvdWNoZXMuY3VycmVudFggIT09IHMudG91Y2hlcy5zdGFydFggfHwgcy50b3VjaGVzLmN1cnJlbnRZICE9PSBzLnRvdWNoZXMuc3RhcnRZKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0TW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzVG91Y2hlZCkgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKGlzU2Nyb2xsaW5nKSAge1xuICAgICAgICAgICAgICAgIGlzVG91Y2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghc3RhcnRNb3ZpbmcgJiYgcy5icm93c2VyLmllVG91Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzLmFsbG93Q2xpY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIHMuZW1pdCgnb25TbGlkZXJNb3ZlJywgcywgZSk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMudG91Y2hNb3ZlU3RvcFByb3BhZ2F0aW9uICYmICFzLnBhcmFtcy5uZXN0ZWQpIHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIGlmICghaXNNb3ZlZCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMubG9vcCkge1xuICAgICAgICAgICAgICAgICAgICBzLmZpeExvb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RhcnRUcmFuc2xhdGUgPSBzLmdldFdyYXBwZXJUcmFuc2xhdGUoKTtcbiAgICAgICAgICAgICAgICBzLnNldFdyYXBwZXJUcmFuc2l0aW9uKDApO1xuICAgICAgICAgICAgICAgIGlmIChzLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICBzLndyYXBwZXIudHJpZ2dlcignd2Via2l0VHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kIG9UcmFuc2l0aW9uRW5kIE1TVHJhbnNpdGlvbkVuZCBtc1RyYW5zaXRpb25FbmQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmF1dG9wbGF5ICYmIHMuYXV0b3BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmF1dG9wbGF5RGlzYWJsZU9uSW50ZXJhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuc3RvcEF1dG9wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLnBhdXNlQXV0b3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhbGxvd01vbWVudHVtQm91bmNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy9HcmFiIEN1cnNvclxuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5ncmFiQ3Vyc29yKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuY29udGFpbmVyWzBdLnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcbiAgICAgICAgICAgICAgICAgICAgcy5jb250YWluZXJbMF0uc3R5bGUuY3Vyc29yID0gJy13ZWJraXQtZ3JhYmJpbmcnO1xuICAgICAgICAgICAgICAgICAgICBzLmNvbnRhaW5lclswXS5zdHlsZS5jdXJzb3IgPSAnLW1vei1ncmFiYmluJztcbiAgICAgICAgICAgICAgICAgICAgcy5jb250YWluZXJbMF0uc3R5bGUuY3Vyc29yID0gJ2dyYWJiaW5nJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpc01vdmVkID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgICAgICB2YXIgZGlmZiA9IHMudG91Y2hlcy5kaWZmID0gcy5pc0hvcml6b250YWwoKSA/IHMudG91Y2hlcy5jdXJyZW50WCAtIHMudG91Y2hlcy5zdGFydFggOiBzLnRvdWNoZXMuY3VycmVudFkgLSBzLnRvdWNoZXMuc3RhcnRZO1xuICAgICAgICBcbiAgICAgICAgICAgIGRpZmYgPSBkaWZmICogcy5wYXJhbXMudG91Y2hSYXRpbztcbiAgICAgICAgICAgIGlmIChzLnJ0bCkgZGlmZiA9IC1kaWZmO1xuICAgICAgICBcbiAgICAgICAgICAgIHMuc3dpcGVEaXJlY3Rpb24gPSBkaWZmID4gMCA/ICdwcmV2JyA6ICduZXh0JztcbiAgICAgICAgICAgIGN1cnJlbnRUcmFuc2xhdGUgPSBkaWZmICsgc3RhcnRUcmFuc2xhdGU7XG4gICAgICAgIFxuICAgICAgICAgICAgdmFyIGRpc2FibGVQYXJlbnRTd2lwZXIgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKChkaWZmID4gMCAmJiBjdXJyZW50VHJhbnNsYXRlID4gcy5taW5UcmFuc2xhdGUoKSkpIHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlUGFyZW50U3dpcGVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLnJlc2lzdGFuY2UpIGN1cnJlbnRUcmFuc2xhdGUgPSBzLm1pblRyYW5zbGF0ZSgpIC0gMSArIE1hdGgucG93KC1zLm1pblRyYW5zbGF0ZSgpICsgc3RhcnRUcmFuc2xhdGUgKyBkaWZmLCBzLnBhcmFtcy5yZXNpc3RhbmNlUmF0aW8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZGlmZiA8IDAgJiYgY3VycmVudFRyYW5zbGF0ZSA8IHMubWF4VHJhbnNsYXRlKCkpIHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlUGFyZW50U3dpcGVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLnJlc2lzdGFuY2UpIGN1cnJlbnRUcmFuc2xhdGUgPSBzLm1heFRyYW5zbGF0ZSgpICsgMSAtIE1hdGgucG93KHMubWF4VHJhbnNsYXRlKCkgLSBzdGFydFRyYW5zbGF0ZSAtIGRpZmYsIHMucGFyYW1zLnJlc2lzdGFuY2VSYXRpbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKGRpc2FibGVQYXJlbnRTd2lwZXIpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnRlZEJ5TmVzdGVkU3dpcGVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAvLyBEaXJlY3Rpb25zIGxvY2tzXG4gICAgICAgICAgICBpZiAoIXMucGFyYW1zLmFsbG93U3dpcGVUb05leHQgJiYgcy5zd2lwZURpcmVjdGlvbiA9PT0gJ25leHQnICYmIGN1cnJlbnRUcmFuc2xhdGUgPCBzdGFydFRyYW5zbGF0ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUcmFuc2xhdGUgPSBzdGFydFRyYW5zbGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcy5wYXJhbXMuYWxsb3dTd2lwZVRvUHJldiAmJiBzLnN3aXBlRGlyZWN0aW9uID09PSAncHJldicgJiYgY3VycmVudFRyYW5zbGF0ZSA+IHN0YXJ0VHJhbnNsYXRlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFRyYW5zbGF0ZSA9IHN0YXJ0VHJhbnNsYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIGlmICghcy5wYXJhbXMuZm9sbG93RmluZ2VyKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gVGhyZXNob2xkXG4gICAgICAgICAgICBpZiAocy5wYXJhbXMudGhyZXNob2xkID4gMCkge1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaWZmKSA+IHMucGFyYW1zLnRocmVzaG9sZCB8fCBhbGxvd1RocmVzaG9sZE1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhbGxvd1RocmVzaG9sZE1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbG93VGhyZXNob2xkTW92ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLnRvdWNoZXMuc3RhcnRYID0gcy50b3VjaGVzLmN1cnJlbnRYO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy50b3VjaGVzLnN0YXJ0WSA9IHMudG91Y2hlcy5jdXJyZW50WTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUcmFuc2xhdGUgPSBzdGFydFRyYW5zbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMudG91Y2hlcy5kaWZmID0gcy5pc0hvcml6b250YWwoKSA/IHMudG91Y2hlcy5jdXJyZW50WCAtIHMudG91Y2hlcy5zdGFydFggOiBzLnRvdWNoZXMuY3VycmVudFkgLSBzLnRvdWNoZXMuc3RhcnRZO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VHJhbnNsYXRlID0gc3RhcnRUcmFuc2xhdGU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgYWN0aXZlIGluZGV4IGluIGZyZWUgbW9kZVxuICAgICAgICAgICAgaWYgKHMucGFyYW1zLmZyZWVNb2RlIHx8IHMucGFyYW1zLndhdGNoU2xpZGVzUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICBzLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMuZnJlZU1vZGUpIHtcbiAgICAgICAgICAgICAgICAvL1ZlbG9jaXR5XG4gICAgICAgICAgICAgICAgaWYgKHZlbG9jaXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXRpZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcy50b3VjaGVzW3MuaXNIb3Jpem9udGFsKCkgPyAnc3RhcnRYJyA6ICdzdGFydFknXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IHRvdWNoU3RhcnRUaW1lXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2ZWxvY2l0aWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcy50b3VjaGVzW3MuaXNIb3Jpem9udGFsKCkgPyAnY3VycmVudFgnIDogJ2N1cnJlbnRZJ10sXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6IChuZXcgd2luZG93LkRhdGUoKSkuZ2V0VGltZSgpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgcHJvZ3Jlc3NcbiAgICAgICAgICAgIHMudXBkYXRlUHJvZ3Jlc3MoY3VycmVudFRyYW5zbGF0ZSk7XG4gICAgICAgICAgICAvLyBVcGRhdGUgdHJhbnNsYXRlXG4gICAgICAgICAgICBzLnNldFdyYXBwZXJUcmFuc2xhdGUoY3VycmVudFRyYW5zbGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHMub25Ub3VjaEVuZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50KSBlID0gZS5vcmlnaW5hbEV2ZW50O1xuICAgICAgICAgICAgaWYgKGFsbG93VG91Y2hDYWxsYmFja3MpIHtcbiAgICAgICAgICAgICAgICBzLmVtaXQoJ29uVG91Y2hFbmQnLCBzLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFsbG93VG91Y2hDYWxsYmFja3MgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICghaXNUb3VjaGVkKSByZXR1cm47XG4gICAgICAgICAgICAvL1JldHVybiBHcmFiIEN1cnNvclxuICAgICAgICAgICAgaWYgKHMucGFyYW1zLmdyYWJDdXJzb3IgJiYgaXNNb3ZlZCAmJiBpc1RvdWNoZWQpIHtcbiAgICAgICAgICAgICAgICBzLmNvbnRhaW5lclswXS5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XG4gICAgICAgICAgICAgICAgcy5jb250YWluZXJbMF0uc3R5bGUuY3Vyc29yID0gJy13ZWJraXQtZ3JhYic7XG4gICAgICAgICAgICAgICAgcy5jb250YWluZXJbMF0uc3R5bGUuY3Vyc29yID0gJy1tb3otZ3JhYic7XG4gICAgICAgICAgICAgICAgcy5jb250YWluZXJbMF0uc3R5bGUuY3Vyc29yID0gJ2dyYWInO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIFRpbWUgZGlmZlxuICAgICAgICAgICAgdmFyIHRvdWNoRW5kVGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB2YXIgdGltZURpZmYgPSB0b3VjaEVuZFRpbWUgLSB0b3VjaFN0YXJ0VGltZTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBUYXAsIGRvdWJsZVRhcCwgQ2xpY2tcbiAgICAgICAgICAgIGlmIChzLmFsbG93Q2xpY2spIHtcbiAgICAgICAgICAgICAgICBzLnVwZGF0ZUNsaWNrZWRTbGlkZShlKTtcbiAgICAgICAgICAgICAgICBzLmVtaXQoJ29uVGFwJywgcywgZSk7XG4gICAgICAgICAgICAgICAgaWYgKHRpbWVEaWZmIDwgMzAwICYmICh0b3VjaEVuZFRpbWUgLSBsYXN0Q2xpY2tUaW1lKSA+IDMwMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2xpY2tUaW1lb3V0KSBjbGVhclRpbWVvdXQoY2xpY2tUaW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgY2xpY2tUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXMpIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5wYWdpbmF0aW9uSGlkZSAmJiBzLnBhZ2luYXRpb25Db250YWluZXIubGVuZ3RoID4gMCAmJiAhJChlLnRhcmdldCkuaGFzQ2xhc3Mocy5wYXJhbXMuYnVsbGV0Q2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5wYWdpbmF0aW9uQ29udGFpbmVyLnRvZ2dsZUNsYXNzKHMucGFyYW1zLnBhZ2luYXRpb25IaWRkZW5DbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzLmVtaXQoJ29uQ2xpY2snLCBzLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aW1lRGlmZiA8IDMwMCAmJiAodG91Y2hFbmRUaW1lIC0gbGFzdENsaWNrVGltZSkgPCAzMDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsaWNrVGltZW91dCkgY2xlYXJUaW1lb3V0KGNsaWNrVGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgIHMuZW1pdCgnb25Eb3VibGVUYXAnLCBzLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgbGFzdENsaWNrVGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAocykgcy5hbGxvd0NsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICBcbiAgICAgICAgICAgIGlmICghaXNUb3VjaGVkIHx8ICFpc01vdmVkIHx8ICFzLnN3aXBlRGlyZWN0aW9uIHx8IHMudG91Y2hlcy5kaWZmID09PSAwIHx8IGN1cnJlbnRUcmFuc2xhdGUgPT09IHN0YXJ0VHJhbnNsYXRlKSB7XG4gICAgICAgICAgICAgICAgaXNUb3VjaGVkID0gaXNNb3ZlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlzVG91Y2hlZCA9IGlzTW92ZWQgPSBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgICAgICB2YXIgY3VycmVudFBvcztcbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5mb2xsb3dGaW5nZXIpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UG9zID0gcy5ydGwgPyBzLnRyYW5zbGF0ZSA6IC1zLnRyYW5zbGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQb3MgPSAtY3VycmVudFRyYW5zbGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5mcmVlTW9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UG9zIDwgLXMubWluVHJhbnNsYXRlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcy5zbGlkZVRvKHMuYWN0aXZlSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRQb3MgPiAtcy5tYXhUcmFuc2xhdGUoKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5zbGlkZXMubGVuZ3RoIDwgcy5zbmFwR3JpZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuc2xpZGVUbyhzLnNuYXBHcmlkLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5zbGlkZVRvKHMuc2xpZGVzLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5mcmVlTW9kZU1vbWVudHVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2ZWxvY2l0aWVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0TW92ZUV2ZW50ID0gdmVsb2NpdGllcy5wb3AoKSwgdmVsb2NpdHlFdmVudCA9IHZlbG9jaXRpZXMucG9wKCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gbGFzdE1vdmVFdmVudC5wb3NpdGlvbiAtIHZlbG9jaXR5RXZlbnQucG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGltZSA9IGxhc3RNb3ZlRXZlbnQudGltZSAtIHZlbG9jaXR5RXZlbnQudGltZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMudmVsb2NpdHkgPSBkaXN0YW5jZSAvIHRpbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLnZlbG9jaXR5ID0gcy52ZWxvY2l0eSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMocy52ZWxvY2l0eSkgPCBzLnBhcmFtcy5mcmVlTW9kZU1pbmltdW1WZWxvY2l0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMudmVsb2NpdHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBpbXBsaWVzIHRoYXQgdGhlIHVzZXIgc3RvcHBlZCBtb3ZpbmcgYSBmaW5nZXIgdGhlbiByZWxlYXNlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZXJlIHdvdWxkIGJlIG5vIGV2ZW50cyB3aXRoIGRpc3RhbmNlIHplcm8sIHNvIHRoZSBsYXN0IGV2ZW50IGlzIHN0YWxlLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRpbWUgPiAxNTAgfHwgKG5ldyB3aW5kb3cuRGF0ZSgpLmdldFRpbWUoKSAtIGxhc3RNb3ZlRXZlbnQudGltZSkgPiAzMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLnZlbG9jaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMudmVsb2NpdHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0aWVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtb21lbnR1bUR1cmF0aW9uID0gMTAwMCAqIHMucGFyYW1zLmZyZWVNb2RlTW9tZW50dW1SYXRpbztcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vbWVudHVtRGlzdGFuY2UgPSBzLnZlbG9jaXR5ICogbW9tZW50dW1EdXJhdGlvbjtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdQb3NpdGlvbiA9IHMudHJhbnNsYXRlICsgbW9tZW50dW1EaXN0YW5jZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMucnRsKSBuZXdQb3NpdGlvbiA9IC0gbmV3UG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgIHZhciBkb0JvdW5jZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWZ0ZXJCb3VuY2VQb3NpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJvdW5jZUFtb3VudCA9IE1hdGguYWJzKHMudmVsb2NpdHkpICogMjAgKiBzLnBhcmFtcy5mcmVlTW9kZU1vbWVudHVtQm91bmNlUmF0aW87XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdQb3NpdGlvbiA8IHMubWF4VHJhbnNsYXRlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5mcmVlTW9kZU1vbWVudHVtQm91bmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1Bvc2l0aW9uICsgcy5tYXhUcmFuc2xhdGUoKSA8IC1ib3VuY2VBbW91bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3UG9zaXRpb24gPSBzLm1heFRyYW5zbGF0ZSgpIC0gYm91bmNlQW1vdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZnRlckJvdW5jZVBvc2l0aW9uID0gcy5tYXhUcmFuc2xhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb0JvdW5jZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsb3dNb21lbnR1bUJvdW5jZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdQb3NpdGlvbiA9IHMubWF4VHJhbnNsYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobmV3UG9zaXRpb24gPiBzLm1pblRyYW5zbGF0ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMuZnJlZU1vZGVNb21lbnR1bUJvdW5jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdQb3NpdGlvbiAtIHMubWluVHJhbnNsYXRlKCkgPiBib3VuY2VBbW91bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3UG9zaXRpb24gPSBzLm1pblRyYW5zbGF0ZSgpICsgYm91bmNlQW1vdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZnRlckJvdW5jZVBvc2l0aW9uID0gcy5taW5UcmFuc2xhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb0JvdW5jZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsb3dNb21lbnR1bUJvdW5jZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdQb3NpdGlvbiA9IHMubWluVHJhbnNsYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocy5wYXJhbXMuZnJlZU1vZGVTdGlja3kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBqID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2xpZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgcy5zbmFwR3JpZC5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzLnNuYXBHcmlkW2pdID4gLW5ld1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTbGlkZSA9IGo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMocy5zbmFwR3JpZFtuZXh0U2xpZGVdIC0gbmV3UG9zaXRpb24pIDwgTWF0aC5hYnMocy5zbmFwR3JpZFtuZXh0U2xpZGUgLSAxXSAtIG5ld1Bvc2l0aW9uKSB8fCBzLnN3aXBlRGlyZWN0aW9uID09PSAnbmV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdQb3NpdGlvbiA9IHMuc25hcEdyaWRbbmV4dFNsaWRlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3UG9zaXRpb24gPSBzLnNuYXBHcmlkW25leHRTbGlkZSAtIDFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzLnJ0bCkgbmV3UG9zaXRpb24gPSAtIG5ld1Bvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vRml4IGR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGlmIChzLnZlbG9jaXR5ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5ydGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb21lbnR1bUR1cmF0aW9uID0gTWF0aC5hYnMoKC1uZXdQb3NpdGlvbiAtIHMudHJhbnNsYXRlKSAvIHMudmVsb2NpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9tZW50dW1EdXJhdGlvbiA9IE1hdGguYWJzKChuZXdQb3NpdGlvbiAtIHMudHJhbnNsYXRlKSAvIHMudmVsb2NpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHMucGFyYW1zLmZyZWVNb2RlU3RpY2t5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLnNsaWRlUmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmZyZWVNb2RlTW9tZW50dW1Cb3VuY2UgJiYgZG9Cb3VuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMudXBkYXRlUHJvZ3Jlc3MoYWZ0ZXJCb3VuY2VQb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLnNldFdyYXBwZXJUcmFuc2l0aW9uKG1vbWVudHVtRHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5zZXRXcmFwcGVyVHJhbnNsYXRlKG5ld1Bvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMub25UcmFuc2l0aW9uU3RhcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMud3JhcHBlci50cmFuc2l0aW9uRW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXMgfHwgIWFsbG93TW9tZW50dW1Cb3VuY2UpIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLmVtaXQoJ29uTW9tZW50dW1Cb3VuY2UnLCBzKTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5zZXRXcmFwcGVyVHJhbnNpdGlvbihzLnBhcmFtcy5zcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5zZXRXcmFwcGVyVHJhbnNsYXRlKGFmdGVyQm91bmNlUG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMud3JhcHBlci50cmFuc2l0aW9uRW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMub25UcmFuc2l0aW9uRW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzLnZlbG9jaXR5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLnVwZGF0ZVByb2dyZXNzKG5ld1Bvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuc2V0V3JhcHBlclRyYW5zaXRpb24obW9tZW50dW1EdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLnNldFdyYXBwZXJUcmFuc2xhdGUobmV3UG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5vblRyYW5zaXRpb25TdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLndyYXBwZXIudHJhbnNpdGlvbkVuZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcykgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLm9uVHJhbnNpdGlvbkVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMudXBkYXRlUHJvZ3Jlc3MobmV3UG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBzLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghcy5wYXJhbXMuZnJlZU1vZGVNb21lbnR1bSB8fCB0aW1lRGlmZiA+PSBzLnBhcmFtcy5sb25nU3dpcGVzTXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcy51cGRhdGVQcm9ncmVzcygpO1xuICAgICAgICAgICAgICAgICAgICBzLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAvLyBGaW5kIGN1cnJlbnQgc2xpZGVcbiAgICAgICAgICAgIHZhciBpLCBzdG9wSW5kZXggPSAwLCBncm91cFNpemUgPSBzLnNsaWRlc1NpemVzR3JpZFswXTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzLnNsaWRlc0dyaWQubGVuZ3RoOyBpICs9IHMucGFyYW1zLnNsaWRlc1Blckdyb3VwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzLnNsaWRlc0dyaWRbaSArIHMucGFyYW1zLnNsaWRlc1Blckdyb3VwXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRQb3MgPj0gcy5zbGlkZXNHcmlkW2ldICYmIGN1cnJlbnRQb3MgPCBzLnNsaWRlc0dyaWRbaSArIHMucGFyYW1zLnNsaWRlc1Blckdyb3VwXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwU2l6ZSA9IHMuc2xpZGVzR3JpZFtpICsgcy5wYXJhbXMuc2xpZGVzUGVyR3JvdXBdIC0gcy5zbGlkZXNHcmlkW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFBvcyA+PSBzLnNsaWRlc0dyaWRbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFNpemUgPSBzLnNsaWRlc0dyaWRbcy5zbGlkZXNHcmlkLmxlbmd0aCAtIDFdIC0gcy5zbGlkZXNHcmlkW3Muc2xpZGVzR3JpZC5sZW5ndGggLSAyXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAvLyBGaW5kIGN1cnJlbnQgc2xpZGUgc2l6ZVxuICAgICAgICAgICAgdmFyIHJhdGlvID0gKGN1cnJlbnRQb3MgLSBzLnNsaWRlc0dyaWRbc3RvcEluZGV4XSkgLyBncm91cFNpemU7XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKHRpbWVEaWZmID4gcy5wYXJhbXMubG9uZ1N3aXBlc01zKSB7XG4gICAgICAgICAgICAgICAgLy8gTG9uZyB0b3VjaGVzXG4gICAgICAgICAgICAgICAgaWYgKCFzLnBhcmFtcy5sb25nU3dpcGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuc2xpZGVUbyhzLmFjdGl2ZUluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocy5zd2lwZURpcmVjdGlvbiA9PT0gJ25leHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyYXRpbyA+PSBzLnBhcmFtcy5sb25nU3dpcGVzUmF0aW8pIHMuc2xpZGVUbyhzdG9wSW5kZXggKyBzLnBhcmFtcy5zbGlkZXNQZXJHcm91cCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2Ugcy5zbGlkZVRvKHN0b3BJbmRleCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocy5zd2lwZURpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyYXRpbyA+ICgxIC0gcy5wYXJhbXMubG9uZ1N3aXBlc1JhdGlvKSkgcy5zbGlkZVRvKHN0b3BJbmRleCArIHMucGFyYW1zLnNsaWRlc1Blckdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBzLnNsaWRlVG8oc3RvcEluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTaG9ydCBzd2lwZXNcbiAgICAgICAgICAgICAgICBpZiAoIXMucGFyYW1zLnNob3J0U3dpcGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuc2xpZGVUbyhzLmFjdGl2ZUluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocy5zd2lwZURpcmVjdGlvbiA9PT0gJ25leHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuc2xpZGVUbyhzdG9wSW5kZXggKyBzLnBhcmFtcy5zbGlkZXNQZXJHcm91cCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocy5zd2lwZURpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuc2xpZGVUbyhzdG9wSW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgVHJhbnNpdGlvbnNcbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBzLl9zbGlkZVRvID0gZnVuY3Rpb24gKHNsaWRlSW5kZXgsIHNwZWVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcy5zbGlkZVRvKHNsaWRlSW5kZXgsIHNwZWVkLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgfTtcbiAgICAgICAgcy5zbGlkZVRvID0gZnVuY3Rpb24gKHNsaWRlSW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJ1bkNhbGxiYWNrcyA9PT0gJ3VuZGVmaW5lZCcpIHJ1bkNhbGxiYWNrcyA9IHRydWU7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHNsaWRlSW5kZXggPT09ICd1bmRlZmluZWQnKSBzbGlkZUluZGV4ID0gMDtcbiAgICAgICAgICAgIGlmIChzbGlkZUluZGV4IDwgMCkgc2xpZGVJbmRleCA9IDA7XG4gICAgICAgICAgICBzLnNuYXBJbmRleCA9IE1hdGguZmxvb3Ioc2xpZGVJbmRleCAvIHMucGFyYW1zLnNsaWRlc1Blckdyb3VwKTtcbiAgICAgICAgICAgIGlmIChzLnNuYXBJbmRleCA+PSBzLnNuYXBHcmlkLmxlbmd0aCkgcy5zbmFwSW5kZXggPSBzLnNuYXBHcmlkLmxlbmd0aCAtIDE7XG4gICAgICAgIFxuICAgICAgICAgICAgdmFyIHRyYW5zbGF0ZSA9IC0gcy5zbmFwR3JpZFtzLnNuYXBJbmRleF07XG4gICAgICAgICAgICAvLyBTdG9wIGF1dG9wbGF5XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMuYXV0b3BsYXkgJiYgcy5hdXRvcGxheWluZykge1xuICAgICAgICAgICAgICAgIGlmIChpbnRlcm5hbCB8fCAhcy5wYXJhbXMuYXV0b3BsYXlEaXNhYmxlT25JbnRlcmFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBzLnBhdXNlQXV0b3BsYXkoc3BlZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcy5zdG9wQXV0b3BsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgcHJvZ3Jlc3NcbiAgICAgICAgICAgIHMudXBkYXRlUHJvZ3Jlc3ModHJhbnNsYXRlKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBOb3JtYWxpemUgc2xpZGVJbmRleFxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLnNsaWRlc0dyaWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoLSBNYXRoLmZsb29yKHRyYW5zbGF0ZSAqIDEwMCkgPj0gTWF0aC5mbG9vcihzLnNsaWRlc0dyaWRbaV0gKiAxMDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlSW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAvLyBEaXJlY3Rpb25zIGxvY2tzXG4gICAgICAgICAgICBpZiAoIXMucGFyYW1zLmFsbG93U3dpcGVUb05leHQgJiYgdHJhbnNsYXRlIDwgcy50cmFuc2xhdGUgJiYgdHJhbnNsYXRlIDwgcy5taW5UcmFuc2xhdGUoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcy5wYXJhbXMuYWxsb3dTd2lwZVRvUHJldiAmJiB0cmFuc2xhdGUgPiBzLnRyYW5zbGF0ZSAmJiB0cmFuc2xhdGUgPiBzLm1heFRyYW5zbGF0ZSgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKChzLmFjdGl2ZUluZGV4IHx8IDApICE9PSBzbGlkZUluZGV4ICkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIFVwZGF0ZSBJbmRleFxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGVlZCA9PT0gJ3VuZGVmaW5lZCcpIHNwZWVkID0gcy5wYXJhbXMuc3BlZWQ7XG4gICAgICAgICAgICBzLnByZXZpb3VzSW5kZXggPSBzLmFjdGl2ZUluZGV4IHx8IDA7XG4gICAgICAgICAgICBzLmFjdGl2ZUluZGV4ID0gc2xpZGVJbmRleDtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoKHMucnRsICYmIC10cmFuc2xhdGUgPT09IHMudHJhbnNsYXRlKSB8fCAoIXMucnRsICYmIHRyYW5zbGF0ZSA9PT0gcy50cmFuc2xhdGUpKSB7XG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIEhlaWdodFxuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5hdXRvSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHMudXBkYXRlQXV0b0hlaWdodCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzLnVwZGF0ZUNsYXNzZXMoKTtcbiAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMuZWZmZWN0ICE9PSAnc2xpZGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuc2V0V3JhcHBlclRyYW5zbGF0ZSh0cmFuc2xhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzLnVwZGF0ZUNsYXNzZXMoKTtcbiAgICAgICAgICAgIHMub25UcmFuc2l0aW9uU3RhcnQocnVuQ2FsbGJhY2tzKTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoc3BlZWQgPT09IDApIHtcbiAgICAgICAgICAgICAgICBzLnNldFdyYXBwZXJUcmFuc2xhdGUodHJhbnNsYXRlKTtcbiAgICAgICAgICAgICAgICBzLnNldFdyYXBwZXJUcmFuc2l0aW9uKDApO1xuICAgICAgICAgICAgICAgIHMub25UcmFuc2l0aW9uRW5kKHJ1bkNhbGxiYWNrcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzLnNldFdyYXBwZXJUcmFuc2xhdGUodHJhbnNsYXRlKTtcbiAgICAgICAgICAgICAgICBzLnNldFdyYXBwZXJUcmFuc2l0aW9uKHNwZWVkKTtcbiAgICAgICAgICAgICAgICBpZiAoIXMuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcy53cmFwcGVyLnRyYW5zaXRpb25FbmQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICBzLm9uVHJhbnNpdGlvbkVuZChydW5DYWxsYmFja3MpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgcy5vblRyYW5zaXRpb25TdGFydCA9IGZ1bmN0aW9uIChydW5DYWxsYmFja3MpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcnVuQ2FsbGJhY2tzID09PSAndW5kZWZpbmVkJykgcnVuQ2FsbGJhY2tzID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5hdXRvSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgcy51cGRhdGVBdXRvSGVpZ2h0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5sYXp5KSBzLmxhenkub25UcmFuc2l0aW9uU3RhcnQoKTtcbiAgICAgICAgICAgIGlmIChydW5DYWxsYmFja3MpIHtcbiAgICAgICAgICAgICAgICBzLmVtaXQoJ29uVHJhbnNpdGlvblN0YXJ0Jywgcyk7XG4gICAgICAgICAgICAgICAgaWYgKHMuYWN0aXZlSW5kZXggIT09IHMucHJldmlvdXNJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBzLmVtaXQoJ29uU2xpZGVDaGFuZ2VTdGFydCcsIHMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5hY3RpdmVJbmRleCA+IHMucHJldmlvdXNJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5lbWl0KCdvblNsaWRlTmV4dFN0YXJ0Jywgcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLmVtaXQoJ29uU2xpZGVQcmV2U3RhcnQnLCBzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHMub25UcmFuc2l0aW9uRW5kID0gZnVuY3Rpb24gKHJ1bkNhbGxiYWNrcykge1xuICAgICAgICAgICAgcy5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHMuc2V0V3JhcHBlclRyYW5zaXRpb24oMCk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJ1bkNhbGxiYWNrcyA9PT0gJ3VuZGVmaW5lZCcpIHJ1bkNhbGxiYWNrcyA9IHRydWU7XG4gICAgICAgICAgICBpZiAocy5sYXp5KSBzLmxhenkub25UcmFuc2l0aW9uRW5kKCk7XG4gICAgICAgICAgICBpZiAocnVuQ2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAgICAgcy5lbWl0KCdvblRyYW5zaXRpb25FbmQnLCBzKTtcbiAgICAgICAgICAgICAgICBpZiAocy5hY3RpdmVJbmRleCAhPT0gcy5wcmV2aW91c0luZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHMuZW1pdCgnb25TbGlkZUNoYW5nZUVuZCcsIHMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5hY3RpdmVJbmRleCA+IHMucHJldmlvdXNJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5lbWl0KCdvblNsaWRlTmV4dEVuZCcsIHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5lbWl0KCdvblNsaWRlUHJldkVuZCcsIHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHMucGFyYW1zLmhhc2huYXYgJiYgcy5oYXNobmF2KSB7XG4gICAgICAgICAgICAgICAgcy5oYXNobmF2LnNldEhhc2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIH07XG4gICAgICAgIHMuc2xpZGVOZXh0ID0gZnVuY3Rpb24gKHJ1bkNhbGxiYWNrcywgc3BlZWQsIGludGVybmFsKSB7XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMubG9vcCkge1xuICAgICAgICAgICAgICAgIGlmIChzLmFuaW1hdGluZykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIHMuZml4TG9vcCgpO1xuICAgICAgICAgICAgICAgIHZhciBjbGllbnRMZWZ0ID0gcy5jb250YWluZXJbMF0uY2xpZW50TGVmdDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcy5zbGlkZVRvKHMuYWN0aXZlSW5kZXggKyBzLnBhcmFtcy5zbGlkZXNQZXJHcm91cCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gcy5zbGlkZVRvKHMuYWN0aXZlSW5kZXggKyBzLnBhcmFtcy5zbGlkZXNQZXJHcm91cCwgc3BlZWQsIHJ1bkNhbGxiYWNrcywgaW50ZXJuYWwpO1xuICAgICAgICB9O1xuICAgICAgICBzLl9zbGlkZU5leHQgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBzLnNsaWRlTmV4dCh0cnVlLCBzcGVlZCwgdHJ1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHMuc2xpZGVQcmV2ID0gZnVuY3Rpb24gKHJ1bkNhbGxiYWNrcywgc3BlZWQsIGludGVybmFsKSB7XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMubG9vcCkge1xuICAgICAgICAgICAgICAgIGlmIChzLmFuaW1hdGluZykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIHMuZml4TG9vcCgpO1xuICAgICAgICAgICAgICAgIHZhciBjbGllbnRMZWZ0ID0gcy5jb250YWluZXJbMF0uY2xpZW50TGVmdDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcy5zbGlkZVRvKHMuYWN0aXZlSW5kZXggLSAxLCBzcGVlZCwgcnVuQ2FsbGJhY2tzLCBpbnRlcm5hbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHJldHVybiBzLnNsaWRlVG8ocy5hY3RpdmVJbmRleCAtIDEsIHNwZWVkLCBydW5DYWxsYmFja3MsIGludGVybmFsKTtcbiAgICAgICAgfTtcbiAgICAgICAgcy5fc2xpZGVQcmV2ID0gZnVuY3Rpb24gKHNwZWVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcy5zbGlkZVByZXYodHJ1ZSwgc3BlZWQsIHRydWUpO1xuICAgICAgICB9O1xuICAgICAgICBzLnNsaWRlUmVzZXQgPSBmdW5jdGlvbiAocnVuQ2FsbGJhY2tzLCBzcGVlZCwgaW50ZXJuYWwpIHtcbiAgICAgICAgICAgIHJldHVybiBzLnNsaWRlVG8ocy5hY3RpdmVJbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcyk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICBUcmFuc2xhdGUvdHJhbnNpdGlvbiBoZWxwZXJzXG4gICAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAgICAgcy5zZXRXcmFwcGVyVHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChkdXJhdGlvbiwgYnlDb250cm9sbGVyKSB7XG4gICAgICAgICAgICBzLndyYXBwZXIudHJhbnNpdGlvbihkdXJhdGlvbik7XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMuZWZmZWN0ICE9PSAnc2xpZGUnICYmIHMuZWZmZWN0c1tzLnBhcmFtcy5lZmZlY3RdKSB7XG4gICAgICAgICAgICAgICAgcy5lZmZlY3RzW3MucGFyYW1zLmVmZmVjdF0uc2V0VHJhbnNpdGlvbihkdXJhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMucGFyYWxsYXggJiYgcy5wYXJhbGxheCkge1xuICAgICAgICAgICAgICAgIHMucGFyYWxsYXguc2V0VHJhbnNpdGlvbihkdXJhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMuc2Nyb2xsYmFyICYmIHMuc2Nyb2xsYmFyKSB7XG4gICAgICAgICAgICAgICAgcy5zY3JvbGxiYXIuc2V0VHJhbnNpdGlvbihkdXJhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMuY29udHJvbCAmJiBzLmNvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgICAgICBzLmNvbnRyb2xsZXIuc2V0VHJhbnNpdGlvbihkdXJhdGlvbiwgYnlDb250cm9sbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMuZW1pdCgnb25TZXRUcmFuc2l0aW9uJywgcywgZHVyYXRpb24pO1xuICAgICAgICB9O1xuICAgICAgICBzLnNldFdyYXBwZXJUcmFuc2xhdGUgPSBmdW5jdGlvbiAodHJhbnNsYXRlLCB1cGRhdGVBY3RpdmVJbmRleCwgYnlDb250cm9sbGVyKSB7XG4gICAgICAgICAgICB2YXIgeCA9IDAsIHkgPSAwLCB6ID0gMDtcbiAgICAgICAgICAgIGlmIChzLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICAgICAgICAgICAgeCA9IHMucnRsID8gLXRyYW5zbGF0ZSA6IHRyYW5zbGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHkgPSB0cmFuc2xhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKHMucGFyYW1zLnJvdW5kTGVuZ3Rocykge1xuICAgICAgICAgICAgICAgIHggPSByb3VuZCh4KTtcbiAgICAgICAgICAgICAgICB5ID0gcm91bmQoeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKCFzLnBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHMuc3VwcG9ydC50cmFuc2Zvcm1zM2QpIHMud3JhcHBlci50cmFuc2Zvcm0oJ3RyYW5zbGF0ZTNkKCcgKyB4ICsgJ3B4LCAnICsgeSArICdweCwgJyArIHogKyAncHgpJyk7XG4gICAgICAgICAgICAgICAgZWxzZSBzLndyYXBwZXIudHJhbnNmb3JtKCd0cmFuc2xhdGUoJyArIHggKyAncHgsICcgKyB5ICsgJ3B4KScpO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIHMudHJhbnNsYXRlID0gcy5pc0hvcml6b250YWwoKSA/IHggOiB5O1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHdlIG5lZWQgdG8gdXBkYXRlIHByb2dyZXNzXG4gICAgICAgICAgICB2YXIgcHJvZ3Jlc3M7XG4gICAgICAgICAgICB2YXIgdHJhbnNsYXRlc0RpZmYgPSBzLm1heFRyYW5zbGF0ZSgpIC0gcy5taW5UcmFuc2xhdGUoKTtcbiAgICAgICAgICAgIGlmICh0cmFuc2xhdGVzRGlmZiA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHByb2dyZXNzID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb2dyZXNzID0gKHRyYW5zbGF0ZSAtIHMubWluVHJhbnNsYXRlKCkpIC8gKHRyYW5zbGF0ZXNEaWZmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9ncmVzcyAhPT0gcy5wcm9ncmVzcykge1xuICAgICAgICAgICAgICAgIHMudXBkYXRlUHJvZ3Jlc3ModHJhbnNsYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICBpZiAodXBkYXRlQWN0aXZlSW5kZXgpIHMudXBkYXRlQWN0aXZlSW5kZXgoKTtcbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5lZmZlY3QgIT09ICdzbGlkZScgJiYgcy5lZmZlY3RzW3MucGFyYW1zLmVmZmVjdF0pIHtcbiAgICAgICAgICAgICAgICBzLmVmZmVjdHNbcy5wYXJhbXMuZWZmZWN0XS5zZXRUcmFuc2xhdGUocy50cmFuc2xhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHMucGFyYW1zLnBhcmFsbGF4ICYmIHMucGFyYWxsYXgpIHtcbiAgICAgICAgICAgICAgICBzLnBhcmFsbGF4LnNldFRyYW5zbGF0ZShzLnRyYW5zbGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMuc2Nyb2xsYmFyICYmIHMuc2Nyb2xsYmFyKSB7XG4gICAgICAgICAgICAgICAgcy5zY3JvbGxiYXIuc2V0VHJhbnNsYXRlKHMudHJhbnNsYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5jb250cm9sICYmIHMuY29udHJvbGxlcikge1xuICAgICAgICAgICAgICAgIHMuY29udHJvbGxlci5zZXRUcmFuc2xhdGUocy50cmFuc2xhdGUsIGJ5Q29udHJvbGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzLmVtaXQoJ29uU2V0VHJhbnNsYXRlJywgcywgcy50cmFuc2xhdGUpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgcy5nZXRUcmFuc2xhdGUgPSBmdW5jdGlvbiAoZWwsIGF4aXMpIHtcbiAgICAgICAgICAgIHZhciBtYXRyaXgsIGN1clRyYW5zZm9ybSwgY3VyU3R5bGUsIHRyYW5zZm9ybU1hdHJpeDtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBhdXRvbWF0aWMgYXhpcyBkZXRlY3Rpb25cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXhpcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBheGlzID0gJ3gnO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHMucnRsID8gLXMudHJhbnNsYXRlIDogcy50cmFuc2xhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgY3VyU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCwgbnVsbCk7XG4gICAgICAgICAgICBpZiAod2luZG93LldlYktpdENTU01hdHJpeCkge1xuICAgICAgICAgICAgICAgIGN1clRyYW5zZm9ybSA9IGN1clN0eWxlLnRyYW5zZm9ybSB8fCBjdXJTdHlsZS53ZWJraXRUcmFuc2Zvcm07XG4gICAgICAgICAgICAgICAgaWYgKGN1clRyYW5zZm9ybS5zcGxpdCgnLCcpLmxlbmd0aCA+IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyVHJhbnNmb3JtID0gY3VyVHJhbnNmb3JtLnNwbGl0KCcsICcpLm1hcChmdW5jdGlvbihhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhLnJlcGxhY2UoJywnLCcuJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pLmpvaW4oJywgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFNvbWUgb2xkIHZlcnNpb25zIG9mIFdlYmtpdCBjaG9rZSB3aGVuICdub25lJyBpcyBwYXNzZWQ7IHBhc3NcbiAgICAgICAgICAgICAgICAvLyBlbXB0eSBzdHJpbmcgaW5zdGVhZCBpbiB0aGlzIGNhc2VcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1NYXRyaXggPSBuZXcgd2luZG93LldlYktpdENTU01hdHJpeChjdXJUcmFuc2Zvcm0gPT09ICdub25lJyA/ICcnIDogY3VyVHJhbnNmb3JtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybU1hdHJpeCA9IGN1clN0eWxlLk1velRyYW5zZm9ybSB8fCBjdXJTdHlsZS5PVHJhbnNmb3JtIHx8IGN1clN0eWxlLk1zVHJhbnNmb3JtIHx8IGN1clN0eWxlLm1zVHJhbnNmb3JtICB8fCBjdXJTdHlsZS50cmFuc2Zvcm0gfHwgY3VyU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJykucmVwbGFjZSgndHJhbnNsYXRlKCcsICdtYXRyaXgoMSwgMCwgMCwgMSwnKTtcbiAgICAgICAgICAgICAgICBtYXRyaXggPSB0cmFuc2Zvcm1NYXRyaXgudG9TdHJpbmcoKS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIGlmIChheGlzID09PSAneCcpIHtcbiAgICAgICAgICAgICAgICAvL0xhdGVzdCBDaHJvbWUgYW5kIHdlYmtpdHMgRml4XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5XZWJLaXRDU1NNYXRyaXgpXG4gICAgICAgICAgICAgICAgICAgIGN1clRyYW5zZm9ybSA9IHRyYW5zZm9ybU1hdHJpeC5tNDE7XG4gICAgICAgICAgICAgICAgLy9DcmF6eSBJRTEwIE1hdHJpeFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1hdHJpeC5sZW5ndGggPT09IDE2KVxuICAgICAgICAgICAgICAgICAgICBjdXJUcmFuc2Zvcm0gPSBwYXJzZUZsb2F0KG1hdHJpeFsxMl0pO1xuICAgICAgICAgICAgICAgIC8vTm9ybWFsIEJyb3dzZXJzXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjdXJUcmFuc2Zvcm0gPSBwYXJzZUZsb2F0KG1hdHJpeFs0XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXhpcyA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgLy9MYXRlc3QgQ2hyb21lIGFuZCB3ZWJraXRzIEZpeFxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuV2ViS2l0Q1NTTWF0cml4KVxuICAgICAgICAgICAgICAgICAgICBjdXJUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1NYXRyaXgubTQyO1xuICAgICAgICAgICAgICAgIC8vQ3JhenkgSUUxMCBNYXRyaXhcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChtYXRyaXgubGVuZ3RoID09PSAxNilcbiAgICAgICAgICAgICAgICAgICAgY3VyVHJhbnNmb3JtID0gcGFyc2VGbG9hdChtYXRyaXhbMTNdKTtcbiAgICAgICAgICAgICAgICAvL05vcm1hbCBCcm93c2Vyc1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY3VyVHJhbnNmb3JtID0gcGFyc2VGbG9hdChtYXRyaXhbNV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHMucnRsICYmIGN1clRyYW5zZm9ybSkgY3VyVHJhbnNmb3JtID0gLWN1clRyYW5zZm9ybTtcbiAgICAgICAgICAgIHJldHVybiBjdXJUcmFuc2Zvcm0gfHwgMDtcbiAgICAgICAgfTtcbiAgICAgICAgcy5nZXRXcmFwcGVyVHJhbnNsYXRlID0gZnVuY3Rpb24gKGF4aXMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXhpcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBheGlzID0gcy5pc0hvcml6b250YWwoKSA/ICd4JyA6ICd5JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzLmdldFRyYW5zbGF0ZShzLndyYXBwZXJbMF0sIGF4aXMpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgT2JzZXJ2ZXJcbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBzLm9ic2VydmVycyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBpbml0T2JzZXJ2ZXIodGFyZ2V0LCBvcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBhbiBvYnNlcnZlciBpbnN0YW5jZVxuICAgICAgICAgICAgdmFyIE9ic2VydmVyRnVuYyA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyIHx8IHdpbmRvdy5XZWJraXRNdXRhdGlvbk9ic2VydmVyO1xuICAgICAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IE9ic2VydmVyRnVuYyhmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgbXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24gKG11dGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHMub25SZXNpemUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHMuZW1pdCgnb25PYnNlcnZlclVwZGF0ZScsIHMsIG11dGF0aW9uKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUodGFyZ2V0LCB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczogdHlwZW9mIG9wdGlvbnMuYXR0cmlidXRlcyA9PT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogb3B0aW9ucy5hdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHlwZW9mIG9wdGlvbnMuY2hpbGRMaXN0ID09PSAndW5kZWZpbmVkJyA/IHRydWUgOiBvcHRpb25zLmNoaWxkTGlzdCxcbiAgICAgICAgICAgICAgICBjaGFyYWN0ZXJEYXRhOiB0eXBlb2Ygb3B0aW9ucy5jaGFyYWN0ZXJEYXRhID09PSAndW5kZWZpbmVkJyA/IHRydWUgOiBvcHRpb25zLmNoYXJhY3RlckRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIHMub2JzZXJ2ZXJzLnB1c2gob2JzZXJ2ZXIpO1xuICAgICAgICB9XG4gICAgICAgIHMuaW5pdE9ic2VydmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5vYnNlcnZlUGFyZW50cykge1xuICAgICAgICAgICAgICAgIHZhciBjb250YWluZXJQYXJlbnRzID0gcy5jb250YWluZXIucGFyZW50cygpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29udGFpbmVyUGFyZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpbml0T2JzZXJ2ZXIoY29udGFpbmVyUGFyZW50c1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIC8vIE9ic2VydmUgY29udGFpbmVyXG4gICAgICAgICAgICBpbml0T2JzZXJ2ZXIocy5jb250YWluZXJbMF0sIHtjaGlsZExpc3Q6IGZhbHNlfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gT2JzZXJ2ZSB3cmFwcGVyXG4gICAgICAgICAgICBpbml0T2JzZXJ2ZXIocy53cmFwcGVyWzBdLCB7YXR0cmlidXRlczogZmFsc2V9KTtcbiAgICAgICAgfTtcbiAgICAgICAgcy5kaXNjb25uZWN0T2JzZXJ2ZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLm9ic2VydmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHMub2JzZXJ2ZXJzW2ldLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMub2JzZXJ2ZXJzID0gW107XG4gICAgICAgIH07XG4gICAgICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgIExvb3BcbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICAvLyBDcmVhdGUgbG9vcGVkIHNsaWRlc1xuICAgICAgICBzLmNyZWF0ZUxvb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgZHVwbGljYXRlZCBzbGlkZXNcbiAgICAgICAgICAgIHMud3JhcHBlci5jaGlsZHJlbignLicgKyBzLnBhcmFtcy5zbGlkZUNsYXNzICsgJy4nICsgcy5wYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzcykucmVtb3ZlKCk7XG4gICAgICAgIFxuICAgICAgICAgICAgdmFyIHNsaWRlcyA9IHMud3JhcHBlci5jaGlsZHJlbignLicgKyBzLnBhcmFtcy5zbGlkZUNsYXNzKTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZihzLnBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgJiYgIXMucGFyYW1zLmxvb3BlZFNsaWRlcykgcy5wYXJhbXMubG9vcGVkU2xpZGVzID0gc2xpZGVzLmxlbmd0aDtcbiAgICAgICAgXG4gICAgICAgICAgICBzLmxvb3BlZFNsaWRlcyA9IHBhcnNlSW50KHMucGFyYW1zLmxvb3BlZFNsaWRlcyB8fCBzLnBhcmFtcy5zbGlkZXNQZXJWaWV3LCAxMCk7XG4gICAgICAgICAgICBzLmxvb3BlZFNsaWRlcyA9IHMubG9vcGVkU2xpZGVzICsgcy5wYXJhbXMubG9vcEFkZGl0aW9uYWxTbGlkZXM7XG4gICAgICAgICAgICBpZiAocy5sb29wZWRTbGlkZXMgPiBzbGlkZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcy5sb29wZWRTbGlkZXMgPSBzbGlkZXMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIHZhciBwcmVwZW5kU2xpZGVzID0gW10sIGFwcGVuZFNsaWRlcyA9IFtdLCBpO1xuICAgICAgICAgICAgc2xpZGVzLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgIHZhciBzbGlkZSA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgcy5sb29wZWRTbGlkZXMpIGFwcGVuZFNsaWRlcy5wdXNoKGVsKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBzbGlkZXMubGVuZ3RoICYmIGluZGV4ID49IHNsaWRlcy5sZW5ndGggLSBzLmxvb3BlZFNsaWRlcykgcHJlcGVuZFNsaWRlcy5wdXNoKGVsKTtcbiAgICAgICAgICAgICAgICBzbGlkZS5hdHRyKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcsIGluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGFwcGVuZFNsaWRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHMud3JhcHBlci5hcHBlbmQoJChhcHBlbmRTbGlkZXNbaV0uY2xvbmVOb2RlKHRydWUpKS5hZGRDbGFzcyhzLnBhcmFtcy5zbGlkZUR1cGxpY2F0ZUNsYXNzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSBwcmVwZW5kU2xpZGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgcy53cmFwcGVyLnByZXBlbmQoJChwcmVwZW5kU2xpZGVzW2ldLmNsb25lTm9kZSh0cnVlKSkuYWRkQ2xhc3Mocy5wYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzLmRlc3Ryb3lMb29wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcy53cmFwcGVyLmNoaWxkcmVuKCcuJyArIHMucGFyYW1zLnNsaWRlQ2xhc3MgKyAnLicgKyBzLnBhcmFtcy5zbGlkZUR1cGxpY2F0ZUNsYXNzKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHMuc2xpZGVzLnJlbW92ZUF0dHIoJ2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4Jyk7XG4gICAgICAgIH07XG4gICAgICAgIHMuZml4TG9vcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuZXdJbmRleDtcbiAgICAgICAgICAgIC8vRml4IEZvciBOZWdhdGl2ZSBPdmVyc2xpZGluZ1xuICAgICAgICAgICAgaWYgKHMuYWN0aXZlSW5kZXggPCBzLmxvb3BlZFNsaWRlcykge1xuICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gcy5zbGlkZXMubGVuZ3RoIC0gcy5sb29wZWRTbGlkZXMgKiAzICsgcy5hY3RpdmVJbmRleDtcbiAgICAgICAgICAgICAgICBuZXdJbmRleCA9IG5ld0luZGV4ICsgcy5sb29wZWRTbGlkZXM7XG4gICAgICAgICAgICAgICAgcy5zbGlkZVRvKG5ld0luZGV4LCAwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL0ZpeCBGb3IgUG9zaXRpdmUgT3ZlcnNsaWRpbmdcbiAgICAgICAgICAgIGVsc2UgaWYgKChzLnBhcmFtcy5zbGlkZXNQZXJWaWV3ID09PSAnYXV0bycgJiYgcy5hY3RpdmVJbmRleCA+PSBzLmxvb3BlZFNsaWRlcyAqIDIpIHx8IChzLmFjdGl2ZUluZGV4ID4gcy5zbGlkZXMubGVuZ3RoIC0gcy5wYXJhbXMuc2xpZGVzUGVyVmlldyAqIDIpKSB7XG4gICAgICAgICAgICAgICAgbmV3SW5kZXggPSAtcy5zbGlkZXMubGVuZ3RoICsgcy5hY3RpdmVJbmRleCArIHMubG9vcGVkU2xpZGVzO1xuICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gbmV3SW5kZXggKyBzLmxvb3BlZFNsaWRlcztcbiAgICAgICAgICAgICAgICBzLnNsaWRlVG8obmV3SW5kZXgsIDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgQXBwZW5kL1ByZXBlbmQvUmVtb3ZlIFNsaWRlc1xuICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgICAgIHMuYXBwZW5kU2xpZGUgPSBmdW5jdGlvbiAoc2xpZGVzKSB7XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMubG9vcCkge1xuICAgICAgICAgICAgICAgIHMuZGVzdHJveUxvb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2xpZGVzID09PSAnb2JqZWN0JyAmJiBzbGlkZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNsaWRlc1tpXSkgcy53cmFwcGVyLmFwcGVuZChzbGlkZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHMud3JhcHBlci5hcHBlbmQoc2xpZGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5sb29wKSB7XG4gICAgICAgICAgICAgICAgcy5jcmVhdGVMb29wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIShzLnBhcmFtcy5vYnNlcnZlciAmJiBzLnN1cHBvcnQub2JzZXJ2ZXIpKSB7XG4gICAgICAgICAgICAgICAgcy51cGRhdGUodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHMucHJlcGVuZFNsaWRlID0gZnVuY3Rpb24gKHNsaWRlcykge1xuICAgICAgICAgICAgaWYgKHMucGFyYW1zLmxvb3ApIHtcbiAgICAgICAgICAgICAgICBzLmRlc3Ryb3lMb29wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbmV3QWN0aXZlSW5kZXggPSBzLmFjdGl2ZUluZGV4ICsgMTtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2xpZGVzID09PSAnb2JqZWN0JyAmJiBzbGlkZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNsaWRlc1tpXSkgcy53cmFwcGVyLnByZXBlbmQoc2xpZGVzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbmV3QWN0aXZlSW5kZXggPSBzLmFjdGl2ZUluZGV4ICsgc2xpZGVzLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHMud3JhcHBlci5wcmVwZW5kKHNsaWRlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMubG9vcCkge1xuICAgICAgICAgICAgICAgIHMuY3JlYXRlTG9vcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEocy5wYXJhbXMub2JzZXJ2ZXIgJiYgcy5zdXBwb3J0Lm9ic2VydmVyKSkge1xuICAgICAgICAgICAgICAgIHMudXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcy5zbGlkZVRvKG5ld0FjdGl2ZUluZGV4LCAwLCBmYWxzZSk7XG4gICAgICAgIH07XG4gICAgICAgIHMucmVtb3ZlU2xpZGUgPSBmdW5jdGlvbiAoc2xpZGVzSW5kZXhlcykge1xuICAgICAgICAgICAgaWYgKHMucGFyYW1zLmxvb3ApIHtcbiAgICAgICAgICAgICAgICBzLmRlc3Ryb3lMb29wKCk7XG4gICAgICAgICAgICAgICAgcy5zbGlkZXMgPSBzLndyYXBwZXIuY2hpbGRyZW4oJy4nICsgcy5wYXJhbXMuc2xpZGVDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbmV3QWN0aXZlSW5kZXggPSBzLmFjdGl2ZUluZGV4LFxuICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmU7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHNsaWRlc0luZGV4ZXMgPT09ICdvYmplY3QnICYmIHNsaWRlc0luZGV4ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZXNJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBzbGlkZXNJbmRleGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5zbGlkZXNbaW5kZXhUb1JlbW92ZV0pIHMuc2xpZGVzLmVxKGluZGV4VG9SZW1vdmUpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXhUb1JlbW92ZSA8IG5ld0FjdGl2ZUluZGV4KSBuZXdBY3RpdmVJbmRleC0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBuZXdBY3RpdmVJbmRleCA9IE1hdGgubWF4KG5ld0FjdGl2ZUluZGV4LCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBzbGlkZXNJbmRleGVzO1xuICAgICAgICAgICAgICAgIGlmIChzLnNsaWRlc1tpbmRleFRvUmVtb3ZlXSkgcy5zbGlkZXMuZXEoaW5kZXhUb1JlbW92ZSkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4VG9SZW1vdmUgPCBuZXdBY3RpdmVJbmRleCkgbmV3QWN0aXZlSW5kZXgtLTtcbiAgICAgICAgICAgICAgICBuZXdBY3RpdmVJbmRleCA9IE1hdGgubWF4KG5ld0FjdGl2ZUluZGV4LCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICBpZiAocy5wYXJhbXMubG9vcCkge1xuICAgICAgICAgICAgICAgIHMuY3JlYXRlTG9vcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIGlmICghKHMucGFyYW1zLm9ic2VydmVyICYmIHMuc3VwcG9ydC5vYnNlcnZlcikpIHtcbiAgICAgICAgICAgICAgICBzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5sb29wKSB7XG4gICAgICAgICAgICAgICAgcy5zbGlkZVRvKG5ld0FjdGl2ZUluZGV4ICsgcy5sb29wZWRTbGlkZXMsIDAsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHMuc2xpZGVUbyhuZXdBY3RpdmVJbmRleCwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgfTtcbiAgICAgICAgcy5yZW1vdmVBbGxTbGlkZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2xpZGVzSW5kZXhlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLnNsaWRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHNsaWRlc0luZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMucmVtb3ZlU2xpZGUoc2xpZGVzSW5kZXhlcyk7XG4gICAgICAgIH07XG4gICAgICAgIFxuXG4gICAgICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgIEVmZmVjdHNcbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBzLmVmZmVjdHMgPSB7XG4gICAgICAgICAgICBmYWRlOiB7XG4gICAgICAgICAgICAgICAgc2V0VHJhbnNsYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcy5zbGlkZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzbGlkZSA9IHMuc2xpZGVzLmVxKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldCA9IHNsaWRlWzBdLnN3aXBlclNsaWRlT2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR4ID0gLW9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcy5wYXJhbXMudmlydHVhbFRyYW5zbGF0ZSkgdHggPSB0eCAtIHMudHJhbnNsYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcy5pc0hvcml6b250YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5ID0gdHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNsaWRlT3BhY2l0eSA9IHMucGFyYW1zLmZhZGUuY3Jvc3NGYWRlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoMSAtIE1hdGguYWJzKHNsaWRlWzBdLnByb2dyZXNzKSwgMCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxICsgTWF0aC5taW4oTWF0aC5tYXgoc2xpZGVbMF0ucHJvZ3Jlc3MsIC0xKSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBzbGlkZU9wYWNpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmFuc2Zvcm0oJ3RyYW5zbGF0ZTNkKCcgKyB0eCArICdweCwgJyArIHR5ICsgJ3B4LCAwcHgpJyk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0VHJhbnNpdGlvbjogZnVuY3Rpb24gKGR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuc2xpZGVzLnRyYW5zaXRpb24oZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMudmlydHVhbFRyYW5zbGF0ZSAmJiBkdXJhdGlvbiAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50VHJpZ2dlcmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLnNsaWRlcy50cmFuc2l0aW9uRW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnRUcmlnZ2VyZWQpIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXMpIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJpZ2dlckV2ZW50cyA9IFsnd2Via2l0VHJhbnNpdGlvbkVuZCcsICd0cmFuc2l0aW9uZW5kJywgJ29UcmFuc2l0aW9uRW5kJywgJ01TVHJhbnNpdGlvbkVuZCcsICdtc1RyYW5zaXRpb25FbmQnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyaWdnZXJFdmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcy53cmFwcGVyLnRyaWdnZXIodHJpZ2dlckV2ZW50c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmxpcDoge1xuICAgICAgICAgICAgICAgIHNldFRyYW5zbGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMuc2xpZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2xpZGUgPSBzLnNsaWRlcy5lcShpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9ncmVzcyA9IHNsaWRlWzBdLnByb2dyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmZsaXAubGltaXRSb3RhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzID0gTWF0aC5tYXgoTWF0aC5taW4oc2xpZGVbMF0ucHJvZ3Jlc3MsIDEpLCAtMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gc2xpZGVbMF0uc3dpcGVyU2xpZGVPZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm90YXRlID0gLTE4MCAqIHByb2dyZXNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdGF0ZVkgPSByb3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRlWCA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHggPSAtb2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcy5pc0hvcml6b250YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5ID0gdHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdGF0ZVggPSAtcm90YXRlWTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3RhdGVZID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHMucnRsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRlWSA9IC1yb3RhdGVZO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlWzBdLnN0eWxlLnpJbmRleCA9IC1NYXRoLmFicyhNYXRoLnJvdW5kKHByb2dyZXNzKSkgKyBzLnNsaWRlcy5sZW5ndGg7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmZsaXAuc2xpZGVTaGFkb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TZXQgc2hhZG93c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzaGFkb3dCZWZvcmUgPSBzLmlzSG9yaXpvbnRhbCgpID8gc2xpZGUuZmluZCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctbGVmdCcpIDogc2xpZGUuZmluZCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctdG9wJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNoYWRvd0FmdGVyID0gcy5pc0hvcml6b250YWwoKSA/IHNsaWRlLmZpbmQoJy5zd2lwZXItc2xpZGUtc2hhZG93LXJpZ2h0JykgOiBzbGlkZS5maW5kKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy1ib3R0b20nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hhZG93QmVmb3JlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dCZWZvcmUgPSAkKCc8ZGl2IGNsYXNzPVwic3dpcGVyLXNsaWRlLXNoYWRvdy0nICsgKHMuaXNIb3Jpem9udGFsKCkgPyAnbGVmdCcgOiAndG9wJykgKyAnXCI+PC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLmFwcGVuZChzaGFkb3dCZWZvcmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hhZG93QWZ0ZXIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd0FmdGVyID0gJCgnPGRpdiBjbGFzcz1cInN3aXBlci1zbGlkZS1zaGFkb3ctJyArIChzLmlzSG9yaXpvbnRhbCgpID8gJ3JpZ2h0JyA6ICdib3R0b20nKSArICdcIj48L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGUuYXBwZW5kKHNoYWRvd0FmdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNoYWRvd0JlZm9yZS5sZW5ndGgpIHNoYWRvd0JlZm9yZVswXS5zdHlsZS5vcGFjaXR5ID0gTWF0aC5tYXgoLXByb2dyZXNzLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hhZG93QWZ0ZXIubGVuZ3RoKSBzaGFkb3dBZnRlclswXS5zdHlsZS5vcGFjaXR5ID0gTWF0aC5tYXgocHJvZ3Jlc3MsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRyYW5zZm9ybSgndHJhbnNsYXRlM2QoJyArIHR4ICsgJ3B4LCAnICsgdHkgKyAncHgsIDBweCkgcm90YXRlWCgnICsgcm90YXRlWCArICdkZWcpIHJvdGF0ZVkoJyArIHJvdGF0ZVkgKyAnZGVnKScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXRUcmFuc2l0aW9uOiBmdW5jdGlvbiAoZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcy5zbGlkZXMudHJhbnNpdGlvbihkdXJhdGlvbikuZmluZCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctdG9wLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1yaWdodCwgLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0JykudHJhbnNpdGlvbihkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy52aXJ0dWFsVHJhbnNsYXRlICYmIGR1cmF0aW9uICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnRUcmlnZ2VyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuc2xpZGVzLmVxKHMuYWN0aXZlSW5kZXgpLnRyYW5zaXRpb25FbmQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudFRyaWdnZXJlZCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcykgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcyhzLnBhcmFtcy5zbGlkZUFjdGl2ZUNsYXNzKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cmlnZ2VyRXZlbnRzID0gWyd3ZWJraXRUcmFuc2l0aW9uRW5kJywgJ3RyYW5zaXRpb25lbmQnLCAnb1RyYW5zaXRpb25FbmQnLCAnTVNUcmFuc2l0aW9uRW5kJywgJ21zVHJhbnNpdGlvbkVuZCddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJpZ2dlckV2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLndyYXBwZXIudHJpZ2dlcih0cmlnZ2VyRXZlbnRzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjdWJlOiB7XG4gICAgICAgICAgICAgICAgc2V0VHJhbnNsYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3cmFwcGVyUm90YXRlID0gMCwgY3ViZVNoYWRvdztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmN1YmUuc2hhZG93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5pc0hvcml6b250YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1YmVTaGFkb3cgPSBzLndyYXBwZXIuZmluZCgnLnN3aXBlci1jdWJlLXNoYWRvdycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdWJlU2hhZG93Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdWJlU2hhZG93ID0gJCgnPGRpdiBjbGFzcz1cInN3aXBlci1jdWJlLXNoYWRvd1wiPjwvZGl2PicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLndyYXBwZXIuYXBwZW5kKGN1YmVTaGFkb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdWJlU2hhZG93LmNzcyh7aGVpZ2h0OiBzLndpZHRoICsgJ3B4J30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3ViZVNoYWRvdyA9IHMuY29udGFpbmVyLmZpbmQoJy5zd2lwZXItY3ViZS1zaGFkb3cnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3ViZVNoYWRvdy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3ViZVNoYWRvdyA9ICQoJzxkaXYgY2xhc3M9XCJzd2lwZXItY3ViZS1zaGFkb3dcIj48L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5jb250YWluZXIuYXBwZW5kKGN1YmVTaGFkb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMuc2xpZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2xpZGUgPSBzLnNsaWRlcy5lcShpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzbGlkZUFuZ2xlID0gaSAqIDkwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvdW5kID0gTWF0aC5mbG9vcihzbGlkZUFuZ2xlIC8gMzYwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzLnJ0bCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlQW5nbGUgPSAtc2xpZGVBbmdsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3VuZCA9IE1hdGguZmxvb3IoLXNsaWRlQW5nbGUgLyAzNjApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb2dyZXNzID0gTWF0aC5tYXgoTWF0aC5taW4oc2xpZGVbMF0ucHJvZ3Jlc3MsIDEpLCAtMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHggPSAwLCB0eSA9IDAsIHR6ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpICUgNCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR4ID0gLSByb3VuZCAqIDQgKiBzLnNpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHogPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKGkgLSAxKSAlIDQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHogPSAtIHJvdW5kICogNCAqIHMuc2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKChpIC0gMikgJSA0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHggPSBzLnNpemUgKyByb3VuZCAqIDQgKiBzLnNpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHogPSBzLnNpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgoaSAtIDMpICUgNCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR4ID0gLSBzLnNpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHogPSAzICogcy5zaXplICsgcy5zaXplICogNCAqIHJvdW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHMucnRsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHggPSAtdHg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHkgPSB0eDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zZm9ybSA9ICdyb3RhdGVYKCcgKyAocy5pc0hvcml6b250YWwoKSA/IDAgOiAtc2xpZGVBbmdsZSkgKyAnZGVnKSByb3RhdGVZKCcgKyAocy5pc0hvcml6b250YWwoKSA/IHNsaWRlQW5nbGUgOiAwKSArICdkZWcpIHRyYW5zbGF0ZTNkKCcgKyB0eCArICdweCwgJyArIHR5ICsgJ3B4LCAnICsgdHogKyAncHgpJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzcyA8PSAxICYmIHByb2dyZXNzID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cmFwcGVyUm90YXRlID0gaSAqIDkwICsgcHJvZ3Jlc3MgKiA5MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5ydGwpIHdyYXBwZXJSb3RhdGUgPSAtaSAqIDkwIC0gcHJvZ3Jlc3MgKiA5MDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLnRyYW5zZm9ybSh0cmFuc2Zvcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmN1YmUuc2xpZGVTaGFkb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TZXQgc2hhZG93c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzaGFkb3dCZWZvcmUgPSBzLmlzSG9yaXpvbnRhbCgpID8gc2xpZGUuZmluZCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctbGVmdCcpIDogc2xpZGUuZmluZCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctdG9wJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNoYWRvd0FmdGVyID0gcy5pc0hvcml6b250YWwoKSA/IHNsaWRlLmZpbmQoJy5zd2lwZXItc2xpZGUtc2hhZG93LXJpZ2h0JykgOiBzbGlkZS5maW5kKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy1ib3R0b20nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hhZG93QmVmb3JlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dCZWZvcmUgPSAkKCc8ZGl2IGNsYXNzPVwic3dpcGVyLXNsaWRlLXNoYWRvdy0nICsgKHMuaXNIb3Jpem9udGFsKCkgPyAnbGVmdCcgOiAndG9wJykgKyAnXCI+PC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLmFwcGVuZChzaGFkb3dCZWZvcmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hhZG93QWZ0ZXIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd0FmdGVyID0gJCgnPGRpdiBjbGFzcz1cInN3aXBlci1zbGlkZS1zaGFkb3ctJyArIChzLmlzSG9yaXpvbnRhbCgpID8gJ3JpZ2h0JyA6ICdib3R0b20nKSArICdcIj48L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGUuYXBwZW5kKHNoYWRvd0FmdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNoYWRvd0JlZm9yZS5sZW5ndGgpIHNoYWRvd0JlZm9yZVswXS5zdHlsZS5vcGFjaXR5ID0gTWF0aC5tYXgoLXByb2dyZXNzLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hhZG93QWZ0ZXIubGVuZ3RoKSBzaGFkb3dBZnRlclswXS5zdHlsZS5vcGFjaXR5ID0gTWF0aC5tYXgocHJvZ3Jlc3MsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHMud3JhcHBlci5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgJy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbic6ICc1MCUgNTAlIC0nICsgKHMuc2l6ZSAvIDIpICsgJ3B4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICctbW96LXRyYW5zZm9ybS1vcmlnaW4nOiAnNTAlIDUwJSAtJyArIChzLnNpemUgLyAyKSArICdweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnLW1zLXRyYW5zZm9ybS1vcmlnaW4nOiAnNTAlIDUwJSAtJyArIChzLnNpemUgLyAyKSArICdweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAndHJhbnNmb3JtLW9yaWdpbic6ICc1MCUgNTAlIC0nICsgKHMuc2l6ZSAvIDIpICsgJ3B4J1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5jdWJlLnNoYWRvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHMuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdWJlU2hhZG93LnRyYW5zZm9ybSgndHJhbnNsYXRlM2QoMHB4LCAnICsgKHMud2lkdGggLyAyICsgcy5wYXJhbXMuY3ViZS5zaGFkb3dPZmZzZXQpICsgJ3B4LCAnICsgKC1zLndpZHRoIC8gMikgKyAncHgpIHJvdGF0ZVgoOTBkZWcpIHJvdGF0ZVooMGRlZykgc2NhbGUoJyArIChzLnBhcmFtcy5jdWJlLnNoYWRvd1NjYWxlKSArICcpJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2hhZG93QW5nbGUgPSBNYXRoLmFicyh3cmFwcGVyUm90YXRlKSAtIE1hdGguZmxvb3IoTWF0aC5hYnMod3JhcHBlclJvdGF0ZSkgLyA5MCkgKiA5MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbXVsdGlwbGllciA9IDEuNSAtIChNYXRoLnNpbihzaGFkb3dBbmdsZSAqIDIgKiBNYXRoLlBJIC8gMzYwKSAvIDIgKyBNYXRoLmNvcyhzaGFkb3dBbmdsZSAqIDIgKiBNYXRoLlBJIC8gMzYwKSAvIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZTEgPSBzLnBhcmFtcy5jdWJlLnNoYWRvd1NjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTIgPSBzLnBhcmFtcy5jdWJlLnNoYWRvd1NjYWxlIC8gbXVsdGlwbGllcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gcy5wYXJhbXMuY3ViZS5zaGFkb3dPZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3ViZVNoYWRvdy50cmFuc2Zvcm0oJ3NjYWxlM2QoJyArIHNjYWxlMSArICcsIDEsICcgKyBzY2FsZTIgKyAnKSB0cmFuc2xhdGUzZCgwcHgsICcgKyAocy5oZWlnaHQgLyAyICsgb2Zmc2V0KSArICdweCwgJyArICgtcy5oZWlnaHQgLyAyIC8gc2NhbGUyKSArICdweCkgcm90YXRlWCgtOTBkZWcpJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHpGYWN0b3IgPSAocy5pc1NhZmFyaSB8fCBzLmlzVWlXZWJWaWV3KSA/ICgtcy5zaXplIC8gMikgOiAwO1xuICAgICAgICAgICAgICAgICAgICBzLndyYXBwZXIudHJhbnNmb3JtKCd0cmFuc2xhdGUzZCgwcHgsMCwnICsgekZhY3RvciArICdweCkgcm90YXRlWCgnICsgKHMuaXNIb3Jpem9udGFsKCkgPyAwIDogd3JhcHBlclJvdGF0ZSkgKyAnZGVnKSByb3RhdGVZKCcgKyAocy5pc0hvcml6b250YWwoKSA/IC13cmFwcGVyUm90YXRlIDogMCkgKyAnZGVnKScpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0VHJhbnNpdGlvbjogZnVuY3Rpb24gKGR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuc2xpZGVzLnRyYW5zaXRpb24oZHVyYXRpb24pLmZpbmQoJy5zd2lwZXItc2xpZGUtc2hhZG93LXRvcCwgLnN3aXBlci1zbGlkZS1zaGFkb3ctcmlnaHQsIC5zd2lwZXItc2xpZGUtc2hhZG93LWJvdHRvbSwgLnN3aXBlci1zbGlkZS1zaGFkb3ctbGVmdCcpLnRyYW5zaXRpb24oZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMuY3ViZS5zaGFkb3cgJiYgIXMuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuY29udGFpbmVyLmZpbmQoJy5zd2lwZXItY3ViZS1zaGFkb3cnKS50cmFuc2l0aW9uKGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb3ZlcmZsb3c6IHtcbiAgICAgICAgICAgICAgICBzZXRUcmFuc2xhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zZm9ybSA9IHMudHJhbnNsYXRlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2VudGVyID0gcy5pc0hvcml6b250YWwoKSA/IC10cmFuc2Zvcm0gKyBzLndpZHRoIC8gMiA6IC10cmFuc2Zvcm0gKyBzLmhlaWdodCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIHZhciByb3RhdGUgPSBzLmlzSG9yaXpvbnRhbCgpID8gcy5wYXJhbXMuY292ZXJmbG93LnJvdGF0ZTogLXMucGFyYW1zLmNvdmVyZmxvdy5yb3RhdGU7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGUgPSBzLnBhcmFtcy5jb3ZlcmZsb3cuZGVwdGg7XG4gICAgICAgICAgICAgICAgICAgIC8vRWFjaCBzbGlkZSBvZmZzZXQgZnJvbSBjZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHMuc2xpZGVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2xpZGUgPSBzLnNsaWRlcy5lcShpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzbGlkZVNpemUgPSBzLnNsaWRlc1NpemVzR3JpZFtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzbGlkZU9mZnNldCA9IHNsaWRlWzBdLnN3aXBlclNsaWRlT2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldE11bHRpcGxpZXIgPSAoY2VudGVyIC0gc2xpZGVPZmZzZXQgLSBzbGlkZVNpemUgLyAyKSAvIHNsaWRlU2l6ZSAqIHMucGFyYW1zLmNvdmVyZmxvdy5tb2RpZmllcjtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm90YXRlWSA9IHMuaXNIb3Jpem9udGFsKCkgPyByb3RhdGUgKiBvZmZzZXRNdWx0aXBsaWVyIDogMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3RhdGVYID0gcy5pc0hvcml6b250YWwoKSA/IDAgOiByb3RhdGUgKiBvZmZzZXRNdWx0aXBsaWVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIHJvdGF0ZVogPSAwXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNsYXRlWiA9IC10cmFuc2xhdGUgKiBNYXRoLmFicyhvZmZzZXRNdWx0aXBsaWVyKTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNsYXRlWSA9IHMuaXNIb3Jpem9udGFsKCkgPyAwIDogcy5wYXJhbXMuY292ZXJmbG93LnN0cmV0Y2ggKiAob2Zmc2V0TXVsdGlwbGllcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNsYXRlWCA9IHMuaXNIb3Jpem9udGFsKCkgPyBzLnBhcmFtcy5jb3ZlcmZsb3cuc3RyZXRjaCAqIChvZmZzZXRNdWx0aXBsaWVyKSA6IDA7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy9GaXggZm9yIHVsdHJhIHNtYWxsIHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRyYW5zbGF0ZVgpIDwgMC4wMDEpIHRyYW5zbGF0ZVggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRyYW5zbGF0ZVkpIDwgMC4wMDEpIHRyYW5zbGF0ZVkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRyYW5zbGF0ZVopIDwgMC4wMDEpIHRyYW5zbGF0ZVogPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHJvdGF0ZVkpIDwgMC4wMDEpIHJvdGF0ZVkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHJvdGF0ZVgpIDwgMC4wMDEpIHJvdGF0ZVggPSAwO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzbGlkZVRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzZCgnICsgdHJhbnNsYXRlWCArICdweCwnICsgdHJhbnNsYXRlWSArICdweCwnICsgdHJhbnNsYXRlWiArICdweCkgIHJvdGF0ZVgoJyArIHJvdGF0ZVggKyAnZGVnKSByb3RhdGVZKCcgKyByb3RhdGVZICsgJ2RlZyknO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLnRyYW5zZm9ybShzbGlkZVRyYW5zZm9ybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZVswXS5zdHlsZS56SW5kZXggPSAtTWF0aC5hYnMoTWF0aC5yb3VuZChvZmZzZXRNdWx0aXBsaWVyKSkgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmNvdmVyZmxvdy5zbGlkZVNoYWRvd3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1NldCBzaGFkb3dzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNoYWRvd0JlZm9yZSA9IHMuaXNIb3Jpem9udGFsKCkgPyBzbGlkZS5maW5kKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0JykgOiBzbGlkZS5maW5kKCcuc3dpcGVyLXNsaWRlLXNoYWRvdy10b3AnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2hhZG93QWZ0ZXIgPSBzLmlzSG9yaXpvbnRhbCgpID8gc2xpZGUuZmluZCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctcmlnaHQnKSA6IHNsaWRlLmZpbmQoJy5zd2lwZXItc2xpZGUtc2hhZG93LWJvdHRvbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzaGFkb3dCZWZvcmUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd0JlZm9yZSA9ICQoJzxkaXYgY2xhc3M9XCJzd2lwZXItc2xpZGUtc2hhZG93LScgKyAocy5pc0hvcml6b250YWwoKSA/ICdsZWZ0JyA6ICd0b3AnKSArICdcIj48L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGUuYXBwZW5kKHNoYWRvd0JlZm9yZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzaGFkb3dBZnRlci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93QWZ0ZXIgPSAkKCc8ZGl2IGNsYXNzPVwic3dpcGVyLXNsaWRlLXNoYWRvdy0nICsgKHMuaXNIb3Jpem9udGFsKCkgPyAncmlnaHQnIDogJ2JvdHRvbScpICsgJ1wiPjwvZGl2PicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZS5hcHBlbmQoc2hhZG93QWZ0ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hhZG93QmVmb3JlLmxlbmd0aCkgc2hhZG93QmVmb3JlWzBdLnN0eWxlLm9wYWNpdHkgPSBvZmZzZXRNdWx0aXBsaWVyID4gMCA/IG9mZnNldE11bHRpcGxpZXIgOiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzaGFkb3dBZnRlci5sZW5ndGgpIHNoYWRvd0FmdGVyWzBdLnN0eWxlLm9wYWNpdHkgPSAoLW9mZnNldE11bHRpcGxpZXIpID4gMCA/IC1vZmZzZXRNdWx0aXBsaWVyIDogMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy9TZXQgY29ycmVjdCBwZXJzcGVjdGl2ZSBmb3IgSUUxMFxuICAgICAgICAgICAgICAgICAgICBpZiAocy5icm93c2VyLmllKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgd3MgPSBzLndyYXBwZXJbMF0uc3R5bGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB3cy5wZXJzcGVjdGl2ZU9yaWdpbiA9IGNlbnRlciArICdweCA1MCUnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXRUcmFuc2l0aW9uOiBmdW5jdGlvbiAoZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcy5zbGlkZXMudHJhbnNpdGlvbihkdXJhdGlvbikuZmluZCgnLnN3aXBlci1zbGlkZS1zaGFkb3ctdG9wLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1yaWdodCwgLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tLCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0JykudHJhbnNpdGlvbihkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgIEltYWdlcyBMYXp5IExvYWRpbmdcbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBzLmxhenkgPSB7XG4gICAgICAgICAgICBpbml0aWFsSW1hZ2VMb2FkZWQ6IGZhbHNlLFxuICAgICAgICAgICAgbG9hZEltYWdlSW5TbGlkZTogZnVuY3Rpb24gKGluZGV4LCBsb2FkSW5EdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGluZGV4ID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbG9hZEluRHVwbGljYXRlID09PSAndW5kZWZpbmVkJykgbG9hZEluRHVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAocy5zbGlkZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBzbGlkZSA9IHMuc2xpZGVzLmVxKGluZGV4KTtcbiAgICAgICAgICAgICAgICB2YXIgaW1nID0gc2xpZGUuZmluZCgnLnN3aXBlci1sYXp5Om5vdCguc3dpcGVyLWxhenktbG9hZGVkKTpub3QoLnN3aXBlci1sYXp5LWxvYWRpbmcpJyk7XG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlLmhhc0NsYXNzKCdzd2lwZXItbGF6eScpICYmICFzbGlkZS5oYXNDbGFzcygnc3dpcGVyLWxhenktbG9hZGVkJykgJiYgIXNsaWRlLmhhc0NsYXNzKCdzd2lwZXItbGF6eS1sb2FkaW5nJykpIHtcbiAgICAgICAgICAgICAgICAgICAgaW1nID0gaW1nLmFkZChzbGlkZVswXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbWcubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGltZy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9pbWcgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBfaW1nLmFkZENsYXNzKCdzd2lwZXItbGF6eS1sb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiYWNrZ3JvdW5kID0gX2ltZy5hdHRyKCdkYXRhLWJhY2tncm91bmQnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNyYyA9IF9pbWcuYXR0cignZGF0YS1zcmMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyY3NldCA9IF9pbWcuYXR0cignZGF0YS1zcmNzZXQnKTtcbiAgICAgICAgICAgICAgICAgICAgcy5sb2FkSW1hZ2UoX2ltZ1swXSwgKHNyYyB8fCBiYWNrZ3JvdW5kKSwgc3Jjc2V0LCBmYWxzZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhY2tncm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaW1nLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGJhY2tncm91bmQgKyAnKScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pbWcucmVtb3ZlQXR0cignZGF0YS1iYWNrZ3JvdW5kJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3Jjc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pbWcuYXR0cignc3Jjc2V0Jywgc3Jjc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2ltZy5yZW1vdmVBdHRyKCdkYXRhLXNyY3NldCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3JjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pbWcuYXR0cignc3JjJywgc3JjKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2ltZy5yZW1vdmVBdHRyKCdkYXRhLXNyYycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgX2ltZy5hZGRDbGFzcygnc3dpcGVyLWxhenktbG9hZGVkJykucmVtb3ZlQ2xhc3MoJ3N3aXBlci1sYXp5LWxvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLmZpbmQoJy5zd2lwZXItbGF6eS1wcmVsb2FkZXIsIC5wcmVsb2FkZXInKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5sb29wICYmIGxvYWRJbkR1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzbGlkZU9yaWdpbmFsSW5kZXggPSBzbGlkZS5hdHRyKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzbGlkZS5oYXNDbGFzcyhzLnBhcmFtcy5zbGlkZUR1cGxpY2F0ZUNsYXNzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3JpZ2luYWxTbGlkZSA9IHMud3JhcHBlci5jaGlsZHJlbignW2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJyArIHNsaWRlT3JpZ2luYWxJbmRleCArICdcIl06bm90KC4nICsgcy5wYXJhbXMuc2xpZGVEdXBsaWNhdGVDbGFzcyArICcpJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMubGF6eS5sb2FkSW1hZ2VJblNsaWRlKG9yaWdpbmFsU2xpZGUuaW5kZXgoKSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGR1cGxpY2F0ZWRTbGlkZSA9IHMud3JhcHBlci5jaGlsZHJlbignLicgKyBzLnBhcmFtcy5zbGlkZUR1cGxpY2F0ZUNsYXNzICsgJ1tkYXRhLXN3aXBlci1zbGlkZS1pbmRleD1cIicgKyBzbGlkZU9yaWdpbmFsSW5kZXggKyAnXCJdJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMubGF6eS5sb2FkSW1hZ2VJblNsaWRlKGR1cGxpY2F0ZWRTbGlkZS5pbmRleCgpLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcy5lbWl0KCdvbkxhenlJbWFnZVJlYWR5Jywgcywgc2xpZGVbMF0sIF9pbWdbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHMuZW1pdCgnb25MYXp5SW1hZ2VMb2FkJywgcywgc2xpZGVbMF0sIF9pbWdbMF0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLndhdGNoU2xpZGVzVmlzaWJpbGl0eSkge1xuICAgICAgICAgICAgICAgICAgICBzLndyYXBwZXIuY2hpbGRyZW4oJy4nICsgcy5wYXJhbXMuc2xpZGVWaXNpYmxlQ2xhc3MpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5sYXp5LmxvYWRJbWFnZUluU2xpZGUoJCh0aGlzKS5pbmRleCgpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMuc2xpZGVzUGVyVmlldyA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IHMuYWN0aXZlSW5kZXg7IGkgPCBzLmFjdGl2ZUluZGV4ICsgcy5wYXJhbXMuc2xpZGVzUGVyVmlldyA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzLnNsaWRlc1tpXSkgcy5sYXp5LmxvYWRJbWFnZUluU2xpZGUoaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLmxhenkubG9hZEltYWdlSW5TbGlkZShzLmFjdGl2ZUluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMubGF6eUxvYWRpbmdJblByZXZOZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5zbGlkZXNQZXJWaWV3ID4gMSB8fCAocy5wYXJhbXMubGF6eUxvYWRpbmdJblByZXZOZXh0QW1vdW50ICYmIHMucGFyYW1zLmxhenlMb2FkaW5nSW5QcmV2TmV4dEFtb3VudCA+IDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYW1vdW50ID0gcy5wYXJhbXMubGF6eUxvYWRpbmdJblByZXZOZXh0QW1vdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNwdiA9IHMucGFyYW1zLnNsaWRlc1BlclZpZXc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF4SW5kZXggPSBNYXRoLm1pbihzLmFjdGl2ZUluZGV4ICsgc3B2ICsgTWF0aC5tYXgoYW1vdW50LCBzcHYpLCBzLnNsaWRlcy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1pbkluZGV4ID0gTWF0aC5tYXgocy5hY3RpdmVJbmRleCAtIE1hdGgubWF4KHNwdiwgYW1vdW50KSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXh0IFNsaWRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gcy5hY3RpdmVJbmRleCArIHMucGFyYW1zLnNsaWRlc1BlclZpZXc7IGkgPCBtYXhJbmRleDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHMuc2xpZGVzW2ldKSBzLmxhenkubG9hZEltYWdlSW5TbGlkZShpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByZXYgU2xpZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSBtaW5JbmRleDsgaSA8IHMuYWN0aXZlSW5kZXggOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5zbGlkZXNbaV0pIHMubGF6eS5sb2FkSW1hZ2VJblNsaWRlKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRTbGlkZSA9IHMud3JhcHBlci5jaGlsZHJlbignLicgKyBzLnBhcmFtcy5zbGlkZU5leHRDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFNsaWRlLmxlbmd0aCA+IDApIHMubGF6eS5sb2FkSW1hZ2VJblNsaWRlKG5leHRTbGlkZS5pbmRleCgpKTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJldlNsaWRlID0gcy53cmFwcGVyLmNoaWxkcmVuKCcuJyArIHMucGFyYW1zLnNsaWRlUHJldkNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2U2xpZGUubGVuZ3RoID4gMCkgcy5sYXp5LmxvYWRJbWFnZUluU2xpZGUocHJldlNsaWRlLmluZGV4KCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uVHJhbnNpdGlvblN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmxhenlMb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5sYXp5TG9hZGluZ09uVHJhbnNpdGlvblN0YXJ0IHx8ICghcy5wYXJhbXMubGF6eUxvYWRpbmdPblRyYW5zaXRpb25TdGFydCAmJiAhcy5sYXp5LmluaXRpYWxJbWFnZUxvYWRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMubGF6eS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25UcmFuc2l0aW9uRW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmxhenlMb2FkaW5nICYmICFzLnBhcmFtcy5sYXp5TG9hZGluZ09uVHJhbnNpdGlvblN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHMubGF6eS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcblxuICAgICAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICBTY3JvbGxiYXJcbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBzLnNjcm9sbGJhciA9IHtcbiAgICAgICAgICAgIGlzVG91Y2hlZDogZmFsc2UsXG4gICAgICAgICAgICBzZXREcmFnUG9zaXRpb246IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNiID0gcy5zY3JvbGxiYXI7XG4gICAgICAgICAgICAgICAgdmFyIHggPSAwLCB5ID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNsYXRlO1xuICAgICAgICAgICAgICAgIHZhciBwb2ludGVyUG9zaXRpb24gPSBzLmlzSG9yaXpvbnRhbCgpID9cbiAgICAgICAgICAgICAgICAgICAgKChlLnR5cGUgPT09ICd0b3VjaHN0YXJ0JyB8fCBlLnR5cGUgPT09ICd0b3VjaG1vdmUnKSA/IGUudGFyZ2V0VG91Y2hlc1swXS5wYWdlWCA6IGUucGFnZVggfHwgZS5jbGllbnRYKSA6XG4gICAgICAgICAgICAgICAgICAgICgoZS50eXBlID09PSAndG91Y2hzdGFydCcgfHwgZS50eXBlID09PSAndG91Y2htb3ZlJykgPyBlLnRhcmdldFRvdWNoZXNbMF0ucGFnZVkgOiBlLnBhZ2VZIHx8IGUuY2xpZW50WSkgO1xuICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IChwb2ludGVyUG9zaXRpb24pIC0gc2IudHJhY2sub2Zmc2V0KClbcy5pc0hvcml6b250YWwoKSA/ICdsZWZ0JyA6ICd0b3AnXSAtIHNiLmRyYWdTaXplIC8gMjtcbiAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb25NaW4gPSAtcy5taW5UcmFuc2xhdGUoKSAqIHNiLm1vdmVEaXZpZGVyO1xuICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbk1heCA9IC1zLm1heFRyYW5zbGF0ZSgpICogc2IubW92ZURpdmlkZXI7XG4gICAgICAgICAgICAgICAgaWYgKHBvc2l0aW9uIDwgcG9zaXRpb25NaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbk1pbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocG9zaXRpb24gPiBwb3NpdGlvbk1heCkge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uTWF4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IC1wb3NpdGlvbiAvIHNiLm1vdmVEaXZpZGVyO1xuICAgICAgICAgICAgICAgIHMudXBkYXRlUHJvZ3Jlc3MocG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIHMuc2V0V3JhcHBlclRyYW5zbGF0ZShwb3NpdGlvbiwgdHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZHJhZ1N0YXJ0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHZhciBzYiA9IHMuc2Nyb2xsYmFyO1xuICAgICAgICAgICAgICAgIHNiLmlzVG91Y2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIHNiLnNldERyYWdQb3NpdGlvbihlKTtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoc2IuZHJhZ1RpbWVvdXQpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBzYi50cmFjay50cmFuc2l0aW9uKDApO1xuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5zY3JvbGxiYXJIaWRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNiLnRyYWNrLmNzcygnb3BhY2l0eScsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzLndyYXBwZXIudHJhbnNpdGlvbigxMDApO1xuICAgICAgICAgICAgICAgIHNiLmRyYWcudHJhbnNpdGlvbigxMDApO1xuICAgICAgICAgICAgICAgIHMuZW1pdCgnb25TY3JvbGxiYXJEcmFnU3RhcnQnLCBzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkcmFnTW92ZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2IgPSBzLnNjcm9sbGJhcjtcbiAgICAgICAgICAgICAgICBpZiAoIXNiLmlzVG91Y2hlZCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZWxzZSBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2Iuc2V0RHJhZ1Bvc2l0aW9uKGUpO1xuICAgICAgICAgICAgICAgIHMud3JhcHBlci50cmFuc2l0aW9uKDApO1xuICAgICAgICAgICAgICAgIHNiLnRyYWNrLnRyYW5zaXRpb24oMCk7XG4gICAgICAgICAgICAgICAgc2IuZHJhZy50cmFuc2l0aW9uKDApO1xuICAgICAgICAgICAgICAgIHMuZW1pdCgnb25TY3JvbGxiYXJEcmFnTW92ZScsIHMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRyYWdFbmQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNiID0gcy5zY3JvbGxiYXI7XG4gICAgICAgICAgICAgICAgaWYgKCFzYi5pc1RvdWNoZWQpIHJldHVybjtcbiAgICAgICAgICAgICAgICBzYi5pc1RvdWNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMuc2Nyb2xsYmFySGlkZSkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoc2IuZHJhZ1RpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICBzYi5kcmFnVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2IudHJhY2suY3NzKCdvcGFjaXR5JywgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYi50cmFjay50cmFuc2l0aW9uKDQwMCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcy5lbWl0KCdvblNjcm9sbGJhckRyYWdFbmQnLCBzKTtcbiAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMuc2Nyb2xsYmFyU25hcE9uUmVsZWFzZSkge1xuICAgICAgICAgICAgICAgICAgICBzLnNsaWRlUmVzZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW5hYmxlRHJhZ2dhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNiID0gcy5zY3JvbGxiYXI7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IHMuc3VwcG9ydC50b3VjaCA/IHNiLnRyYWNrIDogZG9jdW1lbnQ7XG4gICAgICAgICAgICAgICAgJChzYi50cmFjaykub24ocy50b3VjaEV2ZW50cy5zdGFydCwgc2IuZHJhZ1N0YXJ0KTtcbiAgICAgICAgICAgICAgICAkKHRhcmdldCkub24ocy50b3VjaEV2ZW50cy5tb3ZlLCBzYi5kcmFnTW92ZSk7XG4gICAgICAgICAgICAgICAgJCh0YXJnZXQpLm9uKHMudG91Y2hFdmVudHMuZW5kLCBzYi5kcmFnRW5kKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXNhYmxlRHJhZ2dhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNiID0gcy5zY3JvbGxiYXI7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IHMuc3VwcG9ydC50b3VjaCA/IHNiLnRyYWNrIDogZG9jdW1lbnQ7XG4gICAgICAgICAgICAgICAgJChzYi50cmFjaykub2ZmKHMudG91Y2hFdmVudHMuc3RhcnQsIHNiLmRyYWdTdGFydCk7XG4gICAgICAgICAgICAgICAgJCh0YXJnZXQpLm9mZihzLnRvdWNoRXZlbnRzLm1vdmUsIHNiLmRyYWdNb3ZlKTtcbiAgICAgICAgICAgICAgICAkKHRhcmdldCkub2ZmKHMudG91Y2hFdmVudHMuZW5kLCBzYi5kcmFnRW5kKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXMucGFyYW1zLnNjcm9sbGJhcikgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHZhciBzYiA9IHMuc2Nyb2xsYmFyO1xuICAgICAgICAgICAgICAgIHNiLnRyYWNrID0gJChzLnBhcmFtcy5zY3JvbGxiYXIpO1xuICAgICAgICAgICAgICAgIHNiLmRyYWcgPSBzYi50cmFjay5maW5kKCcuc3dpcGVyLXNjcm9sbGJhci1kcmFnJyk7XG4gICAgICAgICAgICAgICAgaWYgKHNiLmRyYWcubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNiLmRyYWcgPSAkKCc8ZGl2IGNsYXNzPVwic3dpcGVyLXNjcm9sbGJhci1kcmFnXCI+PC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgICAgIHNiLnRyYWNrLmFwcGVuZChzYi5kcmFnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2IuZHJhZ1swXS5zdHlsZS53aWR0aCA9ICcnO1xuICAgICAgICAgICAgICAgIHNiLmRyYWdbMF0uc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICAgICAgICAgICAgc2IudHJhY2tTaXplID0gcy5pc0hvcml6b250YWwoKSA/IHNiLnRyYWNrWzBdLm9mZnNldFdpZHRoIDogc2IudHJhY2tbMF0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBzYi5kaXZpZGVyID0gcy5zaXplIC8gcy52aXJ0dWFsU2l6ZTtcbiAgICAgICAgICAgICAgICBzYi5tb3ZlRGl2aWRlciA9IHNiLmRpdmlkZXIgKiAoc2IudHJhY2tTaXplIC8gcy5zaXplKTtcbiAgICAgICAgICAgICAgICBzYi5kcmFnU2l6ZSA9IHNiLnRyYWNrU2l6ZSAqIHNiLmRpdmlkZXI7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNiLmRyYWdbMF0uc3R5bGUud2lkdGggPSBzYi5kcmFnU2l6ZSArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzYi5kcmFnWzBdLnN0eWxlLmhlaWdodCA9IHNiLmRyYWdTaXplICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzYi5kaXZpZGVyID49IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2IudHJhY2tbMF0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNiLnRyYWNrWzBdLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLnNjcm9sbGJhckhpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2IudHJhY2tbMF0uc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldFRyYW5zbGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghcy5wYXJhbXMuc2Nyb2xsYmFyKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdmFyIGRpZmY7XG4gICAgICAgICAgICAgICAgdmFyIHNiID0gcy5zY3JvbGxiYXI7XG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zbGF0ZSA9IHMudHJhbnNsYXRlIHx8IDA7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1BvcztcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIG5ld1NpemUgPSBzYi5kcmFnU2l6ZTtcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSAoc2IudHJhY2tTaXplIC0gc2IuZHJhZ1NpemUpICogcy5wcm9ncmVzcztcbiAgICAgICAgICAgICAgICBpZiAocy5ydGwgJiYgcy5pc0hvcml6b250YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdQb3MgPSAtbmV3UG9zO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3UG9zID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2l6ZSA9IHNiLmRyYWdTaXplIC0gbmV3UG9zO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3UG9zID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgtbmV3UG9zICsgc2IuZHJhZ1NpemUgPiBzYi50cmFja1NpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpemUgPSBzYi50cmFja1NpemUgKyBuZXdQb3M7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdQb3MgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdTaXplID0gc2IuZHJhZ1NpemUgKyBuZXdQb3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdQb3MgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5ld1BvcyArIHNiLmRyYWdTaXplID4gc2IudHJhY2tTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdTaXplID0gc2IudHJhY2tTaXplIC0gbmV3UG9zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLnN1cHBvcnQudHJhbnNmb3JtczNkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYi5kcmFnLnRyYW5zZm9ybSgndHJhbnNsYXRlM2QoJyArIChuZXdQb3MpICsgJ3B4LCAwLCAwKScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2IuZHJhZy50cmFuc2Zvcm0oJ3RyYW5zbGF0ZVgoJyArIChuZXdQb3MpICsgJ3B4KScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNiLmRyYWdbMF0uc3R5bGUud2lkdGggPSBuZXdTaXplICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLnN1cHBvcnQudHJhbnNmb3JtczNkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYi5kcmFnLnRyYW5zZm9ybSgndHJhbnNsYXRlM2QoMHB4LCAnICsgKG5ld1BvcykgKyAncHgsIDApJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYi5kcmFnLnRyYW5zZm9ybSgndHJhbnNsYXRlWSgnICsgKG5ld1BvcykgKyAncHgpJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2IuZHJhZ1swXS5zdHlsZS5oZWlnaHQgPSBuZXdTaXplICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLnNjcm9sbGJhckhpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHNiLnRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICBzYi50cmFja1swXS5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgc2IudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2IudHJhY2tbMF0uc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYi50cmFjay50cmFuc2l0aW9uKDQwMCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXRUcmFuc2l0aW9uOiBmdW5jdGlvbiAoZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAoIXMucGFyYW1zLnNjcm9sbGJhcikgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHMuc2Nyb2xsYmFyLmRyYWcudHJhbnNpdGlvbihkdXJhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgQ29udHJvbGxlclxuICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgICAgIHMuY29udHJvbGxlciA9IHtcbiAgICAgICAgICAgIExpbmVhclNwbGluZTogZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICAgICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSB4Lmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgLy8gR2l2ZW4gYW4geCB2YWx1ZSAoeDIpLCByZXR1cm4gdGhlIGV4cGVjdGVkIHkyIHZhbHVlOlxuICAgICAgICAgICAgICAgIC8vICh4MSx5MSkgaXMgdGhlIGtub3duIHBvaW50IGJlZm9yZSBnaXZlbiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAvLyAoeDMseTMpIGlzIHRoZSBrbm93biBwb2ludCBhZnRlciBnaXZlbiB2YWx1ZS5cbiAgICAgICAgICAgICAgICB2YXIgaTEsIGkzO1xuICAgICAgICAgICAgICAgIHZhciBsID0gdGhpcy54Lmxlbmd0aDtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uICh4Mikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXgyKSByZXR1cm4gMDtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgaW5kZXhlcyBvZiB4MSBhbmQgeDMgKHRoZSBhcnJheSBpbmRleGVzIGJlZm9yZSBhbmQgYWZ0ZXIgZ2l2ZW4geDIpOlxuICAgICAgICAgICAgICAgICAgICBpMyA9IGJpbmFyeVNlYXJjaCh0aGlzLngsIHgyKTtcbiAgICAgICAgICAgICAgICAgICAgaTEgPSBpMyAtIDE7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIG91ciBpbmRleGVzIGkxICYgaTMsIHNvIHdlIGNhbiBjYWxjdWxhdGUgYWxyZWFkeTpcbiAgICAgICAgICAgICAgICAgICAgLy8geTIgOj0gKCh4MuKIkngxKSDDlyAoeTPiiJJ5MSkpIMO3ICh4M+KIkngxKSArIHkxXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKHgyIC0gdGhpcy54W2kxXSkgKiAodGhpcy55W2kzXSAtIHRoaXMueVtpMV0pKSAvICh0aGlzLnhbaTNdIC0gdGhpcy54W2kxXSkgKyB0aGlzLnlbaTFdO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBiaW5hcnlTZWFyY2ggPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXhJbmRleCwgbWluSW5kZXgsIGd1ZXNzO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluSW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heEluZGV4ID0gYXJyYXkubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKG1heEluZGV4IC0gbWluSW5kZXggPiAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJheVtndWVzcyA9IG1heEluZGV4ICsgbWluSW5kZXggPj4gMV0gPD0gdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbkluZGV4ID0gZ3Vlc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4SW5kZXggPSBndWVzcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWF4SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvL3h4eDogZm9yIG5vdyBpIHdpbGwganVzdCBzYXZlIG9uZSBzcGxpbmUgZnVuY3Rpb24gdG8gdG9cbiAgICAgICAgICAgIGdldEludGVycG9sYXRlRnVuY3Rpb246IGZ1bmN0aW9uKGMpe1xuICAgICAgICAgICAgICAgIGlmKCFzLmNvbnRyb2xsZXIuc3BsaW5lKSBzLmNvbnRyb2xsZXIuc3BsaW5lID0gcy5wYXJhbXMubG9vcCA/XG4gICAgICAgICAgICAgICAgICAgIG5ldyBzLmNvbnRyb2xsZXIuTGluZWFyU3BsaW5lKHMuc2xpZGVzR3JpZCwgYy5zbGlkZXNHcmlkKSA6XG4gICAgICAgICAgICAgICAgICAgIG5ldyBzLmNvbnRyb2xsZXIuTGluZWFyU3BsaW5lKHMuc25hcEdyaWQsIGMuc25hcEdyaWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldFRyYW5zbGF0ZTogZnVuY3Rpb24gKHRyYW5zbGF0ZSwgYnlDb250cm9sbGVyKSB7XG4gICAgICAgICAgICAgICB2YXIgY29udHJvbGxlZCA9IHMucGFyYW1zLmNvbnRyb2w7XG4gICAgICAgICAgICAgICB2YXIgbXVsdGlwbGllciwgY29udHJvbGxlZFRyYW5zbGF0ZTtcbiAgICAgICAgICAgICAgIGZ1bmN0aW9uIHNldENvbnRyb2xsZWRUcmFuc2xhdGUoYykge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIGFuIEludGVycG9sYXRlIGZ1bmN0aW9uIGJhc2VkIG9uIHRoZSBzbmFwR3JpZHNcbiAgICAgICAgICAgICAgICAgICAgLy8geCBpcyB0aGUgR3JpZCBvZiB0aGUgc2Nyb2xsZWQgc2Nyb2xsZXIgYW5kIHkgd2lsbCBiZSB0aGUgY29udHJvbGxlZCBzY3JvbGxlclxuICAgICAgICAgICAgICAgICAgICAvLyBpdCBtYWtlcyBzZW5zZSB0byBjcmVhdGUgdGhpcyBvbmx5IG9uY2UgYW5kIHJlY2FsbCBpdCBmb3IgdGhlIGludGVycG9sYXRpb25cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGZ1bmN0aW9uIGRvZXMgYSBsb3Qgb2YgdmFsdWUgY2FjaGluZyBmb3IgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlID0gYy5ydGwgJiYgYy5wYXJhbXMuZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAtcy50cmFuc2xhdGUgOiBzLnRyYW5zbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmNvbnRyb2xCeSA9PT0gJ3NsaWRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5jb250cm9sbGVyLmdldEludGVycG9sYXRlRnVuY3Rpb24oYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpIGFtIG5vdCBzdXJlIHdoeSB0aGUgdmFsdWVzIGhhdmUgdG8gYmUgbXVsdGlwbGljYXRlZCB0aGlzIHdheSwgdHJpZWQgdG8gaW52ZXJ0IHRoZSBzbmFwR3JpZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYnV0IGl0IGRpZCBub3Qgd29yayBvdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZWRUcmFuc2xhdGUgPSAtcy5jb250cm9sbGVyLnNwbGluZS5pbnRlcnBvbGF0ZSgtdHJhbnNsYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYoIWNvbnRyb2xsZWRUcmFuc2xhdGUgfHwgcy5wYXJhbXMuY29udHJvbEJ5ID09PSAnY29udGFpbmVyJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsaWVyID0gKGMubWF4VHJhbnNsYXRlKCkgLSBjLm1pblRyYW5zbGF0ZSgpKSAvIChzLm1heFRyYW5zbGF0ZSgpIC0gcy5taW5UcmFuc2xhdGUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVkVHJhbnNsYXRlID0gKHRyYW5zbGF0ZSAtIHMubWluVHJhbnNsYXRlKCkpICogbXVsdGlwbGllciArIGMubWluVHJhbnNsYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5jb250cm9sSW52ZXJzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlZFRyYW5zbGF0ZSA9IGMubWF4VHJhbnNsYXRlKCkgLSBjb250cm9sbGVkVHJhbnNsYXRlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGMudXBkYXRlUHJvZ3Jlc3MoY29udHJvbGxlZFRyYW5zbGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIGMuc2V0V3JhcHBlclRyYW5zbGF0ZShjb250cm9sbGVkVHJhbnNsYXRlLCBmYWxzZSwgcyk7XG4gICAgICAgICAgICAgICAgICAgIGMudXBkYXRlQWN0aXZlSW5kZXgoKTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIGlmIChzLmlzQXJyYXkoY29udHJvbGxlZCkpIHtcbiAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbnRyb2xsZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRyb2xsZWRbaV0gIT09IGJ5Q29udHJvbGxlciAmJiBjb250cm9sbGVkW2ldIGluc3RhbmNlb2YgU3dpcGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDb250cm9sbGVkVHJhbnNsYXRlKGNvbnRyb2xsZWRbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgZWxzZSBpZiAoY29udHJvbGxlZCBpbnN0YW5jZW9mIFN3aXBlciAmJiBieUNvbnRyb2xsZXIgIT09IGNvbnRyb2xsZWQpIHtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgc2V0Q29udHJvbGxlZFRyYW5zbGF0ZShjb250cm9sbGVkKTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXRUcmFuc2l0aW9uOiBmdW5jdGlvbiAoZHVyYXRpb24sIGJ5Q29udHJvbGxlcikge1xuICAgICAgICAgICAgICAgIHZhciBjb250cm9sbGVkID0gcy5wYXJhbXMuY29udHJvbDtcbiAgICAgICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBzZXRDb250cm9sbGVkVHJhbnNpdGlvbihjKSB7XG4gICAgICAgICAgICAgICAgICAgIGMuc2V0V3JhcHBlclRyYW5zaXRpb24oZHVyYXRpb24sIHMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZHVyYXRpb24gIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMub25UcmFuc2l0aW9uU3RhcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMud3JhcHBlci50cmFuc2l0aW9uRW5kKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb250cm9sbGVkKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMucGFyYW1zLmxvb3AgJiYgcy5wYXJhbXMuY29udHJvbEJ5ID09PSAnc2xpZGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMuZml4TG9vcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLm9uVHJhbnNpdGlvbkVuZCgpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzLmlzQXJyYXkoY29udHJvbGxlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbnRyb2xsZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250cm9sbGVkW2ldICE9PSBieUNvbnRyb2xsZXIgJiYgY29udHJvbGxlZFtpXSBpbnN0YW5jZW9mIFN3aXBlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENvbnRyb2xsZWRUcmFuc2l0aW9uKGNvbnRyb2xsZWRbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNvbnRyb2xsZWQgaW5zdGFuY2VvZiBTd2lwZXIgJiYgYnlDb250cm9sbGVyICE9PSBjb250cm9sbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldENvbnRyb2xsZWRUcmFuc2l0aW9uKGNvbnRyb2xsZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICBIYXNoIE5hdmlnYXRpb25cbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBzLmhhc2huYXYgPSB7XG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzLnBhcmFtcy5oYXNobmF2KSByZXR1cm47XG4gICAgICAgICAgICAgICAgcy5oYXNobmF2LmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YXIgaGFzaCA9IGRvY3VtZW50LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc2gpIHJldHVybjtcbiAgICAgICAgICAgICAgICB2YXIgc3BlZWQgPSAwO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBzLnNsaWRlcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2xpZGUgPSBzLnNsaWRlcy5lcShpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNsaWRlSGFzaCA9IHNsaWRlLmF0dHIoJ2RhdGEtaGFzaCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2xpZGVIYXNoID09PSBoYXNoICYmICFzbGlkZS5oYXNDbGFzcyhzLnBhcmFtcy5zbGlkZUR1cGxpY2F0ZUNsYXNzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gc2xpZGUuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuc2xpZGVUbyhpbmRleCwgc3BlZWQsIHMucGFyYW1zLnJ1bkNhbGxiYWNrc09uSW5pdCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0SGFzaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghcy5oYXNobmF2LmluaXRpYWxpemVkIHx8ICFzLnBhcmFtcy5oYXNobmF2KSByZXR1cm47XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaGFzaCA9IHMuc2xpZGVzLmVxKHMuYWN0aXZlSW5kZXgpLmF0dHIoJ2RhdGEtaGFzaCcpIHx8ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgIEtleWJvYXJkIENvbnRyb2xcbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBmdW5jdGlvbiBoYW5kbGVLZXlib2FyZChlKSB7XG4gICAgICAgICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50KSBlID0gZS5vcmlnaW5hbEV2ZW50OyAvL2pxdWVyeSBmaXhcbiAgICAgICAgICAgIHZhciBrYyA9IGUua2V5Q29kZSB8fCBlLmNoYXJDb2RlO1xuICAgICAgICAgICAgLy8gRGlyZWN0aW9ucyBsb2Nrc1xuICAgICAgICAgICAgaWYgKCFzLnBhcmFtcy5hbGxvd1N3aXBlVG9OZXh0ICYmIChzLmlzSG9yaXpvbnRhbCgpICYmIGtjID09PSAzOSB8fCAhcy5pc0hvcml6b250YWwoKSAmJiBrYyA9PT0gNDApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzLnBhcmFtcy5hbGxvd1N3aXBlVG9QcmV2ICYmIChzLmlzSG9yaXpvbnRhbCgpICYmIGtjID09PSAzNyB8fCAhcy5pc0hvcml6b250YWwoKSAmJiBrYyA9PT0gMzgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkgfHwgZS5hbHRLZXkgfHwgZS5jdHJsS2V5IHx8IGUubWV0YUtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQubm9kZU5hbWUgJiYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2lucHV0JyB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICd0ZXh0YXJlYScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGtjID09PSAzNyB8fCBrYyA9PT0gMzkgfHwga2MgPT09IDM4IHx8IGtjID09PSA0MCkge1xuICAgICAgICAgICAgICAgIHZhciBpblZpZXcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvL0NoZWNrIHRoYXQgc3dpcGVyIHNob3VsZCBiZSBpbnNpZGUgb2YgdmlzaWJsZSBhcmVhIG9mIHdpbmRvd1xuICAgICAgICAgICAgICAgIGlmIChzLmNvbnRhaW5lci5wYXJlbnRzKCcuc3dpcGVyLXNsaWRlJykubGVuZ3RoID4gMCAmJiBzLmNvbnRhaW5lci5wYXJlbnRzKCcuc3dpcGVyLXNsaWRlLWFjdGl2ZScpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB3aW5kb3dTY3JvbGwgPSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHdpbmRvdy5wYWdlWE9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgICAgIHZhciB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgICAgICAgdmFyIHN3aXBlck9mZnNldCA9IHMuY29udGFpbmVyLm9mZnNldCgpO1xuICAgICAgICAgICAgICAgIGlmIChzLnJ0bCkgc3dpcGVyT2Zmc2V0LmxlZnQgPSBzd2lwZXJPZmZzZXQubGVmdCAtIHMuY29udGFpbmVyWzBdLnNjcm9sbExlZnQ7XG4gICAgICAgICAgICAgICAgdmFyIHN3aXBlckNvb3JkID0gW1xuICAgICAgICAgICAgICAgICAgICBbc3dpcGVyT2Zmc2V0LmxlZnQsIHN3aXBlck9mZnNldC50b3BdLFxuICAgICAgICAgICAgICAgICAgICBbc3dpcGVyT2Zmc2V0LmxlZnQgKyBzLndpZHRoLCBzd2lwZXJPZmZzZXQudG9wXSxcbiAgICAgICAgICAgICAgICAgICAgW3N3aXBlck9mZnNldC5sZWZ0LCBzd2lwZXJPZmZzZXQudG9wICsgcy5oZWlnaHRdLFxuICAgICAgICAgICAgICAgICAgICBbc3dpcGVyT2Zmc2V0LmxlZnQgKyBzLndpZHRoLCBzd2lwZXJPZmZzZXQudG9wICsgcy5oZWlnaHRdXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN3aXBlckNvb3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb2ludCA9IHN3aXBlckNvb3JkW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludFswXSA+PSB3aW5kb3dTY3JvbGwubGVmdCAmJiBwb2ludFswXSA8PSB3aW5kb3dTY3JvbGwubGVmdCArIHdpbmRvd1dpZHRoICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludFsxXSA+PSB3aW5kb3dTY3JvbGwudG9wICYmIHBvaW50WzFdIDw9IHdpbmRvd1Njcm9sbC50b3AgKyB3aW5kb3dIZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpblZpZXcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWluVmlldykgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHMuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2MgPT09IDM3IHx8IGtjID09PSAzOSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKChrYyA9PT0gMzkgJiYgIXMucnRsKSB8fCAoa2MgPT09IDM3ICYmIHMucnRsKSkgcy5zbGlkZU5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoKGtjID09PSAzNyAmJiAhcy5ydGwpIHx8IChrYyA9PT0gMzkgJiYgcy5ydGwpKSBzLnNsaWRlUHJldigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGtjID09PSAzOCB8fCBrYyA9PT0gNDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChrYyA9PT0gNDApIHMuc2xpZGVOZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGtjID09PSAzOCkgcy5zbGlkZVByZXYoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzLmRpc2FibGVLZXlib2FyZENvbnRyb2wgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzLnBhcmFtcy5rZXlib2FyZENvbnRyb2wgPSBmYWxzZTtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9mZigna2V5ZG93bicsIGhhbmRsZUtleWJvYXJkKTtcbiAgICAgICAgfTtcbiAgICAgICAgcy5lbmFibGVLZXlib2FyZENvbnRyb2wgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzLnBhcmFtcy5rZXlib2FyZENvbnRyb2wgPSB0cnVlO1xuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2tleWRvd24nLCBoYW5kbGVLZXlib2FyZCk7XG4gICAgICAgIH07XG4gICAgICAgIFxuXG4gICAgICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgIE1vdXNld2hlZWwgQ29udHJvbFxuICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgICAgIHMubW91c2V3aGVlbCA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBmYWxzZSxcbiAgICAgICAgICAgIGxhc3RTY3JvbGxUaW1lOiAobmV3IHdpbmRvdy5EYXRlKCkpLmdldFRpbWUoKVxuICAgICAgICB9O1xuICAgICAgICBpZiAocy5wYXJhbXMubW91c2V3aGVlbENvbnRyb2wpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbmV3IHdpbmRvdy5XaGVlbEV2ZW50KCd3aGVlbCcpO1xuICAgICAgICAgICAgICAgIHMubW91c2V3aGVlbC5ldmVudCA9ICd3aGVlbCc7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICBcbiAgICAgICAgICAgIGlmICghcy5tb3VzZXdoZWVsLmV2ZW50ICYmIGRvY3VtZW50Lm9ubW91c2V3aGVlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcy5tb3VzZXdoZWVsLmV2ZW50ID0gJ21vdXNld2hlZWwnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzLm1vdXNld2hlZWwuZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzLm1vdXNld2hlZWwuZXZlbnQgPSAnRE9NTW91c2VTY3JvbGwnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU1vdXNld2hlZWwoZSkge1xuICAgICAgICAgICAgaWYgKGUub3JpZ2luYWxFdmVudCkgZSA9IGUub3JpZ2luYWxFdmVudDsgLy9qcXVlcnkgZml4XG4gICAgICAgICAgICB2YXIgd2UgPSBzLm1vdXNld2hlZWwuZXZlbnQ7XG4gICAgICAgICAgICB2YXIgZGVsdGEgPSAwO1xuICAgICAgICAgICAgdmFyIHJ0bEZhY3RvciA9IHMucnRsID8gLTEgOiAxO1xuICAgICAgICAgICAgLy9PcGVyYSAmIElFXG4gICAgICAgICAgICBpZiAoZS5kZXRhaWwpIGRlbHRhID0gLWUuZGV0YWlsO1xuICAgICAgICAgICAgLy9XZWJLaXRzXG4gICAgICAgICAgICBlbHNlIGlmICh3ZSA9PT0gJ21vdXNld2hlZWwnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLm1vdXNld2hlZWxGb3JjZVRvQXhpcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5pc0hvcml6b250YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGUud2hlZWxEZWx0YVgpID4gTWF0aC5hYnMoZS53aGVlbERlbHRhWSkpIGRlbHRhID0gZS53aGVlbERlbHRhWCAqIHJ0bEZhY3RvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGUud2hlZWxEZWx0YVkpID4gTWF0aC5hYnMoZS53aGVlbERlbHRhWCkpIGRlbHRhID0gZS53aGVlbERlbHRhWTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWx0YSA9IE1hdGguYWJzKGUud2hlZWxEZWx0YVgpID4gTWF0aC5hYnMoZS53aGVlbERlbHRhWSkgPyAtIGUud2hlZWxEZWx0YVggKiBydGxGYWN0b3IgOiAtIGUud2hlZWxEZWx0YVk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9PbGQgRmlyZUZveFxuICAgICAgICAgICAgZWxzZSBpZiAod2UgPT09ICdET01Nb3VzZVNjcm9sbCcpIGRlbHRhID0gLWUuZGV0YWlsO1xuICAgICAgICAgICAgLy9OZXcgRmlyZUZveFxuICAgICAgICAgICAgZWxzZSBpZiAod2UgPT09ICd3aGVlbCcpIHtcbiAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMubW91c2V3aGVlbEZvcmNlVG9BeGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLmlzSG9yaXpvbnRhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZS5kZWx0YVgpID4gTWF0aC5hYnMoZS5kZWx0YVkpKSBkZWx0YSA9IC1lLmRlbHRhWCAqIHJ0bEZhY3RvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGUuZGVsdGFZKSA+IE1hdGguYWJzKGUuZGVsdGFYKSkgZGVsdGEgPSAtZS5kZWx0YVk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsdGEgPSBNYXRoLmFicyhlLmRlbHRhWCkgPiBNYXRoLmFicyhlLmRlbHRhWSkgPyAtIGUuZGVsdGFYICogcnRsRmFjdG9yIDogLSBlLmRlbHRhWTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGVsdGEgPT09IDApIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAocy5wYXJhbXMubW91c2V3aGVlbEludmVydCkgZGVsdGEgPSAtZGVsdGE7XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKCFzLnBhcmFtcy5mcmVlTW9kZSkge1xuICAgICAgICAgICAgICAgIGlmICgobmV3IHdpbmRvdy5EYXRlKCkpLmdldFRpbWUoKSAtIHMubW91c2V3aGVlbC5sYXN0U2Nyb2xsVGltZSA+IDYwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWx0YSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoIXMuaXNFbmQgfHwgcy5wYXJhbXMubG9vcCkgJiYgIXMuYW5pbWF0aW5nKSBzLnNsaWRlTmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocy5wYXJhbXMubW91c2V3aGVlbFJlbGVhc2VPbkVkZ2VzKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoIXMuaXNCZWdpbm5pbmcgfHwgcy5wYXJhbXMubG9vcCkgJiYgIXMuYW5pbWF0aW5nKSBzLnNsaWRlUHJldigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocy5wYXJhbXMubW91c2V3aGVlbFJlbGVhc2VPbkVkZ2VzKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzLm1vdXNld2hlZWwubGFzdFNjcm9sbFRpbWUgPSAobmV3IHdpbmRvdy5EYXRlKCkpLmdldFRpbWUoKTtcbiAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL0ZyZWVtb2RlIG9yIHNjcm9sbENvbnRhaW5lcjpcbiAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb24gPSBzLmdldFdyYXBwZXJUcmFuc2xhdGUoKSArIGRlbHRhICogcy5wYXJhbXMubW91c2V3aGVlbFNlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHZhciB3YXNCZWdpbm5pbmcgPSBzLmlzQmVnaW5uaW5nLFxuICAgICAgICAgICAgICAgICAgICB3YXNFbmQgPSBzLmlzRW5kO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAocG9zaXRpb24gPj0gcy5taW5UcmFuc2xhdGUoKSkgcG9zaXRpb24gPSBzLm1pblRyYW5zbGF0ZSgpO1xuICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbiA8PSBzLm1heFRyYW5zbGF0ZSgpKSBwb3NpdGlvbiA9IHMubWF4VHJhbnNsYXRlKCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIHMuc2V0V3JhcHBlclRyYW5zaXRpb24oMCk7XG4gICAgICAgICAgICAgICAgcy5zZXRXcmFwcGVyVHJhbnNsYXRlKHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBzLnVwZGF0ZVByb2dyZXNzKCk7XG4gICAgICAgICAgICAgICAgcy51cGRhdGVBY3RpdmVJbmRleCgpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIXdhc0JlZ2lubmluZyAmJiBzLmlzQmVnaW5uaW5nIHx8ICF3YXNFbmQgJiYgcy5pc0VuZCkge1xuICAgICAgICAgICAgICAgICAgICBzLnVwZGF0ZUNsYXNzZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5mcmVlTW9kZVN0aWNreSkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocy5tb3VzZXdoZWVsLnRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICBzLm1vdXNld2hlZWwudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5zbGlkZVJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMubGF6eUxvYWRpbmcgJiYgcy5sYXp5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLmxhenkubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBSZXR1cm4gcGFnZSBzY3JvbGwgb24gZWRnZSBwb3NpdGlvbnNcbiAgICAgICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IDAgfHwgcG9zaXRpb24gPT09IHMubWF4VHJhbnNsYXRlKCkpIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5hdXRvcGxheSkgcy5zdG9wQXV0b3BsYXkoKTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZWxzZSBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcy5kaXNhYmxlTW91c2V3aGVlbENvbnRyb2wgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIXMubW91c2V3aGVlbC5ldmVudCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcy5jb250YWluZXIub2ZmKHMubW91c2V3aGVlbC5ldmVudCwgaGFuZGxlTW91c2V3aGVlbCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHMuZW5hYmxlTW91c2V3aGVlbENvbnRyb2wgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIXMubW91c2V3aGVlbC5ldmVudCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcy5jb250YWluZXIub24ocy5tb3VzZXdoZWVsLmV2ZW50LCBoYW5kbGVNb3VzZXdoZWVsKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICBcblxuICAgICAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICBQYXJhbGxheFxuICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgICAgIGZ1bmN0aW9uIHNldFBhcmFsbGF4VHJhbnNmb3JtKGVsLCBwcm9ncmVzcykge1xuICAgICAgICAgICAgZWwgPSAkKGVsKTtcbiAgICAgICAgICAgIHZhciBwLCBwWCwgcFk7XG4gICAgICAgICAgICB2YXIgcnRsRmFjdG9yID0gcy5ydGwgPyAtMSA6IDE7XG4gICAgICAgIFxuICAgICAgICAgICAgcCA9IGVsLmF0dHIoJ2RhdGEtc3dpcGVyLXBhcmFsbGF4JykgfHwgJzAnO1xuICAgICAgICAgICAgcFggPSBlbC5hdHRyKCdkYXRhLXN3aXBlci1wYXJhbGxheC14Jyk7XG4gICAgICAgICAgICBwWSA9IGVsLmF0dHIoJ2RhdGEtc3dpcGVyLXBhcmFsbGF4LXknKTtcbiAgICAgICAgICAgIGlmIChwWCB8fCBwWSkge1xuICAgICAgICAgICAgICAgIHBYID0gcFggfHwgJzAnO1xuICAgICAgICAgICAgICAgIHBZID0gcFkgfHwgJzAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHMuaXNIb3Jpem9udGFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcFggPSBwO1xuICAgICAgICAgICAgICAgICAgICBwWSA9ICcwJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBZID0gcDtcbiAgICAgICAgICAgICAgICAgICAgcFggPSAnMCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIGlmICgocFgpLmluZGV4T2YoJyUnKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcFggPSBwYXJzZUludChwWCwgMTApICogcHJvZ3Jlc3MgKiBydGxGYWN0b3IgKyAnJSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwWCA9IHBYICogcHJvZ3Jlc3MgKiBydGxGYWN0b3IgKyAncHgnIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgocFkpLmluZGV4T2YoJyUnKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcFkgPSBwYXJzZUludChwWSwgMTApICogcHJvZ3Jlc3MgKyAnJSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwWSA9IHBZICogcHJvZ3Jlc3MgKyAncHgnIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICBlbC50cmFuc2Zvcm0oJ3RyYW5zbGF0ZTNkKCcgKyBwWCArICcsICcgKyBwWSArICcsMHB4KScpO1xuICAgICAgICB9XG4gICAgICAgIHMucGFyYWxsYXggPSB7XG4gICAgICAgICAgICBzZXRUcmFuc2xhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzLmNvbnRhaW5lci5jaGlsZHJlbignW2RhdGEtc3dpcGVyLXBhcmFsbGF4XSwgW2RhdGEtc3dpcGVyLXBhcmFsbGF4LXhdLCBbZGF0YS1zd2lwZXItcGFyYWxsYXgteV0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHNldFBhcmFsbGF4VHJhbnNmb3JtKHRoaXMsIHMucHJvZ3Jlc3MpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzLnNsaWRlcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNsaWRlID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGUuZmluZCgnW2RhdGEtc3dpcGVyLXBhcmFsbGF4XSwgW2RhdGEtc3dpcGVyLXBhcmFsbGF4LXhdLCBbZGF0YS1zd2lwZXItcGFyYWxsYXgteV0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9ncmVzcyA9IE1hdGgubWluKE1hdGgubWF4KHNsaWRlWzBdLnByb2dyZXNzLCAtMSksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0UGFyYWxsYXhUcmFuc2Zvcm0odGhpcywgcHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXRUcmFuc2l0aW9uOiBmdW5jdGlvbiAoZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGR1cmF0aW9uID09PSAndW5kZWZpbmVkJykgZHVyYXRpb24gPSBzLnBhcmFtcy5zcGVlZDtcbiAgICAgICAgICAgICAgICBzLmNvbnRhaW5lci5maW5kKCdbZGF0YS1zd2lwZXItcGFyYWxsYXhdLCBbZGF0YS1zd2lwZXItcGFyYWxsYXgteF0sIFtkYXRhLXN3aXBlci1wYXJhbGxheC15XScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmFsbGF4RHVyYXRpb24gPSBwYXJzZUludChlbC5hdHRyKCdkYXRhLXN3aXBlci1wYXJhbGxheC1kdXJhdGlvbicpLCAxMCkgfHwgZHVyYXRpb247XG4gICAgICAgICAgICAgICAgICAgIGlmIChkdXJhdGlvbiA9PT0gMCkgcGFyYWxsYXhEdXJhdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGVsLnRyYW5zaXRpb24ocGFyYWxsYXhEdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuXG4gICAgICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgIFBsdWdpbnMgQVBJLiBDb2xsZWN0IGFsbCBhbmQgaW5pdCBhbGwgcGx1Z2luc1xuICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgICAgIHMuX3BsdWdpbnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgcGx1Z2luIGluIHMucGx1Z2lucykge1xuICAgICAgICAgICAgdmFyIHAgPSBzLnBsdWdpbnNbcGx1Z2luXShzLCBzLnBhcmFtc1twbHVnaW5dKTtcbiAgICAgICAgICAgIGlmIChwKSBzLl9wbHVnaW5zLnB1c2gocCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWV0aG9kIHRvIGNhbGwgYWxsIHBsdWdpbnMgZXZlbnQvbWV0aG9kXG4gICAgICAgIHMuY2FsbFBsdWdpbnMgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMuX3BsdWdpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnROYW1lIGluIHMuX3BsdWdpbnNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcy5fcGx1Z2luc1tpXVtldmVudE5hbWVdKGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdLCBhcmd1bWVudHNbM10sIGFyZ3VtZW50c1s0XSwgYXJndW1lbnRzWzVdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgRXZlbnRzL0NhbGxiYWNrcy9QbHVnaW5zIEVtaXR0ZXJcbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBmdW5jdGlvbiBub3JtYWxpemVFdmVudE5hbWUgKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgaWYgKGV2ZW50TmFtZS5pbmRleE9mKCdvbicpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50TmFtZVswXSAhPT0gZXZlbnROYW1lWzBdLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lID0gJ29uJyArIGV2ZW50TmFtZVswXS50b1VwcGVyQ2FzZSgpICsgZXZlbnROYW1lLnN1YnN0cmluZygxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZSA9ICdvbicgKyBldmVudE5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGV2ZW50TmFtZTtcbiAgICAgICAgfVxuICAgICAgICBzLmVtaXR0ZXJFdmVudExpc3RlbmVycyA9IHtcbiAgICAgICAgXG4gICAgICAgIH07XG4gICAgICAgIHMuZW1pdCA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICAgICAgICAgIC8vIFRyaWdnZXIgY2FsbGJhY2tzXG4gICAgICAgICAgICBpZiAocy5wYXJhbXNbZXZlbnROYW1lXSkge1xuICAgICAgICAgICAgICAgIHMucGFyYW1zW2V2ZW50TmFtZV0oYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0sIGFyZ3VtZW50c1szXSwgYXJndW1lbnRzWzRdLCBhcmd1bWVudHNbNV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAvLyBUcmlnZ2VyIGV2ZW50c1xuICAgICAgICAgICAgaWYgKHMuZW1pdHRlckV2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcy5lbWl0dGVyRXZlbnRMaXN0ZW5lcnNbZXZlbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBzLmVtaXR0ZXJFdmVudExpc3RlbmVyc1tldmVudE5hbWVdW2ldKGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdLCBhcmd1bWVudHNbM10sIGFyZ3VtZW50c1s0XSwgYXJndW1lbnRzWzVdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUcmlnZ2VyIHBsdWdpbnNcbiAgICAgICAgICAgIGlmIChzLmNhbGxQbHVnaW5zKSBzLmNhbGxQbHVnaW5zKGV2ZW50TmFtZSwgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0sIGFyZ3VtZW50c1szXSwgYXJndW1lbnRzWzRdLCBhcmd1bWVudHNbNV0pO1xuICAgICAgICB9O1xuICAgICAgICBzLm9uID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgZXZlbnROYW1lID0gbm9ybWFsaXplRXZlbnROYW1lKGV2ZW50TmFtZSk7XG4gICAgICAgICAgICBpZiAoIXMuZW1pdHRlckV2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0pIHMuZW1pdHRlckV2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgICAgIHMuZW1pdHRlckV2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0ucHVzaChoYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9O1xuICAgICAgICBzLm9mZiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgZXZlbnROYW1lID0gbm9ybWFsaXplRXZlbnROYW1lKGV2ZW50TmFtZSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBoYW5kbGVycyBmb3Igc3VjaCBldmVudFxuICAgICAgICAgICAgICAgIHMuZW1pdHRlckV2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcy5lbWl0dGVyRXZlbnRMaXN0ZW5lcnNbZXZlbnROYW1lXSB8fCBzLmVtaXR0ZXJFdmVudExpc3RlbmVyc1tldmVudE5hbWVdLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHMuZW1pdHRlckV2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZihzLmVtaXR0ZXJFdmVudExpc3RlbmVyc1tldmVudE5hbWVdW2ldID09PSBoYW5kbGVyKSBzLmVtaXR0ZXJFdmVudExpc3RlbmVyc1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9O1xuICAgICAgICBzLm9uY2UgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICBldmVudE5hbWUgPSBub3JtYWxpemVFdmVudE5hbWUoZXZlbnROYW1lKTtcbiAgICAgICAgICAgIHZhciBfaGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0sIGFyZ3VtZW50c1szXSwgYXJndW1lbnRzWzRdKTtcbiAgICAgICAgICAgICAgICBzLm9mZihldmVudE5hbWUsIF9oYW5kbGVyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzLm9uKGV2ZW50TmFtZSwgX2hhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQWNjZXNzaWJpbGl0eSB0b29sc1xuICAgICAgICBzLmExMXkgPSB7XG4gICAgICAgICAgICBtYWtlRm9jdXNhYmxlOiBmdW5jdGlvbiAoJGVsKSB7XG4gICAgICAgICAgICAgICAgJGVsLmF0dHIoJ3RhYkluZGV4JywgJzAnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGVsO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZFJvbGU6IGZ1bmN0aW9uICgkZWwsIHJvbGUpIHtcbiAgICAgICAgICAgICAgICAkZWwuYXR0cigncm9sZScsIHJvbGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiAkZWw7XG4gICAgICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgICAgIGFkZExhYmVsOiBmdW5jdGlvbiAoJGVsLCBsYWJlbCkge1xuICAgICAgICAgICAgICAgICRlbC5hdHRyKCdhcmlhLWxhYmVsJywgbGFiZWwpO1xuICAgICAgICAgICAgICAgIHJldHVybiAkZWw7XG4gICAgICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uICgkZWwpIHtcbiAgICAgICAgICAgICAgICAkZWwuYXR0cignYXJpYS1kaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiAkZWw7XG4gICAgICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgICAgIGVuYWJsZTogZnVuY3Rpb24gKCRlbCkge1xuICAgICAgICAgICAgICAgICRlbC5hdHRyKCdhcmlhLWRpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiAkZWw7XG4gICAgICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgICAgIG9uRW50ZXJLZXk6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlICE9PSAxMykgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmICgkKGV2ZW50LnRhcmdldCkuaXMocy5wYXJhbXMubmV4dEJ1dHRvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgcy5vbkNsaWNrTmV4dChldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLmlzRW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLmExMXkubm90aWZ5KHMucGFyYW1zLmxhc3RTbGlkZU1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5hMTF5Lm5vdGlmeShzLnBhcmFtcy5uZXh0U2xpZGVNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICgkKGV2ZW50LnRhcmdldCkuaXMocy5wYXJhbXMucHJldkJ1dHRvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgcy5vbkNsaWNrUHJldihldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLmlzQmVnaW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzLmExMXkubm90aWZ5KHMucGFyYW1zLmZpcnN0U2xpZGVNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuYTExeS5ub3RpZnkocy5wYXJhbXMucHJldlNsaWRlTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCQoZXZlbnQudGFyZ2V0KS5pcygnLicgKyBzLnBhcmFtcy5idWxsZXRDbGFzcykpIHtcbiAgICAgICAgICAgICAgICAgICAgJChldmVudC50YXJnZXQpWzBdLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgICAgICBsaXZlUmVnaW9uOiAkKCc8c3BhbiBjbGFzcz1cInN3aXBlci1ub3RpZmljYXRpb25cIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIiBhcmlhLWF0b21pYz1cInRydWVcIj48L3NwYW4+JyksXG4gICAgICAgIFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIHZhciBub3RpZmljYXRpb24gPSBzLmExMXkubGl2ZVJlZ2lvbjtcbiAgICAgICAgICAgICAgICBpZiAobm90aWZpY2F0aW9uLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5odG1sKCcnKTtcbiAgICAgICAgICAgICAgICBub3RpZmljYXRpb24uaHRtbChtZXNzYWdlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gU2V0dXAgYWNjZXNzaWJpbGl0eVxuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5uZXh0QnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0QnV0dG9uID0gJChzLnBhcmFtcy5uZXh0QnV0dG9uKTtcbiAgICAgICAgICAgICAgICAgICAgcy5hMTF5Lm1ha2VGb2N1c2FibGUobmV4dEJ1dHRvbik7XG4gICAgICAgICAgICAgICAgICAgIHMuYTExeS5hZGRSb2xlKG5leHRCdXR0b24sICdidXR0b24nKTtcbiAgICAgICAgICAgICAgICAgICAgcy5hMTF5LmFkZExhYmVsKG5leHRCdXR0b24sIHMucGFyYW1zLm5leHRTbGlkZU1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMucHJldkJ1dHRvbikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJldkJ1dHRvbiA9ICQocy5wYXJhbXMucHJldkJ1dHRvbik7XG4gICAgICAgICAgICAgICAgICAgIHMuYTExeS5tYWtlRm9jdXNhYmxlKHByZXZCdXR0b24pO1xuICAgICAgICAgICAgICAgICAgICBzLmExMXkuYWRkUm9sZShwcmV2QnV0dG9uLCAnYnV0dG9uJyk7XG4gICAgICAgICAgICAgICAgICAgIHMuYTExeS5hZGRMYWJlbChwcmV2QnV0dG9uLCBzLnBhcmFtcy5wcmV2U2xpZGVNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICQocy5jb250YWluZXIpLmFwcGVuZChzLmExMXkubGl2ZVJlZ2lvbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5pdFBhZ2luYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAocy5wYXJhbXMucGFnaW5hdGlvbiAmJiBzLnBhcmFtcy5wYWdpbmF0aW9uQ2xpY2thYmxlICYmIHMuYnVsbGV0cyAmJiBzLmJ1bGxldHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuYnVsbGV0cy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBidWxsZXQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5hMTF5Lm1ha2VGb2N1c2FibGUoYnVsbGV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuYTExeS5hZGRSb2xlKGJ1bGxldCwgJ2J1dHRvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5hMTF5LmFkZExhYmVsKGJ1bGxldCwgcy5wYXJhbXMucGFnaW5hdGlvbkJ1bGxldE1lc3NhZ2UucmVwbGFjZSgve3tpbmRleH19LywgYnVsbGV0LmluZGV4KCkgKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHMuYTExeS5saXZlUmVnaW9uICYmIHMuYTExeS5saXZlUmVnaW9uLmxlbmd0aCA+IDApIHMuYTExeS5saXZlUmVnaW9uLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcblxuICAgICAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICBJbml0L0Rlc3Ryb3lcbiAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBzLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMubG9vcCkgcy5jcmVhdGVMb29wKCk7XG4gICAgICAgICAgICBzLnVwZGF0ZUNvbnRhaW5lclNpemUoKTtcbiAgICAgICAgICAgIHMudXBkYXRlU2xpZGVzU2l6ZSgpO1xuICAgICAgICAgICAgcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMuc2Nyb2xsYmFyICYmIHMuc2Nyb2xsYmFyKSB7XG4gICAgICAgICAgICAgICAgcy5zY3JvbGxiYXIuc2V0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLnNjcm9sbGJhckRyYWdnYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBzLnNjcm9sbGJhci5lbmFibGVEcmFnZ2FibGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMuZWZmZWN0ICE9PSAnc2xpZGUnICYmIHMuZWZmZWN0c1tzLnBhcmFtcy5lZmZlY3RdKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzLnBhcmFtcy5sb29wKSBzLnVwZGF0ZVByb2dyZXNzKCk7XG4gICAgICAgICAgICAgICAgcy5lZmZlY3RzW3MucGFyYW1zLmVmZmVjdF0uc2V0VHJhbnNsYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMubG9vcCkge1xuICAgICAgICAgICAgICAgIHMuc2xpZGVUbyhzLnBhcmFtcy5pbml0aWFsU2xpZGUgKyBzLmxvb3BlZFNsaWRlcywgMCwgcy5wYXJhbXMucnVuQ2FsbGJhY2tzT25Jbml0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHMuc2xpZGVUbyhzLnBhcmFtcy5pbml0aWFsU2xpZGUsIDAsIHMucGFyYW1zLnJ1bkNhbGxiYWNrc09uSW5pdCk7XG4gICAgICAgICAgICAgICAgaWYgKHMucGFyYW1zLmluaXRpYWxTbGlkZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5wYXJhbGxheCAmJiBzLnBhcmFtcy5wYXJhbGxheCkgcy5wYXJhbGxheC5zZXRUcmFuc2xhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMubGF6eSAmJiBzLnBhcmFtcy5sYXp5TG9hZGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5sYXp5LmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMubGF6eS5pbml0aWFsSW1hZ2VMb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcy5hdHRhY2hFdmVudHMoKTtcbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5vYnNlcnZlciAmJiBzLnN1cHBvcnQub2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgICAgICBzLmluaXRPYnNlcnZlcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5wcmVsb2FkSW1hZ2VzICYmICFzLnBhcmFtcy5sYXp5TG9hZGluZykge1xuICAgICAgICAgICAgICAgIHMucHJlbG9hZEltYWdlcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHMucGFyYW1zLmF1dG9wbGF5KSB7XG4gICAgICAgICAgICAgICAgcy5zdGFydEF1dG9wbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMua2V5Ym9hcmRDb250cm9sKSB7XG4gICAgICAgICAgICAgICAgaWYgKHMuZW5hYmxlS2V5Ym9hcmRDb250cm9sKSBzLmVuYWJsZUtleWJvYXJkQ29udHJvbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHMucGFyYW1zLm1vdXNld2hlZWxDb250cm9sKSB7XG4gICAgICAgICAgICAgICAgaWYgKHMuZW5hYmxlTW91c2V3aGVlbENvbnRyb2wpIHMuZW5hYmxlTW91c2V3aGVlbENvbnRyb2woKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5oYXNobmF2KSB7XG4gICAgICAgICAgICAgICAgaWYgKHMuaGFzaG5hdikgcy5oYXNobmF2LmluaXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5hMTF5ICYmIHMuYTExeSkgcy5hMTF5LmluaXQoKTtcbiAgICAgICAgICAgIHMuZW1pdCgnb25Jbml0Jywgcyk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAvLyBDbGVhbnVwIGR5bmFtaWMgc3R5bGVzXG4gICAgICAgIHMuY2xlYW51cFN0eWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIENvbnRhaW5lclxuICAgICAgICAgICAgcy5jb250YWluZXIucmVtb3ZlQ2xhc3Mocy5jbGFzc05hbWVzLmpvaW4oJyAnKSkucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBXcmFwcGVyXG4gICAgICAgICAgICBzLndyYXBwZXIucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBTbGlkZXNcbiAgICAgICAgICAgIGlmIChzLnNsaWRlcyAmJiBzLnNsaWRlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBzLnNsaWRlc1xuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoW1xuICAgICAgICAgICAgICAgICAgICAgIHMucGFyYW1zLnNsaWRlVmlzaWJsZUNsYXNzLFxuICAgICAgICAgICAgICAgICAgICAgIHMucGFyYW1zLnNsaWRlQWN0aXZlQ2xhc3MsXG4gICAgICAgICAgICAgICAgICAgICAgcy5wYXJhbXMuc2xpZGVOZXh0Q2xhc3MsXG4gICAgICAgICAgICAgICAgICAgICAgcy5wYXJhbXMuc2xpZGVQcmV2Q2xhc3NcbiAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJykpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdzdHlsZScpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdkYXRhLXN3aXBlci1jb2x1bW4nKVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignZGF0YS1zd2lwZXItcm93Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gUGFnaW5hdGlvbi9CdWxsZXRzXG4gICAgICAgICAgICBpZiAocy5wYWdpbmF0aW9uQ29udGFpbmVyICYmIHMucGFnaW5hdGlvbkNvbnRhaW5lci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBzLnBhZ2luYXRpb25Db250YWluZXIucmVtb3ZlQ2xhc3Mocy5wYXJhbXMucGFnaW5hdGlvbkhpZGRlbkNsYXNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLmJ1bGxldHMgJiYgcy5idWxsZXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHMuYnVsbGV0cy5yZW1vdmVDbGFzcyhzLnBhcmFtcy5idWxsZXRBY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gQnV0dG9uc1xuICAgICAgICAgICAgaWYgKHMucGFyYW1zLnByZXZCdXR0b24pICQocy5wYXJhbXMucHJldkJ1dHRvbikucmVtb3ZlQ2xhc3Mocy5wYXJhbXMuYnV0dG9uRGlzYWJsZWRDbGFzcyk7XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMubmV4dEJ1dHRvbikgJChzLnBhcmFtcy5uZXh0QnV0dG9uKS5yZW1vdmVDbGFzcyhzLnBhcmFtcy5idXR0b25EaXNhYmxlZENsYXNzKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBTY3JvbGxiYXJcbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5zY3JvbGxiYXIgJiYgcy5zY3JvbGxiYXIpIHtcbiAgICAgICAgICAgICAgICBpZiAocy5zY3JvbGxiYXIudHJhY2sgJiYgcy5zY3JvbGxiYXIudHJhY2subGVuZ3RoKSBzLnNjcm9sbGJhci50cmFjay5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAgICAgICAgICAgICAgIGlmIChzLnNjcm9sbGJhci5kcmFnICYmIHMuc2Nyb2xsYmFyLmRyYWcubGVuZ3RoKSBzLnNjcm9sbGJhci5kcmFnLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAvLyBEZXN0cm95XG4gICAgICAgIHMuZGVzdHJveSA9IGZ1bmN0aW9uIChkZWxldGVJbnN0YW5jZSwgY2xlYW51cFN0eWxlcykge1xuICAgICAgICAgICAgLy8gRGV0YWNoIGV2ZWJ0c1xuICAgICAgICAgICAgcy5kZXRhY2hFdmVudHMoKTtcbiAgICAgICAgICAgIC8vIFN0b3AgYXV0b3BsYXlcbiAgICAgICAgICAgIHMuc3RvcEF1dG9wbGF5KCk7XG4gICAgICAgICAgICAvLyBEaXNhYmxlIGRyYWdnYWJsZVxuICAgICAgICAgICAgaWYgKHMucGFyYW1zLnNjcm9sbGJhciAmJiBzLnNjcm9sbGJhcikge1xuICAgICAgICAgICAgICAgIGlmIChzLnBhcmFtcy5zY3JvbGxiYXJEcmFnZ2FibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcy5zY3JvbGxiYXIuZGlzYWJsZURyYWdnYWJsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIERlc3Ryb3kgbG9vcFxuICAgICAgICAgICAgaWYgKHMucGFyYW1zLmxvb3ApIHtcbiAgICAgICAgICAgICAgICBzLmRlc3Ryb3lMb29wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBDbGVhbnVwIHN0eWxlc1xuICAgICAgICAgICAgaWYgKGNsZWFudXBTdHlsZXMpIHtcbiAgICAgICAgICAgICAgICBzLmNsZWFudXBTdHlsZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIERpc2Nvbm5lY3Qgb2JzZXJ2ZXJcbiAgICAgICAgICAgIHMuZGlzY29ubmVjdE9ic2VydmVycygpO1xuICAgICAgICAgICAgLy8gRGlzYWJsZSBrZXlib2FyZC9tb3VzZXdoZWVsXG4gICAgICAgICAgICBpZiAocy5wYXJhbXMua2V5Ym9hcmRDb250cm9sKSB7XG4gICAgICAgICAgICAgICAgaWYgKHMuZGlzYWJsZUtleWJvYXJkQ29udHJvbCkgcy5kaXNhYmxlS2V5Ym9hcmRDb250cm9sKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5wYXJhbXMubW91c2V3aGVlbENvbnRyb2wpIHtcbiAgICAgICAgICAgICAgICBpZiAocy5kaXNhYmxlTW91c2V3aGVlbENvbnRyb2wpIHMuZGlzYWJsZU1vdXNld2hlZWxDb250cm9sKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBEaXNhYmxlIGExMXlcbiAgICAgICAgICAgIGlmIChzLnBhcmFtcy5hMTF5ICYmIHMuYTExeSkgcy5hMTF5LmRlc3Ryb3koKTtcbiAgICAgICAgICAgIC8vIERlc3Ryb3kgY2FsbGJhY2tcbiAgICAgICAgICAgIHMuZW1pdCgnb25EZXN0cm95Jyk7XG4gICAgICAgICAgICAvLyBEZWxldGUgaW5zdGFuY2VcbiAgICAgICAgICAgIGlmIChkZWxldGVJbnN0YW5jZSAhPT0gZmFsc2UpIHMgPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgcy5pbml0KCk7XG4gICAgICAgIFxuXG4gICAgXG4gICAgICAgIC8vIFJldHVybiBzd2lwZXIgaW5zdGFuY2VcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfTtcbiAgICBcblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgUHJvdG90eXBlXG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgU3dpcGVyLnByb3RvdHlwZSA9IHtcbiAgICAgICAgaXNTYWZhcmk6IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICByZXR1cm4gKHVhLmluZGV4T2YoJ3NhZmFyaScpID49IDAgJiYgdWEuaW5kZXhPZignY2hyb21lJykgPCAwICYmIHVhLmluZGV4T2YoJ2FuZHJvaWQnKSA8IDApO1xuICAgICAgICB9KSgpLFxuICAgICAgICBpc1VpV2ViVmlldzogLyhpUGhvbmV8aVBvZHxpUGFkKS4qQXBwbGVXZWJLaXQoPyEuKlNhZmFyaSkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLFxuICAgICAgICBpc0FycmF5OiBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseShhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgICAgICB9LFxuICAgICAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIEJyb3dzZXJcbiAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgICAgIGJyb3dzZXI6IHtcbiAgICAgICAgICAgIGllOiB3aW5kb3cubmF2aWdhdG9yLnBvaW50ZXJFbmFibGVkIHx8IHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCxcbiAgICAgICAgICAgIGllVG91Y2g6ICh3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQgJiYgd2luZG93Lm5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzID4gMSkgfHwgKHdpbmRvdy5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQgJiYgd2luZG93Lm5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDEpXG4gICAgICAgIH0sXG4gICAgICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgRGV2aWNlc1xuICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAgICAgZGV2aWNlOiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICAgICAgICAgIHZhciBhbmRyb2lkID0gdWEubWF0Y2goLyhBbmRyb2lkKTs/W1xcc1xcL10rKFtcXGQuXSspPy8pO1xuICAgICAgICAgICAgdmFyIGlwYWQgPSB1YS5tYXRjaCgvKGlQYWQpLipPU1xccyhbXFxkX10rKS8pO1xuICAgICAgICAgICAgdmFyIGlwb2QgPSB1YS5tYXRjaCgvKGlQb2QpKC4qT1NcXHMoW1xcZF9dKykpPy8pO1xuICAgICAgICAgICAgdmFyIGlwaG9uZSA9ICFpcGFkICYmIHVhLm1hdGNoKC8oaVBob25lXFxzT1MpXFxzKFtcXGRfXSspLyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlvczogaXBhZCB8fCBpcGhvbmUgfHwgaXBvZCxcbiAgICAgICAgICAgICAgICBhbmRyb2lkOiBhbmRyb2lkXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KSgpLFxuICAgICAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIEZlYXR1cmUgRGV0ZWN0aW9uXG4gICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBzdXBwb3J0OiB7XG4gICAgICAgICAgICB0b3VjaCA6ICh3aW5kb3cuTW9kZXJuaXpyICYmIE1vZGVybml6ci50b3VjaCA9PT0gdHJ1ZSkgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISEoKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykgfHwgd2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoKTtcbiAgICAgICAgICAgIH0pKCksXG4gICAgXG4gICAgICAgICAgICB0cmFuc2Zvcm1zM2QgOiAod2luZG93Lk1vZGVybml6ciAmJiBNb2Rlcm5penIuY3NzdHJhbnNmb3JtczNkID09PSB0cnVlKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKS5zdHlsZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCd3ZWJraXRQZXJzcGVjdGl2ZScgaW4gZGl2IHx8ICdNb3pQZXJzcGVjdGl2ZScgaW4gZGl2IHx8ICdPUGVyc3BlY3RpdmUnIGluIGRpdiB8fCAnTXNQZXJzcGVjdGl2ZScgaW4gZGl2IHx8ICdwZXJzcGVjdGl2ZScgaW4gZGl2KTtcbiAgICAgICAgICAgIH0pKCksXG4gICAgXG4gICAgICAgICAgICBmbGV4Ym94OiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKS5zdHlsZTtcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGVzID0gKCdhbGlnbkl0ZW1zIHdlYmtpdEFsaWduSXRlbXMgd2Via2l0Qm94QWxpZ24gbXNGbGV4QWxpZ24gbW96Qm94QWxpZ24gd2Via2l0RmxleERpcmVjdGlvbiBtc0ZsZXhEaXJlY3Rpb24gbW96Qm94RGlyZWN0aW9uIG1vekJveE9yaWVudCB3ZWJraXRCb3hEaXJlY3Rpb24gd2Via2l0Qm94T3JpZW50Jykuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3R5bGVzW2ldIGluIGRpdikgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkoKSxcbiAgICBcbiAgICAgICAgICAgIG9ic2VydmVyOiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoJ011dGF0aW9uT2JzZXJ2ZXInIGluIHdpbmRvdyB8fCAnV2Via2l0TXV0YXRpb25PYnNlcnZlcicgaW4gd2luZG93KTtcbiAgICAgICAgICAgIH0pKClcbiAgICAgICAgfSxcbiAgICAgICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICBQbHVnaW5zXG4gICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBwbHVnaW5zOiB7fVxuICAgIH07XG4gICAgXG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICBHZXQgRG9tIGxpYnJhcmllc1xuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHZhciBzd2lwZXJEb21QbHVnaW5zID0gWydqUXVlcnknLCAnWmVwdG8nLCAnRG9tNyddO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3dpcGVyRG9tUGx1Z2lucy5sZW5ndGg7IGkrKykge1xuICAgIFx0aWYgKHdpbmRvd1tzd2lwZXJEb21QbHVnaW5zW2ldXSkge1xuICAgIFx0XHRhZGRMaWJyYXJ5UGx1Z2luKHdpbmRvd1tzd2lwZXJEb21QbHVnaW5zW2ldXSk7XG4gICAgXHR9XG4gICAgfVxuICAgIC8vIFJlcXVpcmVkIERPTSBQbHVnaW5zXG4gICAgdmFyIGRvbUxpYjtcbiAgICBpZiAodHlwZW9mIERvbTcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgXHRkb21MaWIgPSB3aW5kb3cuRG9tNyB8fCB3aW5kb3cuWmVwdG8gfHwgd2luZG93LmpRdWVyeTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgXHRkb21MaWIgPSBEb203O1xuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgQWRkIC5zd2lwZXIgcGx1Z2luIGZyb20gRG9tIGxpYnJhcmllc1xuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgZnVuY3Rpb24gYWRkTGlicmFyeVBsdWdpbihsaWIpIHtcbiAgICAgICAgbGliLmZuLnN3aXBlciA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBmaXJzdEluc3RhbmNlO1xuICAgICAgICAgICAgbGliKHRoaXMpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBzID0gbmV3IFN3aXBlcih0aGlzLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGlmICghZmlyc3RJbnN0YW5jZSkgZmlyc3RJbnN0YW5jZSA9IHM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmaXJzdEluc3RhbmNlO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBpZiAoZG9tTGliKSB7XG4gICAgICAgIGlmICghKCd0cmFuc2l0aW9uRW5kJyBpbiBkb21MaWIuZm4pKSB7XG4gICAgICAgICAgICBkb21MaWIuZm4udHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHZhciBldmVudHMgPSBbJ3dlYmtpdFRyYW5zaXRpb25FbmQnLCAndHJhbnNpdGlvbmVuZCcsICdvVHJhbnNpdGlvbkVuZCcsICdNU1RyYW5zaXRpb25FbmQnLCAnbXNUcmFuc2l0aW9uRW5kJ10sXG4gICAgICAgICAgICAgICAgICAgIGksIGosIGRvbSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZmlyZUNhbGxCYWNrKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSB0aGlzKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgZSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbS5vZmYoZXZlbnRzW2ldLCBmaXJlQ2FsbEJhY2spO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb20ub24oZXZlbnRzW2ldLCBmaXJlQ2FsbEJhY2spO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISgndHJhbnNmb3JtJyBpbiBkb21MaWIuZm4pKSB7XG4gICAgICAgICAgICBkb21MaWIuZm4udHJhbnNmb3JtID0gZnVuY3Rpb24gKHRyYW5zZm9ybSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxTdHlsZSA9IHRoaXNbaV0uc3R5bGU7XG4gICAgICAgICAgICAgICAgICAgIGVsU3R5bGUud2Via2l0VHJhbnNmb3JtID0gZWxTdHlsZS5Nc1RyYW5zZm9ybSA9IGVsU3R5bGUubXNUcmFuc2Zvcm0gPSBlbFN0eWxlLk1velRyYW5zZm9ybSA9IGVsU3R5bGUuT1RyYW5zZm9ybSA9IGVsU3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoJ3RyYW5zaXRpb24nIGluIGRvbUxpYi5mbikpIHtcbiAgICAgICAgICAgIGRvbUxpYi5mbi50cmFuc2l0aW9uID0gZnVuY3Rpb24gKGR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkdXJhdGlvbiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb24gPSBkdXJhdGlvbiArICdtcyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxTdHlsZSA9IHRoaXNbaV0uc3R5bGU7XG4gICAgICAgICAgICAgICAgICAgIGVsU3R5bGUud2Via2l0VHJhbnNpdGlvbkR1cmF0aW9uID0gZWxTdHlsZS5Nc1RyYW5zaXRpb25EdXJhdGlvbiA9IGVsU3R5bGUubXNUcmFuc2l0aW9uRHVyYXRpb24gPSBlbFN0eWxlLk1velRyYW5zaXRpb25EdXJhdGlvbiA9IGVsU3R5bGUuT1RyYW5zaXRpb25EdXJhdGlvbiA9IGVsU3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gZHVyYXRpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy5Td2lwZXIgPSBTd2lwZXI7XG59KSgpO1xuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT1cblN3aXBlciBBTUQgRXhwb3J0XG49PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuaWYgKHR5cGVvZihtb2R1bGUpICE9PSAndW5kZWZpbmVkJylcbntcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5Td2lwZXI7XG59XG5lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICByZXR1cm4gd2luZG93LlN3aXBlcjtcbiAgICB9KTtcbn0iLCJcInVzZSBzdHJpY3RcIjsgdmFyICQgPSBqUXVlcnk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNjcmlwdCl7XG5cdHZhciB0aGVtZXMgPSByZXF1aXJlKCcuLi9hcHAvdGhlbWVzLmpzJyk7XG5cdHZhciB0b29scyA9IHJlcXVpcmUoJy4uL3Rvb2xzL3Rvb2xzLmpzJyk7XG5cdHZhciBsb2FkaW5nID0gcmVxdWlyZSgnLi4vd2lkZ2V0cy9sb2FkaW5nLmpzJyk7XG5cdHZhciBhcHBTaGFyZSA9IHJlcXVpcmUoJy4uL2FwcC9hcHAtc2hhcmUuanMnKTtcblx0dmFyIHRoZW1lcyA9IHJlcXVpcmUoJy4uL2FwcC90aGVtZXMuanMnKTtcblx0dmFyIGNvbG9ycyA9IHRoZW1lcy5jb2xvcnM7XG5cdHZhciBtZSA9IHRoaXM7XG5cdHZhciBjUGF0aCA9ICcvJztcblx0dmFyIGN1c3RvbUNzcztcblx0dmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cdHZhciAkcGFuZWw7XG5cdHZhciAkb3B0O1xuXHR2YXIgJHRvZ2dsZTtcblx0dmFyIG9wdFc7XG5cdHZhciAkY3VzdG9tQ3NzO1xuXHR2YXIgJGNvbG9ycztcblx0dmFyIGlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblx0dmFyIGVtcyA9ICdlZGl0LW1vZGUtc3R5bGVzJztcblx0dmFyICRnYXRlTG9hZGVyID0gJCgnLmdhdGUgLmxvYWRlcicpO1xuXHR2YXIgaXNNb2JpbGUgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ21vYmlsZScpO1xuXHR2YXIgc2Vzc2lvbkpzb25TZXQgPSBmdW5jdGlvbihuYW1lLCB2YWwpe1xuXHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0obmFtZSwgSlNPTi5zdHJpbmdpZnkodmFsKSk7XG5cdH1cblx0dmFyIHNlc3Npb25Kc29uR2V0ID0gZnVuY3Rpb24obmFtZSl7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShuYW1lKSk7XG5cdH1cblx0dmFyIHNlc3Npb25TZXQgPSBmdW5jdGlvbihuYW1lLCB2YWwpe1xuXHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0obmFtZSwgdmFsKTtcblx0fVxuXHR2YXIgc2Vzc2lvbkdldCA9IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKG5hbWUpO1xuXHR9XG5cdHRoaXMubGVzc1ZhcnMgPSB7fTtcblx0dGhpcy5pc1Nob3dQYW5lbCA9IChmdW5jdGlvbigpe1xuXHRcdGlmKGlzTW9iaWxlKXtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9ZWxzZSBpZihza3JvbGxleENvbmZpZy5pc0luaXRDb2xvclBhbmVsKXtcblx0XHRcdHNlc3Npb25TZXQoJ3Nrcm9sbGV4Q3VzdG9taXplJywgXCJ5ZXNcIik7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9ZWxzZSBpZigkKCdodG1sJykuaGFzQ2xhc3MoJ3NlbGVjdC10aGVtZScpKXtcblx0XHRcdHNlc3Npb25TZXQoJ3Nrcm9sbGV4Q3VzdG9taXplJywgXCJ5ZXNcIik7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm4gKHNlc3Npb25HZXQoJ3Nrcm9sbGV4Q3VzdG9taXplJykgPyB0cnVlIDogZmFsc2UpO1xuXHRcdH1cblx0fSkoKTtcblx0dGhpcy5zaG93ID0gZnVuY3Rpb24oKXtcblx0XHQkcGFuZWwuY3NzKHtsZWZ0OiAnMHB4J30pO1xuXHRcdCRwYW5lbC5hZGRDbGFzcygnb24nKTtcblx0XHQkcGFuZWwudHJhbnNpdGlvbkVuZChmdW5jdGlvbigpe1xuXHRcdFx0Zm9yKHZhciBpPTA7IGk8dGhlbWVzLmNvbG9yczsgaSsrKXtcblx0XHRcdFx0dmFyIHVDID0gU3RyaW5nLmZyb21DaGFyQ29kZSg2NStpKTtcblx0XHRcdFx0dmFyIGxDID0gdUMudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0JCgnLmNvbG9ycy0nK2xDKycsIC5iYWNrZ3JvdW5kLScrbEMrJywgLmJhY2tncm91bmQtbGl0ZS0nK2xDKycsIC5iYWNrZ3JvdW5kLWhhcmQtJytsQykubm90KCcubm8tY29sb3JzLWxhYmVsJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHRcdFx0dmFyICRsYWJlbCA9ICQoJzxzcGFuIGNsYXNzPVwiY29sb3JzLWxhYmVsXCI+Q29sb3JzICcrdUMrJzwvc3Bhbj4nKTtcblx0XHRcdFx0XHR2YXIgdG8gPSAkdGhpcy5vZmZzZXQoKTtcblx0XHRcdFx0XHR2YXIgdGggPSAkdGhpcy5oZWlnaHQoKTtcblx0XHRcdFx0XHR2YXIgdHcgPSAkdGhpcy53aWR0aCgpO1xuXHRcdFx0XHRcdGlmKCh0by5sZWZ0ICsgdHcpID4gMjAwKXtcblx0XHRcdFx0XHRcdCRsYWJlbC5jc3MoJ3JpZ2h0JywgJzEwJScpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0JGxhYmVsLmNzcygnbGVmdCcsICcxMCUnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodGg8MzApe1xuXHRcdFx0XHRcdFx0aWYodG8udG9wID4gMTApe1xuXHRcdFx0XHRcdFx0XHQkbGFiZWwuY3NzKCd0b3AnLCAnLTZweCcpO1xuXHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdCRsYWJlbC5jc3MoJ3RvcCcsICcwcHgnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9aWYodGg8NDAwKXtcblx0XHRcdFx0XHRcdCRsYWJlbC5jc3MoJ3RvcCcsICcyNSUnKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdCRsYWJlbC5jc3MoJ3RvcCcsICcxMDBweCcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkbGFiZWwuaG92ZXIoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdCR0aGlzLmFkZENsYXNzKCdsaWdodC1jb2xvcnMtYmxvY2snKTtcblx0XHRcdFx0XHR9LGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHQkdGhpcy5yZW1vdmVDbGFzcygnbGlnaHQtY29sb3JzLWJsb2NrJyk7XG5cdFx0XHRcdFx0fSkuYXBwZW5kVG8oJHRoaXMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGlmKCFpc0luaXRpYWxpemVkKXtcblx0XHRcdFx0aXNJbml0aWFsaXplZCA9IHRydWU7XG5cdFx0XHRcdGNyZWF0ZUNzcyh0cnVlKTtcblx0XHRcdFx0aW5pdExlc3NWYXJzKCk7XG5cdFx0XHRcdHZhciAkZ2F0ZSA9ICRvcHQuZmluZCgnLm9wdGlvbnMtZ2F0ZScpO1xuXHRcdFx0XHQkZ2F0ZS5jc3Moe29wYWNpdHk6IDAsIHZpc2liaWxpdHk6ICdoaWRkZW4nfSk7XG5cdFx0XHR9XG5cdFx0XHQkKCcuY29sb3JzLWxhYmVsJykuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHR9LCA1MDApO1xuXHR9O1xuXHR0aGlzLmhpZGUgPSBmdW5jdGlvbigpe1xuXHRcdCRwYW5lbC5jc3Moe2xlZnQ6IC0xKm9wdFcrJ3B4J30pO1xuXHRcdCRwYW5lbC5yZW1vdmVDbGFzcygnb24nKTtcblx0XHQkKCcuY29sb3JzLWxhYmVsJykub2ZmKCdob3ZlcicpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpeyQoJy5jb2xvcnMtbGFiZWwnKS5yZW1vdmUoKTt9LCAxMDAwKTtcblx0fTtcblx0ZnVuY3Rpb24gcmVzaXplKCl7XG5cdFx0JG9wdC5jc3Moe1xuXHRcdFx0aGVpZ2h0OiAoJHdpbmRvdy5oZWlnaHQoKSAtIHBhcnNlSW50KCRwYW5lbC5jc3MoJ3RvcCcpLnJlcGxhY2UoJ3B4JywnJykpIC0gNzUpICsgJ3B4J1xuXHRcdH0pO1xuXHR9XG5cdGZ1bmN0aW9uIHNldEN1c3RvbWl6ZWQoKXtcblx0XHRzZXNzaW9uU2V0KCdza3JvbGxleFRoZW1lQ3VzdG9taXplZCcsICd5ZXMnKTtcblx0fVxuXHRmdW5jdGlvbiBzZXROb25DdXN0b21pemVkKCl7XG5cdFx0c2Vzc2lvblNldCgnc2tyb2xsZXhUaGVtZUN1c3RvbWl6ZWQnLCBcIlwiKTtcblx0fVxuXHRmdW5jdGlvbiBpc0N1c3RvbWl6ZWQoKXtcblx0XHR2YXIgdGMgPSBzZXNzaW9uR2V0KCdza3JvbGxleFRoZW1lQ3VzdG9taXplZCcpO1xuXHRcdHJldHVybiAoIHRjID09PSAneWVzJyApO1xuXHR9XG5cdGZ1bmN0aW9uIGluaXRMZXNzVmFycygpe1xuXHRcdGZvcih2YXIgaT0wOyBpPGNvbG9yczsgaSsrKXtcblx0XHRcdGluaXRHcm91cChTdHJpbmcuZnJvbUNoYXJDb2RlKDY1K2kpLnRvTG93ZXJDYXNlKCkpO1xuXHRcdH1cblx0XHRpbml0TGVzc1ZhcignPHNwYW4+PHNwYW4gY2xhc3M9XCJwcmltYXJ5LWNvbG9yXCI+PC9zcGFuPjwvc3Bhbj4nLCAnLnByaW1hcnktY29sb3InLCAnY29sb3InLCAnaW5wdXQucHJpbWFyeS1iZycsICdwcmltYXJ5LWJnJywgdG9IZXgpO1xuXHRcdGluaXRMZXNzVmFyKCc8c3Bhbj48c3BhbiBjbGFzcz1cIm91dC1wcmltYXJ5XCI+PC9zcGFuPjwvc3Bhbj4nLCAnLm91dC1wcmltYXJ5JywgJ29wYWNpdHknLCAnaW5wdXQucHJpbWFyeS1vdXQnLCAncHJpbWFyeS1vdXQnLCBvdXRUcmFuc2xhdG9yLCBvdXRTZXRUcmFuc2xhdG9yKTtcblx0XHRpbml0TGVzc1ZhcignPHNwYW4+PHNwYW4gY2xhc3M9XCJzdWNjZXNzLWNvbG9yXCI+PC9zcGFuPjwvc3Bhbj4nLCAnLnN1Y2Nlc3MtY29sb3InLCAnY29sb3InLCAnaW5wdXQuc3VjY2Vzcy1iZycsICdzdWNjZXNzLWJnJywgdG9IZXgpO1xuXHRcdGluaXRMZXNzVmFyKCc8c3Bhbj48c3BhbiBjbGFzcz1cIm91dC1zdWNjZXNzXCI+PC9zcGFuPjwvc3Bhbj4nLCAnLm91dC1zdWNjZXNzJywgJ29wYWNpdHknLCAnaW5wdXQuc3VjY2Vzcy1vdXQnLCAnc3VjY2Vzcy1vdXQnLCBvdXRUcmFuc2xhdG9yLCBvdXRTZXRUcmFuc2xhdG9yKTtcblx0XHRpbml0TGVzc1ZhcignPHNwYW4+PHNwYW4gY2xhc3M9XCJpbmZvLWNvbG9yXCI+PC9zcGFuPjwvc3Bhbj4nLCAnLmluZm8tY29sb3InLCAnY29sb3InLCAnaW5wdXQuaW5mby1iZycsICdpbmZvLWJnJywgdG9IZXgpO1xuXHRcdGluaXRMZXNzVmFyKCc8c3Bhbj48c3BhbiBjbGFzcz1cIm91dC1pbmZvXCI+PC9zcGFuPjwvc3Bhbj4nLCAnLm91dC1pbmZvJywgJ29wYWNpdHknLCAnaW5wdXQuaW5mby1vdXQnLCAnaW5mby1vdXQnLCBvdXRUcmFuc2xhdG9yLCBvdXRTZXRUcmFuc2xhdG9yKTtcblx0XHRpbml0TGVzc1ZhcignPHNwYW4+PHNwYW4gY2xhc3M9XCJ3YXJuaW5nLWNvbG9yXCI+PC9zcGFuPjwvc3Bhbj4nLCAnLndhcm5pbmctY29sb3InLCAnY29sb3InLCAnaW5wdXQud2FybmluZy1iZycsICd3YXJuaW5nLWJnJywgdG9IZXgpO1xuXHRcdGluaXRMZXNzVmFyKCc8c3Bhbj48c3BhbiBjbGFzcz1cIm91dC13YXJuaW5nXCI+PC9zcGFuPjwvc3Bhbj4nLCAnLm91dC13YXJuaW5nJywgJ29wYWNpdHknLCAnaW5wdXQud2FybmluZy1vdXQnLCAnd2FybmluZy1vdXQnLCBvdXRUcmFuc2xhdG9yLCBvdXRTZXRUcmFuc2xhdG9yKTtcblx0XHRpbml0TGVzc1ZhcignPHNwYW4+PHNwYW4gY2xhc3M9XCJkYW5nZXItY29sb3JcIj48L3NwYW4+PC9zcGFuPicsICcuZGFuZ2VyLWNvbG9yJywgJ2NvbG9yJywgJ2lucHV0LmRhbmdlci1iZycsICdkYW5nZXItYmcnLCB0b0hleCk7XG5cdFx0aW5pdExlc3NWYXIoJzxzcGFuPjxzcGFuIGNsYXNzPVwib3V0LWRhbmdlclwiPjwvc3Bhbj48L3NwYW4+JywgJy5vdXQtZGFuZ2VyJywgJ29wYWNpdHknLCAnaW5wdXQuZGFuZ2VyLW91dCcsICdkYW5nZXItb3V0Jywgb3V0VHJhbnNsYXRvciwgb3V0U2V0VHJhbnNsYXRvcik7XG5cdH1cblx0ZnVuY3Rpb24gaW5pdEdyb3VwKGdycCl7XG5cdFx0aW5pdExlc3NWYXIoJzxzcGFuIGNsYXNzPVwiY29sb3JzLScrZ3JwKydcIj48c3BhbiBjbGFzcz1cImJnLWNvbG9yXCI+PC9zcGFuPjwvc3Bhbj4nLCAnLmJnLWNvbG9yJywgJ2NvbG9yJywgJ2lucHV0LicrZ3JwKyctYmcnLCBncnArJy1iZycsIHRvSGV4KTtcblx0XHRpbml0TGVzc1ZhcignPHNwYW4gY2xhc3M9XCJjb2xvcnMtJytncnArJ1wiPjxzcGFuIGNsYXNzPVwidGV4dFwiPjwvc3Bhbj48L3NwYW4+JywgJy50ZXh0JywgJ2NvbG9yJywgJ2lucHV0LicrZ3JwKyctdGV4dCcsIGdycCsnLXRleHQnLCB0b0hleCk7XG5cdFx0aW5pdExlc3NWYXIoJzxzcGFuIGNsYXNzPVwiY29sb3JzLScrZ3JwKydcIj48c3BhbiBjbGFzcz1cImhpZ2hsaWdodFwiPjwvc3Bhbj48L3NwYW4+JywgJy5oaWdobGlnaHQnLCAnY29sb3InLCAnaW5wdXQuJytncnArJy1oaWdobGlnaHQnLCBncnArJy1oaWdobGlnaHQnLCB0b0hleCk7XG5cdFx0aW5pdExlc3NWYXIoJzxzcGFuIGNsYXNzPVwiY29sb3JzLScrZ3JwKydcIj48c3BhbiBjbGFzcz1cImxpbmtcIj48L3NwYW4+PC9zcGFuPicsICcubGluaycsICdjb2xvcicsICdpbnB1dC4nK2dycCsnLWxpbmsnLCBncnArJy1saW5rJywgdG9IZXgpO1xuXHRcdGluaXRMZXNzVmFyKCc8c3BhbiBjbGFzcz1cImNvbG9ycy0nK2dycCsnXCI+PHNwYW4gY2xhc3M9XCJoZWFkaW5nXCI+PC9zcGFuPjwvc3Bhbj4nLCAnLmhlYWRpbmcnLCAnY29sb3InLCAnaW5wdXQuJytncnArJy1oZWFkaW5nJywgZ3JwKyctaGVhZGluZycsIHRvSGV4KTtcblx0XHRpbml0TGVzc1ZhcignPHNwYW4gY2xhc3M9XCJjb2xvcnMtJytncnArJ1wiPjxzcGFuIGNsYXNzPVwib3V0XCI+PC9zcGFuPjwvc3Bhbj4nLCAnLm91dCcsICdvcGFjaXR5JywgJ2lucHV0LicrZ3JwKyctb3V0JywgZ3JwKyctb3V0Jywgb3V0VHJhbnNsYXRvciwgb3V0U2V0VHJhbnNsYXRvcik7XG5cdH1cblx0ZnVuY3Rpb24gb3V0VHJhbnNsYXRvcih2KXtyZXR1cm4gTWF0aC5yb3VuZCgoMS12KSoxMDApO31cblx0ZnVuY3Rpb24gb3V0U2V0VHJhbnNsYXRvcih2KXtyZXR1cm4gTWF0aC5yb3VuZCh2KTt9XG5cdGZ1bmN0aW9uIGluaXRMZXNzVmFyKGdldHRlckh0bWwsIGdldHRlclEsIGNzc1Byb3BlcnR5LCBpbnB1dFEsIGxlc3NWYXIsIHRyYW5zbGF0b3IsIHNldFRyYW5zbGF0b3Ipe1xuXHRcdHZhciBjaGFuZ2VEZWxheSA9IDMwMDtcblx0XHR2YXIgJGcgPSAkKCc8c3BhbiBjbGFzcz1cImdldHRlclwiPjwvc3Bhbj4nKS5hcHBlbmRUbygnYm9keScpO1xuXHRcdCQoZ2V0dGVySHRtbCkuYXBwZW5kVG8oJGcpO1xuXHRcdHZhciBnZXR0ZWQgPSAkZy5maW5kKGdldHRlclEpLmNzcyhjc3NQcm9wZXJ0eSk7XG5cdFx0JGcucmVtb3ZlKCk7XG5cdFx0aWYoZ2V0dGVkKXtcblx0XHRcdGlmKHRyYW5zbGF0b3IpIGdldHRlZCA9IHRyYW5zbGF0b3IoZ2V0dGVkKTtcblx0XHR9XG5cdFx0bWUubGVzc1ZhcnNbbGVzc1Zhcl0gPSBnZXR0ZWQ7XG5cdFx0dmFyICRpbnAgPSAkb3B0LmZpbmQoaW5wdXRRKTtcblx0XHQkaW5wLnZhbChnZXR0ZWQpO1xuXHRcdGlmKGNzc1Byb3BlcnR5ID09PSAnY29sb3InKXtcblx0XHRcdCRpbnAuZGF0YSgnZ2V0dGVkJywgZ2V0dGVkKTtcblx0XHRcdGlmKCEkaW5wLmRhdGEoJ2NvbG9yLXBhbmUnKSl7XG5cdFx0XHRcdCRpbnAuZGF0YSgnY29sb3ItcGFuZScsIHRydWUpO1xuXHRcdFx0XHQkaW5wLm1pbmljb2xvcnMoe1xuXHRcdFx0XHRcdGNvbnRyb2w6ICQodGhpcykuYXR0cignZGF0YS1jb250cm9sJykgfHwgJ2h1ZScsXG5cdFx0XHRcdFx0ZGVmYXVsdFZhbHVlOiAkKHRoaXMpLmF0dHIoJ2RhdGEtZGVmYXVsdFZhbHVlJykgfHwgJycsXG5cdFx0XHRcdFx0aW5saW5lOiAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5saW5lJykgPT09ICd0cnVlJyxcblx0XHRcdFx0XHRsZXR0ZXJDYXNlOiAkKHRoaXMpLmF0dHIoJ2RhdGEtbGV0dGVyQ2FzZScpIHx8ICdsb3dlcmNhc2UnLFxuXHRcdFx0XHRcdG9wYWNpdHk6IGZhbHNlLFxuXHRcdFx0XHRcdHBvc2l0aW9uOiAkKHRoaXMpLmF0dHIoJ2RhdGEtcG9zaXRpb24nKSB8fCAndG9wIGxlZnQnLFxuXHRcdFx0XHRcdGNoYW5nZURlbGF5OiBjaGFuZ2VEZWxheSxcblx0XHRcdFx0XHRjaGFuZ2U6IGZ1bmN0aW9uKGhleCwgb3BhY2l0eSkge1xuXHRcdFx0XHRcdFx0aWYoaGV4ICE9ICRpbnAuZGF0YSgnZ2V0dGVkJykpe1xuXHRcdFx0XHRcdFx0XHQkaW5wLmRhdGEoJ2dldHRlZCcsIGhleCk7XG5cdFx0XHRcdFx0XHRcdHNldEN1c3RvbWl6ZWQoKTtcblx0XHRcdFx0XHRcdFx0bWUubGVzc1ZhcnNbbGVzc1Zhcl0gPSBoZXg7XG5cdFx0XHRcdFx0XHRcdGNyZWF0ZUNzcygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2hvdzogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHZhciAkbWMgPSAkaW5wLnBhcmVudCgpO1xuXHRcdFx0XHRcdFx0dmFyICRtY1BhbmVsID0gJG1jLmNoaWxkcmVuKCcubWluaWNvbG9ycy1wYW5lbCcpO1xuXHRcdFx0XHRcdFx0dmFyIG1jUGFuZWxIID0gJG1jUGFuZWwub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cdFx0XHRcdFx0XHR2YXIgbWNQYW5lbFcgPSAkbWNQYW5lbC5vdXRlcldpZHRoKHRydWUpO1xuXHRcdFx0XHRcdFx0dmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cdFx0XHRcdFx0XHR2YXIgd1cgPSAkd2luZG93LndpZHRoKCk7XG5cdFx0XHRcdFx0XHR2YXIgd0ggPSAkd2luZG93LmhlaWdodCgpO1xuXHRcdFx0XHRcdFx0dmFyIG9mZnNldCA9ICRtY1BhbmVsLm9mZnNldCgpO1xuXHRcdFx0XHRcdFx0dmFyIGxlZnQgPSBvZmZzZXQubGVmdCAtICQoZG9jdW1lbnQpLnNjcm9sbExlZnQoKTtcblx0XHRcdFx0XHRcdHZhciB0b3AgPSBvZmZzZXQudG9wIC0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCk7XG5cdFx0XHRcdFx0XHRpZiggKGxlZnQrbWNQYW5lbFcpID4gd1cgKXtcblx0XHRcdFx0XHRcdFx0bGVmdCA9IHdXIC0gbWNQYW5lbFcgLSA1O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYoICh0b3ArbWNQYW5lbEgpID4gd0ggKXtcblx0XHRcdFx0XHRcdFx0dG9wID0gd0ggLSBtY1BhbmVsSCAtIDI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiggdG9wIDwgMCApe1xuXHRcdFx0XHRcdFx0XHR0b3AgPSAyO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0JG1jUGFuZWwuY3NzKHtcblx0XHRcdFx0XHRcdFx0cG9zaXRpb246ICdmaXhlZCcsXG5cdFx0XHRcdFx0XHRcdGxlZnQ6IGxlZnQrJ3B4Jyxcblx0XHRcdFx0XHRcdFx0dG9wOiB0b3ArJ3B4J1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRoaWRlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0JGlucC5wYXJlbnQoKS5jaGlsZHJlbignLm1pbmljb2xvcnMtcGFuZWwnKS5jc3Moe1xuXHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogJycsXG5cdFx0XHRcdFx0XHRcdGxlZnQ6ICcnLFxuXHRcdFx0XHRcdFx0XHR0b3A6ICcnXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRoZW1lOiAnYm9vdHN0cmFwJ1xuXHRcdFx0XHR9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHQkaW5wLm1pbmljb2xvcnMoJ3ZhbHVlJywgZ2V0dGVkKTtcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdHZhciB0aW1lcjtcblx0XHRcdCRpbnAuY2hhbmdlKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciAkZWwgPSAkKHRoaXMpO1xuXHRcdFx0XHR2YXIgdmFsID0gJGVsLnZhbCgpO1xuXHRcdFx0XHRpZiAodGltZXIpe1xuXHRcdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2V0Q3VzdG9taXplZCgpO1xuXHRcdFx0XHRtZS5sZXNzVmFyc1tsZXNzVmFyXSA9IHZhbDtcblx0XHRcdFx0Y3JlYXRlQ3NzKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gY29sb3JGb3JtYXQodmFsKXtcblx0XHRcdGlmKCF2YWwubWF0Y2goL14jWzAtOWEtZkEtZl1bMC05YS1mQS1mXVswLTlhLWZBLWZdWzAtOWEtZkEtZl1bMC05YS1mQS1mXVswLTlhLWZBLWZdJC9pKSl7XG5cdFx0XHRcdGlmKHZhbC5tYXRjaCgvXiNbMC05YS1mQS1mXVswLTlhLWZBLWZdWzAtOWEtZkEtZl0kL2kpKXtcblx0XHRcdFx0XHRyZXR1cm4gXCIjXCIrdmFsLmNoYXJBdCgxKSt2YWwuY2hhckF0KDEpK3ZhbC5jaGFyQXQoMikrdmFsLmNoYXJBdCgyKSt2YWwuY2hhckF0KDMpK3ZhbC5jaGFyQXQoMyk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gYnVpbGRQYW5lbCgpe1xuXHRcdGlmKCFtZS5pc1Nob3dQYW5lbCl7XG5cdFx0XHQkcGFuZWwuaGlkZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1lbHNle1xuXHRcdFx0JCgnLnRvcC1wYW5lIC5yZXNldCcpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHNldE5vbkN1c3RvbWl6ZWQoKTtcblx0XHRcdFx0bWUuaGlkZSgpO1xuXHRcdFx0XHQkKCcjJyArIGVtcykucmVtb3ZlKCk7XG5cdFx0XHRcdGlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblx0XHRcdFx0dmFyICRnYXRlID0gJG9wdC5maW5kKCcub3B0aW9ucy1nYXRlJyk7XG5cdFx0XHRcdCRnYXRlLmNzcyh7dmlzaWJpbGl0eTogJ3Zpc2libGUnfSk7XG5cdFx0XHRcdCRnYXRlLmNzcyh7b3BhY2l0eTogMX0pO1xuXHRcdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdsZXNzVmFycycsIEpTT04uc3RyaW5naWZ5KHt9KSk7XG5cdFx0XHRcdG1lLmxlc3NWYXJzID0ge307XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0pO1xuXHRcdFx0JHBhbmVsLmNzcyh7bGVmdDogLTEqb3B0VysncHgnfSk7XG5cdFx0XHQkdG9nZ2xlLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGlmKHNrcm9sbGV4Q29uZmlnLmlzQ3VzdG9taXplcil7XG5cdFx0XHRcdFx0c2Vzc2lvblNldCgnc2tyb2xsZXhTaG93Q29sb3JQYW5lbCcsICd5ZXMnKTtcblx0XHRcdFx0XHR3aW5kb3cucGFyZW50LmxvY2F0aW9uID0gc2tyb2xsZXhDb25maWcucGVybWFsaW5rO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRpZigkcGFuZWwuaGFzQ2xhc3MoJ29uJykpe1xuXHRcdFx0XHRcdFx0bWUuaGlkZSgpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0bWUuc2hvdygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9KTtcblx0XHRcdCRvcHQuZmluZCgnLnNhdmUtY3VzdG9tLWNzcycpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciAkY29udGVudCA9ICRjdXN0b21Dc3MuZmluZCgnLmNzcy1jb250ZW50Jyk7XG5cdFx0XHRcdGlmKGUuc2hpZnRLZXkpe1xuXHRcdFx0XHRcdHZhciBjb250ZW50VGV4dD0nQGltcG9ydCBcInRoZW1lLmxlc3NcIjtcXHJcXG5cXHJcXG4nO1xuXHRcdFx0XHRcdGZvcih2YXIga2V5IGluIG1lLmxlc3NWYXJzKXtcblx0XHRcdFx0XHRcdGNvbnRlbnRUZXh0ID0gY29udGVudFRleHQrJ0AnK2tleSsnOiAnK21lLmxlc3NWYXJzW2tleV0rJztcXHJcXG4nO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkY3VzdG9tQ3NzLmZpbmQoJy5jc3MtY29udGVudCcpLnRleHQoY29udGVudFRleHQpO1xuXHRcdFx0XHRcdG5ldyBUV0VFTi5Ud2Vlbih7YXV0b0FscGhhOiAwLCB4Oi00NTB9KVxuXHRcdFx0XHRcdFx0LnRvKHthdXRvQWxwaGE6IDEsIHg6IDB9LCA0MDApXG5cdFx0XHRcdFx0XHQub25VcGRhdGUoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0JGN1c3RvbUNzcy5jc3Moe29wYWNpdHk6IHRoaXMuYXV0b0FscGhhLCB2aXNpYmlsaXR5OiAodGhpcy5hdXRvQWxwaGEgPiAwID8gJ3Zpc2libGUnIDogJ2hpZGRlbicpfSk7XG5cdFx0XHRcdFx0XHRcdGlmKE1vZGVybml6ci5jc3N0cmFuc2Zvcm1zM2QgJiYgYXBwU2hhcmUuZm9yY2UzRCl7XG5cdFx0XHRcdFx0XHRcdFx0JGN1c3RvbUNzcy5jc3Moe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKCcrdGhpcy54KydweCwgMHB4LCAwcHgpJ30pO1xuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQkY3VzdG9tQ3NzLmNzcyh7dHJhbnNmb3JtOiAndHJhbnNsYXRlKCcrdGhpcy54KydweCwgMHB4KSd9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5lYXNpbmcoVFdFRU4uRWFzaW5nLlF1YWRyYXRpYy5PdXQpXG5cdFx0XHRcdFx0XHQuc3RhcnQoKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0aWYoJCgnYm9keScpLmhhc0NsYXNzKCdhZG1pbi1iYXInKSl7XG5cdFx0XHRcdFx0XHRpZighY3VzdG9tQ3NzKSBjcmVhdGVDc3MoKTtcblx0XHRcdFx0XHRcdHZhciBjb250ZW50VGV4dCA9IGN1c3RvbUNzcy5yZXBsYWNlKC8oXFxyXFxufFxccnxcXG4pL2csJ1xcclxcbicpO1xuXHRcdFx0XHRcdFx0dmFyICRmb3JtID0gJCgnI3NhdmUtY3VzdG9tLWNzcycpO1xuXHRcdFx0XHRcdFx0dmFyICRpbnAgPSAkKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIGlkPVwiY29udGVudFwiIG5hbWU9XCJjb250ZW50XCI+JykudmFsKGNvbnRlbnRUZXh0KS5hcHBlbmRUbygkZm9ybSk7XG5cdFx0XHRcdFx0XHQkZm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0XHRcdCRpbnAucmVtb3ZlKCk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRhbGVydCgnU2F2aW5nIGlzIG5vdCBhbGxvd2VkIGluIGRlbW8gbW9kZS4nKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSk7XG5cdFx0XHQkY3VzdG9tQ3NzLmZpbmQoJy5jbG9zZS1wYW5lbCcpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdG5ldyBUV0VFTi5Ud2Vlbih7YXV0b0FscGhhOiAxLCB4OiAwfSlcblx0XHRcdFx0XHQudG8oe2F1dG9BbHBoYTogMCwgeDogLTQ1MH0sIDQwMClcblx0XHRcdFx0XHQub25VcGRhdGUoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdCRjdXN0b21Dc3MuY3NzKHtvcGFjaXR5OiB0aGlzLmF1dG9BbHBoYSwgdmlzaWJpbGl0eTogKHRoaXMuYXV0b0FscGhhID4gMCA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nKX0pO1xuXHRcdFx0XHRcdFx0aWYoTW9kZXJuaXpyLmNzc3RyYW5zZm9ybXMzZCAmJiBhcHBTaGFyZS5mb3JjZTNEKXtcblx0XHRcdFx0XHRcdFx0JGN1c3RvbUNzcy5jc3Moe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKCcrdGhpcy54KydweCwgMHB4LCAwcHgpJ30pO1xuXHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdCRjdXN0b21Dc3MuY3NzKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUoJyt0aGlzLngrJ3B4LCAwcHgpJ30pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmVhc2luZyhUV0VFTi5FYXNpbmcuTGluZWFyLk5vbmUpXG5cdFx0XHRcdFx0LnN0YXJ0KCk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0pO1xuXHRcdFx0dG9vbHMuc2VsZWN0VGV4dGFyZWEoJGN1c3RvbUNzcy5maW5kKFwidGV4dGFyZWFcIikpO1xuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBjcmVhdGVDc3MoaXNJbml0T25seSl7XG5cdFx0dmFyIGN1c3RvbSA9IGF0b2IoY3VzdG9tTGVzcyk7XG5cdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnbGVzc1ZhcnMnLCBKU09OLnN0cmluZ2lmeShtZS5sZXNzVmFycykpO1xuXHRcdGRvTGVzcyhjdXN0b20sIGZ1bmN0aW9uKGNzcyl7XG5cdFx0XHRpZighaXNJbml0T25seSl7XG5cdFx0XHRcdGN1c3RvbUNzcyA9IGNzcztcblx0XHRcdFx0dmFyICRjdXIgPSAkKCcjJytlbXMpO1xuXHRcdFx0XHRpZigkY3VyLmxlbmd0aDwxKXtcblx0XHRcdFx0XHQkKCc8c3R5bGUgdHlwZT1cInRleHQvY3NzXCIgaWQ9XCInK2VtcysnXCI+XFxuJytjc3MrJzwvc3R5bGU+JykuYXBwZW5kVG8oJ2hlYWQnKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0aWYoJGN1clswXS5pbm5lckhUTUwpe1xuXHRcdFx0XHRcdFx0JGN1clswXS5pbm5lckhUTUwgPSBjdXN0b21Dc3M7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHQkY3VyWzBdLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGN1c3RvbUNzcztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRmdW5jdGlvbiBkb0xlc3MoZGF0YSwgY2FsbGJhY2spe1xuXHRcdGxlc3MucmVuZGVyKFxuXHRcdFx0ZGF0YSxcblx0XHRcdHtcdGN1cnJlbnREaXJlY3Rvcnk6IFwiYXNzZXRzL2Nzcy9zcmMvc2NoZW1lcy9cIixcblx0XHRcdFx0ZmlsZW5hbWU6IHNrcm9sbGV4Q29uZmlnLnRoZW1lVXJpICsgXCJhc3NldHMvY3NzL3NyYy9zY2hlbWVzL2NvbG9ycy1jdXN0b20ubGVzc1wiLFxuXHRcdFx0XHRlbnRyeVBhdGg6IFwiYXNzZXRzL2Nzcy9zcmMvc2NoZW1lcy9cIixcblx0XHRcdFx0cm9vdHBhdGg6IFwiYXNzZXRzL2Nzcy9zcmMvc2NoZW1lcy9cIixcblx0XHRcdFx0cm9vdEZpbGVuYW1lOiBcImFzc2V0cy9jc3Mvc3JjL3NjaGVtZXMvY29sb3JzLWN1c3RvbS5sZXNzXCIsXG5cdFx0XHRcdHJlbGF0aXZlVXJsczogZmFsc2UsXG5cdFx0XHRcdHVzZUZpbGVDYWNoZTogZmFsc2UsXG5cdFx0XHRcdGNvbXByZXNzOiBmYWxzZSxcblx0XHRcdFx0bW9kaWZ5VmFyczogbWUubGVzc1ZhcnMsXG5cdFx0XHRcdGdsb2JhbFZhcnM6IGxlc3MuZ2xvYmFsVmFyc1xuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uKGUsIG91dHB1dCkge1xuXHRcdFx0XHRjYWxsYmFjayhvdXRwdXQuY3NzKTtcblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cdGZ1bmN0aW9uIHRvSGV4KHJnYil7XG5cdFx0aWYocmdiLmluZGV4T2YoJ3JnYicpID09PSAtMSl7XG5cdFx0XHRyZXR1cm4gcmdiO1xuXHRcdH1lbHNle1xuXHRcdFx0dmFyIHRyaXBsZXQgPSByZ2IubWF0Y2goL1teMC05XSooWzAtOV0qKVteMC05XSooWzAtOV0qKVteMC05XSooWzAtOV0qKVteMC05XSovaSk7XG5cdFx0XHRyZXR1cm4gXCIjXCIrZGlnaXRUb0hleCh0cmlwbGV0WzFdKStkaWdpdFRvSGV4KHRyaXBsZXRbMl0pK2RpZ2l0VG9IZXgodHJpcGxldFszXSk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGRpZ2l0VG9IZXgoZGlnKXtcblx0XHRcdGlmKGlzTmFOKGRpZykpe1xuXHRcdFx0XHRyZXR1cm4gXCIwMFwiO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHZhciBoeCA9IHBhcnNlSW50KGRpZykudG9TdHJpbmcoMTYpO1xuXHRcdFx0XHRyZXR1cm4gaHgubGVuZ3RoID09IDEgPyBcIjBcIitoeCA6IGh4O1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRcblx0aWYobWUuaXNTaG93UGFuZWwpe1xuXHRcdCQoJzxkaXYgaWQ9XCJjdXN0b21pemUtcGFuZWxcIj48L2Rpdj4nKS5hcHBlbmRUbygnYm9keScpLmxvYWQoc2tyb2xsZXhDb25maWcudGhlbWVVcmkgKyAnaW5jbHVkZXMvZ2VuZXJhdGVkL2NvbG9ycy9jb2xvci1wYW5lbC5waHAgI2N1c3RvbWl6ZS1wYW5lbD4qJywgZnVuY3Rpb24oeGhyLCBzdGF0dXNUZXh0LCByZXF1ZXN0KXtcblx0XHRcdGlmKHN0YXR1c1RleHQgIT09IFwic3VjY2Vzc1wiICYmIHN0YXR1c1RleHQgIT09IFwibm90bW9kaWZpZWRcIil7XG5cdFx0XHRcdCQoJyNjdXN0b21pemUtcGFuZWwnKS5yZW1vdmUoKTtcblx0XHRcdFx0c2NyaXB0LmFmdGVyQ29uZmlndXJlKCk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0JC5nZXRTY3JpcHQoIHNrcm9sbGV4Q29uZmlnLnRoZW1lVXJpICsgXCJhc3NldHMvanMvY3VzdG9tLWxlc3MuanM/XCIrKG5ldyBEYXRlKCkuZ2V0VGltZSgpKSwgZnVuY3Rpb24oIGRhdGEsIGxlc3NTdGF0dXNUZXh0LCBqcXhociApIHtcblx0XHRcdFx0XHRpZihsZXNzU3RhdHVzVGV4dCAhPT0gXCJzdWNjZXNzXCIgJiYgbGVzc1N0YXR1c1RleHQgIT09IFwibm90bW9kaWZpZWRcIil7XG5cdFx0XHRcdFx0XHQkKCcjY3VzdG9taXplLXBhbmVsJykucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRzY3JpcHQuYWZ0ZXJDb25maWd1cmUoKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdCRwYW5lbCA9ICQoJyNjdXN0b21pemUtcGFuZWwnKTtcblx0XHRcdFx0XHRcdCRvcHQgPSAkcGFuZWwuZmluZCgnLm9wdGlvbnMnKTtcblx0XHRcdFx0XHRcdCR0b2dnbGUgPSAkcGFuZWwuZmluZCgnLnRvZ2dsZS1idXR0b24nKTtcblx0XHRcdFx0XHRcdG9wdFcgPSAkb3B0Lm91dGVyV2lkdGgoKTtcblx0XHRcdFx0XHRcdCRjdXN0b21Dc3MgPSAkcGFuZWwuZmluZCgnLmN1c3RvbS1jc3MnKTtcblx0XHRcdFx0XHRcdCRjb2xvcnMgPSAkb3B0LmZpbmQoJy5jb2xvcnMnKTtcblx0XHRcdFx0XHRcdGJ1aWxkUGFuZWwoKTtcblx0XHRcdFx0XHRcdHZhciBza3JvbGxleExhc3RDb2xvcnMgPSBzZXNzaW9uR2V0KCdza3JvbGxleExhc3RDb2xvcnMnKTtcblx0XHRcdFx0XHRcdGlmKHNrcm9sbGV4TGFzdENvbG9ycyAmJiBza3JvbGxleExhc3RDb2xvcnMgIT09IHNrcm9sbGV4Q29uZmlnLmNvbG9ycyl7XG5cdFx0XHRcdFx0XHRcdHNldE5vbkN1c3RvbWl6ZWQoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKCBpc0N1c3RvbWl6ZWQoKSApe1xuXHRcdFx0XHRcdFx0XHRpc0luaXRpYWxpemVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0bWUubGVzc1ZhcnMgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2xlc3NWYXJzJykpO1xuXHRcdFx0XHRcdFx0XHRjcmVhdGVDc3MoKTtcblx0XHRcdFx0XHRcdFx0aW5pdExlc3NWYXJzKCk7XG5cdFx0XHRcdFx0XHRcdCRvcHQuZmluZCgnLm9wdGlvbnMtZ2F0ZScpLmNzcyh7dmlzaWJpbGl0eTogJ2hpZGRlbid9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCR3aW5kb3cucmVzaXplKHJlc2l6ZSk7XG5cdFx0XHRcdFx0XHRyZXNpemUoKTtcblx0XHRcdFx0XHRcdGlmKChzZXNzaW9uR2V0KCdza3JvbGxleFNob3dDb2xvclBhbmVsJykgPT09ICd5ZXMnICYmICFza3JvbGxleENvbmZpZy5pc0N1c3RvbWl6ZXIpIHx8IHRvb2xzLmdldFVybFBhcmFtZXRlcignc2hvdy1jb2xvci1wYW5lbCcpID09PSAneWVzJyl7XG5cdFx0XHRcdFx0XHRcdHNlc3Npb25TZXQoJ3Nrcm9sbGV4U2hvd0NvbG9yUGFuZWwnLCAnbm8nKTtcblx0XHRcdFx0XHRcdFx0bWUuc2hvdygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0c2Vzc2lvblNldCgnc2tyb2xsZXhMYXN0Q29sb3JzJywgc2tyb2xsZXhDb25maWcuY29sb3JzKTtcblx0XHRcdFx0XHRcdHNjcmlwdC5hZnRlckNvbmZpZ3VyZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1lbHNle1xuXHRcdHNjcmlwdC5hZnRlckNvbmZpZ3VyZSgpO1xuXHR9XG59OyIsIlwidXNlIHN0cmljdFwiOyB2YXIgJCA9IGpRdWVyeTtcbiQoZnVuY3Rpb24oKSB7IG5ldyAoZnVuY3Rpb24oKXtcblx0KGZ1bmN0aW9uKCl7XG5cdFx0d2luZG93LnNrcm9sbGV4Q29uZmlnID0gZXZhbCgnKCcgKyAkKCdodG1sJykuZGF0YSgnc2tyb2xsZXgtY29uZmlnJykgKyAnKScpO1xuXHRcdHdpbmRvdy5za3JvbGxleENvbmZpZy5zY3JlZW5zaG90TW9kZSA9IGZhbHNlO1xuXHRcdHdpbmRvdy5za3JvbGxleENvbmZpZy5hbmltYXRpb25zID0gZmFsc2U7XG5cdFx0aWYod2luZG93LnNrcm9sbGV4Q29uZmlnLmFuaW1hdGlvbnMpe1xuXHRcdFx0JCgnaHRtbCcpLmFkZENsYXNzKCduby1hbmltYXRpb25zJyk7XG5cdFx0fVxuXHRcdCQoJ2h0bWwnKS5hZGRDbGFzcygnZG9tLXJlYWR5Jyk7XG5cdFx0dmFyIGRpc2FibGVNb2JpbGVBbmltYXRpb25zID0gdHJ1ZTtcblx0XHR2YXIgaXNXaW4gPSBuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiV2luXCIpIT09LTE7XG5cdFx0aWYoaXNXaW4pICQoJ2h0bWwnKS5hZGRDbGFzcygnd2luJyk7XG5cdFx0dmFyIHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuXHRcdHZhciBpc0VkZ2UgPSB1YS5pbmRleE9mKCdlZGdlJykgPiAtMTtcblx0XHRpZihpc0VkZ2UpICQoJ2h0bWwnKS5hZGRDbGFzcygnZWRnZScpO1xuXHRcdHZhciBpc0Nocm9tZSA9ICFpc0VkZ2UgJiYgdWEuaW5kZXhPZignY2hyb21lJykgPiAtMTtcblx0XHRpZihpc0Nocm9tZSkgJCgnaHRtbCcpLmFkZENsYXNzKCdjaHJvbWUnKTtcblx0XHR2YXIgaXNBbmRyb2lkQnJvd3NlcjRfM21pbnVzID0gKCh1YS5pbmRleE9mKCdtb3ppbGxhLzUuMCcpID4gLTEgJiYgdWEuaW5kZXhPZignYW5kcm9pZCAnKSA+IC0xICYmIHVhLmluZGV4T2YoJ2FwcGxld2Via2l0JykgPiAtMSkgJiYgISh1YS5pbmRleE9mKCdjaHJvbWUnKSA+IC0xKSk7XG5cdFx0aWYoaXNBbmRyb2lkQnJvd3NlcjRfM21pbnVzKSAkKCdodG1sJykuYWRkQ2xhc3MoJ2FuZHJvaWQtYnJvd3Nlci00XzNtaW51cycpO1xuXHRcdHZhciBudWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuXHRcdHZhciBpc0FuZHJvaWRCcm93c2VyID0gKChudWEuaW5kZXhPZignTW96aWxsYS81LjAnKSA+IC0xICYmIG51YS5pbmRleE9mKCdBbmRyb2lkICcpID4gLTEgJiYgbnVhLmluZGV4T2YoJ0FwcGxlV2ViS2l0JykgPiAtMSkgJiYgIShudWEuaW5kZXhPZignQ2hyb21lJykgPiAtMSkpO1xuXHRcdGlmKGlzQW5kcm9pZEJyb3dzZXIpICQoJ2h0bWwnKS5hZGRDbGFzcygnYW5kcm9pZC1icm93c2VyJyk7XG5cdFx0dmFyIGlzU2FmYXJpID0gIWlzQ2hyb21lICYmIHVhLmluZGV4T2YoJ3NhZmFyaScpICE9PSAtMSAmJiB1YS5pbmRleE9mKCd3aW5kb3dzJykgPCAwO1xuXHRcdGlmKGlzU2FmYXJpKSAkKCdodG1sJykuYWRkQ2xhc3MoJ3NhZmFyaScpO1xuXHRcdHZhciBpc01vYmlsZSA9IE1vZGVybml6ci50b3VjaDtcblx0XHRpZihpc01vYmlsZSl7XG5cdFx0XHQkKCdodG1sJykuYWRkQ2xhc3MoJ21vYmlsZScpO1xuXHRcdFx0aWYgKGRpc2FibGVNb2JpbGVBbmltYXRpb25zKSAkKCdodG1sJykuYWRkQ2xhc3MoJ3Bvb3ItYnJvd3NlcicpO1xuXHRcdH1lbHNle1xuXHRcdFx0JCgnaHRtbCcpLmFkZENsYXNzKCdub24tbW9iaWxlJyk7XG5cdFx0fVxuXHRcdGlmKGlzV2luICYmIGlzU2FmYXJpKXtcblx0XHRcdCQoJ2h0bWwnKS5hZGRDbGFzcygnZmxhdC1hbmltYXRpb24nKTtcblx0XHR9XG5cdFx0aWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRSA5LicpID4gLTEpe1xuXHRcdFx0JCgnaHRtbCcpLmFkZENsYXNzKCdpZTknKTtcblx0XHR9ZWxzZSBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNU0lFIDEwLicpID4gLTEpe1xuXHRcdFx0JCgnaHRtbCcpLmFkZENsYXNzKCdpZTEwJyk7XG5cdFx0fWVsc2UgaWYgKCEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHJpZGVudC4qcnZcXDoxMVxcLi8pKXtcblx0XHRcdCQoJ2h0bWwnKS5hZGRDbGFzcygnaWUxMScpO1xuXHRcdH1cblx0XHRpZih3aW5kb3cuc2tyb2xsZXhDb25maWcuc2NyZWVuc2hvdE1vZGUpe1xuXHRcdFx0JCgnaHRtbCcpLmFkZENsYXNzKCdoaWRlLXNrcm9sbC1iYXInKTtcblx0XHR9XG5cdFx0aWYoIXdpbmRvdy5jb25zb2xlKXtcblx0XHRcdHdpbmRvdy5jb25zb2xlID0ge2xvZzogZnVuY3Rpb24oKXt9fTtcblx0XHR9ZWxzZSBpZighd2luZG93LmNvbnNvbGUubG9nKXtcblx0XHRcdHdpbmRvdy5jb25zb2xlLmxvZyA9IGZ1bmN0aW9uKCl7fTtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZih3aW5kb3cuYXRvYikgPT0gXCJ1bmRlZmluZWRcIil7XG5cdFx0XHR3aW5kb3cuYXRvYiA9IGZ1bmN0aW9uKHgpe1xuXHRcdFx0XHRyZXR1cm4gYmFzZTY0LmRlY29kZSh4KTtcblx0XHRcdH1cblx0XHR9XG5cdH0pKCk7XG5cdHZhciBDdXN0b21pemUgPSByZXF1aXJlKCcuL2N1c3RvbWl6ZS9jdXN0b21pemUuanMnKTtcblx0dmFyIFRvcE5hdiA9IHJlcXVpcmUoJy4vd2lkZ2V0cy90b3AtbmF2LmpzJyk7XG5cdHZhciBNZW51VG9nZ2xlID0gcmVxdWlyZSgnLi93aWRnZXRzL21lbnUtdG9nZ2xlLmpzJyk7XG5cdHZhciBQbGF5ZXJzID0gcmVxdWlyZSgnLi9hbmltYXRpb24vcGxheWVycy5qcycpO1xuXHR2YXIgU2Nyb2xsaW5nID0gcmVxdWlyZSgnLi9hbmltYXRpb24vc2Nyb2xsaW5nLmpzJyk7XG5cdHZhciB0b29scyA9IHJlcXVpcmUoJy4vdG9vbHMvdG9vbHMuanMnKTtcblx0dmFyIEdhbGxlcnkgPSByZXF1aXJlKCcuL3dpZGdldHMvZ2FsbGVyeS5qcycpO1xuXHR2YXIgZmx1aWQgPSByZXF1aXJlKCcuL3dpZGdldHMvZmx1aWQuanMnKTtcblx0dmFyIENvdW50ZXIgPSByZXF1aXJlKCcuL3dpZGdldHMvY291bnRlci5qcycpO1xuXHR2YXIgQ2hhbmdlQ29sb3JzID0gcmVxdWlyZSgnLi93aWRnZXRzL2NoYW5nZS1jb2xvcnMuanMnKTtcblx0dmFyIFNsaWRlcnMgPSByZXF1aXJlKCcuL3dpZGdldHMvc2xpZGVycy5qcycpO1xuXHR2YXIgbG9hZGluZyA9IHJlcXVpcmUoJy4vd2lkZ2V0cy9sb2FkaW5nLmpzJyk7XG5cdHZhciBDc3NBbmltYXRpb24gPSByZXF1aXJlKCcuL2FuaW1hdGlvbi9jc3MtYW5pbWF0aW9uLmpzJyk7XG5cdHZhciBkb3RTY3JvbGwgPSByZXF1aXJlKCcuL3dpZGdldHMvZG90LXNjcm9sbC5qcycpO1xuXHR2YXIgTWFwID0gcmVxdWlyZSgnLi93aWRnZXRzL21hcC5qcycpO1xuXHR2YXIgU2tpbGxiYXIgPSByZXF1aXJlKCcuL3dpZGdldHMvc2tpbGxiYXIuanMnKTtcblx0dmFyIFRleHRCZyA9IHJlcXVpcmUoJy4vd2lkZ2V0cy90ZXh0LWJnLmpzJyk7XG5cdHZhciBUZXh0TWFzayA9IHJlcXVpcmUoJy4vd2lkZ2V0cy90ZXh0LW1hc2suanMnKTtcblx0dmFyIFRleHRGaXQgPSByZXF1aXJlKCcuL3dpZGdldHMvdGV4dC1maXQuanMnKTtcblx0dmFyIFRleHRGdWxsc2NyZWVuID0gcmVxdWlyZSgnLi93aWRnZXRzL3RleHQtZnVsbHNjcmVlbi5qcycpO1xuXHR2YXIgQWpheEZvcm0gPSByZXF1aXJlKCcuL3dpZGdldHMvYWpheC1mb3JtLmpzJyk7XG5cdHZhciBZb3V0dWJlQkcgPSByZXF1aXJlKCcuL3dpZGdldHMveW91dHViZS1iZy5qcycpO1xuXHR2YXIgVmltZW9CRyA9IHJlcXVpcmUoJy4vd2lkZ2V0cy92aW1lby1iZy5qcycpO1xuXHR2YXIgVmlkZW9CRyA9IHJlcXVpcmUoJy4vd2lkZ2V0cy92aWRlby1iZy5qcycpO1xuXHR2YXIgYXBwID0gcmVxdWlyZSgnLi9hcHAvYXBwLmpzJyk7XG5cdHZhciBPdmVybGF5V2luZG93ID0gcmVxdWlyZSgnLi93aWRnZXRzL292ZXJsYXktd2luZG93LmpzJyk7XG5cdHZhciBpc1Bvb3JCcm93c2VyID0gJCgnaHRtbCcpLmhhc0NsYXNzKCdwb29yLWJyb3dzZXInKTtcblx0dmFyIGlzQW5kcm9pZDQzbWludXMgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ2FuZHJvaWQtYnJvd3Nlci00XzNtaW51cycpO1xuXHR2YXIgJHBhZ2VUcmFuc2l0aW9uID0gJCgnLnBhZ2UtdHJhbnNpdGlvbiwgLm5hdi1saW5rcywgLnNpZGViYXIsIC5wb3N0LW1ldGEsIC5wb3N0LXRpdGxlLCAucG9zdC1pbWFnZScpO1xuXHR2YXIgbWUgPSB0aGlzO1xuXHR2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblx0dmFyIHNlY3Rpb25RID0gJy52aWV3Pi5mZyc7XG5cdHZhciAkc2VjdGlvbnMgPSAkKHNlY3Rpb25RKTtcblx0dmFyIHNlY3Rpb25UcmlnZ2VycyA9IFtdO1xuXHR2YXIgbGFzdEFjdGl2ZVNlY3Rpb25IYXNoO1xuXHR2YXIgY3VzdG9taXplclVybCA9IGZ1bmN0aW9uKHVybCl7XG5cdFx0dmFyIHJlcyA9IHVybDtcblx0XHRpZihza3JvbGxleENvbmZpZy5pc0N1c3RvbWl6ZXIpe1xuXHRcdFx0dmFyIHBhcnQxID0gJ3dwLWFkbWluL2N1c3RvbWl6ZS5waHA/dXJsPSc7XG5cdFx0XHR2YXIgaW9wMSA9IHJlcy5pbmRleE9mKHBhcnQxKTtcblx0XHRcdGlmKGlvcDE+PTApe1xuXHRcdFx0XHRyZXMgPSBkZWNvZGVVUklDb21wb25lbnQocmVzLnN1YnN0cmluZyhpb3AxICsgcGFydDEubGVuZ3RoKSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dmFyIHBhcnQyID0gJ3dwLWFkbWluL2N1c3RvbWl6ZS5waHAnO1xuXHRcdFx0XHR2YXIgaW9wMiA9IHJlcy5pbmRleE9mKHBhcnQyKTtcblx0XHRcdFx0aWYoaW9wMj49MCl7XG5cdFx0XHRcdFx0cmVzID0gcmVzLnN1YnN0cmluZygwLCBpb3AyKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzO1xuXHR9XG5cdHZhciBkZWxldGVIYXNoID0gZnVuY3Rpb24odXJsKXtcblx0XHR2YXIgaHAgPSB1cmwuaW5kZXhPZignIycpO1xuXHRcdGlmKGhwID49IDApe1xuXHRcdFx0cmV0dXJuIHVybC5zdWJzdHIoMCwgaHApO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIHVybDtcblx0XHR9XG5cdH1cblx0dmFyIGdldEhhc2ggPSBmdW5jdGlvbih1cmwpe1xuXHRcdHZhciBocCA9IHVybC5pbmRleE9mKCcjJyk7XG5cdFx0aWYoaHAgPj0gMCl7XG5cdFx0XHRyZXR1cm4gdXJsLnN1YnN0cihocCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH1cblx0dmFyIGxvY2F0aW9uID0gZGVsZXRlSGFzaChjdXN0b21pemVyVXJsKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpKTtcblx0dmFyICRuYXZMaW5rcyA9IChmdW5jdGlvbigpe1xuXHRcdHZhciAkcmVzID0galF1ZXJ5KCk7XG5cdFx0JCgnI3RvcC1uYXYgbmF2IGEnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0aWYoXG5cdFx0XHRcdCghdGhpcy5oYXNoKSB8fFxuXHRcdFx0XHQoXG5cdFx0XHRcdFx0KHRoaXMuaHJlZiA9PT0gbG9jYXRpb24rdGhpcy5oYXNoKSAmJlxuXHRcdFx0XHRcdCgkKHNlY3Rpb25RK3RoaXMuaGFzaCkubGVuZ3RoID4gMClcblx0XHRcdFx0KVxuXHRcdFx0KXtcblx0XHRcdFx0JHRoaXMuZGF0YSgnbmF2aWdhdGlvbi1ncm91cCcsICd0b3AtbmF2Jyk7XG5cdFx0XHRcdCRyZXMgPSAkcmVzLmFkZCgkdGhpcyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuICRyZXM7XG5cdH0pKCk7XG5cdHZhciBpc01vYmlsZSA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnbW9iaWxlJyk7XG5cdHZhciBzY3JvbGxpbmc7XG5cdHZhciBtYXhTY3JvbGxQb3NpdGlvbjtcblx0dmFyIHRpY2tlciA9IG5ldyAoZnVuY3Rpb24oKXtcblx0XHR2YXIgbWUgPSB0aGlzO1xuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbUZyYW1lID0gKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICAgfHwgXG5cdFx0XHRcdHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgXG5cdFx0XHRcdHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgfHwgXG5cdFx0XHRcdHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgfHwgXG5cdFx0XHRcdHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgfHwgXG5cdFx0XHRcdGZ1bmN0aW9uKC8qIGZ1bmN0aW9uICovIGNhbGxiYWNrLCAvKiBET01FbGVtZW50ICovIGVsZW1lbnQpe1xuXHRcdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xuXHRcdFx0XHR9O1xuXHRcdH0pKCk7XG5cdFx0dmFyIGxhc3RQb3NpdGlvbiA9IC0xO1xuXHRcdHRoaXMucGFnZUlzUmVhZHkgPSBmYWxzZTtcblx0XHQoZnVuY3Rpb24gYW5pbWF0ZSh0aW1lKXtcblx0XHRcdGlmKG1lLnBhZ2VJc1JlYWR5KXtcblx0XHRcdFx0dmFyIHdpbmRvd1RvcFBvcyA9IHRvb2xzLndpbmRvd1lPZmZzZXQoKTtcblx0XHRcdFx0aWYgKGxhc3RQb3NpdGlvbiAhPT0gd2luZG93VG9wUG9zKSB7XG5cdFx0XHRcdFx0c2Nyb2xsaW5nLnNjcm9sbCh3aW5kb3dUb3BQb3MpO1xuXHRcdFx0XHRcdHRyaWdOYXZpZ2F0aW9uTGlua3Mod2luZG93VG9wUG9zKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsYXN0UG9zaXRpb24gPSB3aW5kb3dUb3BQb3M7XG5cdFx0XHRcdFRXRUVOLnVwZGF0ZSgpO1xuXHRcdFx0XHRhcHAudGljaygpO1xuXHRcdFx0fVxuXHRcdFx0aWYobG9hZGluZy5xdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdChsb2FkaW5nLnF1ZXVlLnBvcCgpKSgpO1xuXHRcdFx0fVxuXHRcdFx0cmVxdWVzdEFuaW1GcmFtZShhbmltYXRlKTtcblx0XHR9KSgpO1xuXHR9KSgpO1xuXHRcblx0dGhpcy50b3BOYXYgPSB1bmRlZmluZWQ7XG5cdHRoaXMucGxheWVycyA9IFBsYXllcnM7XG5cdHRoaXMuYWZ0ZXJDb25maWd1cmUgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBoYXNoID0gZ2V0SGFzaChjdXN0b21pemVyVXJsKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSk7XG5cdFx0bmV3IFlvdXR1YmVCRygpO1xuXHRcdG5ldyBWaW1lb0JHKCk7XG5cdFx0bmV3IFZpZGVvQkcoKTtcblx0XHRhcHAucHJlcGFyZShmdW5jdGlvbigpe1xuXHRcdFx0bG9hZGluZy5sb2FkKGZ1bmN0aW9uICgpe1xuXHRcdFx0XHQkbmF2TGlua3MgPSAkbmF2TGlua3MuYWRkKGRvdFNjcm9sbC5saW5rcygpKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCRuYXZMaW5rcy5yZW1vdmVDbGFzcygndGFyZ2V0Jyk7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygndGFyZ2V0Jyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRtZS50b3BOYXYgPSBuZXcgVG9wTmF2KCk7XG5cdFx0XHRcdG5ldyBNZW51VG9nZ2xlKG1lKTtcblx0XHRcdFx0c2Nyb2xsaW5nID0gbmV3IFNjcm9sbGluZyhtZSk7XG5cdFx0XHRcdCQoJyNmb290ZXIuYW5pbWF0ZWQgLnNlY3Rpb24tY29scycpLmFkZENsYXNzKCdzY3JvbGwtaW4tYW5pbWF0aW9uJykuYXR0cignZGF0YS1hbmltYXRpb24nLCAnZmFkZUluRG93bicpXG5cdFx0XHRcdHdpZGdldHMoJCgnYm9keScpKTtcblx0XHRcdFx0bmV3IEdhbGxlcnkob25Cb2R5SGVpZ2h0UmVzaXplLCB3aWRnZXRzLCB1bndpZGdldHMpO1xuXHRcdFx0XHR2YXIgd2luZG93VyA9ICR3aW5kb3cud2lkdGgoKTtcblx0XHRcdFx0dmFyIHdpbmRvd0ggPSAkd2luZG93LmhlaWdodCgpO1xuXHRcdFx0XHQkd2luZG93LnJlc2l6ZShmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciBuZXdXaW5kb3dXID0gJHdpbmRvdy53aWR0aCgpO1xuXHRcdFx0XHRcdHZhciBuZXdXaW5kb3dIID0gJHdpbmRvdy5oZWlnaHQoKTtcblx0XHRcdFx0XHRpZihuZXdXaW5kb3dXIT09d2luZG93VyB8fCBuZXdXaW5kb3dIIT09d2luZG93SCl7IC8vSUUgOCBmaXhcblx0XHRcdFx0XHRcdHdpbmRvd1cgPSBuZXdXaW5kb3dXO1xuXHRcdFx0XHRcdFx0d2luZG93SCA9IG5ld1dpbmRvd0g7XG5cdFx0XHRcdFx0XHRmbHVpZC5zZXR1cCgkKCdib2R5JykpO1xuXHRcdFx0XHRcdFx0b25Cb2R5SGVpZ2h0UmVzaXplKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0JCgnLm1hc29ucnktZ3JkJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCQodGhpcykubWFzb25yeSgnb24nLCAnbGF5b3V0Q29tcGxldGUnLCBmdW5jdGlvbigpeyBvbkJvZHlIZWlnaHRSZXNpemUoKTsgfSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRhcHAuc2V0dXAoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgZmluaXNoID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdGJ1aWxkU2l6ZXMoKTtcblx0XHRcdFx0XHRcdGNhbGNOYXZpZ2F0aW9uTGlua1RyaWdnZXJzKCk7XG5cdFx0XHRcdFx0XHR0aWNrZXIucGFnZUlzUmVhZHkgPSB0cnVlO1xuXHRcdFx0XHRcdFx0JG5hdkxpbmtzLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0aWYodGhpcy5ocmVmPT1sb2NhdGlvbil7XG5cdFx0XHRcdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0JCgnLmJpZ3RleHQnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdCQodGhpcykuYmlndGV4dCgpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRhcHAudW5nYXRlZCgpO1xuXHRcdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRsb2FkaW5nLnVuZ2F0ZSgpO1xuXHRcdFx0XHRcdFx0XHR2YXIgbmF2ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnbmF2aWdhdGUnKTtcblx0XHRcdFx0XHRcdFx0aWYoc2tyb2xsZXhDb25maWcuaXNDdXN0b21pemVyICYmIG5hdil7XG5cdFx0XHRcdFx0XHRcdFx0bmF2aWdhdGUobmF2LCBnZXRIYXNoKG5hdikpO1xuXHRcdFx0XHRcdFx0XHR9ZWxzZSBpZighc2tyb2xsZXhDb25maWcuaXNDdXN0b21pemVyKXtcblx0XHRcdFx0XHRcdFx0XHRuYXZpZ2F0ZShjdXN0b21pemVyVXJsKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSwgaGFzaCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0dmFyIHRlc3QgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dmFyICRleGNsID0gJCgnLm5vbi1wcmVsb2FkaW5nLCAubm9uLXByZWxvYWRpbmcgaW1nJyk7XG5cdFx0XHRcdFx0XHR2YXIgJGltZ3MgPSAkKCdpbWcnKS5ub3QoJGV4Y2wpO1xuXHRcdFx0XHRcdFx0Zm9yKHZhciBpPTA7IGk8JGltZ3MubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0XHRpZiggKCEkaW1nc1tpXS53aWR0aCB8fCAhJGltZ3NbaV0uaGVpZ2h0KSAmJiAoISRpbWdzW2ldLm5hdHVyYWxXaWR0aCB8fCAhJGltZ3NbaV0ubmF0dXJhbEhlaWdodCkgKXtcblx0XHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KHRlc3QsIDEwMCk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRmaW5pc2goKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGVzdCgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cdGZ1bmN0aW9uIG9uQm9keUhlaWdodFJlc2l6ZSgpIHtcblx0XHRidWlsZFNpemVzKCk7XG5cdFx0c2Nyb2xsaW5nLnNjcm9sbCh0b29scy53aW5kb3dZT2Zmc2V0KCkpO1xuXHRcdGNhbGNOYXZpZ2F0aW9uTGlua1RyaWdnZXJzKCk7XG5cdH1cblx0ZnVuY3Rpb24gd2lkZ2V0cygkY29udGV4dCl7XG5cdFx0bmV3IFNsaWRlcnMoJGNvbnRleHQpO1xuXHRcdGlmKCFpc01vYmlsZSkgJGNvbnRleHQuZmluZCgnLmhvdmVyLWRpcicpLmVhY2goIGZ1bmN0aW9uKCkgeyAkKHRoaXMpLmhvdmVyZGlyKHtzcGVlZDogMzAwfSk7IH0gKTtcblx0XHQkY29udGV4dC5maW5kKFwiYVwiKS5jbGljayhmdW5jdGlvbihlKXtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHRpZigkdGhpcy5kYXRhKCd0b2dnbGUnKSB8fCAkdGhpcy5oYXNDbGFzcygnbWVudS10b2dnbGUnKSkgcmV0dXJuO1xuXHRcdFx0dmFyIGNVcmwgPSBjdXN0b21pemVyVXJsKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpO1xuXHRcdFx0aWYoc2tyb2xsZXhDb25maWcuaXNDdXN0b21pemVyICYmICR0aGlzLmF0dHIoJ2hyZWYnKSAmJiAoY1VybCA9PT0gdGhpcy5ocmVmIHx8IChjVXJsKycvJykgPT09IHRoaXMuaHJlZiB8fCBjVXJsID09PSAodGhpcy5ocmVmKycvJykpICYmICFnZXRIYXNoKHRoaXMuaHJlZikpe1xuXHRcdFx0XHR0b29scy5zY3JvbGxUbygwKTtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbmF2aWdhdGUodGhpcy5ocmVmLCB0aGlzLmhhc2gsIGUsICR0aGlzKTtcblx0XHR9KTtcblx0XHRmbHVpZC5zZXR1cCgkY29udGV4dCk7XG5cdFx0bmV3IE1hcCgkY29udGV4dCk7XG5cdFx0bmV3IENvdW50ZXIoJGNvbnRleHQsIG1lKTtcblx0XHRuZXcgQ2hhbmdlQ29sb3JzKCRjb250ZXh0KTtcblx0XHRuZXcgU2tpbGxiYXIoJGNvbnRleHQsIG1lKTtcblx0XHRuZXcgVGV4dEJnKCRjb250ZXh0LCBtZSk7XG5cdFx0bmV3IFRleHRNYXNrKCRjb250ZXh0KTtcblx0XHRuZXcgVGV4dEZpdCgkY29udGV4dCk7XG5cdFx0bmV3IFRleHRGdWxsc2NyZWVuKCRjb250ZXh0KTtcblx0XHRuZXcgQWpheEZvcm0oJGNvbnRleHQpO1xuXHRcdG5ldyBDc3NBbmltYXRpb24oJGNvbnRleHQsIG1lKTtcblx0XHQkKCcud2lkZ2V0LXRhYnMgYScpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkKHRoaXMpLnRhYignc2hvdycpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0pO1xuXHRcdCRjb250ZXh0LmZpbmQoJ3ZpZGVvJykuZWFjaChmdW5jdGlvbigpeyAvLyBJRSA5IEZpeFxuXHRcdFx0aWYoJCh0aGlzKS5hdHRyKCdtdXRlZCcpIT09dW5kZWZpbmVkKXtcblx0XHRcdFx0dGhpcy5tdXRlZD10cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCRjb250ZXh0LmZpbmQoJy5vcGVuLW92ZXJsYXktd2luZG93JykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdHZhciAkb3ZlcmxheSA9ICQoJHRoaXMuZGF0YSgnb3ZlcmxheS13aW5kb3cnKSk7XG5cdFx0XHR2YXIgb3ZlcmxheVdpbmRvdyA9IG5ldyBPdmVybGF5V2luZG93KCRvdmVybGF5KTtcblx0XHRcdCR0aGlzLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdG92ZXJsYXlXaW5kb3cuc2hvdygpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9KVxuXHRcdH0pO1xuXHRcdHZhciAkZmJveCA9ICRjb250ZXh0LmZpbmQoJy5mYW5jeWJveCcpO1xuXHRcdGlmICh0eXBlb2YgJGZib3guZmFuY3lib3ggPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dmFyIG9wdHMgPSB7ICdvdmVybGF5U2hvdycgOiB0cnVlLCAnaGlkZU9uT3ZlcmxheUNsaWNrJyA6IHRydWUsICdvdmVybGF5T3BhY2l0eScgOiAwLjkzLCAnb3ZlcmxheUNvbG9yJyA6ICcjMDAwMDA0JywgJ3Nob3dDbG9zZUJ1dHRvbicgOiB0cnVlLCAncGFkZGluZycgOiAwLCAnY2VudGVyT25TY3JvbGwnIDogdHJ1ZSwgJ2VuYWJsZUVzY2FwZUJ1dHRvbicgOiB0cnVlLCAnYXV0b1NjYWxlJyA6IHRydWUgfTtcblx0XHRcdGpRdWVyeSgnLnlvdXR1YmUtcG9wdXAnKVxuXHRcdFx0XHRcdC5hZGRDbGFzcygnbm9mYW5jeWJveCcpXG5cdFx0XHRcdFx0LmZhbmN5Ym94KCBqUXVlcnkuZXh0ZW5kKHt9LCBvcHRzLCB7ICd0eXBlJyA6ICdpZnJhbWUnLCAnd2lkdGgnIDogMTI4MCwgJ2hlaWdodCcgOiA3MjAsICdwYWRkaW5nJyA6IDAsICd0aXRsZVNob3cnIDogZmFsc2UsICd0aXRsZVBvc2l0aW9uJyA6ICdmbG9hdCcsICd0aXRsZUZyb21BbHQnIDogdHJ1ZSwgJ29uU3RhcnQnIDogZnVuY3Rpb24oc2VsZWN0ZWRBcnJheSwgc2VsZWN0ZWRJbmRleCwgc2VsZWN0ZWRPcHRzKSB7IHNlbGVjdGVkT3B0cy5ocmVmID0gc2VsZWN0ZWRBcnJheVtzZWxlY3RlZEluZGV4XS5ocmVmLnJlcGxhY2UobmV3IFJlZ0V4cCgneW91dHUuYmUnLCAnaScpLCAnd3d3LnlvdXR1YmUuY29tL2VtYmVkJykucmVwbGFjZShuZXcgUmVnRXhwKCd3YXRjaFxcXFw/KC4qKXY9KFthLXowLTlcXF9cXC1dKykoJmFtcDt8JnxcXFxcPyk/KC4qKScsICdpJyksICdlbWJlZC8kMj8kMSQ0Jyk7IHZhciBzcGxpdE9uID0gc2VsZWN0ZWRPcHRzLmhyZWYuaW5kZXhPZignPycpOyB2YXIgdXJsUGFybXMgPSAoIHNwbGl0T24gPiAtMSApID8gc2VsZWN0ZWRPcHRzLmhyZWYuc3Vic3RyaW5nKHNwbGl0T24pIDogXCJcIjsgc2VsZWN0ZWRPcHRzLmFsbG93ZnVsbHNjcmVlbiA9ICggdXJsUGFybXMuaW5kZXhPZignZnM9MCcpID4gLTEgKSA/IGZhbHNlIDogdHJ1ZSB9IH0pICk7XG5cdFx0fVxuXHRcdGlmKGlzTW9iaWxlKXtcblx0XHRcdCRjb250ZXh0LmZpbmQoJy50ZXh0aWxsYXRlJykuY2hpbGRyZW4oJy50ZXh0cycpLmNzcyh7ZGlzcGxheTogJ2lubGluZSd9KS5jaGlsZHJlbignOm5vdChzcGFuOmZpcnN0LW9mLXR5cGUpJykuY3NzKHtkaXNwbGF5OiAnbm9uZSd9KTtcblx0XHR9ZWxzZXtcblx0XHRcdHZhciAkdGx0ID0gJGNvbnRleHQuZmluZCgnLnRleHRpbGxhdGUnKTtcblx0XHRcdCR0bHQudGV4dGlsbGF0ZShldmFsKCcoJyskdGx0LmRhdGEoJ3RleHRpbGxhdGUtb3B0aW9ucycpKycpJykpO1xuXHRcdH1cblx0XHR2YXIgY29sdW1uSCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHQkY29udGV4dC5maW5kKCcuY29sLWhlaWdodCcpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdFx0aWYoJHRoaXMud2lkdGgoKSA9PT0gJHRoaXMucGFyZW50KCkud2lkdGgoKSl7XG5cdFx0XHRcdFx0JHRoaXMuY3NzKHsnbWluLWhlaWdodCc6ICcwJ30pO1xuXHRcdFx0XHRcdCR0aGlzLmNoaWxkcmVuKCcucG9zaXRpb24tbWlkZGxlLWNlbnRlcicpLnJlbW92ZUNsYXNzKCdwb3NpdGlvbi1taWRkbGUtY2VudGVyJykuYWRkQ2xhc3MoJ3Bvc2l0aW9uLW1pZGRsZS1jZW50ZXItbWFyaycpLmNzcyh7cGFkZGluZzogJzIwcHgnfSk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdCR0aGlzLmNzcyh7J21pbi1oZWlnaHQnOiAnJ30pO1xuXHRcdFx0XHRcdCR0aGlzLmNoaWxkcmVuKCcucG9zaXRpb24tbWlkZGxlLWNlbnRlci1tYXJrJykucmVtb3ZlQ2xhc3MoJ3Bvc2l0aW9uLW1pZGRsZS1jZW50ZXItbWFyaycpLmFkZENsYXNzKCdwb3NpdGlvbi1taWRkbGUtY2VudGVyJykuY3NzKHtwYWRkaW5nOiAnJ30pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdCQod2luZG93KS5yZXNpemUoY29sdW1uSCk7XG5cdFx0Y29sdW1uSCgpO1xuXHRcdHZhciBzdmdPdmVybGF5cyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHQkY29udGV4dC5maW5kKCdzdmcuZmctb3ZlcmxheScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdFx0dmFyIHcgPSAkdGhpcy5wYXJlbnQoKS53aWR0aCgpO1xuXHRcdFx0XHR2YXIgaCA9ICR0aGlzLnBhcmVudCgpLmhlaWdodCgpO1xuXHRcdFx0XHR2YXIgc2l6ZSA9IHcgPiBoID8gdyA6IGg7XG5cdFx0XHRcdCR0aGlzLmF0dHIoJ3dpZHRoJyxzaXplKS5hdHRyKCdoZWlnaHQnLHNpemUpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdCQod2luZG93KS5yZXNpemUoc3ZnT3ZlcmxheXMpO1xuXHRcdHN2Z092ZXJsYXlzKCk7XG5cdFx0aWYgKHNrcm9sbGV4Q29uZmlnLmlzQ3VzdG9taXplcikge1xuXHRcdFx0dmFyIHN2Z1VybEZpeCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCRjb250ZXh0LmZpbmQoJ3N2ZycpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgcyA9IFNuYXAoJCh0aGlzKVswXSk7XG5cdFx0XHRcdFx0dmFyIGNoYW5nZSA9IGZ1bmN0aW9uKGVudHJ5LCBuYW1lKXtcblx0XHRcdFx0XHRcdHZhciBwcmVmID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCtcIiNcIjtcblx0XHRcdFx0XHRcdGVudHJ5Lm5vZGUuc2V0QXR0cmlidXRlKG5hbWUsIGVudHJ5Lm5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpXG5cdFx0XHRcdFx0XHRcdC5yZXBsYWNlKFwidXJsKCcjXCIsIFwidXJsKCdcIitwcmVmKVxuXHRcdFx0XHRcdFx0XHQucmVwbGFjZSgndXJsKFwiIycsICd1cmwoXCInK3ByZWYpXG5cdFx0XHRcdFx0XHRcdC5yZXBsYWNlKFwidXJsKCNcIiwgJ3VybCgnK3ByZWYpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzLnNlbGVjdEFsbCgnW21hc2tdJykuZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuXHRcdFx0XHRcdFx0Y2hhbmdlKGVudHJ5LCAnbWFzaycpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHMuc2VsZWN0QWxsKCdbZmlsbF0nKS5mb3JFYWNoKGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRcdFx0XHRjaGFuZ2UoZW50cnksICdmaWxsJyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cy5zZWxlY3RBbGwoJ1tmaWx0ZXJdJykuZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuXHRcdFx0XHRcdFx0Y2hhbmdlKGVudHJ5LCAnZmlsdGVyJyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0JCh3aW5kb3cpLnJlc2l6ZShzdmdVcmxGaXgpO1xuXHRcdFx0c3ZnVXJsRml4KCk7XG5cdFx0fVxuXHRcdCRjb250ZXh0LmZpbmQoJy5tYXNvbnJ5LWdyZCcpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdCQodGhpcykubWFzb25yeSh7XG5cdFx0XHRcdGl0ZW1TZWxlY3RvcjogJy5tYXNvbnJ5LWl0ZW06bm90KC5oaWRkZW4taXRlbSknLFxuXHRcdFx0XHRsYXlvdXRNb2RlOiAnbWFzb25yeScsXG5cdFx0XHRcdGd1dHRlcjogMCxcblx0XHRcdFx0cGVyY2VudFBvc2l0aW9uOiB0cnVlLFxuXHRcdFx0XHRpc0ZpdFdpZHRoOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblx0ZnVuY3Rpb24gdW53aWRnZXRzKCRjb250ZXh0KXtcblx0XHRuZXcgU2xpZGVycygkY29udGV4dCwgdHJ1ZSk7XG5cdFx0JGNvbnRleHQuZmluZCgnLnBsYXllcicpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciBpbmQgPSAkKHRoaXMpLmRhdGEoJ3BsYXllci1pbmQnKTtcblx0XHRcdG1lLnBsYXllcnNbaW5kXS5wYXVzZSgpO1xuXHRcdFx0bWUucGxheWVycy5zcGxpY2UoaW5kLCAxKTtcblx0XHR9KTtcblx0XHQkY29udGV4dC5maW5kKCcub3ZlcmxheS1jb250ZW50LCAubG9hZGVkLWNvbnRlbnQnKS5lbXB0eSgpO1xuXHR9XG5cdGZ1bmN0aW9uIG5hdmlnYXRlKGhyZWYsIGhhc2gsIGUsICRlbGVtKSB7XG5cdFx0dmFyIGhyZWZCSCA9IGRlbGV0ZUhhc2goaHJlZik7XG5cdFx0aWYoaGFzaCAmJiAobG9jYXRpb24gPT09IGhyZWZCSCB8fCAobG9jYXRpb24rJy8nKSA9PT0gaHJlZkJIIHx8IGxvY2F0aW9uID09PSAoaHJlZkJIKycvJykpICYmIGhhc2guaW5kZXhPZihcIiFcIikgPT09IC0xKXtcblx0XHRcdHZhciAkY29udGVudCA9IChmdW5jdGlvbigpe1xuXHRcdFx0XHRpZihoYXNoID09PSAnI3Njcm9sbC1kb3duJyAmJiBlKXtcblx0XHRcdFx0XHR2YXIgJHYgPSBmYWxzZTtcblx0XHRcdFx0XHR2YXIgJHRhZyA9ICQoZS50YXJnZXQpO1xuXHRcdFx0XHRcdHZhciB0YWdUb3AgPSAkdGFnLm9mZnNldCgpLnRvcDtcblx0XHRcdFx0XHQkKCcud3JhcHBlci1jb250ZW50IC52aWV3JykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dmFyICRmb3VuZCA9ICQodGhpcyk7XG5cdFx0XHRcdFx0XHRpZiggJGZvdW5kLm9mZnNldCgpLnRvcCArIDEwMCA+IHRhZ1RvcCApe1xuXHRcdFx0XHRcdFx0XHQkdiA9ICRmb3VuZDtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGlmKCR2ICYmICR2Lmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdFx0cmV0dXJuICR2O1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0JHYgPSAkKCcud3JhcHBlci1jb250ZW50IC52aWV3Jyk7XG5cdFx0XHRcdFx0XHRpZigkdi5sZW5ndGggPiAxKXtcblx0XHRcdFx0XHRcdFx0cmV0dXJuICQoJHYuZ2V0KDEpKTtcblx0XHRcdFx0XHRcdH1lbHNlIGlmKCR2Lmxlbmd0aCA9PT0gMSAmJiAkdi5vZmZzZXQoKS50b3AgPiAzMDApe1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJHY7XG5cdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRyZXR1cm4gJChoYXNoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSkoKTtcblx0XHRcdGlmIChlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHRcdGlmKCRjb250ZW50ICE9PSBudWxsICYmICRjb250ZW50Lmxlbmd0aCA+IDApe1xuXHRcdFx0XHR2YXIgb2Zmc2V0ID0gJGNvbnRlbnQub2Zmc2V0KCkudG9wIC0gbWUudG9wTmF2LnN0YXRlMkg7XG5cdFx0XHRcdHZhciB0biA9ICRjb250ZW50LmdldCgwKS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdGlmKHRuID09PSAnaDEnIHx8IHRuID09PSAnaDInIHx8IHRuID09PSAnaDMnIHx8IHRuID09PSAnaDQnIHx8IHRuID09PSAnaDUnIHx8IHRuID09PSAnaDYnKXtcblx0XHRcdFx0XHRvZmZzZXQgLT0gMjA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG9mZnNldCA8IDApIG9mZnNldCA9IDA7XG5cdFx0XHRcdHRvb2xzLnNjcm9sbFRvKG9mZnNldCk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0aWYoaGFzaCA9PT0gJyNzY3JvbGwtZG93bicpe1xuXHRcdFx0XHRcdHRvb2xzLnNjcm9sbFRvKE1hdGgucm91bmQoJCh3aW5kb3cpLmhlaWdodCgpLzIpKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0dG9vbHMuc2Nyb2xsVG8oMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKHNrcm9sbGV4Q29uZmlnLmlzQ3VzdG9taXplcil7XG5cdFx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ25hdmlnYXRlJywgJycpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1lbHNlIGlmKGUgJiYgKGhyZWYgIT09IGxvY2F0aW9uKycjJykpe1xuXHRcdFx0aWYoISRlbGVtLmF0dHIoJ3RhcmdldCcpKXtcblx0XHRcdFx0dmFyIHBhZ2VUcmFuc2l0aW9uID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0dmFyIGlzQ3VyU3RhdGUxID0gbWUudG9wTmF2LmlzU3RhdGUxO1xuXHRcdFx0XHRcdG1lLnRvcE5hdi5zdGF0ZTIoKTtcblx0XHRcdFx0XHRsb2FkaW5nLmdhdGUoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IGhyZWY7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JCh3aW5kb3cpLm9uZSgncGFnZXNob3cgcG9wc3RhdGUnLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRcdGxvYWRpbmcudW5nYXRlKCk7XG5cdFx0XHRcdFx0XHRpZihpc0N1clN0YXRlMSl7XG5cdFx0XHRcdFx0XHRcdG1lLnRvcE5hdi5zdGF0ZTEoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0aWYoIXNrcm9sbGV4Q29uZmlnLmlzQ3VzdG9taXplcil7XG5cdFx0XHRcdFx0aWYoJGVsZW0uaGFzQ2xhc3MoJ3BhZ2UtdHJhbnNpdGlvbicpKXtcblx0XHRcdFx0XHRcdHBhZ2VUcmFuc2l0aW9uKCk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHQkcGFnZVRyYW5zaXRpb24uZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHR2YXIgY29udGFpbmVyID0gJCh0aGlzKS5nZXQoMCk7XG5cdFx0XHRcdFx0XHRcdGlmKCQuY29udGFpbnMoY29udGFpbmVyLCAkZWxlbVswXSkpe1xuXHRcdFx0XHRcdFx0XHRcdHBhZ2VUcmFuc2l0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0aWYoaHJlZi5pbmRleE9mKHNrcm9sbGV4Q29uZmlnLmhvbWVVcmkpID09PSAwKXtcblx0XHRcdFx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ25hdmlnYXRlJywgaHJlZik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fWVsc2UgaWYoc2tyb2xsZXhDb25maWcuaXNDdXN0b21pemVyKXtcblx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ25hdmlnYXRlJywgJycpO1xuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBjYWxjTmF2aWdhdGlvbkxpbmtUcmlnZ2Vycygpe1xuXHRcdHZhciB3aCA9ICR3aW5kb3cuaGVpZ2h0KCk7XG5cdFx0dmFyIHRyaWdnZXJEZWx0YSA9IHdoLzM7XG5cdFx0c2VjdGlvblRyaWdnZXJzID0gW107XG5cdFx0JHNlY3Rpb25zLmVhY2goZnVuY3Rpb24oaSl7XG5cdFx0XHR2YXIgJHMgPSAkKHRoaXMpO1xuXHRcdFx0dmFyIGlkID0gJHMuYXR0cignaWQnKTtcblx0XHRcdGlmKGlkKXtcblx0XHRcdFx0dmFyIHBvcyA9ICAkcy5kYXRhKCdwb3NpdGlvbicpO1xuXHRcdFx0XHRzZWN0aW9uVHJpZ2dlcnMucHVzaCh7aGFzaDogJyMnK2lkLCB0cmlnZ2VyT2Zmc2V0OiBwb3MtdHJpZ2dlckRlbHRhLCBwb3NpdGlvbjogcG9zfSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dHJpZ05hdmlnYXRpb25MaW5rcyh0b29scy53aW5kb3dZT2Zmc2V0KCkpO1xuXHR9XG5cdGZ1bmN0aW9uIHRyaWdOYXZpZ2F0aW9uTGlua3Mod2luZG93VG9wUG9zKXtcblx0XHR2YXIgYWN0aXZlU2VjdGlvbkhhc2g7XG5cdFx0Zm9yKHZhciBpPTA7IGk8c2VjdGlvblRyaWdnZXJzLmxlbmd0aDsgaSsrKXtcblx0XHRcdGlmKHNlY3Rpb25UcmlnZ2Vyc1tpXS50cmlnZ2VyT2Zmc2V0PHdpbmRvd1RvcFBvcyAmJiAoaSA9PT0gMCB8fCBzZWN0aW9uVHJpZ2dlcnNbaS0xXS5wb3NpdGlvbjx3aW5kb3dUb3BQb3MpKXtcblx0XHRcdFx0YWN0aXZlU2VjdGlvbkhhc2ggPSBzZWN0aW9uVHJpZ2dlcnNbaV0uaGFzaDtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoYWN0aXZlU2VjdGlvbkhhc2ghPWxhc3RBY3RpdmVTZWN0aW9uSGFzaCl7XG5cdFx0XHR2YXIgc2VjdGlvbkxpbmsgPSBsb2NhdGlvbiArIGFjdGl2ZVNlY3Rpb25IYXNoO1xuXHRcdFx0bGFzdEFjdGl2ZVNlY3Rpb25IYXNoID0gYWN0aXZlU2VjdGlvbkhhc2g7XG5cdFx0XHR2YXIgZm91bmQgPSBbXTtcblx0XHRcdCRuYXZMaW5rcy5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciAkYSA9ICQodGhpcyk7XG5cdFx0XHRcdGlmKHRoaXMuaHJlZiA9PT0gc2VjdGlvbkxpbmspe1xuXHRcdFx0XHRcdCRhLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdFx0XHQkYS5yZW1vdmVDbGFzcygndGFyZ2V0Jyk7XG5cdFx0XHRcdFx0Zm91bmQucHVzaCgkYS5kYXRhKCduYXZpZ2F0aW9uLWdyb3VwJykpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBmb3VuZC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHQkbmF2TGlua3MuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciAkYSA9ICQodGhpcyk7XG5cdFx0XHRcdFx0aWYodGhpcy5ocmVmICE9PSBzZWN0aW9uTGluayAmJiBmb3VuZFtpXSA9PT0gJGEuZGF0YSgnbmF2aWdhdGlvbi1ncm91cCcpKXtcblx0XHRcdFx0XHRcdCRhLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0YXBwLmNoYW5nZVNlY3Rpb24obWUsIGFjdGl2ZVNlY3Rpb25IYXNoKTtcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gYnVpbGRTaXplcygpe1xuXHRcdGFwcC5idWlsZFNpemVzKG1lKTtcblx0XHRtYXhTY3JvbGxQb3NpdGlvbiA9ICQoJ2JvZHknKS5oZWlnaHQoKSAtICR3aW5kb3cuaGVpZ2h0KCk7XG5cdFx0Zm9yKHZhciBpPTA7IGk8bWUucGxheWVycy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgJHYgPSBtZS5wbGF5ZXJzW2ldLiR2aWV3O1xuXHRcdFx0JHYuZGF0YSgncG9zaXRpb24nLCAkdi5vZmZzZXQoKS50b3ApO1xuXHRcdH1cblx0fVxuXHR2YXIgYW5pbUVuZCA9IGZ1bmN0aW9uKGVsZW1zLCBlbmQsIG1vZGVybiwgY2FsbGJhY2ssIHRpbWUpe1xuXHRcdHZhciBhZGRpdGlvblRpbWUgPSAxMDA7XG5cdFx0dmFyIGRlZmF1bHRUaW1lID0gMTAwMDtcblx0XHRyZXR1cm4gZWxlbXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBlbGVtID0gdGhpcztcblx0XHRcdGlmIChtb2Rlcm4gJiYgIWlzQW5kcm9pZDQzbWludXMpIHtcblx0XHRcdFx0dmFyIGRvbmUgPSBmYWxzZTtcblx0XHRcdFx0JChlbGVtKS5iaW5kKGVuZCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0ZG9uZSA9IHRydWU7XG5cdFx0XHRcdFx0JChlbGVtKS51bmJpbmQoZW5kKTtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbChlbGVtKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmKHRpbWUgPj0gMCB8fCB0aW1lID09PSB1bmRlZmluZWQpe1xuXHRcdFx0XHRcdHZhciB3VGltZSA9IHRpbWUgPT09IHVuZGVmaW5lZCA/IDEwMDAgOiBkZWZhdWx0VGltZSArIGFkZGl0aW9uVGltZTtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRpZighZG9uZSl7XG5cdFx0XHRcdFx0XHRcdCQoZWxlbSkudW5iaW5kKGVuZCk7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwoZWxlbSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgd1RpbWUpXG5cdFx0XHRcdH1cblx0XHRcdH1lbHNle1xuXHRcdFx0XHRjYWxsYmFjay5jYWxsKGVsZW0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdCQuZm4uYW5pbWF0aW9uRW5kID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRpbWUpIHtcblx0XHRyZXR1cm4gYW5pbUVuZCh0aGlzLCB0b29scy5hbmltYXRpb25FbmQsIE1vZGVybml6ci5jc3NhbmltYXRpb25zLCBjYWxsYmFjaywgdGltZSk7XG5cdH07XG5cdCQuZm4udHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aW1lKSB7XG5cdFx0cmV0dXJuIGFuaW1FbmQodGhpcywgdG9vbHMudHJhbnNpdGlvbkVuZCwgTW9kZXJuaXpyLmNzc3RyYW5zaXRpb25zLCBjYWxsYmFjaywgdGltZSk7XG5cdH07XG5cdCQuZm4uc3RvcFRyYW5zaXRpb24gPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB0aGlzLmNzcyh7XG5cdFx0XHQnLXdlYmtpdC10cmFuc2l0aW9uJzogJ25vbmUnLFxuXHRcdFx0Jy1tb3otdHJhbnNpdGlvbic6ICdub25lJyxcblx0XHRcdCctbXMtdHJhbnNpdGlvbic6ICdub25lJyxcblx0XHRcdCctby10cmFuc2l0aW9uJzogJ25vbmUnLFxuXHRcdFx0J3RyYW5zaXRpb24nOiAgJ25vbmUnXG5cdFx0fSk7XG5cdH1cblx0JC5mbi5jbGVhblRyYW5zaXRpb24gPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB0aGlzLmNzcyh7XG5cdFx0XHQnLXdlYmtpdC10cmFuc2l0aW9uJzogJycsXG5cdFx0XHQnLW1vei10cmFuc2l0aW9uJzogJycsXG5cdFx0XHQnLW1zLXRyYW5zaXRpb24nOiAnJyxcblx0XHRcdCctby10cmFuc2l0aW9uJzogJycsXG5cdFx0XHQndHJhbnNpdGlvbic6ICAnJ1xuXHRcdH0pO1xuXHR9XG5cdCQuZm4ubm9uVHJhbnNpdGlvbiA9ICBmdW5jdGlvbihjc3MpIHtcblx0XHRyZXR1cm4gdGhpcy5zdG9wVHJhbnNpdGlvbigpLmNzcyhjc3MpLmNsZWFuVHJhbnNpdGlvbigpO1xuXHR9O1xuXHQkLmZuLnRyYW5zZm9ybSA9ICBmdW5jdGlvbihzdHIsIG9yaWdpbikge1xuXHRcdHJldHVybiB0aGlzLmNzcyh0b29scy50cmFuc2Zvcm1Dc3Moc3RyLCBvcmlnaW4pKTtcblx0fTtcblx0JCgndmlkZW8nKS5lYWNoKGZ1bmN0aW9uKCl7IC8vIElFIDkgRml4XG5cdFx0aWYoJCh0aGlzKS5hdHRyKCdtdXRlZCcpIT09dW5kZWZpbmVkKXtcblx0XHRcdHRoaXMubXV0ZWQ9dHJ1ZTtcblx0XHR9XG5cdH0pO1xuXHRuZXcgQ3VzdG9taXplKG1lKTtcblx0aWYoIWlzTW9iaWxlICYmICFpc1Bvb3JCcm93c2VyKXtcblx0XHQkKGRvY3VtZW50KS5iaW5kKCdtb3VzZXdoZWVsIERPTU1vdXNlU2Nyb2xsJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRpZiAoZXZlbnQuY3RybEtleSA9PSB0cnVlKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cdH1cbn0pKCk7fSk7IiwiXCJ1c2Ugc3RyaWN0XCI7IHZhciAkID0galF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBuZXcgKGZ1bmN0aW9uKCl7XG5cdHZhciBtZSA9IHRoaXM7XG5cdHZhciBzY3JpcHQgPSByZXF1aXJlKCcuLi9zY3JpcHQuanMnKTtcblx0dmFyIGlzQW5kcm9pZEJyb3dzZXI0XzNtaW51cyA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnYW5kcm9pZC1icm93c2VyLTRfM21pbnVzJyk7XG5cdHRoaXMuYW5pbWF0aW9uRW5kID0gJ2FuaW1hdGlvbmVuZCB3ZWJraXRBbmltYXRpb25FbmQgb0FuaW1hdGlvbkVuZCBNU0FuaW1hdGlvbkVuZCc7XG5cdHRoaXMudHJhbnNpdGlvbkVuZCA9ICd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQnO1xuXHR0aGlzLnRyYW5zaXRpb24gPSBbJy13ZWJraXQtdHJhbnNpdGlvbicsICctbW96LXRyYW5zaXRpb24nLCAnLW1zLXRyYW5zaXRpb24nLCAnLW8tdHJhbnNpdGlvbicsICd0cmFuc2l0aW9uJ107XG5cdHRoaXMudHJhbnNmb3JtID0gW1wiLXdlYmtpdC10cmFuc2Zvcm1cIiwgXCItbW96LXRyYW5zZm9ybVwiLCBcIi1tcy10cmFuc2Zvcm1cIiwgXCItby10cmFuc2Zvcm1cIiwgXCJ0cmFuc2Zvcm1cIl07XG5cdHRoaXMucHJvcGVydHkgPSBmdW5jdGlvbihrZXlzLCB2YWx1ZSwgb2JqKXtcblx0XHR2YXIgcmVzID0gb2JqID8gb2JqIDoge307XG5cdFx0Zm9yKHZhciBpPTA7IGk8a2V5cy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRyZXNba2V5c1tpXV09dmFsdWU7XG5cdFx0fVxuXHRcdHJldHVybiByZXM7XG5cdH1cblx0dGhpcy53aW5kb3dZT2Zmc2V0ID0gd2luZG93LnBhZ2VZT2Zmc2V0ICE9PSB1bmRlZmluZWQgPyBmdW5jdGlvbigpe3JldHVybiB3aW5kb3cucGFnZVlPZmZzZXQ7fSA6IChkb2N1bWVudC5jb21wYXRNb2RlID09PSBcIkNTUzFDb21wYXRcIiA/IGZ1bmN0aW9uKCl7cmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7fSA6IGZ1bmN0aW9uKCl7cmV0dXJuIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO30pO1xuXHR0aGlzLmdldFVybFBhcmFtZXRlciA9IGZ1bmN0aW9uKHNQYXJhbSl7XG5cdFx0dmFyIHNQYWdlVVJMID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSk7XG5cdFx0dmFyIHNVUkxWYXJpYWJsZXMgPSBzUGFnZVVSTC5zcGxpdCgnJicpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc1VSTFZhcmlhYmxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIHNQYXJhbWV0ZXJOYW1lID0gc1VSTFZhcmlhYmxlc1tpXS5zcGxpdCgnPScpO1xuXHRcdFx0aWYgKHNQYXJhbWV0ZXJOYW1lWzBdID09IHNQYXJhbSkge1xuXHRcdFx0XHRyZXR1cm4gZGVjb2RlVVJJKHNQYXJhbWV0ZXJOYW1lWzFdKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0dGhpcy5zZWxlY3RUZXh0YXJlYSA9IGZ1bmN0aW9uKCRlbCl7XG5cdFx0JGVsLmZvY3VzKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdCR0aGlzLnNlbGVjdCgpO1xuXHRcdFx0Ly8gV29yayBhcm91bmQgQ2hyb21lJ3MgbGl0dGxlIHByb2JsZW1cblx0XHRcdCR0aGlzLm1vdXNldXAoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIFByZXZlbnQgZnVydGhlciBtb3VzZXVwIGludGVydmVudGlvblxuXHRcdFx0XHQkdGhpcy51bmJpbmQoXCJtb3VzZXVwXCIpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXHR2YXIgdGltZXI7XG5cdHRoaXMudGltZSA9IGZ1bmN0aW9uKGxhYmVsKXtcblx0XHRpZighdGltZXIpe1xuXHRcdFx0dGltZXIgPSBEYXRlLm5vdygpO1xuXHRcdFx0Y29uc29sZS5sb2coJz09PT0gVGltZXIgc3RhcnRlZCcrKGxhYmVsID8gJyB8ICcrbGFiZWwgOiAnJykpXG5cdFx0fWVsc2V7XG5cdFx0XHR2YXIgdCA9IERhdGUubm93KCk7XG5cdFx0XHRjb25zb2xlLmxvZygnPT09PSAnKyh0LXRpbWVyKSsnIG1zJysobGFiZWwgPyAnIHwgJytsYWJlbCA6ICcnKSk7XG5cdFx0XHR0aW1lciA9IHQ7XG5cdFx0fVxuXHR9XG5cdHRoaXMuc2Nyb2xsVG8gPSBmdW5jdGlvbiAoeSwgY2FsbGJhY2ssIHRpbWUpIHtcblx0XHRpZih0aW1lID09PSB1bmRlZmluZWQpIHRpbWUgPSAxMjAwO1xuXHRcdG5ldyBUV0VFTi5Ud2Vlbih7eTogbWUud2luZG93WU9mZnNldCgpfSlcblx0XHRcdC50byh7eTogTWF0aC5yb3VuZCh5KX0sIHRpbWUpXG5cdFx0XHQub25VcGRhdGUoZnVuY3Rpb24oKXtcblx0XHRcdFx0d2luZG93LnNjcm9sbFRvKDAsIHRoaXMueSk7XG5cdFx0XHR9KVxuXHRcdFx0LmVhc2luZyhUV0VFTi5FYXNpbmcuUXVhZHJhdGljLkluT3V0KVxuXHRcdFx0Lm9uQ29tcGxldGUoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZihjYWxsYmFjayl7XG5cdFx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGFydCgpO1xuXHR9XG5cdHRoaXMuYW5kcm9pZFN0eWxlc0ZpeCA9IGZ1bmN0aW9uKCRxKXtcblx0XHRpZihpc0FuZHJvaWRCcm93c2VyNF8zbWludXMpe1xuXHRcdFx0JHEuaGlkZSgpO1xuXHRcdFx0JHEuZ2V0KDApLm9mZnNldEhlaWdodDtcblx0XHRcdCRxLnNob3coKTtcblx0XHR9XG5cdH1cblx0dGhpcy50cmFuc2Zvcm1Dc3MgPSBmdW5jdGlvbihzdHIsIG9yaWdpbil7XG5cdFx0dmFyIHJlcyA9IHtcblx0XHRcdCctd2Via2l0LXRyYW5zZm9ybSc6IHN0cixcblx0XHRcdCctbW96LXRyYW5zZm9ybSc6IHN0cixcblx0XHRcdCctbXMtdHJhbnNmb3JtJzogc3RyLFxuXHRcdFx0Jy1vLXRyYW5zZm9ybSc6IHN0cixcblx0XHRcdCd0cmFuc2Zvcm0nOiAgc3RyXG5cdFx0fTtcblx0XHRpZihvcmlnaW4pe1xuXHRcdFx0cmVzWyctd2Via2l0LXRyYW5zZm9ybS1vcmlnaW4nXSA9IG9yaWdpbjtcblx0XHRcdHJlc1snLW1vei10cmFuc2Zvcm0tb3JpZ2luJ10gPSBvcmlnaW47XG5cdFx0XHRyZXNbJy1tcy10cmFuc2Zvcm0tb3JpZ2luJ10gPSBvcmlnaW47XG5cdFx0XHRyZXNbJy1vLXRyYW5zZm9ybS1vcmlnaW4nXSA9IG9yaWdpbjtcblx0XHRcdHJlc1sndHJhbnNmb3JtLW9yaWdpbiddID0gb3JpZ2luO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzO1xuXHR9XG5cdHRoaXMuc25hcFVybCA9IGZ1bmN0aW9uKGVsKXtcblx0XHRpZiAoc2tyb2xsZXhDb25maWcuaXNDdXN0b21pemVyKSB7XG5cdFx0XHR2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCArICcjJyArIGVsLmF0dHIoJ2lkJyk7XG5cdFx0XHRyZXR1cm4gXCJ1cmwoJ1wiICsgdXJsICsgXCInKVwiO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIGVsO1xuXHRcdH1cblx0fVxufSkoKTsiLCJcInVzZSBzdHJpY3RcIjsgdmFyICQgPSBqUXVlcnk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRjb250ZXh0KSB7XG5cdHZhciBsb2FkaW5nID0gcmVxdWlyZSgnLi9sb2FkaW5nLmpzJyk7XG5cdHZhciAkZ2F0ZUxvYWRlciA9ICQoJy5nYXRlIC5sb2FkZXInKTtcblx0JGNvbnRleHQuZmluZCgnLmFqYXgtZm9ybScpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0dmFyICRmcm0gPSAkKHRoaXMpO1xuXHRcdCRmcm0uc3VibWl0KGZ1bmN0aW9uKGUpIHtcblx0XHRcdGlmKCRmcm0uZmluZCgnLmhlbHAtYmxvY2sgdWwnKS5sZW5ndGggPCAxKXtcblx0XHRcdFx0JGdhdGVMb2FkZXIuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHRcdFx0bG9hZGluZy5nYXRlKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciBtZXNzYWdlID0gZnVuY3Rpb24obXNnKSB7XG5cdFx0XHRcdFx0XHQkKCc8ZGl2IGNsYXNzPVwiYWpheC1mb3JtLWFsZXJ0IGFsZXJ0IGhlYWRpbmcgZmFkZSBpbiB0ZXh0LWNlbnRlclwiPlx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L2J1dHRvbj4gJyArIG1zZyArICc8L2Rpdj4nKVxuXHRcdFx0XHRcdFx0XHRcdC5hZGRDbGFzcygkZnJtLmRhdGEoJ21lc3NhZ2UtY2xhc3MnKSkuYXBwZW5kVG8oJ2JvZHknKTtcblx0XHRcdFx0XHRcdGxvYWRpbmcudW5nYXRlKCk7XG5cdFx0XHRcdFx0XHQkZ2F0ZUxvYWRlci5yZW1vdmVDbGFzcygnc2hvdycpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0JC5hamF4KHtcblx0XHRcdFx0XHRcdHR5cGU6ICRmcm0uYXR0cignbWV0aG9kJyksXG5cdFx0XHRcdFx0XHR1cmw6ICRmcm0uYXR0cignYWN0aW9uJyksXG5cdFx0XHRcdFx0XHRkYXRhOiAkZnJtLnNlcmlhbGl6ZSgpLFxuXHRcdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdFx0XHQkZnJtWzBdLnJlc2V0KCk7XG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2UoZGF0YSk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RyKSB7XG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2UoJ0Vycm9yOiAnICsgeGhyLnJlc3BvbnNlQ29kZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xufTtcblxuIiwiXCJ1c2Ugc3RyaWN0XCI7IHZhciAkID0galF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkY29udGV4dCl7XG5cdHZhciB0aGVtZXMgPSByZXF1aXJlKCcuLi9hcHAvdGhlbWVzLmpzJyk7XG5cdCRjb250ZXh0LmZpbmQoJy5jaGFuZ2UtY29sb3JzJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdHZhciAkZ3JvdXAgPSAkKHRoaXMpO1xuXHRcdHZhciAkdGFyZ2V0ID0gJCgkZ3JvdXAuZGF0YSgndGFyZ2V0JykpO1xuXHRcdHZhciAkbGlua3MgPSAkZ3JvdXAuZmluZCgnYScpO1xuXHRcdHZhciBjdXJyZW50Q29sb3JzO1xuXHRcdGZvcih2YXIgaT0wOyBpPHRoZW1lcy5jb2xvcnM7IGkrKyl7XG5cdFx0XHR2YXIgY29sb3JzID0gJ2NvbG9ycy0nK1N0cmluZy5mcm9tQ2hhckNvZGUoNjUraSkudG9Mb3dlckNhc2UoKTtcblx0XHRcdGlmKCR0YXJnZXQuaGFzQ2xhc3MoY29sb3JzKSl7XG5cdFx0XHRcdGN1cnJlbnRDb2xvcnMgPSBjb2xvcnM7XG5cdFx0XHRcdCRsaW5rcy5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0dmFyICRlbCA9ICQodGhpcyk7XG5cdFx0XHRcdFx0aWYoJGVsLmRhdGEoJ2NvbG9ycycpID09PSBjdXJyZW50Q29sb3JzKXtcblx0XHRcdFx0XHRcdCRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH1cblx0XHQkbGlua3MuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgJGxpbmsgPSAkKHRoaXMpO1xuXHRcdFx0JHRhcmdldC5yZW1vdmVDbGFzcyhjdXJyZW50Q29sb3JzKTtcblx0XHRcdGN1cnJlbnRDb2xvcnMgPSAkbGluay5kYXRhKCdjb2xvcnMnKTtcblx0XHRcdCR0YXJnZXQuYWRkQ2xhc3MoY3VycmVudENvbG9ycyk7XG5cdFx0XHQkbGlua3MucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0JGxpbmsuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0pO1xuXHR9KTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7IHZhciAkID0galF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkY29udGV4dCwgc2NyaXB0KXtcblx0dmFyIGlzUG9vckJyb3dzZXIgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ3Bvb3ItYnJvd3NlcicpO1xuXHR2YXIgaXNOb0FuaW1hdGlvbnMgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ25vLWFuaW1hdGlvbnMnKTtcblx0aWYoaXNQb29yQnJvd3NlciB8fCBpc05vQW5pbWF0aW9ucykgcmV0dXJuO1xuXHQkY29udGV4dC5maW5kKCcuY291bnRlciAuY291bnQnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHR2YXIgY291bnQgPSBwYXJzZUludCgkdGhpcy50ZXh0KCkpO1xuXHRcdHZhciBjbnQgPSB7bjogMH1cblx0XHR2YXIgdHcgPSBuZXcgVFdFRU4uVHdlZW4oY250KVxuXHRcdFx0LnRvKHtuOiBjb3VudH0sIDEwMDApXG5cdFx0XHQub25VcGRhdGUoZnVuY3Rpb24oKXtcblx0XHRcdFx0JHRoaXMudGV4dChNYXRoLnJvdW5kKHRoaXMubikpO1xuXHRcdFx0fSlcblx0XHRcdC5lYXNpbmcoVFdFRU4uRWFzaW5nLlF1YXJ0aWMuSW5PdXQpO1xuXHRcdHZhciBwYXVzZSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHR0dy5zdG9wKCk7XG5cdFx0fVxuXHRcdHZhciByZXN1bWUgPSBmdW5jdGlvbigpe1xuXHRcdFx0Y250Lm4gPSAwO1xuXHRcdFx0dHcuc3RhcnQoKTtcblx0XHR9XG5cdFx0dmFyIHN0YXJ0ID0gcmVzdW1lO1xuXHRcdHNjcmlwdC5wbGF5ZXJzLmFkZFBsYXllcigkdGhpcywgc3RhcnQsIHBhdXNlLCByZXN1bWUpO1xuXHR9KTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7IHZhciAkID0galF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBuZXcgKGZ1bmN0aW9uKCl7XG5cdHZhciBpc01vYmlsZSA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnbW9iaWxlJyk7XG5cdHZhciAkc2VjID0gJCgnLndyYXBwZXItY29udGVudD4udmlldz4uZmdbaWRdJyk7XG5cdHZhciAkbG5rcztcblx0aWYoIWlzTW9iaWxlICYmICRzZWMubGVuZ3RoPjEpe1xuXHRcdHZhciAkdWwgPSAkKCcjZG90LXNjcm9sbCcpO1xuXHRcdCRzZWMuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0JHVsLmFwcGVuZCgnPGxpPjxhIGhyZWY9XCIjJyskKHRoaXMpLmF0dHIoJ2lkJykrJ1wiPjxzcGFuPjwvc3Bhbj48L2E+PC9saT4nKTtcblx0XHR9KTtcblx0XHQkbG5rcyA9ICR1bC5maW5kKCdhJykuZGF0YSgnbmF2aWdhdGlvbi1ncm91cCcsICdkb3Qtc2Nyb2xsJyk7XG5cdH1lbHNle1xuXHRcdCRsbmtzID0galF1ZXJ5KCk7XG5cdH1cblx0dGhpcy5saW5rcyA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuICRsbmtzO1xuXHR9XG59KSgpOyIsIlwidXNlIHN0cmljdFwiOyB2YXIgJCA9IGpRdWVyeTtcbm1vZHVsZS5leHBvcnRzID0gbmV3IChmdW5jdGlvbigpe1xuXHR0aGlzLnNldHVwID0gZnVuY3Rpb24oJGNvbnRleHQpe1xuXHRcdCRjb250ZXh0LmZpbmQoJy5mbHVpZCAqJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkZWwgPSAkKHRoaXMpO1xuXHRcdFx0dmFyICR3cmFwID0gJGVsLnBhcmVudCgnLmZsdWlkJyk7XG5cdFx0XHR2YXIgbmV3V2lkdGggPSAkd3JhcC53aWR0aCgpO1xuXHRcdFx0dmFyIGFyID0gJGVsLmF0dHIoJ2RhdGEtYXNwZWN0LXJhdGlvJyk7XG5cdFx0XHRpZighYXIpe1xuXHRcdFx0XHRhciA9IHRoaXMuaGVpZ2h0IC8gdGhpcy53aWR0aDtcblx0XHRcdFx0JGVsXG5cdFx0XHRcdFx0Ly8galF1ZXJ5IC5kYXRhIGRvZXMgbm90IHdvcmsgb24gb2JqZWN0L2VtYmVkIGVsZW1lbnRzXG5cdFx0XHRcdFx0LmF0dHIoJ2RhdGEtYXNwZWN0LXJhdGlvJywgYXIpXG5cdFx0XHRcdFx0LnJlbW92ZUF0dHIoJ2hlaWdodCcpXG5cdFx0XHRcdFx0LnJlbW92ZUF0dHIoJ3dpZHRoJyk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgbmV3SGVpZ2h0ID0gTWF0aC5yb3VuZChuZXdXaWR0aCAqIGFyKTtcblx0XHRcdCRlbC53aWR0aChNYXRoLnJvdW5kKG5ld1dpZHRoKSkuaGVpZ2h0KG5ld0hlaWdodCk7XG5cdFx0XHQkd3JhcC5oZWlnaHQobmV3SGVpZ2h0KTtcblx0XHR9KTtcblx0fTtcbn0pKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7IHZhciAkID0galF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvbkJvZHlIZWlnaHRSZXNpemUsIHdpZGdldHMsIHVud2lkZ2V0cyl7XG5cdHZhciB0b29scyA9IHJlcXVpcmUoJy4uL3Rvb2xzL3Rvb2xzLmpzJyk7XG5cdHZhciBPdmVybGF5V2luZG93ID0gcmVxdWlyZSgnLi9vdmVybGF5LXdpbmRvdy5qcycpO1xuXHR2YXIgJHRvcE5hdiA9ICQoJyN0b3AtbmF2Jyk7XG5cdCQoJy5mZycpLmVhY2goZnVuY3Rpb24oaSl7XG5cdFx0dmFyICRnYWxsZXJ5ID0gJCh0aGlzKTtcblx0XHR2YXIgJGdyaWQgPSAkZ2FsbGVyeS5maW5kKCcuZ2FsbGVyeS1ncmQnKTtcblx0XHR2YXIgJGl0ZW1zID0gJGdyaWQuZmluZCgnLml0ZW0nKTtcblx0XHR2YXIgJGdJdGVtcyA9ICRnYWxsZXJ5LmZpbmQoJy5nYWxsZXJ5LWl0ZW0nKTtcblx0XHRpZigkaXRlbXMubGVuZ3RoIDwgMSAmJiAkZ0l0ZW1zLmxlbmd0aCA8IDEpe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR2YXIgJG1HcmlkID0gJGdhbGxlcnkuZmluZCgnLm1hc29ucnktZ3JkJyk7XG5cdFx0dmFyICRvdmVybGF5ID0gJCgnLmdhbGxlcnktb3ZlcmxheScpO1xuXHRcdHZhciAkbG9hZGVyID0gJG92ZXJsYXkuZmluZCgnLmxvYWRlcicpO1xuXHRcdHZhciAkb3ZlcmxheUNvbnRlbnQgPSAkb3ZlcmxheS5maW5kKCcub3ZlcmxheS1jb250ZW50Jyk7XG5cdFx0dmFyIG92ZXJsYXlXaW5kb3cgPSBuZXcgT3ZlcmxheVdpbmRvdygkb3ZlcmxheSwgd2lkZ2V0cywgdW53aWRnZXRzKTtcblx0XHR2YXIgJG92ZXJsYXlOZXh0ID0gJG92ZXJsYXkuZmluZCgnLm5leHQnKTtcblx0XHR2YXIgJG92ZXJsYXlQcmV2aW9zID0gJG92ZXJsYXkuZmluZCgnLnByZXZpb3MnKTtcblx0XHR2YXIgaXNGaWx0ZXIgPSBmYWxzZTtcblx0XHR2YXIgZGVmYXVsdEdyb3VwID0gJGdhbGxlcnkuZGF0YSgnZGVmYXVsdC1ncm91cCcpID8gJGdhbGxlcnkuZGF0YSgnZGVmYXVsdC1ncm91cCcpIDogJ2FsbCc7XG5cdFx0dmFyICRidG5zID0gJGdhbGxlcnkuZmluZCgnLmZpbHRlciBhJyk7XG5cdFx0dmFyICRhbGwgPSAkZ2FsbGVyeS5maW5kKCcuZmlsdGVyIGFbZGF0YS1ncm91cD1hbGxdJyk7XG5cdFx0dmFyIGN1cnJlbnRHcm91cCA9IGRlZmF1bHRHcm91cDtcblx0XHR2YXIgJGN1cnJlbnRJdGVtO1xuXHRcdCRnYWxsZXJ5LmZpbmQoJy5maWx0ZXIgYVtkYXRhLWdyb3VwPScrZGVmYXVsdEdyb3VwKyddJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdCRidG5zLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0aWYoaXNGaWx0ZXIpIHJldHVybiBmYWxzZTtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgaXNBY3RpdmUgPSAkdGhpcy5oYXNDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdHZhclx0Z3JvdXAgPSBpc0FjdGl2ZSA/ICdhbGwnIDogJHRoaXMuZGF0YSgnZ3JvdXAnKTtcblx0XHRcdGlmKGN1cnJlbnRHcm91cCAhPT0gZ3JvdXApe1xuXHRcdFx0XHRjdXJyZW50R3JvdXAgPSBncm91cDtcblx0XHRcdFx0JGJ0bnMucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHRpZighaXNBY3RpdmUpe1xuXHRcdFx0XHRcdCR0aGlzLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0JGFsbC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0JGl0ZW1zLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgJGkgPSAkKHRoaXMpO1xuXHRcdFx0XHRcdHZhciBkYXRhR3JwcyA9ICRpLmRhdGEoJ2dyb3VwcycpXG5cdFx0XHRcdFx0dmFyIGZpbHRlciA9IGRhdGFHcnBzID8gZGF0YUdycHMuc3BsaXQoL1xccysvKSA6IFtdO1xuXHRcdFx0XHRcdGlmKCBncm91cCA9PSAnYWxsJyB8fCAkLmluQXJyYXkoZ3JvdXAsIGZpbHRlcikhPS0xICl7XG5cdFx0XHRcdFx0XHQkaS5yZW1vdmVDbGFzcygnaGlkZGVuLWl0ZW0nKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdCRpLmFkZENsYXNzKCdoaWRkZW4taXRlbScpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRtR3JpZC5tYXNvbnJ5KCAncmVsb2FkSXRlbXMnICk7XG5cdFx0XHRcdCRtR3JpZC5tYXNvbnJ5KCAnbGF5b3V0JyApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0pO1xuXHRcdCRnSXRlbXMuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRvcGVuSXRlbSgkKHRoaXMpKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9KTtcblx0XHRmdW5jdGlvbiBvcGVuSXRlbSgkaXRlbSl7XG5cdFx0XHQkY3VycmVudEl0ZW0gPSAkaXRlbTtcblx0XHRcdG92ZXJsYXlXaW5kb3cuc2hvdyhudWxsLCBmdW5jdGlvbigpe1xuXHRcdFx0XHQkbG9hZGVyLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG5cdFx0XHRcdCRvdmVybGF5Q29udGVudC5hZGRDbGFzcygnc2hvdycpO1xuXHRcdFx0fSwgZnVuY3Rpb24oZW5kKXtcblx0XHRcdFx0JGxvYWRlci5hZGRDbGFzcygnc2hvdycpO1xuXHRcdFx0XHR2YXIgJGl0ZW1Db250ZW50ID0gJGl0ZW0uZmluZCgnLmdhbGxlcnktaXRlbS1jb250ZW50Jyk7XG5cdFx0XHRcdCRvdmVybGF5Q29udGVudC5yZW1vdmVDbGFzcygnc2hvdycpO1xuXHRcdFx0XHQkb3ZlcmxheUNvbnRlbnQuaHRtbCgkaXRlbUNvbnRlbnQuaHRtbCgpKTtcblx0XHRcdFx0dmFyICRjb250YWluZXIgPSAkb3ZlcmxheUNvbnRlbnQuZmluZCgnLnN3aXBlci1jb250YWluZXInKTtcblx0XHRcdFx0JGNvbnRhaW5lci5yZW1vdmVDbGFzcygnaG9sZCcpO1xuXHRcdFx0XHR2YXIgJHNsaWRlcyA9ICRjb250YWluZXIuZmluZCgnLnN3aXBlci1zbGlkZScpO1xuXHRcdFx0XHQkc2xpZGVzLmVhY2goZnVuY3Rpb24oaSl7XG5cdFx0XHRcdFx0dmFyICRzbGlkZSA9ICQodGhpcyk7XG5cdFx0XHRcdFx0aWYoJHNsaWRlLmRhdGEoJ2FzLWJnJykgPT09ICd5ZXMnKXtcblx0XHRcdFx0XHRcdCRzbGlkZS5jc3Moe1xuXHRcdFx0XHRcdFx0XHQnYmFja2dyb3VuZC1pbWFnZSc6ICd1cmwoJyArICRzbGlkZS5kYXRhKCdob2xkLWltZycpICsgJyknXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdCRzbGlkZS5hZnRlcignPGRpdiBjbGFzcz1cInN3aXBlci1zbGlkZVwiPjxpbWcgYWx0PVwiXCIgc3JjPVwiJyArICRzbGlkZS5kYXRhKCdob2xkLWltZycpICsgJ1wiIC8+PC9kaXY+JykucmVtb3ZlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dmFyICRpbWFnZXMgPSAkb3ZlcmxheUNvbnRlbnQuZmluZCgnaW1nJyk7XG5cdFx0XHRcdHZhciBuaW1hZ2VzID0gJGltYWdlcy5sZW5ndGg7XG5cdFx0XHRcdGlmIChuaW1hZ2VzID4gMCkge1xuXHRcdFx0XHRcdCRpbWFnZXMubG9hZChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdG5pbWFnZXMtLTtcblx0XHRcdFx0XHRcdGlmIChuaW1hZ2VzID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdGVuZCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGVuZCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0JG92ZXJsYXlOZXh0LmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyICRpID0gJGN1cnJlbnRJdGVtLm5leHRBbGwoJy5nYWxsZXJ5LWl0ZW06bm90KC5oaWRkZW4taXRlbSknKS5maXJzdCgpO1xuXHRcdFx0aWYoJGkubGVuZ3RoPDEpe1xuXHRcdFx0XHQkaSA9ICRnSXRlbXMuZmlsdGVyKCcuZ2FsbGVyeS1pdGVtOm5vdCguaGlkZGVuLWl0ZW0pJykuZmlyc3QoKTtcblx0XHRcdH1cblx0XHRcdG9wZW5JdGVtKCRpKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9KTtcblx0XHQkb3ZlcmxheVByZXZpb3MuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgJGkgPSAkY3VycmVudEl0ZW0ucHJldkFsbCgnLmdhbGxlcnktaXRlbTpub3QoLmhpZGRlbi1pdGVtKScpLmZpcnN0KCk7XG5cdFx0XHRpZigkaS5sZW5ndGg8MSl7XG5cdFx0XHRcdCRpID0gJGdJdGVtcy5maWx0ZXIoJy5nYWxsZXJ5LWl0ZW06bm90KC5oaWRkZW4taXRlbSknKS5sYXN0KCk7XG5cdFx0XHR9XG5cdFx0XHRvcGVuSXRlbSgkaSk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSk7XG5cdH0pO1xufTsiLCJcInVzZSBzdHJpY3RcIjsgdmFyICQgPSBqUXVlcnk7XG5tb2R1bGUuZXhwb3J0cyA9IG5ldyAoZnVuY3Rpb24oKXtcblx0dmFyIHRvb2xzID0gcmVxdWlyZSgnLi4vdG9vbHMvdG9vbHMuanMnKTtcblx0dmFyICRnYXRlID0gJCgnLmdhdGUnKTtcblx0dmFyICRnYXRlQmFyID0gJGdhdGUuZmluZCgnLmdhdGUtYmFyJyk7XG5cdHZhciBpc0FuZHJvaWRCcm93c2VyNF8zbWludXMgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ2FuZHJvaWQtYnJvd3Nlci00XzNtaW51cycpO1xuXHR2YXIgbWUgPSB0aGlzO1xuXHR0aGlzLnF1ZXVlID0gW107XG5cdHRoaXMubG9hZCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0XHR2YXIgdXJscyA9IFtdO1xuXHRcdHZhciBmaW5pc2ggPSBmYWxzZTtcblx0XHR2YXIgJGV4Y2wgPSAkKCcubm9uLXByZWxvYWRpbmcsIC5ub24tcHJlbG9hZGluZyBpbWcnKTtcblx0XHRpZighc2tyb2xsZXhDb25maWcuaXNDdXN0b21pemVyKXtcblx0XHRcdCQoJ2ltZzp2aXNpYmxlJykubm90KCRleGNsKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciAkZWwgPSAkKHRoaXMpO1xuXHRcdFx0XHR2YXIgc3JjID0gJGVsLmF0dHIoJ3NyYycpO1xuXHRcdFx0XHRpZihzcmMgJiYgJC5pbkFycmF5KHNyYywgdXJscykgPT09IC0xKXtcblx0XHRcdFx0XHR1cmxzLnB1c2goc3JjKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQkKCdkaXYuYmc6dmlzaWJsZScpLm5vdCgkZXhjbCkuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgJGVsID0gJCh0aGlzKTtcblx0XHRcdFx0dmFyIGJJbWcgPSAkZWwuY3NzKFwiYmFja2dyb3VuZC1pbWFnZVwiKTtcblx0XHRcdFx0aWYgKGJJbWcgIT0gJ25vbmUnKXtcblx0XHRcdFx0XHR2YXIgbXVybCA9IGJJbWcubWF0Y2goL3VybFxcKFsnXCJdPyhbXidcIildKikvaSk7XG5cdFx0XHRcdFx0aWYobXVybCAmJiBtdXJsLmxlbmd0aD4xICYmICFtdXJsWzFdLm1hdGNoKC9kYXRhOi9pKSAmJiAkLmluQXJyYXkobXVybFsxXSwgdXJscykgPT09IC0xKXtcblx0XHRcdFx0XHRcdHVybHMucHVzaChtdXJsWzFdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHQkKCcubG9hZGluZy1mdW5jOnZpc2libGUnKS5ub3QoJGV4Y2wpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkZWwgPSAkKHRoaXMpO1xuXHRcdFx0dmFyIGZ1bmMgPSAkZWwuZGF0YSgnbG9hZGluZycpO1xuXHRcdFx0aWYoZnVuYyl7XG5cdFx0XHRcdHVybHMucHVzaChmdW5jKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR2YXIgbG9hZGVkID0gMDtcblx0XHRpZih1cmxzLmxlbmd0aCA9PT0gMCl7XG5cdFx0XHRmaW5pc2ggPSB0cnVlO1xuXHRcdFx0Y2FsbGJhY2soKTtcblx0XHR9ZWxzZXtcblx0XHRcdHZhciB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYoIWZpbmlzaCl7XG5cdFx0XHRcdFx0ZmluaXNoID0gdHJ1ZTtcblx0XHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCAyMDAwMCk7XG5cdFx0XHRpZighc2tyb2xsZXhDb25maWcuaXNDdXN0b21pemVyKXtcblx0XHRcdFx0JGdhdGUuYWRkQ2xhc3MoJ2xvYWQtYW5pbWF0aW9uJyk7XG5cdFx0XHR9XG5cdFx0XHQkKCdodG1sJykuYWRkQ2xhc3MoJ3BhZ2UtbG9hZGluZycpO1xuXHRcdFx0dmFyIHdhdGVyUGVyYyA9IDA7XG5cdFx0XHR2YXIgZG9uZSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGxvYWRlZCsrO1xuXHRcdFx0XHR3YXRlclBlcmMgPSBsb2FkZWQvdXJscy5sZW5ndGggKiAxMDA7XG5cdFx0XHRcdCRnYXRlQmFyLmNzcyh7d2lkdGg6IHdhdGVyUGVyYysnJSd9KTtcblx0XHRcdFx0aWYobG9hZGVkID09PSB1cmxzLmxlbmd0aCAmJiAhZmluaXNoKXtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xuXHRcdFx0XHRcdGZpbmlzaCA9IHRydWU7XG5cdFx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Zm9yKHZhciBpPTA7IGk8dXJscy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdGlmKHR5cGVvZih1cmxzW2ldKSA9PSAnZnVuY3Rpb24nKXtcblx0XHRcdFx0XHR1cmxzW2ldKGRvbmUpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHR2YXIgaW1nID0gbmV3IEltYWdlKCk7XG5cdFx0XHRcdFx0JChpbWcpLm9uZSgnbG9hZCBlcnJvcicsIGZ1bmN0aW9uKCl7bWUucXVldWUucHVzaChkb25lKX0pO1xuXHRcdFx0XHRcdGltZy5zcmMgPSB1cmxzW2ldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHRoaXMuZ2F0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0XHQkKCdodG1sJykuYWRkQ2xhc3MoJ3BhZ2UtaXMtZ2F0ZWQnKTtcblx0XHQkZ2F0ZUJhci5jc3Moe3dpZHRoOiAnMCUnfSk7XG5cdFx0JGdhdGUudHJhbnNpdGlvbkVuZChmdW5jdGlvbigpe1xuXHRcdFx0aWYoY2FsbGJhY2spe1xuXHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0fVxuXHRcdH0pLmNzcyh7b3BhY2l0eTogMSwgdmlzaWJpbGl0eTogJ3Zpc2libGUnfSk7XG5cdH1cblx0dGhpcy51bmdhdGUgPSBmdW5jdGlvbihjYWxsYmFjayl7XG5cdFx0JCgnaHRtbCcpLnJlbW92ZUNsYXNzKCdwYWdlLWlzLWdhdGVkIHBhZ2UtbG9hZGluZycpLmFkZENsYXNzKCdwYWdlLWlzLWxvYWRlZCcpO1xuXHRcdCRnYXRlLnRyYW5zaXRpb25FbmQoZnVuY3Rpb24oKXtcblx0XHRcdGlmKGlzQW5kcm9pZEJyb3dzZXI0XzNtaW51cyl7XG5cdFx0XHRcdHRvb2xzLmFuZHJvaWRTdHlsZXNGaXgoJCgnYm9keScpKTtcblx0XHRcdH1cblx0XHRcdGlmKGNhbGxiYWNrKXtcblx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdH1cblx0XHRcdCRnYXRlLnJlbW92ZUNsYXNzKCdsb2FkLWFuaW1hdGlvbicpO1xuXHRcdH0pLmNzcyh7b3BhY2l0eTogMCwgdmlzaWJpbGl0eTogJ2hpZGRlbid9KTtcblx0fTtcbn0pKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7IHZhciAkID0galF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkY29udGV4dCl7XG5cdHZhciBPdmVybGF5V2luZG93ID0gcmVxdWlyZSgnLi9vdmVybGF5LXdpbmRvdy5qcycpO1xuXHRpZih0eXBlb2YoZ29vZ2xlKSA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm47XG5cdCRjb250ZXh0LmZpbmQoJy5tYXAtb3BlbicpLmVhY2goZnVuY3Rpb24oKXtcblx0XHR2YXIgJG1hcE9wZW4gPSAkKHRoaXMpO1xuXHRcdHZhciAkb3ZlcmxheSA9ICQoJG1hcE9wZW4uZGF0YSgnbWFwLW92ZXJsYXknKSkuY2xvbmUoKS5hcHBlbmRUbygnYm9keScpO1xuXHRcdCRvdmVybGF5LmZpbmQoJy5vdmVybGF5LXZpZXcnKS5hcHBlbmQoJG1hcE9wZW4ucGFyZW50KCkuZmluZCgnLm1hcC1jYW52YXMnKS5jbG9uZSgpKTtcblx0XHR2YXIgJG1hcENhbnZhcyA9ICRvdmVybGF5LmZpbmQoJy5tYXAtY2FudmFzJyk7XG5cdFx0dmFyIG1hcE9wdGlvbnMgPSB7XG5cdFx0XHRjZW50ZXI6IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoJG1hcENhbnZhcy5kYXRhKCdsYXRpdHVkZScpLCAkbWFwQ2FudmFzLmRhdGEoJ2xvbmdpdHVkZScpKSxcblx0XHRcdHpvb206ICRtYXBDYW52YXMuZGF0YSgnem9vbScpLFxuXHRcdFx0bWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUFxuXHRcdH1cblx0XHR2YXIgbWFya2VycyA9IFtdO1xuXHRcdCRtYXBDYW52YXMuZmluZCgnLm1hcC1tYXJrZXInKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgJG1hcmtlciA9ICQodGhpcyk7XG5cdFx0XHRtYXJrZXJzLnB1c2goe1xuXHRcdFx0XHRsYXRpdHVkZTogJG1hcmtlci5kYXRhKCdsYXRpdHVkZScpLFxuXHRcdFx0XHRsb25naXR1ZGU6ICRtYXJrZXIuZGF0YSgnbG9uZ2l0dWRlJyksXG5cdFx0XHRcdHRleHQ6ICRtYXJrZXIuZGF0YSgndGV4dCcpXG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHQkbWFwQ2FudmFzLmFkZENsYXNzKCdjbG9zZS1tYXAnKS53cmFwKCc8ZGl2IGNsYXNzPVwibWFwLXZpZXdcIj48L2Rpdj4nKTtcblx0XHR2YXIgJG1hcFZpZXcgPSAkbWFwQ2FudmFzLnBhcmVudCgpO1xuXHRcdHZhciBvdmVybGF5V2luZG93ID0gbmV3IE92ZXJsYXlXaW5kb3coJG92ZXJsYXksIGZhbHNlLCBmYWxzZSwgZnVuY3Rpb24oKXtcblx0XHRcdG5ldyBUV0VFTi5Ud2Vlbih7YXV0b0FscGhhOiAxfSlcblx0XHRcdFx0XHQudG8oe2F1dG9BbHBoYTogMH0sIDUwMClcblx0XHRcdFx0XHQub25VcGRhdGUoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdCRtYXBWaWV3LmNzcyh7b3BhY2l0eTogdGhpcy5hdXRvQWxwaGEsIHZpc2liaWxpdHk6ICh0aGlzLmF1dG9BbHBoYSA+IDAgPyAndmlzaWJsZScgOiAnaGlkZGVuJyl9KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5lYXNpbmcoVFdFRU4uRWFzaW5nLkxpbmVhci5Ob25lKVxuXHRcdFx0XHRcdC5zdGFydCgpO1xuXHRcdH0pO1xuXHRcdHZhciBpc0luaXRlZCA9IGZhbHNlO1xuXHRcdCRtYXBPcGVuLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0b3ZlcmxheVdpbmRvdy5zaG93KGZhbHNlLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyICRvYyA9ICRvdmVybGF5LmZpbmQoJy5vdmVybGF5LWNvbnRyb2wnKTtcblx0XHRcdFx0dmFyICRvdiA9ICRvdmVybGF5LmZpbmQoJy5vdmVybGF5LXZpZXcnKTtcblx0XHRcdFx0JG1hcFZpZXcuY3NzKHtoZWlnaHQ6ICgkKHdpbmRvdykuaGVpZ2h0KCkgLSAkb2MuaGVpZ2h0KCkgLSBwYXJzZUludCgkb3YuY3NzKCdib3R0b20nKS5yZXBsYWNlKCdweCcsJycpKSApICsgJ3B4J30pO1xuXHRcdFx0XHQkbWFwVmlldy5jc3Moe29wYWNpdHk6IDEsIHZpc2liaWxpdHk6ICd2aXNpYmxlJ30pO1xuXHRcdFx0XHRpZiAoIWlzSW5pdGVkKSB7XG5cdFx0XHRcdFx0aXNJbml0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKCRtYXBDYW52YXNbMF0sIG1hcE9wdGlvbnMpO1xuXHRcdFx0XHRcdHZhciBhZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKG1hcmtlciwgdGV4dCkge1xuXHRcdFx0XHRcdFx0dmFyIGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQ6IHRleHRcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCBcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRpbmZvd2luZG93Lm9wZW4obWFwLCBtYXJrZXIpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbWFya2Vycy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0dmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuXHRcdFx0XHRcdFx0XHRtYXA6IG1hcCxcblx0XHRcdFx0XHRcdFx0cG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobWFya2Vyc1tpXS5sYXRpdHVkZSwgbWFya2Vyc1tpXS5sb25naXR1ZGUpXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHZhciB0ZXh0ID0gbWFya2Vyc1tpXS50ZXh0O1xuXHRcdFx0XHRcdFx0aWYgKHRleHQpIHtcblx0XHRcdFx0XHRcdFx0YWRkTGlzdGVuZXIobWFya2VyLCB0ZXh0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0pO1xuXHR9KTtcbn0iLCJcInVzZSBzdHJpY3RcIjsgdmFyICQgPSBqUXVlcnk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNjcmlwdCl7XG5cdHZhciB0b2dnbGVTZWwgPSAnLmV4dC1uYXYtdG9nZ2xlLCAucmVzcG9uc2l2ZS1uYXYnO1xuXHR2YXIgJHRvZ2dsZSA9ICQodG9nZ2xlU2VsKTtcblx0dmFyIGlzTW9iaWxlID0gJCgnaHRtbCcpLmhhc0NsYXNzKCdtb2JpbGUnKTtcblx0dmFyIGNsb3NlUmVzcCA9IGZ1bmN0aW9uKCl7XG5cdFx0JCgnLnJlc3BvbnNpdmUtbmF2JykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcblx0XHQkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3Jlc3BvbnNpdmUtbmF2LXNob3cnKTtcblx0XHRpZighaXNNb2JpbGUpe1xuXHRcdFx0JCgnLnRleHRpbGxhdGUnKS5jaGlsZHJlbignc3BhbjpudGgtb2YtdHlwZSgxKScpLmNzcyh7ZGlzcGxheTogJyd9KTtcblx0XHRcdCQoJy50ZXh0aWxsYXRlJykuY2hpbGRyZW4oJ3NwYW46bnRoLW9mLXR5cGUoMiknKS5jc3Moe2Rpc3BsYXk6ICdub25lJ30pO1xuXHRcdFx0JCgnLnRleHRpbGxhdGUnKS5jaGlsZHJlbignc3BhbjpudGgtb2YtdHlwZSgyKScpLmNoaWxkcmVuKCkuY3NzKHtkaXNwbGF5OiAnJ30pO1xuXHRcdH1cblx0fTtcblx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpe1xuXHRcdCQoXCJkaXZbY2xhc3MqPSdvZmYtY2FudmFzJ11cIikucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRjbG9zZVJlc3AoKTtcblx0fSk7XG5cdCR0b2dnbGUuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciAkdGcgPSAkKHRoaXMpO1xuXHRcdGlmKCR0Zy5oYXNDbGFzcygnZXh0LW5hdi10b2dnbGUnKSl7XG5cdFx0XHR2YXIgdGFyZ2V0USA9ICR0Zy5kYXRhKCd0YXJnZXQnKTtcblx0XHRcdHZhciAkZXh0TmF2ID0gJCh0YXJnZXRRKTtcblx0XHRcdHZhciAkY2xpY2tFbHMgPSAkKHRhcmdldFErJyBhLCN0b3AtbmF2IGE6bm90KCcrdG9nZ2xlU2VsKycpLC5wYWdlLWJvcmRlciBhLCAjZG90LXNjcm9sbCBhJyk7XG5cdFx0XHR2YXIgY2xpY2tIbmQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0JGV4dE5hdi5yZW1vdmVDbGFzcygnc2hvdycpO1xuXHRcdFx0XHQkdGcucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcblx0XHRcdFx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdleHQtbmF2LXNob3cnKTtcblx0XHRcdFx0c2NyaXB0LnRvcE5hdi51bmZvcmNlU3RhdGUoJ2V4dC1uYXYnKTtcblx0XHRcdFx0JCgnaHRtbCwgYm9keScpLmNzcyh7b3ZlcmZsb3c6ICcnLCBwb3NpdGlvbjogJyd9KTtcblx0XHRcdFx0JGNsaWNrRWxzLnVuYmluZCgnY2xpY2snLCBjbGlja0huZCk7XG5cdFx0XHR9XG5cdFx0XHRpZigkdGcuaGFzQ2xhc3MoJ3Nob3cnKSl7XG5cdFx0XHRcdCRleHROYXYucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcblx0XHRcdFx0JHRnLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG5cdFx0XHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcygnZXh0LW5hdi1zaG93Jyk7XG5cdFx0XHRcdCRjbGlja0Vscy51bmJpbmQoJ2NsaWNrJywgY2xpY2tIbmQpO1xuXHRcdFx0XHRzY3JpcHQudG9wTmF2LnVuZm9yY2VTdGF0ZSgnZXh0LW5hdicpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdCRleHROYXYuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHRcdFx0JHRnLmFkZENsYXNzKCdzaG93Jyk7XG5cdFx0XHRcdCQoJ2JvZHknKS5hZGRDbGFzcygnZXh0LW5hdi1zaG93Jyk7XG5cdFx0XHRcdCRjbGlja0Vscy5iaW5kKCdjbGljaycsIGNsaWNrSG5kKTtcblx0XHRcdFx0c2NyaXB0LnRvcE5hdi5mb3JjZVN0YXRlKCdleHQtbmF2Jyk7XG5cdFx0XHR9XG5cdFx0fWVsc2V7XG5cdFx0XHRpZigkdGcuaGFzQ2xhc3MoJ3Nob3cnKSl7XG5cdFx0XHRcdGNsb3NlUmVzcCgpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGlmKCFpc01vYmlsZSl7XG5cdFx0XHRcdFx0JCgnLnRleHRpbGxhdGUnKS5jaGlsZHJlbignc3BhbjpudGgtb2YtdHlwZSgxKScpLmNzcyh7ZGlzcGxheTogJ25vbmUnfSk7XG5cdFx0XHRcdFx0JCgnLnRleHRpbGxhdGUnKS5jaGlsZHJlbignc3BhbjpudGgtb2YtdHlwZSgyKScpLmNzcyh7ZGlzcGxheTogJ2lubGluZSd9KTtcblx0XHRcdFx0XHQkKCcudGV4dGlsbGF0ZScpLmNoaWxkcmVuKCdzcGFuOm50aC1vZi10eXBlKDIpJykuY2hpbGRyZW4oJzpub3QoLmN1cnJlbnQpJykuY3NzKHtkaXNwbGF5OiAnbm9uZSd9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkdGcuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHRcdFx0JCgnYm9keScpLmFkZENsYXNzKCdyZXNwb25zaXZlLW5hdi1zaG93Jyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7IHZhciAkID0galF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkb3ZlcmxheSwgd2lkZ2V0cywgdW53aWRnZXRzLCBoaWRlRnVuYyl7XG5cdHZhciAkb3ZlcmxheUNsb3NlID0gJG92ZXJsYXkuZmluZCgnLmNyb3NzJyk7XG5cdHZhciAkb3ZlcmxheVpvb20gPSAkKCRvdmVybGF5LmRhdGEoJ292ZXJsYXktem9vbScpKTtcblx0dmFyICRvdmVybGF5VmlldyA9ICRvdmVybGF5LmZpbmQoJy5vdmVybGF5LXZpZXcnKTtcblx0dmFyIG1lID0gdGhpcztcblx0dGhpcy4kb3ZlcmxheSA9ICRvdmVybGF5O1xuXHR0aGlzLnNob3cgPSBmdW5jdGlvbihsb2FkLCBjYWxsYmFjaywgaW5pdCkge1xuXHRcdHZhciBvcGVuID0gZnVuY3Rpb24oaW5pdGVkKSB7XG5cdFx0XHRpZihpbml0ICYmICFpbml0ZWQpe1xuXHRcdFx0XHRpbml0KGZ1bmN0aW9uKCl7IG9wZW4odHJ1ZSk7IH0pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQkb3ZlcmxheVpvb20uYWRkQ2xhc3MoJ292ZXJsYXktem9vbScpO1xuXHRcdFx0JG92ZXJsYXkudHJhbnNpdGlvbkVuZChmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgaWZJbml0ID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQkb3ZlcmxheVZpZXcuZmluZCgnaWZyYW1lJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdFx0XHRcdHZhciBob2xkID0gJHRoaXMuZGF0YSgnaG9sZC1zcmMnKTtcblx0XHRcdFx0XHRcdGlmKGhvbGQgJiYgISR0aGlzLmF0dHIoJ3NyYycpKXtcblx0XHRcdFx0XHRcdFx0JHRoaXNbMF0uc3JjID0gaG9sZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCR0aGlzLmFkZENsYXNzKCdzaG93Jyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGxvYWQpIHtcblx0XHRcdFx0XHR2YXIgJGxvYWRlciA9ICRvdmVybGF5LmZpbmQoJy5sb2FkZXInKTtcblx0XHRcdFx0XHR2YXIgJGxvYWRlZENvbnRlbnQgPSAkKCc8ZGl2IGNsYXNzPVwibG9hZGVkLWNvbnRlbnRcIj48L2Rpdj4nKTtcblx0XHRcdFx0XHQkbG9hZGVyLmFkZENsYXNzKCdzaG93Jyk7XG5cdFx0XHRcdFx0JGxvYWRlZENvbnRlbnQuYWRkQ2xhc3MoJ2NvbnRlbnQtY29udGFpbmVyJykuYXBwZW5kVG8oJG92ZXJsYXlWaWV3KTtcblx0XHRcdFx0XHQkbG9hZGVkQ29udGVudC5sb2FkKGxvYWQsIGZ1bmN0aW9uKHhociwgc3RhdHVzVGV4dCwgcmVxdWVzdCkge1xuXHRcdFx0XHRcdFx0aWYgKHN0YXR1c1RleHQgIT09IFwic3VjY2Vzc1wiICYmIHN0YXR1c1RleHQgIT09IFwibm90bW9kaWZpZWRcIikge1xuXHRcdFx0XHRcdFx0XHQkbG9hZGVkQ29udGVudC50ZXh0KHN0YXR1c1RleHQpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkb3ZlcmxheS5maW5kKCdpZnJhbWUnKS5hZGRDbGFzcygnc2hvdycpO1xuXHRcdFx0XHRcdFx0dmFyICRpbWFnZXMgPSAkbG9hZGVkQ29udGVudC5maW5kKCdpbWcnKTtcblx0XHRcdFx0XHRcdHZhciBuaW1hZ2VzID0gJGltYWdlcy5sZW5ndGg7XG5cdFx0XHRcdFx0XHRpZiAobmltYWdlcyA+IDApIHtcblx0XHRcdFx0XHRcdFx0JGltYWdlcy5sb2FkKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdG5pbWFnZXMtLTtcblx0XHRcdFx0XHRcdFx0XHRpZiAobmltYWdlcyA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2hvdygpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRzaG93KCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRmdW5jdGlvbiBzaG93KCkge1xuXHRcdFx0XHRcdFx0XHRpZkluaXQoKTtcblx0XHRcdFx0XHRcdFx0aWYod2lkZ2V0cyl7XG5cdFx0XHRcdFx0XHRcdFx0d2lkZ2V0cygkbG9hZGVkQ29udGVudCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0JGxvYWRlZENvbnRlbnQuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHRcdFx0XHRcdFx0JGxvYWRlci5yZW1vdmVDbGFzcygnc2hvdycpO1xuXHRcdFx0XHRcdFx0XHRpZihjYWxsYmFjayl7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRpZkluaXQoKTtcblx0XHRcdFx0XHRpZih3aWRnZXRzKXtcblx0XHRcdFx0XHRcdHdpZGdldHMoJG92ZXJsYXlWaWV3KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoY2FsbGJhY2spe1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pLmFkZENsYXNzKCdzaG93Jyk7XG5cdFx0fTtcblx0XHRpZiAoJG92ZXJsYXkuaGFzQ2xhc3MoJ3Nob3cnKSkge1xuXHRcdFx0bWUuaGlkZShvcGVuKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b3BlbigpO1xuXHRcdH1cblx0fVxuXHR0aGlzLmhpZGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdCRvdmVybGF5Wm9vbS5yZW1vdmVDbGFzcygnb3ZlcmxheS16b29tJyk7XG5cdFx0JG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICRsb2FkZWRDb250ZW50ID0gJG92ZXJsYXkuZmluZCgnLmxvYWRlZC1jb250ZW50Jyk7XG5cdFx0XHRpZigkbG9hZGVkQ29udGVudC5sZW5ndGg+MCl7XG5cdFx0XHRcdGlmKHVud2lkZ2V0cyl7XG5cdFx0XHRcdFx0JG92ZXJsYXkuZmluZCgnaWZyYW1lJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcblx0XHRcdFx0XHR1bndpZGdldHMoJG92ZXJsYXkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHN0b3BJZnJhbWVCZWZvcmVSZW1vdmUoJGxvYWRlZENvbnRlbnQsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRsb2FkZWRDb250ZW50LnJlbW92ZSgpO1xuXHRcdFx0XHRcdGlmKGhpZGVGdW5jKXtcblx0XHRcdFx0XHRcdGhpZGVGdW5jKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChjYWxsYmFjaykge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGlmKHVud2lkZ2V0cyl7XG5cdFx0XHRcdFx0JG92ZXJsYXkuZmluZCgnaWZyYW1lJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcblx0XHRcdFx0XHR1bndpZGdldHMoJG92ZXJsYXkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGhpZGVGdW5jKXtcblx0XHRcdFx0XHRoaWRlRnVuYygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjYWxsYmFjaykge1xuXHRcdFx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LCA1MDApO1xuXHR9XG5cdGZ1bmN0aW9uIHN0b3BJZnJhbWVCZWZvcmVSZW1vdmUoJGNvbnRleHQsIGNhbGxiYWNrKSB7XG5cdFx0dmFyIGlzRG9TdG9wID0gJCgnaHRtbCcpLmhhc0NsYXNzKCdpZTknKVxuXHRcdFx0XHR8fCAkKCdodG1sJykuaGFzQ2xhc3MoJ2llMTAnKTtcblx0XHRpZiAoaXNEb1N0b3ApIHtcblx0XHRcdCRjb250ZXh0LmZpbmQoJ2lmcmFtZScpLmF0dHIoJ3NyYycsICcnKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0XHR9LCAzMDApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjYWxsYmFjaygpO1xuXHRcdH1cblx0fVxuXHQkb3ZlcmxheUNsb3NlLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRtZS5oaWRlKCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7IHZhciAkID0galF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkY29udGV4dCwgc2NyaXB0KXtcblx0dmFyIGlzUG9vckJyb3dzZXIgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ3Bvb3ItYnJvd3NlcicpO1xuXHR2YXIgaXNOb0FuaW1hdGlvbnMgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ25vLWFuaW1hdGlvbnMnKTtcblx0JGNvbnRleHQuZmluZCgnLnNraWxsYmFyJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdHZhciAkdGhpcyA9ICQodGhpcylcblx0XHR2YXIgJGJhciA9ICR0aGlzLmZpbmQoJy5za2lsbGJhci1iYXInKTtcblx0XHR2YXIgcGVyYyA9ICBwYXJzZUludCgkdGhpcy5hdHRyKCdkYXRhLXBlcmNlbnQnKS5yZXBsYWNlKCclJywnJykpO1xuXHRcdGlmKGlzUG9vckJyb3dzZXIgfHwgaXNOb0FuaW1hdGlvbnMpe1xuXHRcdFx0JGJhci5jc3Moe3dpZHRoOiBwZXJjKyclJ30pO1xuXHRcdH1lbHNle1xuXHRcdFx0dmFyIHcgPSB7d2lkdGg6IDB9XG5cdFx0XHR2YXIgdHcgPSBuZXcgVFdFRU4uVHdlZW4odylcblx0XHRcdFx0LnRvKHt3aWR0aDogcGVyY30sIDEwMDApXG5cdFx0XHRcdC5vblVwZGF0ZShmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCRiYXIuY3NzKHt3aWR0aDogdGhpcy53aWR0aCsnJSd9KTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmVhc2luZyhUV0VFTi5FYXNpbmcuUXVhcnRpYy5PdXQpO1xuXHRcdFx0dmFyIHBhdXNlID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0dHcuc3RvcCgpO1xuXHRcdFx0fTtcblx0XHRcdHZhciByZXN1bWUgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHR3LndpZHRoID0gMDtcblx0XHRcdFx0dHcuc3RhcnQoKTtcblx0XHRcdH07XG5cdFx0XHR2YXIgc3RhcnQgPSByZXN1bWU7XG5cdFx0XHRzY3JpcHQucGxheWVycy5hZGRQbGF5ZXIoJHRoaXMsIHN0YXJ0LCBwYXVzZSwgcmVzdW1lKTtcblx0XHR9XG5cdH0pO1xufTsiLCJcInVzZSBzdHJpY3RcIjsgdmFyICQgPSBqUXVlcnk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRjb250ZXh0LCBpc1JlbW92ZWQpe1xuXHR2YXIgU3dpcGVyID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zd2lwZXIvZGlzdC9qcy9zd2lwZXIuanF1ZXJ5LmpzJyk7XG5cdGlmKGlzUmVtb3ZlZCl7XG5cdFx0JGNvbnRleHQuZmluZChcIi5zd2lwZXItY29udGFpbmVyLmRlZmF1bHQtc2xpZGVyXCIpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciBzd2lwZXIgPSAkKHRoaXMpWzBdLnN3aXBlcjtcblx0XHRcdHN3aXBlci5kZXN0cm95KHRydWUsIHRydWUpO1xuXHRcdH0pO1xuXHRcdHJldHVybjtcblx0fVxuXHQkY29udGV4dC5maW5kKCcuc3dpcGVyLWNvbnRhaW5lci5kZWZhdWx0LXNsaWRlcjpub3QoLmhvbGQpJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHR2YXIgZWwgPSAkdGhpc1swXTtcblx0XHR2YXIgJGVsID0gJChlbCk7XG5cdFx0dmFyIHNvcHQgPSAkZWwuZGF0YSgnc3dpcGVyLW9wdGlvbnMnKTtcblx0XHR2YXIgb3B0ID0gc29wdCA/IGV2YWwoJygnK3NvcHQrJyknKSA6IHt9O1xuXHRcdHZhciBzd2lwZXIgPSBuZXcgU3dpcGVyKGVsLFxuXHRcdFx0JC5leHRlbmQoXG5cdFx0XHRcdHtcdHBhZ2luYXRpb246ICRlbC5maW5kKCcuc3dpcGVyLXBhZ2luYXRpb24nKVswXSxcblx0XHRcdFx0XHRwYWdpbmF0aW9uQ2xpY2thYmxlOiAkZWwuZmluZCgnLnN3aXBlci1wYWdpbmF0aW9uJylbMF0sXG5cdFx0XHRcdFx0bmV4dEJ1dHRvbjogJGVsLmZpbmQoJy5zd2lwZXItYnV0dG9uLW5leHQnKVswXSxcblx0XHRcdFx0XHRwcmV2QnV0dG9uOiAkZWwuZmluZCgnLnN3aXBlci1idXR0b24tcHJldicpWzBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvcHRcblx0XHRcdClcblx0XHQpO1xuXHR9KTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7IHZhciAkID0galF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkY29udGV4dCwgc2NyaXB0KXtcblx0dmFyIHRvb2xzID0gcmVxdWlyZSgnLi4vdG9vbHMvdG9vbHMuanMnKTtcblx0dmFyIGlzQW5kcm9pZCA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnYW5kcm9pZC1icm93c2VyJyk7XG5cdHZhciBpc05vQW5pbWF0aW9ucyA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnbm8tYW5pbWF0aW9ucycpO1xuXHR2YXIgaXNQb29yQnJvd3NlciA9ICQoJ2h0bWwnKS5oYXNDbGFzcygncG9vci1icm93c2VyJyk7XG5cdHZhciBpc1NhZmFyaSA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnc2FmYXJpJyk7XG5cdGlmKGlzQW5kcm9pZCB8fCBpc05vQW5pbWF0aW9ucyB8fCBpc1Bvb3JCcm93c2VyKXtcblx0XHRyZXR1cm47XG5cdH1cblx0JGNvbnRleHQuZmluZCgnLnRleHQtYmcnKS5lYWNoKGZ1bmN0aW9uKGkpe1xuXHRcdHZhciAkY29udCA9ICQodGhpcyk7XG5cdFx0JGNvbnQuZmluZCgkY29udC5kYXRhKCd0ZXh0LWVmZmVjdC1zZWxlY3RvcicpKS5lYWNoKGZ1bmN0aW9uKGope1xuXHRcdFx0dmFyICRlbCA9ICQodGhpcykuYWRkQ2xhc3MoJ3RleHQtYmctc3ZnIHN2Zy1lZmZlY3QnKTtcblx0XHRcdHZhciBsaW5lcyA9IFtdO1xuXHRcdFx0JGVsLmNvbnRlbnRzKCkuZmlsdGVyKGZ1bmN0aW9uKCkgeyBcblx0XHRcdFx0cmV0dXJuICEhJC50cmltKCB0aGlzLmlubmVySFRNTCB8fCB0aGlzLmRhdGEgKTsgXG5cdFx0XHR9KS5lYWNoKGZ1bmN0aW9uKGkpe1xuXHRcdFx0XHR2YXIgJGxpbmUgPSAkKHRoaXMpO1xuXHRcdFx0XHRsaW5lcy5wdXNoKCRsaW5lLnRleHQoKSk7XG5cdFx0XHR9KTtcblx0XHRcdHZhciBvblJlc2l6ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBzdmdXO1xuXHRcdFx0XHR2YXIgc3ZnSDtcblx0XHRcdFx0dmFyIGVmZmVjdCA9IGZ1bmN0aW9uKHBhdCwgcywgc3ZnKSB7XG5cdFx0XHRcdFx0cy5hdHRyKHt3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJ30pXG5cdFx0XHRcdFx0dmFyIHRleHQgPSBzLnRleHQoMCwgMCwgbGluZXMpLmF0dHIoe2ZpbGw6dG9vbHMuc25hcFVybChwYXQpfSk7XG5cdFx0XHRcdFx0JGVsLmVtcHR5KCkuYXBwZW5kKHN2Zyk7XG5cdFx0XHRcdFx0c3ZnVyA9ICRlbC53aWR0aCgpO1xuXHRcdFx0XHRcdHZhciBsaCA9IHBhcnNlRmxvYXQoJGVsLmNzcygnbGluZS1oZWlnaHQnKS5yZXBsYWNlKCdweCcsICcnKSk7XG5cdFx0XHRcdFx0dmFyIGVsQWwgPSAkZWwuY3NzKCd0ZXh0LWFsaWduJyk7XG5cdFx0XHRcdFx0dGV4dC5zZWxlY3RBbGwoXCJ0c3BhblwiKS5mb3JFYWNoKGZ1bmN0aW9uKHRzcGFuLCBpKXtcblx0XHRcdFx0XHRcdHRzcGFuLmF0dHIoe2R5OiBsaH0pO1xuXHRcdFx0XHRcdFx0aWYoZWxBbCA9PT0gJ3JpZ2h0Jyl7XG5cdFx0XHRcdFx0XHRcdHRzcGFuLmF0dHIoe3g6IHN2Z1csICd0ZXh0LWFuY2hvcic6ICdlbmQnfSk7XG5cdFx0XHRcdFx0XHR9ZWxzZSBpZihlbEFsID09PSAnY2VudGVyJyl7XG5cdFx0XHRcdFx0XHRcdHRzcGFuLmF0dHIoe3g6IE1hdGgucm91bmQoc3ZnVy8yKSwgJ3RleHQtYW5jaG9yJzogJ21pZGRsZSd9KTtcblx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHR0c3Bhbi5hdHRyKHt4OiAwLCAndGV4dC1hbmNob3InOiAnc3RhcnQnfSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0c3ZnSCA9IE1hdGgucm91bmQobGluZXMubGVuZ3RoICogbGggKyBsaC81KTtcblx0XHRcdFx0XHQkZWwuaGVpZ2h0KHN2Z0gpO1xuXHRcdFx0XHRcdHMuYXR0cih7dmlld0JveDogJzAgMCAnK3N2Z1crJyAnK3N2Z0h9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJzdmdcIik7XG5cdFx0XHRcdHZhciBzID0gU25hcChzdmcpO1xuXHRcdFx0XHR2YXIgYW5pbWF0ZSA9IGZ1bmN0aW9uKHBhdCwgaW5BdHRyLCBvdXRBdHRyLCBkdXIsIGVhc2Upe1xuXHRcdFx0XHRcdHZhciBhbmltSW4gPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhpcy5hbmltYXRlKGluQXR0ciwgZHVyLCBlYXNlLCBhbmltT3V0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIGFuaW1PdXQgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhpcy5hbmltYXRlKG91dEF0dHIsIGR1ciwgZWFzZSwgYW5pbUluKTtcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0aWYoJGNvbnQuZGF0YSgndGV4dC1lZmZlY3QnKS5pbmRleE9mKCdhbmltYXRlZCcpICE9PSAtMSl7XG5cdFx0XHRcdFx0XHR2YXIgcGxheWVyUGF1c2UgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHZhciBwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHBhdC5hbmltYXRlKG91dEF0dHIsIGR1ciwgZWFzZSwgYW5pbUluKTtcblx0XHRcdFx0XHRcdGlmKCRjb250LmRhdGEoJ3RleHQtZWZmZWN0JykgPT09ICdjdXN0b20tYW5pbWF0ZWQnIHx8IGlzU2FmYXJpKXtcblx0XHRcdFx0XHRcdFx0dmFyIHRpbWVyID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKCFwYXVzZWQpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKCFwbGF5ZXJQYXVzZSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHBhdC5pbkFuaW0oKVswXS5taW5hLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cGF1c2VkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZighcGxheWVyUGF1c2Upe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwYXQuYW5pbWF0ZSh7IGR1bW15OiAwIH0gLDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwYXQuaW5BbmltKClbMF0ubWluYS5yZXN1bWUoKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9LCAxMDApO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHZhciBwYXVzZSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdHBsYXllclBhdXNlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0aWYoIXBhdXNlZCl7XG5cdFx0XHRcdFx0XHRcdFx0cGF0LmluQW5pbSgpWzBdLm1pbmEucGF1c2UoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dmFyIHJlc3VtZSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdHBsYXllclBhdXNlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdGlmKCFwYXVzZWQpe1xuXHRcdFx0XHRcdFx0XHRcdHBhdC5hbmltYXRlKHsgZHVtbXk6IDAgfSAsMSk7XG5cdFx0XHRcdFx0XHRcdFx0cGF0LmluQW5pbSgpWzBdLm1pbmEucmVzdW1lKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHZhciBzdGFydCA9IHJlc3VtZTtcblx0XHRcdFx0XHRcdHNjcmlwdC5wbGF5ZXJzLmFkZFBsYXllcigkY29udCwgc3RhcnQsIHBhdXNlLCByZXN1bWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0aWYoJGNvbnQuZGF0YSgndGV4dC1lZmZlY3QnKS5pbmRleE9mKCdjdXN0b20nKSAhPT0gLTEpe1xuXHRcdFx0XHRcdHZhciBpbWdVcmwgPSAkY29udC5kYXRhKCd0ZXh0LWJnJyk7XG5cdFx0XHRcdFx0aWYoaW1nVXJsKXtcblx0XHRcdFx0XHRcdHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcblx0XHRcdFx0XHRcdGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGl3ID0gdGhpcy53aWR0aDtcblx0XHRcdFx0XHRcdFx0dmFyIGloID0gdGhpcy5oZWlnaHQ7XG5cdFx0XHRcdFx0XHRcdHZhciBkdXIgPSAzMDAwMDtcblx0XHRcdFx0XHRcdFx0dmFyIGVhc2UgPSBtaW5hLmVhc2Vpbm91dDtcblx0XHRcdFx0XHRcdFx0dmFyIHBhdCA9IHMuaW1hZ2UoaW1nVXJsLCAwLCAwLCBpdywgaWgpXG5cdFx0XHRcdFx0XHRcdFx0LnRvUGF0dGVybigwLCAwLCBpdywgaWgpXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoe3BhdHRlcm5Vbml0czogJ3VzZXJTcGFjZU9uVXNlJ30pO1xuXHRcdFx0XHRcdFx0XHRlZmZlY3QocGF0LCBzLCBzdmcpO1xuXHRcdFx0XHRcdFx0XHR2YXIgb3V0QXR0ciA9IHt4OihzdmdXIC0gaXcpLCB5OihzdmdIIC0gaWgpfTtcblx0XHRcdFx0XHRcdFx0dmFyIGluQXR0ciA9IHt4OjAsIHk6MH07XG5cdFx0XHRcdFx0XHRcdGFuaW1hdGUocGF0LCBpbkF0dHIsIG91dEF0dHIsIGR1ciwgZWFzZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpbWcuc3JjID0gaW1nVXJsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fWVsc2UgaWYoJGNvbnQuZGF0YSgndGV4dC1lZmZlY3QnKSAhPT0gJ25vJyl7XG5cdFx0XHRcdFx0dmFyIHB3ID0gMzAwO1xuXHRcdFx0XHRcdHZhciBkdXIgPSAzMDAwMDtcblx0XHRcdFx0XHR2YXIgZWFzZSA9IG1pbmEuZWFzZWlub3V0O1xuXHRcdFx0XHRcdHZhciBwaCA9ICRlbC5oZWlnaHQoKTtcblx0XHRcdFx0XHR2YXIgcjEgPSBzLnJlY3QoKS5hdHRyKHt3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogcGh9KS5hZGRDbGFzcygnZmlsbC1oaWdobGlnaHQnKTtcblx0XHRcdFx0XHR2YXIgcjIgPSBzLnJlY3QoKS5hdHRyKHt3aWR0aDogXCI5MCVcIiwgaGVpZ2h0OiBwaH0pLmFkZENsYXNzKCdmaWxsLWhlYWRpbmcnKTtcblx0XHRcdFx0XHR2YXIgcjMgPSBzLnJlY3QoKS5hdHRyKHt3aWR0aDogXCI1MCVcIiwgaGVpZ2h0OiBwaH0pLmFkZENsYXNzKCdmaWxsLWhpZ2hsaWdodCcpO1xuXHRcdFx0XHRcdHZhciByNCA9IHMucmVjdCgpLmF0dHIoe3dpZHRoOiBcIjIwJVwiLCBoZWlnaHQ6IHBofSkuYWRkQ2xhc3MoJ2ZpbGwtaGVhZGluZycpO1xuXHRcdFx0XHRcdHZhciBwYXQgPSBzLmcocjEsIHIyLCByMywgcjQpXG5cdFx0XHRcdFx0XHQudG9QYXR0ZXJuKDAsIDAsIHB3LCBwaClcblx0XHRcdFx0XHRcdC5hdHRyKHtwYXR0ZXJuVW5pdHM6ICd1c2VyU3BhY2VPblVzZScsIHByZXNlcnZlQXNwZWN0UmF0aW86ICdub25lJ30pO1xuXHRcdFx0XHRcdGlmKCRjb250LmRhdGEoJ3RleHQtZWZmZWN0JykuaW5kZXhPZignZWZmZWN0LWItJykgIT09IC0xKXtcblx0XHRcdFx0XHRcdHBhdC5hdHRyKHt0cmFuc2Zvcm06ICdyb3RhdGUoLTQ1ZGVnKSd9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWZmZWN0KHBhdCwgcywgc3ZnKTtcblx0XHRcdFx0XHR2YXIgb3V0QXR0ciA9IHt3aWR0aDogNTB9O1xuXHRcdFx0XHRcdHZhciBpbkF0dHIgPSB7d2lkdGg6IHB3fTtcblx0XHRcdFx0XHRhbmltYXRlKHBhdCwgaW5BdHRyLCBvdXRBdHRyLCBkdXIsIGVhc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0JCh3aW5kb3cpLnJlc2l6ZShvblJlc2l6ZSk7XG5cdFx0XHRvblJlc2l6ZSgpO1xuXHRcdH0pO1xuXHR9KTtcbn07XG5cbiIsIlwidXNlIHN0cmljdFwiOyB2YXIgJCA9IGpRdWVyeTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRjb250ZXh0KSB7XG5cdHZhciBpc0FuZHJvaWQgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ2FuZHJvaWQtYnJvd3NlcicpO1xuXHRpZihpc0FuZHJvaWQpe1xuXHRcdHJldHVybjtcblx0fVxuXHQkY29udGV4dC5maW5kKCcudGV4dC1maXQnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0dmFyICRjb250ID0gJCh0aGlzKTtcblx0XHQkY29udC5maW5kKCRjb250LmRhdGEoJ3RleHQtZWZmZWN0LXNlbGVjdG9yJykpLmVhY2goZnVuY3Rpb24oail7XG5cdFx0XHR2YXIgJGhlYWRlcnMgPSAkKHRoaXMpLmFkZENsYXNzKCd0ZXh0LWZpdC1zdmcgc3ZnLWVmZmVjdCcpO1xuXHRcdFx0dmFyICRsaW5rID0gJGhlYWRlcnMuZmluZCgnYScpO1xuXHRcdFx0dmFyICRlbCA9ICRsaW5rLmxlbmd0aCA+IDAgPyAkKCRsaW5rWzBdKSA6ICRoZWFkZXJzO1xuXHRcdFx0dmFyIGxpbmVzID0gW107XG5cdFx0XHQkZWwuY29udGVudHMoKS5maWx0ZXIoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gISEkLnRyaW0odGhpcy5pbm5lckhUTUwgfHwgdGhpcy5kYXRhKTtcblx0XHRcdH0pLmVhY2goZnVuY3Rpb24gKGkpIHtcblx0XHRcdFx0dmFyICRsaW5lID0gJCh0aGlzKTtcblx0XHRcdFx0bGluZXMucHVzaCgkbGluZS50ZXh0KCkpO1xuXHRcdFx0fSk7XG5cdFx0XHQkZWwuYWRkQ2xhc3MoJ25vcm1hbC1sZXR0ZXItc3BhY2luZycpO1xuXHRcdFx0dmFyIHN2Z1NpemUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInN2Z1wiKTtcblx0XHRcdFx0dmFyIHMgPSBTbmFwKHN2Zyk7XG5cdFx0XHRcdCRlbC5lbXB0eSgpLmFwcGVuZChzdmcpO1xuXHRcdFx0XHR2YXIgc3cgPSAkZWwuaW5uZXJXaWR0aCgpO1xuXHRcdFx0XHRpZihzdyA+IDM5MSl7XG5cdFx0XHRcdFx0c3cgPSAzOTE7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGZzID0gcGFyc2VGbG9hdCgkZWwuY3NzKCdmb250LXNpemUnKS5yZXBsYWNlKCdweCcsICcnKSk7XG5cdFx0XHRcdHZhciBkbGggPSAxMDtcblx0XHRcdFx0dmFyIHkgPSAwO1xuXHRcdFx0XHR2YXIgcGFkID0gMjA7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR2YXIgdGV4dCA9IHMudGV4dCgwLCAwLCBsaW5lc1tpXSk7XG5cdFx0XHRcdFx0dmFyIHR3ID0gdGV4dC5nZXRCQm94KCkud2lkdGg7XG5cdFx0XHRcdFx0dmFyIGNmcyA9IGZzICogc3cgLyB0dztcblx0XHRcdFx0XHR2YXIgY2xoID0gZGxoICsgY2ZzO1xuXHRcdFx0XHRcdHkgKz0gaSA+IDAgPyBjbGggOiAoY2ZzICsgcGFkKTtcblx0XHRcdFx0XHR0ZXh0LmF0dHIoe3g6IDAsIHk6IHksICdmb250LXNpemUnOiBjZnMgKyAncHgnfSkuYWRkQ2xhc3MoJ2ZpbGwtaGVhZGluZycpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBoZSA9IHkgKyBwYWQ7XG5cdFx0XHRcdHMuYXR0cih7d2lkdGg6IHN3LCBoZWlnaHQ6IGhlfSk7XG5cdFx0XHRcdCRlbC5oZWlnaHQoaGUpO1xuXHRcdFx0fTtcblx0XHRcdCQod2luZG93KS5yZXNpemUoc3ZnU2l6ZSk7XG5cdFx0XHRzdmdTaXplKCk7XG5cdFx0fSk7XG5cdH0pO1xufTtcblxuIiwiXCJ1c2Ugc3RyaWN0XCI7IHZhciAkID0galF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJGNvbnRleHQpIHtcblx0dmFyIHRvb2xzID0gcmVxdWlyZSgnLi4vdG9vbHMvdG9vbHMuanMnKTtcblx0dmFyIGlzQW5kcm9pZCA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnYW5kcm9pZC1icm93c2VyJyk7XG5cdGlmKGlzQW5kcm9pZCl7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdCRjb250ZXh0LmZpbmQoJy50ZXh0LWZ1bGxzY3JlZW4nKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0dmFyICRjb250ID0gJCh0aGlzKTtcblx0XHQkY29udC5maW5kKCcuZmcnKS5hZGRDbGFzcygnYmFja2dyb3VuZC10cmFuc3BhcmVudCcpO1xuXHRcdCRjb250LmZpbmQoJGNvbnQuZGF0YSgndGV4dC1lZmZlY3Qtc2VsZWN0b3InKSkuZWFjaChmdW5jdGlvbihqKXtcblx0XHRcdHZhciAkaGVhZGVycyA9ICQodGhpcykuYWRkQ2xhc3MoJ3RleHQtZnVsbHNjcmVlbi1zdmcgc3ZnLWVmZmVjdCcpO1xuXHRcdFx0dmFyICRsaW5rID0gJGhlYWRlcnMuZmluZCgnYScpO1xuXHRcdFx0dmFyICRlbCA9ICRsaW5rLmxlbmd0aCA+IDAgPyAkKCRsaW5rWzBdKSA6ICRoZWFkZXJzO1xuXHRcdFx0dmFyIGxpbmVzID0gW107XG5cdFx0XHQkZWwuY29udGVudHMoKS5maWx0ZXIoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gISEkLnRyaW0odGhpcy5pbm5lckhUTUwgfHwgdGhpcy5kYXRhKTtcblx0XHRcdH0pLmVhY2goZnVuY3Rpb24gKGkpIHtcblx0XHRcdFx0dmFyICRsaW5lID0gJCh0aGlzKTtcblx0XHRcdFx0bGluZXMucHVzaCgkbGluZS50ZXh0KCkpO1xuXHRcdFx0fSk7XG5cdFx0XHQkZWwuYWRkQ2xhc3MoJ25vcm1hbC1sZXR0ZXItc3BhY2luZycpO1xuXHRcdFx0dmFyIHN2Z1NpemUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInN2Z1wiKTtcblx0XHRcdFx0dmFyIHMgPSBTbmFwKHN2Zyk7XG5cdFx0XHRcdHMuYXR0cih7d2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJSd9KTtcblx0XHRcdFx0JGVsLmVtcHR5KCkuYXBwZW5kKHN2Zyk7XG5cdFx0XHRcdHZhciBtYXNrID0gcy5tYXNrKCkuYXR0cih7eDogMCwgeTogMCwgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJSd9KTtcblx0XHRcdFx0bWFzay50b0RlZnMoKTtcblx0XHRcdFx0dmFyIHN3ID0gTWF0aC5yb3VuZCgwLjcgKiAkKHdpbmRvdykud2lkdGgoKSk7XG5cdFx0XHRcdGlmKHN3ID4gMzkxKXtcblx0XHRcdFx0XHRzdyA9IDM5MTtcblx0XHRcdFx0fWVsc2UgaWYoc3cgPCAyMDApe1xuXHRcdFx0XHRcdHN3ID0gMjAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBmcyA9IHBhcnNlRmxvYXQoJGVsLmNzcygnZm9udC1zaXplJykucmVwbGFjZSgncHgnLCAnJykpO1xuXHRcdFx0XHR2YXIgbGggPSBwYXJzZUZsb2F0KCRlbC5jc3MoJ2xpbmUtaGVpZ2h0JykucmVwbGFjZSgncHgnLCAnJykpO1xuXHRcdFx0XHR2YXIgbGhyID0gbGgvZnM7XG5cdFx0XHRcdHZhciB5ID0gMDtcblx0XHRcdFx0dmFyIGdycCA9IG1hc2suZygpO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0dmFyIHRleHQgPSBzLnRleHQoMCwgMCwgbGluZXNbaV0pO1xuXHRcdFx0XHRcdHZhciB0dyA9IHRleHQuZ2V0QkJveCgpLndpZHRoO1xuXHRcdFx0XHRcdHZhciBjZnMgPSBmcyAqIHN3IC8gdHc7XG5cdFx0XHRcdFx0dmFyIGNsaCA9IGxociAqIGNmcztcblx0XHRcdFx0XHR5ICs9IGkgPiAwID8gY2xoIDogKGNmcyAqIDAuODUpXG5cdFx0XHRcdFx0dGV4dC5hdHRyKHt4OiAwLCB5OiB5LCAnZm9udC1zaXplJzogY2ZzICsgJ3B4J30pO1xuXHRcdFx0XHRcdGdycC5hZGQodGV4dCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGltZ1NyYyA9ICRjb250LmRhdGEoJ3RleHQtYmcnKTtcblx0XHRcdFx0dmFyIHBhdCA9IHMuZyhcblx0XHRcdFx0XHRpbWdTcmMgPyBzLmltYWdlKGltZ1NyYywgMCwgMCwgJzEwMCUnLCAnMTAwJScpLmF0dHIoe3ByZXNlcnZlQXNwZWN0UmF0aW86ICd4TWlkWU1pZCBzbGljZSd9KSA6IHMucmVjdCh7eDogMCwgeTogMCwgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIGZpbGw6ICcjZmZmZmZmJ30pXG5cdFx0XHRcdCkudG9QYXR0ZXJuKDAsIDAsICQod2luZG93KS53aWR0aCgpLCAkKHdpbmRvdykuaGVpZ2h0KCkpO1xuXHRcdFx0XHRzLnJlY3Qoe3g6IDAsIHk6IDAsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBmaWxsOiBwYXQsIHN0cm9rZTogJ25vbmUnfSkucHJlcGVuZFRvKG1hc2spO1xuXHRcdFx0XHRzLnJlY3Qoe3g6IDAsIHk6IDAsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBtYXNrOiBtYXNrLCBzdHJva2U6ICdub25lJ30pLmFkZENsYXNzKCdmaWxsLWJnJyk7XG5cdFx0XHRcdHZhciBncnB4ID0gTWF0aC5yb3VuZCgoJCh3aW5kb3cpLndpZHRoKCkgLSBzdykvMik7XG5cdFx0XHRcdHZhciBncnB5ID0gTWF0aC5yb3VuZCgoJCh3aW5kb3cpLmhlaWdodCgpIC0geSkvMik7XG5cdFx0XHRcdGdycC5hdHRyKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUoJytncnB4KycsICcrZ3JweSsnKSd9KTtcblx0XHRcdH07XG5cdFx0XHQkKHdpbmRvdykucmVzaXplKHN2Z1NpemUpO1xuXHRcdFx0c3ZnU2l6ZSgpO1xuXHRcdH0pO1xuXHR9KTtcbn07XG5cbiIsIlwidXNlIHN0cmljdFwiOyB2YXIgJCA9IGpRdWVyeTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRjb250ZXh0KSB7XG5cdHZhciB0b29scyA9IHJlcXVpcmUoJy4uL3Rvb2xzL3Rvb2xzLmpzJyk7XG5cdHZhciBpc0FuZHJvaWQgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ2FuZHJvaWQtYnJvd3NlcicpO1xuXHRpZihpc0FuZHJvaWQpe1xuXHRcdHJldHVybjtcblx0fVxuXHQkY29udGV4dC5maW5kKCcudGV4dC1tYXNrJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdHZhciAkY29udCA9ICQodGhpcyk7XG5cdFx0JGNvbnQuZmluZCgkY29udC5kYXRhKCd0ZXh0LWVmZmVjdC1zZWxlY3RvcicpKS5lYWNoKGZ1bmN0aW9uKGope1xuXHRcdFx0dmFyICRoZWFkZXJzID0gJCh0aGlzKS5hZGRDbGFzcygndGV4dC1tYXNrLXN2ZyBzdmctZWZmZWN0Jyk7XG5cdFx0XHR2YXIgJGxpbmsgPSAkaGVhZGVycy5maW5kKCdhJyk7XG5cdFx0XHR2YXIgJGVsID0gJGxpbmsubGVuZ3RoID4gMCA/ICQoJGxpbmtbMF0pIDogJGhlYWRlcnM7XG5cdFx0XHR2YXIgbGluZXMgPSBbXTtcblx0XHRcdCRlbC5jb250ZW50cygpLmZpbHRlcihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiAhISQudHJpbSh0aGlzLmlubmVySFRNTCB8fCB0aGlzLmRhdGEpO1xuXHRcdFx0fSkuZWFjaChmdW5jdGlvbiAoaSkge1xuXHRcdFx0XHR2YXIgJGxpbmUgPSAkKHRoaXMpO1xuXHRcdFx0XHRsaW5lcy5wdXNoKCRsaW5lLnRleHQoKSk7XG5cdFx0XHR9KTtcblx0XHRcdCRlbC5hZGRDbGFzcygnbm9ybWFsLWxldHRlci1zcGFjaW5nJyk7XG5cdFx0XHR2YXIgc3ZnU2l6ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpO1xuXHRcdFx0XHR2YXIgcyA9IFNuYXAoc3ZnKTtcblx0XHRcdFx0cy5hdHRyKHt3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJ30pO1xuXHRcdFx0XHQkZWwuZW1wdHkoKS5hcHBlbmQoc3ZnKTtcblx0XHRcdFx0dmFyIG1hc2sgPSBzLm1hc2soKS5hdHRyKHt4OiAwLCB5OiAwLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJ30pO1xuXHRcdFx0XHRtYXNrLnRvRGVmcygpO1xuXHRcdFx0XHR2YXIgc3cgPSBNYXRoLnJvdW5kKDAuNyAqICRlbC5pbm5lcldpZHRoKCkpO1xuXHRcdFx0XHRpZihzdyA+IDM5MSl7XG5cdFx0XHRcdFx0c3cgPSAzOTE7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGZzID0gcGFyc2VGbG9hdCgkZWwuY3NzKCdmb250LXNpemUnKS5yZXBsYWNlKCdweCcsICcnKSk7XG5cdFx0XHRcdHZhciBkbGggPSAxMDtcblx0XHRcdFx0dmFyIHBhZCA9IE1hdGgucm91bmQoc3cgKiAwLjE1KTtcblx0XHRcdFx0dmFyIHkgPSAwO1xuXHRcdFx0XHR2YXIgZ3JwID0gbWFzay5nKCk7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR2YXIgdGV4dCA9IHMudGV4dCgwLCAwLCBsaW5lc1tpXSlcblx0XHRcdFx0XHR2YXIgdHcgPSB0ZXh0LmdldEJCb3goKS53aWR0aDtcblx0XHRcdFx0XHR2YXIgY2ZzID0gZnMgKiAoc3cgLSBwYWQgLSBwYWQpIC8gdHc7XG5cdFx0XHRcdFx0dmFyIGNsaCA9IGRsaCAgKyBjZnM7XG5cdFx0XHRcdFx0eSArPSBpID4gMCA/IGNsaCA6IChjZnMgKiAwLjg1KVxuXHRcdFx0XHRcdHRleHQuYXR0cih7eDogcGFkLCB5OiB5LCAnZm9udC1zaXplJzogY2ZzICsgJ3B4J30pO1xuXHRcdFx0XHRcdGdycC5hZGQodGV4dCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGggPSB5ICsgMiAqIHBhZDtcblx0XHRcdFx0dmFyIHJhZCA9IE1hdGguZmxvb3IoaCA+IHN3ID8gaC8yIDogc3cvMik7XG5cdFx0XHRcdHZhciBkaWFtID0gMiAqIHJhZDtcblx0XHRcdFx0dmFyIGltdyA9IGRpYW07XG5cdFx0XHRcdHZhciBpbWggPSBkaWFtO1xuXHRcdFx0XHR2YXIgaW1nU3JjID0gJGNvbnQuZGF0YSgndGV4dC1iZycpO1xuXHRcdFx0XHR2YXIgcGF0ID0gcy5nKFxuXHRcdFx0XHRcdGltZ1NyYyA/IHMuaW1hZ2UoaW1nU3JjLCAwLCAwLCBpbXcsIGltaCkuYXR0cih7cHJlc2VydmVBc3BlY3RSYXRpbzogJ3hNaWRZTWlkIHNsaWNlJ30pIDogcy5yZWN0KDAsIDAsIGltdywgaW1oKS5hdHRyKHtmaWxsOiAnI2ZmZmZmZid9KVxuXHRcdFx0XHQpLnRvUGF0dGVybigwLCAwLCBpbXcsIGltaCk7XG5cdFx0XHRcdHMucmVjdCh7eDogMCwgeTogMCwgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIGZpbGw6IHBhdCwgc3Ryb2tlOiAnbm9uZSd9KS5wcmVwZW5kVG8obWFzayk7XG5cdFx0XHRcdHMuY2lyY2xlKHJhZCwgcmFkLCByYWQpLmF0dHIoe21hc2s6IG1hc2ssIHN0cm9rZTogJ25vbmUnfSlcblx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2ZpbGwtaGVhZGluZyB0ZXh0LWJveCcpO1xuXHRcdFx0XHRncnAuYXR0cih7dHJhbnNmb3JtOiAndHJhbnNsYXRlKDAsICcgKyBNYXRoLnJvdW5kKChkaWFtIC0geSkvMikgKyAnKSd9KVxuXHRcdFx0XHRzLmF0dHIoe3ZpZXdCb3g6ICcwIDAgJyArIGRpYW0gKyAnICcgKyBkaWFtLCB3aWR0aDogZGlhbSwgaGVpZ2h0OiBkaWFtfSk7XG5cdFx0XHRcdCRlbC5oZWlnaHQoZGlhbSk7XG5cdFx0XHR9O1xuXHRcdFx0JCh3aW5kb3cpLnJlc2l6ZShzdmdTaXplKTtcblx0XHRcdHN2Z1NpemUoKTtcblx0XHR9KTtcblx0fSk7XG59O1xuXG4iLCJcInVzZSBzdHJpY3RcIjsgdmFyICQgPSBqUXVlcnk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG5cdHZhciB0b29scyA9IHJlcXVpcmUoJy4uL3Rvb2xzL3Rvb2xzLmpzJyk7XG5cdHZhciAkdG9wTmF2ID0gICQoJyN0b3AtbmF2OnZpc2libGUnKTtcblx0dmFyICRzdHlsZUZpeCA9ICAkKCcjdG9wLW5hdiwgLnBhZ2UtYm9yZGVyJyk7XG5cdHZhciAkaHRtbCA9ICQoJ2h0bWwnKTtcblx0dmFyIGRlY29yQiA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnc2l0ZS1kZWNvcmF0aW9uLWInKVxuXHR2YXIgaXNUd29TdGF0ZSA9ICQoJ2JvZHknKS5oYXNDbGFzcygncGFnZS10ZW1wbGF0ZS1idWlsZGVyJylcblx0dmFyIGlzVG9wTmF2ID0gJHRvcE5hdi5sZW5ndGggPiAwO1xuXHR2YXIgdG9wTmF2U3RhdGUxVG9wID0gKGZ1bmN0aW9uKCl7XG5cdFx0aWYoaXNUb3BOYXYpe1xuXHRcdFx0cmV0dXJuIDIwO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXHR9KSgpO1xuXHR2YXIgZm9yY2VkU3RhdGUgPSBmYWxzZTtcblx0dmFyIGRvRm9yY2UgPSBmYWxzZTtcblx0dmFyIGRvVW5mb3JjZSA9IGZhbHNlO1xuXHR2YXIgZm9yY2VTcmNzID0gW107XG5cdHZhciBtZSA9IHRoaXM7XG5cdHZhciBzdGF0ZTFDb2xvcnMgPSAkdG9wTmF2LmRhdGEoJ2NvbG9ycy0yJyk7XG5cdHZhciBzdGF0ZTJDb2xvcnMgPSAkdG9wTmF2LmRhdGEoJ2NvbG9ycy0xJyk7XG5cdHRoaXMuaXNTdGF0ZTEgPSBmYWxzZTtcblx0dGhpcy5pc1N0YXRlMiA9IGZhbHNlO1xuXHR0aGlzLnN0YXRlMkggPSBpc1RvcE5hdiA/IChkZWNvckIgPyA0MCA6IDQ4KSA6IDA7XG5cdHRoaXMuc3RhdGUxVG9wID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRvcE5hdlN0YXRlMVRvcDsgfTtcblx0dGhpcy5zdGF0ZTEgPSBmdW5jdGlvbigpe1xuXHRcdCRodG1sLmFkZENsYXNzKCdvbi10b3AnKTtcblx0XHRpZihpc1R3b1N0YXRlKXtcblx0XHRcdGlmKGlzVG9wTmF2ICYmICghbWUuaXNTdGF0ZTEgfHwgZG9VbmZvcmNlKSl7XG5cdFx0XHRcdGlmKCFmb3JjZWRTdGF0ZSl7XG5cdFx0XHRcdFx0JGh0bWwucmVtb3ZlQ2xhc3MoJ3N0YXRlMicpLmFkZENsYXNzKCdzdGF0ZTEnKTtcblx0XHRcdFx0XHQkdG9wTmF2LnJlbW92ZUNsYXNzKHN0YXRlMkNvbG9ycykuYWRkQ2xhc3Moc3RhdGUxQ29sb3JzKTtcblx0XHRcdFx0XHR0b29scy5hbmRyb2lkU3R5bGVzRml4KCRzdHlsZUZpeCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIWRvRm9yY2Upe1xuXHRcdFx0XHRcdG1lLmlzU3RhdGUxID0gdHJ1ZTtcblx0XHRcdFx0XHRtZS5pc1N0YXRlMiA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fWVsc2V7XG5cdFx0XHRtZS5zdGF0ZTIodHJ1ZSk7XG5cdFx0fVxuXHR9O1xuXHR0aGlzLnN0YXRlMiA9IGZ1bmN0aW9uKHBzZXVkbyl7XG5cdFx0aWYoIXBzZXVkbyl7XG5cdFx0XHQkaHRtbC5yZW1vdmVDbGFzcygnb24tdG9wJyk7XG5cdFx0fVxuXHRcdGlmKGlzVG9wTmF2ICYmICghbWUuaXNTdGF0ZTIgfHwgZG9VbmZvcmNlKSl7XG5cdFx0XHRpZighZm9yY2VkU3RhdGUpe1xuXHRcdFx0XHQkaHRtbC5yZW1vdmVDbGFzcygnc3RhdGUxJykuYWRkQ2xhc3MoJ3N0YXRlMicpO1xuXHRcdFx0XHQkdG9wTmF2LnJlbW92ZUNsYXNzKHN0YXRlMUNvbG9ycykuYWRkQ2xhc3Moc3RhdGUyQ29sb3JzKTtcblx0XHRcdFx0dG9vbHMuYW5kcm9pZFN0eWxlc0ZpeCgkc3R5bGVGaXgpO1xuXHRcdFx0fVxuXHRcdFx0aWYoIWRvRm9yY2Upe1xuXHRcdFx0XHRtZS5pc1N0YXRlMSA9IGZhbHNlO1xuXHRcdFx0XHRtZS5pc1N0YXRlMiA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHR0aGlzLmZvcmNlU3RhdGUgPSBmdW5jdGlvbihzcmMpe1xuXHRcdGlmKGZvcmNlU3Jjcy5pbmRleE9mKHNyYykgPCAwKXtcblx0XHRcdGZvcmNlU3Jjcy5wdXNoKHNyYyk7XG5cdFx0XHRkb0ZvcmNlID0gdHJ1ZTtcblx0XHRcdG1lLnN0YXRlMigpO1xuXHRcdFx0ZG9Gb3JjZSA9IGZhbHNlO1xuXHRcdFx0Zm9yY2VkU3RhdGUgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHR0aGlzLnVuZm9yY2VTdGF0ZSA9IGZ1bmN0aW9uKHNyYyl7XG5cdFx0dmFyIGluZCA9IGZvcmNlU3Jjcy5pbmRleE9mKHNyYyk7XG5cdFx0aWYoaW5kID49IDApe1xuXHRcdFx0Zm9yY2VTcmNzLnNwbGljZShpbmQsIDEpO1xuXHRcdFx0aWYoZm9yY2VTcmNzLmxlbmd0aCA9PT0gMCl7XG5cdFx0XHRcdGZvcmNlZFN0YXRlID0gZmFsc2U7XG5cdFx0XHRcdGRvVW5mb3JjZSA9IHRydWU7XG5cdFx0XHRcdGlmKG1lLmlzU3RhdGUxKXtcblx0XHRcdFx0XHRtZS5zdGF0ZTEoKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0bWUuc3RhdGUyKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZG9VbmZvcmNlID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHZhciByZXNpemUgPSBmdW5jdGlvbigpe1xuXHRcdGlmKCQod2luZG93KS53aWR0aCgpPjc2Nyl7XG5cdFx0XHRtZS51bmZvcmNlU3RhdGUoJ3NpemUnKTtcblx0XHR9ZWxzZXtcblx0XHRcdG1lLmZvcmNlU3RhdGUoJ3NpemUnKTtcblx0XHR9XG5cdH1cblx0JCh3aW5kb3cpLnJlc2l6ZShyZXNpemUpO1xuXHRyZXNpemUoKTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7IHZhciAkID0galF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuXHR2YXIgJHZpZGVvQmdzID0gJChcIi52aWRlby1iZ1wiKTtcblx0aWYoJHZpZGVvQmdzLmxlbmd0aCA8MSl7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBpc1BsYXlWaWRlbyA9IChmdW5jdGlvbigpe1xuXHRcdHZhciBpc01vYmlsZSA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnbW9iaWxlJyk7XG5cdFx0dmFyIHY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcblx0XHR2YXIgY2FuTVA0ID0gdi5jYW5QbGF5VHlwZSA/IHYuY2FuUGxheVR5cGUoJ3ZpZGVvL21wNCcpIDogZmFsc2U7XG5cdFx0cmV0dXJuIGNhbk1QNCAmJiAhaXNNb2JpbGU7XG5cdH0pKCk7XG5cdGlmKCAhaXNQbGF5VmlkZW8gKXtcblx0XHQkdmlkZW9CZ3MuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0dmFyICR2aWRlb0JnID0gJCh0aGlzKTtcblx0XHRcdHZhciBhbHQgPSAkdmlkZW9CZy5kYXRhKCdhbHRlcm5hdGl2ZScpO1xuXHRcdFx0aWYoYWx0KXtcblx0XHRcdFx0dmFyICRpbWcgPSAkKCc8aW1nIGFsdCBjbGFzcz1cImJnXCIgc3JjPVwiJythbHQrJ1wiLz4nKTtcblx0XHRcdFx0JHZpZGVvQmcuYWZ0ZXIoJGltZykucmVtb3ZlKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdCR2aWRlb0Jncy5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0dmFyICRkaXZCZyA9ICQodGhpcyk7XG5cdFx0JGRpdkJnLmFkZENsYXNzKCdsb2FkaW5nLWZ1bmMnKS5kYXRhKCdsb2FkaW5nJywgZnVuY3Rpb24oZG9uZSl7XG5cdFx0XHR2YXIgJHZpZGVvQmcgPSAkKCc8dmlkZW8gY2xhc3M9XCJ2aWRlby1iZ1wiPjwvdmlkZW8+Jyk7XG5cdFx0XHRpZigkZGl2QmcuZGF0YSgnbXV0ZScpPT09J3llcycpICR2aWRlb0JnWzBdLm11dGVkID0gdHJ1ZTtcblx0XHRcdHZhciB2b2wgPSAkZGl2QmcuZGF0YSgndm9sdW1lJyk7XG5cdFx0XHRpZih2b2wgIT09IHVuZGVmaW5lZCkgJHZpZGVvQmdbMF0udm9sdW1lPSB2b2wvMTAwO1xuXHRcdFx0dmFyIGRvRG9uZSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciB2dyA9ICR2aWRlb0JnLndpZHRoKCk7XG5cdFx0XHRcdHZhciB2aCA9ICR2aWRlb0JnLmhlaWdodCgpO1xuXHRcdFx0XHR2YXIgdnIgPSB2dy92aDtcblx0XHRcdFx0dmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cdFx0XHRcdHZhciByZXNpemUgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciB3dyA9ICR3aW5kb3cud2lkdGgoKTtcblx0XHRcdFx0XHR2YXIgd2ggPSAkd2luZG93LmhlaWdodCgpO1xuXHRcdFx0XHRcdHZhciB3ciA9IHd3L3doO1xuXHRcdFx0XHRcdHZhciB3LCBoO1xuXHRcdFx0XHRcdGlmKHZyID4gd3Ipe1xuXHRcdFx0XHRcdFx0aCA9IE1hdGguY2VpbCh3aCk7XG5cdFx0XHRcdFx0XHR3ID0gTWF0aC5jZWlsKGggKiB2cik7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHR3ID0gTWF0aC5jZWlsKHd3KTtcblx0XHRcdFx0XHRcdGggPSBNYXRoLmNlaWwodyAvIHZyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JHZpZGVvQmcuY3NzKHtcblx0XHRcdFx0XHRcdHdpZHRoOiAgdysncHgnLFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiBoKydweCcsXG5cdFx0XHRcdFx0XHR0b3A6IE1hdGgucm91bmQoKHdoIC0gaCkvMikrJ3B4Jyxcblx0XHRcdFx0XHRcdGxlZnQ6IE1hdGgucm91bmQoKHd3IC0gdykvMikrJ3B4J1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHQkd2luZG93LnJlc2l6ZShyZXNpemUpO1xuXHRcdFx0XHRyZXNpemUoKTtcblx0XHRcdFx0JHZpZGVvQmdbMF0ucGxheSgpO1xuXHRcdFx0XHRkb25lKCk7XG5cdFx0XHR9O1xuXHRcdFx0JHZpZGVvQmcub24oJ2VuZGVkJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0dGhpcy5jdXJyZW50VGltZSA9IDA7XG5cdFx0XHRcdHRoaXMucGxheSgpO1xuXHRcdFx0XHRpZih0aGlzLmVuZGVkKSB7XG5cdFx0XHRcdFx0dGhpcy5sb2FkKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0dmFyIGlzTm90RG9uZSA9IHRydWU7XG5cdFx0XHQkdmlkZW9CZy5vbignY2FucGxheXRocm91Z2gnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZihpc05vdERvbmUpe1xuXHRcdFx0XHRcdGlzTm90RG9uZSA9IGZhbHNlO1xuXHRcdFx0XHRcdGRvRG9uZSgpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHR0aGlzLnBsYXkoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQkdmlkZW9CZy5vbignZXJyb3InLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZihpc05vdERvbmUpe1xuXHRcdFx0XHRcdGlzTm90RG9uZSA9IGZhbHNlO1xuXHRcdFx0XHRcdGRvRG9uZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdCR2aWRlb0JnWzBdLnNyYyA9ICRkaXZCZy5kYXRhKCd2aWRlbycpO1xuXHRcdFx0JHZpZGVvQmdbMF0ucHJlbG9hZD1cImF1dG9cIjtcblx0XHRcdCRkaXZCZy5hZnRlcigkdmlkZW9CZyk7XG5cdFx0XHQkZGl2QmcucmVtb3ZlKCk7XG5cdFx0fSk7XG5cdH0pO1xufTsiLCJcInVzZSBzdHJpY3RcIjsgdmFyICQgPSBqUXVlcnk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG5cdHZhciAkdmltZW9CZ3MgPSAkKFwiLnZpbWVvLWJnXCIpO1xuXHRpZigkdmltZW9CZ3MubGVuZ3RoIDwxKXtcblx0XHRyZXR1cm47XG5cdH1cblx0aWYoJCgnaHRtbCcpLmhhc0NsYXNzKCdtb2JpbGUnKSl7XG5cdFx0JHZpbWVvQmdzLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkdmltZW9CZyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgYWx0ID0gJHZpbWVvQmcuZGF0YSgnYWx0ZXJuYXRpdmUnKTtcblx0XHRcdGlmKGFsdCl7XG5cdFx0XHRcdHZhciAkaW1nID0gJCgnPGltZyBhbHQgY2xhc3M9XCJiZ1wiIHNyYz1cIicrYWx0KydcIi8+Jyk7XG5cdFx0XHRcdCR2aW1lb0JnLmFmdGVyKCRpbWcpLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgZG9uZXMgPSBbXTtcblx0JHZpbWVvQmdzLmVhY2goZnVuY3Rpb24oaSl7XG5cdFx0dmFyICR2aW1lb0JnID0gJCh0aGlzKTtcblx0XHR2YXIgZWxJZCA9ICR2aW1lb0JnLmF0dHIoJ2lkJyk7XG5cdFx0aWYoIWVsSWQpIHtcblx0XHRcdGVsSWQgPSAndmltZW8tYmctJytpO1xuXHRcdFx0JHZpbWVvQmcuYXR0cignaWQnLCBlbElkKTtcblx0XHR9XG5cdFx0JHZpbWVvQmcuYWRkQ2xhc3MoJ2xvYWRpbmctZnVuYycpLmRhdGEoJ2xvYWRpbmcnLCBmdW5jdGlvbihkb25lKXtcblx0XHRcdGRvbmVzW2VsSWRdID0gZG9uZTtcblx0XHR9KTtcblx0fSk7XG5cdCQuZ2V0U2NyaXB0KCBcImh0dHBzOi8vZi52aW1lb2Nkbi5jb20vanMvZnJvb2dhbG9vcDIubWluLmpzXCIgKVxuXHRcdC5kb25lKGZ1bmN0aW9uKCBzY3JpcHQsIHRleHRTdGF0dXMgKSB7XG5cdFx0XHQkdmltZW9CZ3MuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgJHZpbWVvQmdEaXYgPSAkKHRoaXMpO1xuXHRcdFx0XHR2YXIgaWQgPSAkdmltZW9CZ0Rpdi5hdHRyKCdpZCcpO1xuXHRcdFx0XHR2YXIgdm9sdW1lID0gKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0dmFyIHIgPSAkdmltZW9CZ0Rpdi5kYXRhKCd2b2x1bWUnKTtcblx0XHRcdFx0XHRyZXR1cm4gciA9PT0gdW5kZWZpbmVkID8gMCA6IHI7XG5cdFx0XHRcdH0pKCk7XG5cdFx0XHRcdHZhciB2aWRlb0lkID0gJHZpbWVvQmdEaXYuZGF0YSgndmlkZW8nKTtcblx0XHRcdFx0dmFyICR2aW1lb0JnID0gJCgnPGlmcmFtZSBjbGFzcz1cInZpbWVvLWJnXCIgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLycrdmlkZW9JZCsnP2FwaT0xJmJhZGdlPTAmYnlsaW5lPTAmcG9ydHJhaXQ9MCZ0aXRsZT0wJmF1dG9wYXVzZT0wJnBsYXllcl9pZD0nK2lkKycmYW1wO2xvb3A9MVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpO1xuXHRcdFx0XHQkdmltZW9CZ0Rpdi5hZnRlcigkdmltZW9CZyk7XG5cdFx0XHRcdCR2aW1lb0JnRGl2LnJlbW92ZSgpO1xuXHRcdFx0XHQkdmltZW9CZy5hdHRyKCdpZCcsIGlkKTtcblx0XHRcdFx0dmFyIHBsYXllciA9ICRmKCR2aW1lb0JnWzBdKTtcblx0XHRcdFx0cGxheWVyLmFkZEV2ZW50KCdyZWFkeScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciByZXNpemUgPSBmdW5jdGlvbih2UmF0aW8pe1xuXHRcdFx0XHRcdFx0dmFyIHdpbmRvd1cgPSAkKHdpbmRvdykud2lkdGgoKTtcblx0XHRcdFx0XHRcdHZhciB3aW5kb3dIID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuXHRcdFx0XHRcdFx0dmFyIGlGcmFtZVcgPSAkdmltZW9CZy53aWR0aCgpO1xuXHRcdFx0XHRcdFx0dmFyIGlGcmFtZUggPSAkdmltZW9CZy5oZWlnaHQoKTtcblx0XHRcdFx0XHRcdHZhciBpZlJhdGlvID0gaUZyYW1lVy9pRnJhbWVIO1xuXHRcdFx0XHRcdFx0dmFyIHdSYXRpbyA9IHdpbmRvd1cvd2luZG93SDtcblx0XHRcdFx0XHRcdHZhciBzZXRTaXplID0gZnVuY3Rpb24odncsIHZoKXtcblx0XHRcdFx0XHRcdFx0dmFyIGlmdywgaWZoO1xuXHRcdFx0XHRcdFx0XHRpZihpZlJhdGlvID4gdlJhdGlvKXtcblx0XHRcdFx0XHRcdFx0XHRpZmggPSBNYXRoLmNlaWwodmgpO1xuXHRcdFx0XHRcdFx0XHRcdGlmdyA9IE1hdGguY2VpbChpZmggKiBpZlJhdGlvKTtcblx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0aWZ3ID0gTWF0aC5jZWlsKHZ3KTtcblx0XHRcdFx0XHRcdFx0XHRpZmggPSBNYXRoLmNlaWwoaWZ3IC8gaWZSYXRpbyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0JHZpbWVvQmcuY3NzKHtcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogIGlmdysncHgnLFxuXHRcdFx0XHRcdFx0XHRcdGhlaWdodDogaWZoKydweCcsXG5cdFx0XHRcdFx0XHRcdFx0dG9wOiBNYXRoLnJvdW5kKCh3aW5kb3dIIC0gaWZoKS8yKSsncHgnLFxuXHRcdFx0XHRcdFx0XHRcdGxlZnQ6IE1hdGgucm91bmQoKHdpbmRvd1cgLSBpZncpLzIpKydweCcsXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYod1JhdGlvID4gdlJhdGlvKXtcblx0XHRcdFx0XHRcdFx0dmFyIHZ3ID0gd2luZG93Vztcblx0XHRcdFx0XHRcdFx0dmFyIHZoID0gdncvdlJhdGlvO1xuXHRcdFx0XHRcdFx0XHRzZXRTaXplKHZ3LCB2aCk7XG5cdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0dmFyIHZoID0gd2luZG93SDtcblx0XHRcdFx0XHRcdFx0dmFyIHZ3ID0gdmggKiB2UmF0aW87XG5cdFx0XHRcdFx0XHRcdHNldFNpemUodncsIHZoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHBsYXllci5hZGRFdmVudCgnZmluaXNoJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHBsYXllci5hcGkoJ3BsYXknKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2YXIgaXNOb3REb25lID0gdHJ1ZTtcblx0XHRcdFx0XHRwbGF5ZXIuYWRkRXZlbnQoJ3BsYXknLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0aWYoaXNOb3REb25lKXtcblx0XHRcdFx0XHRcdFx0aXNOb3REb25lID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdGRvbmVzW2lkXSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHBsYXllci5hcGkoJ3NldFZvbHVtZScsIHZvbHVtZSk7XG5cdFx0XHRcdFx0cGxheWVyLmFwaSgnZ2V0VmlkZW9XaWR0aCcsIGZ1bmN0aW9uICh2YWx1ZSwgcGxheWVyX2lkKSB7XG5cdFx0XHRcdFx0XHR2YXIgdyA9IHZhbHVlXG5cdFx0XHRcdFx0XHRwbGF5ZXIuYXBpKCdnZXRWaWRlb0hlaWdodCcsIGZ1bmN0aW9uICh2YWx1ZSwgcGxheWVyX2lkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBoID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdHZhciB2UmF0aW8gPSB3IC8gaDtcblx0XHRcdFx0XHRcdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpe3Jlc2l6ZSh2UmF0aW8pO30pO1xuXHRcdFx0XHRcdFx0XHRyZXNpemUodlJhdGlvKTtcblx0XHRcdFx0XHRcdFx0cGxheWVyLmFwaSgncGxheScpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSlcblx0XHQuZmFpbChmdW5jdGlvbigganF4aHIsIHNldHRpbmdzLCBleGNlcHRpb24gKSB7XG5cdFx0XHRjb25zb2xlLmxvZyggJ1RyaWdnZXJlZCBhamF4RXJyb3IgaGFuZGxlci4nICk7XG5cdFx0fSk7XG59OyIsIlwidXNlIHN0cmljdFwiOyB2YXIgJCA9IGpRdWVyeTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcblx0dmFyICR5b3V0dWJlQmdzID0gJChcIi55b3V0dWJlLWJnXCIpO1xuXHRpZigkeW91dHViZUJncy5sZW5ndGggPDEpe1xuXHRcdHJldHVybjtcblx0fVxuXHRpZigkKCdodG1sJykuaGFzQ2xhc3MoJ21vYmlsZScpKXtcblx0XHQkeW91dHViZUJncy5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgJHlvdXR1YmVCZyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgYWx0ID0gJHlvdXR1YmVCZy5kYXRhKCdhbHRlcm5hdGl2ZScpO1xuXHRcdFx0aWYoYWx0KXtcblx0XHRcdFx0dmFyICRpbWcgPSAkKCc8aW1nIGFsdCBjbGFzcz1cImJnXCIgc3JjPVwiJythbHQrJ1wiLz4nKTtcblx0XHRcdFx0JHlvdXR1YmVCZy5hZnRlcigkaW1nKS5yZW1vdmUoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIGRvbmVzID0gW107XG5cdCR5b3V0dWJlQmdzLmVhY2goZnVuY3Rpb24oaSl7XG5cdFx0dmFyICR5b3V0dWJlQmcgPSAkKHRoaXMpO1xuXHRcdHZhciBlbElkID0gJHlvdXR1YmVCZy5hdHRyKCdpZCcpO1xuXHRcdGlmKCFlbElkKSB7XG5cdFx0XHRlbElkID0gJ3lvdXR1YmUtYmctJytpO1xuXHRcdFx0JHlvdXR1YmVCZy5hdHRyKCdpZCcsIGVsSWQpO1xuXHRcdH1cblx0XHQkeW91dHViZUJnLmFkZENsYXNzKCdsb2FkaW5nLWZ1bmMnKS5kYXRhKCdsb2FkaW5nJywgZnVuY3Rpb24oZG9uZSl7XG5cdFx0XHRkb25lc1tlbElkXSA9IGRvbmU7XG5cdFx0fSk7XG5cdH0pO1xuXHR2YXIgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cdHRhZy5zcmMgPSBcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2lmcmFtZV9hcGlcIjtcblx0dmFyIGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuXHRmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0YWcsIGZpcnN0U2NyaXB0VGFnKTtcblx0d2luZG93Lm9uWW91VHViZUlmcmFtZUFQSVJlYWR5ID0gZnVuY3Rpb24oKXtcblx0XHQkeW91dHViZUJncy5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgJHlvdXR1YmVCZyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgdmlkZW9JZCA9ICR5b3V0dWJlQmcuZGF0YSgndmlkZW8nKTtcblx0XHRcdHZhciB2b2wgPSAkeW91dHViZUJnLmRhdGEoJ3ZvbHVtZScpO1xuXHRcdFx0dmFyIG11dGUgPSAkeW91dHViZUJnLmRhdGEoJ211dGUnKTtcblx0XHRcdHZhciBlbElkID0gJHlvdXR1YmVCZy5hdHRyKCdpZCcpO1xuXHRcdFx0dmFyIGlzTm90RG9uZSA9IHRydWU7XG5cdFx0XHR2YXIgcGxheWVyID0gbmV3IFlULlBsYXllcihlbElkLCB7XG5cdFx0XHRcdHZpZGVvSWQ6IHZpZGVvSWQsXG5cdFx0XHRcdHBsYXllclZhcnM6IHtodG1sNTogMSwgY29udHJvbHM6IDAsICdzaG93aW5mbyc6IDAsICdtb2Rlc3RicmFuZGluZyc6IDEsICdyZWwnOiAwLCAnYWxsb3dmdWxsc2NyZWVuJzogdHJ1ZSwgJ2l2X2xvYWRfcG9saWN5JzogMywgd21vZGU6ICd0cmFuc3BhcmVudCcgfSxcblx0XHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdFx0b25SZWFkeTogZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRcdFx0dmFyIHJlc2l6ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdHZhciAkaUZyYW1lID0gJChldmVudC50YXJnZXQuZ2V0SWZyYW1lKCkpO1xuXHRcdFx0XHRcdFx0XHR2YXIgd2luZG93VyA9ICQod2luZG93KS53aWR0aCgpO1xuXHRcdFx0XHRcdFx0XHR2YXIgd2luZG93SCA9ICQod2luZG93KS5oZWlnaHQoKTtcblx0XHRcdFx0XHRcdFx0dmFyIGlGcmFtZVcgPSAkaUZyYW1lLndpZHRoKCk7XG5cdFx0XHRcdFx0XHRcdHZhciBpRnJhbWVIID0gJGlGcmFtZS5oZWlnaHQoKTtcblx0XHRcdFx0XHRcdFx0dmFyIGlmUmF0aW8gPSBpRnJhbWVXL2lGcmFtZUg7XG5cdFx0XHRcdFx0XHRcdHZhciB3UmF0aW8gPSB3aW5kb3dXL3dpbmRvd0g7XG5cdFx0XHRcdFx0XHRcdHZhciB2UmF0aW8gPSAoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgciA9ICR5b3V0dWJlQmcuZGF0YSgncmF0aW8nKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gciA9PT0gdW5kZWZpbmVkID8gaWZSYXRpbyA6IGV2YWwocik7XG5cdFx0XHRcdFx0XHRcdH0pKCk7IFxuXHRcdFx0XHRcdFx0XHR2YXIgc2V0U2l6ZSA9IGZ1bmN0aW9uKHZ3LCB2aCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGlmdywgaWZoO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGlmUmF0aW8gPiB2UmF0aW8pe1xuXHRcdFx0XHRcdFx0XHRcdFx0aWZoID0gTWF0aC5jZWlsKHZoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmdyA9IE1hdGguY2VpbChpZmggKiBpZlJhdGlvKTtcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdGlmdyA9IE1hdGguY2VpbCh2dyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZmggPSBNYXRoLmNlaWwoaWZ3IC8gaWZSYXRpbyk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdCRpRnJhbWUuY3NzKHtcblx0XHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAgaWZ3KydweCcsXG5cdFx0XHRcdFx0XHRcdFx0XHRoZWlnaHQ6IGlmaCsncHgnLFxuXHRcdFx0XHRcdFx0XHRcdFx0dG9wOiBNYXRoLnJvdW5kKCh3aW5kb3dIIC0gaWZoKS8yKSsncHgnLFxuXHRcdFx0XHRcdFx0XHRcdFx0bGVmdDogTWF0aC5yb3VuZCgod2luZG93VyAtIGlmdykvMikrJ3B4Jyxcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZih3UmF0aW8gPiB2UmF0aW8pe1xuXHRcdFx0XHRcdFx0XHRcdHZhciB2dyA9IHdpbmRvd1c7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHZoID0gdncvdlJhdGlvO1xuXHRcdFx0XHRcdFx0XHRcdHNldFNpemUodncsIHZoKTtcblx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHZoID0gd2luZG93SDtcblx0XHRcdFx0XHRcdFx0XHR2YXIgdncgPSB2aCAqIHZSYXRpbztcblx0XHRcdFx0XHRcdFx0XHRzZXRTaXplKHZ3LCB2aCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHQkKHdpbmRvdykucmVzaXplKHJlc2l6ZSk7XG5cdFx0XHRcdFx0XHRyZXNpemUoKTtcblx0XHRcdFx0XHRcdGV2ZW50LnRhcmdldC5zZXRQbGF5YmFja1F1YWxpdHkoJ2hpZ2hyZXMnKTtcblx0XHRcdFx0XHRcdGlmKHZvbCAhPT0gdW5kZWZpbmVkKSBldmVudC50YXJnZXQuc2V0Vm9sdW1lKHZvbCk7XG5cdFx0XHRcdFx0XHRpZihtdXRlID09PSAneWVzJyB8fCBtdXRlID09PSB1bmRlZmluZWQpIGV2ZW50LnRhcmdldC5tdXRlKCk7XG5cdFx0XHRcdFx0XHRldmVudC50YXJnZXQucGxheVZpZGVvKCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRvblN0YXRlQ2hhbmdlOiBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdFx0XHRpZihpc05vdERvbmUgJiYgZXZlbnQuZGF0YSA9PT0gWVQuUGxheWVyU3RhdGUuUExBWUlORyl7XG5cdFx0XHRcdFx0XHRcdGlzTm90RG9uZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHQoZG9uZXNbZWxJZF0pKCk7XG5cdFx0XHRcdFx0XHR9ZWxzZSBpZihldmVudC5kYXRhID09PSBZVC5QbGF5ZXJTdGF0ZS5FTkRFRCl7XG5cdFx0XHRcdFx0XHRcdGV2ZW50LnRhcmdldC5wbGF5VmlkZW8oKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG9uRXJyb3I6IGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0XHRcdGlmKGlzTm90RG9uZSl7XG5cdFx0XHRcdFx0XHRcdGlzTm90RG9uZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHQoZG9uZXNbZWxJZF0pKCk7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdZb3VUdWJlIEVycm9yOiAnICsgZXZlbnQuZGF0YSArICcsIHZpZGVvIElEOiAnICsgdmlkZW9JZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcdFxuXHR9O1xufTsiXX0=
