(function() {

    "use strict";

    var $ = require('cheerio'),
        _ = require('underscore');

    function HtmlModelRender(config) {
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
            if (_.isArray(data) === true) {

                this.renderDataTable({
                    prop: prop,
                    data: data
                });

                this.renderRepeat({
					prop: prop,
                    data: data
                });

            } else {
                var currentElement = this.document.find("[data-model-property='" + prop + "']");
                if (currentElement) {
                    if (currentElement.hasClass('image')) {
                        currentElement.attr('src', "data:image/png;base64," + data);
                    } else {
                        currentElement.text(data.toString());
                    }
                }
            }
        }

        return this.document;
    };

    HtmlModelRender.prototype.renderRepeat = function(dataSourceObject){
    	var currentElement = this.document.find("[data-repeat='" + dataSourceObject.prop + "']"),
    		alias = currentElement.data('item-alias'),
    		html = $(currentElement).html(),
    		newHtml = '';

        dataSourceObject.data.forEach(function(entry) {
        	newHtml += html;
    		newHtml.match(/{{.*?}}/g).forEach(function(token){
                var value = "";
    			token = token.replace('{{','').replace('}}','');
                if(token && token === alias){
                    value = entry;
                }else{
                    value = entry[token];
                }
                newHtml = newHtml.replace(new RegExp("{{" + token + "}}", 'g'),value);
    		});
        });
    	
    	$(currentElement).html(newHtml);
    }

    HtmlModelRender.prototype.renderDataTable = function(dataSourceObject) {
        var currentElement = this.document.find("[data-table-source='" + dataSourceObject.prop + "']"),
            propertiesToRender = {},
            html = '',
            tbody = null;

        if (currentElement) {
            currentElement.find("thead > tr > th").each(function() {
                propertiesToRender[$(this).data("model-dsproperty")] = "";
            });

            tbody = currentElement.find("tbody");

            if (!tbody || tbody.length === 0) {
                tbody = $("<tbody></tbody>");
                currentElement.append(tbody);
            }

            dataSourceObject.data.forEach(function(entry) {
                html += '<tr>';
                for (var p in propertiesToRender) {
                    var value = entry[p];
                    html += "<td>" + value + "</td>";
                }
                html += "</tr>";
            });
            tbody.append(html);
        }
    };

    module.exports = HtmlModelRender;

}());