// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See base-tests.js for an example of importing.
export const name = 'base';


appSchemas = {};
appCollections = {}
var gApp = {
    db: appCollections,
    query: {},
    soa: {},
    state: {},
    apptitle: {},
    enum: {}
}
App = gApp
appDeclareCollection = function (collection, schema) {
    if (appCollections[collection]) throw `Coleção já definida ${collection}`;
    var c = new Mongo.Collection(collection);
    appCollections[collection] = c;
    appSchemas[collection] = new SimpleSchema(schema);
    c.attachSchema(appSchemas[collection]);
    return c;
}
appDeclareEnum = function (name, def) {
    var e = App.enum[name] = {
        values() {
            var r = [];
            for (var d in def)
                r.push(def[d].value);
            return r;
        },
        getDef(val) {
            for (var d in def)
                if (def[d].value == val)
                    return {
                        name: d,
                        value: def[d].value,
                        text: def[d].text
                    };
        },
        getText(val) {
            for (var d in def)
                if (def[d].value == val)
                    return def[d].text;
        },
        def() {
            return def;
        }
    };
    for (var d in def) {
        e[d] = def[d].value;
        e[d + '_text'] = def[d].text;
    }
};

appDeclareQuery = function (opts) { // name, fn, debug
    if (!opts.name)
        throw new Error('appDeclareQuery.name invalido - ' + JSON.stringify(arguments));
    if (!opts.collection)
        throw new Error('appDeclareQuery.collection invalido - ' + JSON.stringify(arguments));

    var query_fn;
    if (opts.fn) {
        if (opts.server_fn || opts.client_fn)
            throw new Error('appDeclareQuery.fn invalido (2) - ' + JSON.stringify(arguments));
        query_fn = opts.fn;
    }
    else {
        if (!(opts.server_fn && opts.client_fn))
            throw new Error('appDeclareQuery.fn invalido (3) - ' + JSON.stringify(arguments));
        if (Meteor.isClient) query_fn = opts.client_fn;
        else query_fn = opts.server_fn;
    }

    var qry;
    if (opts.debug) {
        console.dir('QUERY ' + opts.name + ' declarado ');
        qry = function () {
            var cursor;
            try {
                cursor = exec.apply(this, arguments);
            }
            catch (err) {
                console.dir('QUERY ' + opts.name + '\n params => ' +
                    JSON.stringify(arguments) + '\n ERROR => ' +
                    (err.stack ? err.stack : err.message));
                throw err;
            }
            console.dir('QUERY ' + opts.name + '\n params => ' +
                JSON.stringify(arguments) + '\n fetch => ' +
                JSON.stringify(cursor && cursor.fetch && cursor.fetch(), null, 2));
            return cursor;
        };
    }
    else {
        qry = exec;
    }
    gApp.query[opts.name] = qry;
    function exec() {
        var args = arguments;
        var cursor = query_fn.apply(this, args);
        if (!cursor) cursor = { count: () => 0, fetch: () => [] };

        if (Meteor.isServer) {
            return cursor;
        }
        if (opts.sort)
            cursor = advcursor_sort(cursor, opts.sort);
        return cursor;
    }
};

appDeclareService = function (serviceName, operations) {
    if (!gApp.soa[serviceName])
        gApp.soa[serviceName] = {};
    Object.keys(operations).forEach(function (op) {
        var fn = operations[op];
        gApp.soa[serviceName][op] = function () {
            return fn.apply(this, arguments);
        };
    });
};

function advcursor_sort(originalCursor, sort) {
    return {
        count() {
            return originalCursor.count();
        },
        fetch() {
            var args = [originalCursor.fetch()].concat(sort);
            gApp.utils.sort.apply(this, args);
            return args[0];
        }
    };
}



var utils = {
    sort(array /*, ...fields */) {
        var args = arguments;
        if (args.length < 2) throw new Error('sort precisa da lista de campos');
        array.sort(function (a, b) {
            for (var i = 1; i < args.length; i++) {
                var fn = args[i];
                var decrescente = (fn[0] == '-') ? -1 : 1;
                if (decrescente === -1) fn = fn.substr(1);
                var va = utils.getPropByPath(a, fn);
                var vb = utils.getPropByPath(b, fn);
                if (typeof va === 'string') va = va.toLowerCase();
                if (typeof vb === 'string') vb = vb.toLowerCase();
                if (va instanceof Date) va = va.getTime();
                if (vb instanceof Date) vb = vb.getTime();
                if (va < vb) return -1 * decrescente;
                if (va > vb) return 1 * decrescente;
            }
            return 0;
        });
    },
    getPropByPath: function (obj, path, invoke_function, root) {
        if (!path) return obj;
        if (typeof obj === 'undefined') return;
        var i = path.indexOf('.');
        var v;
        if (i == -1) {
            v = obj[path];
            if (invoke_function !== false && typeof v === 'function')
                return v.call(root || obj);
            return v;
        }
        else {
            var prop = path.substr(0, i);
            path = path.substr(i + 1);
            v = obj[prop];
            if (invoke_function !== false && typeof v === 'function')
                v = v.call(root);
            return utils.getPropByPath(v, path, invoke_function, root || obj);
        }
    },
    cloneObj(obj) {
        if (typeof obj === 'undefined') return undefined;
        if (obj === null) return null;
        if (Array.isArray(obj))
            return obj.map(utils.cloneObj);
        if (typeof obj === 'function')
            return obj;
        if (typeof obj !== 'object')
            return obj;
        if (obj instanceof Date)
            return new Date(obj);
        var n = {};
        Object.keys(obj).forEach(function (prop) {
            n[prop] = utils.cloneObj(obj[prop]);
        });
        return n;
    },
}

