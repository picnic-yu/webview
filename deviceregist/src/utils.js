var paths = [{
    name:'default',parent:''
  },
  {
    name:'shoplist',parent:'default'
  },
  {
    name:'step2',parent:'default'
  },
  {
    name:'step3',parent:'step2'
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
/**
 * 显示设备的操作列表
 * @param device
 * @param reregist 是否是注册页面
 * @param title 操作表标题
 */
module.exports.showDevOptList = function(comp,device,reregist,title){
  var btns = [{
    text:title,
    label:true
  },{
    text:'查看设备',
    bold:true,
    onClick:function(){
      if(reregist){
        Constant.search.mac = device.mac;
        goDeviceList();
      }else{
        comp.$broadcast('popup',{
          name:'device-info'
        });
      }
    }
  }];
  if(device.version != device.latestVersion){
    btns.push({
      text:'升级设备',
      bold:true,
      color:'danger',
      disabled:device.online?false:true,
      close:device.online?true:false,
      onClick:function(){
        if(device.online){//dms在线才能升级
          $.confirm('确认把设备升级到最新版本吗？',function(){
            comp.upgrade(device);
          });
        }
      }
    });
  }
  if(device.dType == 2 || device.dType == 4 || device.dType == 6 || device.dType == 8){//NVR、客流盒子、热点盒子、智能板卡
    btns.push({
      text:'设备关联',
      bold:true,
      disabled:device.online?false:true,
      close:device.online?true:false,
      onClick:function(){
        if(device.online){
          comp.$broadcast('popup',{
            name:'device-relevancy'
          });
        }
      }
    });
  }
  if(device.pId){
    btns.push({
      text:'解除关联',
      bold:true,
      color:'danger',
      disabled:device.online?false:true,
      close:device.online?true:false,
      onClick:function(){
        if(device.online){
          $.confirm('确认解除关联吗？',function(){
            comp.unReletaDevice(device);
          });
        }
      }
    });
  }
  if(device.dType == 7){//PC4支持直接客流配置
    btns.push({
      text:'客流配置',
      bold:true,
      disabled:device.online?false:true,
      close:device.online?true:false,
      onClick:function(){
        if(device.online){
          //TODO
          $.toast('即将开放');
        }
      }
    });
  }
  var groups = [];
  groups.push(btns);
  if(reregist){
    groups.push([{
      text:'继续注册',
      bold:true,
      onClick:function(){
        Constant.devRegist.mac = '';
        router.go('step2');
      }
    }]);
  }else{
    groups.push([{
      text:'取消',
      bg:'danger',
      onClick:function(){

      }
    }]);
  }
  $.actions(groups);
};
var goDeviceList = function(){
  window.location.href = 'devices.html?token='+Constant.token+'&name='+encodeURIComponent(Constant.shopInfo.name)+'&id='+Constant.shopInfo.id+'&mac='+Constant.search.mac+"&source="+Constant.source;
};
module.exports.goDeviceList = goDeviceList;
/**
 * 返回设备注册界面
 */
var goDeviceRegist = function(){
  if(Constant.source == 1){
    window.location.href = 'index.html?token='+Constant.token+'&name='+encodeURIComponent(Constant.shopInfo.name)+'&id='+Constant.shopInfo.id+"&source="+Constant.source+"#!/step2";
  }else{
    window.location.href = 'index.html?token='+Constant.token+'&name='+encodeURIComponent(Constant.shopInfo.name)+'&id='+Constant.shopInfo.id+"&source="+Constant.source;
  }
};
module.exports.goDeviceRegist = goDeviceRegist;


