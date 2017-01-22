<template>
    <div class="page-group" :transition="transitionName">
        <div class="page page-current container" id="index">
            <header class="bar bar-nav">
                <h1 class='title'>设备注册</h1>
                <a class="right-menu" v-on:click="goDeviceList()">列表</a>
            </header>
            <div class="content">
                <div class="list-block item-step2">
                    <ul><li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-input">
                                    <input type="text" v-model="mac" placeholder="请输入12位的设备序列号" maxlength="12"/>
                                </div>
                                <label class="scaner" @click="scaner()">
                                    <span class="icon-scan－qrcode"></span>
                                </label>
                            </div>
                        </div>
                    </li></ul>
                    <p class="submit-panel"><a class="button button-fill  button-orange"  v-on:click="next()" v-bind:class="!doing && mac.length==12?'':'disabled'">下一步</a></p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    require('../../../common/assets/font.css');
    var Vue = require('vue');
    var utils = require('./../utils');
    var VueData;
    module.exports = {
        route:{
            data:function(transition){
                transition.next({
                    mac:Constant.devRegist.mac
                });
            },
            deactivate:function(transition){
                Constant.devRegist.mac = this.mac;
                this.transitionName = 'left';
                transition.next();
            }
        },
        data:function(){
            return {
                transitionName:'right',
                mac:'',
                doing:false
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            init: function () {
                VueData = this;
            },
            goDeviceList:function(){
                utils.goDeviceList();
            },
            scaner: function () {
                if ($.device.android) {
                    try {
                        window.webview && window.webview.getDeviceCode();
                    } catch (e) {
                        $.toast('即将支持扫一扫入网');
                    }
                } else if ($.device.ios) {
                    if (Constant.isWKWebView == 1) {
                        try {
                            window.webkit.messageHandlers.getDeviceCode.postMessage(1);
                        } catch (e) {
                            $.toast('即将支持扫一扫入网');
                        }
                    } else {
                        try {
                            getDeviceCode();
                        } catch (e) {
                            $.toast('即将支持扫一扫入网');
                        }
                    }
                }
            },
            next:function(){
                if(this.doing || this.mac.length < 12) return;
                var _this = this;
                this.doing = true;
                $.showPreloader('正在搜索设备...');
                this.$http.post('/service/searchDevice.action?token='+Constant.token,{
                    serialNo:this.mac
                }).then(function(ret){
                    $.hidePreloader();
                    setTimeout(function(){
                        _this.doing = false;
                    },2000);
                    if(ret.ok && ret.data){
                        if(ret.data.result == 'ok'){
                            _this.success(ret.data.data.data);
                        }else if(ret.data.result == 'DEVICE_OFFLINE'){
                            $.toast('当前设备不在线');
                        }else if(ret.data.result == 'INVALID_MAC'){
                            $.toast('无效的序列号');
                        }else if(ret.data.result == 'DEVICE_REGISTERED'){
                            $.toast('当前设备已经被注册');
                        }else if(ret.data.result == 'DEVICE_INITIALIZED'){
                            $.toast('当前设备正在初始化中');
                        }else{
                            $.toast('未找到设备');
                        }
                    }
                });
            },
            success:function(data){
                Constant.device = data;
                router.go('step3');
            },
            setMac: function (mac) {
                this.mac = mac;
            }
        }
    };


    window.setDeviceCode = function (url) {
        var suf = '#$%&';
        url = url || '';
        if (!url || url.indexOf(suf) == -1 || url.length != 16) {
            $.toast('未能正确识别该二维码');
        } else {
            var code = url.replace(suf, '');
            VueData.setMac(code);
        }
    };
</script>
<style>
    .item-input {
        float: left;
    }

    .list-block .item-inner {
        padding-right: 0px;
    }

    .scaner {
        float: left;
        width: 60px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        padding-top: 2px;
    }

    .scaner .icon-expand {
        font-size: 22px;
    }
</style>