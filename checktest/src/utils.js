var paths = [{
    name:'default',parent:''
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



