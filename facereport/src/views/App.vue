<template>
  <div class="page-group" :transition="transitionName">
    <div class="page page-current" id="index">
      <header class="bar bar-nav">
        <span class="pull-left icon-back"></span>
        <h1 class='title' v-on:click="backTo()">人脸报表分析</h1>
      </header>
      <div class="top-panel">
        <div class="search-box search-box-shop" v-on:click="goToShoplist()">
          <div class="search-box-left"><span class="icon-shop"></span></div>
          <div class="search-box-right">
            <a class="search-shop-tip"  v-show="!shopInfo.id">请选择一个智能设备</a>
            <span class="search-shop"   v-show="shopInfo.id">{{shopInfo.name}}</span>
          </div>
        </div>
        <div class="search-box search-box-time" v-on:click="searchMore()">
          <div class="search-box-left"><span class="icon-calendar"></span></div>
          <div class="search-box-right">
            <div class="search-time">
              <div class="timebox">
                <label class="date-time">{{search.startTime}}<span class="is-today"
                                                                   v-show="search.startTime|istoday">今天</span></label><br>
                <span class="datetime-tip">开始时间</span>
              </div>
              <div class="to">～</div>
              <div class="timebox">
                <label class="date-time">{{search.endTime}}<span class="is-today"
                                                                 v-show="search.endTime|istoday">今天</span></label><br>
                <span class="datetime-tip">结束时间</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-allbox">
        <div v-for="per in arr" style="margin-top:10px;">
          <div class="chart-title" v-bind:class="$index==0?'first-chart':''">{{per.name}}</div>
          <div class="chart-box">
            <div v-show="!per.nodata" id={{per.id}} v-bind:style="{width:chart.width+'px',height:'280px'}" class="chart-container"></div>
            <div v-show="per.nodata" id={{per.noid}} v-bind:style="{width:chart.width+'px',height:'280px'}" class="chart-container"></div>
          </div>
          </div>
          <div style="margin-top:10px;" v-on:click="goToAllData()">
            <div class="title-all chart-title" style="padding:20px;">查看全部数据</div>
          </div>
          </div>
      </div>
    </div>
</template>

