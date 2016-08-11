<template>
    <div class="report-content">
      <div class="report-content-inner">
          <div class="board-box">
            <div class="board-cell">
              <span class="cell-tip" id="help31">总数<span class="moon-ico icon-info"></span></span>
              <span class="cell-value" v-on:click="allDetails()">{{report.total}}</span>
              <div class="toast-tip help31 help1">所有店长的总人数</div>
            </div>
            <div class="boardbox-splitor"></div>
            <div class="board-cell">
              <span class="cell-tip"id="help32">合格人数<span class="moon-ico icon-info"></span></span>
              <span class="cell-value" v-on:click="okDetails()">{{report.okNum}}</span>

              <div class="toast-tip help32 help2">当前时间范围内问题整改完成率超过{{report.levelMid*100}}%的店长人数</div>
            </div>
          </div>
          <div class="chart-box">
            <div v-show="!display.nodata" id="capacityChart3" v-bind:style="{width:chart.width+'px'}" class="chart-container"></div>
            <div v-show="display.nodata" id="nodataChart13" class="no-data" v-bind:style="{width:chart.width+'px',height:'360px'}" class="chart-container"></div>
          </div>
          <div class="data-list">
            <ul>
              <li v-for="data in report.data" class="data-li" v-if="data.value>0" v-on:click="details($index,data)" v-bind:class="['data-li-'+data.key,selectType==$index?'active':'']">
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
        grade:-3,//用户所属解别
        gradeIndex:2,//选择的级别index
        display:{
          nodata:false
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
          reportType:3//报表类型
        },
        cache:{
          key:'',
          data:null
        },//报表数据缓存
        chart:{
          width:$('body').width(),
          chartObject:{},
          chartObject1:{},
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
        bindTouchStart('help31','.help31');
        bindTouchEnd('help31','.help31');
        bindTouchStart('help32','.help32');
        bindTouchEnd('help32','.help32');

      },
      initChart:function(){
        var _this = this;
        var myChart = echarts.init(document.getElementById('capacityChart3'));
        myChart.showLoading();
        var option = chartutils.getPieChartOption().option;
        myChart.setOption(option);
        myChart.on('click',function(param){
          if(_this.selectType == param.dataIndex){//如果当前高亮显示的是自己就return
            return;
          }
          /*myChart.dispatchAction({
            type:'downplay',
            seriesIndex:0,
            dataIndex:_this.selectType
          });*/
          _this.selectValueType(param.dataIndex);
        });
        this.chart.chartObject = myChart;
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
      getData:function(){
        this.getManagerData();
      },
      /**
       * 获取店长整改率执行力
       * */
      getManagerData:function(){
        this.chart.chartObject.showLoading();
        var search = this.search;
        var _this = this;
        var cacheKey = getCacheKey(search);
        if(this.cache.key == cacheKey){//如果当前存在当前报表的缓存，并且查询条件没有改变，则从缓存中获取报表数据
          var data = this.cache.data;
          this.formatData(data);
          this.render();
          return;
        }
        this.$http.post('/service/getStoreManagerTotalReport.action',{
          startDate:search.startTime+" 00:00:00",
          endDate:search.endTime+" 23:59:59",
          token:Constant.token
        }).then(function(ret){
          if(ret.ok && ret.data && ret.data.result == 'ok'){
            var data = ret.data.data.data;
            _this.cache = {
              data:data,//报表数据
              key:getCacheKey(search)//报表查询条件，作为是否需要更新缓存的依据
            };//缓存数据
            _this.formatData(data);
            _this.render();
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
        }else{
          this.renderNodataChart();
        }
      },
      renderNodataChart:function(){
        var myChart = echarts.init(document.getElementById('nodataChart13'));
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
      details:function(index,data){
        this.chart.chartObject.dispatchAction({
          type:'downplay',
          seriesIndex:0,
          dataIndex:this.selectType
        });
        this.chart.chartObject.dispatchAction({
          type:'highlight',
          seriesIndex:0,
          dataIndex:index
        });
        this.selectType = index;
        data.name = '整改问题效率'+data.name+'的店长列表';
        this.setConstantValue(data);
        router.go({name:'capacityusers',params:{type:this.report.reportType}});
      },
      /**
       * 查看所有的详情
       */
      allDetails:function(){
        if(this.report.total>0){
          this.setConstantValue({
            name:'店长列表',
            key:'best,good,bad'
          });
          router.go({name:'capacityusers',params:{type:this.report.reportType}});
        }
      },
      /**
       * 查看合格的详情
       */
      okDetails:function(){
        if(this.report.okNum>0){
          this.setConstantValue({
            name:'整改问题效率合格的店长列表',
            key:'best,good'
          });
          router.go({name:'capacityusers',params:{type:this.report.reportType}});
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
  .pie-title{
    padding: 10px 0px 0px 0px;
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
  .help31{
    left:33%;
    top:20%;
  }
</style>
