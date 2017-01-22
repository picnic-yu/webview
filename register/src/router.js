
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
    '/join':{
      name:'step2',
      component:function(resolve){
        require(['./views/Step2'],resolve);
      }
    },
    '/next':{
      name:'step3',
      component:function(resolve){
        require(['./views/Step3'],resolve);
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
