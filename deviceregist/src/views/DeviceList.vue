<template>
  <div class="page-group">
    <div class="page page-current" id="index">
      <header class="bar bar-nav">
        <h1 class='title'>设备列表</h1>
        <a class="right-menu" v-on:click="goAdd()">添加</a>
      </header>
      <div class="top-panel">
        <div class="search-box search-box-shop" v-on:click="goToShopList()">
          <div class="search-box-left"><span class="icon-shop"></span></div>
          <div class="search-box-right">
            <a class="search-shop-tip"  v-show="!shopInfo.id">请选择一个门店</a>
            <span class="search-shop"   v-show="shopInfo.id">{{shopInfo.name}}</span>
          </div>
        </div>
        <!--<div class="search-box search-box-shop">
          <div class="search-box-left"><span class="icon-search2"></span></div>
          <div class="search-box-right">
            <input class="search-shop-input"   placeholder="输入设备12位序列号" type="text" maxlength="12">{{search.mac}}</input>
          </div>
        </div>-->
        <div class="searchbar row">
          <div class="search-input col-80">
            <label class="icon icon-search" for="searchMac"></label>
            <input type="search" id="searchMac" v-model="search.mac" placeholder="输入设备12位序列号" maxlength="12"/>
          </div>
          <a v-on:click="searchByMac()" class="button button-fill button-primary col-20 search-btn" v-bind:class="(!search.mac || search.mac.length < 12)?'disabled':''">搜索</a>
        </div>
      </div>
    <div id="historysContent" class="content content-items pull-to-refresh-content"  data-ptr-distance="55">
      <div class="pull-to-refresh-layer">
        <div class="preloader"></div>
        <div class="pull-to-refresh-arrow"></div>
      </div>
      <div class="items-list devices-list">
        <ul>
          <li v-for="item in items">
            <div class="item-item" v-on:click="detail(item)" v-bind:class="item.checked?'item-checked':''">
              <div class="item-des">
                <span class="item-name">{{item.deviceName}}</span>
                <label v-show="!item.onlineOnPlatform && (item.dType== 1 || item.dType== 3 || item.dType== 5 || item.dType== 9)" class="item-error">!视频</label>
                <label v-show="!item.online" class="item-error">!网管</label>
              </div>
              <div class="item-des">
                <span class="item-user">{{item.dType|whichdevicetype}}</span>
                <span class="item-user">{{item.deviceType}}</span>
              </div>
              <div class="item-des">
                <span class="item-user">{{item.mac}}</span>
                <span class="item-user">{{item.mac1}}</span>
              </div>
              <div class="item-des">
                <span class="item-user">{{item.version}}</span>
                <label v-show="item.version != item.latestVersion" class="item-error2">可升级</label>
              </div>
            </div>
            <div class="item-des item-childlist">
              <ul>
                <li v-for="child in item.deviceStatusLst" v-on:click="detail(child)" v-bind:class="child.checked?'item-checked':''">
                  <div class="item-des">
                    <span class="item-name">{{child.deviceName}}</span>
                    <label v-show="!child.onlineOnPlatform && (child.dType== 1 || child.dType== 3 || child.dType== 5 || child.dType== 9)" class="item-error">!视频</label>
                    <label v-show="!child.online" class="item-error">!网管</label>
                  </div>
                  <div class="item-des">
                    <span class="item-user">{{child.dType|whichdevicetype}}</span>
                    <span class="item-user">{{child.deviceType}}</span>
                  </div>
                  <div class="item-des">
                    <span class="item-user">{{child.mac}}</span>
                    <span class="item-user">{{child.mac1}}</span>
                  </div>
                  <div class="item-des">
                    <span class="item-user">{{child.version}}</span>
                    <label v-show="child.version != child.latestVersion" class="item-error2">可升级</label>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div class="items-list no-data" v-show="nodata">
        没有任何设备
      </div>
    </div>
  </div>
  <devicerelevancy  transition="slide"></devicerelevancy>
  <deviceinfo></deviceinfo>
  </div>
</template>

