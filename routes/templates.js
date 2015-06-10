(function(){

	"use strict";

    var PdfController = require('../controllers/pdfController'),
    	utils = require('../utilities/utilities'),
    	router = null;

    function Templates(config){
		router = config.router;
    }

    Templates.prototype.init = function() {

    	console.log("Init templates routes");

        router.get('/api/templates/getalltemplates',function(request,response){
            var pdfController = new PdfController();
            pdfController.readReportKeys(function(files){
                response.json(files);
            });
        });

    	router.post('/api/templates/createtemplate', function(request, response){
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


        router.get('/api/templates/gettemplate', function(request, response){    
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

	module.exports = Templates;

}());