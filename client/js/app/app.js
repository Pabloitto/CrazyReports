(function($) {

    $.App = {};

    $.App.CrazyReports = angular.module('CrazyReports', ['ngRoute', 'ui.ace',
        'angular-google-gapi', 'ui.tinymce']);

    $.App.CrazyReports.config(function($routeProvider) {

        $routeProvider.when('/', {
            templateUrl: '/views/login.html',
            controller: 'LoginController'
        });

        $routeProvider.when('/home/', {
            templateUrl: '/views/home.html',
            controller: 'HomeController'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });
    });

    $.App.CrazyReports.run(['GAuth', 'GApi', '$state',
        function(GAuth, GApi, $state) {

            var CLIENT = '1083741151042-2t6pc9mrhu58pbc8cmbigtd2fcvbfkiu.apps.googleusercontent.com';
            var BASE = 'https://myGoogleAppEngine.appspot.com/_ah/api';

            GApi.load('myApiName', 'v1', BASE);

            GAuth.setClient(CLIENT);

            GAuth.checkAuth().then(
                function () {
                    $state.go('webapp.home'); // an example of action if it's possible to
                    // authenticate user at startup of the application
                },
                function () {
                    $state.go('login');       // an example of action if it's impossible to
                    // authenticate user at startup of the application
                }
            );
        }]);

}(jQuery));