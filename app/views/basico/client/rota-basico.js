

appDeclareRoute({
  url: '/criarconta',
  search: '/',
  role: 'default',
  template: 'templateCriarConta',  
  layoutTemplate: 'emptyLayout',  
  title() {
      return 'Criar uma conta';
  }
});
