// import { Template } from 'meteor/templating'

Template.templateLoginSistema.events({
  'click .fazerLogin': function (event, templateInstance) {
    var email = qs('#login-username').value;
    var password = qs('#login-password').value
    if (email && password) {
      Meteor.loginWithPassword(email, password, function (err) {
        7
        if (err) {
          swal('Oops...a', 'Ocorreu um erro durante o login, tente novamente.!', 'error');
        }
        else Router.go('/');
      });
    }
  },
  'submit .formLogin': function (event, templateInstance) {
    event.preventDefault();
    var email = qs('#login-username').value;
    var password = qs('#login-password').value
    if (email && password) {
      Meteor.loginWithPassword(email, password, function (err) {
        7
        if (err) {
          swal('Oops...a', 'Ocorreu um erro durante o login, tente novamente.!', 'error');
        }
        else Router.go('/');
      });
    }
  },
  'click .btnFacebook': function (event) {
    Meteor.loginWithFacebook({}, function (err, userId) {
      if (err) {
        swal('Oops...', 'Ocorreu um erro durante o login, tente novamente.!', 'error');
      }
      else {
        Meteor.call('permissao.adicionar', Meteor.userId(), ['default'], function (err) {
          if (!err) {
            Router.go('/');
          }
        });
      }
    });
  },
  'click .btnGoogle': function (event) {
    Meteor.loginWithGoogle({}, function (err, userId) {
      if (err) {
        swal('Oops...', 'Ocorreu um erro durante o login, tente novamente.!', 'error');
      }
      else {
        Meteor.call('permissao.adicionar', Meteor.userId(), ['default'], function (err) {
          if (!err) {
            Router.go('/');
          }
        });
      }
    });
  },
});

