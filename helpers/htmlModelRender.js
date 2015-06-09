(function(){
	
	"use strict";

	var $ = require('cheerio'),
	    _ = require('underscore');

	function HtmlModelRender(config){
		this.html = config.html || "";
		this.dataSource = config.dataSource || {};
		this.document = $(this.html);
	}

	HtmlModelRender.prototype.html = "";
	HtmlModelRender.prototype.document = null;
	HtmlModelRender.prototype.dataSource = {};

	HtmlModelRender.prototype.renderProperties = function() {
		for (var prop in this.dataSource) {
			var data = this.dataSource[prop];
			if(_.isArray(data) === true){
				this.renderDataTable({
					prop : prop,
					data : data
				});
			}else{
				var currentElement = this.document.find("[data-model-property='"+prop+"']");
				if(currentElement){
					if(currentElement.hasClass('image')){
						currentElement.attr('src',"data:image/png;base64," + data);
					}else{
						currentElement.text(data);
					}
				}
			}
		}

		return this.document;
	};

	HtmlModelRender.prototype.renderDataTable = function(dataSourceObject){
		var currentElement = this.document.find("[data-table-source='"+dataSourceObject.prop+"']"),
			propertiesToRender = {},
			html = '',
			tbody = null;

		if(currentElement){
			currentElement.find("thead > tr > th").each(function(){
				propertiesToRender[$(this).data("model-dsproperty")] = "";
			});

			tbody = currentElement.find("tbody");

			dataSourceObject.data.forEach(function(entry){
				html += '<tr>';
				for(var p in propertiesToRender){
					var value = entry[p];
					html+="<td>"+value+"</td>";
				}
				html+="</tr>";
			});
			tbody.append(html);
		}
	};

	module.exports = HtmlModelRender;

}());