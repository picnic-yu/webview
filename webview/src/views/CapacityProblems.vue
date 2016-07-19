<template>
  <div class="page-group">
    <div class="page page-current" id="index">
      <header class="bar bar-nav">
        <h1 class='title'>{{title}}</h1>
      </header>
      <div class="nav-content" v-show="reportType==3">
        <div class="tab-panel bar bar-nav">
          <div class="buttons-tab head-tab">
            <a v-on:click="showAll(1)" class="tab-link  button" v-bind:class="display.showall?'active':''">所有问题</a>
            <a v-on:click="showAll(0)" class="tab-link button" v-bind:class="!display.showall?'active':''">已整改问题</a>
          </div>
        </div>
      </div>
      <div id="capacityProblemContent" class="content content-items pull-to-refresh-content infinite-scroll" v-bind:class="reportType==3?'content-is':''" data-ptr-distance="55" data-distance="240">
        <div class="pull-to-refresh-layer">
            <div class="preloader"></div>
            <div class="pull-to-refresh-arrow"></div>
        </div>
        <div class="items-list">
          <ul>
            <li v-for="item in items" class="items-list-li">
              <div class="item-container">
                <div class="item-left">
                  <a class="pb-standalone" index="{{$index}}"><img v-bind:src="item.pictureUrl" width="68px" height="68px"/></a>
                </div>
                <div class="item-right">
                  <div class="item-name">{{item.deptName}}</div>
                  <div class="item-name item-sub">{{item.problemClassify.problemClassifyName}}</div>
                  <div class="item-des">
                    <div class="item-b-left">
                      <span class="item-label item-username">{{item.createUserName}}</span>
                      <span class="item-label">{{item.sourceType|whichsourcetype}}</span>
                      <span class="item-label">{{item.createTimeShow}}</span>
                    </div>
                    <span class="item-num" v-bind:class="item.status==4?'state-best':''">{{item.status|whichstatus}}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="items-list no-data" v-show="items.length == 0">
            没有任何问题记录
          </div>
        </div>
        <div class="infinite-scroll-preloader">
          <div class="preloader"></div>
        </div>
      </div>
    </div>
</template>

<script>
  require('../../../common/assets/css/sm-extend.min.css');
  require('../../../common/assets/font.css');
  require('../../../common/libs/sm-extend.js');
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
            display:{
              showall:true
            },
            search:Constant.search,
            reportType:this.$route.params.type,
            userId:this.$route.params.userId
          });
        }
        transition.next({
          title:Constant.capacityParam.problemsPage.title,
          search:Constant.search,
          reportType:this.$route.params.type,
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
      /**
       * 将小数（0.8222）装化为百分比
       * @param rate
       * @returns {number}
       */
      whichsourcetype:function(sourcetype){
        if(sourcetype == 1){
          return "图片点检";
        }else if(sourcetype == 2){
          return "摇一摇";
        }else if(sourcetype == 3){
          return "抓拍";
        }else if(sourcetype == 4){
          return "手动创建";
        }else if(sourcetype == 5){
          return "在线考评";
        }else if(sourcetype == 6){
          return "快拍";
        }else if(sourcetype == 7){
          return "告警";
        }else if(sourcetype == 8){
          return "现场巡店";
        }
      },
      whichstatus:function(status){
        if(status == 5){
          return '待整改';
        }else if(status == 4){
          return '整改完成';
        }else if(status == 3){
          return '待复检';
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
          $('#capacityProblemContent').scroller({
            type:'native'
          });
          $.initPullToRefresh('#capacityProblemContent');
          $(document).on('refresh','#capacityProblemContent',function(e){
            if(_this.items.length == 0){
              $.pullToRefreshDone('#capacityProblemContent');
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
        $.detachInfiniteScroll($('#capacityProblemContent'));
        $('#capacityProblemContent .infinite-scroll-preloader').hide();
      },
      bindInfiniteEvent:function(){
        var _this = this;
        $.attachInfiniteScroll($('#capacityProblemContent'));
        $('#capacityProblemContent .infinite-scroll-preloader').show();
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
        $(document).off('infinite','#capacityProblemContent',func).on('infinite','#capacityProblemContent',func);
      },
      bindPicEvent:function(){
        //点击时打开图片浏览器
        var _this = this;
        var photos = [];
        for(var i=0;i<this.items.length;i++){
          var url = this.items[i].pictureUrl;
          photos.push(url?url:'');
        }
        //获取当前点击的记录的图片信息
        var myPhotoBrowserStandalone = $.photoBrowser({
          photos : photos,
          toolbar: false,
          theme: 'dark',
          loop: false,
          lazyLoading: true,
          lazyLoadingInPrevNext: true,
          navbarTemplate:'<header class="bar bar-nav">' +
          '<a class="icon icon-right pull-right photo-browser-close-link icon-cross"></a>' +
          '<h1 class="title" style="float: left;"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">/</span> <span class="photo-browser-total"></span></div></h1>' +
          '</header>'
        });
        $(document).off('click','.pb-standalone').on('click','.pb-standalone',function(){
          var index = $(this).attr('index');
          myPhotoBrowserStandalone.open(index);
        });
      },
      getData:function(callback,searchData){
        var _this = this;
        this.loading = true;
        searchData = searchData?searchData:this;
        var url = '';
        searchData.reportType = this.$route.params.type;
        searchData.userId = this.$route.params.userId;
        if(searchData.reportType == 0){//高管发现的问题列表
          url = '/service/getProblemsByFindUser.action';
        }else if(searchData.reportType == 3){//店长整改问题列表
          url = '/service/getProblemsByHandlerUser.action';
        }
        this.$http.post(url,{
          startDate:searchData.search.startTime+" 00:00:00",
          endDate:searchData.search.endTime+" 23:59:59",
          userId:searchData.userId,
          state:searchData.display.showall?-1:4,
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
            _this.bindPicEvent();
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
          $.pullToRefreshDone('#capacityProblemContent');
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
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding:5px 0px;
  }
  .item-des{
    height: auto;
    line-height: normal;
    width: 100%;
  }
  .item-left{
    width:80px;
    float: left;
    padding-right: 10px;
    display: flex;
    height: 68px;
  }
  .item-right{
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: calc(100% - 80px);
    flex-direction: column;
  }
  .item-name{
    font-size: 16px;
    overflow: hidden;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    white-space:nowrap;
    width: 100%;
  }
  .item-sub {
    color: #666;
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
