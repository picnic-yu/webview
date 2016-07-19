<template>
    <div class="popup popup-detail">
        <header class="bar bar-nav">
            <h1 class='title'>{{record.create_time|whichdate}}销售数据</h1>
        </header>
        <div class="content ">
            <div class="list-block">
                    <ul>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">销售单数</div>
                                    <div class="item-input">
                                        <input type="number" pattern="[0-9]{1,10}"  placeholder="请输入当日的销售单数" v-model="record.dealPersonNum" maxlength="9"/>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">销售件数</div>
                                    <div class="item-input">
                                        <input type="number" pattern="[0-9]{1,10}" placeholder="请输入当日的销售件数" v-model="record.dealNum" maxlength="9"/>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">总销售额</div>
                                    <div class="item-input">
                                        <input type="number" pattern="[0-9]{1,10}" placeholder="请输入当日的销售额(元)" v-model="record.total" maxlength="9"/>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
            </div>
        </div>
        <div class="bottom">
            <p class="submit-panel"><a class="button button-fill  button-orange"  v-on:click="submitData()">确定</a></p>
        </div>
        </div>
    </div>
</template>
<script>
    var utils = require('../utils');
    module.exports = {
        data: function () {
            return {
                record:{},
                recordCopy:{}
            };
        },
        events:{
            'popup':function(param){
                if(param.name == 'detail'){
                    $.popup('.popup-detail');
                    this.record = param.item;
                    $.extend(true,this.recordCopy,this.record);//深度拷贝
                }
            }
        },
        filters:{
            'whichdate':function(time){
                if(!time) return '';
                time = time.substring(0,10);
                time = time.replace('-','年');
                time = time.replace('-','月');
                return time+'日';
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            init: function () {
                this.hasInit = true;
            },
            clearData:function(){
                this.record = {};
                this.recordCopy = {};
            },
            submitData:function(){
                if(this.doing) return;
                if(!this.record.dealPersonNum){
                    $.toast("请输入销售单数");
                    return;
                }
                if(this.record.dealPersonNum.length > 9 || this.record.dealPersonNum < 0 || !utils.isInteger(this.record.dealPersonNum)){
                    $.toast("销售单数不合法");
                    return;
                }

                if(!this.record.dealNum){
                    $.toast("请输入销售件数");
                    return;
                }
                if(this.record.dealNum.length > 9 || this.record.dealNum < 0 || !utils.isInteger(this.record.dealNum)){
                    $.toast("销售件数不合法");
                    return;
                }
                if(!this.record.total){
                    $.toast("请输入总销售额");
                    return;
                }
                if(this.record.total.length > 9 || this.record.total < 0 || !utils.isInteger(this.record.total)){
                    $.toast("总销售额不合法");
                    return;
                }
                if(!isDataChange(this.record,this.recordCopy)){//数据没有改变
                    this.close();
                    return;
                }
                var _this = this;
                this.doing = true;
                this.$http.post('/service/saveSaleData.action?token='+Constant.token,{
                    sale:{
                        id:this.record.id,
                        dep_id:Constant.shopInfo.id,
                        dealPersonNum:this.record.dealPersonNum,
                        total:this.record.total,
                        dealNum:this.record.dealNum
                    },
                    start_time:this.record.create_time
                }).then(function(ret){
                    _this.doing = false;
                    if(ret.ok && ret.data && ret.data.result == 'ok'){
                        $.toast('修改数据成功');
                        _this.close();
                    }else if(ret.ok && ret.data && ret.data.result == 'DUPLICATE'){
                        $.toast("修改失败：当天数据已经存在");
                    }else{
                        $.toast("修改失败");
                    }
                });
            },
            close:function(){
                this.clearData();
                $.closeModal('.popup-detail');
            }
        }
    };

    function isDataChange(newdata,olddata){
        if(newdata.dealPersonNum != olddata.dealPersonNum)
            return true;
        if(newdata.dealNum != olddata.dealNum)
            return true;
        if(newdata.total != olddata.total)
            return true;
        return false;
    }
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

</style>