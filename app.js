(function() {

    "use strict";

    global.app = {};

    var http = require('http'),
        path = require('path'),
        fileSystem = require("fs"),
        express = require('express'),
        router = express(),
        bodyParser = require('body-parser'),
        server = http.createServer(router),
        ReportsRouter = require('./routes/reports'),
        UsersRouter = require('./routes/users'),
        TemplatesRouter = require('./routes/templates');

    global.app.reportsFolderName = 'reports';
    global.app.rootPath = __dirname;
    global.app.reportsPath  = __dirname + "/" + global.app.reportsFolderName;


    function init(){

    	var reports = new ReportsRouter({
    		router : router
    	});

        var templates = new TemplatesRouter({
            router : router
        });

        var users = new UsersRouter({
            router : router
        });

        createInitialFolderForReports();
		router.use(bodyParser.json());
		router.use(bodyParser.urlencoded({ extended: true }));
	    router.use(express.static(path.resolve(__dirname, 'client')));


	    reports.init();
        templates.init();
        users.init();

	    startServer();
    }

    function createInitialFolderForReports(){
        fileSystem.exists(global.app.reportsPath,function(exists){
            if(exists === false){
                fileSystem.mkdirSync(global.app.reportsPath);
            }
        });
    }
    //asdasdasdasdasdasdas
   function startServer(){
        router.set('port', (process.env.PORT || 8081));
        router.listen(router.get('port'), function() {
          console.log('Node app is running on port', router.get('port'));
        });
   	}
    init();

}());