<script>
  require('../../../common/assets/font.css');
  var utils = require('./../utils');
  var DeviceRelevancy = require('../components/DeviceRelevancy');
  var DeviceDetail = require('../components/DeviceDetail');
  module.exports =  {
    route:{
      data:function(transition){
        if(Constant.shopInfo.id || Constant.search.mac){
          if(this.refreshInit){
            this.loadData(null,{
              search:Constant.search,
              shopInfo:Constant.shopInfo
            });
          }
        }
        transition.next({
          search:Constant.search,
          shopInfo:Constant.shopInfo
        });
      },
      deactivate:function(transition){
        this.clearData();
        transition.next();
      }
    },
    filters:{
      whichdevicetype:function(type){
        if(type == 1){
          return "视频设备";
        }else if(type == 2){
          return "NVR";
        }else if(type == 3){
          return "客流设备";
        }else if(type == 4){
          return "客流板卡";
        }else if(type == 5){
          return "热点设备";
        }else if(type == 6){
          return "热点板卡";
        }else if(type == 7){
          return "PC4";
        }else if(type == 8){
          return "智能板卡";
        }else if(type == 9){
          return "智能设备";
        }
        return "";
      }
    },
    data:function(){
      return {
        search:{
          startTime:'',
          endTime:'',
          mac:Constant.search.mac
        },
        shopInfo:{
          id:'',
          name:''
        },
        loading:false,
        nodata:false,
        device:{},
        items:[],
        scrollInit:false,
        refreshInit:false
      }
    },
    components:{
      devicerelevancy:DeviceRelevancy,
      deviceinfo:DeviceDetail
    },
    events:{
      'refreshDeviceList':function(){
        this.getData();
      }
    },
    created:function(){

    },
    ready:function(){
      this.init();
    },
    methods:{
      init:function(){
        var _this = this;
        if(!this.refreshInit){
          $('#historysContent').scroller({
            type:'native'
          });
          $.initPullToRefresh('#historysContent');
          $(document).on('refresh','#historysContent',function(e){
            _this.refresh();
          });
          this.refreshInit = true;
        }
        this.loadData();
      },
      loadData:function(callback,searchData){
        searchData = searchData?searchData:this;
        if(searchData.search.mac){
          this.searchByMac();
        }else{
          this.getData(callback,searchData);
        }
      },
      getData:function(callback,searchData){
        this.loading = true;
        searchData = searchData?searchData:this;
        if(!searchData.shopInfo.id && !searchData.search.mac){
          $.refreshScroller();
          return;
        }
        var _this = this;
        this.$http.post('/service/getDeviceList0.action?token='+Constant.token,{
          serialNo:'S_'+searchData.shopInfo.id
        }).then(function(ret){
          _this.loading = false;
          if(ret.ok && ret.data && ret.data.result == 'ok'){
            _this.items = ret.data.data.data;
            if(_this.items.length > 0){
              if(_this.search.mac){
                _this.items = topTargetDevice(_this.items,_this.search.mac);
              }
              _this.nodata = false;
            }else{
              _this.nodata = true;
            }
            $.refreshScroller();
            callback && callback();
          }
        });
      },
      unReletaDevice:function(device){
        var parentDevice = getParentDevice(this.items,device.pId);
        if(!parentDevice){
          $.toast('父级设备不存在');
          return;
        }
        var _this = this;
        this.$http.post('/service/devsRemoveRelation.action?token='+Constant.token,{
          mac : parentDevice.mac,
          ipcmacs : [device.mac]
        }).then(function(ret){
          if(ret.ok && ret.data && ret.data.result == 'ok'){
            var data = ret.data.data.data;
            if(data.del_result == 1){
              $.toast('解除关联失败');
              return;
            }
            var delResults = data.del_dev_result;
            if(delResults[0].result == 0){
              $.toast('解除关联成功');
              this.getData();
            }else{
              $.toast('解除关联失败');
            }
          }else{
            $.toast('解除关联失败');
          }
        });
      },
      searchByMac:function(){
        var _this = this;
        this.$http.post('/service/getDeviceByMac0.action?token='+Constant.token,{
          mac:this.search.mac
        }).then(function(ret){
          if(ret.ok && ret.data){
            var device = ret.data.data.data;
            if(device){
              this.$http.post('/service/getPrivilegeDepartment.action?token='+Constant.token,{
                id:device.depId
              }).then(function(res){
                if(res.ok && res.data && res.data.result == "ok" && res.data.data.data){
                  var depData = res.data.data.data;
                   _this.shopInfo.id = depData.id;//门店前缀为S
                  _this.shopInfo.name = depData.name;
                  Constant.shopinfo = _this.shopInfo;
                  _this.getData();
                }else{
                  _this.nodata = true;
                  _this.items = [];
                }
              });
            }else{
              _this.nodata = true;
              _this.items = [];
            }
          }
        });
      },
      upgrade:function(device){
        var _this = this;
        this.$http.post('/service/deviceUpgrade0.action?token='+Constant.token,{
          id:device.id,
          isAuto:false
        }).then(function(res){
          if(res.ok && res.data){
            var data = res.data.result;
            if(typeof(data) == 'undefined'){
              $.toast('升级失败');
              return;
            }
            if (data < 0) {
              if (data == '-2') {
                $.toast('设备不在线，请稍后再试');
              } else if (data == '-1') {
                $.toast('找不到当前设备');
              }
            }else{//指令下发成功，开始升级，设置进度，并持续去获取升级进度
              $.showPreloader('正在升级...<span class="upgrade-value" id="upgradeValue">0</span>%');
              _this.getUpgradeProgress(device);
            }
          }
        });
      },
      getUpgradeProgress:function(device){
        var _this = this;
        setTimeout(function(){
          _this.$http.post('/service/deviceUpgrade0.action?token='+Constant.token,{//多次请求，请求升级进度
            id:device.id,
            isAuto:true
          }).then(function(ret){
            if(ret.ok && ret.data){
              var data = ret.data.result;
              if(typeof(data) == 'undefined'){
                $.toast('升级失败');
                return;
              }
              if (data < 0 && data != '-2') {
                if (data == '-1') {
                  $.toast('找不到当前设备');
                } else if (data == '-3') {
                  $('#upgradeValue').html(100);
                  $.hidePreloader();
                  $.toast('升级成功');
                  _this.loadData();
                }
              } else {
                if(data <= 10 & data > 1) data = 10;
                data = (data==200?99:data);
                $('#upgradeValue').html(data);
                _this.getUpgradeProgress(device);
              }
            }
          });
        },5000);
      },
      clearData:function(){
        this.items = [];
        this.search.mac = '';
      },
      refresh:function(){
        this.items = [];
        this.getData(function(){
          $.pullToRefreshDone('#historysContent');
        });
      },
      detail:function(device){
        this.device = Constant.device =  device;
        utils.showDevOptList(this,device,false,'请选择操作');
      },
      goToShopList:function(){
        router.go('/shoplist');
      },
      goAdd:function(){
          window.location.href = 'index.html?token='+Constant.token+'&name='+encodeURIComponent(Constant.shopInfo.name)+'&id='+Constant.shopInfo.id;
      }
    }
  };
  /**
   * 获取父级设备
   * @param parentDevices
   * @param parentId
   * @returns {*}
   */
  function getParentDevice(parentDevices,parentId){
    for(var i=0;i<parentDevices.length;i++){
      if(parentDevices[i].id == parentId){
        return parentDevices[i];
      }
    }
  }

  function topTargetDevice(devices,mac){
    var index1 = -1,index2 = -1;
    for(var i=0;i<devices.length;i++){
      if(devices[i].mac == mac || devices[i].mac1 == mac){
        index1 = i;
        devices[i].checked = true;
        break;
      }else{
        var children = devices[i].deviceStatusLst;
        if(children && children.length > 0){
          for(var j=0;j<children.length;j++){
            if(children[j].mac == mac || children[j].mac1 == mac){
              children[j].checked = true;
              index1 = i;
              index2 = j;
              break;
            }
          }
        }
      }
    }
    if(index1 > 0){
      var tmpDevice = devices[index1];
      devices.splice(index1,1);
      devices.unshift(tmpDevice);
      return devices;
    }
  }
