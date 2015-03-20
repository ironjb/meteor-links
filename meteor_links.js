// Router.configure({layoutTemplate: 'MainLayout'});
Router.route('/', function () { this.layout('mainLayout'); this.render('home'); });
Router.route('admin', function () { this.render('admin'); });

function isValidEmail (email) {
	var emailPattern = /.+@.+\..+/i;
	return emailPattern.test(email);
}

function isValidPassword (password) {
	return password.length >= 6 ? true: false;
}

function clearLoginValidationMessages() {
	Session.set('loginEmailMessage', null);
	Session.set('loginPasswordMessage', null);
}

if (Meteor.isClient) {
	Template.mainLayout.events({
		'click #loginButton': function (event, target) {
			clearLoginValidationMessages();
		}
	});

	Template.loginModalTemplate.helpers({
		'loginEmailMsg': function () {
			return Session.get('loginEmailMessage');
		},
		'loginPasswordMsg': function () {
			return Session.get('loginPasswordMessage');
		}
	});

	Template.loginModalTemplate.events({
		'submit #loginForm': function (event, target) {
			event.preventDefault();

			var loginEmail = event.target.loginEmail.value
			, loginPassword = event.target.loginPassword.value;
			// window.console.log && console.log(loginEmail, loginPassword);

			// Trim and validate fields here
			var passedLoginFieldValidation = function () {
				var validEmail = isValidEmail(loginEmail);
				var validPassword = isValidPassword(loginPassword);
				if (!validEmail) {
					// window.console.log && console.log('set message');
					Session.set('loginEmailMessage', 'E-mail address is not valid!');
					// return false;
				} else {
					Session.set('loginEmailMessage', null);
				}
				if (!validPassword) {
					Session.set('loginPasswordMessage', 'Password must be at least 6 characters long!');
					// return false;
				} else {
					Session.set('loginPasswordMessage', null);
				}
				// window.console.log && console.log('passedLoginFieldValidation got to true');
				return (validEmail && validPassword);
			};

			// If validation passes, supply the appropriate fields to the
			// Meteor.loginWithPassword() function.
			if (passedLoginFieldValidation()) {
				window.console.log && console.log('passedLoginFieldValidation');
				Meteor.loginWithPassword(loginEmail, loginPassword, function (err) {
					if (err) {
						// Login failed.
					} else {
						// User logged in.
					}
				});
			}
			return false;
		}
	});

	Template.registerModalTemplate.events({
		'submit #registerForm': function (event, target) {
			event.preventDefault();
			// window.console.log && console.log('event', event, 'target', target);
			// window.console.log && console.log(event.target.registerEmail.value);
			// window.console.log && console.log(event.target.registerPassword.value);
			var registerEmail = event.target.registerEmail.value
			, registerPassword = event.target.registerPassword.value
			, registerConfirmPassword = event.target.registerConfirmPassword.value;
			// window.console.log && console.log(registerEmail, registerPassword, registerConfirmPassword);

			// Trim and validate fields here
			var passedRegistrationValidation = true;

			// If validation passes, supply the appropriate fields to the
			// Accounts.createUser() function.
			if (passedRegistrationValidation) {
				Accounts.createUser({
					email: registerEmail,
					password: registerPassword
				}, function (err) {
					if (err) {
						// Inform the user that the account creation failed
					} else {
						// Success. Account has been created and logged in.
					}
				});
			}
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
