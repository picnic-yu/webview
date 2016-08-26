/**
 * 路由表
 * @param router
 */
module.exports = function (router) {
    var utils = require('./utils');
    router.map({
        '/': {
            name: 'default',
            component: function (resolve) {
                require(['./views/App'], resolve);
            }
        },
        '/shoplist/:dowhich': {
            name: 'shoplist',
            component: function (resolve) {
                require(['./views/ShopList'], resolve);
            }
        },
        '/userlist': {
            name: 'userlist',
            component: function (resolve) {
                require(['./views/UserList'], resolve);
            }
        },
        '/mutipleuserlist': {
            name: 'mutipleuserlist',
            component: function (resolve) {
                require(['./views/MutipleUserList'], resolve);
            }
        },
        '/templates': {
            name: 'templates',
            component: function (resolve) {
                require(['./views/Templates'], resolve);
            }
        },
        '/create/:deptId': {
            name: 'create',
            component: function (resolve) {
                require(['./views/Create'], resolve);
            }
        },
        '/detail/:id': {
            name: 'detail',
            component: function (resolve) {
                require(['./views/Detail'], resolve);
            }
        },
        '/searchdate': {
            name: 'searchdate',
            component: function (resolve) {
                require(['./views/SearchDateBox'], resolve);
            }
        }
    });
    router.beforeEach(function (transition) {
        Constant.curRoute.path = transition.to.path;
        Constant.curRoute.pathName = transition.to.name;
        utils.setBackPath(transition.to.name, transition.to.params);
        transition.next();
    });
};
