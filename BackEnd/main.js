$(function(){
    checkLog();
    let defaultRoute = 'users'
    let routes = {
        'users': {
            url: '#/users',
            templateUrl: '/webapp/BackEnd/views/users.html'
        },
        'community': {
            url: '#/community',
            templateUrl: '/webapp/BackEnd/views/community.html'
        },
        'commerce': {
            url: '#/commerce',
            templateUrl: '/webapp/BackEnd/views/commerce.html'
        },
        'services': {
            url: '#/services',
            templateUrl: '/webapp/BackEnd/views/services.html'
        },
        'login': {
            url: '#/users/login',
            templateUrl: '/webapp/BackEnd/views/login.html'
        },
        'password': {
            url: '#/users/setpwd',
            templateUrl: '/webapp/BackEnd/views/password.html'
        },
        'reserved': {
            url: '#/services/reserved',
            templateUrl: '/webapp/BackEnd/views/reserved.html'
        },
        'removeUser': {
            url: '#/users/removeUser',
            templateUrl: '/webapp/BackEnd/views/removing.html'
        },
        'invoices': {
            url: '#/invoices',
            templateUrl: '/webapp/BackEnd/views/invoices.html'
        }
    };
    
    $.when($.ready)
        .then(function(){
            $.router.setData(routes);
            $.router.setDefault(defaultRoute);
            $.router.run('.view', defaultRoute);
        });

    $.router.onViewChange(function(e, viewRoute, route, params){
        for(let attr in routes){
            if(route.previousUrl.includes(attr)) $('#' + attr).removeClass('active');
            if(route.url.includes(attr)) $('#'+ attr).addClass('active');
        }
    });

    $('#logout').on('click', function(){
        //document.cookie = 'logged=';
        localStorage.removeItem('logged');
	location.replace('#/users');
        location.reload();
    })
});
