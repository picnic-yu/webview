<template>
    <div class="popup popup-detail">
        <header class="bar bar-nav">
                <button class="button pull-left cancel-button" v-on:click="close()" v-i18n="{value:'cancelBtn'}"></button>
                <h1 class='title' v-i18n="{value:'checktaskconfig'}"></h1>
        </header>
        <div class="content">
            <div class="list-block">
                    <ul>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label" v-i18n="{value:'taskname'}"></div>
                                    <div class="item-input">
                                        <input type="text" v-i18n.placeholder="{value:'pleaseinputtaskname'}" v-model="taskName"/>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label" v-i18n="{value:'taskweek'}"></div>
                                    <div class="item-input">
                                        <select id="execute" v-on:change="selectExecute()" style="-webkit-appearance: none;">
                                            <option value=1 v-i18n="{value:'week'}"></option>
                                            <option value=2 v-i18n="{value:'month'}"></option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label" v-i18n="{value:'executedate'}"></div>
                                    <div class="item-input" v-show="weekCombo">
                                    <input type="text" v-i18n.placeholder="{value:'pleaseselect'}" v-on:click="selectWeek()" readonly="readonly" v-model="weekDateName"/>
                                    </div>
                                    <div class="item-input" v-show="!weekCombo">
                                    <input type="text" v-i18n.placeholder="{value:'pleaseselect'}" v-on:click="selectMonth()" readonly="readonly" v-model="monthDateName"/>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label" v-i18n="{value:'executetime'}"></div>
                                    <div class="item-input">
                                    <input type="text" id="timepicker" v-model="exeTime"/>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label" v-i18n="{value:'startdate'}"></div>
                                    <div class="item-input">
                                    <input type="text" id="startdate" v-model="startTime" v-i18n.placeholder="{value:'inputstartdate'}">
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label" v-i18n="{value:'enddate'}"></div>
                                    <div class="item-input">
                                    <input type="text" id="enddate" v-model="endTime" v-i18n.placeholder="{value:'inputenddate'}">
                                    </div>
                                </div>
                            </div>
                         </li>
                         <li>
                             <div class="item-content">
                                 <div class="item-inner">
                                     <div class="item-title label" v-i18n="{value:'excutetype'}"></div>
                                     <div class="item-input">
                                      <select id="selectType" v-on:change="selectExeType()">
                                         <option value=1 v-i18n="{value:'byevalutionitem'}"></option>
                                         <option value=0 v-i18n="{value:'byscene'}"></option>
                                      </select>
                                     </div>
                                 </div>
                             </div>
                         </li>
                         <li>
                              <div class="item-content">
                                  <div class="item-inner" v-show="evalution">
                                      <div class="item-title label" v-i18n="{value:'evalutionitem'}"></div>
                                      <div class="item-input">
                                       <input type="text" readonly="readonly" v-on:click="showEvalution()" v-model="evalName">
                                      </div>
                                  </div>
                                  <div class="item-inner" v-show="!evalution">
                                        <div class="item-title label" v-i18n="{value:'scene'}"></div>
                                        <div class="item-input">
                                         <input type="text" readonly="readonly" v-on:click="showScene()" v-model="sceneName">
                                        </div>
                                  </div>
                              </div>
                          </li>
                          <li>
                                  <div class="item-content">
                                      <div class="item-inner">
                                          <div class="item-title label" v-i18n="{value:'shopname'}"></div>
                                          <div class="item-input">
                                              <input type="text" readonly="readonly" v-model="deptName" v-on:click="goToShoplist()"/>
                                          </div>
                                      </div>
                                  </div>
                           </li>
                           <li>
                                 <div class="item-content">
                                     <div class="item-inner">
                                         <div class="item-title label" v-i18n="{value:'checker'}"></div>
                                         <div class="item-input">
                                             <input type="text" readonly="readonly" v-model="checkerName" v-on:click="goToCheckerlist()"/>
                                         </div>
                                     </div>
                                 </div>
                            </li>
                            <li>
                                 <div class="item-content">
                                     <div class="item-inner">
                                         <div class="item-title label" v-i18n="{value:'taskvalidday'}"></div>
                                         <div class="item-input">
                                             <input type="text" v-model="invalidDays"/>
                                         </div>
                                     </div>
                                 </div>
                            </li>
                            <li>
                                <div class="item-content">
                                    <div class="item-inner" style="color:#333;">
                                        <div class="item-title label" v-i18n="{value:'gotocapture'}"></div>
                                        <div class="item-input" v-on:click="selectCapture()">
                                            <span class="item-icon" v-bind:class="isCapture==1?'icon-square-check':'icon-square'"></span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                    </ul>
            </div>
        </div>
        <div class="bottom">
            <p class="submit-panel"><a class="button button-fill  button-orange"  v-on:click="submitData()" v-i18n="{value:'sure'}"></a></p>
            <p class="submit-panel" v-show="deleteflag"><a class="button button-fill  button-ccc"  v-on:click="deleteData()" v-i18n="{value:'delete'}"></a></p
        </div>
    </div>
    <checker></checker>
    <dept></dept>
    <weekcombo></weekcombo>
    <monthcombo></monthcombo>
    <evalutioncombo></evalutioncombo>
    <scene></scene>
