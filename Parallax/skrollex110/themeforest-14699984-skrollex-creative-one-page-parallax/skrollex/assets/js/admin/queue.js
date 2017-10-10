"use strict"; var $ = jQuery;
module.exports = new(function(){
	var queueFuns = [];
	var queueStoped = true;
	function runQueue(){
		if(queueStoped){
			queueStoped = false;
			perform();
		}
		function perform(){
			setTimeout(function(){
				if(queueFuns.length > 0){
					var fun = queueFuns.shift();
					fun();
					perform();
				}else{
					queueStoped = true;
				}
			}, 10);
		}
	}
	this.add = function(fun){
		queueFuns.push(fun);
		runQueue();
	};
})();