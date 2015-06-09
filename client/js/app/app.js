(function($){

	$.App = {};

	$.App.ScrumPoker = angular.module('ScrumPoker', ['ngRoute']);

	$.App.ScrumPoker.config(function($routeProvider){
		        $routeProvider.when('/', {
                        templateUrl : '/views/home.html',
                        controller  : 'HomeController'
                });

                $routeProvider.otherwise({
                    redirectTo: '/'
                });
	});
    
}(jQuery));