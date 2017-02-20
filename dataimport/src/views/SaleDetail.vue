<template>
  <div class="page-group">
    <div class="page page-current" id="index">
      <header class="bar bar-nav">
        <h1 class='title'>{{currentDate}}销售详情</h1>
        <a class="right-menu" v-on:click="addDetail()">录入</a>
      </header>
    <div id="saleDataContent" class="content content-items pull-to-refresh-content infinite-scroll"  data-ptr-distance="55" data-distance="240">
      <div class="pull-to-refresh-layer">
        <div class="preloader"></div>
        <div class="pull-to-refresh-arrow"></div>
      </div>
      <div class="items-list">
        <ul>
          <li v-for="item in items" v-on:click="getDetail(item)">
            <div class="item-des">
              <!--<span class="item-name">{{item.depName}}</span>-->
              <span class="item-time">{{item.create_time.replace('T',' ')}}</span>
              <span class="item-user">{{item.createrName}}</span>
            </div>
            <div class="item-des item-br">
              <label class="item-num"><span class="person-value">{{item.dealPersonNum}}</span>单</label>
              <!--<label class="item-num"><span class="deal-value">{{item.dealNum}}</span>件</label>-->
              <label class="item-num item-num-large"><span class="total-value">{{item.total}}</span>元</label>
            </div>
          </li>
        </ul>
      </div>
      <div class="items-list no-data" v-show="nodata">
        没有任何记录
      </div>
      <div class="infinite-scroll-preloader">
        <div class="preloader"></div>
      </div>
    </div>
  </div>
  <detail></detail>
  </div>
</template>

<script>
  require('../../../common/assets/font.css');
  var commonutils = require('../../../common/assets/js/commonutils');
  var num = 20;//每页显示的条数
  module.exports =  {
    route:{
      data:function(transition){
        if(Constant.shopInfo.id && Constant.currentDate){
          var _this = this;
          _this.currentDate = Constant.currentDate;
          if(this.refreshInit){
            this.getData(function(){
              if(_this.page.total <= _this.items.length){
                _this.unbindInfinite();
              }
              $.refreshScroller();
            },{
              page:{
                index:0,
                num:num
              },
              currentDate:Constant.currentDate,
              shopInfo:Constant.shopInfo
            });
          }
        }
        transition.next({
          currentDate:Constant.currentDate,
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
        currentDate:'',
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
      }
    },
    created:function(){

    },
   events:{
        'refresh':function(){
            this.refresh();
        }
   },
   components:{
       detail: require('./../components/Detail.vue')
    },
    ready:function(){
      this.initData();
      this.init();
    },
    methods:{
      initData:function(){

      },
      init:function(){
        var _this = this;
        if(!this.refreshInit){
          $('#saleDataContent').scroller({
            type: 'native'
          });
          $.initPullToRefresh('#saleDataContent');
          $(document).on('refresh','#saleDataContent',function(e){
            if(_this.items.length == 0){
                  $.pullToRefreshDone('#saleDataContent');
                  return;
                }
             _this.refresh();
          });
          this.refreshInit = true;
        }
        this.bindInfiniteEvent();
        var _this = this;
        this.getData(function(){
          if(_this.page.total <= _this.items.length){
            _this.unbindInfinite();
          }
          $.refreshScroller();
        });
      },
      reInitScroll:function(){
        this.unbindInfinite();
        this.bindInfiniteEvent();
      },
      unbindInfinite:function(){
          $.detachInfiniteScroll($('#saleDataContent'));
          $('#saleDataContent .infinite-scroll-preloader').hide();
      },
      bindInfiniteEvent:function(){
        var _this = this;
        $.attachInfiniteScroll($('#saleDataContent'));
        $('#saleDataContent .infinite-scroll-preloader').show();
        var func = function(e){
          if(_this.loading) return;
          _this.page.index += _this.page.num;
          _this.getData(function(){
            if(_this.page.total <= _this.items.length){
              _this.unbindInfinite();
            }
            $.refreshScroller();
          });
        };
        $(document).off('infinite','#saleDataContent',func).on('infinite','#saleDataContent',func);
      },
      getData:function(callback,searchData){
        var _this = this;
        this.loading = true;
        searchData = searchData?searchData:this;
        if (!searchData.shopInfo.id) {
          this.unbindInfinite();
          $.refreshScroller();
          return;
        }
        this.$http.post('/service/getSaleDetails.action?token='+Constant.token,{
          dep_id:searchData.shopInfo.id,
          start_time:searchData.currentDate,
          pageNumber:searchData.page.index/searchData.page.num+1,
          pageSize:searchData.page.num
        }).then(function(ret){
          _this.loading = false;
          if(ret.ok && ret.data && ret.data.result == 'ok'){
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
        if (!this.shopInfo.id) {
          $.pullToRefreshDone('#saleDataContent');
          return;
        }
        this.page.index = 0;
        this.items = [];
        this.reInitScroll();
        var _this = this;
        this.getData(function(){
          if(_this.page.total <= _this.items.length){
            _this.unbindInfinite();
          }
          $.pullToRefreshDone('#saleDataContent');
        });
      },
      getDetail:function(item){
        this.$broadcast('popup', {
          name: 'detail',
          item: item,
          flag:true
        });
      },
      addDetail:function(){
            this.$broadcast('popup', {
                name: 'detail',
                item: {create_time:this.currentDate,dep_name:this.shopInfo.name},
                flag:false
             });
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
  #saleDataContent{overflow-x: hidden;z-index:4;background: #eee;}
  .buttons-tab.head-tab a.tab-link{width:120px;top:0px;height:44px;line-height: 44px;color: #999;}
  .buttons-tab.head-tab .button.active{border-color:#f90; color: #333;font-size: 18px}
  .timebox{
    /*display: flex;
    align-items:flex-start;
    justify-content:center;
    flex-direction:column;*/
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

  .search-shop-tip{
    color: #999;
    height:30px;
    line-height: 30px;
  }
  .search-shop{
    color: #333;
    max-width: 200px;
    max-width: calc(100% - 80px);
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

  .items-list li {
    border-bottom: 1px solid #ddd;
    padding: 5px 10px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }
  .item-des{
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 26px;
  }
  .item-num{
    color:#333;
    font-size: 12px;
    display: inline-block;
    width: 100px;
    overflow: hidden;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    white-space:nowrap;
  }

  .item-num span {
    font-size: 16px;
  }
  .item-num-large{
    width: auto;
  }
  .item-user{
    color:#999;
    font-size: 12px;
    margin-left: 20px;
  }
  .item-time{
    color:#333;
    font-size: 12px;
  }

  .person-value {
    vertical-align: baseline;
  }

  @media all and (max-width: 360px) {
    .timebox .date-time {
      font-size: 12px;
    }

    .is-today {
      font-size: 12px;
    }
  }
</style>
