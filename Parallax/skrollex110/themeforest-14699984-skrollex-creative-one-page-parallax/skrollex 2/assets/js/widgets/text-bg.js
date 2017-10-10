"use strict"; var $ = jQuery;
module.exports = function($context, script){
	var tools = require('../tools/tools.js');
	var isAndroid = $('html').hasClass('android-browser');
	var isNoAnimations = $('html').hasClass('no-animations');
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var isSafari = $('html').hasClass('safari');
	if(isAndroid || isNoAnimations || isPoorBrowser){
		return;
	}
	$context.find('.text-bg').each(function(i){
		var $cont = $(this);
		$cont.find($cont.data('text-effect-selector')).each(function(j){
			var $el = $(this).addClass('text-bg-svg svg-effect');
			var lines = [];
			$el.contents().filter(function() { 
				return !!$.trim( this.innerHTML || this.data ); 
			}).each(function(i){
				var $line = $(this);
				lines.push($line.text());
			});
			var onResize = function(){
				var svgW;
				var svgH;
				var effect = function(pat, s, svg) {
					s.attr({width: '100%', height: '100%'})
					var text = s.text(0, 0, lines).attr({fill:tools.snapUrl(pat)});
					$el.empty().append(svg);
					svgW = $el.width();
					var lh = parseFloat($el.css('line-height').replace('px', ''));
					var elAl = $el.css('text-align');
					text.selectAll("tspan").forEach(function(tspan, i){
						tspan.attr({dy: lh});
						if(elAl === 'right'){
							tspan.attr({x: svgW, 'text-anchor': 'end'});
						}else if(elAl === 'center'){
							tspan.attr({x: Math.round(svgW/2), 'text-anchor': 'middle'});
						}else{
							tspan.attr({x: 0, 'text-anchor': 'start'});
						}
					});
					svgH = Math.round(lines.length * lh + lh/5);
					$el.height(svgH);
					s.attr({viewBox: '0 0 '+svgW+' '+svgH});
				}
				var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				var s = Snap(svg);
				var animate = function(pat, inAttr, outAttr, dur, ease){
					var animIn = function(){
						this.animate(inAttr, dur, ease, animOut);
					}
					var animOut = function(){
						this.animate(outAttr, dur, ease, animIn);
					};

					if($cont.data('text-effect').indexOf('animated') !== -1){
						var playerPause = false;
						var paused = false;
						pat.animate(outAttr, dur, ease, animIn);
						if($cont.data('text-effect') === 'custom-animated' || isSafari){
							var timer = null;
							$(window).scroll(function(e){
								clearTimeout(timer);
								if(!paused){
									paused = true;
									if(!playerPause){
										pat.inAnim()[0].mina.pause();
									}
								}
								timer = setTimeout(function(){
									paused = false;
									if(!playerPause){
										pat.animate({ dummy: 0 } ,1);
										pat.inAnim()[0].mina.resume();
									}
								}, 100);
							});
						}
						var pause = function(){
							playerPause = true;
							if(!paused){
								pat.inAnim()[0].mina.pause();
							}
						}
						var resume = function(){
							playerPause = false;
							if(!paused){
								pat.animate({ dummy: 0 } ,1);
								pat.inAnim()[0].mina.resume();
							}
						}
						var start = resume;
						script.players.addPlayer($cont, start, pause, resume);
					}
				};
				if($cont.data('text-effect').indexOf('custom') !== -1){
					var imgUrl = $cont.data('text-bg');
					if(imgUrl){
						var img = new Image();
						img.onload = function() {
							var iw = this.width;
							var ih = this.height;
							var dur = 30000;
							var ease = mina.easeinout;
							var pat = s.image(imgUrl, 0, 0, iw, ih)
								.toPattern(0, 0, iw, ih)
								.attr({patternUnits: 'userSpaceOnUse'});
							effect(pat, s, svg);
							var outAttr = {x:(svgW - iw), y:(svgH - ih)};
							var inAttr = {x:0, y:0};
							animate(pat, inAttr, outAttr, dur, ease);
						}
						img.src = imgUrl;
					}
				}else if($cont.data('text-effect') !== 'no'){
					var pw = 300;
					var dur = 30000;
					var ease = mina.easeinout;
					var ph = $el.height();
					var r1 = s.rect().attr({width: "100%", height: ph}).addClass('fill-highlight');
					var r2 = s.rect().attr({width: "90%", height: ph}).addClass('fill-heading');
					var r3 = s.rect().attr({width: "50%", height: ph}).addClass('fill-highlight');
					var r4 = s.rect().attr({width: "20%", height: ph}).addClass('fill-heading');
					var pat = s.g(r1, r2, r3, r4)
						.toPattern(0, 0, pw, ph)
						.attr({patternUnits: 'userSpaceOnUse', preserveAspectRatio: 'none'});
					if($cont.data('text-effect').indexOf('effect-b-') !== -1){
						pat.attr({transform: 'rotate(-45deg)'});
					}
					effect(pat, s, svg);
					var outAttr = {width: 50};
					var inAttr = {width: pw};
					animate(pat, inAttr, outAttr, dur, ease);
				}
			};
			$(window).resize(onResize);
			onResize();
		});
	});
};

