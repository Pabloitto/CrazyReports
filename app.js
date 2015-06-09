(function() {

    "use strict";

    global.app = {};

    var http = require('http'),
        path = require('path'),
        express = require('express'),
        router = express(),
        bodyParser = require('body-parser'),
        server = http.createServer(router),
        ReportsRouter = require('./routes/reports');

    global.app.rootPath = __dirname;


    function init(){
    	var reports = new ReportsRouter({
    		router : router
    	});
    	
		router.use(bodyParser.json());
		router.use(bodyParser.urlencoded({ extended: true }));
	    router.use(express.static(path.resolve(__dirname, 'client')));
	    reports.init();
	    startServer();
    }

   	function startServer(){
   		server.listen(process.env.PORT || 8081, process.env.IP || "127.0.0.1", function() {
	        var address = server.address();
	        console.log("Server is listening at", address.address + ":" + address.port);
	    });
   	}

    init();

}());