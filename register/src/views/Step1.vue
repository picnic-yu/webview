<template>
    <div class="page-group" :transition="transitionName">
        <div class="page page-current" style="overflow:auto;" id="step1">
            <header v-show="!isApp" class="bar bar-nav" style="height:auto;">
                <img class="logo" src="../../../common/assets/imgs/logo_220.png">
                <!--<a v-show="!device" class="login-button pull-right" href="http://www.wandianzhang.com">登录</a>
                <a v-show="device" class="login-button pull-right" v-on:click="openApp()">登录</a>-->
            </header>
            <div v-bind:class="isApp==1?'register-wrap1':'register-wrap'">
                <div class="register-container">
                    <div class="register-title">
                        <span>{{tag}}</span>
                    </div>
                    <div class="register-tab">
                        <a v-on:click="selectTab(1)"><span class="regnew" v-bind:class="currentTab==1?'select-tab':''" v-i18n="{value:'registernewgroup'}"></span></a>
                        <a v-on:click="selectTab(2)"><span class="enterhas" v-bind:class="currentTab==2?'select-tab':''" v-i18n="{value:'addhasgroup'}"></span></a>
                    </div>
                    <div class="enterprise-bg" v-show="currentTab==1">
                        <div class="inputwrap">
                            <table  class="label-table"><tr>
                                <td><input type="text" v-i18n.placeholder="{value:'username'}" v-model="userName" v-on:blur="checkUser()"></td>
                                <td class="read-label">*</td>
                            </tr></table>
                        </div>
                        <!--<div class="user-wrap">
                            <div class="inputwrap authcode">
                                <table class="label-table"><tr><td>
                                    <input type="text" placeholder="用户名" v-model="userName">
                                </td>
                                    <td class="read-label">*</td></tr></table>
                            </div><a class="getauthcode" v-on:click="checkUser()">检查用户名</a>
                        </div>-->
                        <div class="usertip-span" v-show="errorshowName">
                            <span v-bind:class="errorInfoNameCan?'greenName':'redName'">{{errorInfoName}}</span>
                        </div>
                        <div class="inputwrap">
                            <table class="label-table"><tr>
                                <td><input type="password" v-i18n.placeholder="{value:'password'}" v-model="pwd"></td>
                                <td class="read-label">*</td>
                            </tr></table>
                        </div>
                        <div class="inputwrap">
                            <table class="label-table"><tr>
                                <td><input type="text" v-i18n.placeholder="{value:'showname'}" v-model="showName"></td>
                                <td class="read-label">*</td>
                            </tr></table>
                        </div>
                        <div class="inputwrap">
                            <input type="text" v-i18n.placeholder="{value:'email'}" v-model="email">
                        </div>
                        <div class="inputwrap">
                            <table class="label-table"><tr>
                                <td><input type="text" maxlength="11" v-i18n.placeholder="{value:'mobilephone'}" v-model="phone"></td>
                                <td class="read-label">*</td>
                            </tr></table>
                        </div>
                        <div class="user-wrap">
                            <div class="inputwrap authcode">
                                <table  class="label-table"><tr>
                                    <td><input type="text" v-i18n.placeholder="{value:'validatecode'}" v-model="authorcode"></td>
                                    <td class="read-label">*</td>
                                </tr></table>
                            </div>
                            <a v-show="!showwait" class="getauthcode" v-on:click="getAuthCode()" v-i18n="{value:'getvalidatecode'}"></a>
                            <a v-show="showwait" class="getwait"><span v-i18n="{value:'wait'}"></span>{{second}}<span v-i18n="{value:'second'}"></span></a>
                        </div>
                        <div class="inputwrap">
                            <table  class="label-table"><tr>
                                <td><input type="text" v-i18n.placeholder="{value:'groupname'}" v-model="enterpriseName"></td>
                                <td class="read-label">*</td>
                            </tr></table>
                        </div>
                        <div class="tip-span" v-show="errorshow1"><span>{{errorInfo1}}</span></div>
                        <span><input class="create-btn" type="button" v-i18n.value="{value:'createenterprise'}" v-on:click="createEnterprise()"></span>
                    </div>
                    <div class="person-bg" v-show="currentTab==2">
                        <div class="inputwrap">
                            <input type="text" v-i18n.placeholder="{value:'invationcode'}" v-model="activeCode">
                        </div>
                        <div class="tip-span" v-show="errorshow2"><span>{{errorInfo2}}</span></div>
                        <div class="inputwrap">
                            <input class="create-btn" type="button" v-on:click="next()" v-i18n.value="{value:'next'}">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="weixin-tip"></div>
    </div>
