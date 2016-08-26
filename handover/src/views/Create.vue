<template>
    <div class="page handover-create" :transition="transitionName">
        <div class="container">
            <header class="bar bar-nav">
                <h1 class='title'>{{shopInfo.name}}</h1>
                <button class="button button-link button-nav pull-right button-btn btn-submit" v-on:click="submit()">
                    提交
                </button>
            </header>
            <div class="content create-content">
                <div class="top-content">
                    <textarea class="top-textarea require-text" placeholder="说点什么..." v-model="bo.content"
                              maxlength="320"></textarea>

                    <div class="img-content">
                        <div class="fp-left" v-for="path in bo.showPicPaths" track-by="$index">
                            <a class="item-pic pb-standalone" index="{{$index}}">
                                <img width="60" height="60" v-bind:src="path"/>
                            </a>
                            <span class="delete-img icon-cross" v-on:click="deleteItemImg($index)"></span>
                        </div>
                        <div class="fp-add">
                            <img width="60" height="60" src="../../../common/assets/imgs/add.png"/>
                            <input class="add-file0" type="file" name="upload0" multiple accept="image/*"/>
                        </div>
                        <div class="clearboth"></div>
                    </div>
                </div>
                <div class="sheet-content who-content" v-on:click="whichTemplate()">
                    <table>
                        <tr>
                            <td valign="top" class="wc-tip">模板</td>
                            <td valign="top" class="wc-userlist">
                                <div class="no-content" v-show="!bo.moudleId">未选择模板</div>
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
                                        <div class="sub-content">
                                            <div class="capture-img">
                                                <img src="../../../common/assets/imgs/capture.png" width="40px"
                                                     height="40px"/>
                                                <input class="add-file capture-img-file add-{{subItem.confId}}"
                                                       typeId="{{subItem.confId}}" type="file" name="upload" multiple
                                                       accept="image/*"/>
                                            </div>
                                            <div class="sub-textarea">
                                                <textarea class="textarea require-text" v-model="subItem.content"
                                                          placeholder="描述..." maxlength="320"></textarea>
                                            </div>
                                        </div>
                                        <div class="f-panel" v-show="subItem.showPicPanel">
                                            <div class="fp-left" v-for="path in subItem.filePaths" track-by="$index">
                                                <a class="subitem-pic pb-standalone" index="{{$index}}"
                                                   subItemIndex="{{$parent.$index}}"
                                                   itemIndex="{{$parent.$parent.$index}}">
                                                    <img width="60" height="60" v-bind:src="path"/>
                                                </a>
                                                <span class="delete-img icon-cross"
                                                      v-on:click="deleteImg(subItem,subItem.confId,$index)"></span>
                                            </div>
                                            <div class="fp-add">
                                                <img width="60" height="60" src="../../../common/assets/imgs/add.png"/>
                                                <input class="add-file add-{{subItem.confId}}"
                                                       typeId="{{subItem.confId}}" type="file" name="upload" multiple
                                                       accept="image/*"/>
                                            </div>
                                            <div class="clearboth"></div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="dep-content who-content" v-on:click="whichDep()">
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
                <div class="who-content bottom-content" v-on:click="atWho()">
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
                <div class="blank"></div>
            </div>
        </div>
    </div>
</template>

