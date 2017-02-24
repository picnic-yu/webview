<template>
  <div>
    <div class="type-list">
      <ul>
        <li class="type-li" v-for="pos in poses" v-on:click="selectGrade($index)">
          <div class="type-circle" v-bind:class="[{'disabled':pos.disabled},{'active':$index==selectGradeIndex}]">{{pos.name}}</div>
        </li>
      </ul>
    </div>
    <component  :is="currentView" v-bind:search="search" keep-alive transition="fade" transition-mode="out-in"></component>
  </div>
</template>

<script>
    require('../../../common/assets/css/sm-extend.min.css');
    require('../../../common/assets/font.css');
    require('../../../common/libs/sm-extend.js');
    var echarts = require('echarts');
    var chartutils = require('../chartutils');
    var ANIMATE_TIME  = 6;//动画耗时时间
    var poses = [{
        name:'我',
        value:-1,
        disabled:true
    },{
        name:'高管',
        value:-4,
        disabled:true
    },{
        name:'督导',
        value:-3,
        disabled:true
    },{
        name:'店长',
        value:-2,
        disabled:true
    }];//执行力考擦对象
    module.exports = {
        data:function(){
            return {
                selectType:0,
                hasInit:false,
                grade:0,//用户所属解别
                selectGradeIndex:Constant.capacityParam.selectGradeIndex,//选择的级别
                display:{
                    nodata:false
                },
                poses:poses,
                report:{
                    totalNum:0,
                    total:0,
                    okNum:0,
                    helpTip1:'',
                    helpTip2:'',
                    pieTitle:'',
                    data:[]
                },
                cache:[{},{
                    key:'',
                    data1:null,
                    data2:null
                }],//报表数据缓存
                chart:{
                    width:$('body').width(),
                    chartObject:{},
                    chartObject1:{},
                    chartObject2:{}
                },
                currentIndex:0,
                currentView:''
            }
        },
        components: {
            //我
            capacitychart0:function(resolve){
                require(['../components/CapacityChart0'],resolve);
            },
            capacitychart1:function(resolve){
                require(['../components/CapacityChart1'],resolve);
            },
            capacitychart2:function(resolve){
                require(['../components/CapacityChart2'],resolve);
            },
            capacitychart3:function(resolve){
                require(['../components/CapacityChart3'],resolve);
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
            this.getPrivillage();
        },
        events:{
            'refresh-reportdata':function(msg){//重新查询
                if(msg.chartType == 2){
                    this.search = Constant.search;
                    this.selectGradeIndex = Constant.capacityParam.selectGradeIndex;
                    this.load(this.selectGradeIndex);
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
                this.search = Constant.search;
            },
            initChart:function(){
                var _this = this;
                var myChart = echarts.init(document.getElementById('capacityChart'));
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
            load:function(selectGradeIndex){
                if(this.hasInit){
                    this.selectGrade(selectGradeIndex);
                }else{
                    this.getPrivillage();
                }
            },
            getPrivillage:function(){
                var _this = this;
                this.$http.post('/service/getGradeAsUser.action',{
                    token:Constant.token
                }).then(function(ret){
                    _this.hasInit = true;
                    if(ret.data.result == 'ok'){
                        _this.whichPrivillage(ret.data.data.grade);
                    }else{
                        _this.whichPrivillage(0);
                    }
                });
            },
            /**
             * 业务逻辑，判断查看报表的权限
             * @param grade 级别
             */
            whichPrivillage:function(grade){
                this.grade = grade;
                if(grade == -1){//我
                    this.poses[0].disabled = false;
                    this.poses[1].disabled = true;
                    this.poses[2].disabled = true;
                    this.poses[3].disabled = true;
                    this.selectGrade(0);
                }else if(grade == -2){//店长
                    this.poses[0].disabled = false;
                    this.poses[1].disabled = true;
                    this.poses[2].disabled = true;
                    this.poses[3].disabled = false;
                    this.selectGrade(0);
                }else if(grade == -3){//督导
                    this.poses[0].disabled = false;
                    this.poses[1].disabled = true;
                    this.poses[2].disabled = false;
                    this.poses[3].disabled = false;
                    this.selectGrade(0);
                }else if(grade == -4){//高管
                    this.poses[0].disabled = false;
                    this.poses[1].disabled = false;
                    this.poses[2].disabled = false;
                    this.poses[3].disabled = false;
                    this.selectGrade(0);
                }else{//无任何级别，没有任何报表可以看
                    this.poses[0].disabled = true;
                    this.poses[1].disabled = true;
                    this.poses[2].disabled = true;
                    this.poses[3].disabled = true;
                    this.display.nodata = true;
                    $.toast('暂无任何级别的执行力可统计');
                }
            },
            selectGrade:function(index){
                if(index == -1) return;
                if(this.poses[index].disabled) return;
              /*if(index == 0){
               $.toast('暂未开放');
               return;
               }*/
                Constant.capacityParam.selectGradeIndex = this.selectGradeIndex = index;
                this.currentView = 'capacitychart'+index;
                this.getData();
            },
            /**
             * 特殊逻辑，用来把后台数据转化为前端charts所需要的数据格式，代码有点混乱，不忍直视
             * @param data
             */
            formatData:function(data,tip1,tip2,pieTitle){
                this.report.data = [];
                this.report.total = data.personNum;
                this.report.okNum = data.qualifiedNum;
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
                this.report.helpTip1 = tip1;
                this.report.helpTip2 = tip2;
                this.report.pieTitle = pieTitle?pieTitle:'';
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
                this.$broadcast('getcapacitydata',{
                    gradeIndex:this.selectGradeIndex
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
                this.setConstantValue(data);
                router.go({path:'/shops'});
            },
            /**
             * 查看所有的详情
             */
            allDetails:function(){
                if(this.report.total>0){
                    this.setConstantValue({
                        name:'门店列表',
                        key:'best,good,bad,undo'
                    });
                    router.go({path:'/shops'});
                }
            },
            allCheckDetails:function(){
                if(this.report.totalNum>0){
                    this.setConstantValue({
                        name:'覆盖门店列表',
                        key:'best,good,bad'
                    });
                    router.go({path:'/shops'});
                }
            },
            /**
             * 查看合格的详情
             */
            okDetails:function(){
                if(this.report.okNum>0){
                    this.setConstantValue({
                        name:'合格门店列表',
                        key:'best,good'
                    });
                    router.go({path:'/shops'});
                }
            },
            setConstantValue:function(data){
                Constant.shopParam.shopsPage.title = data.name;
                Constant.shopParam.shopsPage.key = data.key;
            }
        }
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .report-content,.report-content-inner{
    width: 100%;
  }
  .type-list{
    padding:5px 0px;
  }
  .type-list ul{
    text-align: center;
  }
  .type-li{
    display: inline-block;
    width: 24%;
    padding: 10px;
  }
  .type-circle{
    width: 60px;
    height: 60px;
    line-height: 60px;
    border:1px solid #f90;
    border-radius: 30px;
    text-align: center;
    color: #f90;
    font-size: 14px;
  }
  .type-circle.active{
    background: #fa0;
    color: #fff;
  }
  .type-circle.disabled{
    border:1px solid #ccc;
    color: #ccc;
  }
  .help1{
    left:33%;
    top:20%;
  }
</style>