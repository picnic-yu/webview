//common module
require('../../common/assets/css/sm.min.css');
require('../../common/libs/zepto.min.js');
require('../../common/libs/sm.js');
require('../../common/libs/html5ImgCompress/html5ImgCompress.js');

var Vue = require('vue'),
    VueRouter = require('vue-router');
Main = require('./Main.vue'),
    commonutils = require('../../common/assets/js/commonutils'),
    Constant = require('./constant');
Vue.use(VueRouter);
Vue.use(require('vue-resource'));
//设置url传递过来的参数
Vue.http.options.emulateJSON = true;
Vue.http.headers.common['authenticator'] = Constant.token = commonutils.getPageUrlParam('token');
Constant.gallery = commonutils.getPageUrlParam('gallery') || 0;//Android专有参数，表示使用安卓自带相册

var router = new VueRouter({
        hashbang: true,
        history: false,
        initialTransition: 'show',
        saveScrollPosition: true
    }
);
router.map({
    '/': {
        name: 'default',
        component: function (resolve) {
            require(['./views/Feedback'], resolve);
        }
    }
});
window.router = router;
router.start(Main, '#app');
