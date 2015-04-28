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
	 * View for dashboard selector containing all dashboards a user has created.
	 * Appends to #dashboard-selector div.
	 */
	App.Views.Dashboards = Backbone.View.extend({
		tagName: 'div',
		className: 'row',
		render: function() {
			this.collection.each(function(dashboard) {
				var dashboardSelectView = new App.Views.DashboardSelect( { model: dashboard} );
				this.$el.append(dashboardSelectView.render().el);
			}, this);
			
			return this;
		}
	});
	
	
	/**
	 * View for each dashboard a user has created. Displayed in Dashboards view.
	 * Uses #dashboard-select as template.
	 */
	App.Views.DashboardSelect = Backbone.View.extend({
		tagName: 'div',
		className: 'col-md-3',
		template: template('dashboard-select'),
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
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
