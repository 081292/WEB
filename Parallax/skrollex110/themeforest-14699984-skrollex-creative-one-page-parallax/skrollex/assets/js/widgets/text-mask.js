"use strict"; var $ = jQuery;
module.exports = function ($context) {
	var tools = require('../tools/tools.js');
	var isAndroid = $('html').hasClass('android-browser');
	if(isAndroid){
		return;
	}
	$context.find('.text-mask').each(function(){
		var $cont = $(this);
		$cont.find($cont.data('text-effect-selector')).each(function(j){
			var $headers = $(this).addClass('text-mask-svg svg-effect');
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
				var sw = Math.round(0.7 * $el.innerWidth());
				if(sw > 391){
					sw = 391;
				}
				var fs = parseFloat($el.css('font-size').replace('px', ''));
				var dlh = 10;
				var pad = Math.round(sw * 0.15);
				var y = 0;
				var grp = mask.g();
				for (var i = 0; i < lines.length; i++) {
					var text = s.text(0, 0, lines[i])
					var tw = text.getBBox().width;
					var cfs = fs * (sw - pad - pad) / tw;
					var clh = dlh  + cfs;
					y += i > 0 ? clh : (cfs * 0.85)
					text.attr({x: pad, y: y, 'font-size': cfs + 'px'});
					grp.add(text);
				}
				var h = y + 2 * pad;
				var rad = Math.floor(h > sw ? h/2 : sw/2);
				var diam = 2 * rad;
				var imw = diam;
				var imh = diam;
				var imgSrc = $cont.data('text-bg');
				var pat = s.g(
					imgSrc ? s.image(imgSrc, 0, 0, imw, imh).attr({preserveAspectRatio: 'xMidYMid slice'}) : s.rect(0, 0, imw, imh).attr({fill: '#ffffff'})
				).toPattern(0, 0, imw, imh);
				s.rect({x: 0, y: 0, width: '100%', height: '100%', fill: pat, stroke: 'none'}).prependTo(mask);
				s.circle(rad, rad, rad).attr({mask: mask, stroke: 'none'})
					.addClass('fill-heading text-box');
				grp.attr({transform: 'translate(0, ' + Math.round((diam - y)/2) + ')'})
				s.attr({viewBox: '0 0 ' + diam + ' ' + diam, width: diam, height: diam});
				$el.height(diam);
			};
			$(window).resize(svgSize);
			svgSize();
		});
	});
};

