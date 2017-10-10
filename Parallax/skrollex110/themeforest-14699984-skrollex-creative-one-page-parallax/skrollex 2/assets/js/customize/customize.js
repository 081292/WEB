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