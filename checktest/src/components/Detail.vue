<template>
    <div class="popup popup-detail">
        <header class="bar bar-nav">
                <button class="button pull-left cancel-button" v-on:click="close()">返回</button>
                <h1 class='title'>点检任务配置</h1>
        </header>
        <div class="content">
            <div class="list-block">
                    <ul>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">任务名称</div>
                                    <div class="item-input">
                                        <input type="text" placeholder="请输入任务名称" v-model="taskName"/>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">任务周期</div>
                                    <div class="item-input">
                                        <select id="execute" v-on:change="selectExecute()">
                                            <option value=1>周</option>
                                            <option value=2>月</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">执行日期</div>
                                    <div class="item-input" v-show="weekCombo">
                                    <input type="text" placeholder="请选择" v-on:click="selectWeek()" readonly="readonly" v-model="weekDateName"/>
                                    </div>
                                    <div class="item-input" v-show="!weekCombo">
                                    <input type="text" placeholder="请选择" v-on:click="selectMonth()" readonly="readonly" v-model="monthDateName"/>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">执行时间</div>
                                    <div class="item-input">
                                    <input type="text" id="timepicker" v-model="exeTime"/>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">开始日期</div>
                                    <div class="item-input">
                                    <input type="text" id="startdate" v-model="startTime" placeholder="请输入开始日期">
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">结束日期</div>
                                    <div class="item-input">
                                    <input type="text" id="enddate" v-model="endTime" placeholder="请输入结束日期">
                                    </div>
                                </div>
                            </div>
                         </li>
                         <li>
                             <div class="item-content">
                                 <div class="item-inner">
                                     <div class="item-title label">执行类型</div>
                                     <div class="item-input">
                                      <select id="selectType" v-on:change="selectExeType()">
                                         <option value=1>按点检项</option>
                                         <option value=0>按场景</option>
                                      </select>
                                     </div>
                                 </div>
                             </div>
                         </li>
                         <li>
                              <div class="item-content">
                                  <div class="item-inner" v-show="evalution">
                                      <div class="item-title label">点检项</div>
                                      <div class="item-input">
                                       <input type="text" readonly="readonly" v-on:click="showEvalution()" v-model="evalName">
                                      </div>
                                  </div>
                                  <div class="item-inner" v-show="!evalution">
                                        <div class="item-title label">场景</div>
                                        <div class="item-input">
                                         <input type="text" readonly="readonly" v-on:click="showScene()" v-model="sceneName">
                                        </div>
                                  </div>
                              </div>
                          </li>
                          <li>
                                  <div class="item-content">
                                      <div class="item-inner">
                                          <div class="item-title label">门店名称</div>
                                          <div class="item-input">
                                              <input type="text" v-model="deptName" v-on:click="goToShoplist()"/>
                                          </div>
                                      </div>
                                  </div>
                           </li>
                           <li>
                                 <div class="item-content">
                                     <div class="item-inner">
                                         <div class="item-title label">点检人</div>
                                         <div class="item-input">
                                             <input type="text" v-model="checkerName" v-on:click="goToCheckerlist()"/>
                                         </div>
                                     </div>
                                 </div>
                            </li>
                            <li>
                                 <div class="item-content">
                                     <div class="item-inner">
                                         <div class="item-title label">任务有效天</div>
                                         <div class="item-input">
                                             <input type="text" v-model="invalidDays"/>
                                         </div>
                                     </div>
                                 </div>
                            </li>
                    </ul>
            </div>
        </div>
        <div class="bottom">
            <p class="submit-panel"><a class="button button-fill  button-orange"  v-on:click="submitData()">确定</a></p>
            <p class="submit-panel" v-show="deleteflag"><a class="button button-fill  button-ccc"  v-on:click="deleteData()">删除</a></p
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
                exeTime:'9:0',
                startTime:'',
                endTime:'',
                selectdepts:[],
                deptName:'',
                selectchecker:[],
                checkerName:'',
                invalidDays:'',
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
                    hours.push(i);
                }
                var mins = [];
                for(var j=0;j<60;j++){
                    mins.push(j);
                }
                $("#timepicker").picker({
                    toolbarTemplate:'<header class="bar bar-nav"><button class="button-link pull-right close-picker">确定</button></header>',
                    cols:[{
                       textAlign:'center',
                       values:hours
                    },{
                       textAlign:'center',
                       values:mins
                    }],
                    value:["9","0"],
                    formatValue:function(picker,value,displayValue){
                        return value[0]+":"+value[1];
                    }
                });
                //定义开始日期
                $("#startdate").calendar();
                //定义结束日期
                $("#enddate").calendar();
            },
            clearData:function(){
                this.record = {};
                this.recordCopy = {};
            },
            submitData:function(){
                if(this.doing) return;

                if(!this.taskName){
                    $.toast("请输入任务名称");
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
                    $.toast("请选择执行日期");
                    return;
                }
                if(!this.exeTime){
                    $.toast("请选择执行时间");
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
                    $.toast("请选择开始日期");
                    return;
                }
                if(!this.endTime){
                    $.toast("请选择结束日期");
                    return;
                }
                if(this.startTime>this.endTime){
                    $.toast("开始日期不能大于结束日期");
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
                        $.toast("请至少选择一个点检项");
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
                        $.toast("请至少选择一个场景");
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
                    $.toast("请至少选择一个门店");
                    return;
                }
                if(!this.selectchecker[0]){
                    $.toast("请选择一个点检人");
                    return;
                }

                if(!this.invalidDays){
                    this.invalidDays = 3;
                }
                //非负整数
                var reg = /^\+?[1-9][0-9]*$/;
                if(!reg.test(this.invalidDays)){
                    $.toast("请输入合法的有效天,范围1～30不能为小数");
                    return;
                }
                if(this.invalidDays<1||this.invalidDays>30){
                    $.toast("请输入合法的有效天,范围1～30不能为小数");
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
                        'checktask.validDay':this.invalidDays
                }).then(function(ret){
                    _this.doing = false;
                    if(ret.ok && ret.data && ret.data.result == 'ok'){
                        $.toast('保存任务成功');
                        _this.closeRefresh();
                    }else if(ret.ok && ret.data && ret.data.result == 'NEVER_FIRED'){
                        $.toast("此任务永远不会被执行");
                    }else{
                        $.toast("保存失败");
                    }
                });
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
                $("#timepicker").data("picker").params.value = ["9","0"];
                this.exeTime = "9:0";
                $("#timepicker").picker("setValue",["9","0"]);
                this.startTime = "";
                this.endTime = "";
                $("#startdate").data("calendar").setValue([]);
                $("#enddate").data("calendar").setValue([]);
                $("#selectType").val(1);
                this.selectExeType();
                this.selectchecker = [];
                this.checkerName = "";
                this.invalidDays = 3;
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
                   for(var i=0;i<this.$children[3].weeks.length;i++){
                       this.$children[3].weeks[i].checked=false;
                       for(var j=0;j<weekArr.length;j++){
                            if(this.$children[3].weeks[i].id==weekArr[j]){
                                this.weekDateName = this.weekDateName + this.$children[3].weeks[i].name+",";
                                this.$children[3].weeks[i].checked = true;
                                this.selectweeks.push(this.$children[3].weeks[i]);
                                break;
                            }
                       }
                   }
                    if(this.weekDateName.length>1){
                        this.weekDateName = this.weekDateName.substring(0,this.weekDateName.length-1);
                    }
                    this.selectmonths = [];
                    this.monthDateName = "";
                    for(var i=0;i<this.$children[2].colDates.length;i++){
                        this.$children[2].colDates[i].display=false;
                    }
                }else if(frequency == 2){
                    this.monthDateName = cronArr[3];
                    this.selectmonths = cronArr[3].split(",");
                    for(var i=0;i<this.$children[2].colDates.length;i++){
                        this.$children[2].colDates[i].display=false;
                        for(var j=0;j<this.selectmonths.length;j++){
                            if(this.$children[2].colDates[i].id==this.selectmonths[j]){
                                this.$children[2].colDates[i].display = true;
                                break;
                            }
                        }
                    }
                    this.selectweeks = [];
                    this.weekDateName = "";
                    this.weekDateIds = "";
                    for(var i=0;i<this.$children[3].weeks.length;i++){
                        this.$children[3].weeks[i].display=false;
                    }
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
                $.confirm("确认删除该任务吗?",function(){
                     _this.$http.post('/service/deleteCheckTaskById.action?token='+Constant.token,{
                                         checkTaskId:_this.record.id
                                     }).then(function(ret){
                                         if(ret.ok && ret.data && ret.data.result == 'ok'){
                                             $.toast('删除成功');
                                             _this.closeRefresh();
                                         }else{
                                             $.toast("删除失败");
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
                this.$broadcast('popup', {
                    name: 'checker',
                    selectchecker:this.selectchecker
                });
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