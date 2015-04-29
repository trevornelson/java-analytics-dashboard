/**
 * @fileoverview
 * Provides methods for connecting the app's frontend to the endpoints API.
 * 
 * @author trevor.nelson1@gmail.com (Trevor Nelson)
 * Based off of the hello-endpoints-archectype.
 */

var App = {
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

App.Views.AccountPage = Backbone.View.extend({
	tagName: 'div',
	className: 'panel panel-default',
	template: template('account-view'),
	render: function() {
		var jsonModel = this.model.toJSON();
		this.$el.html(this.template(jsonModel));
		return this;
	}
});

/**
 * Dashboard MVC
 */
App.Models.Dashboard = Backbone.Model.extend({
	defaults: {
		name: 'New Dashboard',
		widgets: []
	}
});

App.Collections.Dashboard = Backbone.Collection.extend({
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

App.loggedIn = false;

App.credentials = {
		CLIENT_ID: "99492469869-a8phf2icj5576p0a1or8v25djbqlb32k.apps.googleusercontent.com",
		SCOPES: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/analytics.readonly"
}

App.signin = function(mode, callback) {
	  gapi.auth.authorize({client_id: App.credentials.CLIENT_ID,
	      scope: App.credentials.SCOPES, immediate: mode},
	      callback);
};

App.userAuthenticated = function() {
  var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
    if (!resp.code) {
      App.loggedIn = true;
      App.createAccount();
    }
  });
};

App.enableButtons = function() {
	
	// Add event listener to getAccount button
	$('#createAccount').on('click', function(e) {
		e.preventDefault();
		App.signin(false, App.userAuthenticated);
	});
	
	// Add event listener to logout button
	
};


/**
 * App endpoint method calls
 */
App.createAccount = function() {
	gapi.client.accountsEndpoint.createAccount().execute(
		function(resp) {
			if (!resp.code) {
				App.currentAccount = new App.Models.Account({id: resp.id,
															username: resp.username,
															email: resp.email,
															dashboards: [{name: 'Client Dashboard'}, {name: 'Client2 Dashboard'}]
				});
				
				var accountView = new App.Views.AccountPage({model: App.currentAccount});
				$('#main-content').append(accountView.render().el);
			} else {
				window.alert(resp.message);
			}
		}
	);
}


/**
 * Loads OAuth and Dashboard APIs and triggers login when they have completed.
 */
App.init = function(apiRoot) {
	var apisToLoad;
	var callback = function() {
		if (--apisToLoad == 0) {
			console.log('APIs loaded');
			App.enableButtons();
		}
	}
	
	apisToLoad = 2; // must match the number of calls to gapi.client.load()
	gapi.client.load('accountsEndpoint', 'v1', callback, apiRoot);
	// gapi.client.load('dashboardsEndpoint', 'v1', callback, apiRoot);  TODO create dashboardsEndpoint, increment apisToLoad
	gapi.client.load('oauth2', 'v2', callback);
}
