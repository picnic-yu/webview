<template>
    <div class="page handover-opt" :transition="transitionName">
        <div class="container">
            <header class="bar bar-nav">
                <h1 class='title'>{{$route.params.state|whichtitle}}</h1>
                <span class="pull-left icon-back" v-on:click="backTo()" v-if="showBackBtn==1"></span>
            </header>
            <div class="content create-content">
                <div class="infinite-scroll-preloader" v-show="display.loading">
                    <div class="preloader"></div>
                </div>
                <div class="doer-panel" v-if="items.length > 0">
                    <div class="doer-item" v-for="ic in items" v-show="!display.loading">
                        <div class="item-left">
                            <div class="user-header">
                                <userhead v-bind:user="ic"></userhead>
                            </div>
                        </div>
                        <div class="item-right">
                            <span class="user-name not-view">{{ic.userName}}</span>

                            <div class="doer-content">
                                <div class="doer-ct">
                                    {{ic.content}}
                                </div>
                                <div class="f-panel">
                                    <div class="fp-left images-li" v-for="pic in ic.showPics" v-bind:style="whichChildImgContainerSize(ic,pic)">
                                        <a class="ic-pic pb-standalone" index="{{$index}}"  parentIndex="{{$parent.$index}}">
                                            <img v-bind:style="whichChildImgSize(ic,pic)" v-bind:src="pic.url+'_'" />
                                        </a>
                                    </div>
                                    <div class="clearboth"></div>
                                </div>
                                <span class="doer-time">{{ic.createTime|whichtime}}</span>
                                <span class="doer-status state-{{item.state}}" v-if="$index==0">{{item.state | whichstate}}</span>
                            </div>
                        </div>
                        <div class="clearboth"></div>
                    </div>
                </div>
                <div class="no-data" v-if="(!items || items.length == 0) && item.canOper == 0"
                     v-show="!display.loading">
                    暂无处理记录
                </div>
            </div>
            <div class="os-bottom">
                <div class="btn-do" v-if="$route.params.state==2 && item.canOper == 1" v-on:click="doOpt(-1)">
                    处理
                </div>
                <div class="btn-submit" v-if="$route.params.state==1&& item.canOper == 1" v-on:click="doOpt(1)">
                    通过
                </div>
                <div class="btn-submit btn-after" v-if="$route.params.state==1&& item.canOper == 1"
                     v-on:click="doOpt(0)">
                    不通过
                </div>
            </div>
        </div>
        <div class="top-content animate">
            <header class="bar bar-nav">
                <h1 class='title'>{{submitTitle}}</h1>
                <span class="pull-left icon-back" v-on:click="closeSubmit()"></span>
                <button class="button button-link button-nav pull-right button-btn btn-nav" v-on:click="submit()">
                    提交
                </button>
            </header>
            <div class="submit-content">
                    <textarea class="top-textarea" v-bind:class="isPass==null?'require-text':''"
                              placeholder="{{submitPlaceholder}}" v-model="obj.content"
                              maxlength="1000"></textarea>

                <div class="img-content">
                    <div class="uploadimg-container">
                        <div class="fp-left cmt-pic-local" v-for="pic in obj.showPics" track-by="$index">
                            <a class="itemos-pic pb-standalone" index="{{$index}}">
                                <img v-bind:style="whichCmtImgSize(pic)" v-bind:src="pic.url" class="p-img p-img-{{$index}}"/>
                            </a>
                            <span class="delete-img icon-cross" v-on:click="deleteImg($index)"></span>
                        </div>
                    </div>
                    <div class="fp-add" @click="beforeUpload($event)">
                        <img width="60" height="60" src="../../../common/assets/imgs/add.png"/>
                        <input class="add-file0" v-show="!isAndroid" type="file" name="upload0" multiple accept="image/*"/>
                    </div>
                    <div class="clearboth"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    require('../../../common/assets/css/sm-extend.min.css');
    require('../../../common/assets/css/animate.min.css');
    require('../../../common/assets/font.css');
    require('../../../common/libs/sm-extend.js');
    require('../../../common/libs/drag/dragula.css');
    var dragula = require('dragula');
    var utils = require('./../utils');
    var commonutils = require('../../../common/assets/js/commonutils');
    var Vue = require('vue');
    var maxImgNum = 3;//最多可以上传的图片数目
    module.exports = {
        route: {
            data: function (transition) {
                var showSubmit = false;
                this.getData();
                if (this.$route.params.state == 0 && Constant.itemOpt.canOper == 1) {//第一次处理，直接显示处理界面
                    showSubmit = true;
                    this.isPass = null;
                    this.doOpt(-1);
                } else {
                    showSubmit = false;
                    var _this = this;
                    setTimeout(function () {
                        _this.showSubmit = false;
                        //$.closeModal('.top-content');
                        $('.top-content').animate({
                            opacity: 0,
                            visibility: 'hidden',
                            translate: '0,100%'
                        }, 200, 'ease-out');
                    }, 0);
                }
	            this.registGalleryEvent();
                this.$nextTick(function () {
                    transition.next({
                        item: Constant.itemOpt,
                        done: false,
                        title: '亮点推广',
                        showSubmit: showSubmit
                    });
                });
            },
            deactivate: function (transition) {
                if (myPhotoBrowserStandalone) {
                    myPhotoBrowserStandalone.close();
                    isPhotoOpen = false;
                }
                this.obj = {
                    content: '',
                    filePaths: [],
	                showPics:[],
                    pid: ''
                };
                transition.next();
            }
        },
        data: function () {
            return {
                transitionName: 'right',
                isAndroid:$.device.android&&Constant.gallery==1,
                title: '亮点推广',
                submitTitle: '',
                item: Constant.itemOpt,
                items: [],
                submitPlaceholder: '说点什么（必填）',
                display: {
                    loading: true
                },
                shopInfo: {
                    id: '',
                    name: ''
                },
                userInfo: {
                    id: '',
                    name: ''
                },
                layout: {
                    width: $('body').width()
                },
                showSubmit: false,
                isPass: null,
                obj: {
                    content: '',
                    filePaths: [],
	                showPics:[],
                    pid: ''
                },
                done: false,//是否完成创建
                submiting: false,//是否正在提交
                pics: [],
                showBackBtn: Constant.showBackBtn
            }
        },
        components: {
            'userhead': require('../components/UserHead.vue')
        },
        created: function () {

        },
        filters: {
            whichtitle: function (state) {
                if (state == 0) return '处理';
                if (state == 1) return '结果审批';
                return '处理详情';
            },
            whichtime: function (time) {
                if (time) {
                    time = time.replace('T', ' ');
                    return time.substring(5);
                }
                return "";
            },
            'whichstate': function (state) {
                if (state == 0) return "未处理";
                if (state == 1) return "待审批";
                if (state == 2) return "未通过";
                if (state == 3) return "已完成";
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            backTo: function (needRefreshDetail) {
                var curPathName = Constant.curRoute.pathName;
                var backInfo = utils.getBackPath(curPathName);
                Constant.needRefreshDetail = needRefreshDetail ? needRefreshDetail : false;
                router.go({name: backInfo.parent, params: backInfo.params});
            },
            init: function (opt) {

                if (this.$route.params.state == 0 && this.item.canOper == 1) {
                    this.doOpt(-1);
                }

                $(document).off('input', '.handover-opt .top-textarea').on('input', '.handover-opt .top-textarea', function (val) {
                    if (this.scrollHeight > 80) {
                        this.style.height = this.scrollHeight + 'px';
                    }
                });
                $(document).off('propertychange', '.handover-opt .top-textarea').on('propertychange', '.handover-opt .top-textarea', function (val) {
                    if (this.scrollHeight > 80) {
                        this.style.height = this.scrollHeight + 'px';
                    }
                });
                dragula([$('.img-content .uploadimg-container')[0]]);
                this.bindItemEvent();
            },
            /**
             * 计算subItem里面每张图片容器的大小
             * */
            whichChildImgContainerSize: function (item,pic) {
                var defaultWidth = this.layout.width - 70 - 30,
                        defaultWidthX = this.layout.width - 70 - 10;
                var size;
                if (!item.showPics) {
                    return 0;
                }else{
                    size = utils.computeImgWH(pic.width,pic.height,9,defaultWidthX);
                }
                return {
                    width:size.pw+'px',
                    height:size.ph+'px'
                };
            },
            /**
             * 计算subItem里面图片的大小
             * */
            whichChildImgSize: function (item,pic) {
                var defaultWidth = this.layout.width - 70 - 30,
                        defaultWidthX = this.layout.width - 70 - 10;
                var size;
                if (!item.showPics) {
                    return 0;
                } else {
                    size = utils.computeImgWH(pic.width,pic.height,9,defaultWidthX);
                }
                return {
                    width:size.w+'px',
                    height:size.h+'px',
                    webkitTransform:'translate('+size.offsetX+'px,'+size.offsetY+'px)'
                };
            },
	        whichCmtImgSize:function(pic){
		        var totalWidth = 190;
		        var size = utils.computeImgWH(pic.width,pic.height,9,totalWidth);
		        return {
			        width:size.w+'px',
			        height:size.h+'px',
			        webkitTransform:'translate('+size.offsetX+'px,'+size.offsetY+'px)'
		        };
	        },
	        //注册安卓相册事件
	        registGalleryEvent:function(){
		        var _this = this;
		        //安卓选完相册后的回调
		        window.receiveGalleryData = function (base64,width,height) {
			        base64 = 'data:image/png;base64,'+base64;
			        if (!_this.obj.filePaths) _this.obj.filePaths = [];
			        _this.obj.filePaths.push(base64);
			        if (!_this.obj.showPics) _this.obj.showPics = [];
			        _this.obj.showPics.push({
				        url:base64,
				        width:width,
				        height:height
			        });
		        };
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
                        if (file.size > 1024 * 1024 * 10) {
                            $.toast('图片大小不能超过10M');
                            break;
                        }
                        (function (i) {
                            new html5ImgCompress(_file.files[i], {
                                maxWidth: 1600,
                                maxHeight: 1600,
                                before: function (file) {
                                    //console.log('多张: ' + i + ' 压缩前...');
                                },
                                done: function (file, base64,img) { // 这里是异步回调，done中i的顺序不能保证
                                    //console.log('多张: ' + i + ' 压缩成功...'+file.length+","+base64.length);
                                    successNum++;
                                    if (!_this.obj.filePaths) _this.obj.filePaths = [];
                                    _this.obj.filePaths.push(base64);
	                                if (!_this.obj.showPics) _this.obj.showPics = [];
	                                _this.obj.showPics.push({
		                                url:base64,
		                                width:img.width,
		                                height:img.height
	                                });
                                    if (successNum == fileNum) {
                                        $(_file).remove();
                                        //上传成功之后重置input
                                        $($addImg).parent().append('<input class="add-file0" name="upload0" type="file" multiple accept="image/*"/>');
                                    }
                                    //检测是否上传了太多的图片
                                    setTimeout(function () {
                                        if (!hasToMorePic) {
                                            if ($('.handover-opt .itemos-pic.pb-standalone').length > maxImgNum) {
                                                hasToMorePic = true;
                                                $.toast('上传的图片最多不能超过' + maxImgNum + '张');
                                            }
                                        }
                                    }, 500);
                                },
                                fail: function () {
                                    console.log('多张: ' + i + ' 压缩失败...');
                                },
                                complate: function () {
                                    console.log('多张: ' + i + ' 压缩完成...');
                                },
                                notSupport: function (file) {
                                    notSupport = true;
                                    alert('浏览器不支持！');
                                }
                            });
                        })(i);
                    }
                });
                //点击时打开图片浏览器
                var photos = [];
                var _this = this;
                $(document).off('click', '.pb-standalone.itemos-pic').on('click', '.pb-standalone.itemos-pic', function () {
                    var index = $(this).attr('index');//当前图片组中查看的图片的索引
                    photos = _this.obj.filePaths;
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
                        },
                        navbarTemplate: '<header class="bar bar-nav">' +
                        '<h1 class="title" style="float: left;"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">/</span> <span class="photo-browser-total"></span></div></h1>' +
                        '</header>'
                    });
                    myPhotoBrowserStandalone.open();
                    isPhotoOpen = true;
                });

                //点击时打开图片浏览器
                var photos = [];
                var _this = this;
                $(document).off('click', '.pb-standalone.ic-pic').on('click', '.pb-standalone.ic-pic', function () {
                    var index = $(this).attr('index');//当前图片组中查看的图片的索引
                    var parentIndex = $(this).attr('parentIndex');
                    var photos = _this.items[parentIndex].filePaths;
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
                        },
                        navbarTemplate: '<header class="bar bar-nav">' +
                        '<h1 class="title" style="float: left;"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">/</span> <span class="photo-browser-total"></span></div></h1>' +
                        '</header>'
                    });
                    myPhotoBrowserStandalone.open();
                    isPhotoOpen = true;
                });


            },
            clearData: function () {
                Constant.bo = this.bo = '';
                this.items = [];
                Constant.selectedUsers = this.userlist = [];
            },
            deleteImg: function (index) {
                this.obj.filePaths.splice(index, 1);
	            this.obj.showPics.splice(index, 1);
            },
            doOpt: function (whichopt, flag) {
                if (whichopt == 1) {//通过
                    this.submitTitle = '通过';
                    this.isPass = whichopt;
                    this.submitPlaceholder = '说点什么（非必填）';
                } else if (whichopt == 0) {//不通过
                    this.submitTitle = '不通过';
                    this.isPass = whichopt;
                    this.submitPlaceholder = '说点什么（非必填）';
                } else if (whichopt == -1) {
                    this.submitTitle = '处理';
                    this.isPass = null;
                    this.submitPlaceholder = '说点什么（必填）';
                }
                this.showSubmit = true;
                setTimeout(function () {
                    this.showSubmit = true;
                    $('.top-content').animate({
                        opacity: 1,
                        visibility: 'visible',
                        translate: '0,0'
                    }, 200, 'ease-out');
                }, 0);
            },
            closeSubmit: function () {
                if (this.item.state == 0 && this.item.canOper == 1) {
                    this.backTo();
                } else {
                    this.showSubmit = false;
                    $('.top-content').animate({
                        opacity: 0,
                        visibility: 'hidden',
                        translate: '0,100%'
                    }, 200, 'ease-out');
                }
            },
            getData: function () {
                var _this = this;
                this.display.loading = true;
                this.$http.post('/service/getSpotLightPromoteDetails.action?token=' + Constant.token, {
                    spotlightPromoteId: this.$route.params.pid
                }).then(function (ret) {
                    _this.display.loading = false;
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        var data = ret.data.data.data;
                        if (data && data.length > 0) {
                            _this.items = data.reverse();
                        } else {
                            _this.items = [];
                        }
                    }
                });
            },
            submit: function () {
                if (this.submiting) {
                    return;
                }
                var hasTextSth = false;
                $('.require-text').each(function () {
                    if (this.value) {
                        hasTextSth = true;
                    }
                });
                if (!hasTextSth && $('.handover-opt .require-text').length > 0) {
                    $.toast('说点什么吧');
                    return;
                }
                if ($('.handover-opt .itemos-pic.pb-standalone').length > maxImgNum) {
                    $.toast('上传的图片最多不能超过' + maxImgNum + '张');
                    return;
                }
                var _this = this;
                Vue.http.options.emulateJSON = false;
                this.obj.pid = this.$route.params.pid;
                $.showPreloader('正在处理');
                this.submiting = true;
                this.$http.post('/service/saveSoptlightPromoteProcess.action?token=' + Constant.token, {
                    spotlightPromoteProcess: this.obj,
                    isPass: this.isPass,
                    token: Constant.token
                }).then(function (ret) {
                    _this.submiting = false;
                    Vue.http.options.emulateJSON = true;
                    $.hidePreloader();
                    if (ret.data.result == 'ok') {
                        $.toast('提交成功');
                        _this.done = true;
                        setTimeout(function () {
                            _this.backTo(true);
                        }, 1500);
                    } else if (ret.data.result == 'DUPLICATE') {
                        $.toast('不能重复提交');
                    } else {
                        $.toast('提交失败');
                    }
                });
            },
            beforeUpload: function (event) {
                if ($('.handover-opt .itemos-pic.pb-standalone').length >= maxImgNum) {
                    $.toast('上传的图片最多不能超过' + maxImgNum + '张');
                    event.preventDefault();
                    event.stopPropagation();
                }
                //调用安卓相册
                if(this.isAndroid){
                    try{
                        window.webview && window.webview.openGallery(maxImgNum,$('.handover-opt .itemos-pic.pb-standalone').length);
                    }catch(e){
                        $.toast('error');
                    }
                    return;
                }
            },
            initAllSearch: function () {
                Constant.shopInfo.id = '';
                Constant.shopInfo.name = '';
                Constant.search = {
                    startTime: '',
                    endTime: '',
                    dateTime: ''
                };
                Constant.userInfo = {
                    id: '',
                    name: ''
                };
                Constant.atMe = 0;
                Constant.isMe = 0;
            }
        }
    };
