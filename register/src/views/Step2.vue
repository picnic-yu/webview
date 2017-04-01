<template>
    <div class="page-group" :transition="transitionName">
        <div class="page page-current" style="overflow:auto;" id="step2">
            <header v-show="!isApp" class="bar bar-nav" style="height:auto;">
                <img class="logo" src="../../../common/assets/imgs/logo_220.png">
                <!--<a v-show="!device" class="login-button pull-right" href="http://www.wandianzhang.com">登录</a>
                <a v-show="device" class="login-button pull-right" v-on:click="openApp()">登录</a>-->
            </header>
            <div v-bind:class="isApp==1?'register-wrap21':'register-wrap'">
                <div class="register-container">
                    <div class="enterprise-bg">
                        <div class="inputwrap" style="background-color:#fafafa;">
                            <table  class="label-table"><tr>
                                <td><span style="padding:0 15px;font-size:16px;"><span v-i18n="{value:'enterprisename'}"></span>{{tag}}</span></td>
                            </tr></table>
                        </div>
                        <div class="inputwrap" style="background-color:#fafafa;">
                            <table  class="label-table"><tr>
                                <td><span style="padding:0 15px;font-size:16px;"><span v-i18n="{value:'invitationuser'}"></span>{{fromUser.showName}}</span></td>
                            </tr></table>
                        </div>
                        <div class="inputwrap">
                            <table  class="label-table"><tr>
                                <td><input type="text" v-i18n.placeholder="{value:'username'}" v-model="userName" v-on:blur="checkUser()"></td>
                                <td class="read-label">*</td>
                            </tr></table>
                        </div>
                        <!--<div class="user-wrap">
                            <div class="inputwrap authcode">
                                <table  class="label-table"><tr>
                                    <td><input type="text" placeholder="用户名" v-model="userName"></td>
                                    <td class="read-label">*</td></tr></table>
                            </div>
                            <a class="getauthcode" v-on:click="checkUser()">检查用户名</a>
                        </div>-->
                        <div class="usertip-span" v-show="errorshowName">
                            <span v-bind:class="errorInfoNameCan?'greenName':'redName'">{{errorInfoName}}</span>
                        </div>
                        <div class="inputwrap">
                            <table  class="label-table"><tr>
                                <td><input type="password" v-i18n.placeholder="{value:'password'}" v-model="pwd"></td>
                                <td class="read-label">*</td>
                            </tr></table>
                        </div>
                        <div class="inputwrap">
                            <table  class="label-table"><tr>
                                <td><input type="text" v-i18n.placeholder="{value:'showname'}" v-model="showName"></td>
                                <td class="read-label">*</td>
                            </tr></table>
                        </div>
                        <div class="inputwrap">
                            <input type="text" v-i18n.placeholder="{value:'email'}" v-model="email">
                        </div>
                        <div class="inputwrap">
                            <table  class="label-table"><tr>
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
                            <a v-show="showwait" class="getwait"><span v-i18n="{value:'wait'}"></span>{{second}}<span v-i18n="{value:'second'}"></span></span></a>
                        </div>
                        <div class="tip-span" v-show="errorshow1"><span>{{errorInfo1}}</span></div>
                        <div><input class="create-btn" type="button" v-i18n.value="{value:'joingroup'}" v-on:click="createEnterprise()"></div>
                        <div v-show="signID" style="margin-top:10px;"><input class="create-btn" type="button" v-i18n.value="{value:'createnewgroup'}" v-on:click="reCreateNewEnterprise()"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    module.exports = {
        route:{
            data:function(transition){
                this.getCurrentDevice();
                if(Constant.signUserId){
                    this.getSignUserInfo(Constant.signUserId);
                }else{
                    this.getEnterprise(Constant.activationCode);
                }
            }
        },
        data:function(){
            return {
                transitionName: 'right',
                signID:null,
                tag:'',
                userName:'',
                showName:'',
                pwd:'',
                phone:'',
                email:'',
                errorshow1:false,
                errorInfo1:'',
                showwait:false,
                second:60,
                setInercalID:null,
                device:false,
                enterpriseId:null,
                registerFlag:false,
                isApp:false,
                errorshowName:false,
                errorInfoName:'',
                errorInfoNameCan:false,
                userinfo:null,
                fromUser:{}
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            init:function(){

            },
            getEnterprise:function(code){
                if(!code){
                    //如果code为空则退到前一个加入企业页面
                    Constant.currentTab = 2;
                    router.go('/');
                }
                //从后台获取公司信息,如果code过期或不存在则退到前一个加入企业页面
                this.$http.post('/service/getCodeInfo.action',{
                    invitationCode : code
                }).then(function(ret){
                    var result = ret.data.result;
                    if (result == "ok") {
                        var group = ret.data.data.group;
                        if(group){
                            this.tag = group.name;
                            this.enterpriseId = group.id;
                            this.fromUser = ret.data.data.fromUser;
                        }
                    }else{
                        this.tag = "";
                        Constant.currentTab = 2;
                        router.go('/');
                    }
                });
            },
            getSignUserInfo:function(id){
                if(!id){
                    this.tag = "";
                    Constant.currentTab = 1;
                    router.go('/');
                }
                this.signID = id;
                this.$http.post('/service/getRegisterVoBySignUsersId.action',{
                    signUsersId : id
                }).then(function(ret){
                    var result = ret.data.result;
                    if (result == "ok") {
                        var signUser = ret.data.data.data;
                        this.tag = signUser.enterpriseName;
                        this.enterpriseId = signUser.enterpriseId;
                        this.userName = signUser.userName;
                        this.showName = signUser.showName;
                        this.pwd = "";
                        this.phone = signUser.phone;
                        this.email = signUser.email;
                        this.fromUser = {
                            id:signUser.fromUserId,
                            showName:signUser.fromUserName
                        }
                        this.errorshow1 = true;
                        if(signUser.reason){
                            this.errorInfo1 = this.$translate("beacuse")+signUser.reason+this.$translate("passfailed");
                        }else{
                            this.errorInfo1 = this.$translate("beacusesome");
                        }
                    }else{
                        this.tag = "";
                        Constant.currentTab = 1;
                        router.go('/');
                    }
                });
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
                if(!this.enterpriseId){
                    this.errorshow1 = true;
                    this.errorInfo1 = this.$translate("enterprisecannotnull");
                    return;
                }
                var password = md5.hex_md5(this.pwd);
                this.registerFlag = true;
                this.errorshow1 = true;
                this.errorInfo1 = this.$translate("joingroupingwait");
                this.$http.post('/service/registerJoin.action',{
                    'registerVo.id':this.signID,
                    'registerVo.enterpriseId':this.enterpriseId,
                    'registerVo.enterpriseName':this.tag,
                    'registerVo.userName':this.userName,
                    'registerVo.showName':this.showName,
                    'registerVo.password':password,
                    'registerVo.phone':this.phone,
                    'registerVo.email':this.email,
                    'registerVo.activateCode':this.authorcode,
                    'registerVo.fromUserId':this.fromUser.id
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
                            if(this.isApp){
                                this.errorshow1 = true;
                                this.errorInfo1 = this.$translate("congratulations");
                                //如果是从app里面点进来的注册，则调用app的方法跳转到登录界面
                                this.webviewReady();
                                this.resetData();
                            }else{
                                this.errorshow1 = false;
                                this.resetData();
                                var strFullpath = window.location.href;
                                var strPath = window.location.pathname;
                                var pos = strFullpath.indexOf(strPath);
                                var prePath = strFullpath.substring(0,pos);
                                var preIndex = prePath.lastIndexOf(":8");//如果含有8开头的端口则改成8080端口
                                var rootPath = prePath;
                                if(preIndex>0){
                                    rootPath = prePath.substring(0,preIndex);
                                    rootPath = rootPath + ":8080";
                                }
                                if(Constant.language=='en'){
                                    window.location.href = rootPath + "/loginsuccess_en.html";
                                }else{
                                    window.location.href = rootPath + "/loginsuccess.html";
                                }
                                //window.location.href = rootPath + "/loginsuccess.html";
                                //window.location.href="http://www.ovopark.com/loginsuccess.html";
                            }
                            //如果是从app里面点进来的注册，则调用app的方法跳转到登录界面
                            /*if(this.isApp){
                             this.webviewReady();
                             }
                             this.resetData();
                             return;*/
                        }else{
                            this.errorshow1 = true;
                            this.errorInfo1 = this.$translate("joingroupfailed");
                            return;
                        }
                    }else{
                        this.errorshow1 = true;
                        this.errorInfo1 = this.$translate("serverexception");
                        return;
                    }
                });

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
                    id:this.signID,
                    username:this.userName
                }).then(function(ret){
                    this.errorshowName = true;
                    this.errorInfoName = ret.data;
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
            getCurrentDevice:function(){
                var u = window.navigator.userAgent.toLowerCase();
                if (u.indexOf('iphone') > -1 || u.indexOf('itouch') > -1 || u.indexOf('ipad') > -1) {
                    this.device = true;
                } else if (u.indexOf('android') > -1) {
                    this.device = true;
                } else {
                    this.device = false;
                }
                if (Constant.app == 1) {
                    this.isApp = true;
                } else {
                    this.isApp = false;
                }
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
            resetData:function(){
                this.userName = "";
                this.showName = "";
                this.pwd = "";
                this.phone = "";
                this.email = "";
                this.authorcode = "";
                this.errorshowName = false;
            },
            //创建企业
            reCreateNewEnterprise:function(){
                this.tag = "";
                Constant.currentTab = 1;
                Constant.signUserId = null;
                if(Constant.app == 1){
                    window.location = "index.html?app=1";
                }else{
                    window.location = "index.html";
                }
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
        margin-left:2%;
        margin-top:.1rem;
        margin-bottom:.2rem;
    }
    .login-button{
        border:1px solid #f90;
        background: #fff;
        right:4%;
        color:#f90;
        height:34px;
        line-height:34px;
        width:78px;
        vertical-align: middle;
        margin-top: .6rem;
        font-size:14px;
        font-family: "Microsoft Yahei";
        text-align:center;
    }
    .login-button:hover{
        background: #f90;
        color:#fff;
    }
    .register-wrap21{
        margin:10px auto 10px auto;
        padding:30px 15px 20px;
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


/** WEBPACK FOOTER **
** Step2.vue?49f42db6
**/


// WEBPACK FOOTER //
// Step2.vue?5b6a8224