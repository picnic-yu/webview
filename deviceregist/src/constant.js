/**
 * Created by jxm on 16-6-6.
 * 存放全局变量
 */
module.exports = {
  search:{
    startTime:'',
    endTime:'',
    mac:''
  },
  token:'',
  curRoute:{
    path:'',
    pathName:'',
    params:{},
    backpath:''
  },
  shopInfo:{
    id:'',
    name:''
  },
  devRegist:{
    step:1,
    mac:''
  },
  device:{
    name:'',
    mac:'',//0030642fe22e
    deviceType:'',
    pwd:'',
    dType:''
  },
  source:''//空为webviewurl来自于未选择门店时候的跳转，1来自于门店界面的注册的跳转
};
