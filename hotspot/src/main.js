//common module
require('../../common/assets/css/sm.min.css');
require('../../common/libs/zepto.min.js');
require('../../common/libs/sm.js');


var Vue = require('vue'),
  VueRouter = require('vue-router');
Router = require('./router');
Main = require('./Main.vue'),
    VueI18n = require('./vue-i18n'),
Filters = require('./filters'),
utils = require('./utils'),
commonutils = require('../../common/assets/js/commonutils'),
Constant = require('./constant'),
VueTap = require('vue-tap');
Vue.use(VueRouter);
Vue.use(VueTap);
Vue.use(require('vue-resource'));
//设置url传递过来的参数
Vue.http.options.emulateJSON = true;
Vue.http.headers.common['authenticator'] = Constant.token = commonutils.getPageUrlParam('token');
Constant.shopInfo.id = commonutils.getPageUrlParam('id');
Constant.shopInfo.name = decodeURIComponent(commonutils.getPageUrlParam('name'));
Constant.source = commonutils.getPageUrlParam('source');
Constant.showBackBtn = commonutils.getPageUrlParam('showBackBtn');//是否需要我显示返回按钮，主要用于兼容过去返回按钮全部由app做的问题
Constant.isWKWebView = commonutils.getPageUrlParam('isWKWebView');//ios专有参数，表示使用的webview框架,0代表UIWebview,1代表WKWebview
Constant.language = commonutils.getPageUrlParam('lang')?commonutils.getPageUrlParam('lang'):'cn';
Vue.filter('istoday',Filters.isToday);
Vue.filter('percent',Filters.percent);

var router = new VueRouter(
  {
    hashbang:true,
    history:false
  }
);
Router(router);
window.router = router;

//添加国际化插件
Vue.use(VueI18n,{
    default:Constant.language,
    data:require("./i18n")
});
/**
 * 提供Android和iOS调用返回功能
 * @returns {boolean}
 */
window.goBack = function(){
  var curPathName = Constant.curRoute.pathName;
  var backInfo = utils.getBackPath(curPathName);
  //从APP门店界面跳转过来的，返回时直接返回到APP界面
  if(Constant.source == 1 && backInfo.parent == 'default'){
    window.webview　&& window.webview.goBack(true);
    return true;
  }
  if(backInfo.parent){
    router.go({name:backInfo.parent,params:backInfo.params});
    window.webview &&　window.webview.goBack(false);
    return false;
  }
  window.webview　&& window.webview.goBack(true);
  return true;
};
router.start(Main,'#app');
