"use strict"; var $ = jQuery;
$(function() { new (function(){
		var Widget = require('./admin/widget.js');
		var editor = require('./admin/editor.js');
		var queue = require('./admin/queue.js');
		var $redirect = $('.redirect');
		if($redirect.length > 0){
			var url = $redirect.data('url');
			if(url){
				window.location = url;
				return;
			}
		}
		new Widget();
		editor.initAll(queue);
})();});