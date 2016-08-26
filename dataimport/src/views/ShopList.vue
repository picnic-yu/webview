<template>
  <div class="page-group">
    <div class="page page-current" id="index">
      <header class="bar bar-nav">
        <h1 class='title'>选择门店</h1>
      </header>
      <div class="bar bar-header-secondary">
        <div class="searchbar">
          <a class="searchbar-cancel" v-on:click="cancelSearch()">取消</a>
          <div class="search-input">
            <label class="icon icon-search" for="search"></label>
            <input type="search" id="search" v-model="searchName" placeholder="请输入门店的名称"/>
          </div>
        </div>
      </div>
      <div id="shopListContent" class="content content-items pull-to-refresh-content infinite-scroll"  data-ptr-distance="55" data-distance="240">
        <div class="pull-to-refresh-layer">
            <div class="preloader"></div>
            <div class="pull-to-refresh-arrow"></div>
        </div>
        <div class="items-list">
          <ul>
            <li v-for="item in items" v-on:click="detail(item.id,item.name)">
              <div class="item-left">
                <div class="item-name">{{item.name}}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="infinite-scroll-preloader">
          <div class="preloader"></div>
        </div>
      </div>
    </div>
</template>

<script>
  var num = 20;//每页显示的条数
  var searchTimer = null;
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
            page:{
              index:0,
              num:num
            }
          });
        }
        transition.next({
          page:{
            index:0,
            num:num
          }
        });
      },
      deactivate:function(transition){
        this.unbindInfinite();
        this.clearData();
        transition.next();
      }
    },
    data:function(){
      return {
        page:{
          index:0,
          num:num,
          total:0
        },
        loading:false,
        items:[],
        searchName:'',
        scrollInit:false,
        refreshInit:false
      };
    },
    watch:{
      /**
       * 监听搜索框的变化
       * @param newValue
       * @param oldValue
       */
      'searchName':function(newValue,oldValue){
        if(newValue != oldValue){
          if(searchTimer){
            clearTimeout(searchTimer);
            searchTimer = null;
          }
          var _this = this;
          searchTimer = setTimeout(function(){
            _this.searchName = newValue;
            _this.page.index = 0;
            _this.getData(function(){
              if(_this.page.total <= _this.items.length){
                _this.unbindInfinite();
              }
              $.refreshScroller();
            },_this);
          },500);
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
          $('#shopListContent').scroller({
            type: 'native'
          });
          $.initPullToRefresh('#shopListContent');
          $(document).on('refresh','#shopListContent',function(e){
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
        },opt);
      },
      reInitScroll:function(){
        this.unbindInfinite();
        this.bindInfiniteEvent();
      },
      unbindInfinite:function(){
        $.detachInfiniteScroll($('#shopListContent'));
        $('#shopListContent .infinite-scroll-preloader').hide();
      },
      bindInfiniteEvent:function(){
        var _this = this;
        $.attachInfiniteScroll($('#shopListContent'));
        $('#shopListContent .infinite-scroll-preloader').show();
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
        $(document).off('infinite','#shopListContent').on('infinite','#shopListContent',func);
      },
      getData:function(callback,searchData){
        var _this = this;
        this.loading = true;
        searchData = searchData?searchData:this;
        this.$http.post('/service/getUserShopListForWebview.action?token='+Constant.token,{
          containDevice: 0,
          name:searchData.searchName,
          index:searchData.page.index,
          num:searchData.page.num
        }).then(function(ret){
          _this.loading = false;
          if(ret.ok && ret.data && ret.data.result == 'ok'){
            if(_this.page.index == 0){
              _this.items = ret.data.data.data;
            }else{
              _this.items = _this.items.concat(ret.data.data.data);
            }
            _this.page.total = ret.data.data.total;
            callback && callback();
          }
        });
      },
      cancelSearch:function(){
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
        this.items = [];
        this.reInitScroll();
        var _this = this;
        this.getData(function(){
          if(_this.page.total <= _this.items.length){
            _this.unbindInfinite();
          }
          $.pullToRefreshDone('#shopListContent');
        });
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
