

function isValidUserName (username) {
	var usernamePattern = /^([a-zA-Z])([a-zA-Z0-9_]{2,})*$/;
	var usernameValid = usernamePattern.test(username);
	return usernameValid;
}

function isValidName (name) {
	var namePattern = /^[a-zA-Z ]{3,}$/;
	var nameValid = namePattern.test(name);
	return nameValid;
}

function isValidEmail (email) {
	var emailPattern = /.+@.+\..+/i;
	return emailPattern.test(email);
}

function isValidPassword (password) {
	return password.length >= 6 ? true: false;
}

function clearLoginValidationMessages() {
	Session.set('loginMainErrMessage', null);
	Session.set('loginUserNameMessage', null);
	Session.set('loginPasswordMessage', null);
}

function clearRegisterValidationMessages () {
	Session.set('registerMainErrMessage', null);
	Session.set('registerUserNameMessage', null);
	Session.set('registerFirstNameMessage', null);
	Session.set('registerLastNameMessage', null);
	Session.set('registerEmailMessage', null);
	Session.set('registerPasswordMessage', null);
	Session.set('registerConfirmPasswordMessage', null);
}

if (Meteor.isClient) {
	Meteor.subscribe('allUserData');
	Router.configure({layoutTemplate: 'MainLayout'});
	Router.route('/', function () {
		/*this.layout('mainLayout');*/
		this.render('home');
	});
	Router.route('/admin', function () {
		this.render('admin');
	});
	Router.route('/admin/users', function () {
		this.render('userslist');
	});

	Router.onBeforeAction(function () {
		// console.log('Router.onBeforeAction');
		if ( Meteor.userId() && Meteor.user() && Meteor.user().profile && Meteor.user().profile.isAdmin === true ) {
			// console.log('user is admin... yay!!!');
			this.next();
		} else if ( Meteor.userId() && !Meteor.user() ) {
			// console.log('has userid, but not user');
			this.render('loading');
		} else {
			// console.log('not logged in, or not admin');
			this.render('notAdminError');
		}
	}, { only: ['admin', 'admin.users'] });

	Template.mainLayout.events({
		'click .loginButton': function (event, target) {
			clearLoginValidationMessages();
			// console.log('event', event, 'target', target);
		},
		'click .registerButton': function (event, target) {
			clearRegisterValidationMessages();
		},
		'click .logoutButton': function (event, target) {
			Meteor.logout(function (err) {
				Router.go('/');
			});
		}
	});

	Template.loginModalTemplate.helpers({
		'loginMainErrMsg': function () {
			return Session.get('loginMainErrMessage');
		},
		'loginUserNameMsg': function () {
			return Session.get('loginUserNameMessage');
		},
		'loginPasswordMsg': function () {
			return Session.get('loginPasswordMessage');
		}
	});

	Template.loginModalTemplate.events({
		'submit #loginForm': function (event, target) {
			event.preventDefault();

			var loginUserName = event.target.loginUserName.value
			, loginPassword = event.target.loginPassword.value;
			// window.console.log && console.log(loginUserName, loginPassword);

			// Validate fields here
			var passedLoginFieldValidation = function () {
				var validUserName = isValidUserName(loginUserName)
				, validPassword = isValidPassword(loginPassword);

				Session.set('loginMainErrMessage', null);

				if (!validUserName) {
					// window.console.log && console.log('set message');
					Session.set('loginUserNameMessage', 'Username is not valid!');
					// return false;
				} else {
					Session.set('loginUserNameMessage', null);
				}

				if (!validPassword) {
					Session.set('loginPasswordMessage', 'Password must be at least 6 characters long!');
					// return false;
				} else {
					Session.set('loginPasswordMessage', null);
				}

				// window.console.log && console.log('passedLoginFieldValidation got to true');
				return (validUserName && validPassword);
			};

			// If validation passes, supply the appropriate fields to the
			// Meteor.loginWithPassword() function.
			if (passedLoginFieldValidation()) {
				// window.console.log && console.log('passedLoginFieldValidation');
				Meteor.loginWithPassword(loginUserName, loginPassword, function (err) {
					if (err) {
						// Login failed.
						// console.log('login failed. Error: ', err);
						Session.set('loginMainErrMessage', err.reason);
					} else {
						// User logged in.
						// console.log('successful login');
						Session.set('loginMainErrMessage', null);
						$('#loginModal').modal('hide');

						// Clears fields once you are done.
						event.target.loginUserName.value = '';
						event.target.loginPassword.value = '';
					}
				});
			}
			return false;
		}
	});

	Template.registerModalTemplate.helpers({
		'registerMainErrMsg': function () {
			return Session.get('registerMainErrMessage');
		},
		'registerUserNameMsg': function () {
			return Session.get('registerUserNameMessage');
		},
		'registerFirstNameMsg': function () {
			return Session.get('registerFirstNameMessage');
		},
		'registerLastNameMsg': function () {
			return Session.get('registerLastNameMessage');
		},
		'registerEmailMsg': function () {
			return Session.get('registerEmailMessage');
		},
		'registerPasswordMsg': function () {
			return Session.get('registerPasswordMessage');
		},
		'registerConfirmPasswordMsg': function () {
			return Session.get('registerConfirmPasswordMessage');
		}
	});

	Template.registerModalTemplate.events({
		'submit #registerForm': function (event, target) {
			event.preventDefault();
			// window.console.log && console.log('event', event, 'target', target);
			// window.console.log && console.log(event.target.registerEmail.value);
			// window.console.log && console.log(event.target.registerPassword.value);
			var registerUserName = event.target.registerUserName.value
			, registerFirstName = event.target.registerFirstName.value
			, registerLastName = event.target.registerLastName.value
			, registerEmail = event.target.registerEmail.value
			, registerPassword = event.target.registerPassword.value
			, registerConfirmPassword = event.target.registerConfirmPassword.value;
			// window.console.log && console.log(registerUserName, registerFirstName, registerLastName, registerEmail, registerPassword, registerConfirmPassword);

			// Validate fields here
			var passedRegistrationValidation = function () {
				var validUserName = isValidUserName(registerUserName)
				, validFirstName = isValidName(registerFirstName)
				, validLastName = isValidName(registerLastName)
				, validEmail = isValidEmail(registerEmail)
				, validPassword = isValidPassword(registerPassword)
				, passwordMatch = registerPassword === registerConfirmPassword;
				// console.log('validUserName', validUserName);

				Session.set('registerMainErrMessage', null);

				if (!validUserName) {
					Session.set('registerUserNameMessage', 'Username can not have special characters!');
				} else {
					Session.set('registerUserNameMessage', null);
				}

				if (!validFirstName) {
					Session.set('registerFirstNameMessage', 'Names can only have letters and spaces!');
				} else {
					Session.set('registerFirstNameMessage', null);
				}

				if (!validLastName) {
					Session.set('registerLastNameMessage', 'Names can only have letters and spaces!');
				} else {
					Session.set('registerLastNameMessage', null);
				}

				if (!validEmail) {
					Session.set('registerEmailMessage', 'E-mail address is not valid!');
				} else {
					Session.set('registerEmailMessage', null);
				}

				if (!validPassword) {
					Session.set('registerPasswordMessage', 'Password must be at least 6 characters long!');
				} else {
					Session.set('registerPasswordMessage', null);
				}

				if (!passwordMatch) {
					Session.set('registerConfirmPasswordMessage', 'Passwords don\'t match');
				} else {
					Session.set('registerConfirmPasswordMessage', null);
				}

				return (validUserName && validFirstName && validLastName && validEmail && validPassword && passwordMatch);
			};

			// If validation passes, supply the appropriate fields to the
			// Accounts.createUser() function.
			if (passedRegistrationValidation()) {
				Meteor.call('createNewUser', {
					username: registerUserName,
					email: registerEmail,
					password: registerPassword,
					profile: {
						firstname: registerFirstName,
						lastname: registerLastName,
						isAdmin: false
					}
				}, function (err) {
					if (err) {
						// Inform the user that the account creation failed
						// console.log('registration failed Error: ', err.reason);
						Session.set('registerMainErrMessage', err.reason);
					} else {
						// Success. Account has been created and logged in.
						// console.log('yay... registration worked!');
						Session.set('registerMainErrMessage', null);
						$('#registerModal').modal('hide');

						// Clears fields once you are done
						event.target.registerUserName.value = '';
						event.target.registerFirstName.value = '';
						event.target.registerLastName.value = '';
						event.target.registerEmail.value = '';
						event.target.registerPassword.value = '';
						event.target.registerConfirmPassword.value = '';
					}
				});
			}
			return false;
		}
	});

	Template.userslist.helpers({
		'usersList': function() {
			return Meteor.users.find();
		},
		'isCurrentUser': function() {
			console.log(this._id);
			return Meteor.userId() === this._id;
		}
	});

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
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
		var userCount = Meteor.users.find().count();
		if (userCount === 0) {
			// console.log('No Users');
			Accounts.createUser({
				username: 'jbell',
				email: 'Joe.Bell@mdu.com',
				password: 'abc123',
				profile: {
					firstname: 'Joe',
					lastname: 'Bell',
					isAdmin: true,
					canUpsertAdminAccount: true
				}
			});
		}
		// console.log('Meteor.user.find().count() =', Meteor.users.find().count());
	});

	// Meteor.publish('userDataT', function () {
	// 	if (this.userId) {
	// 		var thisUser = Meteor.users.find(
	// 				{ _id: this.userId }
	// 				, { fields: { username: 1, profile: 1 } }
	// 			);
	// 		// console.log(thisUser.fetch());
	// 		return thisUser;
	// 	} else {
	// 		this.ready();
	// 	}
	// });

	Meteor.publish('allUserData', function () {
		if (this.userId) {
			var allUsers = Meteor.users.find({});
			// console.log(allUsers);
			return allUsers;
		}
	});

	Meteor.methods({
		createNewUser: function (options) {
			Accounts.createUser(options);
		}
		// , isCurrentUserAdmin: function() {
		// 	if (Meteor.userId()) {
		// 		var isAdmin = Meteor.user().profile.isAdmin;
		// 		console.log('isAdmin', isAdmin);
		// 		return isAdmin;
		// 	}
		// 	return false;
		// }
	});

	Accounts.onCreateUser(function(options, user) {
		// console.log('options profile', options.profile);
		// console.log('user profile', user.profile);

		// user.profiles comes in as undefined so you should first take care of the options.profile first, then set 		user.profile = options.profile
		// see http://docs.meteor.com/#/full/accounts_oncreateuser

		// if (options.profile && user.profile.isAdmin) {
		// 	user.profile.isAdmin = options.profile.isAdmin;
		// } else {
		// 	user.profile.isAdmin = false;
		// }

		if (options.profile) {
			// TODO: make sure only special Admins can create other Admins
			console.log(Meteor.user);
			user.profile = options.profile;
		}
		return user;
	});
}
