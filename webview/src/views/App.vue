<template>
  <div class="page-group">
    <div class="page page-current" id="index">
      <header class="bar1 bar-nav" style="padding-left:0px;">
        <menu class="tabs-menu">
          <div class="tabs-menu-inner">
            <div class="buttons-tab head-tab">
              <a v-on:click="showWhichChart(0)" class="tab-link  button"
                 v-bind:class="currentIndex==0?'active':''"><span class="text-title" v-i18n="{value:'common.store'}"></span></a>
              <a v-on:click="showWhichChart(1)" class="tab-link button"
                 v-bind:class="currentIndex==1?'active':''"><span class="text-title" v-i18n="{value:'common.center'}"></span></a>
              <a v-on:click="showWhichChart(2)" class="tab-link button"
                 v-bind:class="currentIndex==2?'active':''"><span class="text-title" v-i18n="{value:'common.order'}"></span></a>
            </div>
          </div>
        </menu>
      </header>
      <div id="contentList" class="content infinite-scroll"  data-distance="100">
        <div v-show="currentIndex!=2" class="search-box" v-on:click="searchMore()">
          <div class="timebox">
            <label class="date-time">{{search.startTime}}<span class="is-today" v-show="search.startTime|istoday" v-i18n="{value:'common.today'}"></span></label>
            <span class="datetime-tip" v-i18n="{value:'common.starttime'}"></span>
          </div>
          <div>～</div>
          <div class="timebox">
            <label class="date-time">{{search.endTime}}<span class="is-today" v-show="search.endTime|istoday" v-i18n="{value:'common.today'}"></span></label>
            <span class="datetime-tip" v-i18n="{value:'common.endtime'}"></span>
          </div>
        </div>
        <component v-bind:search="search" :is="currentView" keep-alive transition="fade" transition-mode="out-in"></component>
        <!--<shopchart v-bind:search="search" :is="display.shopChart"></shopchart>
        <itemchart v-bind:search="search" :is="!display.shopChart"></itemchart>-->
        <div class="infinite-scroll-preloader">
          <div class="preloader"></div>
        </div>
      </div>
    </div>
    <!--<searchbox v-bind:search.sync="search"></searchbox>-->
    <router-view keep-alive  transition="slide" ></router-view>
  </div>
</template>

<script>
    require('../../../common/assets/font.css');
    var commonutils = require('../../../common/assets/js/commonutils');
    module.exports =  {
        route:{
            data:function(transition){
                if(Constant.search.startTime && (transition.from.path != '/items'&& transition.from.path != '/shops')){//如果是上一个界面返回的则不作任何处理
                    this.loadData(Constant.search);
                    transition.next({
                        search:Constant.search
                    });
                }
            }
        },
        data:function(){
            return {
                search:{//该属性会传递到子组件searchbox中
                    startTime:'',
                    endTime:''
                },
                display:{
                    shopChart:true
                },
                currentIndex:0,
                currentView:'shopchart'
            }
        },
        components: {
            shopchart:function(resolve){
                require(['../components/ShopChart'],resolve);
            },
            itemchart:function(resolve){
                require(['../components/ItemChart'],resolve);
            },
            capacitychart:function(resolve){
                require(['../components/CapacityChart'],resolve);
            }
        },
        created:function(){
            this.init();
        },
        ready:function(){
            Constant.search = this.search;
        },
        methods:{
            init:function(){
                //var time = commonutils.getThisWeekTime();
                var time = commonutils.getThisMonthTime();
                this.search.startTime = time.startTime;
                this.search.endTime = time.endTime;
            },
            searchMore:function(){
                Constant.search = this.search;
                router.go({path:'/search'});
            },
            loadData:function(search){
                this.$broadcast('refresh-reportdata',{
                    search:search?search:this.search,
                    chartType:this.currentIndex
                });
            },
            showWhichChart:function(index){
                this.currentIndex = index;
                if(index == 0)
                    this.currentView = 'shopchart';
                else if(index == 1)
                    this.currentView = 'itemchart';
                else if(index == 2){
                    this.currentView = 'capacitychart';
                }
                this.loadData();
            }
        }
    };
