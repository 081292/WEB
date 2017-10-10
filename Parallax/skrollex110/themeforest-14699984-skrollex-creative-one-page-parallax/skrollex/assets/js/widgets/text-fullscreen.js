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

