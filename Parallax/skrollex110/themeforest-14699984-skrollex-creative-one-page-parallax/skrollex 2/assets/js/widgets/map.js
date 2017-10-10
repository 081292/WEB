"use strict"; var $ = jQuery;
module.exports = function($context){
	var OverlayWindow = require('./overlay-window.js');
	if(typeof(google) == "undefined") return;
	$context.find('.map-open').each(function(){
		var $mapOpen = $(this);
		var $overlay = $($mapOpen.data('map-overlay')).clone().appendTo('body');
		$overlay.find('.overlay-view').append($mapOpen.parent().find('.map-canvas').clone());
		var $mapCanvas = $overlay.find('.map-canvas');
		var mapOptions = {
			center: new google.maps.LatLng($mapCanvas.data('latitude'), $mapCanvas.data('longitude')),
			zoom: $mapCanvas.data('zoom'),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		var markers = [];
		$mapCanvas.find('.map-marker').each(function(){
			var $marker = $(this);
			markers.push({
				latitude: $marker.data('latitude'),
				longitude: $marker.data('longitude'),
				text: $marker.data('text')
			});
		});
		$mapCanvas.addClass('close-map').wrap('<div class="map-view"></div>');
		var $mapView = $mapCanvas.parent();
		var overlayWindow = new OverlayWindow($overlay, false, false, function(){
			new TWEEN.Tween({autoAlpha: 1})
					.to({autoAlpha: 0}, 500)
					.onUpdate(function(){
						$mapView.css({opacity: this.autoAlpha, visibility: (this.autoAlpha > 0 ? 'visible' : 'hidden')});
					})
					.easing(TWEEN.Easing.Linear.None)
					.start();
		});
		var isInited = false;
		$mapOpen.click(function(event) {
			event.preventDefault();
			overlayWindow.show(false, function() {
				var $oc = $overlay.find('.overlay-control');
				var $ov = $overlay.find('.overlay-view');
				$mapView.css({height: ($(window).height() - $oc.height() - parseInt($ov.css('bottom').replace('px','')) ) + 'px'});
				$mapView.css({opacity: 1, visibility: 'visible'});
				if (!isInited) {
					isInited = true;
					var map = new google.maps.Map($mapCanvas[0], mapOptions);
					var addListener = function(marker, text) {
						var infowindow = new google.maps.InfoWindow({
							content: text
						});
						google.maps.event.addListener(marker, "click", function() {
							infowindow.open(map, marker);
						});
					}
					for (var i = 0; i < markers.length; i++) {
						var marker = new google.maps.Marker({
							map: map,
							position: new google.maps.LatLng(markers[i].latitude, markers[i].longitude)
						});
						var text = markers[i].text;
						if (text) {
							addListener(marker, text);
						}
					}
				}
			});
			return false;
		});
	});
}