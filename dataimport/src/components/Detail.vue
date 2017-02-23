<template>
    <div class="popup popup-detail">
        <header class="bar bar-nav">
            <h1 class='title'>{{record.dep_name}}</h1>
            <a class="right-menu" v-on:click="close()">关闭</a>
        </header>
        <div class="content ">
            <div class="list-block">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">销售日期</div>
                                <div class="item-input">
                                    <input style="background-color:#f1f1f1;" type="text" disabled="disabled" v-model="currentDate"/>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">销售时间</div>
                                <div class="item-input">
                                    <input id="saledetailtime" type="text" v-model="currentTime"/>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">销售单数</div>
                                <div class="item-input">
                                    <input type="number" placeholder="请输入销售单数" v-model="dealPearsonNum" maxlength="9"/>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">总销售额</div>
                                <div class="item-input">
                                    <input type="number" placeholder="请输入总销售额(元)" v-model="total" maxlength="9"/>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="bottom">
            <p class="submit-panel"><a class="button button-fill  button-orange"  v-on:click="submitData()">确定</a></p>
            <p v-show="deleteflag" class="submit-panel"><a class="button button-fill button-gray"  v-on:click="deleteData()">删除</a></p>
        </div>
    </div>
    </div>
</template>
<script>
    var utils = require('../utils');
    var commonutils = require('../../../common/assets/js/commonutils');
    module.exports = {
        data: function () {
            return {
                record:{},
                recordCopy:{},
                deleteflag:true,
                currentDate:'',
                currentTime:'',
                dealPearsonNum:'',
                total:'',
                doing:false
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
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            init: function () {
                var arr1 = [];
                var _this = this;
                for(var i=0;i<24;i++){
                    if(i<10){
                        arr1.push("0"+i);
                    }else{
                        arr1.push(i);
                    }
                }
                var arr2 = [];
                for(var j=0;j<60;j++){
                    if(j<10){
                        arr2.push("0"+j);
                    }else{
                        arr2.push(j);
                    }
                }
                $("#saledetailtime").picker({
                    cols: [
                        {
                            textAlign: 'center',
                            values:arr1
                        },
                        {
                            textAlign: 'center',
                            values: arr2
                        }
                    ],
                    formatValue:function(picker,value,displayValue){
                        return value[0]+":"+value[1];
                    },
                    onClose:function(){
                        _this.setValidTime();
                    }
                });
            },
            clearData:function(){
                this.record = {};
                this.recordCopy = {};
            },
            setRecord:function(){
                this.currentDate = this.record.create_time.substring(0,10);
                this.currentTime = this.record.create_time.substring(11,16);
                var timearr = this.currentTime.split(":");
                $("#saledetailtime").data("picker").params.value = timearr;
                $("#saledetailtime").picker("setValue",timearr);
                this.dealPearsonNum = this.record.dealPersonNum;
                this.total = this.record.total;
            },
            resetRecord:function(){
                this.currentDate = this.record.create_time.substring(0,10);
                var date = new Date();
                var hour = date.getHours();
                var min = date.getMinutes();
                if(hour<10){
                    hour = "0"+hour;
                }
                if(min<10){
                    min = "0"+min;
                }
                this.currentTime = hour+":"+min;
                $("#saledetailtime").data("picker").params.value = [hour,min];
                $("#saledetailtime").picker("setValue",[hour,min]);
                this.dealPearsonNum = '';
                this.total = '';
            },
            setValidTime:function(){
                var _this = this;
                var tempDate = commonutils.formatDateTime(new Date(), 1);
                //如果是当天，则要判断选中的时间不能超过当前时间
                if(_this.currentDate == tempDate){
                    var tempTime = commonutils.formatDateTime(new Date(), 2);
                    var tempArr = tempTime.split(":");
                    if(_this.currentTime){
                        var timeArr = _this.currentTime.split(":");
                        if(timeArr[0]>tempArr[0]||(timeArr[0]==tempArr[0]&&timeArr[1]>tempArr[1])){
                            _this.currentTime = tempArr[0]+":"+tempArr[1];
                            $("#saledetailtime").data("picker").params.value = [tempArr[0],tempArr[1]];
                            $("#saledetailtime").picker("setValue",[tempArr[0],tempArr[1]]);
                        }
                    }
                }
            },
            submitData:function(){
                if(this.doing) return;
                if(this.dealPearsonNum == ''){
                    $.toast("请输入销售单数");
                    return;
                }
                if (this.dealPearsonNum.length > 9 || this.dealPearsonNum <= 0 || !utils.isInteger(this.dealPearsonNum)) {
                    $.toast("销售单数为至少大于0的合法数字");
                    return;
                }

                if(!this.total){
                    $.toast("请输入总销售额");
                    return;
                }
                //非负数
                var reg1 = /^\d+(\.{0,1}\d+){0,1}$/
                if(this.total.length > 9 || !reg1.test(this.total)){
                    $.toast("总销售额不合法");
                    return;
                }
                var detailId = null;
                if(this.deleteflag){
                    if(!this.isDataChange()){
                        this.close();
                        return;
                    }
                    detailId =  this.record.id;
                }else{
                    detailId = null;
                }
                var _this = this;
                this.doing = true;
                this.$http.post('/service/saveSaleDetailData.action?token='+Constant.token,{
                    'saleDetail.id':detailId,
                    'saleDetail.dep_id':Constant.shopInfo.id,
                    'saleDetail.dealPersonNum':this.dealPearsonNum,
                    'saleDetail.total':this.total,
                    'start_time':this.currentDate+" "+this.currentTime+':00'
                }).then(function(ret){
                    _this.doing = false;
                    if(ret.ok && ret.data && ret.data.result == 'ok'){
                        $.toast('保存数据成功');
                        _this.closeRefresh();
                    }else{
                        $.toast("保存失败");
                    }
                });
            },
            deleteData:function(){
                var _this = this;
                var detailId = _this.record.id;
                if(!detailId) return;
                $.confirm('确定要删除这条记录吗？', function () {
                    $.showPreloader('正在删除');
                    _this.$http.post('/service/deleteSaleDetailData.action', {
                        detailId: detailId,
                        token: Constant.token
                    }).then(function (ret) {
                        $.hidePreloader();
                        if (ret.ok && ret.data && ret.data.result == 'ok') {
                            $.toast('删除成功');
                            _this.closeRefresh();
                        } else {
                            $.toast('删除失败');
                        }
                    });
                }, function () {

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
            isDataChange:function(){
                if(this.dealPearsonNum != this.record.dealPersonNum) return true;
                if(this.total != this.record.total) return true;
                if(this.currentTime != this.record.create_time.substring(11,16)) return true;
                return false;
            }
        }
    };
</script>
<style scoped>
    .content{
        bottom:50px;
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
    .button-gray{
        background-color:#ccc;
        color:#333;
    }
    .button-cancel{
        background-color:#ccc;
        color:#333;
        border:none;
        height:30px;
        line-height:30px;
    }
</style>