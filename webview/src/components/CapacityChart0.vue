<template>
    <div class="report-content">
      <div class="report-content-inner">
          <div class="board-box">
            <div class="board-table">
              <table>
                <tr align="left"><td colspan="4"><span style="margin-left:10px;">{{myCurTitle}}</span></td></tr>
                <tr v-if="myData.grades==-4"><td v-for="num in numtitles1"><div class="big-num">{{myData.curData[num.name]|currDataFormat num.rate}}<span v-show="num.rate==1" style="font-size:15px;display:inline-block;">%</span></div><div class="small-title" id="help_1{{$index}}"><div style="top:0px;" class="toast-tip" id="help1{{$index}}">{{num.tip}}</div>{{num.title}}<span class="moon-ico icon-info"></span></div></td></tr>
              <tr v-if="myData.grades==-3"><td v-for="num1 in numtitles2"><div class="big-num">{{myData.curData[num1.name]|currDataFormat num1.rate}}<span v-show="num1.rate==1" style="font-size:15px;display:inline-block;">%</span></div><div class="small-title" id="help_2{{$index}}"><div style="top:0px;" class="toast-tip" id="help2{{$index}}">{{num1.tip}}</div>{{num1.title}}<span class="moon-ico icon-info"></span></div></td></tr>
              <tr v-if="myData.grades==-2"><td v-for="num2 in numtitles3"><div class="big-num">{{myData.curData[num2.name]|currDataFormat num2.rate}}<span v-show="num2.rate==1" style="font-size:15px;display:inline-block;">%</span></div><div class="small-title" id="help_3{{$index}}"><div style="top:0px;" class="toast-tip" id="help3{{$index}}">{{num2.tip}}</div>{{num2.title}}<span class="moon-ico icon-info"></span></div></td></tr></table>
            </div>
          </div>
          <div v-if="myData.grades==-4" v-for="num1 in numtitles11" class="chart-box">
            <table width="100%"><tr><td><div class="chart-title">{{num1.title}}</div></td></tr>
            <tr><td><div id={{num1.name}} class="chart"></div></td></tr>
            </table>
          </div>
          <div v-if="myData.grades==-3" v-for="num2 in numtitles22" class="chart-box">
            <table width="100%"><tr><td><div class="chart-title">{{num2.title}}</div></td></tr>
              <tr><td><div id={{num2.name}} class="chart"></div></td></tr>
            </table>
          </div>
          <div v-if="myData.grades==-2" v-for="num3 in numtitles33" class="chart-box">
            <table width="100%"><tr><td><div class="chart-title">{{num3.title}}</div></td></tr>
              <tr><td><div id={{num3.name}} class="chart"></div></td></tr>
            </table>
          </div>
        <div class="childlog-container">
          <div class="child-title">
            <span class="child-tab" v-bind:class="{true:'tab-active',false:''}[chldTableIndex==1]" v-on:click="selectChildTab(1)" v-i18n="{value:'checkreport.loginstatus'}"></span>
            <span class="child-tab" v-bind:class="{true:'tab-active',false:''}[chldTableIndex==2]" v-on:click="selectChildTab(2)" v-i18n="{value:'checkreport.orderstatus'}"></span>
          </div>
          <table v-show="chldTableIndex==1" width="100%"><tr style="height:40px;"><td></td><td align="right" colspan="5"><div v-show="!showAllFlag" class="log-all" v-on:click="showAllLogList(1)">{{showAll}}</div><div v-show="showAllFlag" class="log-all" v-on:click="showAllLogList(0)">{{showSignle}}</div></td></tr>
          <tr v-show="showLog"  class="log-title"><td style="padding-left:10px;">{{userNameTitle}}</td><td v-for="title in myChildLogTitles" align="center">{{title.dayTime}}</td></tr>
          <tr v-show="showLog"  class="log-content" v-for="child in myChilds"><td class="log-username">{{child.showName}}</td><td align="center" v-for="c in child.logDailyDo" v-bind:class="'login-'+c.hasLogin">{{c.hasLogin | loginFilter}}</td></tr>
            <tr v-show="!showLog" align="center"><td colspan="2"><div class="no-data">{{nodata}}</div></td></tr>
          </table>
          <table v-show="chldTableIndex==2" width="100%"><tr style="height:40px;"><td></td><td align="right" colspan="5"><div v-show="!showAllFlag" class="log-all" v-on:click="showAllLogList(1)">{{showAll}}</div><div v-show="showAllFlag" class="log-all" v-on:click="showAllLogList(0)">{{showSignle}}</div></td></tr>
            <tr v-show="showLog" class="log-title"><td style="padding-left:10px;"><span class="child-tabtitle">{{userNameTitle}}</span></td><td align="center"><span class="child-tabtitle" v-i18n="{value:'checkreport.storenums'}"></span></td><td align="center"><span class="child-tabtitle" v-i18n="{value:'checkreport.findproblem'}"></span></td><td align="center"><span class="child-tabtitle" v-i18n="{value:'checkreport.checkdept'}"></span></td><td align="center"><span class="child-tabtitle" v-i18n="{value:'checkreport.checkproblem'}"></span></td><td align="center"><span class="child-tabtitle" v-i18n="{value:'checkreport.problemtotal'}"></span></td></tr>
            <tr v-show="showLog" class="log-content" v-for="child in myChilds"><td class="log-username">{{child.showName}}</td><td align="center">{{child.authDeptNum|numtostr}}</td><td align="center">{{child.findProblemNum|numtostr}}</td><td align="center">{{child.checkedDeptNum|numtostr}}</td><td align="center">{{child.improvementNum|numtostr}}</td><td align="center">{{child.problemTotalNum|numtostr}}</td></tr>
            <tr v-show="!showLog" align="center"><td colspan="2"><div class="no-data">{{nodata}}</div></td></tr>
          </table>
        </div>
        </div>
    </div>