<script>
    require('../../../common/assets/css/sm-extend.min.css');
    require('../../../common/assets/font.css');
    require('../../../common/libs/sm-extend.js');
    var commonutils = require('../../../common/assets/js/commonutils');
    var Vue = require('vue');
    var num = 20;//每页显示的条数
    var maxImgNum = 12;//最多可以上传的图片数目
    var myPhotoBrowserStandalone;
    module.exports = {
        route: {
            data: function (transition) {
                if (!this.bo) {
                    this.getData();
                } else {
                    Constant.bo.deptId = Constant.shopInfo.id;
                    Constant.bo.deptName = Constant.shopInfo.name;
                    this.bo.isOpen = Constant.create.isOpen;
                }
                if (transition.from.name == 'templates') {
                    //根据模板获取具体模板内容
                    if (this.bo.moudleId) {
                        this.getTemplateItems(this.bo.moudleId);
                    }
                    else {
                        Constant.bo.subItems = this.bo.subItems = this.items = [];//如果没有选择模板，清空模板内容
                    }
                }
                transition.next({
                    done: false,
                    userlist: Constant.selectedUsers,
                    bo: Constant.bo,
                    isAtAll: Constant.bo ? Constant.bo.isAtAll : 0,
                    items: (Constant.bo && Constant.bo.subItems) ? Constant.bo.subItems : [],
                    shopInfo: Constant.shopInfo
                });
            },
            deactivate: function (transition) {
                if (myPhotoBrowserStandalone) {
                    myPhotoBrowserStandalone.close();
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
                done: false,//是否完成创建
                bo: Constant.bo,
                userlist: Constant.selectedUsers,
                pics: [],
                items: (Constant.bo && Constant.bo.subItems) ? Constant.bo.subItems : [],
                hasCreateToday: false,//今天是否已经创建过
                loading: false,
                refreshInit: false
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
                this.getData('', opt);
            },
            bindItemEvent: function () {
                var _this = this;
                $(document).off('change', '.add-file0').on('change', '.add-file0', function () {
                    if ($('.handover-create .pb-standalone').length > maxImgNum) {
                        $.toast('上传的图片最多不能超过' + maxImgNum + '张');
                        return;
                    }
                    var $addImg = $(this).prev();
                    var _file = this;
                    var successNum = 0, fileNum = this.files.length;
                    for (var i = 0; i < fileNum; i++) {
                        var file = this.files[i];
                        if (file.size > 1024 * 1024 * 10) {
                            $.toast('图片大小不能超过10M');
                            break;
                        }

                        var size = file.size / (1024 * 1024);//M
                        console.log("size:" + size);
                        console.log("qua:" + size <= 0.2 ? 1 : 0.2 / size);
                        (function (i) {
                            new html5ImgCompress(_file.files[i], {
                                quality: size <= 0.2 ? 1 : 0.2 / size,
                                before: function (file) {
                                    //console.log('多张: ' + i + ' 压缩前...');
                                },
                                done: function (file, base64) { // 这里是异步回调，done中i的顺序不能保证
                                    //console.log('多张: ' + i + ' 压缩成功...'+file.length+","+base64.length);
                                    successNum++;
                                    if (!_this.bo.showPicPaths) _this.bo.showPicPaths = [];
                                    _this.bo.showPicPaths.push(base64);
                                    if (successNum == fileNum) {
                                        $(_file).remove();
                                        //上传成功之后重置input
                                        $($addImg).parent().append('<input class="add-file0" name="upload0" type="file" multiple accept="image/*"/>');
                                    }
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

                        /*var size = file.size/(1024 * 1024);//M
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function () {
                         if(size <= 0.005){//小于500K的图片不需要压缩处理
                         successNum++;
                         if (!_this.bo.showPicPaths) _this.bo.showPicPaths = [];
                         _this.bo.showPicPaths.push(this.result);
                         if (successNum == fileNum) {
                         $(_file).remove();
                         //上传成功之后重置input
                         $($addImg).parent().append('<input class="add-file0" name="upload0" type="file" multiple accept="image/!*"/>');
                         }
                         }else{
                         var img  = new Image();
                         img.src = this.result;
                         img.onload = function(){
                         console.log(size);
                         var newUrl = commonutils.compressImg(img,0.5);
                         console.log(newUrl.length/(1024*1024));
                         successNum++;
                         if (!_this.bo.showPicPaths) _this.bo.showPicPaths = [];
                         _this.bo.showPicPaths.push(newUrl);
                         if (successNum == fileNum) {
                         $(_file).remove();
                         //上传成功之后重置input
                         $($addImg).parent().append('<input class="add-file0" name="upload0" type="file" multiple accept="image/!*"/>');
                         }
                         };
                            }
                         };*/
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
                        navbarTemplate: '<header class="bar bar-nav">' +
                        '<a class="icon icon-right pull-right photo-browser-close-link icon-cross"></a>' +
                        '<h1 class="title" style="float: left;"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">/</span> <span class="photo-browser-total"></span></div></h1>' +
                        '</header>'
                    });
                    myPhotoBrowserStandalone.open();
                    $('.photo-browser .content').off('click').on('click', function () {
                        myPhotoBrowserStandalone.close();
                    });
                });


            },
            bindSubItemEvent: function () {
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
                        navbarTemplate: '<header class="bar bar-nav">' +
                        '<a class="icon icon-right pull-right photo-browser-close-link icon-cross"></a>' +
                        '<h1 class="title" style="float: left;"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">/</span> <span class="photo-browser-total"></span></div></h1>' +
                        '</header>'
                    });
                    myPhotoBrowserStandalone.open();
                    $('.photo-browser .content').off('click').on('click', function () {
                        myPhotoBrowserStandalone.close();
                    });
                });
                $(document).off('change', '.add-file').on('change', '.add-file', function () {
                    if ($('.handover-create .pb-standalone').length > maxImgNum) {
                        $.toast('上传的图片最多不能超过' + maxImgNum + '张');
                        return;
                    }
                    var $addImg = $(this).prev();
                    var _file = this;
                    var successNum = 0, fileNum = this.files.length;
                    var typeId = $(this).attr('typeId');
                    var subItem = getChildType(_this.items, typeId);
                    for (var i = 0; i < fileNum; i++) {
                        var file = this.files[i];
                        if (file.size > 1024 * 1024 * 10) {
                            $.toast('图片大小不能超过10M');
                            break;
                        }

                        var size = file.size / (1024 * 1024);//M
                        (function (i) {
                            new html5ImgCompress(_file.files[i], {
                                quality: size <= 0.2 ? 1 : 0.2 / size,
                                before: function (file) {
                                    //console.log('多张: ' + i + ' 压缩前...');
                                },
                                done: function (file, base64) { // 这里是异步回调，done中i的顺序不能保证
                                    //console.log('多张: ' + i + ' 压缩成功...'+file.length+","+base64.length);
                                    successNum++;
                                    if (!subItem.filePaths) subItem.filePaths = [];
                                    subItem.filePaths.push(base64);
                                    if (successNum == fileNum) {
                                        $(_file).remove();
                                        //上传成功之后重置input
                                        $($addImg).parent().append('<input class="add-file add-' + typeId + '" typeId="' + typeId + '" name="upload" type="file" multiple accept="image/!*"/>');
                                        _this.showPicPanel(subItem);
                                    }
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
            },
            goToUserlist: function () {
                router.go({path: '/userlist'});
            },
            whichDep: function () {
                router.go({name: 'shoplist', params: {dowhich: 1}});
            },
            showPicPanel: function (sitem) {
                if (sitem.showPicPanel) return;
                Vue.set(sitem, 'showPicPanel', true);
            },
            deleteItemImg: function (index) {
                this.bo.showPicPaths.splice(index, 1);
            },
            deleteImg: function (sitem, id, index) {
                sitem.filePaths.splice(index, 1);
            },
            atWho: function () {
                router.go({name: 'mutipleuserlist'});
            },
            whichTemplate: function () {
                router.go({name: 'templates'});
            },
            submit: function () {
                var hasTextSth = false;
                $('.require-text').each(function () {
                    if (this.value) {
                        hasTextSth = true;

                    }
                });
                if (!hasTextSth) {
                    $.toast('说点什么吧');
                    return;
                }
                if ($('.handover-create .pb-standalone').length > maxImgNum) {
                    $.toast('上传的图片最多不能超过' + maxImgNum + '张');
                    return;
                }
                if (!this.bo.deptId && this.bo.isOpen == 0) {
                    $.toast('请选择一个门店');
                    return;
                }
                var _this = this;
                Vue.http.options.emulateJSON = false;
                this.bo.deptId = Constant.shopInfo.id;
                this.bo.reminders = getUserIds(this.userlist);
                this.bo.isAtAll = Constant.bo.isAtAll;
                if (!this.bo.deptId) {
                    this.bo.deptId = 0;
                    this.bo.isOpen = 1;
                } else {
                    this.bo.isOpen = 0;
                }
                $.showPreloader('正在处理');
                this.$http.post('/service/saveHandoverBookBo.action?token=' + Constant.token, {
                    handoverBookBo: this.bo,
                    token: Constant.token
                }).then(function (ret) {
                    Vue.http.options.emulateJSON = true;
                    $.hidePreloader();
                    if (ret.data.result == 'ok') {
                        $.toast('提交成功');
                        _this.done = true;
                        Constant.needRefresh = true;
                        router.go({name: 'default'});
                    } else {
                        $.toast('提交失败');
                    }
                });
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

</script>

<style>
    .handover-create li {
        display: block;
    }

    .content.create-content {
        background: #f5f5f5;
        overflow-x: hidden;
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

    .fp-left {
        width: 70px;
        float: left;
        position: relative;
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

    .handover-create .item-title {
        margin: 0px;
        display: inline-block;
        vertical-align: middle;
    }

    .handover-create .cic-title {
        width: 100%;
        height: 25px;
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

    @media all and (max-width: 360px) {
        .timebox .date-time {
            font-size: 12px;
        }

        .is-today {
            font-size: 12px;
        }
    }
</style>
