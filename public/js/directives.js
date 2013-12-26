'use strict';

// Directives. =====================================================================================
directMailer.directive('dmDetectBlur', function() {
	// This directive will detect a change in an input HTML field.
	return {
		restrict: 'C', // Restrict Classes.
    link: function (scope, element, attrs) {
    	// If element > input > onBlur
    	// Check if it is dirty
    	// If so, validate it!

    	// If all elements > input > onBlur is dirty
    	// Submist POST

    	console.log(element.find('input').$dirty);

    	// console.log(element.find('input'));
    	// console.log(attrs);
    	// element > input > on blur
    	// Form validation done at every change.
    	var inputAttrArr = [];
    	element.find('input').each( function () {
    		inputAttrArr.push($(this).attr('ng-model'));
    	});

    	console.log(inputAttrArr);
    	console.log(element.find('input').attr('ng-model'));

    	scope.$watch(inputAttrArr, function (newCollection, oldCollection, scope) {
    		// When input value changes.
    		// 1. Submit a POST? To which end point? With what Load?
    		// 2. Front-end valudation?
        console.log('value changed, new value is: ' + newCollection);
        console.log(element);
      });
    }
	};
});

// directMailer.directive('dmDetect')