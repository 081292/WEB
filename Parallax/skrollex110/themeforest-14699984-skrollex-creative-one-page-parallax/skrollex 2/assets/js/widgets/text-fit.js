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

