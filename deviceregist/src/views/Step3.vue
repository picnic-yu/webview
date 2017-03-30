<template>
    <div class="page-group" :transition="transitionName">
        <div class="page page-current container" id="index">
            <header class="bar bar-nav">
                <h1 class='title' v-i18n="{value:'devregister'}"></h1>
                <a class="right-menu" v-on:click="goDeviceList()" v-i18n="{value:'list'}"></a>
            </header>
            <div class="content">
                <div class="list-block item-step2">
                    <ul>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label" v-i18n="{value:'devname'}"></div>
                                    <div class="item-input"><input  type="text"  v-model="device.name" readonly/></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label" v-i18n="{value:'serino'}"></div>
                                    <div class="item-input"><input v-model="device.mac" type="text" readonly/></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label" v-i18n="{value:'devtype'}"></div>
                                    <div class="item-input"><input v-model="device.deviceType" type="text" readonly/></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label" v-i18n="{value:'devpassword'}"></div>
                                    <div class="item-input"><input v-model="device.pwd" type="text"  maxlength="32" v-i18n.placeholder="{value:'initpassword',replace:[{{device.dType==2?'admin123':'admin'}}]}"/></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <p class="submit-panel" v-show="!regSuccess"><a class="button button-fill  button-orange"  v-on:click="next()" v-bind:class="!doing && device.pwd?'':'disabled'" v-i18n="{value:'doregister'}"></a></p>
                    <p class="submit-panel" v-show="regSuccess"><a class="button button-fill  button-success" v-i18n="{value:'registersuccess'}"></a></p>
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
                $.showPreloader(this.$translate('isregistering'));
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
                            $.toast(this.$translate('cannotseedev'));
                        }else if(ret.data.result == '1'){
                            $.toast(this.$translate('passwordiserror'));
                        }else if(ret.data.result == '2'){
                            $.toast(this.$translate('devisnotinnet'));
                        }else if(ret.data.result == '3'){
                            $.toast(this.$translate('devhasregistered'));
                        }else if(ret.data.result == '4'){
                            $.toast(this.$translate('devnonotsee'));
                        }else if(ret.data.result == '5'){
                            $.toast(this.$translate('devregshopiserror'));
                        }else if(ret.data.result == '6'){
                            $.toast(this.$translate('loginerror'));
                        }else{
                            $.toast(this.$translate('devregisterror'));
                        }
                    }
                });
            },
            success:function(){
                this.regSuccess = true;
                this.device.online = true;
                utils.showDevOptList(this,this.device,true,this.$translate('registersuccess'));
            }
        }
    };
</script>
<style>

</style>