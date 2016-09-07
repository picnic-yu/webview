<template>
    <div class="page-group handover-detail" :transition="transitionName">
        <div class="page page-current container">
            <header class="bar bar-nav">
                <h1 class='title'>详情</h1>
                <span class="pull-left icon-back" v-on:click="backTo()" v-if="showBackBtn==1"></span>
            </header>
            <div class="content" v-show="!display.loading">
                <div class="item-container item-container-top">
                    <div class="item-container">
                        <div class="item-left">
                            <div v-on:click="searchByUser(bo.userId,bo.userName)">
                                <userhead v-bind:user="user"></userhead>
                            </div>
                        </div>
                        <div class="item-right">
                            <label class="user-name not-view" v-on:click="searchByUser(bo.userId,bo.userName)">{{bo.userName}}</label>
                            <span class="time-name">{{bo.createTime && bo.createTime.replace('T',' ')}}</span>
                        </div>
                        <div class="item-content">
                            <div class="item-text">
                                {{bo.content}}
                            </div>
                            <div class="item-images" index="{{$index}}">
                                <ul>
                                    <li v-for="path in bo.showPicPaths">
                                        <a class="pb-standalone ditem-pic" index="{{$index}}">
                                            <img class="not-view" v-bind:src="path+'_'"
                                                 width="{{whichItemImgWidth(bo)}}px"
                                                 height="{{whichItemImgWidth(bo)}}px"/></a>
                                    </li>
                                </ul>
                            </div>
                            <div class="item-type">
                                <span class="type-name">{{bo.moudleName}}</span>
                            </div>
                            <div class="item-footer">
                                <span class="type-name">检查人：{{bo.checkerName}}</span>
                            </div>
                            <div class="item-footer" v-if="bo.moudleType == 1">
                                <span class="type-name">截止日期：{{bo.deadline?bo.deadline.substring(0,10):'无'}}</span>
                            </div>
                            <div class="item-footer">
                                <span class="dept-name" v-show="bo.isOpen==0">{{bo.deptName}}</span>
                                <span class="dept-name" v-show="bo.isOpen==1">公开</span>
                            </div>
                            <div class="item-footer at-footer">
                                <label class="atme-name" v-show="bo.isAtMe==1 && bo.isRead==1">已读</label>

                                <div class="af-at" v-on:click="whoRead(bo)">
                                    <progress v-on:click="whoRead(bo)" class="not-view"
                                              v-bind:percent="bo.reminderList && bo.reminderList.length>0 && bo.remindersReadCount/bo.reminderList.length"
                                              v-if="bo.reminderList && bo.reminderList.length>0"></progress>
                                    <label v-on:click="whoRead(bo)" class="reminder-name not-view"
                                           v-show="bo.reminderList && bo.reminderList.length>0">
                                        <span class="not-view"
                                              v-show="bo.reminderList && bo.reminderList.length>bo.remindersReadCount">{{(bo.reminderList && bo.reminderList.length ? bo.reminderList.length:0)-(bo.reminderList && bo.remindersReadCount ? bo.remindersReadCount:0)}}人未读</span>
                                        <span class="not-view"
                                              v-show="bo.reminderList && bo.reminderList.length==bo.remindersReadCount">全部已读</span>
                                    </label>
                                </div>
                                <div class="cmt-label not-view" @click="doCmt(bo)">
                                    <span class="icon-comment not-view"></span>
                                    <span class="cmt-num not-view">{{bo.comment && bo.comment.length || 0}}</span>
                                </div>
                            </div>
                            <div class="item-footer footer-cmt" v-if="bo.comment && bo.comment.length>0">
                                <div class="cmt-panel">
                                    <div class="cmt-item not-view" v-for="cmt in bo.comment">
                                        <div class="cmt-content not-view" @click="doCmt(bo,cmt)">
                                            <span class="cmt-user not-view">{{cmt.userName}}</span>
                                            <span class="not-view" v-show="cmt.replyUserId">回复</span>
                                            <span v-show="cmt.replyUserId" class="cmt-user not-view">{{cmt.replyUserName}}</span>
                                            ：{{cmt.content}}
                                        </div>
                                        <div class="cmt-pic" v-for="pic in cmt.filePaths">
                                            <a class="detail-cmted-pic pb-standalone" index="{{$index}}"
                                               parentIndex="{{$parent.$index}}">
                                                <img width="40" height="40" v-bind:src="pic"/>
                                            </a>
                                        </div>
                                        <div class="clearboth"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--<div class="c-split-content" v-show="items&&items.length>0"></div>-->
                <div class="c-item-content" v-if="bo.moudleType == 0">
                    <ul>
                        <li v-for="item in items" class="item-li">
                            <div class="cic-title">
                                <span class="cic-flag"></span>
                                <h4 class="item-title sys-text">{{item.confName}}</h4>
                            </div>
                            <ul>
                                <li v-for="subItem in item.childs" class="sub-li">
                                    <div class="sub-item">
                                        <div class="sub-title sys-text"><span>{{$index+1}}、{{subItem.confName}}</span>
                                        </div>
                                        <div class="sub-content">
                                            <div class="sub-textarea">
                                                <div class="text require-text">{{subItem.content}}</div>
                                            </div>
                                        </div>
                                        <div class="f-panel">
                                            <div class="fp-left" v-for="path in subItem.filePaths">
                                                <a class="item-pic pb-standalone sub-item-pic" index="{{$index}}"
                                                   subItemIndex="{{$parent.$index}}"
                                                   itemIndex="{{$parent.$parent.$index}}">
                                                    <img width="60" height="60" v-bind:src="path"/>
                                                </a>
                                            </div>
                                            <div class="clearboth"></div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="c-item-content mt-content" v-show="bo.moudleType == 1">
                    <div class="doer-panel">
                        <h4>执行人列表</h4>

                        <div class="doer-item" v-for="item in bo.subItems">
                            <label class="user-name">{{item.userName}}</label>
                            <span class="mt-status">{{item.isPass==1?'已通过':'未通过'}}</span>
                            <span class="mt-status">{{item.isCompleted==1?'已完成':'未完成'}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cmt-bottom cmt-bottom0">
                <div class="cb-container">
                    <button class="not-view button button-link button-nav button-light btn-addpic"
                            @click="beforeUpload($event)">
                        <span class="icon-image"></span>
                        <input class="add-pic" index="{{$index}}" type="file" name="upload0" multiple accept="image/*"/>
                    </button>
                    <textarea class="cmt-textarea" placeholder="回复" id="cmtInput2"
                              v-model="cmtContent"></textarea>
                    <button class="button button-link button-nav button-fill button-orange btn-send"
                            v-on:click="submitCmt()">
                        发送
                    </button>
                    <div class="cmtpic-container" v-show="cmtPics && cmtPics.length>0">
                        <div class="cmt-pic" v-for="pic in cmtPics" track-by="$index">
                            <a class="detail-cmt-pic pb-standalone" index="{{$index}}" parentIndex="{{$parent.$index}}">
                                <img v-bind:src="pic" width="40" height="40">
                            </a>
                            <span class="delete-img icon-cross" v-on:click="deleteCmtImg(cmtPics,$index)"></span>
                        </div>
                    </div>
                    <div class="clearboth"></div>
                </div>
            </div>
            <modal-dialog v-bind:show-modal.sync="showModal">
                <header class="dialog-header" slot="header">
                    <div class="buttons-tab head-tab">
                        <a class="button  tab-link active" v-on:click="selectTabIndex(0)"
                           v-bind:class="currentTabIndex==0?'active':''">未读的({{unreadUsers.length}})</a>
                        <a class="button  tab-link" v-on:click="selectTabIndex(1)"
                           v-bind:class="currentTabIndex==1?'active':''">谁看过了({{readUsers.length}})</a>
                    </div>
                </header>
                <div class="dialog-body" slot="body">
                    <div class="tabs">
                        <div class="tab active" id="readtab1">
                            <ul class="modal-ul">
                                <li v-for="user in unreadUsers">
                                    <userhead v-bind:user="user"></userhead>
                                    <div class="dlg-username">{{user.userName}}</div>
                                </li>
                            </ul>
                        </div>
                        <div class="tab" id="readtab2">
                            <ul class="modal-ul">
                                <li v-for="user in readUsers">
                                    <userhead v-bind:user="user"></userhead>

                                    <div class="dlg-username">{{user.userName}}</div>
                                    <div class="dlg-time">{{user.readTime | whichreadtime}}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </modal-dialog>
        </div>
    </div>
</template>

<script>
    require('../../../common/assets/css/sm-extend.min.css');
    require('../../../common/assets/font.css');
    require('../../../common/libs/sm-extend.js');
    require('../../../common/libs/drag/dragula.css');
    var dragula = require('dragula');
    var commonutils = require('../../../common/assets/js/commonutils');
    var Vue = require('vue');
    var maxCmtImgNum = 3;
    var myPhotoBrowserStandalone;
    module.exports = {
        route: {
            data: function (transition) {
                this.getData();
                if (Constant.needReadMessage || Constant.source == 1) {
                    this.hasReadCertainBook();
                }
                transition.next({
                    bo: Constant.bo,
                    items: (Constant.bo && Constant.bo.subItems) ? Constant.bo.subItems : []
                });
            },
            deactivate: function (transition) {
                //this.clearData();
                if (myPhotoBrowserStandalone) {
                    myPhotoBrowserStandalone.close();
                }
                var _this = this;
                setTimeout(function () {
                    Constant.bo = this.bo = '';
                    _this.items = [];
                    _this.readUsers = [];
                    _this.unreadUsers = [];
                }, 0);
                transition.next();
            },
            canDeactivate: function (transition) {
                this.clearData();
                transition.next();
            }
        },
        data: function () {
            return {
                transitionName: 'right',
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
                display: {
                    nodata: false,
                    searchOther: false,
                    loading: true
                },
                pics: [],
                bo: Constant.bo,
                items: (Constant.bo && Constant.bo.subItems) ? Constant.bo.subItems : [],
                curUser: {},//当前用户
                user: {},//当前查看的目标用户
                readUsers: [],
                unreadUsers: [],
                showModal: false,//是否打开对话框
                currentTabIndex: 0,//对话框中选择的选项卡
                showCommentModal: false,//是否显示评论的框
                cmtContent: '',//评论内容
                cmtPid: '',//评论的父id
                cmtPics: [],//评论时上传的图片
                selectItem: {},//当前操作的记录
                loading: false,
                refreshInit: false,
                showBackBtn: Constant.showBackBtn
            }
        },
        components: {
            'progress': require('../components/Progress.vue'),
            'modal-dialog': require('../components/ReadUserDialog.vue'),
            'userhead': require('../components/UserHead.vue')
        },
        created: function () {

        },
        filters: {
            'getdate': function (date) {
                if (!date) return '';
                return date.substring(5);
            },
            'whichreadtime': function (time) {
                time = time.replace('T', ' ');
                return time.substring(5, 16);
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            backTo: function () {
                var curPathName = Constant.curRoute.pathName;
                var backInfo = utils.getBackPath(curPathName);
                router.go({name: backInfo.parent, params: backInfo.params});
            },
            webviewReady: function () {
                if ($.device.android && Constant.showBackBtn == 1) {
                    try {
                        window.webview && window.webview.loadSuccess_webview();
                    } catch (e) {
                    }
                } else if ($.device.ios) {
                    if (Constant.isWKWebView == 1) {
                        try {
                            window.webkit.messageHandlers.loadSuccess_webview.postMessage(1);
                        } catch (e) {
                        }
                    } else {
                        try {
                            loadSuccess_webview();
                        } catch (e) {
                        }
                    }
                } else {

                }
            },
            /**
             * 计算每张图片的大小
             * */
            whichItemImgWidth: function (item) {
                if (!item.showPicPaths) {
                    return 0;
                } else if (item.showPicPaths.length == 1) {
                    return (this.layout.width - 70) / 2;
                } else {
                    return (this.layout.width - 80) / 3 - 10;
                }
            },
            init: function () {
                this.webviewReady();
                $(document).off('input', '.handover-detail .cmt-textarea').on('input', '.handover-detail .cmt-textarea', function () {
                    if (this.scrollHeight > 28) {
                        this.style.height = this.scrollHeight + 'px';
                        $(this).parent().parent().height(this.scrollHeight + 6);
                    }
                });
                $(document).off('propertychange', '.handover-detail .cmt-textarea').on('propertychange', '.handover .cmt-textarea', function () {
                    if (this.scrollHeight > 28) {
                        this.style.height = this.scrollHeight + 'px';
                        $(this).parent().parent().height(this.scrollHeight + 6);
                    }
                });
                dragula([$('.cmt-bottom0 .cmtpic-container')[0]])
            },
            bind: function () {
                this.bindPicEvent();
            },
            bindPicEvent: function () {
                //点击时打开图片浏览器
                var _this = this;
                //top区域图片点击事件
                $(document).off('click', '.pb-standalone.ditem-pic').on('click', '.pb-standalone.ditem-pic', function () {
                    var index = $(this).attr('index');//当前图片组中查看的图片的索引
                    var photos = _this.bo.showPicPaths;
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
                        },
                        navbarTemplate: '<header class="bar bar-nav">' +
                        '<h1 class="title" style="float: left;"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">/</span> <span class="photo-browser-total"></span></div></h1>' +
                        '</header>'
                    });
                    myPhotoBrowserStandalone.open();
                });
                $(document).off('click', '.pb-standalone.sub-item-pic').on('click', '.pb-standalone.sub-item-pic', function () {
                    var index = $(this).attr('index');//当前图片组中查看的图片的索引
                    var subItemIndex = $(this).attr('subItemIndex');
                    var itemIndex = $(this).attr('itemIndex');
                    var photos = _this.bo.subItems[itemIndex].childs[subItemIndex].filePaths;
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
                        },
                        navbarTemplate: '<header class="bar bar-nav">' +
                        '<h1 class="title" style="float: left;"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">/</span> <span class="photo-browser-total"></span></div></h1>' +
                        '</header>'
                    });
                    myPhotoBrowserStandalone.open();
                });
                //上传图片的点击事件
                $(document).off('click', '.pb-standalone.detail-cmt-pic').on('click', '.pb-standalone.detail-cmt-pic', function () {
                    var index = $(this).attr('index');//当前图片组中查看的图片的索引
                    var photos = _this.cmtPics;
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
                        },
                        navbarTemplate: '<header class="bar bar-nav">' +
                        '<h1 class="title" style="float: left;"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">/</span> <span class="photo-browser-total"></span></div></h1>' +
                        '</header>'
                    });
                    myPhotoBrowserStandalone.open();
                });
                //评论中的图片点击事件
                $(document).off('click', '.pb-standalone.detail-cmted-pic').on('click', '.pb-standalone.detail-cmted-pic', function () {
                    var index = $(this).attr('index');//当前图片组中查看的图片的索引
                    var parentIndex = $(this).attr('parentIndex');
                    var photos = _this.bo.comment[parentIndex].filePaths;
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
                        },
                        navbarTemplate: '<header class="bar bar-nav">' +
                        '<h1 class="title" style="float: left;"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">/</span> <span class="photo-browser-total"></span></div></h1>' +
                        '</header>'
                    });
                    myPhotoBrowserStandalone.open();
                });
                //上传图片事件
                $(document).off('change', '.handover-detail .add-pic').on('change', '.handover-detail .add-pic', function () {
                    var index = $(this).attr('index');
                    var $addImg = $(this).prev();
                    var _file = this;
                    var hasToMorePic = false;
                    var successNum = 0, fileNum = this.files.length;
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
                                done: function (file, base64) { // 这里是异步回调，done中i的顺序不能保证
                                    //console.log('多张: ' + i + ' 压缩成功...'+file.length+","+base64.length);
                                    successNum++;
                                    if (!_this.cmtPics) _this.cmtPics = [];
                                    _this.cmtPics.push(base64);
                                    if (successNum == fileNum) {
                                        $(_file).remove();
                                        //上传成功之后重置input
                                        $($addImg).parent().append('<input class="add-pic" index="' + index + '" name="upload0" type="file" multiple accept="image/*"/>');
                                    }
                                    //检测是否上传了太多的图片
                                    setTimeout(function () {
                                        if (!hasToMorePic) {
                                            if ($('.cmt-bottom0 .cmt-pic').length > maxCmtImgNum) {
                                                hasToMorePic = true;
                                                $.toast('上传的图片最多不能超过' + maxCmtImgNum + '张');
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
            },
            getData: function () {
                var _this = this;
                $.showPreloader('正在加载');
                this.display.loading = true;
                this.$http.post('/service/constructHandoverBookBo.action?token=' + Constant.token, {
                    handoverBookId: this.$route.params.id
                }).then(function (ret) {
                    $.hidePreloader();
                    _this.display.loading = false;
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        var data = ret.data.data.data;
                        Constant.bo = _this.bo = data;
                        _this.user = {
                            id: _this.bo.userId,
                            thumbUrl: _this.bo.userPicture,
                            shortName: _this.bo.userShortName
                        };
                        if (data && data.subItems && data.subItems.length > 0) {
                            _this.items = data.subItems;
                        } else {
                            _this.items = [];
                        }
                        _this.curUser = ret.data.data.user;
                        //_this.allpics();
                        setTimeout(_this.bind, 1000);
                    }
                });
            },
            /**
             * 计算所有图片
             * */
            allpics: function () {
                var pics = [];
                var bo = this.bo;
                if (bo.showPicPaths && bo.showPicPaths.length > 0) {
                    pics = pics.concat(bo.showPicPaths);
                }
                if (bo.subItems) {
                    for (var i = 0; i < bo.subItems.length; i++) {
                        var sitem = bo.subItems[i];
                        if (sitem.childs) {
                            for (var j = 0; j < sitem.childs.length; j++) {
                                var item = sitem.childs[j];
                                if (item.filePaths && item.filePaths.length > 0) {
                                    pics = pics.concat(item.filePaths);
                                }
                            }
                        }
                    }
                }
                this.resetSeq();
                this.pics = pics;
            },
            resetSeq: function () {
                this.pics = [];
                setTimeout(function () {
                    var i = 0;
                    $('.pb-standalone').each(function () {
                        $(this).attr('index', i++);
                    });
                }, 500);
            },
            clearData: function () {
                //Constant.bo = this.bo = '';
                //this.items = [];
                //this.readUsers = [];
                //this.unreadUsers = [];
                this.showModal = false;//是否打开对话框
                this.currentTabIndex = 0;//对话框中选择的选项卡
                //this.showCommentModal = false;//是否显示评论的框
                this.cmtContent = '';//评论内容
                this.cmtPid = '';//评论的父id
                this.selectItem = {};//当前操作的记录
                this.pics = [];
                Constant.needRefresh = false;//返回到主页时不需要刷新
            },
            hasReadCertainBook: function () {
                this.$http.post('/service/hasReadCertainBook.action?token=' + Constant.token, {
                    handoverBookId: this.$route.params.id
                }).then(function (ret) {

                });
            },
            /**
             * 点击查看谁已经看过
             * @param item
             */
            whoRead: function (item) {
                var users = whohasread(item.reminderList);
                this.readUsers = users.read;
                this.unreadUsers = users.unRead;
                this.showModal = true;
            },
            /**
             * 谁已经看过对话框中选择tab页
             * @param index
             */
            selectTabIndex: function (index) {
                this.currentTabIndex = index;
                if (index == 0) {
                    $('#readtab1').addClass('active');
                    $('#readtab2').removeClass('active');
                } else {
                    $('#readtab2').addClass('active');
                    $('#readtab1').removeClass('active');
                }
            },
            /**
             * 评论
             */
            doCmt: function (item, cmt) {
                if (cmt && this.curUser && this.curUser.id == cmt.userId) {
                    //Vue.set(cmt, 'showDelete', !cmt.showDelete);
                    this.popActions(cmt.id, item.comment);
                    return;
                }
                //this.showCommentModal = true;
                this.selectItem = item;
                var placeholderStr = '';
                if (cmt) {
                    placeholderStr = '回复 ' + cmt.userName;
                    this.cmtPid = cmt.id;
                } else {
                    placeholderStr = '回复';
                    this.cmtPid = null;
                }
                $('#cmtInput2').attr('placeholder', placeholderStr);
                $('#cmtInput2').height(30);
                /*window.webview &&　window.webview.input("cmtInput2");*/
                setTimeout(function () {
                    $('#cmtInput2')[0].focus();
                }, 1000);
            },
            submitCmt: function () {
                if (!this.cmtContent) {
                    $.toast('说点什么吧');
                    return;
                }
                var _this = this;
                if (this.cmtPics && this.cmtPics.length > maxCmtImgNum) {
                    $.toast('上传的图片最多不能超过' + maxCmtImgNum + '张');
                    return;
                }
                $.showPreloader('正在处理');
                this.sortImgs();
                Vue.http.options.emulateJSON = false;
                var handoverBookComment = {
                    filePaths: this.cmtPics,
                    content: this.cmtContent,
                    pid: this.bo.id,
                    replyPid: this.cmtPid ? this.cmtPid : null
                };
                this.$http.post('/service/saveHandoverBookComment.action?token=' + Constant.token, {
                    handoverBookComment: handoverBookComment
                }).then(function (ret) {
                    Vue.http.options.emulateJSON = true;
                    $.hidePreloader();
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        $.toast('发表成功');
                        $('.cmt-bottom0').height('auto');
                        if (!_this.bo.comment) _this.bo.comment = [];
                        var data = ret.data.data.data;
                        //后台目前没有返回给我评论的图片，自己深拷贝一把
                        if (_this.cmtPics && _this.cmtPics.length > 0 && !data.filePaths) {
                            data.filePaths = [];
                            for (var i = 0; i < _this.cmtPics.length; i++) {
                                data.filePaths.push(_this.cmtPics[i]);
                            }
                        }
                        _this.bo.comment.push(data);
                        _this.cmtContent = '';
                        _this.cmtPid = null;
                        _this.cmtPics = [];
                        _this.closeCmtDialog();
                    } else {
                        $.toast('发表失败');
                    }
                });
            },
            /**
             * 给所有图片排序
             */
            sortImgs: function () {
                var _this = this;
                if (this.cmtPics && this.cmtPics.length > 0) {
                    this.cmtPics = [];
                    $('.cmt-bottom0 .cmtpic-container').find('img').each(function () {
                        _this.cmtPics.push(this.src);
                    });
                }
            },
            deleteCmt: function (cmts, id) {
                var _this = this;
                $.confirm('确定要删除这条评论吗？', function () {
                    _this.$http.post('/service/deleteHandoverBookCommentById.action', {
                        'handoverBookCommentId': id,
                        token: Constant.token
                    }).then(function (ret) {
                        if (ret.ok && ret.data && ret.data.result == 'ok') {
                            removeCmt(cmts, id);
                        } else {
                            $.toast('删除失败');
                        }
                    });
                }, function () {

                });
            },
            /**
             * 删除评论图片*/
            deleteCmtImg: function (cmtPics, index) {
                cmtPics.splice(index, 1);
            },
            beforeUpload: function (event) {
                if ($('.cmt-bottom0 .cmt-pic').length >= maxCmtImgNum) {
                    $.toast('上传的图片最多不能超过' + maxCmtImgNum + '张');
                    event.preventDefault();
                    event.stopPropagation();

                }
            },
            popActions: function (id, cmts) {
                var _this = this;
                var btns = [{
                    text: '删除',
                    onClick: function () {
                        _this.deleteCmt(cmts, id);
                    }
                }];
                $.actions([btns]);
                $('.modal-overlay.modal-overlay-visible').on('click', function () {
                    $.closeModal('.actions-modal');
                    $('.modal-overlay.modal-overlay-visible').off('click');
                });
            },
            closeCmtDialog: function () {
                this.showCommentModal = false;
            }
        }
    };

    function whohasread(users) {
        var unRead = [], read = [];
        for (var i = 0; i < users.length; i++) {
            if (users[i].isRead == 0) {
                unRead.push(users[i]);
            } else {
                read.push(users[i]);
            }
        }
        return {
            unRead: unRead,
            read: read
        };
    }

    /**
     * 删除一条评论
     * @param cmts
     * @param id
     */
    function removeCmt(cmts, id) {
        for (var i = 0; i < cmts.length; i++) {
            if (cmts[i].id == id) {
                break;
            }
        }
        cmts.splice(i, 1);
    }
</script>

<style>
    li {
        display: block;
    }

    .c-split-content{
        height:10px;
        background:#eee;
        width:100%;
    }

    .handover-detail .content {
        bottom: 40px;
        border: none;
        background: #eee;
    }

    .handover-detail .who-content ul li {
        display: inline-block;
    }

    .handover-detail .item-images li {
        display: inline-block;
        padding: 5px 10px 5px 0px;
    }

    .handover-detail .bar a.icon.icon-cross {
        color: #333;
    }

    .handover-detail .top-content {
        width: 100%;
        padding: 0px;
    }

    .handover-detail .top-text {
        border: none;
        background: #fff;
        width: 100%;
        padding: 5px 15px;
    }

    .handover-detail .img-content {
        position: relative;
        padding: 5px 15px;
        background: #fff;
    }

    .handover-detail .who-content {
        width: 100%;
        padding: 10px;
        background: #fff;
        clear: both;
        margin-top: 10px;
    }

    .handover-detail .sheet-content {
        margin-top: 0px;
    }

    .handover-detail .who-content table {
        margin: 0 auto;
        width: 100%;
        table-layout: fixed;
    }

    .handover-detail .no-content {
        color: #999;
        text-align: right;
    }

    .handover-detail .no-content.input {
        border: none;
        color: #333;
    }

    .handover-detail .wc-tip {
        width: 100px;
    }

    .handover-detail .item-li {
        padding: 10px 10px 0px 15px;
        display: block;
    }

    .handover-detail .sub-li {
        margin-top: 10px;
        padding-bottom: 10px;
        border-bottom: 1px dashed #ddd;
    }

    .handover-detail .sub-li:last-child {
        border: none;
    }

    .handover-detail .item-title {
        margin: 0px;
        display: inline-block;
    }

    .handover-detail .cic-title {
        width: 100%;
        height: 25px;
        position: relative;
    }

    .handover-detail .cic-flag {
        display: inline-block;
        position: absolute;
        width: 6px;
        height: 15px;
        background: #fa0;
        left: -15px;
        top: 3px;
    }

    .handover-detail .item-li ul {
        border-bottom: 1px solid #ddd;
    }

    .handover-detail .item-li:last-child ul {
        border-bottom: none;
    }

    .handover-detail .sub-textarea {

    }

    .handover-detail .sub-textarea .text {
        width: 100%;
        font-size: 14px;
    }

    .handover-detail .sub-content {
        margin-top: 5px;
        margin-bottom: 10px;
    }

    .handover-detail .f-panel {

    }

    .handover-detail .fp-left {
        width: 70px;
        float: left;
        position: relative;
    }

    .clearboth {
        clear: both;
    }

    .blank {
        height: 100px;
        width: 100%;
    }

    .splitor-f {
        color: #888;
    }

    .handover-detail .user-item {
        float: left;
        font-size: 14px;
        color: #444;
    }

    .handover-detail .item-container {
        width: 100%;
        padding: 0px;
        background: #fff;
    }

    .handover-detail .item-container-top {
        padding: 10px 10px 0px 0px;
    }

    .handover-detail .item-container-bottom {
        padding-top: 0px;
    }

    .handover-detail .item-container .item-left {
        width: 60px;
        float: left;
    }

    .handover-detail .item-content {
        clear: both;
    }

    .handover-detail .c-item-content {
        background: #fff;
        margin-top: 10px;
    }

    .handover-detail .user-name {
        font-size: 16px;
    }

    .handover-detail .time-name {
        color: #999;
        font-size: 12px;
        display: block;
    }

    .handover-detail .atme-name {
        color: #fa0;
        font-size: 12px;
        margin-right: 10px;
        height: 30px;
        line-height: 30px;
        float: left;
    }

    .handover-detail .reminder-name {
        color: #999;
        font-size: 12px;
    }

    .handover-detail .cmt-label {
        float: right;
        margin-right: 10px;
    }

    .handover-detail .cmt-label .cmt-num {
        color: #444;
        font-size: 16px;
    }

    .handover-detail .cmt-icon {
        background: url("../../../common/assets/imgs/cmt.png");
        display: inline-block;
        width: 16px;
        height: 16px;
        vertical-align: middle;
    }

    .handover-detail .item-footer {
        background: #fff;

    }

    .handover-detail .at-footer {
        height: 30px;
    }

    .handover-detail .footer-cmt {
        clear: both;
    }

    .handover-detail .cmt-panel {
        width: 100%;
        height: 100%;
        background: #f5f5f5;
        padding: 10px;
    }

    .handover-detail .dept-name {
        font-size: 12px;
        color: #999;
    }

    .handover-detail .item-images li {
        display: inline-block;
        padding: 0px 10px 0px 0px;
    }

    .handover-detail .item-left {
        width: 60px;
        float: left;
    }

    .handover-detail .item-right {
        width: 100%;
    }

    .handover-detail .item-content {
        clear: both;
        margin-left: 60px;
        margin-right: 10px;
    }

    .handover-detail .user-name {
        font-size: 14px;
    }

    .time-name {
        color: #999;
        font-size: 12px;
        display: block;
    }

    .all-content {
        color: #67b7d0;
        font-size: 14px;
    }

    .handover-detail .item-type {
        width: 100%;
        clear: both;
    }

    .handover-detail .type-name {
        color: #999;
        font-size: 12px;
    }

    .handover-detail .atme-name {
        color: #fa0;
        font-size: 12px;
        margin-right: 10px;
        height: 30px;
        line-height: 30px;
        float: left;
    }

    .handover-detail .af-at {
        height: 30px;
        line-height: 30px;
        float: left;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .handover-detail .reminder-name {
        color: #999;
        font-size: 12px;
    }

    .handover-detail .cmt-label {
        float: right;
        min-width: 50px;
        text-align: center;
        height: 30px;
        line-height: 30px;
    }

    .handover-detail .cmt-label .cmt-num {
        color: #444;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        display: inline-block;
    }

    .handover-detail .icon-comment {
        font-size: 18px;
        color: #666;
        vertical-align: middle;
        height: 30px;
        line-height: 30px;
    }

    .handover-detail .at-footer {
        height: 30px;
        line-height: 30px;
    }

    .handover-detail .footer-cmt {
        padding: 5px 0px;
        clear: both;
    }

    .handover-detail .dept-name {
        font-size: 12px;
        color: #999;
    }

    .handover-detail .delete-text-cmt {
        color: #aaa;
        font-size: 12px;
        width: 60px;
        text-align: right;
        display: inline-block;
        float: right;
    }


    .modal-ul {
        text-align: left;
    }

    .user-header-img {
        display: block;
        margin: 0 auto;
    }

    .dlg-username {
        width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        text-align: center;
        margin-top: 3px;
    }

    .dlg-time {
        color: #ccc;
        font-size: 12px;
        text-align: center;
    }
    .modal-ul li {
        display: inline-block;
        text-align: center;
        padding: 10px 5px 0px 5px;
    }

    .head-tab {
        justify-content: flex-start;
    }

    .buttons-tab.head-tab a.tab-link {
        top: 0px;
        height: 40px;
        line-height: 40px;
        color: #999;
        font-size: 14px;
    }

    .buttons-tab.head-tab .button.active {
        border-color: #f90;
        color: #fa0;
    }

    .userdlg-modal.modal .modal-ul {
        padding-top: 20px;
    }

    .dlgs-cmt {
        width: 100%;
        height: 100%;
    }

    .dlg-cmt {
        width: 100%;
    }

    .dlg-cmt.active {
        visibility: visible;
        position: absolute;
        bottom: 0px;
        z-index: 2002;
    }

    .dlg-cmt.active .cmt-bottom {
        border-radius: 3px;
        background: #fff;
        overflow: hidden;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        transition: .5s ease-in-out;
        opacity: 0;
        transform-style: preserve-3d;
        position: relative;
        height: 36px;
        line-height: 36px;
        position: relative;
        opacity: 1;
    }

    .cmt-bottom {
        height: 36px;
        line-height: 36px;
        width: 100%;
    }

    .cmt-bottom0 {
        position: absolute;
        bottom: 0px;
        border-top: 1px solid #ddd;
        background: #fff;
    }

    .handover-detail .cb-container {
        position: relative;
        width: 100%;
        height: auto;
    }
    .dlg-cmt.active ~ .overlay-cmt {
        opacity: 1;
        visibility: visible;
    }

    .overlay-cmt {
        content: "";
        position: absolute;
        visibility: hidden;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2001;
        opacity: 0;
        background: rgba(0, 0, 0, 0.5);
    }

    .handover-detail .cmt-textarea {
        width: calc(100% - 103px);
        float: left;
        height: 30px;
        margin-top: 3px;
        margin-left: 36px;
        border-radius: 4px;
        border: 1px solid #ddd;
        font-size: 14px;
        padding-top: 6px;
        line-height: 16px;
        overflow: hidden;
    }

    .handover-detail .button.button-fill.btn-send {
        width: 60px;
        height: 30px;
        line-height: 30px;
        position: absolute;
        right: 3px;
        bottom: 0px;
    }

    .cmt-item {
        padding: 2px 2px;
    }

    .cmt-content {
        font-size: 14px;
        word-wrap: break-word;
    }

    .cmt-content:active {
        background: #ccc;
    }

    .cmt-user {
        color: #1e8bc3;
    }

    .handover-detail .sub-title span {
        word-wrap: break-word;
    }

    .handover-detail .button.btn-addpic {
        height: 30px;
        line-height: 30px;
        width: 30px;
        padding: 0px;
        position: absolute;
        bottom: 0px;
        left: 3px;
    }

    .handover-detail .btn-addpic .add-pic {
        position: absolute;
        top: 0px;
        left: 0px;
        opacity: 0;
        font-size: 12px;
        width: 30px;
        height: 30px;
    }

    .handover-detail .cmtpic-container {
        position: absolute;
        top: -54px;
        left: 0px;
        min-height: 50px;
        width: 100%;
        background: #fff;
        border-radius: 4px;
        border: 1px solid #ddd;
        padding: 4px;
    }

    .handover-detail .cmt-pic {
        float: left;
        margin: 0 4px;
        width: 40px;
        height: 40px;
        margin-top: 5px;
        position: relative;
    }

    .handover-detail .icon-image {
        font-size: 20px;
        margin-top: 4px;
        display: inline-block;
        color: #999;
    }

    .handover-detail .cmtpic-container .delete-img, .cmt-pic .delete-img {
        position: absolute;
        top: -4px;
        right: -6px;
        background: #eee;
        border-radius: 8px;
        font-size: 12px;
        padding: 2px;
    }

    .handover-detail .checker-panel {

    }

    @media all and (max-width: 360px) {

    }
</style>
