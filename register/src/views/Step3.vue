<template>
    <div class="page-group" :transition="transitionName">
        <div class="page page-current" style="overflow:auto;background:#fcfcfc;" id="step3">
            <div class="register-wrap">
                <div class="register-container">
                    <table width="100%"><tr align="center"><td><img class="nextlogo" src="../../../common/assets/imgs/logo_220.png"></img></td></tr>
                        <tr align="center" class="tip-1 tip-2" style="color:#333;" v-show="curEnterFlag==1"><td v-i18n="{value:'uploadcertificate'}">
                        </td></tr>
                        <tr valign="bottom" v-show="curEnterFlag==2" class="tip-1 tip-3"><td>
                            <span style="padding-left:20px;" v-i18n="{value:'passingwait'}"></span>
                        </td></tr>
                        <tr valign="top" class="tip-1 tip-3"  v-show="curEnterFlag==2"><td>
                            <span style="padding-left:20px;" v-i18n="{value:'call400'}"></span>
                        </td></tr>
                        <tr v-show="curEnterFlag==3" valign="bottom" class="tip-1 tip-3" style="color:red;"><td>
                            <span style="padding-left:20px;" v-i18n="{value:'reuploadcertificate'}"></span>
                        </td></tr>
                        <tr valign="top" class="tip-1 tip-3" v-show="curEnterFlag==3" style="color:red;"><td>
                            <span style="padding-left:20px;" v-i18n="{value:'call4001'}"></span>
                        </td></tr>
                    </table>
                    <div class="enterprise-bg">
                        <table>
                            <tr><td><span style="font-size:16px;" v-i18n="{value:'certificate'}"></span></td></tr>
                            <tr><td><div class="fp-left" v-for="picpath in showPicPaths" track-by="$index">
                                <a class="pb-standalone" index="{{$index}}">
                                    <img width="60" height="60" v-bind:src="picpath.picUrl" class="p-img p-img-{{$index}}"/>
                                </a>
                                <span class="delete-img icon-cross" v-on:click="deleteCerImg($index)">x</span>
                            </div><div class="fp-left" v-for="tempPath in tempPicPaths" track-by="$index">
                                <a class="pb-standalone" index="{{showPicPaths.length+$index}}">
                                    <img width="60" height="60" v-bind:src="tempPath" class="p-img p-img-{{$index}}"/>
                                </a>
                                <span class="delete-img icon-cross" v-on:click="deleteItemImg($index)">x</span>
                            </div></td></tr>
                            <tr><td><div class="fp-add" style="width:100%;height:50px;" @click="beforeUpload($event)">
                                <table width="100%"><tr valign="top"><td width="90%"><span class="add-filedesc">&nbsp;<label v-i18n="{value:'support'}"></label>*.png;*.jpg;*.jpeg;</span></td>
                                <td><img width="48" height="48" src="../../../common/assets/imgs/cam.png"/>
                                </td>
                                </tr></table>
                                <input class="add-file0" type="file" name="upload0" multiple accept="image/*"/>
                                </div>
                            </td></tr>
                            <tr><td><span class="tip-span">{{waitInfo}}</span></td></tr>
                            <tr><td><div class="upload-pic" v-on:click="uploadCer()" v-i18n="{value:'upload'}"></div></td></tr>
                        </table>
                    </div>
                </div>
                <div class="tip-login" v-on:click="openApp()" v-i18n="{value:'changeotheraccount'}"></div>
            </div>
        </div>)
    </div>
