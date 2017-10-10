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