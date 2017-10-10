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