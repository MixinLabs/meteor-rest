var connect         = Npm.require('connect');
var Fiber           = Npm.require('fibers');
var newPattern      = Npm.require('url-pattern');
var connectHandlers = WebApp.connectHandlers;

Rest = {
    routes: {}
};

Rest.route = function (method, path, callback) {
    var pattern = newPattern(path);
    
    method = method.toLowerCase();
    
    this.routes[method] = this.routes[method] || [];
    this.routes[method].push({
        method: method,
        route: path,
        pattern: pattern,
        handler: callback
    });
};

Rest.get    = _.bind(Rest.route, Rest, 'get');
Rest.post   = _.bind(Rest.route, Rest, 'post');
Rest.delete = _.bind(Rest.route, Rest, 'delete');
Rest.put    = _.bind(Rest.route, Rest, 'put');


Meteor.startup(function () {
    connectHandlers
        .use(connect.query())
        .use(connect.bodyParser())
        .use(connect.json());

    if (Rest.auth) {
        connectHandlers.use(connect.basicAuth(function (username, password, fn) {
            Fiber(function () {
                var result = Rest.auth(username, password);
                fn(null, result);
            }).run();
        }));
    }

    connectHandlers
        .use(function (req, res, next) {
            Fiber(function () {
                var url            = req.url,
                    method         = req.method.toLowerCase(),
                    requestHandled = false,
                    target         = Rest.routes[method] || [],
                    targetLength   = targetLength.length,
                    jsonRes,
                    route,
                    params,
                    i;
                
                for(i = 0; i < targetLength; i++) {
                    
                    route = target[i];
                    params = route.pattern.match(url);
                    
                    if (! params) {
                        continue;
                    }
                    requestHandled = true;
                
                    jsonRes = route.handler(params, req);
                
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(jsonRes));
                    break;
                }
            
                if (! requestHandled) {
                    next();
                }
            }).run();
        });
});
