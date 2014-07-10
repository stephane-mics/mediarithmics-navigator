require.config({
    baseUrl: "scripts",
    paths: {
        'angularAMD': '../bower_components/angularAMD/angularAMD.min',
        'ngload': '../bower_components/angularAMD/ngload.min',
        'core/configuration': '../conf/app-configuration'
    },
    shim: {
        'ngload': ['angularAMD']
    },
    deps: ['app']
});