</template>
<script>
    module.exports = {
        route:{
            data:function(transition){
                this.getCurrentDevice();
            },
            deactivate: function (transition) {
                this.transitionName = 'left';
                transition.next();
            }
        },
        data:function(){
            return {
                transitionName: 'show',
                tag:this.$translate("crateenterpriseaccount"),
                currentTab:Constant.currentTab,
                errorshow1:false,
                errorshow2:false,
                errorInfo1:'',
                errorInfo2:'',
                showwait:false,
                second:60,
                setInercalID:null,
                device:false,
                registerFlag:false,
                isApp:false,
                errorshowName:false,
                errorInfoName:'',
                errorInfoNameCan:false
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            init:function(){

            },
            selectTab:function(tab){
                this.currentTab = tab;
            },
            createEnterprise:function(){
                if(this.registerFlag) return;
                if(!this.userName){
                    this.errorshow1 = true;
                    this.errorInfo1 = this.$translate("inputusername");
                    return;
                }
                if(!this.pwd){
                    this.errorshow1 = true;
                    this.errorInfo1 = this.$translate("inputpassword");
                    return;
                }
                var myPwdReg = /^[a-zA-Z0-9]{6,128}$/;
                if(this.pwd=="888888"){
                    this.errorshow1 = true;
                    this.errorInfo1 = this.$translate("passwordcannotsoeasy");
                    return;
                }
                if(!myPwdReg.test(this.pwd)){
                    if(this.pwd.length < 6){
                        this.errorshow1 = true;
                        this.errorInfo1 = this.$translate("passwordatleastsix");
                        return;
                    }else{
                        this.errorshow1 = true;
                        this.errorInfo1 = this.$translate("passordneednumandabc");
                        return;
                    }
                }
                if(!this.showName){
                    this.errorshow1 = true;
                    this.errorInfo1 = this.$translate("inputshowname");
                    return;
                }
                if(!this.phone){
                    this.errorshow1 = true;
                    this.errorInfo1 = this.$translate("inputmobilephone");
                    return;
                }
                var phoneReg=/^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
                if(!phoneReg.test(this.phone)){
                    this.errorshow1 = true;
                    this.errorInfo1 = this.$translate("mobilephonenotvalid");
                    return;
                }
                if(!this.authorcode){
                    this.errorshow1 = true;
                    this.errorInfo1 = this.$translate("inputvalidatecode");
                    return;
                }
                if(!this.enterpriseName){
                    this.errorshow1 = true;
                    this.errorInfo1 = this.$translate("inputenterprisename");
                    return;
                }
                var password = md5.hex_md5(this.pwd);
                this.registerFlag = true;
                this.errorshow1 = true;
                this.errorInfo1 = this.$translate("creatingwait");
                this.$http.post('/service/registerJoin.action',{
                    'registerVo.enterpriseId':null,
                    'registerVo.enterpriseName':this.enterpriseName,
                    'registerVo.userName':this.userName,
                    'registerVo.showName':this.showName,
                    'registerVo.password':password,
                    'registerVo.phone':this.phone,
                    'registerVo.email':this.email,
                    'registerVo.activateCode':this.authorcode
                }).then(function(ret){
                    this.registerFlag = false;
                    if(ret.data){
                        if(ret.data.result=="INVALID_PARAMETER"){
                            this.errorshow1 = true;
                            this.errorInfo1 = this.$translate("infoperfect");
                            return;
                        }else if(ret.data.result=="USERNAME_REGISTERED"){
                            this.errorshow1 = true;
                            this.errorInfo1 = this.$translate("usernamehasexisted");
                            return;
                        }else if(ret.data.result=="PHONE_REGISTERED"){
                            this.errorshow1 = true;
                            this.errorInfo1 = this.$translate("mobilephonehasexisted");
                            return;
                        }else if(ret.data.result=="DUPLICATE"){
                            this.errorshow1 = true;
                            this.errorInfo1 = this.$translate("enterprisenamehasexisted");
                            return;
                        }else if(ret.data.result=="CODE_ERROR"){
                            this.errorshow1 = true;
                            this.errorInfo1 = this.$translate("validatecodeerror");
                            return;
                        }else if(ret.data.result=="ok"){
                            /*this.errorshow1 = true;
                             this.errorInfo1 = "恭喜您,注册成功!";
                             //如果是从app里面点进来的注册，则调用app的方法跳转到登录界面
                             if(this.isApp){
                             this.webviewReady();
                             }
                             this.resetData();
                             return;*/
                            this.errorshow1 = false;
                            this.resetData();
                            Constant.enterId = ret.data.data.data;
                            router.go('/next');
                        }else{
                            this.errorshow1 = true;
                            this.errorInfo1 = this.$translate("registerfailed");
                            return;
                        }
                    }else{
                        this.errorshow1 = true;
                        this.errorInfo1 = this.$translate("serverexception");
                        return;
                    }
                });
            },
            resetData:function(){
                this.userName = "";
                this.showName = "";
                this.pwd = "";
                this.phone = "";
                this.email = "";
                this.enterpriseName = "";
                this.authorcode = "";
                this.errorshowName = false;
            },
            //检查用户名
            checkUser:function(){
                if(!this.userName){
                    this.errorshowName = true;
                    this.errorInfoNameCan = false;
                    this.errorInfoName = this.$translate("inputusername");
                    return;
                }
                this.$http.post('/checkUsername.action',{
                    username:this.userName
                }).then(function(ret){
                    this.errorshowName = true;
                    if(ret && ret.data && ret.data.result=="ok"){
                        this.errorInfoNameCan = true;
                        this.errorInfoName = this.$translate("can");
                    }else if(ret && ret.data && ret.data.result=="DUPLICATE"){
                        this.errorInfoNameCan = false;
                        this.errorInfoName = this.$translate("cannot");
                    }else{
                        this.errorInfoNameCan = false;
                        this.errorInfoName = "";
                    }
                });
            },
            //获取验证码
            getAuthCode:function(){
                if(!this.phone){
                    this.errorshow1 = true;
                    this.errorInfo1 = this.$translate("inputmobilephone");
                    return;
                }
                var phoneReg=/^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
                if(!phoneReg.test(this.phone)){
                    this.errorshow1 = true;
                    this.errorInfo1 = this.$translate("mobilephonenotvalid");
                    return;
                }
                this.showwait = true;
                this.secondWait();
                this.$http.post('/service/sendValidateCode.action',{
                    phone : this.phone,
                    isRegister:1
                }).then(function(ret){
                    var result = ret.data.result;
                    this.errorshow1 = true;
                    if (result == "ok") {
                        this.errorInfo1 = this.$translate("validatecodesendsuccess");
                    }else if(result == "PHONE_REGISTERED"){
                        this.errorInfo1 = this.$translate("mobilephonehasregisted");
                    }else{
                        this.errorInfo1 = this.$translate("validatecodesendfailed");
                    }
                });
            },
            secondWait:function(){
                var _this = this;
                _this.setInercalID = setTimeout(function(){
                    if(_this.second>0){
                        _this.second = _this.second-1;
                        _this.secondWait();
                    }else{
                        _this.showwait = false;
                        clearTimeout(_this.setInercalID);
                        _this.second=60;
                    }
                },1000);
            },
            next:function(){
                if(!this.activeCode){
                    this.errorshow2 = true;
                    this.errorInfo2 = this.$translate("inputinvationcode");
                    return;
                }
                this.$http.post('/service/getCodeInfo.action',{
                    invitationCode : this.activeCode
                }).then(function(ret){
                    var result = ret.data.result;
                    if (result == "ok") {
                        Constant.activationCode = this.activeCode;
                        router.go('/join');
                    }else{
                        this.errorshow2 = true;
                        this.errorInfo2 = this.$translate("invationcodeerror");
                        return;
                    }
                });

            },
            openApp:function(){
                if(this.isWeixin()){
                    $.toast(this.$translate("netspaceopen"));
                }else{
                    var u = window.navigator.userAgent.toLowerCase();
                    if (u.indexOf('iphone') > -1 || u.indexOf('itouch') > -1 || u.indexOf('ipad') > -1) {
                        window.location.href="iOSWDZForAppStore://";
                        setTimeout(function(){
                            window.location.href = "https://itunes.apple.com/us/app/wan-dian-zhang/id1116662738?mt=8";
                        },3000);
                    }else if(u.indexOf('android') > -1){
                        window.location.href="jaq://com.kedacom.ovopark";
                        setTimeout(function(){
                            window.location.href = "https://fir.im/store";
                        },3000);
                    }
                }
            },
            getCurrentDevice:function(){
                var u = window.navigator.userAgent.toLowerCase();
                if (u.indexOf('iphone') > -1 || u.indexOf('itouch') > -1 || u.indexOf('ipad') > -1) {
                    this.device=true;
                } else if (u.indexOf('android') > -1) {
                    this.device=true;
                } else {
                    this.device=false;
                }
                if(Constant.app == 1){
                    this.isApp = true;
                }else{
                    this.isApp = false;
                }
            },
            isWeixin:function() {
                var u = window.navigator.userAgent.toLowerCase();
                if (u.match(/MicroMessenger/i) == 'micromessenger') {
                    return true;
                } else {
                    return false;
                }
            },
            webviewReady: function () {
                if ($.device.android) {
                    try {
                        window.webview && window.webview.goto_login(this.userName);
                    } catch (e) {
                    }
                } else if ($.device.ios) {
                    if (Constant.isWKWebView == 1) {
                        try {
                            window.webkit.messageHandlers.goto_login.postMessage(this.userName);
                        } catch (e) {
                        }
                    } else {
                        try {
                            goto_login(this.userName);
                        } catch (e) {
                        }
                    }
                } else {

                }
            }
        }
    };
</script>
<style>
    .logo{
        width:112px;
        height:58px;
        display:inline-block;
        vertical-align: middle;
        float:left;
        margin-left:5.3%;
        margin-top:17px;
        margin-bottom:13px;
    }
    .login-button{
        border:1px solid #f90;
        background: #fff;
        margin-right:5.3%;
        color:#f90;
        height:34px;
        line-height:34px;
        width:78px;
        vertical-align: middle;
        margin-top: 1rem;
        font-size:14px;
        font-family: "Microsoft Yahei";
        text-align:center;
    }
    .login-button:hover{
        background: #f90;
        color:#fff;
    }
    .register-wrap1{
        margin:10px auto 10px auto;
        padding:0px 15px 20px;
        min-width:290px;
        max-width:440px;
    }

    .register-wrap{
        margin:0 auto;
        padding:95px 15px 20px;
        min-width:290px;
        max-width:440px;
    }
    .register-container{

    }
    .register-title{
        margin:0 0 20px;
        text-align: center;
        font-size:30px;
        font-family:"Microsoft Yahei";
    }
    .register-tab{
        margin: 0 0 12px;
        border-width:1px 1px 1px 1px;
        border-style: solid;
        border-color:#d9d9d9;
        height:48px;
        display:block;
    }
    .register-tab a{
        color:#333;
        padding:0;
        margin:-1px 0 0;
        width:50%;
        text-align:center;
        font-size:14px;
        float:left;
        font-family: "Microsoft Yahei";
        cursor:pointer;
    }
    .regnew{
        border-right:none;
        height:48px;
        line-height:48px;
        display:block;
    }
    .enterhas{
        border-left:1px solid #cacbcc;
        display:block;
        height:48px;
        line-height:48px;
    }
    .select-tab{
        color:#f90;
        border-bottom:1px solid #efeff4;
    }
    .inputwrap{
        background-color:#fff;
        margin:0 0 12px;
        height:48px;
        border:1px solid #d9d9d9;
    }
    .inputwrap input{
        padding:0px 15px 0px 15px;
        border:none;
        width:100%;
        height: 100%;
        font-size:16px;
        line-height:28px;
        font-family: "Microsoft Yahei";
    }
    .authcode{
        float:left;
        width:65%;
    }
    .getauthcode{
        display:inline-block;
        width:30%;
        float:right;
        height:46px;
        line-height: 46px;
        text-align: center;
        border:1px solid #f90;
        background: #fff;
        color:#f90;
        cursor: pointer;
        font-size:14px;
        font-family: "Microsoft Yahei";
    }

    .getwait{
        display:inline-block;
        width:30%;
        float:right;
        height:46px;
        line-height: 46px;
        text-align: center;
        border:1px solid #c1c1c1;
        background: #fff;
        color:#c1c1c1;
        cursor: pointer;
        font-size:14px;
        font-family: "Microsoft Yahei";
    }

    .getauthcode:hover{
        color:#fff;
        background: #f90;
    }
    .create-btn{
        width:100%;
        background:#f90;
        color:#fff;
        border:1px solid #d9d9d9;
        height:46px;
        line-height: 46px;
        font-size:18px;
        font-family: "Microsoft Yahei";
    }
    .create-btn:hover{
        background: #fa1;
    }
    .tip-span{
        color:red;
        font-size:14px;
        width:100%;
        display:inline-block;
        text-align: center;
    }
    .user-wrap{
        height:48px;
        margin:0 0 12px 0;
    }
    .read-label{
        padding-top: 5px;
        color:red;
    }
    .label-table{
        width: 100%;
        height: 100%;
    }
    .usertip-span{
        color:red;
        font-size:14px;
        width:100%;
        text-align: right;
        margin-top:-10px;
    }
    .greenName{
        color:#8acc47;
        display:inline-block;
    }
    .redName{
        color:red;
        display:inline-block;
    }
</style>


// WEBPACK FOOTER //
// Step1.vue?1ff6e95f