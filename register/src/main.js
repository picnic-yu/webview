//common module
require('../../common/assets/css/sm.min.css');
require('../../common/libs/zepto.min.js');
require('../../common/libs/sm.js');
require('../../common/libs/html5ImgCompress/html5ImgCompress.js');


var Vue = require('vue'),
    VueRouter = require('vue-router');
Router = require('./router');
Main = require('./Main.vue'),
    utils = require('./utils'),
    commonutils = require('../../common/assets/js/commonutils'),
    Constant = require('./constant'),
    md5 = require('./Md5Util2'),
    VueTap = require('vue-tap');
Vue.use(VueRouter);
Vue.use(VueTap);
Vue.use(require('vue-resource'));
//设置url传递过来的参数
Vue.http.options.emulateJSON = true;
Vue.http.headers.common['activeCode'] = Constant.activationCode = commonutils.getPageUrlParam('activeCode');
Vue.http.headers.common['app'] = Constant.app = commonutils.getPageUrlParam('app');
Vue.http.headers.common['isWKWebView'] = Constant.isWKWebView = commonutils.getPageUrlParam('isWKWebView');
Vue.http.headers.common['signUserId'] = Constant.signUserId = commonutils.getPageUrlParam('signUserId');
Vue.http.headers.common['enterId'] = Constant.enterId = commonutils.getPageUrlParam('enterId');


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
/**
 * 提供Android和iOS调用返回功能
 * @returns {boolean}
 */
window.goBack = function(){
  var curPathName = Constant.curRoute.pathName;
  var backInfo = utils.getBackPath(curPathName);
  if(backInfo.parent){
    router.go({name:backInfo.parent,params:backInfo.params});
    window.webview &&　window.webview.goBack(false);
    return false;
  }
  window.webview　&& window.webview.goBack(true);
  return true;
};
router.start(Main,'#app');