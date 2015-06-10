(function(){
	
	"use strict";

	var TemplatesService = function ($http) {

		function saveHtmlTemplate(p,onFinish) {
			$http.post('/api/templates/createtemplate', p, {
	            headers: {
	                'Content-Type': 'application/json'
	            }
	        }).success(function (data, status, headers, config) {
	            onFinish(data);
	        });
		}

		function loadAllTemplates(onFinish){
			$http.get('/api/templates/getalltemplates')
				 .success(function(data, status, headers, config) {
			    	onFinish(data);
			}).error(function(data, status, headers, config) {
			   	console.log(data);
			});

		}

		function loadHtmlTemplate(reportKey,onFinish){
			$http.get('/api/templates/gettemplate', {
				params : {
					reportKey : reportKey
				}
			}).success(function(data, status, headers, config) {
			    onFinish(data.html);
			}).error(function(data, status, headers, config) {
				console.log(data);
			});
		}

		return {
			saveHtmlTemplate: saveHtmlTemplate,
		    loadAllTemplates : loadAllTemplates,
		    loadHtmlTemplate : loadHtmlTemplate
		}

	};


	$.App.CrazyReports.factory('TemplatesService', TemplatesService);

}());