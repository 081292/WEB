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