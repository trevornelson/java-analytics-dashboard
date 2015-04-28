/**
 * @fileoverview
 * Provides methods for connecting the app's frontend to the endpoints API.
 * 
 * @author trevor.nelson1@gmail.com (Trevor Nelson)
 * Based off of the hello-endpoints-archectype.
 */

/**
 * Initialize the app namespace on pageload
 */
(function() {
	window.App = {
		Models: {},
		Collections: {},
		Views: {}
	};
	
	/**
	 * function for returning a template underscore object.
	 */
	window.template = function(id) {
		return _.template( $('#' + id).html() );
	};
});
