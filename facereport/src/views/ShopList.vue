<template>
  <div class="page-group" :transition="transitionName">
    <div class="page page-current" id="index">
      <header class="bar bar-nav">
        <span class="pull-left icon-back"></span>
        <h1 class='title' v-on:click="backTo()" v-i18n="{value:'selectdevice'}"></h1>
      </header>
      <div id="shopListContent" class="content content-items">
        <div class="items-list">
          <ul>
            <li v-for="item in items" v-on:click="detail(item.mac,item.name)">
              <div class="item-left">
                <div class="item-name">{{item.name}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
  var utils = require('./../utils');
  module.exports =  {
    route:{
      data:function(transition){
        this.getData();
        transition.next();
      },
      deactivate:function(transition){
        this.clearData();
        transition.next();
      }
    },
    data:function(){
      return {
        transitionName:'right',
        loading:false,
        items:[]
      };
    },
    ready:function(){
      this.init();
    },
    methods:{
      init:function(){
          this.getData();
      },
      fdfd:function(){
        $.alert("fg");
      },
      backTo: function () {
        var curPathName = Constant.curRoute.pathName;
        var backInfo = utils.getBackPath(curPathName);
        router.go({name: backInfo.parent, params: backInfo.params});
      },
      getData:function(){
        var _this = this;
        this.loading = true;
        this.$http.post('/service/getAllFaceMac.action?token='+Constant.token,{
        }).then(function(ret){
          _this.loading = false;
          if(ret.ok && ret.data && ret.data.result == 'ok'){
              _this.items = ret.data.data.data;
          }
        });
      },
      clearData:function(){
        this.items = [];
      },
      detail:function(id,name){
        Constant.shopInfo = {
          id:id,
          name:name
        };
        router.go({name:'default'});
      }
    }
  };
</script>

<style scoped>
 .content{
   background: #fff;
 }

 .items-list li {
   padding: 15px 10px;
 }
 .item-name {
   white-space: normal;
   word-break: normal;
   font-size: 14px;
 }
</style>
