<template>
    <div class="page-group" :transition="transitionName">
        <div class="page page-current container" id="index">
            <header class="bar bar-nav">
                <h1 class='title'>设备注册</h1>
                <a class="right-menu" v-on:click="goDeviceList()">列表</a>
            </header>
            <div class="content">
                <div class="list-block item-step2">
                    <ul>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">设备名称</div>
                                    <div class="item-input"><input  type="text"  v-model="device.name" readonly/></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">序列号</div>
                                    <div class="item-input"><input v-model="device.mac" type="text" readonly/></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">设备类型</div>
                                    <div class="item-input"><input v-model="device.deviceType" type="text" readonly/></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">设备密码</div>
                                    <div class="item-input"><input v-model="device.pwd" type="text"  maxlength="32" placeholder="{{'初始密码为'+(device.dType==2?'admin123':'admin')}}"/></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <p class="submit-panel" v-show="!regSuccess"><a class="button button-fill  button-orange"  v-on:click="next()" v-bind:class="!doing && device.pwd?'':'disabled'">完成注册</a></p>
                    <p class="submit-panel" v-show="regSuccess"><a class="button button-fill  button-success">设备注册成功</a></p>
                </div>
            </div>
        </div>
        <devicerelevancy transition="slide"></devicerelevancy>
    </div>
</template>
<script>
    var utils = require('./../utils');
    var DeviceRelevancy = require('../components/DeviceRelevancy');
    module.exports = {
        route:{
            data:function(transition){
                transition.next({
                    device:Constant.device,
                    shopInfo:Constant.shopInfo,
                    regSuccess:false
                });
            }
        },
        data:function(){
            return {
                transitionName:'right',
                device:{
                    name:'',
                    mac:'',
                    deviceType:'',
                    pwd:''
                },
                shopInfo:{
                    id:'',
                    name:''
                },
                regSuccess:false,
                doing:false
            }
        },
        components:{
            devicerelevancy:DeviceRelevancy
        },
        events:{
            'refreshDeviceList':function(){
                utils.goDeviceList();
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            init: function () {

            },
            goDeviceList:function(){
                utils.goDeviceList();
            },
            next:function(){
                if(this.doing || !this.device.pwd) return;
                var _this = this;
                this.doing = true;
                $.showPreloader('正在注册设备...');
                this.$http.post('/service/registDevice0.action?token='+Constant.token,{
                    serialNo:this.device.mac,
                    passwd:this.device.pwd,
                    deviceType:this.device.deviceType,
                    deviceName:this.device.name,
                    depId:Constant.shopInfo.id
                }).then(function(ret){
                    _this.doing = false;
                    $.hidePreloader();
                    if(ret.ok && ret.data){
                        if(ret.data.result == 'ok'){
                            _this.success();
                        }else if(ret.data.result == '-1'){
                            $.toast('不能识别当前设备');
                        }else if(ret.data.result == '1'){
                            $.toast('输入的密码不正确');
                        }else if(ret.data.result == '2'){
                            $.toast('当前设备未能正确连接网络');
                        }else if(ret.data.result == '3'){
                            $.toast('当前设备已经被注册');
                        }else if(ret.data.result == '4'){
                            $.toast('当前设备型号不存在无法识别');
                        }else if(ret.data.result == '5'){
                            $.toast('当前设备注册的门店不正确');
                        }else if(ret.data.result == '6'){
                            $.toast('用户登录失效请重新登录');
                        }else{
                            $.toast('注册设备失败');
                        }
                    }
                });
            },
            success:function(){
                this.regSuccess = true;
                this.device.online = true;
                utils.showDevOptList(this,this.device,true,'设备注册成功');
            }
        }
    };
</script>
<style>

</style>