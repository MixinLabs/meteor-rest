Package.describe({
    summary: 'REST API Framework'
});

Package.on_use(function (api) {
    
    Npm.depends({
        connect: '2.7.10',
        'url-pattern': '0.2.1'
    });
    
    api.use([
        'routepolicy',
        'webapp',
        'underscore'
    ], 'server');
    
    api.add_files([
        'lib/server/Rest.js'
    ], 'server');
    
    api.export([
        'Rest'
    ], 'server');
});