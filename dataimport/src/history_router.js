
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
        require(['./views/Historys'],resolve);
      }
    },
    '/shoplist':{
      name:'shoplist',
      component:function(resolve){
        require(['./views/ShopList'],resolve);
      }
    },
    '/search':{
      name:'search',
      component:function(resolve){
        require(['./views/SearchBox'],resolve);
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
