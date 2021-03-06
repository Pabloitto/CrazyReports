(function() {

    "use strict";

    var HomeController = function($scope, ReportsService, TemplatesService) {

        var initialHtml = '<div class="container">\n\n</div>';

        $scope.fileNames = [];
        $scope.htmlText = initialHtml;
        $scope.dataSourceText = '';
        $scope.htmlEditorConfig = {};
        $scope.tinymceModel = '';


        $scope.yourModel = {
            customMenu : [
                ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
                ['font'],
                ['font-size'],
                ['font-color', 'hilite-color'],
                ['remove-format'],
                ['ordered-list', 'unordered-list', 'outdent', 'indent'],
                ['left-justify', 'center-justify', 'right-justify'],
                ['code', 'quote', 'paragraph'],
                ['link', 'image']
            ]
        };


        function onSaveTemplate() {

            var model = getModel(),
                activeItem = findActiveItem();

            if (activeItem) {
                model.reportKey = activeItem.name;
            }

            TemplatesService.saveHtmlTemplate({
                reportKey: model.reportKey,
                htmlTemplate: model.htmlTemplate
            }, function(templateKey) {
                if (templateKey) {
                    $scope.fileNames.push({
                        name: templateKey,
                        active: false
                    });
                }

                if (activeItem) {
                    activeItem.active = false;
                }

                $scope.htmlText = initialHtml;
            });
        }


        function onCleanTemplate() {
            var activeItem = findActiveItem();
            if (activeItem) {
                activeItem.active = false;
            }
            $scope.htmlText = initialHtml;
            $scope.dataSourceText = '';
        }

        function onTestAPI() {
            var activeItem = findActiveItem(),
                dataSource = JSON.parse($scope.dataSourceText);
            if (activeItem && dataSource) {
                ReportsService.createReport({
                    reportKey: activeItem.name,
                    dataSource: dataSource
                }, function(data) {
                    window.open(data, '_blank');
                });
            }
        }


        function onTemplateClick(fileName) {
            var needLoadHtml = activeItem(fileName);
            $scope.htmlText = initialHtml;
            if (needLoadHtml === true) {
                TemplatesService.loadHtmlTemplate(fileName, function(html) {
                    $scope.htmlText = html;
                });
            }
        }

        function activeItem(fileName) {
            var fileToActive = null;

            $scope.fileNames.forEach(function(entry) {
                if (entry.name === fileName) {
                    if (entry.active === true) {
                        entry.active = false;
                        return;
                    }
                    fileToActive = entry;
                }
                entry.active = false;
            });

            if (fileToActive) {
                fileToActive.active = true;
            }

            return fileToActive !== null;
        }

        function findActiveItem() {
            var fileActive = null;

            $scope.fileNames.forEach(function(entry) {
                if (entry.active === true) {
                    fileActive = entry;
                    return;
                }
            });

            return fileActive;
        }

        function onHtmlTextChange() {
            $scope.tinymceModel = $scope.htmlText;
            buildDataSourceTemplate();
        }

        function buildDataSourceTemplate (argument) {
            var domDocument = $($scope.htmlText),
                inlineDataSource = {};

            domDocument.find("[data-model-property]").each(function(){
                inlineDataSource[$(this).data('model-property')] = '';
            });

            domDocument.find("[data-repeat]").each(function(){
                inlineDataSource[$(this).data('repeat')] = [];
            });

            domDocument.find("[data-table-source]").each(function(){
                var arrayDs = [];

                $(this).find("[data-model-dsproperty]").each(function(index, element){
                    var itemDs = {};
                    itemDs[$(element).data('model-dsproperty')] = '';
                    arrayDs.push(itemDs);
                });

                inlineDataSource[$(this).data('table-source')] = arrayDs;
            });

            $scope.dataSourceText = js_beautify(JSON.stringify(inlineDataSource));
        }

        function bindEvents() {
            $scope.onSaveTemplate = onSaveTemplate;
            $scope.onTemplateClick = onTemplateClick;
            $scope.onCleanTemplate = onCleanTemplate;
            $scope.onTestAPI = onTestAPI;
            $scope.onHtmlTextChange = onHtmlTextChange;
        }

        function initScope() {
            bindEvents();
        }

        function initHtmlEditor() {
            $scope.htmlEditorConfig = {
                setup: function(editor) {
                    editor.on('change', function(e) {
                        onChangeEditor(editor, e);
                    });
                },
                inline: false,
                height: 400,
                plugins: 'image table',
                skin: 'lightgray',
                theme: 'modern',
                file_browser_callback: function(field_name, url, type, win) {
                }
            };
        }

        function onChangeEditor(editor, e) {
            var html = '',
                content = editor.getContent(),
                domDocument = $($scope.htmlText);

            domDocument.empty().append(content);

            html = domDocument.html();

            if (domDocument.find('div.container').length === 0) {
                html = "<div class='container'>" + html + "</div>";
            }
            if (!$scope.$$phase) {
                $scope.$apply(function() {
                    var output = html_beautify(html);
                    $scope.htmlText = output;
                });
            }
        }

        function getModel() {
            return {
                htmlTemplate: $scope.htmlText
            };
        }

        function init() {
            initScope();
            initHtmlEditor();
            TemplatesService.loadAllTemplates(function(files) {
                files.forEach(function(entry) {
                    $scope.fileNames.push({
                        name: entry,
                        active: false
                    });
                });
            });
        }

        init();
    };

    $.App.CrazyReports.controller('HomeController', ['$scope', 'ReportsService', 'TemplatesService', HomeController]);

}());