</template>
<script>
    require('../../../common/assets/css/sm-extend.min.css');
    require('../../../common/libs/sm-extend.js');
    var maxImgNum = 5;//最多可以上传的图片数目
    var myPhotoBrowserStandalone;
    var isPhotoOpen = false;
    module.exports = {
        route:{
            data:function(transition){
                this.getCurrentDevice();
                if(Constant.enterId){
                    this.getEnterprise(Constant.enterId);
                }else{
                    Constant.currentTab = 1;
                    router.go('/');
                }
            },
            deactivate: function (transition) {
                if (myPhotoBrowserStandalone) {
                    myPhotoBrowserStandalone.close();
                    isPhotoOpen = false;
                }
                this.transitionName = 'right';
                transition.next();
            }
        },
        data:function(){
            return {
                transitionName: 'right',
                device:false,
                enterpriseId:null,
                registerFlag:false,
                isApp:false,
                curEnterFlag:1,
                showPicPaths:[],
                tempPicPaths:[],
                uploadFlag:false,
                waitInfo:''
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            init:function(){
            },
            getEnterprise:function(id){
                if(!id){
                    //如果code为空则退到前一个加入企业页面
                    Constant.currentTab = 1;
                    router.go('/');
                }
                //从后台获取公司信息,如果code过期或不存在则退到前一个加入企业页面
                this.$http.post('/service/getEnterpriseAndCertificates.action',{
                    enterpriseId : id
                }).then(function(ret){
                    var result = ret.data.result;
                    if (result == "ok"){
                        var group = ret.data.data.data;
                        if(group){
                            if(!group.certificates||group.certificates.length==0){
                                this.curEnterFlag = 1;
                                this.showPicPaths = [];
                            }else if(group.certificates&&group.certificates.length>0&&group.isPass==0){
                                this.curEnterFlag = 2;
                                this.showPicPaths = group.certificates;
                            }else if(group.certificates&&group.certificates.length>0&&group.isPass==2){
                                this.curEnterFlag = 3;
                                this.showPicPaths = group.certificates;
                            }else{
                                 Constant.currentTab = 1;
                                 router.go('/');
                            }
                            this.enterpriseId = id;
                        }
                    }else{
                        Constant.currentTab = 1;
                        router.go('/');
                    }
                    this.enterpriseId = id;
                    setTimeout(this.bindItemEvent, 1000);
                });
            },
            bindItemEvent: function () {
                var _this = this;
                $(document).off('change', '.add-file0').on('change', '.add-file0', function () {
                    var $addImg = $(this).prev();
                    var _file = this;
                    var successNum = 0, fileNum = this.files.length;
                    var hasToMorePic = false;
                    for (var i = 0; i < fileNum; i++) {
                        var file = this.files[i];
                        if (file.size > 1024 * 1024 * 5) {
                            $.toast(_this.$translate("picnotbigthan5m"));
                            break;
                        }
                        (function (i) {
                            new html5ImgCompress(_file.files[i], {
                                maxWidth: 1600,
                                maxHeight: 1600,
                                before: function (file) {
                                    //console.log('多张: ' + i + ' 压缩前...');
                                },
                                done: function (file, base64) { // 这里是异步回调，done中i的顺序不能保证
                                    //console.log('多张: ' + i + ' 压缩成功...'+file.length+","+base64.length);
                                    successNum++;
                                    if (!_this.tempPicPaths) _this.tempPicPaths = [];
                                    _this.tempPicPaths.push(base64);
                                    if (successNum == fileNum) {
                                        $(_file).remove();
                                        //上传成功之后重置input
                                        $($addImg).parent().append('<input class="add-file0" name="upload0" type="file" multiple accept="image/*"/>');
                                    }
                                    //检测是否上传了太多的图片
                                    setTimeout(function () {
                                        if (!hasToMorePic) {
                                            if ($('.fp-left').length > maxImgNum) {
                                                hasToMorePic = true;
                                                $.toast(_this.$translate("uploadcannotmorethan") + maxImgNum + _this.$translate("zhang"));
                                            }
                                        }
                                    }, 500);
                                },
                                fail: function () {
                                    console.log(_this.$translate("duozhang") + i + _this.$translate("compressfailed"));
                                },
                                complate: function () {
                                    console.log(_this.$translate("duozhang") + i + _this.$translate("compresscomplete"));
                                },
                                notSupport: function (file) {
                                    notSupport = true;
                                    alert(_this.$translate("browsernotsupport"));
                                }
                            });
                        })(i);
                    }
                });
                //点击时打开图片浏览器
                var photos = [];
                var _this = this;
                var myPhotoBrowserStandalone;
                $(document).off('click', '.pb-standalone').on('click', '.pb-standalone', function () {
                    var index = $(this).attr('index');//当前图片组中查看的图片的索引
                    for(var i=0;i<_this.showPicPaths.length;i++){
                        photos.push(_this.showPicPaths[i].picUrl);
                    }
                    for(var i=0;i<_this.tempPicPaths.length;i++){
                        photos.push(_this.tempPicPaths[i]);
                    }
                    //获取当前点击的记录的图片信息
                    myPhotoBrowserStandalone = $.photoBrowser({
                        photos: photos,
                        initialSlide: index,
                        toolbar: false,
                        theme: 'dark',
                        loop: false,
                        lazyLoading: true,
                        lazyLoadingInPrevNext: true,
                        onClick: function () {
                            myPhotoBrowserStandalone.close();
                            isPhotoOpen = false;
                            photos = [];
                        },
                        navbarTemplate: '<header class="bar bar-nav">' +
                        '<h1 class="title" style="float: left;"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">/</span> <span class="photo-browser-total"></span></div></h1>' +
                        '</header>'
                    });
                    myPhotoBrowserStandalone.open();
                    isPhotoOpen = true;
                });
            },
            beforeUpload: function (event) {
                if ($('.fp-left').length >= maxImgNum) {
                    $.toast(this.$translate("uploadcannotmorethan") + maxImgNum + this.$translate("zhang"));
                    event.preventDefault();
                    event.stopPropagation();

                }
            },
            deleteItemImg: function (index) {
                this.tempPicPaths.splice(index, 1);
            },
            deleteCerImg:function(index){
                var cerId = this.showPicPaths[index].id;
                this.$http.post('/sysmanager/deleteCertificateById.action',{
                    groupCertificateId : cerId
                }).then(function(ret) {
                    var result = ret.data.result;
                    if (result == "ok") {
                        this.showPicPaths.splice(index, 1);
                        $.toast(this.$translate('deletecertificatesuccess'));
                    } else {
                        $.toast(this.$translate('deletecertificatefailed'));
                    }
                });
            },
            uploadCer:function(){
                if(this.uploadFlag)return;
                if ($('.fp-left').length > maxImgNum) {
                    $.toast(this.$translate("uploadcannotmorethan") + maxImgNum + this.$translate("zhang"));
                    return;
                }
                if(!Constant.enterId) return;
                var imgurls = "";
                for(var i=0;i<this.tempPicPaths.length;i++){
                    var url = this.tempPicPaths[i];
                    imgurls = imgurls + url + "@@@";
                }
                if(!imgurls){
                    $.toast(this.$translate("nonewpicupload"));
                    return;
                }
                this.uploadFlag = true;
                this.waitInfo = this.$translate("uploadingwait");
                this.$http.post('/service/saveEnterpriseCers.action',{
                    enterpriseId : Constant.enterId,
                    eid:imgurls
                }).then(function(ret) {
                    var result = ret.data.result;
                    this.uploadFlag = false;
                    this.waitInfo = '';
                    if (result == "ok") {
                        $.toast(this.$translate("uploadcertificatesuccess"));
                        if(this.isApp){
                            //如果是从app里面点进来的注册，则调用app的方法跳转到登录界面
                            this.webviewReady();
                        }else{
                            if(Constant.language=='en'){
                                window.location.href = this.getRootPath() + "/uploadsuccess_en.html";
                            }else{
                                window.location.href = this.getRootPath() + "/uploadsuccess.html";
                            }
                            //window.location.href = getRootPath() + "/loginsuccess.html";
                            //window.location.href="http://www.ovopark.com/uploadsuccess.html";
                        }
                    } else {
                        $.toast(this.$translate("uploadcertificatefailed"));
                    }
                });

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
            openApp:function(){
                if(this.isWeixin()){
                    $.toast(this.$translate("netspaceopen"));
                }else{
                    var u = window.navigator.userAgent.toLowerCase();
                    if (u.indexOf('iphone') > -1 || u.indexOf('itouch') > -1 || u.indexOf('ipad') > -1) {
                        if(this.isApp){
                            //如果是从app里面点进来的注册，则调用app的方法跳转到登录界面
                            this.webviewReady();
                        }else {
                            window.location.href = "iOSWDZForAppStore://";
                            setTimeout(function () {
                                window.location.href = "https://itunes.apple.com/us/app/wan-dian-zhang/id1116662738?mt=8";
                            }, 3000);
                        }
                    }else if(u.indexOf('android') > -1){
                        if(this.isApp){
                            //如果是从app里面点进来的注册，则调用app的方法跳转到登录界面
                            this.webviewReady();
                        }else{
                            window.location.href="jaq://com.kedacom.ovopark";
                            setTimeout(function(){
                                window.location.href = "https://fir.im/store";
                            },3000);
                        }
                    }else{
                        window.location.href = getRootPath();
                        //window.location.href="http://www.ovopark.com";
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
                try{
                if ($.device.android) {
                        window.webview.goto_login("");//openGallery(max,has);
                } else if ($.device.ios) {
                        window.webkit.messageHandlers.goto_login.postMessage("");
                }
                }catch(e){
                    $.toast(this.$translate("notsupport"));
                }
            },
            getRootPath:function(){
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
                return rootPath;
            }
        }
    };
</script>
<style>
    .nextlogo{
        width:112px;
        height:58px;
        display:inline-block;
        vertical-align: middle;
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
    .register-wrap1{
        margin:100px auto 10px auto;
        padding:0px 15px 20px;
        min-width:290px;
        max-width:440px;
    }
    .register-wrap{
        margin:0 auto;
        padding:85px 15px 20px;
        min-width:290px;
        max-width:440px;
    }
    .register-container{
        padding:10px 9px;
    }
    .register-title{
        margin:0 0 20px;
        text-align: center;
        font-size:19px;
        font-family:"Microsoft Yahei";
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

    .add-file0 {
        position: relative;
        opacity: 0;
        width:100%;
        height:33px;
        top:-50px;
    }

    .add-file0 {
        left: 0px;
    }
    .enterprise-bg{
        font-family: Microsoft Yahei;
        background-color:#fff;
        border:1px solid #ddd;
        border-radius:10px;
        padding:20px 20px 40px 20px;
    }
    .add-filedesc{
        width:100%;
        line-height:30px;
        border:1px solid #ddd;
        color:#aaa;
        font-size:12px;
        display:inline-block;
        margin-top:8px;
    }
    .fp-left {
        margin-top:10px;
        width: 70px;
        float: left;
        position: relative;
    }

    .delete-img {
        position: absolute;
        top: -8px;
        right: 2px;
        background: #eee;
        border-radius: 10px;
        font-size: 12px;
        padding: 0px 6px 2px 6px;
        cursor:pointer;
    }
    .icon-cross {
        color: #333;
    }
    .upload-pic{
        height: 40px;
        line-height:40px;
        width:100%;
        background: #f90;
        display:inline-block;
        padding:10px auto;
        border-radius:10px;
        text-align:center;
        color:#fff;
        font-size:16px;
        margin:0 auto;
        cursor:pointer;
    }
    .upload-image{
        display:inline-block;
        height:40px;
        line-height:40px;
    }
    .tip-1{
        font-size:.75em;
        font-family:"Microsoft Yahei";
        color:#aaa;
    }
    .tip-3{
        height:40px;
    }

    .tip-2{
        height:50px;
    }
    .tip-login{
        font-size:.6em;
        font-family:"Microsoft Yahei";
        color:#0084ff;
        margin-top:10px;
        text-align:center;
        cursor:pointer;
    }
    .tip-login:hover{
        color:#0084aa;
    }
</style>


/** WEBPACK FOOTER **
 ** Step2.vue?49f42db6
 **/


// WEBPACK FOOTER //
// Step3.vue?4dc71f44