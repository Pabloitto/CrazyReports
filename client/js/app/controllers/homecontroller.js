(function(){

	"use strict";

	var HomeController = function($scope,ReportsService,TemplatesService){

		var initialHtml = '<div class="container">\n\n</div>';

		$scope.fileNames = [];
		$scope.htmlText = initialHtml;
		$scope.dataSourceText = '';

		function onSaveTemplate(){

			var model = getModel(),
				activeItem = findActiveItem();

			if(activeItem){
				model.reportKey = activeItem.name;
			}

			TemplatesService.saveHtmlTemplate({
				reportKey : model.reportKey,
				htmlTemplate : model.htmlTemplate
			},function(templateKey){
				if(templateKey){
					$scope.fileNames.push({
						name : templateKey,
						active : false
					});
				}
				
				if(activeItem){
					activeItem.active = false;
				}

				$scope.htmlText = initialHtml;
			});
		}


		function onCleanTemplate(){
			var activeItem = findActiveItem();
			if(activeItem) {
				activeItem.active = false;
			}
			$scope.htmlText = initialHtml;
			$scope.dataSourceText = '';
		}

		function onTestAPI(){
			var activeItem = findActiveItem(),
				dataSource = JSON.parse($scope.dataSourceText);
			if(activeItem && dataSource) {
				ReportsService.createReport({
					reportKey: activeItem.name,
					dataSource: dataSource
				}, function (data) {
					window.open(data, '_blank');
				});
			}
		}


		function onTemplateClick(fileName){
			var needLoadHtml = activeItem(fileName);
			$scope.htmlText = initialHtml;
			if(needLoadHtml === true){
				TemplatesService.loadHtmlTemplate(fileName, function(html){
					$scope.htmlText = html;
				});
			}
		}

		function activeItem(fileName){
			var fileToActive = null;

			$scope.fileNames.forEach(function(entry){
				if(entry.name === fileName){
					if(entry.active === true){
						entry.active = false;
						return;
					}
					fileToActive = entry;
				}
				entry.active = false;
			});

			if(fileToActive){
				fileToActive.active = true;
			}

			return fileToActive !== null;
		}

		function findActiveItem(){
			var fileActive = null;

			$scope.fileNames.forEach(function(entry){
				if(entry.active === true){
					fileActive = entry;
					return;
				}
			});

			return fileActive;
		}

		function bindEvents(){
			$scope.onSaveTemplate = onSaveTemplate;
			$scope.onTemplateClick = onTemplateClick;
			$scope.onCleanTemplate = onCleanTemplate;
			$scope.onTestAPI = onTestAPI;
		}

		function initScope(){
			bindEvents();
		}

		function getModel(){
			return {
				htmlTemplate : $scope.htmlText
			};
		}

		function init(){
			initScope();
			TemplatesService.loadAllTemplates(function(files){
				files.forEach(function(entry){
					$scope.fileNames.push({
						name : entry,
						active : false
					});
				});
			});
		}

		init();
	};

	$.App.CrazyReports.controller('HomeController',['$scope', 'ReportsService','TemplatesService', HomeController]);
	
}());