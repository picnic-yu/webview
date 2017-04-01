<template>
    <div class="page handover-create">
        <div class="container">
            <div class="content create-content" v-show="!display.success">
                <div class="top-content">
                    <textarea class="top-textarea require-text" placeholder="写下您的意见..." v-model="bo.content"
                              maxlength="1000"></textarea>

                    <div class="img-content">
                        <div class="uploadimg-container">
                            <div class="fp-left" v-for="path in bo.showPicPaths" track-by="$index">
                                <a class="item-pic pb-standalone" index="{{$index}}">
                                    <img width="60" height="60" v-bind:src="path" class="p-img p-img-{{$index}}"/>
                                </a>
                                <span class="delete-img icon-cross" v-on:click="deleteItemImg($index)"></span>
                            </div>
                            <div class="fp-add" @click="beforeUpload($event)">
                                <img width="60" height="60" src="../../../common/assets/imgs/add.png"/>
                                <input class="add-file0" v-show="!isAndroid" type="file" name="upload0" multiple accept="image/*"/>
                            </div>
                        </div>
                        <div class="clearboth"></div>
                    </div>
                </div>
                <div class="dep-content who-content">
                    <table>
                        <tr>
                            <td valign="top" class="wc-tip">联系手机</td>
                            <td valign="top" class="wc-userlist">
                                <input class="phone" type="tel" placeholder="您的手机号码" v-model="phone"/>
                            </td>
                        </tr>
                    </table>
                </div>
                <p class="submit-panel"><a class="button button-fill  button-orange disabled" v-on:click="submit()"
                                           v-bind:class="!bo.content?'disabled':''">提交</a></p>
                
                <div class="footer"><a class="call" href="tel:400-100-1392">呼叫客服</a></div>

                <div class="blank"></div>
            </div>
            <div class="content" v-show="display.success">
                <h4 class="success">很荣幸您对我们的产品做出评价，我们会在最短时间内处理您的反馈建议，谢谢。</h4>

                <p class="submit-panel"><a class="button button-fill  button-success" v-on:click="close()">关闭</a></p>
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
    var Vue = require('vue');
    var maxImgNum = 3;//最多可以上传的图片数目
    var myPhotoBrowserStandalone;
    module.exports = {
        data: function () {
            return {
                isAndroid:$.device.android&&Constant.gallery==1,
                layout: {
                    width: $('body').width()
                },
                display: {
                    nodata: false,
                    success: false,
                    searchOther: false
                },
                done: false,//是否完成创建
                submiting: false,//是否正在提交
                bo: {},
                phone: '',
                pics: [],
                loading: false,
                refreshInit: false,
                showBackBtn: Constant.showBackBtn
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
                dragula([$('.img-content .uploadimg-container')[0]], {
                    moves: function (el) {
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
            bindItemEvent: function () {
                var _this = this;
                //安卓选完相册后的回调
                window.receiveGalleryData = function (base64,width,height) {
                    base64 = 'data:image/png;base64,'+base64;
                    if (!_this.bo.showPicPaths) _this.bo.showPicPaths = [];
                    _this.bo.showPicPaths.push(base64);
                };
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
                        },
                        navbarTemplate: '<header class="bar bar-nav">' +
                        '<h1 class="title" style="float: left;"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">/</span> <span class="photo-browser-total"></span></div></h1>' +
                        '</header>'
                    });
                    myPhotoBrowserStandalone.open();
                });


            },
            getData: function () {
                var _this = this;
                this.$http.post('/service/getFeedBack.action', {
                    token: Constant.token
                }).then(function (ret) {
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        var data = ret.data.data.data;
                        _this.bo = data;
                        setTimeout(_this.bindItemEvent, 1000);
                    }
                });
            },
            clearData: function () {
                this.bo = '';
            },
            deleteItemImg: function (index) {
                this.bo.showPicPaths.splice(index, 1);
            },
            submit: function () {
                if (this.submiting || !this.bo.content) {
                    return;
                }
                var hasTextSth = false;
                $('.require-text').each(function () {
                    if (this.value) {
                        hasTextSth = true;
                    }
                });
                if (!hasTextSth) {
                    $.toast('写下您的意见吧');
                    return;
                }
                if ($('.handover-create .pb-standalone').length > maxImgNum) {
                    $.toast('上传的图片最多不能超过' + maxImgNum + '张');
                    return;
                }
                if (this.phone) {
                    var phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                    if (!phoneReg.test(this.phone)) {
                        $.toast('请输入正确的联系手机');
                        return;
                    }
                }
                this.bo.subItems[0].childs[0].content = this.phone;
                var _this = this;
                Vue.http.options.emulateJSON = false;
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
                        _this.display.success = true;
                    } else {
                        $.toast('提交失败');
                    }
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
            },
            beforeUpload: function (event) {
                if ($('.handover-create .pb-standalone').length >= maxImgNum) {
                    $.toast('上传的图片最多不能超过' + maxImgNum + '张');
                    event.preventDefault();
                    event.stopPropagation();
                }
                //调用安卓相册
                if(this.isAndroid){
                    try{
                        window.webview && window.webview.openGallery(maxImgNum,$('.handover-create .pb-standalone').length);
                    }catch(e){
                        $.toast('error');
                    }
                    return;
                }
            },
            close: function () {
                if ($.device.android) {
                    window.webview && window.webview.closeCurrentInterface();
                } else if ($.device.ios) {
                    try {
                        window.webkit.messageHandlers.closeCurrentInterface.postMessage(1);
                    } catch (e) {
                    }
                }
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

    .phone {
        border: none;
    }

    .success {
        padding: 10px 15px;
    }
.footer{
    position: absolute;
    bottom:20px;
    width: 100%;
    height:32px;
    text-align: center;
}
.call{
    text-align: center;
    width:120px;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    border-radius: 10px;
    color: #fff;
    background: #fa0;
}
.call:active{
    background: #f90;
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
