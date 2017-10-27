appDeclareService('usuario', {
  criarConta: function (email, password) {
    return Accounts.createUser({
      email: email,
      password: password
    });
  },
  nome: function (usuarioId, nome) {
    Meteor.users.update({
      _id: usuarioId
    }, {
        $set: {
          'profile.name': nome
        }
      })
  }
})


