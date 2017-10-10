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