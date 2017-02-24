//common module
require('../../common/assets/css/sm.min.css');
require('../../common/libs/zepto.min.js');
require('../../common/libs/sm.js');


var Vue = require('vue'),
    VueRouter = require('vue-router');
Router = require('./router');
Main = require('./Main.vue'),
    Filters = require('./filters'),
    utils = require('./utils'),
    commonutils = require('../../common/assets/js/commonutils'),
    Constant = require('./constant'),
    VueTap = require('vue-tap');


Vue.use(VueRouter);
Vue.use(VueTap);
Vue.use(require('vue-resource'));
Vue.http.options.emulateJSON = true;
Vue.filter('istoday',Filters.isToday);
Vue.filter('percent', Filters.percent);

var router = new VueRouter(
    {
        hashbang: true,
        history: false,
        //transitionOnLoad:true,
        root: '/webview'
    }
);
Router(router);
window.router = router;
/**
 * 提供Android和iOS调用返回功能
 * @returns {boolean}
 */
window.goBack = function () {
    var curPathName = Constant.curRoute.pathName;
    var backInfo = utils.getBackPath(curPathName);
    if (backInfo.parent) {
        router.go({name: backInfo.parent, params: backInfo.params});
        window.webview && window.webview.goBack(false);
        return false;
    }
    window.webview && window.webview.goBack(true);
    return true;
};
Constant.token = commonutils.getPageUrlParam('token');
router.start(Main, '#app');