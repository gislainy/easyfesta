Meteor.methods({
  'usuario.criarconta': function (email, password) {
      return App.soa.usuario.criarConta(email, password);
  },
  'usuario.nome': function (userId, nome) {
      return App.soa.usuario.nome(userId, nome);
  }
})