// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See template-tests.js for an example of importing.
export const name = 'template';


appDeclareRoute({
    url: '/',
    search: '/',
    role: 'default',
    template: 'hello',
    layoutTemplate: 'mainLayoutSistema',
    title() {
        debugger
        return 'Home';
    }
});

import tether from 'tether';
global.Tether = tether;