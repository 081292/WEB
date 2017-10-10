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