</template>

<script>
  var echarts = require('echarts');
  var chartutils = require('../chartutils');
  var num = 20;//每页显示的条数
  var v = require('vue');
  //高管
  var numtitles1 = [
    {name:'findProblemNumInAuthShop',title:v.prototype.$translate('checkreport.problemtotal'),rate:0,tip:v.prototype.$translate('checkreport.problemtotaldesc'),bigTitle:v.prototype.$translate('checkreport.problemcountmonth')},
    {name:'solveProblemNumInAuthShop',title:v.prototype.$translate('checkreport.hasokcount'),rate:0,tip:v.prototype.$translate('checkreport.dephasokcount')},
    {name:'findProblemNum',title:v.prototype.$translate('checkreport.iampush'),rate:0,tip:v.prototype.$translate('checkreport.orderselffindproblem')},
    {name:'quota',title:v.prototype.$translate('checkreport.iamscore'),rate:1,tip:v.prototype.$translate('checkreport.scoredesc')}
  ];
  var numtitles11 = [
    {name:'zhChar',title:v.prototype.$translate('checkreport.problemtotal'),rate:0},
    {name:'findProblemNum',title:v.prototype.$translate('checkreport.iampush'),rate:0},
    {name:'quota',title:v.prototype.$translate('checkreport.iamscore'),rate:1}
  ];
  //督导
  var numtitles2 = [
    {name:'checkedDeptNum',title:v.prototype.$translate('checkreport.checkcount'),rate:0,tip:v.prototype.$translate('checkreport.checksstorecount'),bigTitle:v.prototype.$translate('checkreport.checktotalmonth')},
    {name:'authDeptNum',title:v.prototype.$translate('checkreport.storenums'),rate:0,tip:v.prototype.$translate('checkreport.authdepcount')},
    {name:'coverDeptRate',title:v.prototype.$translate('checkreport.coverrate'),rate:1,tip:v.prototype.$translate('checkreport.checkdepauthdep')}];
  var numtitles22 = [
    {name:'zhChar',title:v.prototype.$translate('checkreport.checkcount'),rate:0},
    {name:'coverDeptRate',title:v.prototype.$translate('checkreport.coverrate'),rate:1}];
  //店长
  var numtitles3 = [
    {name:'improvementNum',title:v.prototype.$translate('checkreport.docount'),rate:0,tip:v.prototype.$translate('checkreport.hasdoneproblemcount'),bigTitle:v.prototype.$translate('checkreport.oktotalmonth')},
    {name:'problemTotalNum',title:v.prototype.$translate('checkreport.problemtotal'),rate:0,tip:v.prototype.$translate('checkreport.problemtotaldesc')},
    {name:'improvementRate',title:v.prototype.$translate('checkreport.okmorerate'),rate:1,tip:v.prototype.$translate('checkreport.okprototalpro')}];
  var numtitles33 = [
    {name:'zhChar',title:v.prototype.$translate('checkreport.docount'),rate:0},
    {name:'improvementRate',title:v.prototype.$translate('checkreport.okmoreratec'),rate:1}];
  module.exports = {
    data:function(){
      return {
        selectType:0,
        hasInit:false,
        grade:0,//用户所属解别
        gradeIndex:0,//选择的级别index
        cache:{
          key:'',
          data:null
        },//报表数据缓存
        page:{
          index:0,
          num:num,
          total:0
        },
        loading:false,
        scrollInit:false,
        refreshInit:false,
        myData:{},
        numtitles1:numtitles1,
        numtitles11:numtitles11,
        numtitles2:numtitles2,
        numtitles22:numtitles22,
        numtitles3:numtitles3,
        numtitles33:numtitles33,
        myCurTitle:'',
        userNameTitle:'',
        childListTitle:'',
        showAll:'',
        showSignle:'',
        myChildLogTitles:[],
        myChilds:[],
        showAllFlag:0,
        chldTableIndex:1,
        showLog:false,
        nodata:''
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
      currDataFormat:function(value,rate){
        if(rate&&rate==1){
          if(value){
            return (value*100).toFixed(1);
          }else{
            return 0.0;
          }
        }else{
          if(value){
            return value;
          }else{
            return 0;
          }
          return value;
        }
      },
      loginFilter:function(value){
        if(value==1){
          return '√';
        }else{
          return 'X';
        }
      },
      numtostr:function(value){
        if(value==null){
          return '-';
        }else{
          return value;
        }
      }
    },
    methods:{
      init:function(){
      },
      unbindInfinite:function(){
        $.detachInfiniteScroll($('#contentList'));
        $('#contentList .infinite-scroll-preloader').hide();
      },
      bindInfiniteEvent:function(){
        var _this = this;
        $.attachInfiniteScroll($('#contentList'));
        $('#contentList .infinite-scroll-preloader').show();
        var func = function(){
          if(_this.loading) return;
          _this.page.index += _this.page.num;
          _this.getChildData(function(){
            if(_this.page.total <= _this.myChilds.length){
              _this.unbindInfinite();
            }
            $.refreshScroller();
          });
        };
        $(document).off('infinite','#contentList',func).on('infinite','#contentList',func);
      },
      initChart:function(){
        var _this = this;
        setTimeout(function() {
          if (_this.myData.grades == -4) {
            _this.myCurTitle = _this.numtitles1[0].bigTitle;
            _this.renderData(_this.numtitles11,_this.numtitles1);
            for(var n=0;n<_this.numtitles1.length;n++){
              bindTouchStart('help_1'+n,'#help1'+n);
              bindTouchEnd('help_1'+n,'#help1'+n);
            }
          } else if (_this.myData.grades == -3) {
            _this.myCurTitle = _this.numtitles2[0].bigTitle;
            _this.renderData(_this.numtitles22,_this.numtitles2);
            for(var n=0;n<_this.numtitles2.length;n++){
              bindTouchStart('help_2'+n,'#help2'+n);
              bindTouchEnd('help_2'+n,'#help2'+n);
            }
          } else {
            _this.myCurTitle = _this.numtitles3[0].bigTitle;
            _this.renderData(_this.numtitles33,_this.numtitles3);
            for(var n=0;n<_this.numtitles3.length;n++){
              bindTouchStart('help_3'+n,'#help3'+n);
              bindTouchEnd('help_3'+n,'#help3'+n);
            }
          }
          if(!_this.refreshInit){
            $('#contentList').scroller({
              type:'native'
            });
            _this.refreshInit = true;
          }
          _this.page.index = 0;
          _this.myChilds = [];
          _this.bindInfiniteEvent();
          _this.getChildData(function(){
            if(_this.page.total <= _this.myChilds.length){
              _this.unbindInfinite();
            }
            $.refreshScroller();
          });
        },500);
      },
      getData:function(){
        var _this = this;
        this.$http.post('/service/getMyReport.action',{
          token:Constant.token
        }).then(function(ret){
          if(ret.ok && ret.data && ret.data.result == 'ok'){
            var data = ret.data.data.myReport;
            _this.myData = data;
            _this.initChart();
          }
        });
      },
      showAllLogList:function(flag){
        var _this = this;
        _this.showAllFlag = flag;
        _this.page.index = 0;
        _this.myChilds = [];
        _this.bindInfiniteEvent();
        _this.getChildData(function(){
          if(_this.page.total <= _this.myChilds.length){
            _this.unbindInfinite();
          }
          $.refreshScroller();
        });
      },
      getChildData:function(callback,searchData){
        var _this = this;
        this.loading = true;
        searchData = searchData?searchData:this;
        //如果是登录情况
        if(searchData.chldTableIndex==1){
          this.$http.post('/service/getMyReportLogs.action',{
            index:searchData.page.index,
            num:searchData.page.num,
            isQueryBranch:searchData.showAllFlag,
            token:Constant.token
          }).then(function(ret){
            _this.loading = false;
            if(ret.ok && ret.data && ret.data.result == 'ok'){
              _this.showLog = true;
              if(_this.page.index == 0){
                _this.myChilds = ret.data.data.data;
              }else{
                _this.myChilds = _this.myChilds.concat(ret.data.data.data);
              }
              if(_this.myChilds.length>0) {
                this.userNameTitle = this.$translate('common.username');
                this.showAll = this.$translate('checkreport.showallchild');
                this.showSignle=this.$translate('checkreport.shownextchild');
                this.myChildLogTitles = _this.myChilds[0].logDailyDo;
              }
              _this.page.total = ret.data.data.total;
              callback && callback();
            }else{
              _this.showLog = false;
              _this.nodata  = this.$translate('checkreport.nonextuser');
              _this.myChilds = [];
              _this.page.total = 0;
              callback && callback();
            }
          });
        }else{
          this.$http.post('/service/getMyReportCurTargets.action',{
            index:searchData.page.index,
            num:searchData.page.num,
            isQueryBranch:searchData.showAllFlag,
            token:Constant.token
          }).then(function(ret){
            _this.loading = false;
            if(ret.ok && ret.data && ret.data.result == 'ok'){
              _this.showLog = true;
              if(_this.page.index == 0){
                _this.myChilds = ret.data.data.data;
              }else{
                _this.myChilds = _this.myChilds.concat(ret.data.data.data);
              }
              if(_this.myChilds.length>0) {
                this.userNameTitle = this.$translate('common.username');
                this.showAll = this.$translate('checkreport.showallchild');
                this.showSignle=this.$translate('checkreport.shownextchild');
              }
              _this.page.total = ret.data.data.total;
              callback && callback();
            }else{
              _this.showLog = false;
              _this.nodata  = this.$translate('checkreport.nonextuser');
              _this.myChilds = [];
              _this.page.total = 0;
              callback && callback();
            }
          });
        }
      },
      renderData:function(charArr,titleArr){
        for (var n = 0; n < charArr.length; n++) {
          var myChart = echarts.init(document.getElementById(charArr[n].name));
          myChart.clear();
          myChart.hideLoading();
          if (this.myData.historyData) {
            var data = this.myData.historyData[charArr[n].name];
            if(charArr[n].name=='zhChar'){
              var option = chartutils.getMyChartOption1().option;
              var arr = [];
              var seriesArr = [];
              for(var i=0;i<data.series.length;i++){
                for(var j=0;j<titleArr.length;j++){
                  if(data.series[i].name==titleArr[j].name){
                    arr.push(titleArr[j].title);
                    seriesArr.push({
                      name: titleArr[j].title,
                      type:'line',
                      smooth:true,
                      label:{
                        normal:{
                          show:true,
                          position:'top',
                          textStyle:{
                            color:'#999'
                          }
                        }
                      },
                      data:data.series[i].data
                    });
                    break;
                  }
                }
              }
              option.legend.data = arr;
              option.xAxis[0].data = data.categories;
              option.series = seriesArr;
            }else{
              var option = chartutils.getMyChartOption(data.value).option;
              option.series[0].data = data.series;
              option.xAxis[0].data = data.categories;
            }
            myChart.setOption(option);
          }
        }
      },
      selectChildTab:function(index){
        this.chldTableIndex = index;
        this.showAllLogList(0);
      },
      clearData:function(){
        this.page.index = 0;
        this.myChilds = [];
      },
      selectValueType:function(type){
        this.selectType = type;
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
  .board-box{
    border-top:1px solid #ddd;
    text-align:center;
    height:135px;
  }
  .chart-box{
    border-top:dotted 1px #999;
    height:295px;
    margin-top: 0px;
  }
  .type-list ul{
    text-align: center;
  }
  .help11{
    left:33%;
    top:20%;
  }
  .small-title{
    font-size:12px;
    color: #999;
    white-space:nowrap;
  }
  .toast-tip{
    white-space:normal;
  }
  .board-table{
    width:100%;
  }
  .board-table table{
    width:100%;
  }
  .big-num{
    font-size:40px;
  }
  .chart-title{
    height:20px;
    line-height:20px;
    width:100%;
    margin-left:10px;
    margin-top:20px;
  }
  .logbig-title{
    height:20px;
    line-height:20px;
    width:100%;
    margin-left:10px;
    margin-top:20px;
    margin-bottom:15px;
  }
  .chart{
    margin-top:10px;
    width: 100%;
    height: 245px;
  }
  .childlog-container{
    border-top:1px dotted #999;
    margin-bottom:10px;
  }
  .log-title{
    font-size:13px;
    color:#666;
    font-weight:bold;
    border-bottom:1px solid #eee;
    height:30px;
    line-height:30px;
  }
  .log-content{
    font-size:12px;
    color:#999;
    border-bottom:1px solid #eee;
    height:30px;
  }
  .login-0{
    color:red;
  }
  .log-username{
    padding-left:10px;
    max-width:90px;
    word-wrap:break-word;
    word-break:break-all;
  }
  .log-all{
    margin-right:10px;
    font-size:13px;
    color:#f90;
    height:30px;
    line-height:35px;
  }
  .no-data{
    font-size:13px;
    color:red;
    margin-bottom:30px;
  }
  .child-title{
    height:40px;
    line-height:40px;
    background-color:#f1f1f1;
    border-radius:20px;
    width:98%;
    margin-top:20px;
    margin-left:1%;
    font-size:14px;
  }
  .child-tab{
    border-radius:20px;
    height:40px;
    line-height:40px;
    display:inline-block;
    padding-left:10px;
    padding-right:10px;
    margin-right:20px;
  }
  .tab-active{
    color:#fff;
    background-color:#f90;
  }
  .child-tabtitle{
    display:inline-block;
    width:30px;
    word-wrap:break-word;
    word-break:break-all;
    height:16px;
    line-height:16px;
  }
  .fp-add {
    position: relative;
    float: left;
    width: 70px;
  }
</style>
