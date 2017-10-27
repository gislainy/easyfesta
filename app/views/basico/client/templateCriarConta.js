Template.templateCriarConta.events({
  'click .criarUmaConta': function (event, template) {
    const nome = qs("#register-username").value;
    const email = qs("#register-email").value;
    const password = qs("#register-passowrd").value;
    if (nome && email && password) {
      Meteor.call('usuario.criarconta', email, password, function (err, userId) {
        if (!err) {
          Meteor.loginWithPassword(email, password, function (err) {
            // Meteor.call('permissao.adicionar', Meteor.userId(), ['default'], function (err) {
            //   if (!err) {
                Meteor.call('usuario.nome', Meteor.userId(), nome, function (err) {
                  if (!err) {
                    Router.go('/');
                  }
                });
            //   }
            // });
          });
        } else {
          if (err.reason === 'Email already exists.')
            swal('Oops...', 'Esse e-mail já foi cadastrado. Caso não lembre a essa, acesse a opção de lembrar senha!', 'error');
        }
      })
    }
  }
});