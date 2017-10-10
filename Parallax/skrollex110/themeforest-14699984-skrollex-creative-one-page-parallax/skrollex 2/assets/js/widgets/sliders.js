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