gApp.utils = utils;



/* global Router */

appDeclareRoute = function (routeOptions) {
	/*  if (!routeOptions.search) {
			alert('appDeclareRoute sem search: '+JSON.stringify(routeOptions));
		}*/
	if (!routeOptions.url) alert('appDeclareRoute sem url: ' + JSON.stringify(routeOptions));
	//   if (!(routeOptions.role)) alert('appDeclareRoute sem role/pode: '+JSON.stringify(routeOptions));
	routeOptions.url = routeRoot(routeOptions.url);
	Router.route(routeOptions.url,
		{
			name: 'appRoute.' + routeOptions.url.replace(/\//g, '.'),
			layoutTemplate: typeof routeOptions.layoutTemplate === 'undefined' ? 'mainLayout' : routeOptions.layoutTemplate,
			waitOn() {
				// var self = this;
				// if (!Meteor.userId()) {
				// 	if (!(/\/criarconta/g.test(routeOptions.url) ||
				// 		/\/esqueciasenha/g.test(routeOptions.url)))
				// 		this.redirect('/login');
				// }
			},
			subscriptions() {
				if (routeOptions.subscriptions)
					routeOptions.subscriptions.call(this);
			},
			action() {
				var self = this;
				var redirect = self.redirect;
				this.redirect = function (url) {
					return redirect.call(self, routeRoot(url));
				};
				var data = routeOptions.data ? routeOptions.data.call(self) : self.data || {};
				self.data = data;
				App.state.router = {
					url: self.url,
					template: routeOptions.template,
					params: self.params || {},
					query: self.params.query || {},
					data: data || {}
				};
				// App.state.usuario = App.query.usuarioLogado(Meteor.userId()).fetch()[0];
				appDeclareRoute.doSearch = function (text) {
					if (typeof routeOptions.search === 'function')
						routeOptions.search(text);
					else if (text)
						appRoute(routeOptions.search + '/q/' + text + location.search + location.hash);
					else
						appRoute(routeOptions.search + location.search + location.hash);
				};
				var _pode = true; //routeOptions.role && pode(routeOptions.role);
				if (_pode) {
					if (typeof routeOptions.title === 'function') {
						App.apptitle.text = routeOptions.title.call(self) + ' - EasyFesta';
						App.apptitle.menu = routeOptions.title.call(self);
					}
					else if (typeof routeOptions.title === 'string') {
						App.apptitle.menu = routeOptions.title;
						App.apptitle.text = routeOptions.title + ' - EasyFesta';
					}
					else {
						App.apptitle.menu = 'EasyFesta'
						App.apptitle.text = 'EasyFesta';
					}
					if (routeOptions.action)
                        routeOptions.action.call(self);
                        debugger
					self.render(routeOptions.template, { data });
				}
				else {
					App.state.router = {
						url: self.url,
						params: {},
						query: {},
						data: {}
					};
					App.apptitle.menu = 'EasyFesta'
					App.apptitle.text = 'EasyFesta';
					appDeclareRoute.doSearch = function (text) {
						if (typeof routeOptions.search === 'function')
							routeOptions.search(text);
						else if (text)
							appRoute(routeOptions.search + '/q/' + text + location.search + location.hash);
						else
							appRoute(routeOptions.search + location.search + location.hash);
					};
					// return self.render('naopossuipermissao');
				}
			}
		});
};

appRoute = function (opts) {
	var iron_route_name, iron_opts = { query: '' };
	if (typeof opts === 'string') {
		iron_route_name = routeRoot(opts);
	}
	else {
		iron_route_name = routeRoot(opts.rota || location.pathname);

		if (opts.query) {
			var query = Router.current().params.query;
			Object.keys(opts.query).forEach(function (nome) {
				query[nome] = opts.query[nome];
			});
			var q = Object.keys(query)
				.filter((nome) => query[nome])
				.map((nome) => {
					var valor = query[nome];
					return nome + '=' + valor;
				}).join('&');
			iron_opts.query = q ? '?' + q : '';
		}
	}
	Router.go(iron_route_name + iron_opts.query);
};



function routeRoot(url) {
	return url;
}

appRoute.back = function () {
	history.back();
};

appRoute.configure = function (opts) {
	Router.configure(opts);
};

appRoute.beforeAction = function (fn) {
	Router.onBeforeAction(fn);
};

appRoute.afterAction = function (fn) {
	Router.onAfterAction(fn);
};

appRoute.redirectSite = function (url) {
	Router.go(url);
};


Handlebars.registerHelper('selected', function (key, value) {
	if ((!key && !value))
		return {
			selected: 'false'
		};
	else if (key == value)
		return {
			selected: 'selected'
		};
});