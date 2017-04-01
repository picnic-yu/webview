<template>
  <div class="page-group">
    <div class="page page-current" id="index">
      <header class="bar bar-nav">
        <h1 class='title'>{{title}}</h1>
      </header>
      <div class="nav-content">
        <div class="tab-panel bar bar-nav">
          <div class="buttons-tab head-tab">
            <a v-on:click="showAll(1)" class="tab-link  button" v-bind:class="display.showall?'active':''" v-i18n="{value:'checkreport.checkitem'}"></a>
            <a v-on:click="showAll(0)" class="tab-link button" v-bind:class="!display.showall?'active':''" v-i18n="{value:'checkreport.hascheckitem'}"></a>
          </div>
        </div>
      </div>
      <div id="capacityItemContent" class="content content-items content-is pull-to-refresh-content infinite-scroll"  data-ptr-distance="55" data-distance="240">
        <div class="pull-to-refresh-layer">
          <div class="preloader"></div>
          <div class="pull-to-refresh-arrow"></div>
        </div>
        <div class="items-list">
          <ul>
            <li v-for="item in items" class="items-list-li">
              <div class="item-container">
                <div class="item-name">{{item.itemName}}</div>
                <div class="item-des">
                  <div class="item-b-left">
                    <div class="item-name item-sub">{{item.deptName}}</div>
                  </div>
                  <span class="item-num" v-bind:class="item.state==1?'state-best':''">{{item.state|whichstatus}}</span>
                </div>
              </div>
            </li>
          </ul>
          <div class="items-list no-data" v-show="items.length == 0" v-i18n="{value:'checkreport.nochecktask'}">
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
                    display:{
                        showall:true
                    },
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
                display:{
                    showall:true
                },
                loading:false,
                items:[],
                userId:'',
                reportType:-1,
                scrollInit:false,
                refreshInit:false
            };
        },
        filters:{
            whichstatus:function(status){
                if(status == 0){
                    return this.$translate("checkreport.nocheck");
                }else if(status == 1){
                    return this.$translate("checkreport.hascheck");
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
                    $('#capacityItemContent').scroller({
                        type:'native'
                    });
                    $.initPullToRefresh('#capacityItemContent');
                    $(document).on('refresh','#capacityItemContent',function(e){
                        if(_this.items.length == 0){
                            $.pullToRefreshDone('#capacityItemContent');
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
                },opt);
            },
            reInitScroll:function(){
                this.unbindInfinite();
                this.bindInfiniteEvent();
            },
            unbindInfinite:function(){
                $.detachInfiniteScroll($('#capacityItemContent'));
                $('#capacityItemContent .infinite-scroll-preloader').hide();
            },
            bindInfiniteEvent:function(){
                var _this = this;
                $.attachInfiniteScroll($('#capacityItemContent'));
                $('#capacityItemContent .infinite-scroll-preloader').show();
                var func = function(){
                    if(_this.loading) return;
                    _this.page.index += _this.page.num;
                    _this.getData(function(){
                        if(_this.page.total <= _this.items.length){
                            _this.unbindInfinite();
                        }
                        $.refreshScroller();
                    });
                };
                $(document).off('infinite','#capacityItemContent',func).on('infinite','#capacityItemContent',func);
            },
            getData:function(callback,searchData){
                var _this = this;
                this.loading = true;
                searchData = searchData?searchData:this;
                searchData.userId = this.$route.params.userId;
                this.$http.post('/service/getCoverItemsByUser.action',{
                    startDate:searchData.search.startTime+" 00:00:00",
                    endDate:searchData.search.endTime+" 23:59:59",
                    userId:searchData.userId,
                    state:searchData.display.showall?-1:1,
                    index:searchData.page.index,
                    num:searchData.page.num,
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
                    $.pullToRefreshDone('#capacityItemContent');
                });
            },
            showAll:function(all){
                var _this = this;
                this.page.index = 0;
                if(all){
                    this.display.showall = true;
                }else{
                    this.display.showall = false;
                }
                this.reInitScroll();
                this.getData(function(){
                    if(_this.page.total <= _this.items.length){
                        _this.unbindInfinite();
                    }
                    $.refreshScroller();
                });

            },
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
    background: #eee;
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
  .item-label2{
    color: red;
    font-weight: bold;
    font-size: 14px;
  }
  .item-num{
    float: right;
    height: 20px;
    line-height: 20px;
  }
  .no-data{
    margin:5px 0px;
    width: 100%;
    text-align: center;
    padding: 10px;
    background: #fff;
    font-size: 14px;
  }
  .nav-content{
    position: absolute;
    top: 44px;
    height:45px;
    z-index: 3;
    width: 100%;
  }
  .content-is{
    top:45px;
    z-index: 2;
  }
  .tab-panel{
    padding: 0px;
  }
  .buttons-tab.head-tab a.tab-link{width:40%;top:0px;height:44px;line-height: 44px;color: #999;font-size: 14px;}
  .buttons-tab.head-tab .button.active{border-color:#f90; color: #333;font-size: 14px}
  .head-tab{
    justify-content: center;
  }
  @media all and (max-width:360px){
    /*.item-name{
      font-size: 14px;
    }*/
  }
</style>