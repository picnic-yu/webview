var paths = [{
  name: 'default', parent: ''
  },
  {
    name: 'shoplist', parent: 'default'
  },
  {
    name: 'search', parent: 'default'
  }];
module.exports.getBackPath = function(name){
  var res = {};
  for(var i=0;i<paths.length;i++){
    if(name == paths[i].name){
      res.parent = paths[i].parent;
      break;
    }
  }
  for(var i=0;i<paths.length;i++){
    if(res.parent == paths[i].name){
      res.params = paths[i].params;
      break;
    }
  }
  return res;
};

module.exports.setBackPath = function(name,params){
  for(var i=0;i<paths.length;i++){
    if(name == paths[i].name){
      paths[i].params = params;
      break;
    }
  }
};
/*
 /!**
 * 判断对象是否被修改过
 * @param newdata
 * @param olddata
 * @returns {boolean}
 *!/
 module.exports.isDataChange = function(newdata,olddata){
 for(var key in newdata){
 if(newdata.hasOwnProperty(key)){
 if(newdata[key] != olddata[key]){;
 return true;
 }
 }
 }
 return false;
 };*/

var goHome = function () {
  window.location.href = 'index.html?token=' + Constant.token + '&name=' + encodeURIComponent(Constant.shopInfo.name) + '&id=' + Constant.shopInfo.id;
};
module.exports.goHome = goHome;
/**
 *判断是否为整数
 * @param number
 * @returns {boolean}
 */
module.exports.isInteger = function (number) {
  return Math.floor(number) == number;
};