</template>
<script>
    var utils = require('../utils');
    var commonutils = require('../../../common/assets/js/commonutils');
    module.exports = {
        data: function () {
            return {
                record:{},
                recordCopy:{},
                selectweeks:[],
                selectmonths:[],
                weekDateName:'',
                weekDateIds:'',
                monthDateName:'',
                weekCombo:true,
                evalution:true,
                selectevals:[],
                evalName:'',
                selectscenes:[],
                sceneName:'',
                deleteflag:true,
                exeTime:'09:00',
                startTime:'',
                endTime:'',
                selectdepts:[],
                deptName:'',
                selectchecker:[],
                checkerName:'',
                invalidDays:'',
                isCapture:0,
                status:'',
                doing:false,
                taskName:''
            };
        },
        events:{
            'popup':function(param){
                if(param.name == 'detail'){
                    $.popup('.popup-detail');
                    this.record = param.item;
                    this.deleteflag = param.flag;
                    $.extend(true,this.recordCopy,this.record);//深度拷贝
                    //修改
                    if(this.deleteflag){
                       this.setRecord();
                    }else{
                       this.resetRecord();
                    }
                }
            },
            'week':function(param){
                this.selectweeks = [];
                $.extend(true,this.selectweeks,param.selectweeks);//深度拷贝
                this.weekDateName = '';
                this.weekDateIds = '';
                for(var i=0;i<this.selectweeks.length;i++){
                    this.weekDateName = this.weekDateName + this.selectweeks[i].name;
                    this.weekDateIds = this.weekDateIds + this.selectweeks[i].id;
                    if(i<this.selectweeks.length-1){
                        this.weekDateName = this.weekDateName + ',';
                        this.weekDateIds = this.weekDateIds + ',';
                    }
                }
            },
            'month':function(param){
                this.selectmonths = [];
                $.extend(true,this.selectmonths,param.selectmonths);//深度拷贝
                this.monthDateName = '';
                for(var i=0;i<this.selectmonths.length;i++){
                    this.monthDateName = this.monthDateName + this.selectmonths[i];
                    if(i<this.selectmonths.length-1){
                        this.monthDateName = this.monthDateName + ',';
                    }
                }
            },
             'evalu':function(param){
                 this.selectevals = [];
                 $.extend(true,this.selectevals,param.selectevals);//深度拷贝
                 this.evalName = '';
                 for(var i=0;i<this.selectevals.length;i++){
                     this.evalName = this.evalName + this.selectevals[i].name;
                     if(i<this.selectevals.length-1){
                         this.evalName = this.evalName + ',';
                     }
                 }
                 this.setValidData();
             },
              'scene':function(param){
                  this.selectscenes = [];
                  $.extend(true,this.selectscenes,param.selectscenes);//深度拷贝
                  this.sceneName = '';
                  for(var i=0;i<this.selectscenes.length;i++){
                      this.sceneName = this.sceneName + this.selectscenes[i].preName;
                      if(i<this.selectscenes.length-1){
                          this.sceneName = this.sceneName + ',';
                      }
                  }
                  this.setValidData();
              },
              'dept':function(param){
                    this.selectdepts = [];
                    $.extend(true,this.selectdepts,param.selectdepts);//深度拷贝
                    this.deptName = '';
                    for(var i=0;i<this.selectdepts.length;i++){
                        this.deptName = this.deptName + this.selectdepts[i].name;
                        if(i<this.selectdepts.length-1){
                            this.deptName = this.deptName + ',';
                        }
                    }
                    this.setValidData();
              },
              'checker':function(param){
                      this.selectchecker = [];
                      $.extend(true,this.selectchecker,param.selectchecker);//深度拷贝
                      if(this.selectchecker.length>0){
                        this.checkerName = this.selectchecker[0].showName;
                      }else{
                        this.checkerName = '';
                      }
               }
        },
        components:{
            weekcombo : require('./../components/Week.vue'), //周组件
            monthcombo : require('./../components/Month.vue'), //月组件
            evalutioncombo : require('./../components/Evalution.vue'), //点检项组件
            scene : require('./../components/Scene.vue'),  //场景组件
            dept:require('./../components/DeptList.vue'), //门店组件
            checker:require('./../components/Checker.vue') //点检人组件
        },
        ready: function () {
            this.init();
        },
        methods: {
            init: function () {
                var _this = this;
                //定义执行时间
                var hours = [];
                for(var i=0;i<24;i++){
                    if(i<10){
                        hours.push('0'+i);
                    }else{
                        hours.push(i);
                    }
                }
                var mins = [];
                for(var j=0;j<60;j++){
                    if(j<10){
                        mins.push('0'+j);
                    }else {
                        mins.push(j);
                    }
                }
                $("#timepicker").picker({
                    toolbarTemplate:'<header class="bar bar-nav"><button class="button-link pull-right close-picker">'+this.$translate("sure")+'</button></header>',
                    cols:[{
                       textAlign:'center',
                       values:hours
                    },{
                       textAlign:'center',
                       values:mins
                    }],
                    value:["09","00"],
                    formatValue:function(picker,value,displayValue){
                        return value[0]+":"+value[1];
                    }
                });
                var curDate = commonutils.formatDateTime(new Date(), 1);
                //定义开始日期
                $("#startdate").calendar({
                    monthNames: [this.$translate('jan'), this.$translate('feb'), this.$translate('mar'), this.$translate('apr'), this.$translate('may'), this.$translate('june'), this.$translate('july'), this.$translate('aug') , this.$translate('sep'), this.$translate('oct'), this.$translate('nov'), this.$translate('dec')],
                    monthNamesShort: [this.$translate('jan'), this.$translate('feb'), this.$translate('mar'), this.$translate('apr'), this.$translate('may'), this.$translate('june'), this.$translate('july'), this.$translate('aug') , this.$translate('sep'), this.$translate('oct'), this.$translate('nov'), this.$translate('dec')],
                    dayNames: [this.$translate('sun'), this.$translate('mon'), this.$translate('tue'), this.$translate('wed'), this.$translate('thu'), this.$translate('fri'), this.$translate('sat')],
                    dayNamesShort: [this.$translate('sun'), this.$translate('mon'), this.$translate('tue'), this.$translate('wed'), this.$translate('thu'), this.$translate('fri'), this.$translate('sat')],
                    minDate:curDate.replace(/-/g,'/')
                });
                //定义结束日期
                $("#enddate").calendar({
                    monthNames: [this.$translate('jan'), this.$translate('feb'), this.$translate('mar'), this.$translate('apr'), this.$translate('may'), this.$translate('june'), this.$translate('july'), this.$translate('aug') , this.$translate('sep'), this.$translate('oct'), this.$translate('nov'), this.$translate('dec')],
                    monthNamesShort: [this.$translate('jan'), this.$translate('feb'), this.$translate('mar'), this.$translate('apr'), this.$translate('may'), this.$translate('june'), this.$translate('july'), this.$translate('aug') , this.$translate('sep'), this.$translate('oct'), this.$translate('nov'), this.$translate('dec')],
                    dayNames: [this.$translate('sun'), this.$translate('mon'), this.$translate('tue'), this.$translate('wed'), this.$translate('thu'), this.$translate('fri'), this.$translate('sat')],
                    dayNamesShort: [this.$translate('sun'), this.$translate('mon'), this.$translate('tue'), this.$translate('wed'), this.$translate('thu'), this.$translate('fri'), this.$translate('sat')],
                    minDate:curDate.replace(/-/g,'/')
                });
                this.registUserListEvent();
            },
            //注册通讯录事件
            registUserListEvent:function () {
                var _this = this;
                window.saveUserList = function (res) {
                    if(typeof(res) == 'string'){
                        res = JSON.parse(res);
                    }
                    var list = formatUserList(res.users);
                    _this.selectchecker = [];
                    $.extend(true,_this.selectchecker,list);//深度拷贝
                    if(_this.selectchecker.length>0){
                        _this.checkerName = _this.selectchecker[0].showName;
                    }else{
                        _this.checkerName = '';
                    }
                };
            },
            clearData:function(){
                this.record = {};
                this.recordCopy = {};
            },
            //Check department has storer and has config scene or evalution
            setValidData:function(){
                var depstr="";
                if(this.selectdepts){
                    for(var i=0;i<this.selectdepts.length;i++){
                        depstr = depstr + this.selectdepts[i].id;
                        if(i<this.selectdepts.length-1){
                            depstr+=",";
                        }
                    }
                }
                //Evalution
                if($("#selectType").val()==1){
                    var checkitemstr = "";
                    if(this.selectevals){
                        for(var i=0;i<this.selectevals.length;i++){
                            checkitemstr = checkitemstr + this.selectevals[i].id;
                            if(i<this.selectevals.length-1){
                                checkitemstr+=",";
                            }
                        }
                    }
                    //必须两个同时选择后才去判断
                    if(checkitemstr && depstr){
                        this.$http.post('/ajax/checkDeptHasDbViewShop.action?token='+Constant.token,{
                            dbViewShopIds:checkitemstr,
                            deptIds:depstr
                        }).then(function(ret){
                            if(ret.ok && ret.data && ret.data.result == 'ok'){
                                var alertstr = "";
                                //有门店没有配置点检项
                                if(ret.data.data.hasExist){
                                    var shops = ret.data.data.data;
                                    if(shops&&shops.length>0){
                                        var shopstr="";
                                        for(var i=0;i<shops.length;i++){
                                            for(var j=0;j<this.selectdepts.length;j++){
                                                if(this.selectdepts[j].id==shops[i].id){
                                                    this.selectdepts.splice(j,1);
                                                    break;
                                                }
                                            }
                                            shopstr = shopstr + shops[i].name;
                                            if(i<shops.length-1){
                                                shopstr = shopstr + ",";
                                            }
                                        }
                                        alertstr = this.$translate("shopnotrelatealert")+shopstr+"<br>";
                                    }
                                }
                                if(ret.data.data.hasManager){
                                    var shops = ret.data.data.depts;
                                    if(shops&&shops.length>0){
                                        var shopstr="";
                                        for(var i=0;i<shops.length;i++){
                                            for(var j=0;j<this.selectdepts.length;j++){
                                                if(this.selectdepts[j].id==shops[i].id){
                                                    this.selectdepts.splice(j,1);
                                                    break;
                                                }
                                            }
                                            shopstr = shopstr + shops[i].name;
                                            if(i<shops.length-1){
                                                shopstr = shopstr + ",";
                                            }
                                        }
                                        alertstr = alertstr + this.$translate("shophasnostorer")+shopstr;
                                    }
                                }
                                if(alertstr){
                                    this.deptName = "";
                                    for(var i=0;i<this.selectdepts.length;i++){
                                        this.deptName = this.deptName + this.selectdepts[i].name;
                                        if(i<this.selectdepts.length-1){
                                            this.deptName = this.deptName + ',';
                                        }
                                    }
                                    $.alert(alertstr);
                                }
                            }
                        });
                    }
                }else{
                    var presetitemstr = "";
                    if(this.selectscenes){
                        for(var i=0;i<this.selectscenes.length;i++){
                            presetitemstr = presetitemstr + this.selectscenes[i].preId;
                            if(i<this.selectscenes.length-1){
                                presetitemstr+=",";
                            }
                        }
                    }
                    //必须两个同时选择后才去判断
                    if(presetitemstr && depstr){
                        this.$http.post('/ajax/checkDeptHasScene.action?token='+Constant.token,{
                            sceneNos:presetitemstr,
                            deptIds:depstr
                        }).then(function(ret){
                            if(ret.ok && ret.data && ret.data.result == 'ok'){
                                var alertstr = "";
                                //有门店没有配置点检项
                                if(ret.data.data.hasExist){
                                    var shops = ret.data.data.data;
                                    if(shops&&shops.length>0){
                                        var shopstr="";
                                        for(var i=0;i<shops.length;i++){
                                            for(var j=0;j<this.selectdepts.length;j++){
                                                if(this.selectdepts[j].id==shops[i].id){
                                                    this.selectdepts.splice(j,1);
                                                    break;
                                                }
                                            }
                                            shopstr = shopstr + shops[i].name;
                                            if(i<shops.length-1){
                                                shopstr = shopstr + ",";
                                            }
                                        }
                                        alertstr = this.$translate("shophasnoscene")+shopstr+"<br>";
                                    }
                                }
                                if(ret.data.data.hasManager){
                                    var shops = ret.data.data.depts;
                                    if(shops&&shops.length>0){
                                        var shopstr="";
                                        for(var i=0;i<shops.length;i++){
                                            for(var j=0;j<this.selectdepts.length;j++){
                                                if(this.selectdepts[j].id==shops[i].id){
                                                    this.selectdepts.splice(j,1);
                                                    break;
                                                }
                                            }
                                            shopstr = shopstr + shops[i].name;
                                            if(i<shops.length-1){
                                                shopstr = shopstr + ",";
                                            }
                                        }
                                        alertstr = alertstr + this.$translate("shophasnostorer")+shopstr;
                                    }
                                }
                                if(alertstr){
                                    this.deptName = "";
                                    for(var i=0;i<this.selectdepts.length;i++){
                                        this.deptName = this.deptName + this.selectdepts[i].name;
                                        if(i<this.selectdepts.length-1){
                                            this.deptName = this.deptName + ',';
                                        }
                                    }
                                    $.alert(alertstr);
                                }
                            }
                        });
                    }
                }
            },
            submitData:function(){
                if(this.doing) return;

                if(!this.taskName){
                    $.toast(this.$translate("pleaseinputtaskname"));
                    return;
                }

                var cron="";
                if($("#execute").val() == 1){
                //执行时间
                cron = this.weekDateIds;
                }else if($("#execute").val() == 2){
                cron = this.monthDateName;
                }
                if(!cron){
                    $.toast(this.$translate("pleaseselectexcutedate"));
                    return;
                }
                if(!this.exeTime){
                    $.toast(this.$translate("pleaseselectexcutetime"));
                    return;
                }
                var crons = this.exeTime.split(':');
                var cronStr="";
                if($("#execute").val() == 1){
                    cronStr = "0 "+crons[1]+" "+crons[0]+" ? * "+cron;
                }else if($("#execute").val() == 2){
                    cronStr = "0 "+crons[1]+" "+crons[0]+" "+cron + " * ?";
                }
                if(!this.startTime){
                    $.toast(this.$translate("pleaseselectstartdate"));
                    return;
                }
                if(!this.endTime){
                    $.toast(this.$translate("pleaseselectenddate"));
                    return;
                }
                if(this.startTime>this.endTime){
                    $.toast(this.$translate("startcannotbigthanend"));
                    return;
                }

                var itemIds = "";
                for(var i=0;i<this.selectevals.length;i++){
                    itemIds = itemIds + this.selectevals[i].id;
                    if(i<this.selectevals.length-1){
                        itemIds+=",";
                    }
                }
                if($("#selectType").val()==1){
                    if(!itemIds){
                        $.toast(this.$translate("selectatleastoneevalute"));
                        return;
                    }
                }
                //场景编号
                var presetNos = "";
                for(var i=0;i<this.selectscenes.length;i++){
                    presetNos = presetNos + this.selectscenes[i].preId;
                    if(i<this.selectscenes.length-1){
                        presetNos+=",";
                    }
                }
                if($("#selectType").val()==0){
                    if(!presetNos){
                        $.toast(this.$translate("selectatleastonescene"));
                        return;
                    }
                }

                var depIds = "";
                for(var i=0;i<this.selectdepts.length;i++){
                    depIds = depIds + this.selectdepts[i].id;
                    if(i<this.selectdepts.length-1){
                        depIds+=",";
                    }
                }
                if(!depIds){
                    $.toast(this.$translate("selectatleastoneshop"));
                    return;
                }
                if(!this.selectchecker[0]){
                    $.toast(this.$translate("selectonechecker"));
                    return;
                }

                if(!this.invalidDays){
                    this.invalidDays = 3;
                }
                //非负整数
                var reg = /^\+?[1-9][0-9]*$/;
                if(!reg.test(this.invalidDays)){
                    $.toast(this.$translate("validdaynotformat"));
                    return;
                }
                if(this.invalidDays<1||this.invalidDays>30){
                    $.toast(this.$translate("validdaynotformat"));
                    return;
                }
                var id = null;
                if(this.deleteflag){
                    id = this.record.id;
                }else{
                    id = null;
                }
                var _this = this;
                this.doing = true;
                this.$http.post('/service/saveCheckTaskForWebView.action?token='+Constant.token,{
                        'checktask.id':id,
                        'checktask.name' : this.taskName,
                        'checktask.frequency' : $("#execute").val(),
                        'checktask.cron' : cronStr,
                        'checktask.startTime' : this.startTime,
                        'checktask.endTime' : this.endTime+" 23:59:59",
                        'checktask.isProcessing' : this.status,
                        'checktask.sourceType':$("#selectType").val(),
                        'checktask.depIds' : depIds,
                        'checktask.presetNos':presetNos,
                        'checktask.dbViewShopIds' : itemIds,
                        'checktask.checker' : this.selectchecker[0].id,
                        'checktask.validDay':this.invalidDays,
                        'checktask.iscapture':this.isCapture
                }).then(function(ret){
                    _this.doing = false;
                    if(ret.ok && ret.data && ret.data.result == 'ok'){
                        $.toast(this.$translate("savetasksuccess"));
                        _this.closeRefresh();
                    }else if(ret.ok && ret.data && ret.data.result == 'NEVER_FIRED'){
                        $.toast(this.$translate("tasknotbedexcuted"));
                    }else{
                        $.toast(this.$translate("savefailed"));
                    }
                });
            },
            selectCapture:function(){
                if(this.isCapture==1){
                    this.isCapture = 0;
                }else{
                    this.isCapture = 1;
                }
            },
            resetRecord:function(){
                this.taskName = "";
                $("#execute").val(1);
                this.selectExecute();
                this.selectweeks = [];
                this.weekDateName = "";
                this.weekDateIds = "";
                this.selectmonths = [];
                this.monthDateName = "";
                $("#timepicker").data("picker").params.value = ["09","00"];
                this.exeTime = "09:00";
                $("#timepicker").picker("setValue",["09","00"]);
                this.startTime = "";
                this.endTime = "";
                $("#startdate").data("calendar").setValue([]);
                $("#enddate").data("calendar").setValue([]);
                $("#selectType").val(1);
                this.selectExeType();
                this.selectchecker = [];
                this.checkerName = "";
                this.invalidDays = 3;
                this.isCapture = 0;
                this.status = 1;
                this.selectevals=[];
                this.evalName='';
                this.selectscenes=[];
                this.sceneName='';
                this.selectdepts = [];
                this.deptName = '';
            },
            setRecord:function(){
               this.taskName = this.record.name;
               var frequency = this.record.frequency;
               $("#execute").val(frequency);
               this.selectExecute();
               var cron = this.record.cron;
               var cronArr = cron.split(" ");
               if(frequency == 1){
                   this.weekDateIds = cronArr[5];
                   var weekArr = cronArr[5].split(",");
                   this.weekDateName = "";
                   this.selectweeks = [];
                   for(var i=0;i<this.$children[2].weeks.length;i++){
                       this.$children[2].weeks[i].checked=false;
                       for(var j=0;j<weekArr.length;j++){
                            if(this.$children[2].weeks[i].id==weekArr[j]){
                                this.weekDateName = this.weekDateName + this.$children[2].weeks[i].name+",";
                                this.$children[2].weeks[i].checked = true;
                                this.selectweeks.push(this.$children[2].weeks[i]);
                                break;
                            }
                       }
                   }
                    if(this.weekDateName.length>1){
                        this.weekDateName = this.weekDateName.substring(0,this.weekDateName.length-1);
                    }
                    this.selectmonths = [];
                    this.monthDateName = "";
                    for(var i=0;i<this.$children[3].colDates.length;i++){
                        this.$children[3].colDates[i].display=false;
                    }
                }else if(frequency == 2){
                    this.monthDateName = cronArr[3];
                    this.selectmonths = cronArr[3].split(",");
                    for(var i=0;i<this.$children[3].colDates.length;i++){
                        this.$children[3].colDates[i].display=false;
                        for(var j=0;j<this.selectmonths.length;j++){
                            if(this.$children[3].colDates[i].id==this.selectmonths[j]){
                                this.$children[3].colDates[i].display = true;
                                break;
                            }
                        }
                    }
                    this.selectweeks = [];
                    this.weekDateName = "";
                    this.weekDateIds = "";
                    for(var i=0;i<this.$children[2].weeks.length;i++){
                        this.$children[2].weeks[i].display=false;
                    }
                }
                    if(parseInt(cronArr[1])<10){
                        cronArr[1] = '0'+parseInt(cronArr[1]);
                    }
                    if(parseInt(cronArr[2])<10){
                        cronArr[2] = '0'+parseInt(cronArr[2]);
                    }
                    $("#timepicker").data("picker").params.value = [cronArr[2],cronArr[1]];
                    this.exeTime = cronArr[2]+":"+cronArr[1];
                    $("#timepicker").picker("setValue",[cronArr[2],cronArr[1]]);
                    this.startTime = this.record.startTime.substring(0,10);
                    this.endTime = this.record.endTime.substring(0,10);
                    $("#startdate").data("calendar").params.value = [this.startTime];
                    $("#enddate").data("calendar").params.value = [this.endTime];
                    $("#startdate").data("calendar").setValue([this.startTime]);
                    $("#enddate").data("calendar").setValue([this.endTime]);
                    $("#selectType").val(this.record.sourceType);
                    this.selectExeType();
                    this.selectchecker = [{id:this.record.checker,showName:this.record.checkerName}];
                    this.checkerName = this.record.checkerName;
                    this.invalidDays = this.record.validDay;
                    this.isCapture = this.record.iscapture;
                    this.status = this.record.isProcessing;
                    var _this = this;
                    this.$http.post('/service/getDeptsAndDbViewShops.action?token='+Constant.token,{
                                         checkTaskId:_this.record.id
                                     }).then(function(ret){
                                         if(ret.ok && ret.data && ret.data.result == 'ok'){
                                         if(ret.data.data.depts&&ret.data.data.depts.length>0){
                                            _this.selectdepts = [];
                                            $.extend(true, _this.selectdepts,ret.data.data.depts);//深度拷贝
                                         }else{
                                             _this.selectdepts = [];
                                         }
                                         _this.deptName = '';
                                         for(var i=0;i<_this.selectdepts.length;i++){
                                             _this.deptName = _this.deptName + _this.selectdepts[i].name;
                                             if(i<_this.selectdepts.length-1){
                                                 _this.deptName = _this.deptName + ',';
                                             }
                                         }
                                         if(ret.data.data.dbViewShops&&ret.data.data.dbViewShops.length>0){
                                            _this.selectevals = [];
                                            $.extend(true, _this.selectevals,ret.data.data.dbViewShops);
                                         }else{
                                            _this.selectevals = [];
                                         }
                                         _this.evalName = '';
                                         for(var i=0;i<_this.selectevals.length;i++){
                                              _this.evalName = _this.evalName + _this.selectevals[i].name;
                                              if(i<_this.selectevals.length-1){
                                                  _this.evalName = _this.evalName + ',';
                                              }
                                         }
                                         if(ret.data.data.presetNames&&ret.data.data.presetNames.length>0){
                                            _this.selectscenes = [];
                                            $.extend(true, _this.selectscenes,ret.data.data.presetNames);
                                         }else{
                                            _this.selectscenes = [];
                                         }
                                         _this.sceneName = '';
                                         for(var i=0;i<_this.selectscenes.length;i++){
                                           _this.sceneName = _this.sceneName + _this.selectscenes[i].preName;
                                           if(i<_this.selectscenes.length-1){
                                               _this.sceneName = _this.sceneName + ',';
                                           }
                                         }
                                         }
                    });
            },
            deleteData:function(){
                var _this = this;
                $.modal.prototype.defaults.modalButtonOk = this.$translate("sure");
                $.modal.prototype.defaults.modalButtonCancel = this.$translate("cancelBtn");
                    $.confirm(this.$translate("confirmdeletetask"),function(){
                     _this.$http.post('/service/deleteCheckTaskById.action?token='+Constant.token,{
                                         checkTaskId:_this.record.id
                                     }).then(function(ret){
                                         if(ret.ok && ret.data && ret.data.result == 'ok'){
                                             $.toast(this.$translate("deletesuccess"));
                                             _this.closeRefresh();
                                         }else{
                                             $.toast(this.$translate("deletefailed"));
                                         }
                     });
                });
            },
            close:function(){
                this.clearData();
                $.closeModal('.popup-detail');
            },
            closeRefresh:function(){
                this.clearData();
                this.$dispatch('refresh', {});
                $.closeModal('.popup-detail');
            },
            selectWeek:function(){
                this.$broadcast('popup', {
                        name: 'weekcombo',
                        selectweeks:this.selectweeks
                 });
            },
            selectMonth:function(){
                this.$broadcast('popup', {
                        name: 'monthcombo',
                        selectmonths:this.selectmonths
                 });
            },
            selectExecute:function(){
               var value = $("#execute").val();
               if(value==1){
                    this.weekCombo = true;
               }else{
                    this.weekCombo = false;
               }
            },
            showEvalution:function(){
                this.$broadcast('popup', {
                        name: 'evalutioncombo',
                        selectevals:this.selectevals
                 });
            },
            showScene:function(){
                this.$broadcast('popup', {
                        name: 'scene',
                        selectscenes:this.selectscenes
                });
            },
            goToShoplist:function(){
                this.$broadcast('popup', {
                    name: 'dept',
                    selectdepts:this.selectdepts
                });
            },
            goToCheckerlist:function(){
                try{
                    var id = '';
                    if(this.selectchecker.length>0){
                        id = this.selectchecker[0].id;
                    }
                    if($.device.android){
                        window.webview && window.webview.openUserList(JSON.stringify({type:1,userIds:id,isHaveSelf:1,isAtAll:0}));
                    }else if($.device.ios){
                        window.webkit.messageHandlers.openUserList.postMessage({type:1,userIds:id,isHaveSelf:1,isAtAll:0});
                    }else{
                        this.$broadcast('popup', {
                            name: 'checker',
                            selectchecker:this.selectchecker
                        });
                    }
                }catch (e){
                    this.$broadcast('popup', {
                        name: 'checker',
                        selectchecker:this.selectchecker
                    });
                }
            },
            selectExeType:function(){
                if($("#selectType").val()==1){
                    this.evalution = true;
                }else{
                    this.evalution = false;
                }
            }
        }
    };

    function formatUserList(users) {
        var list = [];
        for (var i = 0; i < users.length; i++) {
            list.push({
                id:users[i].userId,
                showName:users[i].showName
            });
        }
        return list;
    }
</script>
<style scoped>
.week-container{
    position:relative;
    z-index:100;
    width:65%;
    margin-left:35%;
    border:1px solid #ddd;
    background-color:#fff;
}
.week-container div{
   margin-left:5%;
}
.week-container input{
  margin-right:2%;
}
.content{
    bottom:90px;
    background: #eee;
}
.list-block{
    margin-top: 10px;
    background: #fff;
}
.bottom{
    position: absolute;
    bottom: 5px;
    width: 100%;
    background: #eee;
}
.submit-panel{
    margin:5px 10px;
    margin-bottom: 0px;
}

.cancel-button{
   background-color:#ccc;
   border:none;
   color:#333;
   width:3rem;
   height:1.7rem;
   line-height:1.7rem;
}

.button-ccc{
    background-color:#ccc;
    color:#333;
 }

</style>