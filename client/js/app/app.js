(function($) {

    $.App = {};

    $.App.CrazyReports = angular.module('CrazyReports', ['ngRoute', 'ui.ace', 'ui.tinymce']);

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

}(jQuery));