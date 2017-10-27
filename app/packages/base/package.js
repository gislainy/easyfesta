Package.describe({
  name: 'gislainycrisostomo:base',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.5.2.2');
  api.use('ecmascript');
  api.use('ui');
  api.use('aldeed:collection2');
  api.use('mongo');
  api.use('iron:router');
  api.use('accounts-ui');
  api.use('accounts-password');
  api.use('accounts-facebook');
  api.use('accounts-google');
  api.use('reywood:publish-composite');
  api.mainModule('base.js');
  api.addFiles ('visual/jquery.js', 'client'); 
  api.addFiles ('visual/tether.js', 'client'); 
  api.addFiles ('visual/tether.css', 'client'); 
  api.addFiles ('visual/bootstrap.css', 'client'); 
  api.addFiles ('visual/bootstrap.js', 'client'); 
  api.export([
    'App',
    'appDeclareCollection',
    'appCollections',
    'appDeclareService',
    'appDeclareRoute',
    'declareRules',
    'appRoute',
    'appDeclareEnum'
  ])
});

Package.onTest(function (api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('gislainycrisostomo:base');
  api.mainModule('base-tests.js');
});
