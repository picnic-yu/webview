<template>
  <div class="page" id="search" :transition="transitionName">
    <header class="bar bar-nav">
      <h1 class='title' v-i18n="{value:'selectdate'}"></h1>
      <span class="pull-left icon-back" onclick="goBack()"></span>
    </header>
    <div class="content">
      <div class="default-panel">
        <p><a class="button  button-orange" v-on:click="thisweek()" v-i18n="{value:'statisticweek'}"></a></p>
        <p><a class="button  button-orange" v-on:click="thismonth()" v-i18n="{value:'statisticmonth'}"></a></p>
      </div>
      <div class="time-panel">
        <div class="panel-title" v-i18n="{value:'timerangestatistic'}"></div>
        <div class="time-box list-block">
          <div class="item-content">
            <div class="item-inner">
              <div class="item-title label" v-i18n="{value:'starttime'}"></div>
              <div class="item-input"><input id="box-starttime" v-i18n.placeholder="{value:'pleaseselectstartdate'}" type="text" v-model="search.startTime" readonly></div>
            </div>
          </div>
          <div class="item-content">
            <div class="item-inner">
              <div class="item-title label" v-i18n="{value:'endtime'}"></div>
              <div class="item-input"><input id="box-endtime" v-i18n.placeholder="{value:'pleaseselectenddate'}" type="text" v-model="search.endTime" readonly></div>
            </div>
          </div>
        </div>
      </div>
      <p class="submit-panel"><a class="button button-fill  button-orange"  v-on:click="othertime()" v-i18n="{value:'statistic'}"></a></p>
    </div>
  </div>
</template>

<script>
    var commonutils = require('../../../common/assets/js/commonutils');
    var _sc,_ec;
    module.exports =  {
        route:{
            data:function(transition){
                transition.next({
                    search:Constant.search
                });
            },
            deactivate:function(transition){
                if(_sc) _sc.close();
                if(_ec) _ec.close();
                transition.next();
            }
        },
        data:function(){
            return {
                transitionName:'right'
            };
        },
        props:{
            search:{
                type:Object,
                twoWay:true,
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
            this.initUI();
        },
        methods:{
            init:function(){

            },
            initUI:function(){
                var _this = this;
                $('#box-starttime').calendar({
                    monthNames: [this.$translate('jan'), this.$translate('feb'), this.$translate('mar'), this.$translate('apr'), this.$translate('may'), this.$translate('june'), this.$translate('july'), this.$translate('aug') , this.$translate('sep'), this.$translate('oct'), this.$translate('nov'), this.$translate('dec')],
                    monthNamesShort: [this.$translate('jan'), this.$translate('feb'), this.$translate('mar'), this.$translate('apr'), this.$translate('may'), this.$translate('june'), this.$translate('july'), this.$translate('aug') , this.$translate('sep'), this.$translate('oct'), this.$translate('nov'), this.$translate('dec')],
                    dayNames: [this.$translate('sun'), this.$translate('mon'), this.$translate('tue'), this.$translate('wed'), this.$translate('thu'), this.$translate('fri'), this.$translate('sat')],
                    dayNamesShort: [this.$translate('sun'), this.$translate('mon'), this.$translate('tue'), this.$translate('wed'), this.$translate('thu'), this.$translate('fri'), this.$translate('sat')],
                    maxDate:this.search.endTime.replace(/-/g,'/'),
                    ready:function(p){
                        _sc = p;
                    },
                    onClose:function(p,values,displayValues){
                        _ec.params.minDate = _this.search.startTime.replace(/-/g,'/')+" 00:00:00";//控制开始时间结束世界的min maxDate
                    }
                });
                $('#box-endtime').calendar({
                    monthNames: [this.$translate('jan'), this.$translate('feb'), this.$translate('mar'), this.$translate('apr'), this.$translate('may'), this.$translate('june'), this.$translate('july'), this.$translate('aug') , this.$translate('sep'), this.$translate('oct'), this.$translate('nov'), this.$translate('dec')],
                    monthNamesShort: [this.$translate('jan'), this.$translate('feb'), this.$translate('mar'), this.$translate('apr'), this.$translate('may'), this.$translate('june'), this.$translate('july'), this.$translate('aug') , this.$translate('sep'), this.$translate('oct'), this.$translate('nov'), this.$translate('dec')],
                    dayNames: [this.$translate('sun'), this.$translate('mon'), this.$translate('tue'), this.$translate('wed'), this.$translate('thu'), this.$translate('fri'), this.$translate('sat')],
                    dayNamesShort: [this.$translate('sun'), this.$translate('mon'), this.$translate('tue'), this.$translate('wed'), this.$translate('thu'), this.$translate('fri'), this.$translate('sat')],
                    minDate:this.search.startTime.replace(/-/g,'/')+" 00:00:00",
                    maxDate: commonutils.formatDateTime(new Date(), 1).replace(/-/g, '/'),
                    ready:function(p){
                        _ec = p;
                    },
                    onClose:function(p,values,displayValues){
                        _sc.params.maxDate = _this.search.endTime.replace(/-/g,'/');//控制开始时间结束世界的min maxDate
                    }
                });
            },
            //本周
            thisweek:function(){
                var time = commonutils.getThisWeekTime();
                this.setTime(time);
                this.toIndex();
            },
            //本月
            thismonth:function(){
                var time = commonutils.getThisMonthTime();
                this.setTime(time);
                this.toIndex();
            },
            othertime:function(){
                this.setTime(this.search);
                this.toIndex();
            },
            setTime:function(time){
                Constant.search = time;
            },
            toIndex:function(){
                this.$dispatch('search-data');
                router.go({name:'default'});
            }
        }
    };
</script>

<style>
  .button-orange{
    border-color:#fa0;
    color: #fa0;
  }
  .button-orange:active{
    background-color: #fff7ee;
    border-color:#fa0;
    color: #f90;
  }
  .button-fill.button-orange{
    color: #fff;
    background-color: #f90;
  }
  .button-fill.button-orange:active{
    background-color: #fa0;
  }
  .button,.button.button-fill{
    height:40px;
    line-height: 40px;
  }
  .default-panel{
    margin:10px 30px;
  }
  .default-panel p{margin:25px 0px;}
  .panel-title{
    background: #eee;
    text-align: left;
    padding-left:10px;
    font-size: 16px;
    height:44px;
    line-height: 44px;
  }
  .time-box.list-block{margin:0px;}
  .time-box.list-block .item-content{padding-left:0px;}
  .time-box.list-block .item-title.label{padding-left:30px;font-size:14px;}
  .submit-panel{margin:20px 30px;}
</style>