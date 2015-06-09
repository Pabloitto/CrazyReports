(function(){
		
	var utils = function(){

		function getUniqueId() {
			var result = '', i, j;
	        for (j = 0; j < 32; j++) {
	            if (j == 8 || j == 12 || j == 16 || j == 20) {
	                result = result + '-';
	            }
	            i = Math.floor(Math.random() * 16).toString(16);
	            result = result + i;
	        }
	        return result;
		}

		return {
			getUniqueId : getUniqueId
		}

	}

	module.exports = utils();

}());