</script>

<style>
  *{
    -webkit-touch-callout:none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
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
  .head-tab{
    justify-content:flex-start;
  }
  .content{overflow-x: hidden}

  /*.buttons-tab.head-tab a.tab-link{width:auto;top:0px;height:44px;line-height: 44px;color: #999;padding-left: 3px;padding-right: 3px;font-size: 14px;}*/
  .buttons-tab.head-tab a.tab-link {
    width: 33%;
    top: 0px;
    height: 44px;
    line-height: 44px;
    color: #999;
    padding-left: 3px;
    padding-right: 3px;
    font-size: 14px;
  }

  /*.buttons-tab.head-tab .button.active{border-color:#f90; color: #333;font-size: 14px}*/
  .text-title {
    display: inline-block;
    padding: 0 6px;
    height: 2.2rem;
  }

  .buttons-tab.head-tab .button.active .text-title {
    border-bottom: 2px solid #f90;
    color: #333;
    font-size: 14px;
  }

  .buttons-tab.head-tab .button.active {
    border: none;
  }
  .search-box{
    text-align: center;
    display: flex;
    align-items:center;
    justify-content:space-around;
    height:58px;
    background: #eee;
  }
  .timebox{
    display: flex;
    align-items:flex-start;
    justify-content:center;
    flex-direction:column;
  }
  .timebox .date-time{font-size: 16px;}
  .timebox .datetime-tip{font-size: 12px;color:#999;}
  header.bar,.content{background: #fff;}
  .is-today{color:#f90;font-size: 15px;}
  .board-box{
    height:100px;
    display: flex;
    align-items:center;
    justify-content:space-around;
    position: relative;
  }
  .board-cell{
    display: flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
  }
  .cell-tip{color:#999;font-size: 12px;}
  .cell-value{font-size: 45px;line-height: 50px;}
  .boardbox-splitor{width:2px;background: #ccc;height:55px;}
  .fade-transition{
    transition: opacity .5s ease;
  }
  .fade-enter,.fade-leave{
    opacity: 0;
  }


  .top-panel{
    background: #eee;
    padding:5px 10px;
    font-size: 14px;
  }
  .items-list{

  }
  .items-list ul{margin:0;padding:0px;}
  .items-list li{border-bottom: 1px solid #ddd;padding:10px 10px;display: flex;align-items: center;}
  .item-name{
    word-wrap: break-word;
    white-space: pre;
    font-size:16px;
    white-space: normal;
  }
  .item-des{
    height: 20px;
    line-height: 20px;
  }
  .item-left{width:80%;}
  .item-des span,.item-des label,.item-des{
    vertical-align: middle;
  }
  .item-label{
    color: #999;
    font-size: 12px;
    margin-right: 2px;
  }
  .item-num{
    color:red;
    font-size: 12px;
  }
  .item-splitor{
    display: inline-block;
    width:1px;
    background: #ddd;
    height:12px;
    margin:0 10px;
  }
  .item-rate{
    font-size: 20px;
  }
  .icon-info{
    margin-left:4px;
    font-size: 14px;
    vertical-align: text-bottom;
  }
  .tabs-menu{
    width:100%;
    height:44px;
    position: relative;
    overflow: hidden;
    margin:0px;
    padding:0px;
  }
  .tabs-menu-inner{
    width: 100%;
    height: 52px;
    overflow-x: auto;
    position: relative;
  }
  .tabs-menu-inner .head-tab{
    /*width: 400px;*/
    width: 100%;
    left:0px;
    overflow: hidden;
    position: absolute;
  }

  .bar1 {
    position: absolute;
    right: 0;
    left: 0;
    z-index: 10;
    height: 2.2rem;
    padding-right: 0rem;
    padding-left: 0rem;
    background-color: #f7f7f8;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  @media all and (max-width:360px){
    .cell-value{font-size: 38px;line-height: 40px;}
  }
</style>