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
	
	/**
	 * Account MVC
	 */
	App.Models.Account = Backbone.Model.extend({
		defaults: {
			id: '',
			username: '',
			email: '',
			dashboards: []
		}
	});
	
	
	/**
	 * Dashboard MVC
	 */
	App.Models.Dashboard = Backbone.Model.extend({
		defaults: {
			widgets: []
		}
	});
	
	App.Collections.Dasboard = Backbone.Collection.extend({
		model: App.Models.Dashboard
	});
	
	/**
	 * Widget MVC
	 */
	App.Models.Widget = Backbone.Model.extend({
		defaults: {
			title: ''
		}
	});
	
	App.Collections.Widget = Backbone.Collection.extend({
		model: App.Models.Widget
	});
});