</script>

<style>
    .handover-opt li {
        display: block;
    }

    .handover-opt .content.create-content {
        background: #fff;
        overflow-x: hidden;
        bottom: 42px;
        position: absolute;
    }

    .os-bottom {
        bottom: 0px;
        position: absolute;
        width: 100%;
        border-top: 1px solid #ddd;
    }

    .handover-opt .btn-submit {
        width: 50%;
        float: left;
        color: #f90;
        text-align: center;
        height: 40px;
        line-height: 40px;
        position: relative;
    }

    .handover-opt .btn-do {
        width: 100%;
        color: #f90;
        text-align: center;
        height: 40px;
        line-height: 40px;
    }

    .handover-opt .btn-after:before {
        content: '';
        position: absolute;
        width: 1px;
        height: 32px;
        background: #ddd;
        left: 0px;
        top: 4px;
    }

    .handover-opt .btn-nav {
        color: #fa0;
    }

    .handover-opt .item-images li {
        display: inline-block;
        padding: 5px 10px 5px 0px;
    }

    .handover-opt .top-content {
        width: 100%;
        background: #eee;
        padding: 0px;
        -webkit-transform-style: preserve-3d;
        -webkit-backface-visibility: hidden;
        position: absolute;
        left: 0px;
        top: 0px;
        height: 100%;
        overflow: auto;
        z-index: 10400;
        box-sizing: border-box;
        display: inline-block;
        opacity: 0;
        visibility: hidden;
        transform: translate(0, 100%);
        /*transition-property: transform;*/
    }

    @-webkit-keyframes fadeInUp {
        0% {
            opacity: 0;
            -webkit-transform: translate3d(0, 100%, 0);
            transform: translate3d(0, 100%, 0);
        }

        100% {
            opacity: 1;
            -webkit-transform: none;
            transform: none;
        }
    }

    @keyframes fadeInUp {
        0% {
            opacity: 0;
            -webkit-transform: translate3d(0, 100%, 0);
            transform: translate3d(0, 100%, 0);
        }

        100% {
            opacity: 1;
            -webkit-transform: none;
            transform: none;
        }
    }

    .fade-enter {
        -webkit-animation-name: fadeInUp;
        animation-name: fadeInUp;
    }

    .handover-opt .submit-content {
        top: 2.2rem;
        position: absolute;
        background: #fff;
        width: 100%;
        padding: 10px;
    }

    .handover-opt .top-content textarea {
        border: 1px solid #ddd;
    }

    .handover-opt .img-content {
        position: relative;
        margin-bottom: 10px;
    }

    .handover-opt .top-textarea {
        border: none;
        background: transparent;
        height: 80px;
        width: 100%;
    }

    .handover-opt .uploadimg-container {
        float: left;
        display: inline-block;
    }

    .handover-opt .fp-left {
        width: 70px;
        height: 60px;
        float: left;
        position: relative;
	    margin-bottom: 5px;
    }

    .handover-opt .delete-img {
        position: absolute;
        top: -4px;
        right: 2px;
        background: #eee;
        border-radius: 8px;
        font-size: 12px;
        padding: 2px;
    }

    .handover-opt .fp-right textarea {
        font-size: 14px;
        height: 60px;
        padding-left: 4px;
        width: calc(100% - 70px);
        border: 1px solid #ddd;
    }

    .handover-opt .user-name {
        font-size: 14px;
    }

    .handover-opt .fp-add {
        position: relative;
        float: left;
        width: 70px;
    }

    .handover-opt .add-file0 {
        position: absolute;
        top: 0px;
        opacity: 0;
        font-size: 12px;
        width: 60px;
        height: 60px;
    }

    .add-file0 {
        left: 0px;
    }

    .clearboth {
        clear: both;
    }

    .blank {
        height: 100px;
        width: 100%;
    }

    .handover-opt .doer-panel {
        padding: 0px 10px;
        position: relative;
    }

    .handover-opt .doer-panel:before {
        content: '';
        position: absolute;
        width: 1px;
        background: #ddd;
        height: 100%;
        height: calc(100% - 20px);
        top: 10px;
        left: 28px;
    }

    .handover-opt .doer-item {
        padding: 10px 0px;
        margin-top: 1px;
        clear: both;
        position: relative;
    }

    .handover-opt .doer-panel .item-left {
        float: left;
    }

    .handover-opt .mt-status {
        font-size: 12px;
        display: block;
    }

    .handover-opt .doer-panel .item-left {
        width: 40px;
    }

    .handover-opt .doer-panel .user-header-img {
        border-radius: 18px;
    }

    .handover-opt .doer-panel .default-header {
        width: 36px;
        height: 36px;
        border-radius: 18px;
        text-align: center;
        margin: 0;
    }

    .handover-opt .doer-panel .default-header .user-shortname {
        height: 24px;
        display: inline-block;
        margin-top: 10px;
        font-size: 12px;
        color: #fff;
    }

    .handover-opt .item-right {
        float: left;
        width: calc(100% - 42px);
        border-bottom: 1px dotted #ddd;
        padding-bottom: 10px;
    }

    .handover-opt .doer-status .user-name {
        font-size: 14px;
    }

    .handover-opt .doer-ct {
        font-size: 15px;
        color: #666;
	    white-space: pre-line;
    }

    .handover-opt .doer-content {
        padding-top: 6px;
    }

    .handover-opt .doer-time {
        color: #999;
        font-size: 12px;
    }

    .handover-opt .doer-status {
        float: right;
        font-size: 14px;
    }

    .state-0 {
        color: #ff5959;
    }

    .state-1 {
        color: #f90;
    }

    .state-2 {
        color: red;
    }

    .state-3 {
        color: #8acc47;
    }

    .popup-overlay {
        height: 0;
    }

    .handover-opt .no-data {
        width: 100%;
        text-align: center;
        margin-top: 10px;
        color: red;
    }

    .handover-opt .user-header-img {
        width: 36px;
        height: 36px;
        border-radius: 18px;
    }

    .handover-opt .images-li{
        overflow: hidden;
        margin-right: 5px;
        margin-top: 5px;
    }
    .handover-opt .item-images li.images-li{
        padding: 0px;
        margin-top: 0px;
    }
    .cmt-pic-local{
        
    }
    .itemos-pic{
        overflow: hidden;
        width: 60px;
        height: 60px;
        display: inline-block;
    }
    @media all and (max-width: 360px) {
        .timebox .date-time {
            font-size: 12px;
        }

        .is-today {
            font-size: 12px;
        }
    }
</style>
