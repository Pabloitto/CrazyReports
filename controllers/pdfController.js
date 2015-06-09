(function() {

    "use strict";

    var $ = require('cheerio'),
        fileSystem = require("fs"),
        htmlToPdf = require('html-to-pdf'),
        htmlModelRender = require('../helpers/htmlModelRender');


    function PdfController(config) {
    	if(config){
    		this.onPdfReportCreated = config.onPdfReportCreated || this.onPdfReportCreated;
    		this.onReportTemplateCreated = config.onReportTemplateCreated || this.onReportTemplateCreated;
    	}
    }

    PdfController.prototype.onPdfReportCreated = function(){ }
    PdfController.prototype.onReportTemplateCreated = function(){ }

    PdfController.prototype.createPDFDocument = function(config) {
        var self = this,
            reportKey = getReportPath(config.reportKey),
            htmlrender = null;

        fileSystem.readFile(reportKey, function(error, html) {
            if (error) {
                throw error;
            }

            htmlrender = new htmlModelRender({
    			html : html.toString(),
    			dataSource : config.dataSource
    		});

            self.createImages(config.reportKey, htmlrender.renderProperties());
        });

    }

    PdfController.prototype.createHTMLTemplate = function(config){

    	var self = this,
    		path = getRootApiPath(config.reportKey);

    	fileSystem.mkdirSync(path);

    	fileSystem.writeFile(getReportPath(config.reportKey), config.reportTemplate, 'UTF-8', function(error) {
                if (error) {
                    throw error;
                }
                if(self.onReportTemplateCreated){
                	self.onReportTemplateCreated();
                }
                
        });
    }

    PdfController.prototype.createImages = function(reportKey, htmlDomObject) {
        var images = htmlDomObject.find('img'),
            self = this,
            count = 0,
            len = images.length;
        console.log("Images found " + len);
        if(len > 0){
	        images.each(function() {
	            var item = $(this),
	                src = item.attr('src').replace(/^data:image\/png;base64,/, ""),
	                imgName = item.data('name-image') + ".png",
	                path = getImageToSavePath(reportKey, imgName);

	            fileSystem.writeFile(path, src, 'base64', function(error) {
	                if (error) {
	                    throw error;
	                }

	                item.attr('src', getImageRelativePath(reportKey, imgName));

	                if(++count === len){
	                	self.htmlToFile(reportKey, htmlDomObject.html());
	            	}
	            });
	        });
    	}else{
    		this.htmlToFile(reportKey,htmlDomObject.html());
    	}
    }

    PdfController.prototype.htmlToFile = function(reportKey, htmlStr) {
    	var self = this,
    		fileName = getOutPutName();

        htmlToPdf.convertHTMLString(htmlStr, getOutPutPath(reportKey,fileName),
            function(error, success) {
                if (error) {
                    throw error;
                }
                
                if(self.onPdfReportCreated){
                	self.onPdfReportCreated(fileName);
                }
            }
        );
    }

    PdfController.prototype.getPDFDocument = function(config){
    	return getOutPutPath(config.reportKey , config.reportName);
    }

    //Private functions

    function getReportPath(reportKey) {
        return getRootApiPath(reportKey) + "/template.html";
    }

    function getImageRelativePath(reportKey, imageName) {
        return global.app.reportsFolderName +"/template-" + reportKey + "/" + imageName;
    }

    function getImageToSavePath(reportKey, imageName) {
        return getRootApiPath(reportKey) + "/" + imageName;
    }

    function getOutPutName(){
    	var today = new Date();
    	return 'output_' + today.getTime() + '.pdf';
    }

    function getOutPutPath(reportKey, fileName) {
        
        return getRootApiPath(reportKey) + "/" + fileName;
    }

    function getRootApiPath(reportKey) {
        return global.app.reportsPath + "/template-" + reportKey;
    }

    module.exports = PdfController;

}());
