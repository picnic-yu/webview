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
        '/userlist/:dowhich': {
            name: 'userlist',
            component: function (resolve) {
                require(['./views/UserList'], resolve);
            }
        },
        '/mutipleuserlist/:type': {
            name: 'mutipleuserlist',
            component: function (resolve) {
                require(['./views/MutipleUserList'], resolve);
            }
        },
        '/templates/:dowhich': {
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
        '/grouplist': {
            name: 'grouplist',
            component: function (resolve) {
                require(['./views/GroupList'], resolve);
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
        },
        '/expiredate': {
            name: 'expiredate',
            component: function (resolve) {
                require(['./views/ExpireDateBox'], resolve);
            }
        },
        '/opt/:state/:pid': {
            name: 'opt',
            component: function (resolve) {
                require(['./views/OperateState'], resolve);
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
