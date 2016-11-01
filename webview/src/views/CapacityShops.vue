<template>
  <div class="page-group">
    <div class="page page-current" id="index">
      <header class="bar bar-nav">
        <h1 class='title'>{{title}}</h1>
      </header>
      <div class="top-panel bar">
        <div class="searchbar">
          <a class="searchbar-cancel" v-on:click="cancelSearch()">取消</a>
          <div class="search-input">
            <label class="icon icon-search" for="search"></label>
            <input type="search" id="search" v-model="searchName" placeholder="请输入门店名进行查询"/>
          </div>
        </div>
      </div>
      <div id="shopPage3Content" class="content content-items pull-to-refresh-content infinite-scroll"  data-ptr-distance="55" data-distance="240">
        <div class="pull-to-refresh-layer">
            <div class="preloader"></div>
            <div class="pull-to-refresh-arrow"></div>
        </div>
        <div class="items-list">
          <ul>
            <li v-for="item in items" class="items-list-li">
              <div class="item-container">
                <div class="item-name">{{item.name}}</div>
              </div>
            </li>
          </ul>
          <div class="items-list no-data" v-show="items.length == 0">
            没有任何点检门店
          </div>
        </div>
        <div class="infinite-scroll-preloader">
          <div class="preloader"></div>
        </div>
      </div>
    </div>
</template>

<script>
  var num = 20;//每页显示的条数
  var searchTimer;
  module.exports =  {
    route:{
      data:function(transition){
        if(this.refreshInit){
          this.getData('',{
            page:{
              index:0,
              num:num
            },
            search:Constant.search,
            display:{
              showall:true
            },
            userId:this.$route.params.userId
          });
        }
        transition.next({
          title:Constant.capacityParam.itemsPage.title,
          search:Constant.search,
          userId:this.$route.params.userId,
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
        search:'',
        title:'',
        page:{
          index:0,
          num:num,
          total:0
        },
        loading:false,
        items:[],
        userId:'',
        searchName: '',
        scrollInit:false,
        refreshInit:false
      };
    },
    watch: {
      /**
       * 监听搜索框的变化
       * @param newValue
       * @param oldValue
       */
      'searchName': function (newValue, oldValue) {
        if (newValue != oldValue) {
          if (searchTimer) {
            clearTimeout(searchTimer);
            searchTimer = null;
          }
          var _this = this;
          searchTimer = setTimeout(function () {
            _this.searchName = newValue;
            _this.page.index = 0;
            _this.getData(null, _this);
          }, 500);
        }
      }
    },
    ready:function(){
      this.init();
    },
    methods:{
      init:function(opt){
        var _this = this;
        if(!this.refreshInit){
          $('#shopPage3Content').scroller({
            type:'native'
          });
          $.initPullToRefresh('#shopPage3Content');
          $(document).on('refresh','#shopPage3Content',function(e){
            _this.refresh();
          });
          this.refreshInit = true;
        }
        this.bindInfiniteEvent();
        this.getData('', opt);
      },
      reInitScroll:function(){
        this.unbindInfinite();
        this.bindInfiniteEvent();
      },
      unbindInfinite:function(){
        $.detachInfiniteScroll($('#shopPage3Content'));
        $('#shopPage3Content .infinite-scroll-preloader').hide();
      },
      bindInfiniteEvent:function(){
        var _this = this;
        $.attachInfiniteScroll($('#shopPage3Content'));
        $('#shopPage3Content .infinite-scroll-preloader').show();
        var func = function(){
          if(_this.loading) return;
          _this.page.index += _this.page.num;
          _this.getData();
        };
        $(document).off('infinite','#shopPage3Content',func).on('infinite','#shopPage3Content',func);
      },
      getData:function(callback,searchData){
        var _this = this;
        this.loading = true;
        searchData = searchData?searchData:this;
        searchData.userId = this.$route.params.userId;
        this.$http.post('/service/getCoverDeptsByUser.action',{
          startDate:searchData.search.startTime+" 00:00:00",
          endDate:searchData.search.endTime+" 23:59:59",
          userId:searchData.userId,
          index:searchData.page.index,
          num:searchData.page.num,
          searchName: searchData.searchName,
          token:Constant.token
        }).then(function(ret){
          _this.loading = false;
          if(ret.ok && ret.data && ret.data.result == 'ok'){
            if(_this.page.index == 0){
              _this.items = ret.data.data.data;
            }else{
              _this.items = _this.items.concat(ret.data.data.data);
            }
            _this.page.total = ret.data.data.total;
            if (_this.page.total <= _this.items.length) {
              _this.unbindInfinite();
            } else {
              _this.unbindInfinite();
              if (!_this.infiniteInit) {
                setTimeout(_this.reInitScroll, 500);
              }
            }
            callback && callback();
          }
        });
      },
      cancelSearch: function () {
        this.clearData();
        this.refresh();
      },
      clearData:function(){
        this.page.index = 0;
        this.items = [];
        this.searchName = '';
      },
      refresh:function(){
        this.page.index = 0;
        //this.items = [];
        this.unbindInfinite();
        this.getData(function () {
          $.pullToRefreshDone('#shopPage3Content');
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
    top: 44px;
    z-index: 2;
    background: #eee;
  }
  .no-data{
    margin:5px 0px;
    width: 100%;
    text-align: center;
    padding: 10px;
    background: #fff;
    font-size: 14px;
  }
  li.items-list-li{
    margin:5px 0px;
    background: #fff;
    border: none;
    padding:0px 10px;
  }
  .item-container{
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column ;
    width: 100%;
    padding:5px 0px;
  }
  .item-des{
    height: auto;
    line-height: normal;
    width: 100%;
  }
  .item-name{
    font-size: 16px;
    width: 100%;
  }
  .item-sub {
    color: #666;
    font-size: 14px;
  }
  .item-b-left{
    float: left;
    height: 20px;
    line-height: 20px;
    max-width: calc(100% - 40px);
    overflow: hidden;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    white-space:nowrap;
  }
</style>
