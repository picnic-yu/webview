<template>
    <div class="page-group handover" :transition="transitionName">
        <div class="container page page-current">
            <header class="bar bar-nav">
                <h1 class='title' @click="showVersion()">工作圈</h1>
                <span class="pull-left icon-back" v-on:click="backTo()" v-if="showBackBtn==1"></span>
                <button class="button button-link button-nav pull-right button-btn add-btn" v-on:click="goToCreate()">
                    新增
                </button>
            </header>
            <div class="top-panel">
                <div class="search-bar">
                    <ul>
                        <li v-if="!hasSigleDep" class="search-li" v-bind:style="{width:layout.searchBarWidth+'px'}"
                            v-on:click="searchUnDo()">
                            <i class="icon-square" v-show="!isMeUnsolve"></i>
                            <i class="icon-square-checked" v-show="!!isMeUnsolve"><label class="path1"></label><label class="path2"></label></i>
                            <span class="search-label todo-label">待办</span>
                            <span class="notdo-num" v-show="notdoNumber > 0">{{notdoNumber}}</span>
                        </li>
                        <li class="search-li" v-bind:style="{width:layout.searchBarWidth+'px'}"
                            v-on:click="searchIsMe()" >
                            <i class="icon-square" v-show="!isMe"></i>
                            <i class="icon-square-checked" v-show="!!isMe"><label class="path1"></label><label class="path2"></label></i>
                            <span class="search-label todo-label">我创建的</span>
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
                                    <div class="item-text" v-show="item.contentFormatFlag==0">
                                        {{item.content&&item.content.length>140?(item.content.substring(0,140))+'...':item.content}}
                                    </div>
                                    <div class="item-text" v-show="item.contentFormatFlag==1">
                                        <span v-for="cf in item.contentFormatArray" class="content-format" track-by="$index">
                                            <span v-if="cf.indexOf('WDZ_HREF')>-1" class="inner-format"><a @click.stop="openLink(cf)" href="javascript:void(0)">{{cf.replace("WDZ_HREF",'')}}</a></span>
                                            <span v-else>{{cf}}</span>
                                        </span>
                                    </div>
                                    <div class="item-images" index="{{$index}}">
                                        <ul>
                                            <li v-for="pic in item.showPics?item.showPics:[] | limitBy 9"
                                                v-bind:class="(item.isAtMe==1 && !item.isRead)?'active':''">
                                                <div class="img-bg"
                                                     v-bind:style="whichImgContainerSize(item,pic)">
                                                    <a class="pb-standalone listitem-pic" index="{{$index}}"> <img
                                                            class="not-view" v-bind:src="pic.url+'_'"
                                                            v-bind:style="whichImgSize(item,pic)"/></a></div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="item-type">
                                        <span class="type-name">{{item.moudleName}}</span>

                                        <div class="other-list">
                                            <div class="af-at" v-on:click="whoPassed(item)"
                                                 v-show="item.performerPassList && item.performerPassList.length>0">
                                                <progress v-on:click="whoPassed(item)" class="not-view"
                                                          v-bind:percent="item.performerPassList && item.performerPassList.length>0 && item.performerPassCount/item.performerPassList.length"
                                                          v-if="item.performerPassList && item.performerPassList.length>0"></progress>
                                                <label v-on:click="whoPassed(item)" class="reminder-name not-view"
                                                       v-show="item.performerPassList && item.performerPassList.length>0">
                                                <span class="not-view"
                                                      v-show="item.performerPassList && item.performerPassList.length>item.performerPassCount">{{item.performerPassCount}}人完成</span>
                                                <span class="not-view state-3"
                                                      v-show="item.performerPassList && item.performerPassList.length==item.performerPassCount">全部完成</span>
                                                </label>
                                            </div>
                                            <div class="spot-state state-{{item.spotState}}" v-show="!(item.performerPassList && item.performerPassList.length==item.performerPassCount)">
                                                {{item.spotState|whichstate}}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="item-footer">
                                        <span class="dept-name" v-show="item.isOpen==0">{{item.deptName}}</span>
                                        <span class="dept-name" v-show="item.isOpen==1">公开</span>
                                    </div>
                                    <div class="item-footer confirm-footer" v-show="item.isRead == 0">
                                        <button class="button button-link button-nav button-fill button-orange btn-confirm"
                                                v-on:click="viewDetail(item,$index)">
                                            点击确认已读
                                        </button>
                                    </div>
                                    <div class="item-footer at-footer"
                                         v-show="item.isRead != 0">
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
                                        <div class="af-delete" v-if="item.canDelete==1">
                                            <span class="delete-text" @click="deleteItem(item.id)">删除</span>
                                        </div>
                                        <div class="view-details" v-on:click="viewDetail(item,$index)">详情</div>
                                        <div class="cmt-label not-view" @click="doCmt(item)">
                                            <span class="icon-comment not-view"></span>
                                            <span class="cmt-num not-view">{{item.comment && item.comment.length || 0}}</span>
                                        </div>
                                    </div>
                                    <div class="item-footer footer-cmt not-view footer-cmt-{{item.id}}"
                                         v-if="item.comment && item.comment.length>0 && item.isRead != 0">
                                        <div class="cmt-item not-view" v-for="cmt in item.comment">
                                            <div class="cmt-content not-view" @click="doCmt(item,cmt)">
                                                <span class="cmt-user not-view">{{cmt.userName}}</span>
                                                <span class="not-view" v-show="cmt.replyUserId">回复</span>
                                                <span v-show="cmt.replyUserId" class="cmt-user not-view">{{cmt.replyUserName}}</span>
                                                <span v-show="cmt.contentFormatFlag==0">：{{cmt.content}}</span>
                                                <span class="" v-show="cmt.contentFormatFlag==1">
                                                    ：<span v-for="cf in cmt.contentFormatArray" class="content-format" track-by="$index">
                                                        <span v-if="cf.indexOf('WDZ_HREF')>-1" class="inner-format"><a @click.stop="openLink(cf)" href="javascript:void(0)">{{cf.replace("WDZ_HREF",'')}}</a></span>
                                                        <span v-else>{{cf}}</span>
                                                    </span>
                                                </span>
                                                <span v-if="cmt.showDelete" class="delete-text-cmt">删除</span>
                                            </div>
                                            <div class="cmt-pic" v-for="pic in cmt.showPics">
                                                <a class="app-cmted-pic pb-standalone" index="{{$index}}"
                                                   parentIndex="{{$parent.$index}}"
                                                   itemIndex="{{$parent.$parent.$index}}">
                                                    <img v-bind:style="whichCmtImgSize(pic)" v-bind:src="pic.url+'_'"/>
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
                                            <input class="add-pic" index="{{$index}}" type="file" name="upload0" v-show="!isAndroid"
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
                                            <div class="cmt-pic cmt-pic-local" v-for="pic in item.cmtShowPics" track-by="$index">
                                                <a class="app-cmt-pic pb-standalone" index="{{$index}}"
                                                   parentIndex="{{$parent.$index}}">
                                                    <img v-bind:src="pic.url" v-bind:style="whichCmtImgSize(pic)">
                                                </a>
                                                <span class="delete-img icon-cross"
                                                      v-on:click="deleteImg(item,$index)"></span>
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
            <modal-dialog v-bind:show-modal.sync="showPassedModal">
                <header class="dialog-header" slot="header">
                    <div class="buttons-tab head-tab">
                        <a class="button  tab-link active" v-on:click="selectPassedTabIndex(0)"
                           v-bind:class="currentPassedTabIndex==0?'active':''">未完成的({{unpassedUsers.length}})</a>
                        <a class="button  tab-link" v-on:click="selectPassedTabIndex(1)"
                           v-bind:class="currentPassedTabIndex==1?'active':''">已完成的({{passedUsers.length}})</a>
                    </div>
                </header>
                <div class="dialog-body" slot="body">
                    <div class="tabs">
                        <div class="tab active" id="passtab1">
                            <ul class="modal-ul">
                                <li v-for="user in unpassedUsers">
                                    <userhead v-bind:user="user"></userhead>
                                    <div class="dlg-username">{{user.userName}}</div>
                                </li>
                            </ul>
                        </div>
                        <div class="tab" id="passtab2">
                            <ul class="modal-ul">
                                <li v-for="user in passedUsers">
                                    <userhead v-bind:user="user"></userhead>
                                    <div class="dlg-username">{{user.userName}}</div>
                                    <div class="dlg-time">{{user.passTime | whichreadtime}}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </modal-dialog>
        </div>
        <div class="search-panel popup popup-search">
            <div class="sp-item" v-on:click="searchAll()" v-bind:class="!isMe && !atMe?'active':''">
                <label class="sp-label">全部</label>
            </div>
            <div v-if="!hasSigleDep" class="sp-item"  v-on:click="goToShoplist()">
                <span class="search-label" v-show="!shopInfo.id">门店</span>
                <span class="search-value panel-value" v-show="shopInfo.id">{{shopInfo.name}}</span>
                <span class="icon-pre"></span>
            </div>
            <div class="sp-item" v-on:click="goToUserlist()">
                <span class="search-label" v-show="!userInfo.id">创建人</span>
                <span class="search-value panel-value" v-show="userInfo.id">{{userInfo.name}}</span>
                <span class="icon-pre"></span>
            </div>
            <div class="sp-item" v-on:click="whichTemplate()">
                <span class="search-label" v-show="!module.id">类型</span>
                <span class="search-value panel-value" v-show="module.id">{{module.name}}</span>
                <span class="icon-pre"></span>
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
    var utils = require('../utils');
    var FastClick = require('../../../common/libs/fastclick');
    var num = 10;//每页显示的条数
    var clickShowVesionNum = 0;//点击多少次标题栏，用于查看版本
    var clickTimer = null;
    var maxCmtImgNum = 3;//上传的评论图片max value
    var Vue = require('vue');
    var clickIndex = -1;//当前点击的记录index
    module.exports = {
        route: {
            data: function (transition) {
                if (this.refreshInit) {
                    var _this = this;
                    $('#dataContent').scroller({
                        type: 'native'
                    });
                    this.getUnsolveCount();//每次回到该页面时刷新以下代办的个数
                    if (Constant.needRefresh) {
                        Constant.atMe = 0;
                        this.$nextTick(function () {
                            $.pullToRefreshTrigger('#dataContent');
                            $('.popup-search').hide();//隐藏pop对话框
                        });
                    } else {
                        setTimeout(function(){
                            //滚动到原来的地方
                            $('#dataContent')[0].scrollTop=Constant.layout.srcollTop;
                            $.locScroll($('#dataContent'));
                            _this.refreshCmts();
                            $('.popup-search').hide();//隐藏pop对话框
                        }, 0);
                    }
                }
                transition.next({
                    search: Constant.search,
                    userInfo: Constant.userInfo,
                    module: Constant.module,
                    atMe: Constant.atMe,
                    isMe: Constant.isMe,
                    isMeUnsolve:Constant.isMeUnsolve,
                    page: {
                        index: Constant.needRefresh ? 0 : this.page.index,//防止查看详情返回后页面不刷新却清除了index
                        num: num
                    },
                    shopInfo: Constant.shopInfo
                });
            },
            activate: function (transition) {
                this.registGalleryEvent();
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
            canDeactivate: function (transition) {
                var _this = this;
                if (this.display.searchOther) {
                    setTimeout(function () {
                        _this.$nextTick(function () {
                            transition.next();
                            _this.hideSearchPanel();
                        })
                    }, 410);
                } else {
                    transition.next();
                }
            },
            deactivate: function (transition) {
                this.transitionName = 'left';
                //this.unbindInfinite();
                //this.clearData();
                Constant.layout.srcollTop = $('#dataContent').scrollTop();
                Constant.detail.id = '';
                Constant.detail.hasSubmitCmt = false;
                transition.next();
            }
        },
        data: function () {
            return {
                transitionName: 'show',
                isAndroid:$.device.android&&Constant.gallery==1,
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
                module: {
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
                isMeUnsolve:0,
                hasSigleDep: true,
                display: {
                    nodata: false,
                    searchOther: false
                },
                curUser: {},//当前用户
                readUsers: [],
                unreadUsers: [],
                passedUsers: [],
                unpassedUsers: [],
                items: [],
                hasCreateToday: false,//今天是否已经创建过
                showModal: false,//是否打开对话框
                showPassedModal: false,//是否打开完成人的对话框
                currentTabIndex: 0,//对话框中选择的选项卡
                currentPassedTabIndex: 0,//对话框中选择的选项卡
                showCommentModal: false,//是否显示评论的框
                cmtContent: '',//评论内容
                cmtPid: '',//评论的父id
                selectItem: {},//当前操作的记录
                itemImgWidth: 60,
                loading: false,
                refreshInit: false,
                notdoNumber:0,//代办记录数
                showBackBtn: Constant.showBackBtn
            }
        },
        components: {
            'progress': require('../components/Progress.vue'),
            'modal-dialog': require('../components/ReadUserDialog.vue'),
            'userhead': require('../components/UserHead.vue')
        },
        watch:{
            notdoNumber:function(newValue,oldValue){
                if(newValue != oldValue){
                    if(this.isMeUnsolve){//如果待办数变了，切选择了代办的条件，则刷新列表
                        $('#dataContent')[0].scrollTop = 0;
                        $.pullToRefreshTrigger('#dataContent');
                    }
                }
            },
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
            },
            'whichstate': function (state) {
                if (state == 0) return "未处理";
                if (state == 1) return "待审批";
                if (state == 2) return "未通过";
                if (state == 3) return "已完成";
            },
            'formatcontent':function(item){
                
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            /**
             * 计算每张图片的大小
             * */
            whichImgContainerSize: function (item,pic) {
                var defaultWidth = this.layout.width - 70 - 30,
                        defaultWidthX = this.layout.width - 70 - 10,
                        defaultWidthL = (this.layout.width - 70)/ 2;
                var size;
                if (!item.showPics) {
                    return 0;
                } else if (item.showPics.length == 1) {
                    size = utils.computeSigleImgWH(pic.width,pic.height,defaultWidth,defaultWidthX,defaultWidthL);
                } else if (item.showPics.length == 4 || item.showPics.length == 2) {
                    size = utils.computeImgWH(pic.width,pic.height,4,defaultWidth-30);
                } else {
                    size = utils.computeImgWH(pic.width,pic.height,9,defaultWidthX);
                }
                return {
                    width:size.pw+'px',
                    height:size.ph+'px'
                };
            },
            whichImgSize: function (item,pic) {
                var defaultWidth = this.layout.width - 70 - 30,
                        defaultWidthX = this.layout.width - 70 - 10,
                        defaultWidthL = (this.layout.width - 70)/ 2;
                var size;
                if (!item.showPics) {
                    return 0;
                } else if (item.showPics.length == 1) {
                    size = utils.computeSigleImgWH(pic.width,pic.height,defaultWidth,defaultWidthX,defaultWidthL);
                } else if (item.showPics.length == 4 || item.showPics.length == 2) {
                    size = utils.computeImgWH(pic.width,pic.height,4,defaultWidth-30);
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
                var totalWidth = 130;
                var size = utils.computeImgWH(pic.width,pic.height,9,totalWidth);
                return {
                    width:size.w+'px',
                    height:size.h+'px',
                    webkitTransform:'translate('+size.offsetX+'px,'+size.offsetY+'px)'
                };
            },
            showVersion: function () {
                clearTimeout(clickTimer);
                if (clickShowVesionNum >= 2) {
                    $.toast('当前工作圈版本V2.2.1');
                    clickShowVesionNum = 0;
                } else {
                    clickShowVesionNum++;
                    clickTimer = setTimeout(function () {
                        clickShowVesionNum = 0;
                    }, 1000);
                }
            },
            backTo: function () {
                if ($.device.android) {
                    window.webview && window.webview.closeCurrentInterface();
                } else if ($.device.ios) {
                    if (Constant.isWKWebView == 1) {
                        try {
                            window.webkit.messageHandlers.closeCurrentInterface.postMessage(1);
                        } catch (e) {
                        }
                    } else {
                        try {
                            closeCurrentInterface();
                        } catch (e) {
                        }
                    }
                } else {

                }
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
            init: function (opt) {
                var _this = this;
                this.webviewReady();
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
                    });
                }
                
                this.bindInfiniteEvent();
                this.getUnsolveCount();
                this.getData('', opt);
            },
            //注册安卓相册事件
            registGalleryEvent:function(){
                var _this = this;
                window.receiveGalleryData = function (base64,width,height) {
                    base64 = 'data:image/png;base64,'+base64;
                    if(clickIndex >= 0){
                        var item = _this.items[clickIndex];
                        if (!item.cmtPics) item.cmtPics = [];
                        item.cmtPics.push(base64);
                        if (!item.cmtShowPics) item.cmtShowPics = [];
                        item.cmtShowPics.push({
                            url:base64,
                            width:width,
                            height:height
                        });
                    }
                };
            },
            refreshCmts:function () {
                var index = Constant.detail.index;
                if(!Constant.detail.hasSubmitCmt) return;
                if(!this.items[index]) return;
                if(this.items[index].id != Constant.detail.id) return;
                var _this = this;
                this.$http.post('/service/getCommentsByHandoverBookId.action?token=' + Constant.token,{
                    handoverBookId:Constant.detail.id
                }).then(function (ret) {
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        var data = ret.data.data;
                        _this.items[index].comment = data.data;

                    }
                    Constant.detail.hasSubmitCmt = false;
                });
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
                                done: function (file, base64,img) { // 这里是异步回调，done中i的顺序不能保证
                                    //console.log('多张: ' + i + ' 压缩成功...'+file.length+","+base64.length);
                                    successNum++;
                                    if (!item.cmtPics) item.cmtPics = [];
                                    item.cmtPics.push(base64);
                                    if (!item.cmtShowPics) item.cmtShowPics = [];
                                    item.cmtShowPics.push({
                                        url:base64,
                                        width:img.width,
                                        height:img.height
                                    });
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
                    utils.longTapEvent.bind($('.photo-browser')[0]);
                    e.stopPropagation();
                    return false;
                });
                //正文图片添加点击事件
                $(document).off('click', '.pb-standalone.listitem-pic').on('click', '.pb-standalone.listitem-pic', function (e) {
                    var index = $(this).attr('index');//当前图片组中查看的图片的索引
                    var parentIndex = $(this).parents('.item-images').attr('index');//当前选择查看的图片组的索引
                    photos = _this.items[parentIndex].showPicPaths;
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
                    utils.longTapEvent.bind($('.photo-browser')[0]);
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
                    utils.longTapEvent.bind($('.photo-browser')[0]);
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
                        } else if (!data.hasAuth) {
                            _this.hasSigleDep = false;
                        }
                        _this.layout.searchBarWidth = _this.layout.width / 3;
                        Constant.curUser = _this.curUser = data.user;
                    }
                    Constant.hasGetAuth = true;
                    Constant.hasSigleDep = _this.hasSigleDep;
                    callback && callback();
                });
            },
            getUnsolveCount: function (callback, searchData) {
                var _this = this;
                this.$http.post('/service/getUnsolveCount.action?token='+Constant.token).then(function (ret) {
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        _this.notdoNumber = ret.data.data.data;
                    }
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
                    isMeUnsolve:searchData.isMeUnsolve,
                    moudleId: searchData.module.id,
                    index: searchData.page.index,
                    num: searchData.page.num,
                    token: Constant.token
                }).then(function (ret) {
                    _this.loading = false;
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        var resData = ret.data.data.data;
                        //格式化文本中的超连接
                        for(var i=0;i<resData.length;i++){
                            utils.formatHyperLink(resData[i],resData[i].content);
                            if(resData[i].comment && resData[i].comment.length > 0){
                                for(var j=0;j<resData[i].comment.length;j++){
                                    utils.formatHyperLink(resData[i].comment[j],resData[i].comment[j].content);
                                }
                            }
                        }
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
                router.go({name: 'userlist', params: {dowhich: 0}});
            },
            whichTemplate: function () {
                router.go({name: 'templates', params: {dowhich: 0}});
            },
            goToSearchDate: function () {
                router.go({name: 'searchdate'});
            },
            toggleSearchPanel: function () {
                if (!this.display.searchOther) {
                    $('.popup-overlay').height($('body').height() - 80);
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
                    $('.popup-overlay.modal-overlay-visible').off('click');
                    $.closeModal('.popup-search');
                    this.display.searchOther = false;
                }
            },
            clearSearch:function () {
                Constant.atMe = this.atMe = 0;
                Constant.isMe = this.isMe = 0;
                Constant.isMeUnsolve = this.isMeUnsolve = 0;
                Constant.userInfo.id = this.userInfo.id = '';
                Constant.userInfo.name = this.userInfo.name = '';
                Constant.shopInfo.id = this.shopInfo.id = '';
                Constant.shopInfo.name = this.shopInfo.name = '';
                Constant.module.id = this.module.id = '';
                Constant.module.name = this.module.name = '';
            },
            searchAll: function () {
                if(this.loading){
                    return;
                }
                this.page.index = 0;
                this.clearSearch();
                this.toggleSearchPanel();
                $.pullToRefreshTrigger('#dataContent');
            },
            searchIsMe: function () {
                if(this.loading){
                    return;
                }
                this.page.index = 0;
                if (this.isMe == 0) {
                    this.clearSearch();
                    Constant.isMe = this.isMe = 1;
                    Constant.atMe = this.atMe = 0;
                } else {
                    this.clearSearch();
                    Constant.isMe = this.isMe = 0;
                }
                this.userInfo.id = '';
                this.userInfo.name = '';
                $('#dataContent')[0].scrollTop = 0;
                $.pullToRefreshTrigger('#dataContent');
            },
            searchUnDo:function(){
                if(this.loading){
                    return;
                }
                this.page.index = 0;
                if (this.isMeUnsolve == 0) {
                    this.clearSearch();
                    Constant.isMeUnsolve = this.isMeUnsolve = 1;
                } else {
                    this.clearSearch();
                    Constant.isMeUnsolve = this.isMeUnsolve = 0;
                }
                $('#dataContent')[0].scrollTop = 0;
                $.pullToRefreshTrigger('#dataContent');
            },
            searchAtMe: function () {
                if(this.loading){
                    return;
                }
                this.page.index = 0;
                if (this.atMe == 0) {
                    Constant.atMe = this.atMe = 1;
                    Constant.isMe = this.isMe = 0;
                } else {
                    Constant.atMe = this.atMe = 0;
                }
                this.toggleSearchPanel();
                $.pullToRefreshTrigger('#dataContent');
            },
            viewAllContent: function (item, index) {
                var obj = Object.assign({}, item, {showAllContent: !item.showAllContent});
                this.items.$set(index, obj);
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
            viewDetail: function (item,index) {
                //点击用户名、用户头像、图片，不会触发查看详情
                /*if($event && $event.srcElement.className.indexOf('not-view') > -1){
                 return false;
                 }*/
                //需要发送已读申请
                Constant.needReadMessage = (item.isRead == 0) ? true : false;
                if (Constant.needReadMessage) {
                    item.isRead = 1;
                    if (item.reminderList && item.reminderList.length > 0) {
                        item.remindersReadCount++;
                        for (var i = 0; i < item.reminderList.length; i++) {
                            if (item.reminderList[i].id == this.curUser.id) {
                                item.reminderList[i].isRead = 1;
                                break;
                            }
                        }
                    }
                }
                //查看详情
                Constant.detail.id = item.id;
                Constant.detail.index = index;
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
            whoPassed: function (item) {
                var users = whohaspassed(item.performerPassList);
                this.passedUsers = users.passed;
                this.unpassedUsers = users.unpassed;
                this.showPassedModal = true;
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
             * 谁已经看过对话框中选择tab页
             * @param index
             */
            selectPassedTabIndex: function (index) {
                this.currentPassedTabIndex = index;
                if (index == 0) {
                    $('#passtab1').addClass('active');
                    $('#passtab2').removeClass('active');
                } else {
                    $('#passtab2').addClass('active');
                    $('#passtab1').removeClass('active');
                }
            },
            openLink:function(cf){
                try{
                    var link = cf.replace('WDZ_HREF','');
                    if ($.device.android) {
                        window.webview.openBrowser(link);
                    } else if ($.device.ios) {
                        window.webkit.messageHandlers.openBrowser.postMessage(link);
                    }else{
                        window.location.href = link;
                    }
                }catch(e){
                    $.toast('即将支持通过浏览器打开该链接');
                }
            },
            /**
             * 评论
             */
            doCmt: function (item, cmt) {
                if (cmt && this.curUser && this.curUser.id == cmt.userId) {
                    if (cmt.canDelete == 0) return;
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
                Vue.set(item, 'cmtShowPics', []);
                $('.cmt-textarea-' + item.id).attr('placeholder', placeholderStr);
                if (item.showCmtArea) {
                    $('.cmt-textarea-' + item.id).height(30);
                    /*setTimeout(function () {
                        var cmtHeight = $('.footer-cmt-' + item.id).height();//评论框区域的高度
                        $('#dataContent')[0].scrollTop = $('#dataContent')[0].scrollTop + cmtHeight + 35;
                        $.locScroll($('#dataContent'));
                    }, 0);*/
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
                        //格式化文本中的超连接
                        utils.formatHyperLink(data,data.content);
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
                    $.showPreloader('正在删除');
                    _this.$http.post('/service/deleteHandoverBookById.action', {
                        'handoverBookId': id,
                        token: Constant.token
                    }).then(function (ret) {
                        $.hidePreloader();
                        if (ret.ok && ret.data && ret.data.result == 'ok') {
                            _this.page.index = 0;
                            _this.items = [];
                            _this.getData();
                        } else if (ret.data.result == 'EXPIRE') {
                            $.toast('当前记录发表时间已经超过5分钟，不能被删除');
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
                        } else if (ret.data.result == 'EXPIRE') {
                            $.toast('当前评论发表时间已经超过5分钟，不能被删除');
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
                //调用安卓相册
                if(this.isAndroid){
                    try{
                        clickIndex = index;
                        window.webview && window.webview.openGallery(maxCmtImgNum,$('.footer-textarea-' + index + ' .cmt-pic').length);
                    }catch(e){
                        $.toast('error');
                    }
                    return;
                }
            },
            /**
             * 删除评论图片
             * */
            deleteImg: function (item, index) {
                item.cmtPics.splice(index, 1);
                item.cmtShowPics.splice(index, 1);
            },
            closeCmtDialog: function () {
                this.showCommentModal = false;
            },
            closeUserDialog: function () {
                this.showModal = false;
            },
            closePassedUserDialog: function () {
                this.showPassedModal = false;
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


    function whohaspassed(users) {
        var unpassed = [], passed = [];
        for (var i = 0; i < users.length; i++) {
            if (!users[i].passTime) {
                unpassed.push(users[i]);
            } else {
                passed.push(users[i]);
            }
        }
        return {
            unpassed: unpassed,
            passed: passed
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
    .todo-label{
        margin-left:2px;
    }
    

    .search-value {
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
    }
    .notdo-num{
        background: red;
        color: #fff;
        line-height: 20px;
        width: 20px;
        border-radius: 10px;
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

    .bar .icon-back {
        font-size: 1.3rem;
        color: #f90;
        width: 2rem;
        height: 2.2rem;
        line-height: 2.2rem;
        text-align: center;
        display: inline-block;
        position: absolute;
        left: 0px;
    }

    #dataContent .items-list {

    }

    #dataContent .items-list li {
        border: none;
        margin-top: 5px;
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

    #dataContent .item-text {
        word-wrap: break-word;
        font-size: 16px;
        white-space: pre-line;
    }

    .content-format{
        word-break: break-all;
        white-space: initial;
    }
    .inner-format{
        
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

    .handover .item-type .type-name {
        color: #fa0;
    }

    .handover .other-list {
        display: inline-block;
        vertical-align: middle;
        height: 16px;
        line-height: 16px;
        float: right;
    }

    .state-3 {
        color: #8acc47;
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

    .handover .spot-state {
        font-size: 12px;
        height: 30px;
        line-height: 30px;
        vertical-align: middle;
        float: left;
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
        padding: 0px 10px;
        padding-top: 0px;
        background: #fcfcfc;
        height: auto;
    }
    .search-panel .icon-pre{
        float: right;
        margin-top: 9px;
    }

    .panel-value{
        width:calc(100% - 40px);
        display: inline-block;
    }
    
    .handover .sp-item {
        padding: 0px 10px;
        border-bottom: 1px solid #eee;
        width: 100%;
        height: 36px;
        line-height: 36px;
    }

    .handover .sp-item input[type=checkbox] {
        width: 16px;
        height: 16px;
        margin-right: 10px;
    }

    .handover .sp-item.label {
        height: 46px;
        line-height: 46px;
    }
    .handover .sp-item.active {
        background: #fff;
        color: #fa0;
    }

    .handover .sp-time.label {
        margin-right: 20px;
    }
    .handover .item-icon {
        font-size: 16px;
        margin-right: 10px;
        color: #888;
    }

    #dataContent .item-images li {
        float: left;
        padding: 0px 5px 0px 0px;
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
        clear: both;
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
        overflow: hidden;
    }
    .cmt-pic.cmt-pic-local{
        overflow: inherit;
    }
    .handover .app-cmt-pic{
        overflow: hidden;
        width: 40px;
        height: 40px;
        display: inline-block;
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
        overflow: hidden;
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
