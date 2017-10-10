"use strict";
module.exports = new (function(){
	var me = this;
	this.colors = 26;
	this.colorClasses = (function(){
		var res = '';
		for(var i=0; i<me.colors; i++){
			var sep = i === 0 ? '' : ' ';
			res += sep + 'colors-'+String.fromCharCode(65+i).toLowerCase();
		}
		return res;
	})();
})();