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