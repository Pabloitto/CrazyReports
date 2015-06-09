(function(){

	var HomeController = function($scope,HomeService){

		var initialHtml = '<!DOCTYPE html>\n<html>\n\n</html>';

		$scope.fileNames = [];
		$scope.aceText = initialHtml;

		function aceLoaded(_editor){
			HomeService.loadAllTemplates(function(files){
				files.forEach(function(entry){
					$scope.fileNames.push({
						name : entry,
						active : false
					});
				});
			});
		}

		function aceChanged(e){}

		function onSaveTemplate(){

			var model = getModel(),
				activeItem = findActiveItem();

			if(activeItem){
				model.reportKey = activeItem.name;
			}

			HomeService.saveHtmlTemplate({
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

				$scope.aceText = initialHtml;
			});
		}


		function onCleanTemplate(){
			$scope.aceText = initialHtml;
		}


		function onTemplateClick(fileName){
			var needLoadHtml = activeItem(fileName);
			$scope.aceText = initialHtml;
			if(needLoadHtml === true){
				HomeService.loadHtmlTemplate(fileName, function(html){
					$scope.aceText = html;
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
			$scope.aceChanged = aceChanged;
			$scope.aceLoaded = aceLoaded;
			$scope.onSaveTemplate = onSaveTemplate;
			$scope.onTemplateClick = onTemplateClick;
			$scope.onCleanTemplate = onCleanTemplate;
		}

		function initScope(){
			bindEvents();
		}

		function getModel(){
			return {
				htmlTemplate : $scope.aceText
			};
		}

		function init(){
			initScope();
		}

		init();
	};

	$.App.CrazyReports.controller('HomeController',['$scope', 'HomeService', HomeController]);
	
}());