</script>

<style>
  /**{
    -webkit-touch-callout:none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }*/
  html {
    height: 100%;
  }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color:#333;
  }
  ul{list-style: none}
  .head-tab{
    justify-content:flex-start;
  }
  #historysContent{overflow-x: hidden;top:84px;z-index:4;background: #eee;}
  .buttons-tab.head-tab a.tab-link{width:120px;top:0px;height:44px;line-height: 44px;color: #999;}
  .buttons-tab.head-tab .button.active{border-color:#f90; color: #333;font-size: 18px}
  .timebox{
    display: flex;
    align-items:flex-start;
    justify-content:center;
    flex-direction:column;
  }
  .timebox .date-time{font-size: 16px;}
  .timebox .datetime-tip{font-size: 12px;color:#999;}
  header.bar,.content{background: #fff;}
  .is-today{color:#f90;font-size: 15px;}

  .search-box{
    text-align: left;
    height:40px;
    background: #fff;
    border-bottom: 1px solid #ddd;
  }
  .search-box-time{
    height:58px;
  }
  .search-box-left{
    float: left;
    width:60px;
    text-align: center;
    font-size: 20px;
    line-height: 40px;
  }
  .search-box-time .search-box-left{
    line-height: 58px;
  }
  .search-box-right{
    width: 100%;
    font-size: 16px;
  }
  .search-box-shop .search-box-right{
    line-height: 40px;
  }
  .search-time{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 58px;
  }

  .search-shop-input{
    height:30px;
    line-height: 30px;
    border: none;
  }
  .search-shop{
    color: #333;
    max-width: 200px;
    max-width:calc(100% - 80px);
    overflow: hidden;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    white-space:nowrap;
    display: inline-block;
  }
  .to{
    margin:0 20px;
  }


  .top-panel{
    background: #eee;
    font-size: 14px;
    position: absolute;
    top:44px;
    width: 100%;
    z-index:5;
  }
  .items-list{
    background: #fff;
    margin-top:5px;
  }
  .no-data{
    text-align: center;
    width: 100%;
    color: red;
    padding: 10px 0px;
  }
  .items-list ul{margin:0;padding:0px;}
  .items-list li{border-bottom: 1px solid #ddd;padding:10px;display: flex;align-items: flex-start;flex-direction: column;}
  .item-name{
    word-wrap: break-word;
    white-space: pre;
    font-size:16px;
  }
  .item-error{
    font-size:12px;
    color: #fff;
    background: red;
    padding:2px 4px;
    border-radius:4px;
  }
  .item-error2{
    font-size:12px;
    color: #fff;
    background: #fa0;
    padding:2px 4px;
    border-radius:4px;
    white-space: nowrap;
  }
  .item-des{
    width: 100%;
  }
  .item-br{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .item-left{width:80%;}
  .item-des span,.item-des label,.item-des{
    vertical-align: middle;
  }
  .item-label{
    color: #999;
    font-size: 12px;
    margin-right: 2px;
  }
  .item-num{
    color:#333;
    font-size: 12px;
    display: inline-block;
    width:40px;
    overflow: hidden;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    white-space:nowrap;
  }
  .item-num-large{
    max-width:100px;
  }
  .item-user{
    color:#999;
    font-size: 12px;
  }
  .item-time{
    color:#333;
    font-size: 12px;
    float: right;
  }
  .item-splitor{
    display: inline-block;
    width:1px;
    background: #ddd;
    height:12px;
    margin:0 10px;
  }
  .item-rate{
    font-size: 20px;
  }
  .icon-info{
    margin-left:4px;
    font-size: 14px;
    vertical-align: text-bottom;
  }
  .searchbar.row{
    padding:8px 10px;
  }
  .searchbar .search-input input{
    height: 32px;
  }
  .button.search-btn{
    height: 32px;
    line-height: 32px;
  }
  .item-childlist{
    background: #eee;
  }
  .devices-list li{padding: 0px;}
  .item-childlist li{
    margin:10px;
    background: #fff;
    padding:10px;
  }
  .item-item{
    padding:10px;
    width: 100%;
  }
  .item-checked,.item-childlist li.item-checked{
    background: #d9f4fe;
  }
  .upgrade-value{
    display: inline-block;
    width:30px;
    text-align: right;
  }
</style>
