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

App.Models.AnalyticsResource = Backbone.Model.extend({
	defaults: {
		id: ''
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
	id: 'create-dashboard-modal',
	template: template('create-dashboard-template'),
	attributes: {
		'tabindex': -1,
		'role': 'dialog'
	},
	render: function() {
		var accountList = new App.Views.AnalyticsResources({collection: this.collection});
		this.$el.html(this.template);
		this.$el.find('#ga-accounts').append(accountList.render().el);
		return this;
	}
});

App.Views.AnalyticsResources = Backbone.View.extend({
	tagName: 'ul',
	className: 'list-group',
	template: template('ga-account-resources'),
	render: function() {
		for(i = 0; i < this.collection.length; i++) {
			this.$el.append(this.template(this.collection[i]));
		}
		return this;
	}
});



/**
 * Widget MVC
 */
App.Models.Widget = Backbone.Model.extend({
	initialize: function(args) {		
		this.profileId = args.profileId;
		this.startDate = args.startDate;
		this.endDate = args.endDate;
		this.metrics = args.metrics;
		this.dimensions = args.dimensions;
		this.constructQuery();
		this.executeQuery();
	},
	setStartDate: function(dateObject) {
		this.startDate = dateObject.toISOString().slice(0,10).replace(/-/g, "");
	},
	setEndDate: function(dateObject) {
		this.endDate = dateObject.toISOString().slice(0,10).replace(/-/g, "");
	},
	constructQuery: function() {
		this.query = gapi.client.analytics.data.ga.get({
		    'ids': 'ga:' + this.profileId,
		    'start-date': this.startDate,
		    'end-date': this.endDate,
		    'metrics': this.metrics,
		    'dimensions': this.dimensions
		});
	},
	executeQuery: function() {
		this.query.execute($.proxy(function(resp) {
			if (!resp.error) {
				this.queryResponse = resp.result;
				this.trigger('refreshData');
			} else {
				alert('Oops, there was an error: ' + results.message);
			}
		}, this));
	}
});

App.Collections.Widget = Backbone.Collection.extend({
	model: App.Models.Widget
});

App.Views.Widgets = Backbone.View.extend({
	initialize: function() {
		// bind add and remove functions to the view
		_(this).bindAll('add', 'remove');
		
		// array of widget views to keep track of them
		this.widgetViews = [];
		
		// add each widget in the collection to the view
		this.collection.each(this.add);
		
		// bind the view to the add and remove events of the collection
		this.collection.bind('add', this.add);
		this.collection.bind('remove', this.remove);
	},
	tagName: 'div',
	id: 'widgets-container',
	className: 'row',
	add: function(widget) {
		var widgetView = new App.Views.Widget({
			model: widget
		});
		
		this.widgetViews.push(widgetView);

		if (this.rendered) {
			$(this.el).append(widgetView.render().el);
		}
	},
	remove: function(widget) {
		var viewToRemove = _(this.widgetViews).select(function(wv) {return wv.model === widget;})[0];
		this.widgetViews = _(this.widgetViews).without(viewToRemove);
		
		if (this.rendered) $(viewToRemove.el).remove();
	},
	render: function() {
		this.rendered = true;

		$(this.el).empty();
		
		_(this.widgetViews).each(function(widgetView) {
			this.$el.append(widgetView.render().el);
		});
			
		return this;
	}
});

App.Views.Widget = Backbone.View.extend({
	initialize: function() {
		// bind the view to the model's refreshData event
		this.model.bind('refreshData', this.renderChart)
	},
	tagName: 'div',
	className: 'col-md-6',
	template: template('widget-template'),
	renderChart: function() {
		var resp = this.model.get('queryResponse');
		console.log(resp);
		var data = [];
		_.each(resp.rows, function(index, row) {data.push(row[1])});
		console.log(data);
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

/**
 * Dashboard MVC
 */

App.Models.Dashboard = Backbone.Model.extend({
	defaults: {
		widgets: new App.Collections.Widget()
	},
	addWidget: function(widget) {
		this.widgets.add(widget);
	}
});

App.Views.DashboardEdit = Backbone.View.extend({
	tagName: 'div',
	id: 'edit-dashboard-view',
	className: 'well well-lg',
	template: template('edit-dashboard'),
	events: {
		'click #new-widget-submit': 'createWidget'
	},
	createWidget: function(e) {
		e.preventDefault();
		var title = this.$el.find('#new-widget-title').val();
		var dimensions = this.$el.find('#new-widget-dimensions').val();
		var metrics = this.$el.find('#new-widget-metrics').val();
		var filters = this.$el.find('#new-widget-filters').val();
		var startDate = this.$el.find('#new-widget-start').val();
		var endDate = this.$el.find('#new-widget-end').val();
		var profileId = this.model.get('profileId')
		
		newWidget = new App.Models.Widget({
			title: title,
			profileId: profileId,
			dimensions: dimensions,
			metrics: metrics,
			filters: filters,
			startDate: startDate,
			endDate: endDate
		});
		
		this.model.get("widgets").add(newWidget);
	},
	render: function() {
		var modelJSON = this.model.toJSON();
		this.$el.html(this.template(modelJSON));
		
		var widgetsView = new App.Views.Widgets({collection: this.model.get("widgets")});
		this.$el.append(widgetsView.render().el);

		return this;
	}
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
		App.queryAccounts(App.newDashboardModal);
	});
}


App.newDashboardModal = function(resp) {
	var dashboardModal = new App.Views.CreateDashboardModal({collection: resp.items});
	$('#main-content').append(dashboardModal.render().el);
	$('#create-dashboard-modal').modal({handleUpdate: true});
	App.enableAnalyticsSelectors();
}

App.enableAnalyticsSelectors = function() {
	$('#ga-accounts').on('click', '.ga-resource', function(e) {
		e.preventDefault();
		var accountId = $(this).data('id');
		$('#new-dashboard-account').val(accountId);
		App.queryProperties(accountId, function(resp) {
			var analyticsProperties = new App.Views.AnalyticsResources({collection: resp.items});
			$('#ga-properties').append(analyticsProperties.render().el);
		});
	});
	
	$('#ga-properties').on('click', '.ga-resource', function(e) {
		e.preventDefault();
		var accountId = $('#new-dashboard-account').val();
		var propertyId = $(this).data('id');
		$('#new-dashboard-property').val(propertyId);
		App.queryProfiles(accountId, propertyId, function(resp) {
			var analyticsProfiles = new App.Views.AnalyticsResources({collection: resp.items});
			$('#ga-profiles').append(analyticsProfiles.render().el);
		});
	});
	
	$('#ga-profiles').on('click', '.ga-resource', function(e) {
		e.preventDefault();
		var profileId = $(this).data('id');
		$('#new-dashboard-profile').val(profileId);
	});
	
	$('#create-dashboard-modal').on('hidden.bs.modal', function(e) {
		this.remove();
	});
	
	$('#new-dashboard-submit').on('click', function(e) {
		e.preventDefault();
		var title = $('#new-dashboard-title').val();
		var accountId = $('#new-dashboard-account').val();
		var propertyId = $('#new-dashboard-property').val();
		var profileId = $('#new-dashboard-profile').val();
		
		newDashboard = new App.Models.Dashboard({
			title: title,
			accountId: accountId,
			propertyId: propertyId,
			profileId: profileId
		});
		
		// hide the modal after extracting the form inputs, because the modal is destroyed on hide.
		$('#create-dashboard-modal').modal('hide');
		
		var dashboardEditView = new App.Views.DashboardEdit({model: newDashboard});
		$('#account-view-body').html(dashboardEditView.render().el);
		// App.enableNewWidgetSubmit(newDashboard); // adds event listener for new widget button in newly created dashboard
	});
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
				App.enableNewDashButton();
			} else {
				window.alert(resp.message);
			}
		}
	);
}

// Google Analytics API call to query all accounts
App.queryAccounts = function(callback) {
	gapi.client.analytics.management.accounts.list().execute(callback);
}

App.queryProperties = function(accountId, callback) {
	gapi.client.analytics.management.webproperties.list({
	    'accountId': accountId
	  }).execute(callback);
}

App.queryProfiles = function(accountId, propertyId, callback) {
	gapi.client.analytics.management.profiles.list({
		'accountId': accountId,
		'webPropertyId': propertyId
	}).execute(callback);
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
	gapi.client.load('oauth2', 'v2', callback);
	gapi.client.load('analytics', 'v3', callback);
}
