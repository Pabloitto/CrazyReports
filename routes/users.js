(function(){

    "use strict";

    var utils = require('../utilities/utilities'),
        router = null;

    function User(config){
        router = config.router;
    }

    User.prototype.init = function() {

        console.log("Init users routes");

        router.post('/api/users/createUser', function(request, response){


        });


    };

    module.exports = User;

}());