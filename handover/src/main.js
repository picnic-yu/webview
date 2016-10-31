//common module
require('../../common/assets/css/sm.min.css');
require('../../common/libs/zepto.min.js');
require('../../common/libs/sm.js');
require('../../common/libs/html5ImgCompress/html5ImgCompress.js');

var Vue = require('vue'),
    VueRouter = require('vue-router');
Router = require('./router');
Main = require('./Main.vue'),
    Filters = require('./filters'),
    utils = require('./utils'),
    commonutils = require('../../common/assets/js/commonutils'),
    Constant = require('./constant'),
    VueTap = require('vue-tap');
//var DragAndDrop = require('vue-drag-and-drop');
Vue.use(VueRouter);
Vue.use(VueTap);
//Vue.use(DragAndDrop);
Vue.use(require('vue-resource'));
//设置url传递过来的参数
Vue.http.options.emulateJSON = true;
Vue.http.headers.common['authenticator'] = Constant.token = commonutils.getPageUrlParam('token');
Constant.shopInfo.id = commonutils.getPageUrlParam('id');
Constant.shopInfo.name = decodeURIComponent(commonutils.getPageUrlParam('name'));
Constant.source = commonutils.getPageUrlParam('source');
Constant.showBackBtn = commonutils.getPageUrlParam('showBackBtn');//是否需要我显示返回按钮，主要用于兼容过去返回按钮全部由app做的问题
Constant.isWKWebView = commonutils.getPageUrlParam('isWKWebView');//ios专有参数，表示使用的webview框架,0代表UIWebview,1代表WKWebview
Vue.filter('istoday', Filters.isToday);
Vue.filter('percent', Filters.percent);

var router = new VueRouter(
    {
        hashbang: true,
        history: false,
        initialTransition: 'show',
        saveScrollPosition: true
    }
);
Router(router);
window.router = router;
//定义一个全局变量用来表示图片控件是否已经打开
window.isPhotoOpen = false;
window.myPhotoBrowserStandalone = null;
/**
 * 提供Android和iOS调用返回功能
 * @returns {boolean}
 */
window.goBack = function () {
    var curPathName = Constant.curRoute.pathName;
    var backInfo = utils.getBackPath(curPathName);
    //从APP门店界面跳转过来的，返回时直接返回到APP界面
    /*if(Constant.source == 1 && backInfo.parent == 'default'){
     window.webview　&& window.webview.goBack(true);
     return true;
     }*/
    if (isPhotoOpen && myPhotoBrowserStandalone) {
        try {
            myPhotoBrowserStandalone.close();
            isPhotoOpen = false;
        } catch (e) {
        }
        return false;
    }
    if (curPathName == 'shoplist') {//特殊处理，这个门店界面返回的时候有两个地方
        if (Constant.curRoute.path.indexOf('/shoplist/1') > -1) {//创建界面，选择门店时，返回到创建界面
            router.go({name: 'create', params: {deptId: Constant.shopInfo.id ? Constant.shopInfo.id : 0}});
            window.webview && window.webview.goBack(false);
            return false;
        }
    }
    if (backInfo.parent == 'default') {
        Constant.needRefresh = false;
    }
    if (backInfo.parent) {
        router.go({name: backInfo.parent, params: backInfo.params});
        window.webview && window.webview.goBack(false);
        return false;
    }
    window.webview && window.webview.goBack(true);
    return true;
};

window.getFocus = function (id) {
    setTimeout(function () {
        document.getElementById("cmtInput").focus();
    }, 1000);
};

router.start(Main, '#app');
