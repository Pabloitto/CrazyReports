(function(){
	
	"use strict";

	var ReportsService = function ($http) {
		function createReport(p,onFinish){
			$http.post('/api/reports/createreport', p, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).success(function (data, status, headers, config) {
				var reportRoute = 'api/reports/getreport?reportKey=' + p.reportKey + "&reportName=" + data;
				onFinish(reportRoute);
			});
		}

		return {
			createReport : createReport
		}

	};


	$.App.CrazyReports.factory('ReportsService', ReportsService);

}());