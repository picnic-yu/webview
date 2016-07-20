<template>
    <div class="page-group">
      <div class="page page-current" id="index">
        <header class="bar bar-nav">
          <h1 class='title'>POS数据录入</h1>
          <a class="right-menu" v-on:click="goHistorys()">历史</a>
        </header>
        <div class="content">
          <div class="list-block">
            <form action="javascript:void(0);">
            <ul>
              <li>
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-title label">门店</div>
                    <div class="item-input"><input type="text" v-model="shopInfo.name" placeholder="选择一个门店" v-on:click="goToShoplist()" readonly/></div>
                  </div>
                </div>
              </li>
              <li>
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-title label">日期</div>
                    <div class="item-input"><input id="saleTime" type="text" placeholder="选择数据来源的时间" v-model="saleTime" readonly/></div>
                  </div>
                </div>
              </li>
              <li>
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-title label">销售单数</div>
                    <div class="item-input"><input type="number" pattern="[0-9]{1,10}" placeholder="请输入当日的销售单数"
                                                   v-model="dealPersonNum" maxlength="9"/></div>
                  </div>
                </div>
              </li>
              <li>
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-title label">销售件数</div>
                    <div class="item-input"><input type="number" pattern="[0-9]{1,10}" placeholder="请输入当日的销售件数"
                                                   v-model="dealNum" maxlength="9"/></div>
                  </div>
                </div>
              </li>
              <li>
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-title label">总销售额</div>
                    <div class="item-input"><input type="number" pattern="[0-9]{1,10}" placeholder="请输入当日的销售额(元)"
                                                   v-model="total" maxlength="9"/></div>
                  </div>
                </div>
              </li>
            </ul>
            </form>
          </div>
          <p class="submit-panel"><a class="button button-fill  button-orange"  v-on:click="submitData()" v-bind:class="doing?'disabled':''">提交</a></p>
        </div>
      </div>
    </div>
</template>

<script>
var utils = require('./../utils');
var commonutils = require('../../../common/assets/js/commonutils');
module.exports =  {
  route:{
   data:function(transition){
     this.getData();
     transition.next({
       shopInfo:Constant.shopInfo
     });
   }
  },
  data:function(){
    return {
      shopInfo:{
        id:'',
        name:''
      },
      id: null,
      saleTime:'',
      total:'',
      dealPersonNum:'',
      dealNum:'',
      doing:false
    }
  },
  ready:function(){
    this.init();
    this.initUI();
  },
  methods:{
    init:function(){
      var today = new Date();
      this.saleTime = commonutils.formatDateTime(today, 1);
    },
    initUI:function(){
      $('#saleTime').calendar({
        maxDate: commonutils.formatDateTime(new Date(), 1).replace(/-/g, '/')
      });
    },
    goToShoplist:function(){
      router.go({path:'/shoplist'});
    },
    goHistorys:function(){
      window.location.href = 'historys.html?token='+Constant.token+'&name='+encodeURIComponent(Constant.shopInfo.name)+'&id='+Constant.shopInfo.id;
    },
    clearData:function(){
      this.doing = false;
      this.saleTime = '';
      this.shopInfo = {
        id:'',name:''
      };
      this.total = '';
      this.dealNum = '';
      this.dealPersonNum = '';
      this.id = null;
    },
    clearData0: function () {
      this.doing = false;
      this.saleTime = '';
      this.total = '';
      this.dealNum = '';
      this.dealPersonNum = '';
    },
    getData: function () {
      var _this = this;
      var today = commonutils.formatDateTime(new Date(), 1);
      this.$http.post('/service/getSaleList.action?token=' + Constant.token, {
        dep_id: Constant.shopInfo.id,
        start_time: today + " 00:00:00",
        end_time: today + " 23:59:59",
        pageNumber: 1,
        pageSize: 20
      }).then(function (ret) {
        if (ret.ok && ret.data && ret.data.result == 'ok') {
          var data = ret.data.data.data;
          if (data && data.length > 0) {
            var item = data[0];
            _this.total = item.total;
            _this.dealNum = item.dealNum;
            _this.dealPersonNum = item.dealPersonNum;
            _this.id = item.id;
          } else {
            _this.total = '';
            _this.dealNum = '';
            _this.dealPersonNum = '';
            _this.id = null;
          }
        }

      });
    },
    submitData:function(){
      if(this.doing) return;
      if(!this.shopInfo.id){
        $.toast("请选择一个门店");
        return;
      }
      if(!this.saleTime){
        $.toast("请选择一个日期");
        return;
      }
      if(this.dealPersonNum == ''){
        $.toast("请输入销售单数");
        return;
      }
      if (this.dealPersonNum.length > 9 || this.dealPersonNum < 0 || !utils.isInteger(this.dealPersonNum)) {
        $.toast("销售单数不合法");
        return;
      }

      if(this.dealNum == ''){
        $.toast("请输入销售件数");
        return;
      }
      if (this.dealNum.length > 9 || this.dealNum < 0 || !utils.isInteger(this.dealNum)) {
        $.toast("销售件数不合法");
        return;
      }
      if(this.total == ''){
        $.toast("请输入总销售额");
        return;
      }
      if (this.total.length > 9 || this.total < 0 || !utils.isInteger(this.total)) {
        $.toast("总销售额不合法");
        return;
      }
      var _this = this;
      this.doing = true;
      //$.showPreloader('请稍后...');
      this.$http.post('/service/saveSaleData.action?token='+Constant.token,{
        sale:{
          id: this.id,
          dep_id:Constant.shopInfo.id,
          dealPersonNum:this.dealPersonNum,
          total:this.total,
          dealNum:this.dealNum
        },
        start_time:this.saleTime+" 00:00:00"
      }).then(function(ret){
        //$.hidePreloader();
        if(ret.ok && ret.data && ret.data.result == 'ok'){
          _this.success();
        }else if(ret.ok && ret.data && ret.data.result == 'DUPLICATE'){
          $.toast("录入失败：当天数据已经存在");
          setTimeout(function () {
            _this.doing = false;
          }, 1000);
        }else{
          $.toast("录入失败");
          setTimeout(function () {
            _this.doing = false;
          }, 1000);
        }
      });
    },
    success: function () {
      $.toast("录入成功");
      var _this = this;
      var btns = [{
        text: '查看历史',
        bold: true,
        onClick: function () {
          _this.goHistorys();
        }
      }, {
        text: '继续录入',
        bold: true,
        onClick: function () {
          _this.clearData0();
        }
      }];
      $.actions([btns]);
    }
  }
};
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
.list-block{
  margin:10px 0px;
}
.bar-nav{background: #fff}
.submit-panel{margin:10px 10px;}
.items-list ul{margin:0;padding:0px;}
.items-list li{border-bottom: 1px solid #ddd;padding:10px 10px;display: flex;align-items: center;}

  .item-input input {
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }
.item-name{
  word-wrap: break-word;
  white-space: pre;
  font-size:16px;
}
  /*.list-block .item-title.label{
    width: 40%;
  }*/
</style>
