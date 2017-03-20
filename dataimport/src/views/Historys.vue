<template>
  <div class="page-group">
    <div class="page page-current" id="index">
      <header class="bar bar-nav">
        <h1 class='title' v-i18n="{value:'poshistorytitle'}"></h1>
        <a class="right-menu" v-on:click="goAdd()" v-i18n="{value:'posin'}"></a>
      </header>
      <div class="top-panel">
        <div class="search-box search-box-shop" v-on:click="goToShoplist()">
          <div class="search-box-left"><span class="icon-shop"></span></div>
          <div class="search-box-right">
            <a class="search-shop-tip"  v-show="!shopInfo.id" v-i18n="{value:'selectastore'}"></a>
            <span class="search-shop"   v-show="shopInfo.id">{{shopInfo.name}}</span>
          </div>
        </div>
        <div class="search-box search-box-time" v-on:click="searchMore()">
          <div class="search-box-left"><span class="icon-calendar"></span></div>
          <div class="search-box-right">
            <div class="search-time">
              <div class="timebox">
                <label class="date-time">{{search.startTime}}<span class="is-today"
                                                                   v-show="search.startTime|istoday" v-i18n="{value:'today'}"></span></label><br>
                <span class="datetime-tip" v-i18n="{value:'starttime'}"></span>
              </div>
              <div class="to">～</div>
              <div class="timebox">
                <label class="date-time">{{search.endTime}}<span class="is-today"
                                                                 v-show="search.endTime|istoday" v-i18n="{value:'today'}"></span></label><br>
                <span class="datetime-tip" v-i18n="{value:'endtime'}"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="historysContent" class="content content-items pull-to-refresh-content infinite-scroll"  data-ptr-distance="55" data-distance="240">
        <div class="pull-to-refresh-layer">
          <div class="preloader"></div>
          <div class="pull-to-refresh-arrow"></div>
        </div>
        <div class="items-list">
          <ul>
            <li v-for="item in items" v-on:click="detail(item)">
              <div class="item-des">
                <!--<span class="item-name">{{item.depName}}</span>-->
                <span class="item-time">{{item.create_time.substring(0,10)}}</span>
                <!--<span class="item-user">{{item.creater.showName}}</span>-->
              </div>
              <div class="item-des item-br">
                <!--<label class="item-label">销售单数</label><span class="item-num">{{item.dealPersonNum}}</span>
                <label class="item-label">销售件数</label><span class="item-num">{{item.dealNum}}</span>
                <label class="item-label">总销售额</label><span class="item-num item-num-large">{{item.total}}</span>-->
                <label class="item-num"><span class="person-value">{{item.dealPersonNum}}</span><span v-i18n="{value:'dan'}"></span></label>
                <!--<label class="item-num"><span class="deal-value">{{item.dealNum}}</span>件</label>-->
                <label class="item-num item-num-large"><span class="total-value">{{item.total}}</span><span v-i18n="{value:'money'}"></span></label>
              </div>
            </li>
          </ul>
        </div>
        <div class="items-list no-data" v-show="nodata" v-i18n="{value:'nohistorydata'}">
        </div>
        <div class="infinite-scroll-preloader">
          <div class="preloader"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    require('../../../common/assets/font.css');
    var Vue = require('vue');
    var commonutils = require('../../../common/assets/js/commonutils');
    var num = 20;//每页显示的条数
    module.exports =  {
        route:{
            data:function(transition){
                if(Constant.shopInfo.id && Constant.search.startTime){
                    var _this = this;
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
                            search:Constant.search,
                            shopInfo:Constant.shopInfo
                        });
                    }
                }else{
                    setTimeout(function(){
                        $.detachInfiniteScroll($('#historysContent'));
                        $('#historysContent .infinite-scroll-preloader').hide();
                    },500);
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
            }
        },
        created:function(){

        },
        ready:function(){
            Constant.search = this.search;
            this.initData();
            this.init();
        },
        methods:{
            initData:function(){
                var time = commonutils.getThisWeekTime();
                this.search.startTime = time.startTime;
                this.search.endTime = time.endTime;
            },
            init:function(){
                var _this = this;
                if(!this.refreshInit){
                    $('#historysContent').scroller({
                        type: 'native'
                    });
                    $.initPullToRefresh('#historysContent');
                    $(document).on('refresh','#historysContent',function(e){
                        if(_this.items.length == 0){
                            $.pullToRefreshDone('#historysContent');
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
                $.detachInfiniteScroll($('#historysContent'));
                $('#historysContent .infinite-scroll-preloader').hide();
            },
            bindInfiniteEvent:function(){
                var _this = this;
                $.attachInfiniteScroll($('#historysContent'));
                $('#historysContent .infinite-scroll-preloader').show();
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
                $(document).off('infinite','#historysContent',func).on('infinite','#historysContent',func);
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
                Vue.http.options.emulateJSON = false;
                this.$http.post('/service/getSaleList.action?token='+Constant.token,{
                    dep_id:searchData.shopInfo.id,
                    start_time:searchData.search.startTime+" 00:00:00",
                    end_time:searchData.search.endTime+" 23:59:59",
                    pageNumber:searchData.page.index/searchData.page.num+1,
                    pageSize:searchData.page.num
                }).then(function(ret){
                    _this.loading = false;
                    Vue.http.options.emulateJSON = true;
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
                this.searchName = '';
            },
            refresh:function(){
                if (!this.shopInfo.id) {
                    $.pullToRefreshDone('#historysContent');
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
                    $.pullToRefreshDone('#historysContent');
                });
            },
            detail: function (item) {
                Constant.currentDate = item.create_time.substring(0,10);
                router.go({path:'/saledetail'});
            },
            searchMore:function(){
                Constant.search = this.search;
                router.go({path:'/search'});
            },
            goToShoplist:function(){
                router.go({path:'/shoplist'});
            },
            goAdd:function(){
                window.location.href = 'index.html?token='+Constant.token+'&name='+encodeURIComponent(Constant.shopInfo.name)+'&id='+Constant.shopInfo.id;
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
  #historysContent{overflow-x: hidden;top:100px;z-index:4;background: #eee;}
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