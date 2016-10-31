<template>
  <div class="report-content swiper-container mutiple-panel">
    <div class="swiper-pagination"></div>
    <div class="report-content-inner swiper-wrapper">
      <!--<div class="swiper-slide">
        <div class="swiper-inner">
          <h2 class="pie-title" id="help210">点检任务完成指标<span class="moon-ico icon-info"></span></h2>
          <div class="toast-tip help210 help">已完成点检任务数/总点检任务数</div>
          <div class="board-box">
            <div class="board-cell">
              <span class="cell-tip" id="help21">总数<span class="moon-ico icon-info"></span></span>
              <span class="cell-value" v-on:click="allDetails(report.total,report.reportType)">{{report.total}}</span>
              <div class="toast-tip help21 help1">所有督导的总人数</div>
            </div>
            <div class="boardbox-splitor"></div>
            <div class="board-cell">
              <span class="cell-tip"id="help22">合格人数<span class="moon-ico icon-info"></span></span>
              <span class="cell-value" v-on:click="okDetails(report.okNum,report.reportType)">{{report.okNum}}</span>
              <div class="toast-tip help22 help2">当前时间范围内点检任务完成率超过{{report.levelMid*100}}%的督导人数</div>
            </div>
          </div>
          <div class="chart-box">
            <div v-show="!display.nodata" id="capacityChart21" v-bind:style="{width:chart.width+'px'}" class="chart-container"></div>
            <div v-show="display.nodata" id="nodataChart32" class="no-data" v-bind:style="{width:chart.width+'px',height:'360px'}" class="chart-container"></div>
          </div>
          <div class="data-list mutiple-panel">
            <ul>
              <li v-for="data in report.data" class="data-li" v-if="data.value>0" v-on:click="details($index,data,report.reportType)" v-bind:class="['data-li-'+data.key,selectType==$index?'active':'']">
                <div class="cell-0"></div>
                <div class="cell-1">
                  <div class="cell-1-c"><span class="cell-name">{{data.name}}</span><span class="cell-status">{{data.state|whichstatus}}</span></div>
                </div>
                <div class="cell-2">{{data.value}}人</div>
                <div class="cell-3"><span class="moon-ico icon-pre"></span></div>
              </li>
            </ul>
          </div>
        </div>
      </div>-->
      <div class="swiper-slide">
        <div class="swiper-inner">
          <!--<h2 class="pie-title" id="help211">点检项覆盖指标<span class="moon-ico icon-info"></span></h2>-->
          <div class="toast-tip help211 help">已点检点检项数/总点检项数</div>
          <div class="board-box">
            <div class="board-cell">
              <span class="cell-tip" id="help23">总数<span class="moon-ico icon-info"></span></span>
              <span class="cell-value" v-on:click="allDetails(report2.total,report2.reportType)">{{report2.total}}</span>
              <div class="toast-tip help23 help1">所有督导的总人数</div>
            </div>
            <div class="boardbox-splitor"></div>
            <div class="board-cell">
              <span class="cell-tip"id="help24">合格人数<span class="moon-ico icon-info"></span></span>
              <span class="cell-value" v-on:click="okDetails(report2.okNum,report2.reportType)">{{report2.okNum}}</span>

              <div class="toast-tip help24 help2">
                计算方式：[(检查门店点检项数/(门店数*点检项数))*50%+(自己发现的问题数/门店数)*50%]大于等于{{report.levelMid*100}}%的督导人数
              </div>
            </div>
          </div>
          <div class="chart-box">
            <div v-show="!display.nodata" id="capacityChart22" v-bind:style="{width:chart.width+'px'}" class="chart-container"></div>
            <div v-show="display.nodata" id="nodataChart320" class="no-data" v-bind:style="{width:chart.width+'px',height:'360px'}" class="chart-container"></div>
          </div>
          <div class="data-list mutiple-panel">
            <ul>
              <li v-for="data in report2.data" class="data-li" v-if="data.value>0" v-on:click="details($index,data,report2.reportType)" v-bind:class="['data-li-'+data.key,selectType==$index?'active':'']">
                <div class="cell-0"></div>
                <div class="cell-1">
                  <div class="cell-1-c"><span class="cell-name">{{data.name}}</span><span class="cell-status">{{data.state|whichstatus}}</span></div>
                </div>
                <div class="cell-2">{{data.value}}人</div>
                <div class="cell-3"><span class="moon-ico icon-pre"></span></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  var echarts = require('echarts');
  var chartutils = require('../chartutils');
  var ANIMATE_TIME  = 6;//动画耗时时间
  module.exports = {
    data:function(){
      return {
        selectType:0,
        hasInit:false,
        grade:0,//用户所属解别
        gradeIndex:1,//选择的级别index
        display:{
          nodata:false,
          nodata2:false
        },
        report:{
          totalNum:0,
          total:0,
          okNum:0,
          helpTip1:'',
          helpTip2:'',
          pieTitle:'',
          levelMid:'',
          data:[],
          reportType:1//报表类型
        },
        report2:{
          totalNum:0,
          total:0,
          okNum:0,
          helpTip1:'',
          helpTip2:'',
          pieTitle:'',
          levelMid:'',
          data:[],
          reportType:2//报表类型
        },
        cache:{
          key:'',
          data1:null,
          data2:null
        },//报表数据缓存
        chart:{
          width:$('body').width(),
          chartObject:{},
          chartObject2:{}
        }
      }
    },
    props:{
      search:{
        type:Object,
        default:function(){
          return {
            startTime:'',
            endTime:''
          };
        }
      }
    },
    ready:function(){
      this.init();
      this.initChart();
      this.getData();
    },
    events:{
      'getcapacitydata':function(msg){
        if(msg.gradeIndex == this.gradeIndex){
          this.search = Constant.search;
          this.getData();
        }
      }
    },
    filters:{
      whichstatus:function(status){
        if(status == 1){
          return "不合格";
        }else if(status == 0){
          return "合格";
        }
      }
    },
    methods:{
      init:function(){
        /*bindTouchStart('help21','.help21');
        bindTouchEnd('help21','.help21');
        bindTouchStart('help22','.help22');
         bindTouchEnd('help22','.help22');*/

        bindTouchStart('help23','.help23');
        bindTouchEnd('help23','.help23');
        bindTouchStart('help24','.help24');
        bindTouchEnd('help24','.help24');

        /* bindTouchStart('help210','.help210');
         bindTouchEnd('help210','.help210');*/
        /*bindTouchStart('help211','.help211');
         bindTouchEnd('help211','.help211');*/

        /*$('.swiper-container').swiper({

         });*/
      },
      initChart:function(){
        var _this = this;
        /*var myChart = echarts.init(document.getElementById('capacityChart21'));
        myChart.showLoading();
        var option = chartutils.getPieChartOption().option;
        myChart.setOption(option);
        myChart.on('click',function(param){
          if(_this.selectType == param.dataIndex){//如果当前高亮显示的是自己就return
            return;
          }
          _this.selectValueType(param.dataIndex);
        });
         this.chart.chartObject = myChart;*/

        var myChart2 = echarts.init(document.getElementById('capacityChart22'));
        myChart2.showLoading();
        var option2 = chartutils.getPieChartOption().option;
        myChart2.setOption(option2);
        myChart2.on('click',function(param){
          if(_this.selectType == param.dataIndex){//如果当前高亮显示的是自己就return
            return;
          }
          _this.selectValueType(param.dataIndex);
        });
        this.chart.chartObject2 = myChart2;
      },
      /**
       * 特殊逻辑，用来把后台数据转化为前端charts所需要的数据格式，代码有点混乱，不忍直视
       * @param data
       */
      formatData:function(data){
        this.report.data = [];
        this.report.total = data.personNum;
        this.report.okNum = data.qualifiedNum;
        this.report.levelMid = data.levelMid;
        this.animateNum(data);
        var best = data.regions.best,good = data.regions.good,bad = data.regions.bad;
        best.key = 'best',best.name = '优秀',best.value = best.objCount,best.itemStyle = chartutils.getPieChartOption().bestStyleOption;
        good.key = 'good',good.name = '良好',good.value = good.objCount,good.itemStyle = chartutils.getPieChartOption().goodStyleOption;
        bad.key = 'bad',bad.name = '较差',bad.value = bad.objCount,bad.itemStyle = chartutils.getPieChartOption().badStyleOption;
        if(best.value > 0) this.report.data.push(best);
        if(good.value > 0) this.report.data.push(good);
        if(bad.value > 0) this.report.data.push(bad);
        if(this.report.data.length == 0){
          this.display.nodata = true;
        }else{
          this.display.nodata = false;
        }
      },
      animateNum:function(data){
        var _this = this;
        this.report.total = 0;
        var step = Math.ceil(data.personNum/ANIMATE_TIME);
        var timer0 = setInterval(function(){
          if(_this.report.total >= data.personNum){
            clearInterval(timer0);
            timer0 = null;
          }
          if(_this.report.total+step >= data.personNum){
            _this.report.total = data.personNum;
          }else{
            _this.report.total += step;
          }
        },100);
        this.report.okNum = 0;
        var step1 = Math.ceil(data.qualifiedNum/ANIMATE_TIME);
        var timer2 = setInterval(function(){
          if(_this.report.okNum >= data.qualifiedNum){
            clearInterval(timer2);
            timer2 = null;
          }
          if(_this.report.okNum+step1 >= data.qualifiedNum){
            _this.report.okNum = data.qualifiedNum;
          }else{
            _this.report.okNum += step1;
          }
        },100);
      },
      /**
       * 特殊逻辑，用来把后台数据转化为前端charts所需要的数据格式，代码有点混乱，不忍直视
       * @param data
       */
      formatData2:function(data){
        this.report2.data = [];
        this.report2.total = data.personNum;
        this.report2.okNum = data.qualifiedNum;
        this.report2.levelMid = data.levelMid;
        this.animateNum2(data);
        var best = data.regions.best,good = data.regions.good,bad = data.regions.bad;
        best.key = 'best',best.name = '优秀',best.value = best.objCount,best.itemStyle = chartutils.getPieChartOption().bestStyleOption;
        good.key = 'good',good.name = '良好',good.value = good.objCount,good.itemStyle = chartutils.getPieChartOption().goodStyleOption;
        bad.key = 'bad',bad.name = '较差',bad.value = bad.objCount,bad.itemStyle = chartutils.getPieChartOption().badStyleOption;
        if(best.value > 0) this.report2.data.push(best);
        if(good.value > 0) this.report2.data.push(good);
        if(bad.value > 0) this.report2.data.push(bad);
        if(this.report2.data.length == 0){
          this.display.nodata2 = true;
        }else{
          this.display.nodata2 = false;
        }
      },
      animateNum2:function(data){
        var _this = this;
        this.report2.total = 0;
        var step = Math.ceil(data.personNum/ANIMATE_TIME);
        var timer0 = setInterval(function(){
          if(_this.report2.total >= data.personNum){
            clearInterval(timer0);
            timer0 = null;
          }
          if(_this.report2.total+step >= data.personNum){
            _this.report2.total = data.personNum;
          }else{
            _this.report2.total += step;
          }
        },100);
        this.report2.okNum = 0;
        var step1 = Math.ceil(data.qualifiedNum/ANIMATE_TIME);
        var timer2 = setInterval(function(){
          if(_this.report2.okNum >= data.qualifiedNum){
            clearInterval(timer2);
            timer2 = null;
          }
          if(_this.report2.okNum+step1 >= data.qualifiedNum){
            _this.report2.okNum = data.qualifiedNum;
          }else{
            _this.report2.okNum += step1;
          }
        },100);
      },
      getData:function(){
        //this.getCheckerData1();
        this.getCheckerData2();
      },
      /**
       * 获取督导完成率执行力
       * */
      getCheckerData1:function(){
        this.chart.chartObject.showLoading();
        var search = this.search;
        var _this = this;
        var cacheKey = getCacheKey(search);
        if(this.cache.key == cacheKey && this.cache.data1){//如果当前存在当前报表的缓存，并且查询条件没有改变，则从缓存中获取报表数据
          var data = this.cache.data1;
          this.formatData(data);
          this.render();
          return;
        }
        this.$http.post('/service/getCheckerCompletRateReport.action',{
          startDate:search.startTime+" 00:00:00",
          endDate:search.endTime+" 23:59:59",
          token:Constant.token
        }).then(function(ret){
          if(ret.ok && ret.data && ret.data.result == 'ok'){
            var data = ret.data.data.data;
            _this.cache.key = getCacheKey(search);//报表查询条件，作为是否需要更新缓存的依据
            _this.cache.data1 = data;//报表数据
            _this.formatData(data);
            _this.render();
          }
        });
      },
      /**
       * 获取督导覆盖率执行力
       * */
      getCheckerData2:function(){
        this.chart.chartObject2.showLoading();
        var search = this.search;
        var _this = this;
        var cacheKey = getCacheKey(search);
        if(this.cache.key == cacheKey && this.cache.data2){//如果当前存在当前报表的缓存，并且查询条件没有改变，则从缓存中获取报表数据
          var data = this.cache.data2;
          this.formatData2(data);
          this.render2();
          return;
        }
        this.$http.post('/service/getCheckerCoverRateReport.action',{
          startDate:search.startTime+" 00:00:00",
          endDate:search.endTime+" 23:59:59",
          token:Constant.token
        }).then(function(ret){
          if(ret.ok && ret.data && ret.data.result == 'ok'){
            var data = ret.data.data.data;
            _this.cache.key = getCacheKey(search);//报表查询条件，作为是否需要更新缓存的依据
            _this.cache.data2 = data;//报表数据
            _this.formatData2(data);
            _this.render2();
          }
        });
      },
      render:function(){
        var myChart = this.chart.chartObject;
        this.selectType = 0;
        myChart.clear();
        myChart.hideLoading();
        if(this.report.data.length> 0){
          var option = chartutils.getPieChartOption().option;
          option.series[0].data = this.report.data;
          myChart.setOption(option);
          /*setTimeout(function(){
            myChart.dispatchAction({
              type:'highlight',
              seriesIndex:0,
              dataIndex:0
            });
          },1000);*/
        }else{
          this.renderNodataChart();
        }
      },
      renderNodataChart:function(){
        var myChart = echarts.init(document.getElementById('nodataChart32'));
        myChart.setOption(chartutils.getNoDataPieChartOption());
        myChart.dispatchAction({
          type:'highlight',
          seriesIndex:0,
          dataIndex:0
        });
      },
      render2:function(){
        var myChart = this.chart.chartObject2;
        this.selectType = 0;
        myChart.clear();
        myChart.hideLoading();
        if(this.report2.data.length> 0){
          var option = chartutils.getPieChartOption().option;
          option.series[0].data = this.report2.data;
          myChart.setOption(option);
          /*setTimeout(function(){
           myChart.dispatchAction({
           type:'highlight',
           seriesIndex:0,
           dataIndex:0
           });
           },1000);*/
        }else{
          this.renderNodataChart2();
        }
      },
      renderNodataChart2:function(){
        var myChart = echarts.init(document.getElementById('nodataChart320'));
        myChart.setOption(chartutils.getNoDataPieChartOption());
        myChart.dispatchAction({
          type:'highlight',
          seriesIndex:0,
          dataIndex:0
        });
      },
      selectValueType:function(type){
        this.selectType = type;
      },
      /**
       * 查看指定类型的详情
       */
      details:function(index,data,type){
        this.chart.chartObject2.dispatchAction({
          type:'downplay',
          seriesIndex:0,
          dataIndex:this.selectType
        });
        this.chart.chartObject2.dispatchAction({
          type:'highlight',
          seriesIndex:0,
          dataIndex:index
        });
        this.selectType = index;
        if(type == 1){
          data.name = '点检项完成率'+data.name+'的督导列表';
        }else if(type == 2){
          //data.name = '点检项覆盖率'+data.name+'的督导列表';
          data.name = data.name + '的督导列表';
        }
        this.setConstantValue(data);
        router.go({name:'capacityusers',params:{type:type}});
      },
      /**
       * 查看所有的详情
       */
      allDetails:function(total,type){
        if(total>0){
          this.setConstantValue({
            //name:type==2?'督导列表（点检项覆盖率指标）':'督导列表（点检任务完成率指标）',
            name: '督导列表',
            key:'best,good,bad'
          });
          router.go({name:'capacityusers',params:{type:type}});
        }
      },
      /**
       * 查看合格的详情
       */
      okDetails:function(okNum,type){
        if(okNum>0){
          this.setConstantValue({
            //name:type==2?'合格的督导列表（点检项覆盖率指标）':'合格的督导列表（点检任务完成率指标）',
            name: '合格的督导列表',
            key:'best,good'
          });
          router.go({name:'capacityusers',params:{type:type}});
        }
      },
      setConstantValue:function(data){
        Constant.shopParam.shopsPage.title = data.name;
        Constant.shopParam.shopsPage.key = data.key;
      }
    }
  };
  function bindTouchStart(id,targetSelector){
    document.getElementById(id).addEventListener('touchstart', function(){
      $(targetSelector).show();
    });
  }
  function bindTouchEnd(id,targetSelector){
    document.getElementById(id).addEventListener('touchend', function(){
      $(targetSelector).hide();
    });
  }

  /**
   *
   * 获取缓存的key(类似时间戳)
   * @param search
   * @returns {string}
   */
  function getCacheKey(search){
    return search.startTime+'-'+search.endTime;
  }
</script>

<style scoped>
  .report-content,.report-content-inner{
    width: 100%;
    padding-bottom: 0px;
  }

  /* .swiper-slide{
     background: #eee;
     padding:10px;
   }
   .swiper-inner{
     background: #fff;
     padding-top: 10px;
   }
   .data-list.mutiple-panel{
     padding:0px 10px 10px 10px;
   }*/
  .swiper-pagination{
    width: 100%;
    top:40px;
    bottom: auto;
  }
  .swiper-pagination-bullet{
    margin:0 5px;
  }
  .pie-title{
    padding: 0px;
    margin: 0px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #333;
    font-size: 16px;
  }
  .chart-box{
    margin-top: 0px;
  }
  .type-list ul{
    text-align: center;
  }
  .help1{
    left:33%;
    top:20%;
  }
  .help211,.help210{
    top:50px;
    left: 10%;
  }
</style>
