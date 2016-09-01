<template>
    <div class="page-group handover" :transition="transitionName">
        <div class="container page page-current">
            <header class="bar bar-nav">
                <!--<button class="button button-link button-nav pull-right button-btn add-btn" v-on:click="back()">
                    返回
                </button>-->
                <h1 class='title'>工作圈(v1.3.1)</h1>
                <button class="button button-link button-nav pull-right button-btn add-btn" v-on:click="goToCreate()">
                    新增
                </button>
            </header>
            <div class="top-panel">
                <div class="search-bar">
                    <ul>
                        <li v-if="!hasSigleDep" class="search-li" v-bind:style="{width:layout.searchBarWidth+'px'}"
                            v-on:click="goToShoplist()">
                            <span class="search-label" v-show="!shopInfo.id">门店</span>
                            <span class="search-value" v-show="shopInfo.id">{{shopInfo.name}}</span>
                            <span class="icon-detail_down search-icon"></span>
                        </li>
                        <li class="search-li" v-bind:style="{width:layout.searchBarWidth+'px'}"
                            v-on:click="goToSearchDate()">
                            <span class="search-label" v-show="!search.dateTime">日期</span>
                            <span class="search-value search-time"
                                  v-show="search.dateTime">{{search.dateTime|getdate}}</span>
                            <span class="icon-detail_down search-icon"></span>
                        </li>
                        <li class="search-li" v-bind:style="{width:layout.searchBarWidth+'px'}"
                            v-on:click="goToUserlist()">
                            <span class="search-label" v-show="!userInfo.id">创建人</span>
                            <span class="search-value" v-show="userInfo.id">{{userInfo.name}}</span>
                            <span class="icon-detail_down search-icon"></span>
                        </li>
                        <li class="search-li search-li-other" v-bind:class="display.searchOther?'active':''"
                            v-bind:style="{width:layout.searchBarWidth+'px'}" v-on:click="toggleSearchPanel()">
                            <span class="search-label">筛选</span>
                            <span class=" search-icon"
                                  v-bind:class="display.searchOther?'icon-detail_up':'icon-detail_down'"></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="dataContent" class="content content-items pull-to-refresh-content infinite-scroll"
                 data-ptr-distance="55" data-distance="240">
                <div class="pull-to-refresh-layer">
                    <div class="preloader"></div>
                    <div class="pull-to-refresh-arrow"></div>
                </div>
                <div class="items-list devices-list">
                    <ul>
                        <li v-for="item in items" class="item-li" class="handover-li"
                            v-bind:class="(item.isAtMe==1 && !item.isRead)?'active':''">
                            <div class="item-container">
                                <div class="item-left">
                                    <div v-on:click="searchByUser(item.userId,item.userName)">
                                        <userhead v-bind:user="item"></userhead>
                                    </div>
                                </div>
                                <div class="item-right">
                                    <label class="user-name not-view"
                                           v-on:click="searchByUser(item.userId,item.userName)">{{item.userName}}</label>
                                    <span class="time-name">{{item.createTime.replace('T',' ')}}</span>
                                </div>
                                <div class="item-content">
                                    <div class="item-text">
                                        {{item.content&&item.content.length>140?(item.content.substring(0,140))+'...':item.content}}
                                    </div>
                                    <div class="item-images" index="{{$index}}">
                                        <ul>
                                            <li v-for="path in item.showPicPaths?item.showPicPaths:[] | limitBy 9"
                                                v-bind:class="(item.isAtMe==1 && !item.isRead)?'active':''">
                                                <div class="img-bg"
                                                     v-bind:style="{width:whichItemImgWidth(item)+'px',height:whichItemImgWidth(item)+'px'}">
                                                    <a class="pb-standalone listitem-pic" index="{{$index}}"> <img
                                                            class="not-view" v-bind:src="path+'_'"
                                                            width="{{whichItemImgWidth(item)}}px"
                                                            height="{{whichItemImgWidth(item)}}px"/></a></div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="item-type">
                                        <span class="type-name">{{item.moudleName}}</span>
                                    </div>
                                    <div class="item-footer">
                                        <span class="dept-name" v-show="item.isOpen==0">{{item.deptName}}</span>
                                        <span class="dept-name" v-show="item.isOpen==1">公开</span>
                                    </div>
                                    <div class="item-footer confirm-footer" v-show="item.isAtMe==1 && !item.isRead">
                                        <button class="button button-link button-nav button-fill button-orange btn-confirm"
                                                v-on:click="viewDetail(item)">
                                            点击确认已读
                                        </button>
                                    </div>
                                    <div class="item-footer at-footer"
                                         v-show="item.isAtMe==0 || (item.isAtMe == 1&& item.isRead==1)">
                                        <label class="atme-name" v-show="item.isAtMe==1">已读</label>

                                        <div class="af-at" v-on:click="whoRead(item)"
                                             v-show="item.reminderList && item.reminderList.length>0">
                                            <progress v-on:click="whoRead(item)" class="not-view"
                                                      v-bind:percent="item.reminderList && item.reminderList.length>0 && item.remindersReadCount/item.reminderList.length"
                                                      v-if="item.reminderList && item.reminderList.length>0"></progress>
                                            <label v-on:click="whoRead(item)" class="reminder-name not-view"
                                                   v-show="item.reminderList && item.reminderList.length>0">
                                                <span class="not-view"
                                                      v-show="item.reminderList && item.reminderList.length>item.remindersReadCount">{{(item.reminderList && item.reminderList.length ? item.reminderList.length:0)-(item.reminderList && item.remindersReadCount ? item.remindersReadCount:0)}}人未读</span>
                                                <span class="not-view"
                                                      v-show="item.reminderList && item.reminderList.length==item.remindersReadCount">全部已读</span>
                                            </label>
                                        </div>
                                        <div class="af-delete" v-if="curUser.id == item.userId">
                                            <span class="delete-text" @click="deleteItem(item.id)">删除</span>
                                        </div>
                                        <div class="view-details" v-on:click="viewDetail(item)">详情</div>
                                        <div class="cmt-label not-view" @click="doCmt(item)">
                                            <span class="icon-comment not-view"></span>
                                            <span class="cmt-num not-view">{{item.comment && item.comment.length || 0}}</span>
                                        </div>
                                    </div>
                                    <div class="item-footer footer-cmt not-view footer-cmt-{{item.id}}"
                                         v-if="item.comment && item.comment.length>0 && (item.isAtMe==0 || (item.isAtMe == 1&& item.isRead==1))">
                                        <div class="cmt-item not-view" v-for="cmt in item.comment">
                                            <div class="cmt-content not-view" @click="doCmt(item,cmt)">
                                                <span class="cmt-user not-view">{{cmt.userName}}</span>
                                                <span class="not-view" v-show="cmt.replyUserId">回复</span>
                                                <span v-show="cmt.replyUserId" class="cmt-user not-view">{{cmt.replyUserName}}</span>
                                                ：{{cmt.content}}
                                                <span v-if="cmt.showDelete" class="delete-text-cmt">删除</span>
                                            </div>
                                            <div class="cmt-pic" v-for="pic in cmt.filePaths">
                                                <a class="app-cmted-pic pb-standalone" index="{{$index}}"
                                                   parentIndex="{{$parent.$index}}"
                                                   itemIndex="{{$parent.$parent.$index}}">
                                                    <img width="40" height="40" v-bind:src="pic"/>
                                                </a>
                                            </div>
                                            <div class="clearboth"></div>
                                        </div>
                                    </div>
                                    <div class="item-footer footer-textarea footer-textarea-{{$index}} footer-textarea-id-{{item.id}} not-view"
                                         v-show="item.showCmtArea">
                                        <button class="not-view button button-link button-nav button-light btn-addpic"
                                                @click="beforeUpload($index,$event)">
                                            <span class="icon-image"></span>
                                            <input class="add-pic" index="{{$index}}" type="file" name="upload0"
                                                   multiple accept="image/*"/>
                                        </button>
                                        <textarea class="cmt-textarea not-view cmt-textarea-{{item.id}}"
                                                  placeholder="回复" v-model="item.cmtContent"></textarea>
                                        <button class="not-view button button-link button-nav button-fill button-orange btn-send"
                                                v-bind:class="item.cmtContent && item.cmtContent.length>0?'':'disabled'"
                                                v-on:click="submitCmt(item)">
                                            发送
                                        </button>
                                        <div class="cmtpic-container" v-show="item.cmtPics && item.cmtPics.length>0">
                                            <div class="cmt-pic" v-for="pic in item.cmtPics" track-by="$index">
                                                <a class="app-cmt-pic pb-standalone" index="{{$index}}"
                                                   parentIndex="{{$parent.$index}}">
                                                    <img v-bind:src="pic" width="40" height="40">
                                                </a>
                                                <span class="delete-img icon-cross"
                                                      v-on:click="deleteImg(item.cmtPics,$index)"></span>
                                            </div>
                                        </div>
                                        <div class="clearboth"></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="items-list no-data" v-show="display.nodata">
                    没有任何记录
                </div>
                <div class="infinite-scroll-preloader">
                    <div class="preloader"></div>
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
        <!--<div class="dlgs-cmt">
            <div class="dlg-cmt" v-show="showCommentModal" v-bind:class="{ 'active': showCommentModal}">
                <div class="cmt-bottom">
                    <textarea class="cmt-textarea" placeholder="回复" id="cmtInput" v-model="cmtContent"></textarea>
                    <button class="button button-link button-nav button-fill button-orange btn-send"
                            v-on:click="submitCmt()">
                        发送
                    </button>
                </div>
            </div>
            <div class="overlay-cmt" @click="closeCmtDialog()"></div>
        </div>-->
        <div class="search-panel popup popup-search">
            <div class="sp-item" v-on:click="searchAll()" v-bind:class="!isMe && !atMe?'active':''">
                <label class="sp-label">全部</label>
            </div>
            <div class="sp-item" v-on:click="searchIsMe()" v-bind:class="!!isMe?'active':''">
                <label class="sp-label">我创建的</label>
            </div>
            <div class="sp-item" v-on:click="searchAtMe()" v-bind:class="!!atMe?'active':''">
                <label class="item-title label">提到我的</label>
            </div>
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
    var FastClick = require('../../../common/libs/fastclick');
    var num = 10;//每页显示的条数
    var maxCmtImgNum = 3;//上传的评论图片max value
    var Vue = require('vue');
    module.exports = {
        route: {
            data: function (transition) {
                if (this.refreshInit) {
                    var _this = this;
                    $('#dataContent').scroller({
                        type: 'native'
                    });
                    if (Constant.needRefresh) {
                        this.$nextTick(function () {
                            $.pullToRefreshTrigger('#dataContent');
                        });
                        /*_this.getData('',{
                         page:{
                         index:0,
                         num:num
                         },
                         atMe:Constant.atMe,
                         isMe:Constant.isMe,
                         search:Constant.search,
                         shopInfo:Constant.shopInfo,
                         userInfo:Constant.userInfo
                         });*/
                    } else {
                        setTimeout(function(){
                            $('#dataContent')[0].scrollTop=Constant.layout.srcollTop;
                            $.locScroll($('#dataContent'));
                        }, 0);
                        /*this.$nextTick(function () {
                         setTimeout(function(){
                         document.getElementById('dataContent').scrollTo(0,Constant.layout.srcollTop);
                         },3000);
                         })*/
                    }
                }
                transition.next({
                    search: Constant.search,
                    userInfo: Constant.userInfo,
                    atMe: Constant.atMe,
                    isMe: Constant.isMe,
                    page: {
                        index: 0,
                        num: num
                    },
                    shopInfo: Constant.shopInfo
                });
            },
            activate: function (transition) {
                if (!transition.from.name) {
                    this.transitionName = 'show';
                } else {
                    this.transitionName = 'left';
                }
                if (Constant.hasGetAuth) {
                    this.$nextTick(function () {
                        transition.next();
                    })
                } else {
                    var _this = this;
                    this.getDeptAuth(function () {
                        _this.$nextTick(function () {
                            transition.next();
                        })
                    });
                }
            },
            deactivate: function (transition) {
                this.transitionName = 'left';
                this.hideSearchPanel();
                //this.unbindInfinite();
                //this.clearData();
                Constant.layout.srcollTop = $('#dataContent').scrollTop();
                transition.next();
            }
        },
        data: function () {
            return {
                transitionName: 'show',
                page: {
                    index: 0,
                    num: num,
                    total: 0
                },
                search: {
                    startTime: '',
                    endTime: '',
                    dateTime: ''
                },
                shopInfo: {
                    id: '',
                    name: ''
                },
                onlyShop: {//只有一家店权限门店
                    id: '',
                    name: ''
                },
                userInfo: {
                    id: '',
                    name: ''
                },
                layout: {
                    width: $('body').width(),
                    searchBarWidth: 70
                },
                atMe: 0,
                isMe: 0,
                hasSigleDep: true,
                display: {
                    nodata: false,
                    searchOther: false
                },
                curUser: {},//当前用户
                readUsers: [],
                unreadUsers: [],
                items: [],
                hasCreateToday: false,//今天是否已经创建过
                showModal: false,//是否打开对话框
                currentTabIndex: 0,//对话框中选择的选项卡
                showCommentModal: false,//是否显示评论的框
                cmtContent: '',//评论内容
                cmtPid: '',//评论的父id
                selectItem: {},//当前操作的记录
                itemImgWidth: 60,
                loading: false,
                refreshInit: false
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
            'whichopttext': function (state) {
                if (state) {
                    return '收起';
                } else {
                    return '全文';
                }
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
            init: function (opt) {
                var _this = this;
                if (!this.refreshInit) {
                    $('#dataContent').scroller({
                        type: 'native'
                    });
                    $.initPullToRefresh('#dataContent');
                    $(document).on('refresh', '#dataContent', function (e) {
                        _this.refresh();
                    });
                    this.refreshInit = true;
                    FastClick.attach(document.body);
                    $(document).on('input', '.handover .cmt-textarea', function () {
                        if (this.scrollHeight > 30) {
                            this.style.height = this.scrollHeight + 'px';
                        }
                    });
                    $(document).on('propertychange', '.handover .cmt-textarea', function () {
                        if (this.scrollHeight > 30) {
                            this.style.height = this.scrollHeight + 'px';
                        }
                    })
                }
                this.bindInfiniteEvent();
                this.getData('', opt);
            },
            reInitScroll: function () {
                this.unbindInfinite();
                this.bindInfiniteEvent();
            },
            unbindInfinite: function () {
                $.detachInfiniteScroll($('#dataContent'));
                $('#dataContent .infinite-scroll-preloader').hide();
            },
            bindInfiniteEvent: function () {
                var _this = this;
                $.attachInfiniteScroll($('#dataContent'));
                $('#dataContent .infinite-scroll-preloader').show();
                var func = function (e) {
                    if (_this.loading) return;
                    _this.page.index += _this.page.num;
                    _this.getData();
                };
                $(document).off('infinite', '#dataContent', func).on('infinite', '#dataContent', func);
            },
            bindPicEvent: function () {
                //点击时打开图片浏览器
                var photos = [];
                var _this = this;
                for (var i = 0; i < $('.footer-textarea .cmtpic-container').length; i++) {
                    dragula([$('.footer-textarea .cmtpic-container')[i]]);
                }
                $(document).off('change', '.handover .add-pic').on('change', '.handover .add-pic', function () {
                    var index = $(this).attr('index');
                    var $addImg = $(this).prev();
                    var _file = this;
                    var successNum = 0, fileNum = this.files.length;
                    var hasToMorePic = false;//是否上传了太多图片
                    var item = _this.items[index];
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
                                    if (!item.cmtPics) item.cmtPics = [];
                                    item.cmtPics.push(base64);
                                    if (successNum == fileNum) {
                                        $(_file).remove();
                                        //上传成功之后重置input
                                        $($addImg).parent().append('<input class="add-pic" index="' + index + '" name="upload0" type="file" multiple accept="image/*"/>');
                                    }
                                    //检测是否上传了太多的图片
                                    setTimeout(function () {
                                        if (!hasToMorePic) {
                                            if ($('.footer-textarea-' + index + ' .cmt-pic').length > maxCmtImgNum) {
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
                $(document).off('click', '.pb-standalone.app-cmt-pic').on('click', '.pb-standalone.app-cmt-pic', function (e) {
                    var index = $(this).attr('index');//当前图片组中查看的图片的索引
                    var parentIndex = $(this).attr('parentIndex');//当前选择查看的图片组的索引
                    photos = _this.items[parentIndex].cmtPics;
                    //获取当前点击的记录的图片信息
                    var myPhotoBrowserStandalone = $.photoBrowser({
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
                    e.stopPropagation();
                    return false;
                });
                //正文图片添加点击事件
                $(document).off('click', '.pb-standalone.listitem-pic').on('click', '.pb-standalone.listitem-pic', function (e) {
                    var index = $(this).attr('index');//当前图片组中查看的图片的索引
                    var parentIndex = $(this).parents('.item-images').attr('index');//当前选择查看的图片组的索引
                    photos = _this.items[parentIndex].showPicPaths;
                    //获取当前点击的记录的图片信息
                    var myPhotoBrowserStandalone = $.photoBrowser({
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
                    e.stopPropagation();
                    return false;
                });
                //评论图片添加点击事件
                $(document).off('click', '.pb-standalone.app-cmted-pic').on('click', '.pb-standalone.app-cmted-pic', function (e) {
                    var index = $(this).attr('index');//当前图片组中查看的图片的索引
                    var parentIndex = $(this).attr('parentIndex');//当前选择查看的图片组的索引
                    var itemIndex = $(this).attr('itemIndex');
                    photos = _this.items[itemIndex].comment[parentIndex].filePaths;
                    //获取当前点击的记录的图片信息
                    var myPhotoBrowserStandalone = $.photoBrowser({
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
                    e.stopPropagation();
                    return false;
                });
            },
            getDeptAuth: function (callback) {
                var _this = this;
                this.$http.post('/service/hasOneStoreAuth.action?token=' + Constant.token).then(function (ret) {
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        var data = ret.data.data;
                        if (data.hasAuth && data.dept) {
                            _this.onlyShop.id = Constant.shopInfo.id = _this.shopInfo.id = data.dept.id;
                            _this.onlyShop.name = Constant.shopInfo.name = _this.shopInfo.name = data.dept.name;
                            _this.hasSigleDep = true;
                            _this.layout.searchBarWidth = _this.layout.width / 3;
                        } else if (!data.hasAuth) {
                            _this.hasSigleDep = false;
                            _this.layout.searchBarWidth = _this.layout.width / 4;
                        }
                        _this.curUser = data.user;
                    }
                    Constant.hasGetAuth = true;
                    Constant.hasSigleDep = _this.hasSigleDep;
                    callback && callback();
                });
            },
            getData: function (callback, searchData) {
                var _this = this;
                this.loading = true;
                searchData = searchData ? searchData : this;
                this.$http.post('/service/queryAllHandoverBooks.action', {
                    startTime: searchData.search.startTime,
                    endTime: searchData.search.endTime,
                    userIds: searchData.userInfo.id,
                    deptIds: this.hasSigleDep ? '' : searchData.shopInfo.id,
                    isAtMe: searchData.atMe,
                    isMe: searchData.isMe,
                    index: searchData.page.index,
                    num: searchData.page.num,
                    token: Constant.token
                }).then(function (ret) {
                    _this.loading = false;
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        if (_this.page.index == 0) {
                            _this.items = ret.data.data.data;
                        } else {
                            _this.items = _this.items.concat(ret.data.data.data);
                        }
                        _this.hasCreateToday = ret.data.data.isExist;
                        _this.page.total = ret.data.data.total;
                        if (_this.page.total == 0) {
                            _this.display.nodata = true;
                        } else {
                            setTimeout(_this.bindPicEvent, 1000);
                            _this.display.nodata = false;
                        }
                        if (_this.page.total <= _this.items.length) {
                            _this.unbindInfinite();
                        } else {
                            _this.unbindInfinite();
                            if (!_this.infiniteInit) {
                                setTimeout(_this.reInitScroll, 500);
                            }
                        }
                        //$.refreshScroller();
                        callback && callback();
                    }
                });
            },
            clearData: function () {
                this.page.index = 0;
                this.items = [];
            },
            refresh: function () {
                this.page.index = 0;
                //this.items = [];
                this.unbindInfinite();
                this.getData(function () {
                    $.pullToRefreshDone('#dataContent');
                });
            },
            goToShoplist: function () {
                router.go({name: 'shoplist', params: {dowhich: 0}});
            },
            goToUserlist: function () {
                router.go({path: '/userlist'});
            },
            goToSearchDate: function () {
                router.go({path: '/searchdate'});
            },
            toggleSearchPanel: function () {
                if (!this.display.searchOther) {
                    $.popup('.popup-search');
                    this.display.searchOther = true;
                    var _this = this;
                    $('.popup-overlay.modal-overlay-visible').on('click', function () {
                        $.closeModal('.popup-search');
                        _this.display.searchOther = false;
                    });
                } else {
                    $.closeModal('.popup-search');
                    this.display.searchOther = false;
                    $('.popup-overlay.modal-overlay-visible').off('click');
                }
            },
            hideSearchPanel: function () {
                if (this.display.searchOther) {
                    $.closeModal('.popup-search');
                    this.display.searchOther = false;
                }
            },
            searchAll: function () {
                this.page.index = 0;
                Constant.atMe = this.atMe = 0;
                Constant.isMe = this.isMe = 0;
                this.userInfo.id = '';
                this.userInfo.name = '';
                this.toggleSearchPanel();
                this.getData();
            },
            searchIsMe: function () {
                this.page.index = 0;
                if (this.isMe == 0) {
                    Constant.isMe = this.isMe = 1;
                    Constant.atMe = this.atMe = 0;
                } else {
                    Constant.isMe = this.isMe = 0;
                }
                this.userInfo.id = '';
                this.userInfo.name = '';
                this.toggleSearchPanel();
                this.getData();
            },
            searchAtMe: function () {
                this.page.index = 0;
                if (this.atMe == 0) {
                    Constant.atMe = this.atMe = 1;
                    Constant.isMe = this.isMe = 0;
                } else {
                    Constant.atMe = this.atMe = 0;
                }
                this.toggleSearchPanel();
                this.getData();
            },
            viewAllContent: function (item, index) {
                var obj = Object.assign({}, item, {showAllContent: !item.showAllContent});
                this.items.$set(index, obj);
            },
            back: function () {
                window.webkit.messageHandlers.closeCurrentInterface.postMessage({
                    msg: 'hello wkwebview'
                });
            },
            goToCreate: function () {
                if (this.hasSigleDep) {//只有一家店权限的无需选择门店
                    router.go({name: 'create', params: {deptId: this.onlyShop.id}});
                } else {//多家门店权限的需要选择门店,现在改成直接进入创建界面
                    //router.go({name:'shoplist',params:{dowhich:1}});
                    if (this.shopInfo.id) {
                        router.go({name: 'create', params: {deptId: this.shopInfo.id}});
                    } else {
                        router.go({name: 'create', params: {deptId: 0}});
                    }
                }
            },
            viewDetail: function (item, $event) {
                //点击用户名、用户头像、图片，不会触发查看详情
                /*if($event && $event.srcElement.className.indexOf('not-view') > -1){
                 return false;
                 }*/
                //需要发送已读申请
                Constant.needReadMessage = (item.isAtMe == 1 && item.isRead == 0) ? true : false;
                item.isRead = 1;
                //查看详情
                router.go({name: 'detail', params: {id: item.id}});
            },
            /**
             * 通过用户搜索
             * */
            searchByUser: function (id, name) {
                return;
                this.userInfo.id = id;
                this.userInfo.name = name;
                this.page.index = 0;
                this.getData();
            },
            /**
             * 通过门店搜索
             * */
            searchByDep: function (id, name) {
                this.shopInfo.id = id;
                this.shopInfo.name = name;
                this.page.index = 0;
                this.getData();
            },
            /**
             * 通过时间搜索
             * */
            searchByDate: function (time) {
                this.search.dateTime = time.substring(0, 10);
                this.search.startTime = this.search.dateTime + " 00:00:00";
                this.search.endTime = this.search.dateTime + " 23:59:59";
                this.page.index = 0;
                this.getData();
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
                    //Vue.set(cmt,'showDelete',!cmt.showDelete);
                    this.popActions(cmt.id, item.comment);
                    return;
                }
                //this.showCommentModal = true;
                this.selectItem = item;
                var placeholderStr = '';
                if (cmt) {
                    placeholderStr = '回复 ' + cmt.userName;
                    Vue.set(item, 'cmtPid', cmt.id);
                    Vue.set(item, 'showCmtArea', true);
                } else {
                    placeholderStr = '回复';
                    Vue.set(item, 'cmtPid', null);
                    Vue.set(item, 'showCmtArea', !item.showCmtArea);
                }
                Vue.set(item, 'cmtContent', '');
                Vue.set(item, 'cmtPics', []);
                $('.cmt-textarea-' + item.id).attr('placeholder', placeholderStr);
                if (item.showCmtArea) {
                    $('.cmt-textarea-' + item.id).height(30);
                    setTimeout(function () {
                        var cmtHeight = $('.footer-cmt-' + item.id).height();//评论框区域的高度
                        $('#dataContent')[0].scrollTop = $('#dataContent')[0].scrollTop + cmtHeight + 35;
                        $.locScroll($('#dataContent'));
                    }, 0);
                }
                /* window.webview &&　window.webview.input("cmtInput");*/
                /*setTimeout(function(){
                 $('.cmt-textarea-'+item.id)[0].focus();
                 },500);*/
            },
            submitCmt: function (item) {
                if (!item.cmtContent) {
                    $.toast('说点什么吧');
                    return;
                }
                var _this = this;
                if (item.cmtPics && item.cmtPics.length > maxCmtImgNum) {
                    $.toast('上传的图片最多不能超过' + maxCmtImgNum + '张');
                    return;
                }
                this.sortImgs(item);
                $.showPreloader('正在处理');
                Vue.http.options.emulateJSON = false;
                var handoverBookComment = {
                    filePaths: item.cmtPics,
                    content: item.cmtContent,
                    pid: item.id,
                    replyPid: item.cmtPid ? item.cmtPid : null
                };
                this.$http.post('/service/saveHandoverBookComment.action?token=' + Constant.token, {
                    handoverBookComment: handoverBookComment
                }).then(function (ret) {
                    Vue.http.options.emulateJSON = true;
                    $.hidePreloader();
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        $.toast('发表成功');
                        if (!item.comment) item.comment = [];
                        var data = ret.data.data.data;
                        //后台目前没有返回给我评论的图片，自己深拷贝一把
                        if (item.cmtPics && item.cmtPics.length > 0 && !data.filePaths) {
                            data.filePaths = [];
                            for (var i = 0; i < item.cmtPics.length; i++) {
                                data.filePaths.push(item.cmtPics[i]);
                            }
                        }
                        item.comment.push(data);
                        item.cmtContent = '';
                        item.cmtPid = null;
                        item.showCmtArea = false;
                        _this.closeCmtDialog();
                    } else {
                        $.toast('发表失败');
                    }
                });
            },
            /**
             * 给所有图片排序
             */
            sortImgs: function (item) {
                var _this = this;
                if (item.cmtPics && item.cmtPics.length > 0) {
                    item.cmtPics = [];
                    $('.footer-textarea-id-' + item.id + ' .cmtpic-container').find('img').each(function () {
                        item.cmtPics.push(this.src);
                    });
                }
            },
            deleteItem: function (id) {
                var _this = this;
                $.confirm('确定要删除这条记录吗？', function () {
                    _this.$http.post('/service/deleteHandoverBookById.action', {
                        'handoverBookId': id,
                        token: Constant.token
                    }).then(function (ret) {
                        if (ret.ok && ret.data && ret.data.result == 'ok') {
                            _this.page.index = 0;
                            _this.items = [];
                            _this.getData();
                        } else {
                            $.toast('删除失败');
                        }
                    });
                }, function () {

                });
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
             * 弹出删除评论的层
             * */
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
            beforeUpload: function (index, event) {
                if ($('.footer-textarea-' + index + ' .cmt-pic').length >= maxCmtImgNum) {
                    $.toast('上传的图片最多不能超过' + maxCmtImgNum + '张');
                    event.preventDefault();
                    event.stopPropagation();

                }
            },
            /**
             * 删除评论图片
             * */
            deleteImg: function (cmtPics, index) {
                cmtPics.splice(index, 1);
            },
            closeCmtDialog: function () {
                this.showCommentModal = false;
            },
            closeUserDialog: function () {
                this.showModal = false;
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
    html {
        height: 100%;
    }

    body {
        height: 100%;
        color: #333;
    }

    .handover.page-group.show-transition, .handover.page-group.left-transition {
        z-index: initial;
        /* -webkit-transform: translate3d(0, 0, 0);*/
    }

    ul {
        list-style: none;
        padding: 0px;
        margin: 0px;
    }

    #dataContent {
        overflow-x: hidden;
        top: 36px;
        z-index: 4;
        background: #eee;
    }

    header.bar, .content {
        background: #fff;
    }

    .search-bar {
        width: 100%;
        background: #fff;
    }

    .search-bar ul {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .search-li {
        height: 36px;
        line-height: 36px;
        padding: 0px 4px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .search-li:active, .search-li.active .search-label, .search-li.active .search-icon {
        color: #fa0;
    }

    .search-li:after {
        content: '';
        position: absolute;
        width: 1px;
        background: #ddd;
        height: 26px;
        top: 5px;
        right: 0px;
    }

    .search-li:last-child:after {
        width: 0px;
    }

    .search-label {
        color: #666;
    }

    .search-value {
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
    }

    .search-li span {
        vertical-align: middle;
        font-size: 14px;
    }

    /*.search-li span.search-time{
        font-size: 12px;
    }*/
    .search-icon {
        color: #666;
        margin-left: 2px;
    }

    .top-panel {
        background: #eee;
        font-size: 14px;
        position: absolute;
        top: 2.2rem;
        width: 100%;
        z-index: 5;
        padding-bottom: 4px;
    }

    .bar .button-link.button-btn.add-btn {
        color: #f90;
    }

    #dataContent .items-list {

    }

    #dataContent .items-list li {
        border: none;
        margin-top: 8px;
        background: #fff;
        padding: 10px 0px;
    }

    #dataContent .items-list li.active {
        background: #ffe9bd;
    }

    #dataContent .item-container {
        width: 100%;
    }

    #dataContent .item-left {
        width: 60px;
        float: left;
    }

    #dataContent .item-right {
        width: 100%;
    }

    #dataContent .item-content {
        clear: both;
        margin-left: 60px;
        margin-right: 10px;
    }

    #dataContent .user-name {
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

    .handover .view-details {
        color: #1e8bc3;
        font-size: 14px;
        float: right;
        height: 30px;
        width: 40px;
        line-height: 30px;
        text-align: center;
    }

    .handover .delete-text {
        color: #1e8bc3;
        font-size: 14px;
        width: 60px;
        text-align: left;
        display: inline-block;
    }

    .handover .delete-text-cmt {
        color: #aaa;
        font-size: 12px;
        width: 60px;
        text-align: right;
        display: inline-block;
        float: right;
    }

    .handover .item-type {
        width: 100%;
        clear: both;
    }

    .handover .type-name {
        color: #999;
        font-size: 12px;
    }

    .handover .atme-name {
        color: #fa0;
        font-size: 12px;
        margin-right: 10px;
        height: 30px;
        line-height: 30px;
        float: left;
    }

    .handover .af-at {
        height: 30px;
        line-height: 30px;
        float: left;
        margin-right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .handover .af-delete {
        float: left;
    }

    .handover .reminder-name {
        color: #999;
        font-size: 12px;
    }

    .handover .cmt-label {
        float: right;
        min-width: 50px;
        text-align: center;
        height: 30px;
        line-height: 30px;
    }

    .handover .cmt-label .cmt-num {
        color: #444;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        display: inline-block;
    }

    .handover .cmt-icon {
        background: url("../../../common/assets/imgs/cmt.png");
        display: inline-block;
        width: 16px;
        height: 16px;
        vertical-align: middle;
    }

    .handover .icon-comment {
        font-size: 18px;
        color: #666;
        vertical-align: middle;
        height: 30px;
        line-height: 30px;
    }

    .handover .at-footer {
        height: 30px;
        line-height: 30px;
    }

    .handover .footer-cmt {
        padding: 5px;
        background: #eee;
        clear: both;
    }

    #dataContent .dept-name {
        font-size: 12px;
        color: #999;
    }

    .no-data {
        text-align: center;
        width: 100%;
        color: red;
        padding: 5px 0px;
        background: #fff;
        margin-top: 5px;
    }

    .popup-overlay, .handover .popup {
        top: 80px;
    }

    .popup-overlay {
        height: calc(100% - 80px);
    }

    .search-panel {
        padding: 10px;
        padding-top: 0px;
        background: #fcfcfc;
        height: auto;
    }

    .handover .sp-item {
        padding: 10px;
        border-bottom: 1px solid #eee;
    }

    .handover .sp-item input[type=checkbox] {
        width: 16px;
        height: 16px;
        margin-right: 10px;
    }

    .handover .sp-item.active {
        background: #fff;
        color: #fa0;
    }

    .handover .item-icon {
        font-size: 16px;
        margin-right: 10px;
        color: #888;
    }

    #dataContent .item-images li {
        display: inline-block;
        padding: 0px 10px 0px 0px;
    }

    .bar a.icon.icon-cross {
        color: #333;
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
        z-index: 2001;
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

    .cmt-textarea {
        width: 160px;
        width: calc(100% - 80px);
        float: left;
        height: 30px;
        margin-top: 3px;
        margin-left: 10px;
        border-radius: 4px;
        border: 1px solid #ddd;
        font-size: 14px;
        padding-top: 6px;
        line-height: 16px;
        overflow: hidden;
    }

    .handover .footer-textarea {
        position: relative;
    }

    .item-footer .cmt-textarea {
        width: calc(100% - 70px);
        margin-left: 0px;
    }

    .item-footer .div-textarea {
        width: calc(100% - 80px);
        float: left;
        min-height: 30px;
        margin-top: 3px;
        margin-left: 10px;
        border-radius: 4px;
        border: 1px solid #ddd;
        font-size: 14px;
        padding-top: 6px;
        line-height: 16px;
        word-wrap: break-word;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-user-modify: read-write-plaintext-only;
        outline: 0;
        -webkit-user-select: text;
    }

    .button.button-fill.btn-send {
        width: 60px;
        height: 30px;
        line-height: 30px;
    }

    .handover .footer-textarea .button.button-fill.btn-send {
        position: absolute;
        right: 0px;
        bottom: 0px;
    }

    .handover .button.btn-addpic {
        position: absolute;
        left: -35px;
        bottom: 0px;
        height: 30px;
        line-height: 30px;
        width: 30px;
        padding: 0px;
    }

    .handover .btn-addpic .add-pic {
        position: absolute;
        top: 0px;
        left: 0px;
        opacity: 0;
        font-size: 12px;
        width: 30px;
        height: 30px;
    }

    .handover .cmtpic-container {
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

    .handover .cmt-pic {
        float: left;
        margin: 0 4px;
        width: 40px;
        height: 40px;
        margin-top: 5px;
        position: relative;
    }

    .handover .icon-image {
        font-size: 20px;
        margin-top: 4px;
        display: inline-block;
        color: #999;
    }

    .handover .delete-img, .cmt-pic .delete-img {
        position: absolute;
        top: -4px;
        right: -6px;
        background: #eee;
        border-radius: 8px;
        font-size: 12px;
        padding: 2px;
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

    .handover .img-bg {
        background: #eee;
    }

    .clearboth {
        clear: both;
    }

    .handover .button.btn-confirm {
        height: 24px;
        line-height: 24px;
        margin-top: 3px;
        font-size: 12px;
        width: 100%;
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
