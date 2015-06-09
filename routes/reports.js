(function(){

    var PdfController = require('../controllers/pdfController'),
    	utils = require('../utilities/utilities')
    	router = null;

    function Reports(config){
		router = config.router;
    }

    Reports.prototype.init = function() {

    	router.post('/api/createtemplate', function(request, response){
    		var newReportKey = utils.getUniqueId(),
    			reportTemplate = request.body.htmlTemplate,
    			pdfController = new PdfController({
    				onReportTemplateCreated : function(){
    					response.end(newReportKey);
    				}
    			});

    		if(reportTemplate){
    			pdfController.createHTMLTemplate({
    				reportKey : newReportKey,
    				reportTemplate : reportTemplate
    			});
    		}

    	});

    	router.post('/api/createreport', function(request, response){    
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

		router.get('/api/getreport', function(request, response){    
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