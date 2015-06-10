/// <reference path="../../angular-route.min.js" />
/// <reference path="../../angular.min.js" />

(function () {

	var HomeService = function ($http) {

		function saveHtmlTemplate(p,onFinish) {
			$http.post('/api/createtemplate', p, {
	            headers: {
	                'Content-Type': 'application/json'
	            }
	        }).success(function (data, status, headers, config) {
	            onFinish(data);
	        });
		}

		function loadAllTemplates(onFinish){
			$http.get('/api/getalltemplates')
				 .success(function(data, status, headers, config) {
			    	onFinish(data);
			}).error(function(data, status, headers, config) {
			   	console.log(data);
			});

		}

		function loadHtmlTemplate(reportKey,onFinish){
			$http.get('/api/gettemplate', {
				params : {
					reportKey : reportKey
				}
			}).success(function(data, status, headers, config) {
			    onFinish(data.html);
			}).error(function(data, status, headers, config) {
				console.log(data);
			});
		}

		function createReport(p,onFinish){
			$http.post('/api/createreport', p, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).success(function (data, status, headers, config) {
				onFinish(data);
			});
		}

		function getReport(reportKey,reportName,onFinish){
			$http.get('/api/getreport', {
				params : {
					reportKey : reportKey,
					reportName : reportName
				}
			}).success(function(data, status, headers, config) {
				onFinish(data);
			}).error(function(data, status, headers, config) {
				console.log(data);
			});
		}

		return {
		    saveHtmlTemplate: saveHtmlTemplate,
		    loadAllTemplates : loadAllTemplates,
		    loadHtmlTemplate : loadHtmlTemplate,
			createReport : createReport,
			getReport : getReport
		}
	}

	$.App.CrazyReports.factory('HomeService', HomeService);

}());