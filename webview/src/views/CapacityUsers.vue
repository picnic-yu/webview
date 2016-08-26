<template>
  <div class="page-group">
    <div class="page page-current" id="index">
      <header class="bar bar-nav">
        <h1 class='title' v-bind:class="'state-'+key">{{title}}</h1>
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
              <div class="item-container item-container1" v-if="reportType==0">
                <div class="item-left">
                  <div class="item-name">{{item.name}}</div>
                  <!--<div class="item-des">
                  v-on:click="detailProblem(item)"--------------------------------------原来的click事件
                    <label class="item-label">门店总数</label><span class="item-num">{{item.authDeptNum}}</span><span class="item-splitor"></span>
                    <label class="item-label">发现问题总数</label><span class="item-num">{{item.findProblemNum}}</span>
                  </div>
                  <div class="item-des">
                    <label class="item-label">问题总数</label><span class="item-num">{{item.findProblemNumInAuthShop}}</span><span class="item-splitor"></span>
                    <label class="item-label">解决问题总数</label><span class="item-num">{{item.solveProblemNumInAuthShop}}</span>
                  </div>-->
                  <table>
                    <tr>
                      <td class="item-label">门店总数</td>
                      <td class="item-num">{{item.authDeptNum}}</td>
                      <td><span class="item-splitor"></span></td>
                      <td class="item-label">发现问题总数</td>
                      <td class="item-num">{{item.findProblemNum}}</td>
                    </tr>
                    <tr>
                      <td class="item-label">问题总数</td>
                      <td class="item-num">{{item.findProblemNumInAuthShop}}</td>
                      <td><span class="item-splitor"></span></td>
                      <td class="item-label">解决问题总数</td>
                      <td class="item-num">{{item.solveProblemNumInAuthShop}}</td>
                    </tr>
                  </table>
                </div>
                <div class="item-rate" v-bind:class="'state-'+item.belongRegion">
                  {{item.quota==0?item.quota:(item.quota*100).toFixed(1)}}%
                </div>
              </div>
              <div class="item-container item-container1" v-if="reportType==1" v-on:click="detailTask(item)">
                <!--
                  <div class="item-des">
                    <label class="item-label">点检任务总数</label><span class="item-num">{{item.allTaskNum}}</span><span class="item-splitor"></span>
                    <label class="item-label">已完成任务数</label><span class="item-num">{{item.completTaskNum}}</span>
                  </div>
                </div>-->
                <div class="item-left">
                  <div class="item-name">{{item.name}}</div>
                </div>
                <div class="item-rate" v-bind:class="'state-'+item.belongRegion">
                  {{item.quota==0?item.quota:(item.quota*100).toFixed(1)}}%
                </div>
                <!--<div class="item-rate" v-bind:class="'state-'+item.belongRegion">{{item.completionRate | ratefilter}}</div>-->
              </div>
              <div class="item-container item-container1" v-if="reportType==2">
                <div class="item-left">
                  <div class="item-name">{{item.name}}</div>
                  <!--<div class="item-des">v-on:click="detailItem(item)"
                    <label class="item-label">点检项总数</label><span class="item-num">{{item.allCheckItemNum}}</span><span class="item-splitor"></span>
                    <label class="item-label">已点检项数</label><span class="item-num">{{item.checkedItemNum}}</span>
                  </div>-->
                  <table>
                    <tr>
                      <td class="item-label">已点检项数</td>
                      <td class="item-num">{{item.checkedItemNum}}</td>
                      <td><span class="item-splitor"></span></td>
                      <td class="item-label">发现问题数</td>
                      <td class="item-num">{{item.findProblemNum}}</td>
                    </tr>
                    <tr>
                      <td class="item-label">门店总数</td>
                      <td class="item-num">{{item.authDeptNum}}</td>
                      <td><span class="item-splitor"></span></td>
                      <td class="item-label">点检项总数</td>
                      <td class="item-num">{{item.groupItemNum}}</td>
                    </tr>
                  </table>
                </div>
                <!--<div class="item-rate" v-bind:class="'state-'+item.belongRegion">{{item.coverageRate | ratefilter}}</div>-->
                <div class="item-rate" v-bind:class="'state-'+item.belongRegion">
                  {{item.quota==0?item.quota:(item.quota*100).toFixed(1)}}%
                </div>
              </div>
              <div class="item-container" v-if="reportType==3" v-on:click="detailProblem(item)">
                <div class="item-left">
                  <div class="item-name">{{item.name}}</div>
                  <div class="item-des">
                    <label class="item-label">问题总数</label><span class="item-num">{{item.problemTotalNum}}</span><span class="item-splitor"></span>
                    <label class="item-label">整改完成数</label><span class="item-num">{{item.improvementNum}}</span>
                  </div>
                </div>
                <div class="item-rate" v-bind:class="'state-'+item.belongRegion">{{item.improvementRate | ratefilter}}</div>
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
            key:Constant.shopParam.shopsPage.key,
            page:{
              index:0,
              num:num
            },
            search:Constant.search,
            reportType:this.$route.params.type
          });
        }
        transition.next({
          title:Constant.shopParam.shopsPage.title,
          state:Constant.shopParam.shopsPage.state,
          key:Constant.shopParam.shopsPage.key,
          search:Constant.search,
          reportType:this.$route.params.type,
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
        search:'',
        title:'',
        state:'',
        key:'',
        page:{
          index:0,
          num:num,
          total:0
        },
        loading:false,
        items:[],
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
      ratefilter:function(rate){
        var rate100 = rate*100;
        var result = Math.floor(rate100)==rate100?rate100:(rate100).toFixed(1);
        return result+'%';
      }
    },
    ready:function(){
      this.init();
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
        var url = '';
        searchData.reportType = this.$route.params.type;
        if(searchData.reportType == 0){//高管发现问题率
          url = '/service/getManagerReports.action';
        }else if(searchData.reportType == 1){//督导完成率
          url = '/service/getCheckerReportsByComplet.action';
        }else if(searchData.reportType == 2){//督导覆盖率
          url = '/service/getCheckerReportsByCover.action';
        }else if(searchData.reportType == 3){//店长整改问题率
          url = '/service/getStoreManagerReports.action';
        }
        this.$http.post(url,{
          startDate:searchData.search.startTime+" 00:00:00",
          endDate:searchData.search.endTime+" 23:59:59",
          region:searchData.key,
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
          $.pullToRefreshDone('#shopPage2Content');
        });
      },
      /**
       * 进入下一层级，问题列表
       * @param item
       */
      detailProblem:function(item){
        if(this.reportType == 0){
          Constant.capacityParam.problemsPage.title = item.name+'发现的问题';
        }else if(this.reportType == 3){
          Constant.capacityParam.problemsPage.title = item.name+'的问题';
        }
        router.go({name:'capacityproblems',params:{type:this.reportType,userId:item.id}});
      },
      /**
       * 进入下一层级，点检任务列表
       * @param item
       */
      detailTask:function(item){
        Constant.capacityParam.tasksPage.title = item.name+'的点检任务';
        router.go({name:'capacitytasks',params:{userId:item.id}});
      },
      /**
       * 进入下一层级，点检项列表
       * @param item
       */
      detailItem:function(item){
        Constant.capacityParam.itemsPage.title = item.name+'的点检项列表';
        router.go({name:'capacityitems',params:{userId:item.id}});
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
  .item-container{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }
  .item-des{
    height: auto;
    line-height: normal;
  }

  .item-container1 table td.item-num {
    max-width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 4px;
  }
</style>
