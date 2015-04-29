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

App.Views.CreateDashboardModal = Backbone.View.extend({
	tagName: 'div',
	className: 'modal fade',
	id: 'google-analytics-' + this.model.name,
	template: template('modal-template'),
	attributes: {
		'tabindex': -1,
		'role': 'dialog'
	},
	render: function() {
		// extend the model with contextual modal content for rendering.
		$.extend(this.model, {title: 'Create new dashboard', subtitle: 'Select a profile', body: 'testing', callToAction: 'Create Dashboard'});
		// disable the call to action button, since this version of the modal template should have it.
//		var $ctaButton = ('#' + this.id).find('.modal-cta');
//		$ctaButton.removeClass('hidden');
		this.$el.html(this.template(this.model.toJSON()));
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
 * UNUSED AT THIS TIME
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

/**
 * Authentication Controller
 */

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

/**
 * UI Controller
 */

App.enableAuthButtons = function() {
	
	// Add event listener to getAccount button
	$('#createAccount').on('click', function(e) {
		e.preventDefault();
		App.signin(false, App.userAuthenticated);
	});
	
	// Add event listener to logout button
	
};

App.enableNewDashButton = function() {
	$('#add-dashboard').on('click', function(e) {
		e.preventDefault();
		App.newDashboardModal();
	});
}


App.newDashboardModal = function() {
	gapi.client.analytics.management.accounts.list().execute();
}

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
			App.enableAuthButtons();
		}
	}
	
	apisToLoad = 3; // must match the number of calls to gapi.client.load()
	gapi.client.load('accountsEndpoint', 'v1', callback, apiRoot);
	// gapi.client.load('dashboardsEndpoint', 'v1', callback, apiRoot);  TODO create dashboardsEndpoint, increment apisToLoad
	gapi.client.load('oauth2', 'v2', callback);
	gapi.client.load('analytics', 'v3', callback);
}
