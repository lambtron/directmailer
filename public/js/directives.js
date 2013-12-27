'use strict';

// Directives. =====================================================================================
directMailer.directive('dmStripeForm', ['$window', function($window) {
	return {
		restrict: 'C', // Class
		link: function(scope, elem, attr) {
			var form = angular.element(elem);
			form.bind('submit', function() {
				var button = form.find('button');
				button.prop('disabled', true);
				$window.Stripe.createToken(form[0], function() {
					var args = arguments;
					scope.$apply(function() {
						scope[attr.stripeForm].apply(scope, args);
					});
					button.prop('disabled', false);
				});
			});
		}
	};
}]);