<template>
  <div class="page-group" :transition="transitionName">
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
                    <div class="item-title label">销售日期</div>
                    <div class="item-input"><input id="saleDate" type="text" placeholder="选择销售日期" v-model="saleDate" readonly/></div>
                  </div>
                </div>
              </li>
              <li>
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-title label">销售时间</div>
                    <div class="item-input"><input id="saleTime" type="text" placeholder="选择销售时间" v-model="saleTime" readonly/></div>
                  </div>
                </div>
              </li>
              <li>
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-title label">销售单数</div>
                    <div class="item-input"><input type="text" pattern="[0-9]{1,10}" placeholder="请输入销售单数"
                                                   v-model="dealPersonNum" @input="istoolong0()"/></div>
                  </div>
                </div>
              </li>
              <!--<li>
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-title label">销售件数</div>
                    <div class="item-input"><input type="number" pattern="[0-9]{1,10}" placeholder="请输入当日的销售件数"
                                                   v-model="dealNum" maxlength="9" @input="istoolong1()"/></div>
                  </div>
                </div>
              </li>-->
              <li>
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-title label">总销售额</div>
                    <div class="item-input"><input type="number" pattern="[0-9]{1,10}" placeholder="请输入总销售额(元)"
                                                   v-model="total" maxlength="9" @input="istoolong2()"/></div>
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
                //this.getData();
                transition.next({
                    shopInfo:Constant.shopInfo
                });
            },
            deactivate: function (transition) {
                this.transitionName = 'left';
                transition.next();
            }
        },
        data:function(){
            return {
                transitionName:'show',
                shopInfo:{
                    id:'',
                    name:''
                },
                id: null,
                saleTime:'',
                saleDate:'',
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
                this.saleDate = commonutils.formatDateTime(today,1);
                this.saleTime = commonutils.formatDateTime(today).substring(11,commonutils.formatDateTime(today).length-3);
            },
            initUI:function(){
                var curDate = commonutils.formatDateTime(new Date(), 1);
                var curTime = commonutils.formatDateTime(new Date(), 2);
                var timeArr = curTime.substring(0,5).split(':');
                $('#saleDate').calendar({
                    maxDate:curDate.replace(/-/g,'/')
                });
                var arr1 = [];
                for(var i=0;i<24;i++){
                    if(i<10){
                        arr1.push("0"+i);
                    }else{
                        arr1.push(i);
                    }
                }
                var arr2 = [];
                for(var j=0;j<60;j++){
                    if(j<10){
                        arr2.push("0"+j);
                    }else{
                        arr2.push(j);
                    }
                }
                $("#saleTime").picker({
                    cols: [
                        {
                            textAlign: 'center',
                            values:arr1
                        },
                        {
                            textAlign: 'center',
                            values: arr2
                        }
                    ],
                    value:timeArr,
                    formatValue:function(picker,value,displayValue){
                        return value[0]+":"+value[1];
                    }
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
                this.saleDate = '';
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
                this.saleDate = '';
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
                          /*_this.total = '';
                           _this.dealNum = '';
                           _this.dealPersonNum = '';*/
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
                if(!this.saleDate){
                    $.toast("请选择一个销售日期");
                    return;
                }
                if(!this.saleTime){
                    $.toast("请选择一个销售时间");
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

              /*if(this.dealNum == ''){
               $.toast("请输入销售件数");
               return;
               }
               if (this.dealNum.length > 9 || this.dealNum < 0 || !utils.isInteger(this.dealNum)) {
               $.toast("销售件数不合法");
               return;
               }*/
                if(!this.total){
                    $.toast("请输入总销售额");
                    return;
                }
                //非负数
                var reg1 = /^\d+(\.{0,1}\d+){0,1}$/
                if(this.total.length > 9 || !reg1.test(this.total)){
                    $.toast("总销售额不合法");
                    return;
                }
                var _this = this;
                this.doing = true;
                //$.showPreloader('请稍后...');
                this.$http.post('/service/saveSaleDetailData.action?token='+Constant.token,{
                    'saleDetail.id':null,
                    'saleDetail.dep_id':Constant.shopInfo.id,
                    'saleDetail.dealPersonNum':this.dealPersonNum,
                    'saleDetail.total':this.total,
                    'start_time':this.saleDate+" "+this.saleTime+':00'
                }).then(function(ret){
                    //$.hidePreloader();
                    if(ret.ok && ret.data && ret.data.result == 'ok'){
                        _this.success();
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
            },
            istoolong0: function () {
                if (this.dealPersonNum.length > 9) {
                    this.dealPersonNum = this.dealPersonNum.slice(0, 9);
                }
            },
            istoolong1: function () {
                if (this.dealNum.length > 9) {
                    this.dealNum = this.dealNum.slice(0, 9);
                }
            },
            istoolong2: function () {
                if (this.total.length > 9) {
                    this.total = this.total.slice(0, 9);
                }
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