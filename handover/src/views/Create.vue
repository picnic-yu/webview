<template>
    <div class="page handover-create" :transition="transitionName">
        <div class="container">
            <header class="bar bar-nav">
                <span class="pull-left icon-back" v-on:click="backTo()" v-if="showBackBtn==1"></span>
                <button class="button button-link button-nav pull-right button-btn btn-submit" v-on:click="submit()">
                    提交
                </button>
                <h1 class='title'></h1>
            </header>
            <div class="content create-content">
                <div class="top-content">
                    <textarea class="top-textarea require-text" placeholder="说点什么..." v-model="bo.content"
                              maxlength="1000"></textarea>

                    <div class="img-content">
                        <div class="uploadimg-container">
                            <div class="fp-left" v-for="pic in bo.showPics" track-by="$index">
                                <a class="item-pic pb-standalone" index="{{$index}}">
                                    <img v-bind:style="whichCmtImgSize(pic)" v-bind:src="pic.url" v-bind:src="path" class="p-img p-img-{{$index}}"/>
                                </a>
                                <span class="delete-img icon-cross" v-on:click="deleteItemImg($index)"></span>
                            </div>
                            <div class="fp-add" @click="beforeUpload($event,-1)">
                                <img width="60" height="60" src="../../../common/assets/imgs/add.png"/>
                                <input class="add-file0" v-show="!isAndroid" type="file" name="upload0" multiple accept="image/*"/>
                            </div>
                        </div>
                        <div class="clearboth"></div>
                    </div>
                </div>
                <div class="sheet-content who-content" v-on:click="whichTemplate()">
                    <table>
                        <tr>
                            <td valign="top" class="wc-tip">模板</td>
                            <td valign="top" class="wc-userlist">
                                <div class="no-content" v-show="!bo.moudleId">未选择类型</div>
                                <div class="no-content input" v-show="bo.moudleId">{{bo.moudleName}}</div>
                            </td>
                            <td valign="top" class="wc-icon"><span class="icon-pre"></span></td>
                        </tr>
                    </table>
                </div>
                <div class="c-item-content" v-show="true">
                    <ul>
                        <li v-for="item in items" class="item-li">
                            <div class="cic-title">
                                <span class="cic-flag"></span>
                                <h4 class="item-title">{{item.confName}}</h4>
                            </div>
                            <ul>
                                <li v-for="subItem in item.childs" class="sub-li">
                                    <div class="sub-item">
                                        <div class="sub-title"><span>{{$index+1}}、{{subItem.confName}}</span></div>
                                        <!--类型中填写文字以及拍照-->
                                        <div class="sub-content" v-if="subItem.contentType == 0">
                                            <div class="capture-img" @click="beforeUpload($event,subItem.confId)"
                                                 v-if="subItem.hasPic == 1">
                                                <img src="../../../common/assets/imgs/capture.png" width="40px"
                                                     height="40px"/>
                                                <input class="add-file capture-img-file add-{{subItem.confId}}" v-show="!isAndroid"
                                                       typeId="{{subItem.confId}}" type="file" name="upload" multiple
                                                       accept="image/*"/>
                                            </div>
                                            <div class="sub-textarea">
                                                <textarea class="textarea require-text" v-model="subItem.content"
                                                          placeholder="描述..." maxlength="1000"></textarea>
                                            </div>
                                        </div>
                                        <div class="f-panel sub-panel"
                                             v-show="subItem.showPicPanel && subItem.hasPic == 1">
                                            <div class="uploadimg-container uploadimg-container-{{$index}}">
                                                <div class="fp-left" v-for="pic in subItem.showPics"
                                                     track-by="$index">
                                                    <a class="subitem-pic pb-standalone" index="{{$index}}"
                                                       subItemIndex="{{$parent.$index}}"
                                                       itemIndex="{{$parent.$parent.$index}}">
                                                        <img v-bind:style="whichCmtImgSize(pic)" v-bind:src="pic.url"/>
                                                    </a>
                                                <span class="delete-img icon-cross"
                                                      v-on:click="deleteImg(subItem,subItem.confId,$index)"></span>
                                                </div>
                                                <div class="fp-add" @click="beforeUpload($event,subItem.confId)">
                                                    <img width="60" height="60"
                                                         src="../../../common/assets/imgs/add.png"/>
                                                    <input class="add-file add-{{subItem.confId}}" v-show="!isAndroid"
                                                           typeId="{{subItem.confId}}" type="file" name="upload"
                                                           multiple
                                                           accept="image/*"/>
                                                </div>
                                            </div>
                                            <div class="clearboth"></div>
                                        </div>
                                        <!--类型中选择人-->
                                        <div class="sub-content" v-if="subItem.contentType == 1"
                                             @click="goToUserList(subItem,$parent.$index,$index)">
                                            <div class="no-content"
                                                 v-bind:class="subItem.isRequired==1?'require-text-subitem':''"
                                                 v-show="!subItem.content">请选择{{subItem.confName}}
                                            </div>
                                            <div class="d-type-item" v-show="subItem.content">
                                                {{subItem.contentStr}}
                                            </div>
                                        </div>
                                        <!--类型中选择门店-->
                                        <div class="sub-content" v-if="subItem.contentType == 2"
                                             @click="goToShopList(subItem,$parent.$index,$index)">
                                            <div class="no-content"
                                                 v-bind:class="subItem.isRequired==1?'require-text-subitem':''"
                                                 v-show="!subItem.content">请选择{{subItem.confName}}
                                            </div>
                                            <div class="d-type-item" v-show="subItem.content">
                                                {{subItem.contentStr}}
                                            </div>
                                        </div>
                                    </div>
                                    <!--类型中选择日期-->
                                    <div class="sub-content" v-if="subItem.contentType == 3"
                                         @click="goToDate(subItem.content,$parent.$index,$index)">
                                        <div class="no-content"
                                             v-bind:class="subItem.isRequired==1?'require-text-subitem':''"
                                             v-show="!subItem.content">请选择{{subItem.confName}}
                                        </div>
                                        <div class="d-type-item" v-show="subItem.content">
                                            {{subItem.content}}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <!--mouduletype 1为亮点推广和任务-->
                <div class="dep-content who-content" v-on:click="whichDep()"
                     v-if="bo.moudleType != 1 && !(bo.isSecretary && isSecretary)">
                    <table>
                        <tr>
                            <td valign="top" class="wc-tip">门店</td>
                            <td valign="top" class="wc-userlist">
                                <!--<div class="no-content" v-show="!bo.deptId">请选择一个门店</div>-->
                                <div class="no-content input" v-show="bo.deptId">{{bo.deptName}}</div>
                                <div class="no-content input public" v-show="!bo.deptId">公开</div>
                            </td>
                            <td valign="top" class="wc-icon"><span class="icon-pre"></span></td>
                        </tr>
                    </table>
                </div>
                <div class="who-content bottom-content" v-on:click="atWho()" v-if="!(bo.isSecretary && isSecretary)"
                     v-bind:class="bo.moudleType == 1?'dep-content':''">
                    <table>
                        <tr>
                            <td valign="top" class="wc-tip">提醒谁看</td>
                            <td valign="top" class="wc-userlist">
                                <div class="no-content" v-show="userlist.length==0 && isAtAll == 0">无</div>
                                <div v-for="user in userlist" class="user-item" v-show="isAtAll != 1">
                                    {{user.showName}}<span class="splitor-f" v-if="$index!=userlist.length-1">,</span>
                                </div>
                                <div class="" v-show="isAtAll==1">所有人</div>
                            </td>
                            <td valign="top" class="wc-icon"><span class="icon-pre"></span></td>
                        </tr>
                    </table>
                </div>
                <div class="group-content who-content" v-on:click="whicGroup()" v-if="bo.isSecretary && isSecretary">
                    <table>
                        <tr>
                            <td valign="top" class="wc-tip">企业</td>
                            <td valign="top" class="wc-userlist">
                                <div class="no-content" v-show="grouplist.length == 0 && bo.isOpen == 0">请选择一个企业</div>
                                <div v-for="group in grouplist" class="user-item" v-show="bo.isOpen != 1">
                                    {{group.name}}<span class="splitor-f" v-if="$index!=grouplist.length-1">,</span>
                                </div>
                                <div class="no-content input public" v-show="bo.isOpen==1">公开</div>
                            </td>
                            <td valign="top" class="wc-icon"><span class="icon-pre"></span></td>
                        </tr>
                    </table>
                </div>
                <div class="blank"></div>
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
    var utils = require('./../utils');
    var commonutils = require('../../../common/assets/js/commonutils');
    var Vue = require('vue');
    var num = 20;//每页显示的条数
    var maxImgNum = 12;//最多可以上传的图片数目
    var targetSubItemId;
    module.exports = {
        route: {
            data: function (transition) {
                if (this.refreshInit) {
                    if (!this.bo) {
                        this.getData();
                    } else {
                        Constant.bo.deptId = Constant.shopInfo.id;
                        Constant.bo.deptName = Constant.shopInfo.name;
                        this.bo.isOpen = Constant.create.isOpen;
                    }
                }
                if (transition.from.name == 'templates') {
                    //根据类型获取具体类型内容
                    if (this.bo.moudleId) {
                        this.getTemplateItems(this.bo.moudleId);
                    }
                    else {
                        Constant.bo.subItems = this.bo.subItems = this.items = [];//如果没有选择类型，清空类型内容
                    }
                }
                //以下为兼容亮点推广而增加的逻辑
                if (transition.from.name == 'expiredate') {
                    //设置刚刚选择的日期
                    if (this.bo.moudleId && this.bo.moudleType == 1 && this.bo.subItems && this.bo.subItems.length > 0) {
                        this.bo.subItems[Constant.create.mDate.parentIndex].childs[Constant.create.mDate.index].content = Constant.create.mDate.value;
                    }
                }
                if (transition.from.name == 'mutipleuserlist' && transition.from.params.type == 1) {
                    //设置刚刚选择的用户(多选),content为传入后台用的ids,contentStr为显示用的名称
                    if (this.bo.moudleId && this.bo.moudleType == 1 && this.bo.subItems && this.bo.subItems.length > 0) {
                        this.bo.subItems[Constant.create.mUserInfo.parentIndex].childs[Constant.create.mUserInfo.index].content = Constant.create.mUserInfo.ids;
                        Vue.set(this.bo.subItems[Constant.create.mUserInfo.parentIndex].childs[Constant.create.mUserInfo.index], 'contentStr', Constant.create.mUserInfo.names);
                    }
                }
                if (transition.from.name == 'userlist' && transition.from.params.dowhich == 1) {
                    //设置刚刚选择的用户(单选),content为传入后台用的ids,contentStr为显示用的名称
                    if (this.bo.moudleId && this.bo.moudleType == 1 && this.bo.subItems && this.bo.subItems.length > 0) {
                        this.bo.subItems[Constant.create.mUserInfo.parentIndex].childs[Constant.create.mUserInfo.index].content = Constant.create.mUserInfo.ids;
                        Vue.set(this.bo.subItems[Constant.create.mUserInfo.parentIndex].childs[Constant.create.mUserInfo.index], 'contentStr', Constant.create.mUserInfo.names);
                    }
                }
                this.registGalleryEvent();
                transition.next({
                    done: false,
                    userlist: Constant.selectedUsers,
                    grouplist: Constant.selectedGroups,
                    bo: Constant.bo,
                    isAtAll: Constant.bo ? Constant.bo.isAtAll : 0,
                    items: (Constant.bo && Constant.bo.subItems) ? Constant.bo.subItems : [],
                    shopInfo: Constant.shopInfo
                });

            },
            deactivate: function (transition) {
                if (myPhotoBrowserStandalone) {
                    myPhotoBrowserStandalone.close();
                    isPhotoOpen = false;
                }
                if (transition.to.name == 'default') {
                    this.initAllSearch();
                }
                transition.next();
            },
            canDeactivate: function (transition) {
                if (transition.to.name == 'mutipleuserlist' || this.done) {//去选择at的用户，数据不清空
                    if (this.done) {
                        this.clearData();
                    }
                    if (transition.to.name == 'default') {
                        this.transitionName = 'right';
                    } else {
                        this.transitionName = 'left';
                    }
                    transition.next();
                } else if (transition.to.name == 'default') {//返回上一级，清空数据
                    var _this = this;
                    this.transitionName = 'right';
                    $.modal.prototype.defaults.modalButtonOk = '退出';
                    $.modal.prototype.defaults.modalButtonCancel = '继续';
                    $.confirm('退出此次编辑？', function () {
                        $.modal.prototype.defaults.modalButtonOk = '确定';
                        $.modal.prototype.defaults.modalButtonCancel = '取消';
                        _this.clearData();
                        Constant.needRefresh = false;//返回到主页时不需要刷新
                        transition.next();
                    }, function () {
                        transition.abort();
                        $.modal.prototype.defaults.modalButtonOk = '确定';
                        $.modal.prototype.defaults.modalButtonCancel = '取消';
                    });
                } else {
                    this.transitionName = 'left';
                    transition.next();
                }
            }
        },
        data: function () {
            return {
                transitionName: 'right',
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
                userInfo: {
                    id: '',
                    name: ''
                },
                layout: {
                    width: $('body').width()
                },
                display: {
                    nodata: false,
                    searchOther: false
                },
                isAtAll: 0,
                openUserListType:-1,//打开原生通讯录功能，0为@人,1为亮点推广
                done: false,//是否完成创建
                submiting: false,//是否正在提交
                bo: Constant.bo,
                isSecretary: false,
                userlist: Constant.selectedUsers,
                grouplist: Constant.selectedGroups,
                pics: [],
                items: (Constant.bo && Constant.bo.subItems) ? Constant.bo.subItems : [],
                hasCreateToday: false,//今天是否已经创建过
                loading: false,
                refreshInit: false,
                showBackBtn: Constant.showBackBtn
            }
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
            init: function (opt) {
                if (!this.refreshInit) {
                    this.refreshInit = true;
                }
                $(document).off('input', '.handover-create .sub-textarea .textarea').on('input', '.handover-create .sub-textarea .textarea', function (val) {
                    if (this.scrollHeight > 45) {
                        this.style.height = this.scrollHeight + 'px';
                    }
                });
                $(document).off('propertychange', '.handover-create .sub-textarea .textarea').on('propertychange', '.handover-create .sub-textarea .textarea', function (val) {
                    if (this.scrollHeight > 45) {
                        this.style.height = this.scrollHeight + 'px';
                    }
                });
                $(document).off('input', '.handover-create .top-textarea').on('input', '.handover-create .top-textarea', function (val) {
                    if (this.scrollHeight > 80) {
                        this.style.height = this.scrollHeight + 'px';
                    }
                });
                $(document).off('propertychange', '.handover-create .top-textarea').on('propertychange', '.handover-create .top-textarea', function (val) {
                    if (this.scrollHeight > 80) {
                        this.style.height = this.scrollHeight + 'px';
                    }
                });
                this.registUserListEvent();
                dragula([$('.img-content .uploadimg-container')[0]], {
                    moves: function (el, source) {
                        if ($(el).hasClass('fp-left')) {
                            return true;
                        }
                        return false;
                    },
                    canDrop: function (el) {
                        if ($(el).hasClass('fp-add') || $(el).hasClass('uploadimg-container')) {
                            return false;
                        }
                        return true;
                    }
                });
                this.getData('', opt);
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
            //注册通讯录事件
            registUserListEvent:function () {
                var _this = this;
                window.saveUserList = function (res) {
                    if(typeof(res) == 'string'){
                        res = JSON.parse(res);
                    }
                    if(_this.openUserListType == 0){
                        if(res.isAtAll == 1){
                            _this.isAtAll = 1;
                        }else{
                            _this.isAtAll = 0;
                            _this.userlist = formatUserList(res.users);
                        }
                    }else if(_this.openUserListType == 1){
                        _this.bo.subItems[Constant.create.mUserInfo.parentIndex].childs[Constant.create.mUserInfo.index].content = getUserIds0(res.users);
                        Vue.set(_this.bo.subItems[Constant.create.mUserInfo.parentIndex].childs[Constant.create.mUserInfo.index], 'contentStr', getUserNames0(res.users));
                    }
                };
            },
            //注册安卓相册事件
            registGalleryEvent:function(){
                var _this = this;
                //安卓选完相册后的回调
                window.receiveGalleryData = function (base64,width,height) {
                    base64 = 'data:image/png;base64,'+base64;
                    if(targetSubItemId == -1){
                        if (!_this.bo.showPicPaths) _this.bo.showPicPaths = [];
                        _this.bo.showPicPaths.push(base64);
                        if (!_this.bo.showPics) _this.bo.showPics = [];
                        _this.bo.showPics.push({
                            url:base64,
                            width:width,
                            height:height
                        });
                    }else if(targetSubItemId >= 0){
                        var subItem = getChildType(_this.items, targetSubItemId);
                        if (!subItem.filePaths) subItem.filePaths = [];
                        subItem.filePaths.push(base64);
                        if (!subItem.showPics) subItem.showPics = [];
                        subItem.showPics.push({
                            url:base64,
                            width:width,
                            height:height
                        });
                        _this.showPicPanel(subItem);
                    }
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
                                    if (!_this.bo.showPicPaths) _this.bo.showPicPaths = [];
                                    _this.bo.showPicPaths.push(base64);
                                    if (!_this.bo.showPics) _this.bo.showPics = [];
                                    _this.bo.showPics.push({
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
                                            if ($('.handover-create .pb-standalone').length > maxImgNum) {
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
                $(document).off('click', '.pb-standalone.item-pic').on('click', '.pb-standalone.item-pic', function () {
                    var index = $(this).attr('index');//当前图片组中查看的图片的索引
                    photos = _this.bo.showPicPaths;
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
            bindSubItemEvent: function () {
                for (var i = 0; i < $('.sub-panel .uploadimg-container').length; i++) {
                    dragula([$('.sub-panel .uploadimg-container')[i]], {
                        mirrorContainer: $('.sub-panel')[0]
                    });
                }
                //点击时打开图片浏览器
                var photos = [];
                var _this = this;
                $(document).off('click', '.pb-standalone.subitem-pic').on('click', '.pb-standalone.subitem-pic', function () {
                    var index = $(this).attr('index');//当前图片组中查看的图片的索引
                    var subItemIndex = $(this).attr('subItemIndex');
                    var itemIndex = $(this).attr('itemIndex');
                    photos = _this.items[itemIndex].childs[subItemIndex].filePaths;
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
                $(document).off('change', '.add-file').on('change', '.add-file', function () {
                    var $addImg = $(this).prev();
                    var _file = this;
                    var successNum = 0, fileNum = this.files.length;
                    var typeId = $(this).attr('typeId');
                    var hasToMorePic = false;
                    var subItem = getChildType(_this.items, typeId);
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
                                    if (!subItem.filePaths) subItem.filePaths = [];
                                    subItem.filePaths.push(base64);
                                    if (!subItem.showPics) subItem.showPics = [];
                                    subItem.showPics.push({
                                        url:base64,
                                        width:img.width,
                                        height:img.height
                                    });
                                    if (successNum == fileNum) {
                                        $(_file).remove();
                                        //上传成功之后重置input
                                        $($addImg).parent().append('<input class="add-file add-' + typeId + '" typeId="' + typeId + '" name="upload" type="file" multiple accept="image/!*"/>');
                                        _this.showPicPanel(subItem);
                                    }
                                    //检测是否上传了太多的图片
                                    setTimeout(function () {
                                        if (!hasToMorePic) {
                                            if ($('.handover-create .pb-standalone').length > maxImgNum) {
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

                        /* var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function () {
                            successNum++;
                            if (!subItem.filePaths) subItem.filePaths = [];
                            subItem.filePaths.push(this.result);
                            if (successNum == fileNum) {
                                $(_file).remove();
                                //上传成功之后重置input
                         $($addImg).parent().append('<input class="add-file add-' + typeId + '" typeId="' + typeId + '" name="upload" type="file" multiple accept="image/!*"/>');
                                _this.showPicPanel(subItem);
                            }
                         };*/
                    }


                });
            },
            getData: function () {
                var _this = this;
                this.$http.post('/service/getNewHandoverBookBo.action', {
                    token: Constant.token
                }).then(function (ret) {
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        var data = ret.data.data.data;
                        Constant.bo = _this.bo = data;
                        Constant.shopInfo.id = _this.bo.deptId;
                        Constant.shopInfo.name = _this.bo.deptName;
                        Constant.bo.deptId = Constant.shopInfo.id;
                        Constant.bo.deptName = Constant.shopInfo.name;
                        Constant.create.isOpen = _this.bo.isOpen;
                        Constant.isSecretary = _this.isSecretary = ret.data.data.isSecretary;
                        setTimeout(_this.bindItemEvent, 1000);
                    }
                });
            },
            getTemplateItems: function (tId) {
                var _this = this;
                this.$http.post('/service/constructSubItemBosByMoudleId.action?token=' + Constant.token, {
                    handoverBookMoudleId: tId
                }).then(function (ret) {
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        var data = ret.data.data.data;
                        if (data && data.length > 0) {
                            _this.items = data;
                        } else {
                            _this.items = [];
                        }
                        Constant.bo.subItems = _this.bo.subItems = _this.items;
                        setTimeout(_this.bindSubItemEvent, 1000);
                    }
                });
            },
            clearData: function () {
                Constant.bo = this.bo = '';
                this.items = [];
                Constant.selectedUsers = this.userlist = [];
                Constant.selectedGroups = this.grouplist = [];
            },
            goToUserList: function (subItem, parentIndex, index) {
                this.openUserListType = 1;
                Constant.create.mUserInfo.ids = subItem.content;
                Constant.create.mUserInfo.names = subItem.contentStr;
                Constant.create.mUserInfo.parentIndex = parentIndex;
                Constant.create.mUserInfo.index = index;
                try{
                    var type = subItem.isMulti?2:1;
                    if($.device.android){
                        window.webview && window.webview.openUserList(JSON.stringify({type:type,userIds:subItem.content,isHaveSelf:1,isAtAll:0}));
                    }else if($.device.ios){
                        window.webkit.messageHandlers.openUserList.postMessage({type:type,userIds:subItem.content,isHaveSelf:1,isAtAll:0});
                    }else{
                        if (subItem.isMulti) {
                            router.go({name: 'mutipleuserlist', params: {type: 1}});
                        } else {
                            router.go({name: 'userlist', params: {dowhich: 1}});
                        }
                    }
                }catch (e){
                    if (subItem.isMulti) {
                        router.go({name: 'mutipleuserlist', params: {type: 1}});
                    } else {
                        router.go({name: 'userlist', params: {dowhich: 1}});
                    }
                }
                
            },
            goToDate: function (value, parentIndex, index) {
                Constant.create.mDate.value = value;
                Constant.create.mDate.parentIndex = parentIndex;
                Constant.create.mDate.index = index;
                router.go({name: 'expiredate'});
            },
            goToShopList: function (mutiple) {
                router.go({name: 'shoplist', params: {dowhich: mutiple ? 3 : 2}});
            },
            whichDep: function () {
                router.go({name: 'shoplist', params: {dowhich: 1}});
            },
            whicGroup: function () {
                router.go({name: 'grouplist'});
            },
            showPicPanel: function (sitem) {
                if (sitem.showPicPanel) return;
                Vue.set(sitem, 'showPicPanel', true);
            },
            deleteItemImg: function (index) {
                this.bo.showPicPaths.splice(index, 1);
                this.bo.showPics.splice(index, 1);
            },
            deleteImg: function (sitem, id, index) {
                sitem.filePaths.splice(index, 1);
                sitem.showPics.splice(index, 1);
            },
            atWho: function () {
                this.openUserListType = 0;
                try{
                    var userIds = getUserIds(this.userlist);
                    var isAtAll = this.isAtAll || 0;
                    if($.device.android){
                        window.webview && window.webview.openUserList(JSON.stringify({type:2,userIds:userIds,isHaveSelf:0,isAtAll:isAtAll}));
                    }else if($.device.ios){
                        window.webkit.messageHandlers.openUserList.postMessage({type:2,userIds:userIds,isHaveSelf:0,isAtAll:isAtAll});
                    }else{
                        router.go({name: 'mutipleuserlist', params: {type: 0}});
                    }
                }catch (e){
                    router.go({name: 'mutipleuserlist', params: {type: 0}});
                }
            },
            whichTemplate: function () {
                router.go({name: 'templates', params: {dowhich: 1}});
            },
            submit: function () {
                if (this.submiting) {
                    return;
                }
                var hasTextSth = false, noSubItemSth = false, errorTip;
                $('.require-text').each(function () {
                    if (this.value) {
                        hasTextSth = true;
                    }
                });
                if (!hasTextSth) {
                    $.toast('说点什么吧');
                    return;
                }
                $('.require-text-subitem').each(function () {
                    var val = $.trim($(this).next().html());
                    if (!val || typeof(val) == 'undefined') {
                        noSubItemSth = true;
                        errorTip = $(this).html();
                        return false;
                    }
                });
                if (noSubItemSth) {
                    $.toast(errorTip);
                    return;
                }
                if ($('.handover-create .pb-standalone').length > maxImgNum) {
                    $.toast('上传的图片最多不能超过' + maxImgNum + '张');
                    return;
                }
                var _this = this;
                Vue.http.options.emulateJSON = false;
                this.bo.deptId = Constant.shopInfo.id;
                this.bo.reminders = getUserIds(this.userlist);
                this.bo.isAtAll = Constant.bo.isAtAll;
                if (typeof(this.bo.moudleType) == 'undefined') {
                    this.bo.moudleType = null;
                    this.bo.moudleId = null;
                }
                if (!this.bo.moudleType || this.bo.moudleType == 0) {//0为交接本、日志等基本类型
                    if (!this.bo.deptId && this.bo.isOpen == 0) {
                        $.toast('请选择一个门店');
                        return;
                    }
                    if (!this.bo.deptId) {
                        this.bo.deptId = 0;
                        this.bo.isOpen = 1;
                    } else {
                        this.bo.isOpen = 0;
                    }
                } else if (this.bo.moudleType == 1) {//1为亮点推广和任务
                    this.bo.deptId = 0;
                    this.bo.isOpen = 0;
                } else if (this.bo.moudleType == 2) {//2为用户反馈
                    this.bo.deptId = 0;
                    this.bo.isOpen = 0;
                }
                //如果是企业小秘书，并且选择的是公告（特有类型）
                if (this.bo.isSecretary && this.isSecretary) {
                    this.bo.groupIds = getUserIds(this.grouplist);
                    if (!this.bo.groupIds) {
                        this.bo.isOpen = 1;
                    } else {
                        this.bo.isOpen = 0;
                    }
                }

                this.sortImgs();
                $.showPreloader('正在处理');
                this.submiting = true;
                this.$http.post('/service/saveHandoverBookBo.action?token=' + Constant.token, {
                    handoverBookBo: this.bo,
                    token: Constant.token
                }).then(function (ret) {
                    _this.submiting = false;
                    Vue.http.options.emulateJSON = true;
                    $.hidePreloader();
                    if (ret.data.result == 'ok') {
                        $.toast('提交成功');
                        _this.done = true;
                        Constant.needRefresh = true;
                        Constant.selectedUsers = [];
                        Constant.selectedGroups = [];
                        //清除所有查询条件，创建成功之后返回到列表界面时能够查询到ALL
                        Constant.module = {id:'',name:''};
                        Constant.userInfo = {id:'',name:''};
                        Constant.shopInfo = {id:'',name:''};
                        Constant.atMe = 0;
                        Constant.isMe = 0;
                        Constant.isMeUnsolve = 0;
                        router.go({name: 'default'});
                    } else {
                        $.toast('提交失败');
                    }
                }, function () {
                    _this.submiting = false;
                    Vue.http.options.emulateJSON = true;
                    $.hidePreloader();
                    $.toast('提交失败');
                });
            },
            /**
             * 给所有图片排序
             */
            sortImgs: function () {
                var _this = this;
                if (this.bo.showPicPaths && this.bo.showPicPaths.length > 0) {
                    this.bo.showPicPaths = [];
                    $('.img-content .uploadimg-container').find('.fp-left img').each(function () {
                        _this.bo.showPicPaths.push(this.src);
                    });
                }
                if (this.bo.subItems && this.bo.subItems.length > 0) {
                    for (var i = 0; i < this.bo.subItems.length; i++) {
                        var item = this.bo.subItems[i];
                        for (var j = 0; j < item.childs.length; j++) {
                            var subItem = item.childs[j];
                            if (subItem.filePaths && subItem.filePaths.length > 0) {
                                subItem.filePaths = [];
                                $('.sub-panel .uploadimg-container-' + j).find('.fp-left img').each(function () {
                                    subItem.filePaths.push(this.src);
                                });
                            }
                        }
                    }
                }
            },
            beforeUpload: function (event,id) {
                if ($('.handover-create .pb-standalone').length >= maxImgNum) {
                    $.toast('上传的图片最多不能超过' + maxImgNum + '张');
                    event.preventDefault();
                    event.stopPropagation();

                }
                //调用安卓相册
                if(this.isAndroid){
                    try{
                        targetSubItemId = id; //记下是从哪儿点击的
                        window.webview && window.webview.openGallery(maxImgNum,$('.handover-create .pb-standalone').length);
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

    function getChildType(list, id) {
        for (var i = 0; i < list.length; i++) {
            var children = list[i].childs;
            for (var j = 0; j < children.length; j++) {
                var item = children[j];
                if (item.confId == id) {
                    return item;
                }
            }
        }
    }

    function getUserIds(users) {
        var ids = '';
        for (var i = 0; i < users.length; i++) {
            ids += users[i].id;
            if (i != users.length - 1) {
                ids += ',';
            }
        }
        return ids;
    }

    function getUserIds0(users) {
        var ids = '';
        for (var i = 0; i < users.length; i++) {
            ids += users[i].userId;
            if (i != users.length - 1) {
                ids += ',';
            }
        }
        return ids;
    }

    function getUserNames0(users) {
        var names = '';
        for (var i = 0; i < users.length; i++) {
            names += users[i].showName;
            if (i != users.length - 1) {
                names += ',';
            }
        }
        return names;
    }
    
    function formatUserList(users) {
        var list = [];
        for (var i = 0; i < users.length; i++) {
            list.push({
                id:users[i].userId,
                showName:users[i].showName
            });
        }
        return list;
    }

</script>

<style>
    .handover-create li {
        display: block;
    }

    .content.create-content {
        background: #f5f5f5;
        overflow-x: hidden;
    }

    .handover-create .title {
        width: 88%;
        margin: 0 auto;
        position: static;
    }

    .who-content ul li {
        display: inline-block;
    }

    .bar .button-btn.pull-left {
        margin-left: 5px;
    }

    .bar .button-btn.button-btn {
        color: #fa0;
        margin-right: 5px;
    }

    .item-images li {
        display: inline-block;
        padding: 5px 10px 5px 0px;
    }

    .bar a.icon.icon-cross {
        color: #333;
    }

    .top-content {
        width: 100%;
        padding: 10px 10px 0px 10px;
        background: #fff;
    }

    .img-content {
        position: relative;
    }

    .top-textarea {
        border: none;
        background: transparent;
        height: 80px;
        width: 100%;
    }

    .who-content {
        width: 100%;
        padding: 10px;
        background: #fff;
        clear: both;
    }

    .who-content table td {
        font-size: 14px;
    }

    .who-content.bottom-content {
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    }

    .dep-content {
        border-top: 1px solid #ddd;
        margin-top: 20px;
    }

    .sheet-content {
        border-bottom: 1px solid #ddd;
    }
    .c-item-content {
        background: #fff;
    }

    .who-content table {
        margin: 0 auto;
        width: 100%;
        table-layout: fixed;
    }

    .no-content {
        color: #999;
        font-size: 14px;
        vertical-align: middle;
    }

    .no-content.input {
        border: none;
        color: #333;
        width: 100%;
    }

    .no-content.public {
        color: #fa0;
    }

    .wc-tip {
        width: 100px;
    }

    .wc-icon {
        width: 30px;
    }

    .item-li {
        padding: 10px 10px 0px 15px;
    }

    .sub-li {
        margin-top: 10px;
        padding-bottom: 10px;
        border-bottom: 1px dashed #ddd;
    }

    .sub-li:last-child {
        border: none;
    }

    .item-title {
        margin: 0px;
    }

    /*.pitem-flg{
        background: #fa0;
        width: 30px;
        height: 20px;
    }*/
    .sub-textarea {
        margin-right: 40px;
    }

    .sub-textarea .textarea {
        width: 100%;
        height: 45px;
        border: 1px solid #ddd;
        font-size: 14px;
    }

    .sub-content {
        margin-top: 5px;
        margin-bottom: 10px;
        position: relative;
    }

    .capture-img {
        width: 40px;
        height: 40px;
        float: right;
    }

    .f-panel {

    }

    .uploadimg-container {
        float: left;
        display: inline-block;
    }
    .fp-left {
        width: 70px;
        float: left;
        position: relative;
        margin-bottom: 5px;
        overflow: hidden;
    }

    .delete-img {
        position: absolute;
        top: -4px;
        right: 2px;
        background: #eee;
        border-radius: 8px;
        font-size: 12px;
        padding: 2px;
    }

    .fp-right textarea {
        font-size: 14px;
        height: 60px;
        padding-left: 4px;
        width: calc(100% - 70px);
        border: 1px solid #ddd;
    }

    .fp-add {
        position: relative;
        float: left;
        width: 70px;
    }

    .add-file, .add-file0 {
        position: absolute;
        top: 0px;
        opacity: 0;
        font-size: 12px;
        width: 60px;
        height: 60px;
    }

    .add-file {
        right: 0px;
    }

    .add-file0 {
        left: 0px;
    }

    .capture-img-file {
        width: 40px;
        height: 40px;
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

    .user-item {
        float: left;
        font-size: 14px;
        color: #444;
    }

    .d-type-item {
        font-size: 14px;
        color: #444;
    }

    .handover-create .item-title {
        margin: 0px;
        display: inline-block;
        vertical-align: middle;
    }

    .handover-create .cic-title {
        width: 100%;
        min-height: 25px;
        position: relative;
    }

    .handover-create .cic-flag {
        display: inline-block;
        position: absolute;
        width: 6px;
        height: 15px;
        background: #fa0;
        left: -15px;
        top: 5px;
    }

    .handover-create .item-li ul {
        border-bottom: 1px solid #ddd;

    }

    .handover-create .item-li:last-child ul {
        border-bottom: none;
    }
    .handover-create .item-pic,.handover-create .subitem-pic{
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
