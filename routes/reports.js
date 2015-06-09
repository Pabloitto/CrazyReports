(function(){

	"use strict";

    var PdfController = require('../controllers/pdfController'),
    	utils = require('../utilities/utilities'),
    	router = null;

    function Reports(config){
		router = config.router;
    }

    Reports.prototype.init = function() {

        router.get('/api/getalltemplates',function(request,response){
            var pdfController = new PdfController();
            pdfController.readReportKeys(function(files){
                response.json(files);
            });
        });

    	router.post('/api/createtemplate', function(request, response){
    		var newReportKey = utils.getUniqueId(),
                reportKey = request.body.reportKey,
    			reportTemplate = request.body.htmlTemplate,
    			pdfController = new PdfController({
    				onReportTemplateCreated : function(){
                        if(!request.body.reportKey){
    					   response.end(newReportKey);
                        }
                        response.end();
    				}
    			});

    		if(reportTemplate){
    			pdfController.createHTMLTemplate({
    				reportKey : reportKey || newReportKey,
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

        router.get('/api/gettemplate', function(request, response){    
            var pdfController = new PdfController(),
                reportKey = request.query.reportKey;

            if(reportKey){
                pdfController.getTemplateText(reportKey,function(html){
                    response.json({
                        html : html.toString()
                    });
                });
            }
        });

    };

	module.exports = Reports;

}());