<script>
  require('../../../common/assets/font.css');
  var commonutils = require('../../../common/assets/js/commonutils');
  var echarts = require('echarts');
  var chartutils = require('../chartutils');
  var arr = [{key:'face.ageL',id:'ageChart',name:'年龄',noid:'nochart1',nodata:true,chartObj:{},colorarr:['#8acc47','#f90','#04bafe','#ff4d27']},
    {key:'face.sex',id:'sexChart',name:'性别',noid:'nochart2',nodata:true,chartObj:{},colorarr:['#8acc47','#ff4d27']},
    {key:'face.glass',id:'glassChart',name:'眼镜',noid:'nochart3',nodata:true,chartObj:{},colorarr:['#ff4d27','#8acc47']},
    {key:'face.feeling',id:'feelingChart',name:'心情',noid:'nochart4',nodata:true,chartObj:{},colorarr:['#8acc47','#f90','#ff4d27']}];
  var i18n={"face.sex.male":"男性",
    "face.sex.female":"女性",
    "face.glass.yes":"戴眼镜",
    "face.glass.no":"不戴眼镜",
    "face.feeling.l2":"开心",
    "face.feeling.l1":"很开心",
    "face.feeling.l3":"平静",
    "face.feeling.l4":"不开心",
    "face.race.white":"白人",
    "face.race.az":"亚洲人",
    "face.race.black":"黑人",
    "face.age.l1":"10岁以下",
    "face.age.l2":"10-20岁",
    "face.age.l3":"21-30岁",
    "face.age.l4":"31-40岁",
    "face.age.l5":"41-50岁",
    "face.age.l6":"50岁以上",
    "face.ageL.level1":"少年",
    "face.ageL.level2":"青年",
    "face.ageL.level3":"中年",
    "face.ageL.level4":"老年"};
  var num = 5;//每页显示的条数
  module.exports =  {
    route:{
      data:function(transition){
        if(Constant.shopInfo.id || Constant.search.startTime){
            this.getData({
              search:Constant.search,
              shopInfo:Constant.shopInfo
            });
        }
        transition.next({
          search:Constant.search,
          shopInfo:Constant.shopInfo
        });
      },
      deactivate:function(transition){
        this.clearData();
        this.transitionName = 'left';
        transition.next();
      }
    },
    data:function(){
      return {
        transitionName: 'show',
        arr:arr,
        search:{
          startTime:'',
          endTime:''
        },
        shopInfo:{
          id:'',
          name:''
        },
        loading:false,
        chart:{
          width:$('body').width()
        }
      }
    },
    ready:function(){
      Constant.search = this.search;
      this.initData();
      this.init();
      this.initChart();
    },
    methods:{
      init:function(){
        this.webviewReady();
        this.getData();
      },
      backTo: function () {
        if ($.device.android) {
          try{
            window.webview && window.webview.closeCurrentInterface();
          } catch (e) {
          }
        } else if ($.device.ios) {
            try {
              window.webkit.messageHandlers.closeCurrentInterface.postMessage(1);
            } catch (e) {
            }
        } else {

        }
      },
      initData:function(){
        var time = commonutils.getThisWeekTime();
        this.search.startTime = time.startTime;
        this.search.endTime = time.endTime;
      },
      initChart:function(){
          for(var i=0;i<arr.length;i++){
              var _this = this;
              var myChart = echarts.init(document.getElementById(arr[i].id));
              myChart.showLoading();
              var option = chartutils.getPieChartOption().option;
              myChart.setOption(option);
              arr[i].chartObj = myChart;
            _this.renderNodataChart(arr[i].noid);
          }
      },
      getData:function(searchData){
        var _this = this;
        this.loading = true;
        searchData = searchData?searchData:this;
        /*if (!searchData.shopInfo.id) {
          this.loading = false;
          return;
        }*/
        this.$http.post('/service/getFaceStatistics.action?token='+Constant.token,{
          mac:searchData.shopInfo.id,
          startTime:searchData.search.startTime+" 00:00:00",
          endTime:searchData.search.endTime+" 23:59:59"
        }).then(function(ret){
          _this.loading = false;
          if(ret.ok && ret.data && ret.data.result == 'ok'){
            var data = ret.data.data.data;
            _this.render(data);
          }
        });
      },
      render:function(data){
        for(var i=0;i<arr.length;i++){
          var myChart = arr[i].chartObj;
          myChart.clear();
          myChart.hideLoading();
          arr[i].nodata = true;
          var sexJsonData = [];
          var sexCategories = [];
          var values = data[arr[i].key];
          var categories = values.categories;
          var datas = values.datas;
          for(var j=0;j<categories.length;j++){
            if(datas[categories[j]]>0){
              arr[i].nodata=false;
            }
            var v = i18n[categories[j]];
            sexCategories.push(v);
            sexJsonData.push({
              name:v,
              value:datas[categories[j]],
              itemStyle : {
                normal : {
                  color:arr[i].colorarr[j]
                }
              }
            });
          }
          if(!arr[i].nodata){
            var option = chartutils.getPieChartOption().option;
            option.dataName = categories;
            option.series[0].data = sexJsonData;
            myChart.setOption(option);
          }
        }
      },
      renderNodataChart:function(id){
        var myChart = echarts.init(document.getElementById(id));
        myChart.setOption(chartutils.getNoDataPieChartOption());
        myChart.dispatchAction({
          type:'highlight',
          seriesIndex:0,
          dataIndex:0
        });
      },
      goToAllData:function(){
        router.go({path:'/detail'});
      },
      clearData:function(){
        this.items = [];
      },
      searchMore:function(){
        Constant.search = this.search;
        router.go({path:'/search'});
      },
      goToShoplist:function(){
        router.go({path:'/shoplist'});
      },
      webviewReady: function () {
        if ($.device.android) {
          try {
            window.webview && window.webview.loadSuccess_webview();
          } catch (e) {
          }
        } else if ($.device.ios) {
          try {
            window.webkit.messageHandlers.loadSuccess_webview.postMessage(1);
          } catch (e) {
          }
        } else {

        }
      }
    }
  };
</script>

<style>

  html {
    height: 100%;
  }
  body {
    height: 100%;
    color:#333;
  }
  ul{list-style: none}
  .buttons-tab.head-tab a.tab-link{width:120px;top:0px;height:44px;line-height: 44px;color: #999;}
  .buttons-tab.head-tab .button.active{border-color:#f90; color: #333;font-size: 18px}
  .timebox .date-time{font-size: 16px;}
  .timebox .datetime-tip{font-size: 12px;color:#999;}
  header.bar,.content{background: #fff;}
  .is-today{color:#f90;font-size: 15px;}

  .search-box{
    text-align: left;
    height:40px;
    background: #fff;
    border-bottom: 1px solid #f4f4f4;
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
  .chart-allbox{
    overflow-y:auto;
    overflow-x:hidden;
    height:100%;
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
  .chart-box{
    display: flex;
    align-items:center;
    justify-content:center;
    height:280px;
    background-color: #fff;
  }

  .title-all{
    width:100%;
    text-align:center;
    color:#f90;
  }

  .chart-title{
    font-family:Microsoft Yahei;
    font-size:18px;
    display:inline-block;
    width:100%;
    padding-top:5px;
    padding-left:20px;
    padding-bottom:5px;
    border-bottom:1px dotted;
    background-color:#fff;
  }

  .first-chart{
    margin-top:140px;
    border-top:none;
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
    width: 80px;
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
  .chart-container{
    height:280px;
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
