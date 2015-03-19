// Router.configure({layoutTemplate: 'MainLayout'});
Router.route('/', function () { this.layout('mainLayout'); this.render('home'); });
Router.route('admin', function () { this.render('admin'); });

if (Meteor.isClient) {
	Template.loginModal.events({
		'submit #loginForm': function (event, target) {
			event.preventDefault();
			// window.console.log && console.log('event', event, 'target', target);
			// window.console.log && console.log(event.target.loginEmail.value);
			// window.console.log && console.log(event.target.loginPassword.value);
			var email = event.target.loginEmail.value
			, password = event.target.loginPassword.value;

			// Trim and validate fields here

			// If validation passes, supply the appropriate fields to the
			// Meteor.loginWithPassword() function.
			Meteor.loginWithPassword(email, password, function (err) {
				if (err) {
					// Login failed.
				} else {
					// User logged in.
				}
			});
			return false;
		}
	});
	/*// counter starts at 0
	Session.setDefault('counter', 0);

	Template.home.helpers({
		counter: function () {
			return Session.get('counter');
		}
	});

	Template.home.events({
		'click button': function () {
			// increment the counter when button is clicked
			Session.set('counter', Session.get('counter') + 1);
		}
	});*/
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}
