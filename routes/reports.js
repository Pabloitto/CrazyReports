(function(){

	"use strict";

    var PdfController = require('../controllers/pdfController'),
    	utils = require('../utilities/utilities'),
    	router = null;

    function Reports(config){
		router = config.router;
    }

    Reports.prototype.init = function() {

    	console.log("Init reports routes");

    	router.post('/api/reports/createreport', function(request, response){    
			var pdfController = new PdfController({
				onPdfReportCreated : function(fileName){
		        	response.end(fileName);
		        }
			});

		    pdfController.createPDFDocument({
		        reportKey: request.body.reportKey,
		        dataSource : request.body.dataSource
		    });
		    
		});

		router.get('/api/reports/getreport', function(request, response){    
			var pdfController = new PdfController(),
				file = pdfController.getPDFDocument({
		        reportKey: request.query.reportKey,
		        reportName : request.query.reportName
		    });

	  		response.download(file);
		});

    };

	module.exports = Reports;

}());