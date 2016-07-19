
/**
 * 路由表
 * @param router
 */
module.exports = function(router){
  var utils = require('./utils');
  router.map({
    '/':{
      name:'default',
      component:function(resolve){
        require(['./views/Step1'],resolve);
      }
    },
    '/step2':{
      name:'step2',
      component:function(resolve){
        require(['./views/Step2'],resolve);
      }
    },
    '/step3':{
      name:'step3',
      component:function(resolve){
        require(['./views/Step3'],resolve);
      }
    },
    '/shoplist':{
      name:'shoplist',
      component:function(resolve){
        require(['./views/ShopList'],resolve);
      }
    }
  });
  router.beforeEach(function(transition){
    Constant.curRoute.path = transition.to.path;
    Constant.curRoute.pathName = transition.to.name;
    utils.setBackPath(transition.to.name,transition.to.params);
    transition.next();
  });
};
