

isValidUserName = function (username) {
	var usernamePattern = /^([a-zA-Z])([a-zA-Z0-9_]{2,})*$/;
	var usernameValid = usernamePattern.test(username);
	return usernameValid;
}

isValidName = function (name) {
	var namePattern = /^[a-zA-Z ]{3,}$/;
	var nameValid = namePattern.test(name);
	return nameValid;
}

isValidEmail = function (email) {
	var emailPattern = /.+@.+\..+/i;
	return emailPattern.test(email);
}

isValidPassword = function (password) {
	return password.length >= 6 ? true: false;
}

clearLoginValidationMessages = function () {
	Session.set('loginMainErrMessage', null);
	Session.set('loginUserNameMessage', null);
	Session.set('loginPasswordMessage', null);
}

clearRegisterValidationMessages = function () {
	Session.set('registerMainErrMessage', null);
	Session.set('registerUserNameMessage', null);
	Session.set('registerFirstNameMessage', null);
	Session.set('registerLastNameMessage', null);
	Session.set('registerEmailMessage', null);
	Session.set('registerPasswordMessage', null);
	Session.set('registerConfirmPasswordMessage', null);
}

var sharedMethods = {
	onConfirmModalOk: function() { console.log('not set'); }
};

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

	/*// Check to see if account login is expired
	Router.onBeforeAction(function () {
		// var accountToken = Accounts._storedLoginToken();
		// var userId = Meteor.userId();
		Meteor.call('expiredUserCheck', null, function (error, result) {
			// window.console && console.log(Accounts._storedLoginToken());
			window.console && console.log('result', result);
			// window.console && console.log('error', error);
			// window.console && console.log('lastSessionId', Meteor.default_connection._lastSessionId);
			// window.console && console.log('connection', Meteor.connection);
			// Meteor.setInterval(function () {
			// 	window.console && console.log(Meteor.status());
			// }, 2000);
			// window.console && console.log('accountToken', accountToken, '\nuserId', userId);
			if (result) {
				Meteor.logout();
			}
		});
		this.next();
	});*/

	// Limit access to admin section
	Router.onBeforeAction(function () {
		if ( Meteor.userId() && Meteor.user() && Meteor.user().profile && Meteor.user().profile.isAdmin === true ) {
			this.next();
		} else if ( Meteor.userId() && !Meteor.user() ) {
			this.render('loading');
		} else {
			this.render('notAdminError');
		}
	}, { only: ['admin', 'admin.users'] });

	Template.mainLayout.events({
		'click .loginButton': function (event, target) {
			clearLoginValidationMessages();
		},
		'click .registerButton': function (event, target) {
			clearRegisterValidationMessages();
		},
		'click .logoutButton': function (event, target) {
			Meteor.logout(function (err) {
				Router.go('/');
			});
		},
		'click .logoutOtherClientsButton': function (event, target) {
			Meteor.logoutOtherClients(function (err) {
				window.console && console.log('logged out other clients');
			});
		},
		'click .closeNav': function (event, target) {
			$('#navbar').collapse('hide');
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

			// Validate fields here
			var passedLoginFieldValidation = function () {
				var validUserName = isValidUserName(loginUserName)
				, validPassword = isValidPassword(loginPassword);

				Session.set('loginMainErrMessage', null);

				if (!validUserName) {
					Session.set('loginUserNameMessage', 'Username is not valid!');
				} else {
					Session.set('loginUserNameMessage', null);
				}

				if (!validPassword) {
					Session.set('loginPasswordMessage', 'Password must be at least 6 characters long!');
				} else {
					Session.set('loginPasswordMessage', null);
				}

				return (validUserName && validPassword);
			};

			// If validation passes, supply the appropriate fields to the
			// Meteor.loginWithPassword() function.
			if (passedLoginFieldValidation()) {
				Meteor.loginWithPassword(loginUserName, loginPassword, function (err) {
					if (err) {
						// Login failed.
						Session.set('loginMainErrMessage', err.reason);
					} else {
						// User logged in.
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
			var registerUserName = event.target.registerUserName.value
			, registerFirstName = event.target.registerFirstName.value
			, registerLastName = event.target.registerLastName.value
			, registerEmail = event.target.registerEmail.value
			, registerPassword = event.target.registerPassword.value
			, registerConfirmPassword = event.target.registerConfirmPassword.value;

			// Validate fields here
			var passedRegistrationValidation = function () {
				var validUserName = isValidUserName(registerUserName)
				, validFirstName = isValidName(registerFirstName)
				, validLastName = isValidName(registerLastName)
				, validEmail = isValidEmail(registerEmail)
				, validPassword = isValidPassword(registerPassword)
				, passwordMatch = registerPassword === registerConfirmPassword;

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
						Session.set('registerMainErrMessage', err.reason);
					} else {
						// Success. Account has been created and logged in.
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

	Template.editUserModalTemplate.helpers({
		'selectedUser': function () {
			return Session.get('editUserData');
		},
		'editUserMainErrMsg': function () {
			return Session.get('editUserMainErrMessage');
		},
		'editUsernameMsg': function () {
			return Session.get('editUsernameMessage');
		},
		'editFirstNameMsg': function () {
			return Session.get('editFirstNameMessage');
		},
		'editLastNameMsg': function () {
			return Session.get('editLastNameMessage');
		},
		'editEmailMsg': function () {
			return Session.get('editEmailMessage');
		},
		'editPasswordMsg': function () {
			return Session.get('editPasswordMessage');
		},
		'editConfirmPasswordMsg': function () {
			return Session.get('editConfirmPasswordMessage');
		}
	});

	Template.editUserModalTemplate.events({
		'submit #editUserForm': function (event, target) {
			event.preventDefault();
			var editUsername = event.target.editUsername.value
			, editFirstName = event.target.editFirstName.value
			, editLastName = event.target.editLastName.value
			, editEmail = event.target.editEmail.value
			, editPassword = event.target.editPassword.value
			, editConfirmPassword = event.target.editConfirmPassword.value;
		}
	});

	Template.userslist.helpers({
		'usersList': function() {
			// returns the list of all users
			return Meteor.users.find();
		}
		, 'isCurrentUser': function() {
			// While going through the list of Users, if 'this' user is also the logged in user, it will return true.
			return Meteor.userId() === this._id;
		}
	});

	Template.userslist.events({
		'click .deleteUser': function (event, target) {
			event.preventDefault();
			var selectedUserId = this._id;

			Session.set('confirmModalMessage','Do you want to remove the selected user?');
			sharedMethods.onConfirmModalOk = function() {
				// console.log('remove user ok clicked');
				Meteor.call('removeUser', selectedUserId, function (error, result) {
					if (error) {
						console.log('Problem removing user account!', error);
					}
				});
			};

			$('#confirmModal').modal('show');
		}
		, 'click .editUser': function (event, target) {
			window.console && console.log('user edit click');
			event.preventDefault();
			var selectedUserId = this._id;

			// Session.set('selectedUser', selectedUser);

			Meteor.call('getUser', selectedUserId, function (error, result) {
				window.console && console.log('error', error);
				window.console && console.log('result', result);
				if (error) {
					window.console && console.log('Error', error);
				} else {
					// var selectedUser = result;
					Session.set('editUserData', result);
				}
			});

			$('#editUserModal').modal('show');
		}
	});

	// Initializes defaults for confirm modal
	var confirmModalDefaults = EJSON.clone({ onConfirmModalOk: sharedMethods.onConfirmModalOk });
	Session.set('confirmModalMessage','');

	Template.confirmModalTemplate.helpers({
		confirmMessage: function () {
			return Session.get('confirmModalMessage');
		}
	});

	Template.confirmModalTemplate.events({
		'click #confirmModalOk': function (event, target) {
			if(sharedMethods.onConfirmModalOk) {
				// Executes the function passed
				sharedMethods.onConfirmModalOk();
			}
			$('#confirmModal').modal('hide');
		}
	});

	Template.confirmModalTemplate.onRendered(function () {
		$('#confirmModal').on('hide.bs.modal', function (event) {
			// Resets confirm modal settings to defaults
			sharedMethods.onConfirmModalOk = confirmModalDefaults.onConfirmModalOk;
			Session.set('confirmModalMessage','');
		});
	});
}

// Meteor.startup(function () {
	Accounts.config({
		loginExpirationInDays: 0.02
	});
// });

if (Meteor.isServer) {
	// AccountsServer.accountsClientOrServer.config({
	// 	loginExpirationInDays: 1
	// });

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
	});

	Meteor.publish('allUserData', function () {
		if (this.userId) {
			var allUsers = Meteor.users.find({});
			return allUsers;
		}
	});

	Meteor.methods({
		createNewUser: function (options) {
			Accounts.createUser(options);
		}
		, getUser: function (userId) {
			var user;
			var userArray = Meteor.users.find({_id: userId}).fetch();
			if (userArray.length === 1) {
				user = userArray[0];
			} else {
				user = 'error';
			}
			return user;
		}
		, removeUser: function (userId) {
			Meteor.users.remove(userId);
		}
		/**
		 * was going to use for auto logout, decided to go with Accounts.config({'loginExpirationInDays : 1'})
		 * may return and finish this since the 'loginTokens' array in the users table seems to keep growing.
		 * @return {bool} was user logged out
		 */
		/*, expiredUserCheck: function() {
			var self = this;
			var isExpiredUser = false;
			// console.log('userId:\n', userId);
			// console.log('accountToken:\n', accountToken);
			// var hashToken = Accounts._hashStampedToken(accountToken);
			// var user = Meteor.users.find({ _id: userId });
			// console.log(Meteor.user());
			// console.log('self.connection.id\n\t', self.connection.id);
			var currentToken = Accounts._getLoginToken(self.connection.id);
			console.log('currentToken\n', currentToken);
			console.log('userid', Meteor.userId());
			if (Meteor.userId()){
				console.log('user logged in');
				// var lastLoginTime = Meteor.user().services;
				// console.log('\n\n lastLoginTime\n', lastLoginTime);
				// console.log('\n\n\nMeteor.user()\n', Meteor.user());
				// console.log('\n\n\nAccounts\n', Accounts);
				// console.log('\n\n\nMeteor.default_connection._lastSessionId\n', Meteor.default_connection._lastSessionId);
			} else {
				isExpiredUser = true;
				// Meteor.logout();
			}
			return isExpiredUser;
		}*/
	});

	Accounts.onCreateUser(function(options, user) {
		// user.profiles comes in as undefined so you should first take care of the options.profile first, then set 		user.profile = options.profile
		// see http://docs.meteor.com/#/full/accounts_oncreateuser

		if (options.profile) {
			// TODO: make sure only special Admins can create other Admins
			// console.log(Meteor.user()._id);
			user.profile = options.profile;
		}
		return user;
	});
}
