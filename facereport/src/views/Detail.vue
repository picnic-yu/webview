<template>
  <div class="page-group" :transition="transitionName">
    <div class="page page-current" id="index">
      <header class="bar bar-nav">
        <span class="pull-left icon-back"></span>
        <h1 class='title' v-on:click="backTo()">人脸分析数据</h1>
      </header>
      <div class="top-panel">
        <label class="date-time">{{search.startTime}}</label>
        ～
        <label class="date-time">{{search.endTime}}</label>
      </div>
      <div id="shopPage2Content" class="content content-items pull-to-refresh-content infinite-scroll"  data-ptr-distance="55" data-distance="240">
        <div class="pull-to-refresh-layer">
            <div class="preloader"></div>
            <div class="pull-to-refresh-arrow"></div>
        </div>
        <div class="items-list">
          <ul>
            <li v-for="item in items">
              <div class="item-des">
                <span class="item-time">{{item.date.substring(0,19)}}</span>
                <span class="item-user">{{item.race|filterrace}}</span>
              </div>
              <div class="item-des item-br">
                <label class="item-num"><span class="person-value">{{item.gender|filtergender}}</span></label>
                <label class="item-num"><span class="deal-value">{{item.age|filterage}}</span></label>
                <label class="item-num"><span class="deal-value">{{item.isGlass|filterglass}}</span></label>
                <label class="item-num"><span class="deal-value">{{item.smiling|filtersmiling}}</span></label>
              </div>
            </li>
          </ul>
        </div>
        <div class="items-list no-data" v-show="nodata">
          没有任何数据
        </div>
        <div class="infinite-scroll-preloader">
          <div class="preloader"></div>
        </div>
      </div>
    </div>
</template>

<script>
  var num = 20;//每页显示的条数
  var utils = require('./../utils');
  module.exports =  {
    route:{
      data:function(transition){
        var _this = this;
        if(this.refreshInit){
          this.getData(function(){
            if(_this.page.total <= _this.items.length){
              _this.unbindInfinite();
            }
            $.refreshScroller();
          },{
            search:Constant.search,
            shopInfo:Constant.shopInfo,
            page:{
              index:0,
              num:num
            }
          });
        }
        transition.next({
          search:Constant.search,
          shopInfo:Constant.shopInfo,
          page:{
            index:0,
            num:num
          }
        });
      },
      deactivate:function(transition){
        this.reInitScroll();
        this.clearData();
        transition.next();
      }
    },
    data:function(){
      return {
        transitionName:'right',
        search:{
          startTime:'',
          endTime:''
        },
        shopInfo:{
          id:'',
          name:''
        },
        page:{
          index:0,
          num:num,
          total:0
        },
        loading:false,
        nodata:false,
        items:[],
        scrollInit:false,
        refreshInit:false
      };
    },
    ready:function(){
      this.init();
    },
    filters: {
      filterrace: function (value) {
        if (value == 0) {
          return "亚洲人";
        } else if (value == 1) {
          return "白人";
        } else {
          return "黑人";
        }
      },
      filtergender: function (value) {
        if (value == 1) {
          return "男性";
        } else {
          return "女性";
        }
      },
      filterage: function (value) {
        return value + "岁";
      },
      filterglass: function (value) {
        if (value == 0) {
          return "不戴眼镜"
        } else {
          return "戴眼镜"
        }
      },
      filtersmiling: function (value) {
        if (value < 10) {
          return "不开心";
        } else if (value >= 10 && value < 30) {
          return "平静";
        } else if (value >= 30 && value < 50) {
          return "开心";
        } else {
          return "很开心";
        }
      }
    },
    methods:{
      init:function(opt){
        var _this = this;
        if(!this.refreshInit){
          $('#shopPage2Content').scroller({
            type:'native'
          });
          $.initPullToRefresh('#shopPage2Content');
          $(document).on('refresh','#shopPage2Content',function(e){
            if(_this.items.length == 0){
              $.pullToRefreshDone('#shopPage2Content');
              return;
            }
            _this.refresh();
          });
          this.refreshInit = true;
        }
        this.bindInfiniteEvent();
        var _this = this;
        this.getData(function(total){
          if(_this.page.total <= _this.items.length){
            _this.unbindInfinite();
          }
          $.refreshScroller();
        },opt);
      },
      backTo: function () {
        var curPathName = Constant.curRoute.pathName;
        var backInfo = utils.getBackPath(curPathName);
        router.go({name: backInfo.parent, params: backInfo.params});
      },
      reInitScroll:function(){
        this.unbindInfinite();
        this.bindInfiniteEvent();
      },
      unbindInfinite:function(){
        $.detachInfiniteScroll($('#shopPage2Content'));
        $('#shopPage2Content .infinite-scroll-preloader').hide();
      },
      bindInfiniteEvent:function(){
        var _this = this;
        $.attachInfiniteScroll($('#shopPage2Content'));
        $('#shopPage2Content .infinite-scroll-preloader').show();
        var func = function(e){
          if(_this.loading) return;
          _this.page.index += _this.page.num;
          _this.getData(function(total){
            if(_this.page.total <= _this.items.length){
              _this.unbindInfinite();
            }
            $.refreshScroller();
          });
        };
        $(document).off('infinite','#shopPage2Content',func).on('infinite','#shopPage2Content',func);
      },
      getData:function(callback,searchData){
        var _this = this;
        this.loading = true;
        searchData = searchData?searchData:this;
        this.$http.post('/getFacePhotos.action?token='+Constant.token,{
          mac:searchData.shopInfo.id,
          startTime:searchData.search.startTime+" 00:00:00",
          endTime:searchData.search.endTime+" 23:59:59",
          minAge:0,
          maxAge:99,
          sex:-1,
          rac:-1,
          glas:-1,
          feeling:-1,
          start:searchData.page.index+1,
          size:searchData.page.num
        }).then(function(ret){
          _this.loading = false;
          if(ret.ok && ret.data){
            if(_this.page.index == 0){
              _this.items = ret.data.data.data;
            }else{
              _this.items = _this.items.concat(ret.data.data.data);
            }
            _this.page.total = ret.data.data.total;
            if(_this.page.total > 0){
              _this.nodata = false;
            }else{
              _this.nodata = true;
            }
            callback && callback();
          }
        });
      },
      clearData:function(){
        this.page.index = 0;
        this.items = [];
      },
      refresh:function(){
        this.page.index = 0;
        this.items = [];
        this.reInitScroll();
        var _this = this;
        this.getData(function(){
          if(_this.page.total <= _this.items.length){
            _this.unbindInfinite();
          }
          $.pullToRefreshDone('#shopPage2Content');
        });
      }
    }
  };
</script>

<style scoped>
  .top-panel{
    z-index: 3;
    width: 100%;
    position: absolute;
    top: 44px;
  }
  .content-items{
    top:31px;
    z-index: 2;
  }

  .no-data{
    text-align: center;
    width: 100%;
    color: red;
    padding: 10px 0px;
  }
</style>
