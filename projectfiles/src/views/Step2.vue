<template>
    <div class="page-group">
        <div class="page page-current" id="index">
            <header class="bar bar-nav">
                <h1 class='title'>工程归档</h1>
                <a class="right-menu" v-on:click="toggleEdit()" v-if="hasPrivilege" v-bind:class="editStatus?'red':''">{{optName}}</a>
            </header>
            <div class="content">
                <form id="f1"  method="post"  target="tmpframe" enctype="multipart/form-data">
                 <input type="hidden" name="deptId" v-model="shopInfo.id" />
                    <input type="hidden" name="typeId" v-model="curTypeId" />
                 <div class="hidden"></div>
                <ul>
                    <li v-for="type in types" class="li-row">
                        <div class="item-step2" >
                            <h2 class="content-title">{{type.name}}</h2>
                            <div class="content-panel">
                                <ul>
                                    <li v-for="childType in type.childred" class="li-{{childType.id}}">
                                        <div class="f-title">{{childType.name}}</div>
                                        <div class="f-panel">
                                            <div class="fp-left" v-for="attachment in childType.attachments">
                                                <a class="item-pic pb-standalone cc-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">
                                                    <img  width="60" height="60" v-bind:src="attachment.thumbPath" osrc="{{attachment.path}}"/>
                                                </a>
                                                <span class="delete-img icon-cross" v-show="editStatus" v-on:click="deleteImg(childType,attachment.id,$index)"></span>
                                            </div>
                                            <div class="fp-add">
                                                <img width="60" height="60" src="../../../common/assets/imgs/add.png" />
                                                <input class="add-file add-{{childType.id}}" index0="{{$parent.$index}}" index1="{{$index}}" typeId="{{childType.id}}" type="file" name="data" accept="image/*"/>
                                            </div>
                                            <!--<div class="fp-row fp-row-img cc-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}" >

                                            </div>
                                            <div class="fp-row fp-addrow">

                                            </div>-->
                                            <!--<div class="fp-row row-des" v-show="!childType.showTextArea" >
                                                <div  class="search-shop-tip">{{childType.description?childType.description:'添加描述'}}</div>
                                            </div>-->
                                            <div class="fp-row row-des-input">
                                                <div class="text-area-container">
                                                    <div  class="search-shop-tip search-shop-tip-{{childType.id}}">{{childType.descript?childType.descript:'添加描述'}}</div>
                                                    <textarea class="text-area textarea-{{childType.id}}" v-on:click="showTextArea(childType)" maxlength="100"  v-model="childType.desCopy"  placeholder="添加描述"></textarea>
                                                    <div class="btn-panel" v-show="childType.showTextArea">
                                                        <p  class="submit-panel submit-panel-small pull-right"><a class="button button-fill  button-orange"  v-on:click="submitTextArea(childType)" v-bind:class="">提交</a></p>
                                                        <p  class="submit-panel submit-panel-small pull-right"><a class="button button-fill  button-light"  v-on:click="hideTextArea(childType)" v-bind:class="">取消</a></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
                <div>
                    <div class="item-step2 item-form" >
                        <h2 class="content-title">联系方式</h2>
                        <div class="content-panel">
                            <div class="list-block">
                                <form action="javascript:void(0);">
                                    <ul>
                                        <li>
                                            <div class="item-content">
                                                <div class="item-inner">
                                                    <div class="item-title label">安装人员</div>
                                                    <div class="item-input"><input type="text" v-model="baseInfo.builder" placeholder="请输入现场施工人员的称呼" maxlength="30"/></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="item-content">
                                                <div class="item-inner">
                                                    <div class="item-title label">工人电话</div>
                                                    <div class="item-input"><input type="tel" placeholder="请输入施工人员的联系方式" v-model="baseInfo.builderPhone" maxlength="30"/></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="item-content">
                                                <div class="item-inner">
                                                    <div class="item-title label">安装日期</div>
                                                    <div class="item-input"><input type="text" id="buildTime" placeholder="请选择施工日期" v-model="baseInfo.builderTimeStr" readonly/></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="item-content">
                                                <div class="item-inner">
                                                    <div class="item-title label">门店电话</div>
                                                    <div class="item-input"><input type="tel" placeholder="请输入施工门店的联系方式" v-model="baseInfo.deptPhone" maxlength="30"/></div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul></form>
                            </div>
                            <p class="submit-panel"><a class="button button-fill  button-orange"  v-on:click="submitBaseInfo()" v-bind:class="doing?'disabled':''">提交</a></p>
                        </div>
                    </div>
                </div>
                <div class="footer-blank"></div>
            </form>
            </div>
        </div>
        <iframe name="tmpframe"  width="400" height=40 frameborder=0 style="display: none"></iframe>
    </div>
</template>
<script>
    require('../../../common/assets/css/sm-extend.min.css');
    require('../../../common/assets/font.css');
    require('../../../common/libs/sm-extend.js');
    var commonutils = require('../../../common/assets/js/commonutils');
    module.exports = {
        route:{
            data:function(transition){
                transition.next({
                    shopInfo:Constant.shopInfo
                });
            }
        },
        data:function(){
            return {
                shopInfo:{
                    id:'',
                    name:''
                },
                editStatus:false,
                hasPrivilege:false,
                optName:'编辑',
                curTypeId:-1,//当前上传的图片的类型
                pics:[],
                types:[],
                baseInfo:{},
                doing:false
            }
        },
        components:{

        },
        ready: function () {
            this.init();
        },
        methods: {
            init: function () {
                this.shopInfo = Constant.shopInfo;
                if(!this.shopInfo.id){
                    $.toast('请选择一个门店');
                    return;
                }
                $('#buildTime').calendar({
                    maxDate:commonutils.formatDateTime(new Date(),1).replace(/-/g,'/'),
                });
                this.getTypes();
                this.getBaseInfo();
            },
            bind:function(){
                var _this = this;
                $('textarea.text-area').each(function(){
                    var tip = $(this).prev();
                    if(tip.height() > 60){
                        $(this).height(tip.height());
                    }
                });
                this.bindPicEvent();
                $(document).off('change','.add-file').on('change','.add-file',function(){
                    var _file = this;
                    var $addImg = $(this).prev();
                    var file = this.files[0];
                    if(file.size > 1024*1024*10){
                        $.toast('图片大小不能超过10M');
                        return;
                    }
                    var typeId = $(this).attr('typeId');
                    var item = getChildType(_this.types,typeId);
                    _this.curTypeId = typeId;
                    var index1 = $(this).attr('index1');//大类的index
                    var index2 = $(this).attr('index2');//小类的Index
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    $.showPreloader('正在上传...');
                    reader.onload = function(){
                        _this.submit(_file,item);
                        //上传成功之后重置input
                        $($addImg).parent().append('<input class="add-file add-'+typeId+'" index1="'+index1+'" index1="'+(index2+1)+'"  typeId="'+typeId+'" name="data" type="file" accept="image/*"/>');
                    };
                });
            },
            bindPicEvent:function(){
                //点击时打开图片浏览器
                var _this = this;
                $(document).off('click','.pb-standalone').on('click','.pb-standalone',function(){
                    var index = $(this).attr('index');
                    //获取当前点击的记录的图片信息
                    var photos = _this.pics;
                    var myPhotoBrowserStandalone = $.photoBrowser({
                        photos : photos,
                        initialSlide:index,
                        toolbar: false,
                        theme: 'dark',
                        loop: false,
                        lazyLoading: true,
                        lazyLoadingInPrevNext: true,
                        navbarTemplate:'<header class="bar bar-nav">' +
                        '<a class="icon icon-right pull-right photo-browser-close-link icon-cross"></a>' +
                        '<h1 class="title" style="float: left;"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">/</span> <span class="photo-browser-total"></span></div></h1>' +
                        '</header>'
                    });
                    myPhotoBrowserStandalone.open();
                });
            },
            /**
             * 获取需要上传文件的大小类
             */
            getTypes:function(){
                var _this = this;
                this.doing = true;
                this.$http.post('/service/getUploadPictureType.action?token='+Constant.token,{
                    deptId:this.shopInfo.id
                }).then(function(ret){
                    _this.doing = false;
                    if(ret.ok && ret.data){
                        if(ret.data.result == 'ok'){
                            var data = ret.data.data.data;
                            _this.hasPrivilege = ret.data.data.privilege;
                            _this.formatData(data);
                            _this.types = Constant.types = data;
                            $.extend(true,Constant.originalTypes,Constant.types);//深度拷贝
                            _this.resetSeq();
                            setTimeout(_this.bind,1000);
                        }else{
                            $.toast('获取服务器数据异常');
                            _this.hasPrivilege = false;
                        }
                    }else{
                        _this.hasPrivilege = false;
                    }
                });
            },
            getBaseInfo:function(){
                var _this = this;
                this.$http.post('/service/getDeptAttachmentInfo.action?token='+Constant.token,{
                    deptId:this.shopInfo.id
                }).then(function(ret){
                    if(ret.ok && ret.data){
                        if(ret.data.result == 'ok'){
                            _this.baseInfo = ret.data.data.data;
                        }
                    }
                });
            },
            submitTextArea:function(childType){
                if(childType.desCopy == childType.descript){
                    this.hideTextArea(childType);
                    return;
                }
                var _this = this;
                childType.descript = childType.desCopy;
                this.$http.post('/service/updateDescByDeptType.action?token='+Constant.token,{
                    descriptId:childType.descriptId,
                    deptId:this.shopInfo.id,
                    descript:childType.descript,
                    typeId:childType.id
                }).then(function(ret){
                    if(ret.data.result == 'ok'){
                        $.toast('添加描述成功',true);
                        _this.hideTextArea(childType);
                        childType.descript = childType.desCopy;
                        setTimeout(function(){
                            if($('.search-shop-tip-'+childType.id).height() > 60){
                                $('.textarea-'+childType.id).height($('.search-shop-tip-'+childType.id).height());
                            }else{
                                $('.textarea-'+childType.id).height(60);
                            }
                        },500);
                    }else{_this.submit(_file,item);
                        $.toast('添加描述失败');
                    }
                });
            },
            submitBaseInfo:function(){
                if(!this.baseInfo.builder){
                    $.toast("请输入施工人员称呼");
                    return;
                }
                if(!this.baseInfo.builderPhone){
                    $.toast("请输入施工人员联系方式");
                    return;
                }
                if(!this.baseInfo.builderTimeStr){
                    $.toast("请选择施工日期");
                    return;
                }
                if(!this.baseInfo.deptPhone){
                    $.toast("请输入施工门店联系方式");
                    return;
                }
                this.$http.post('/service/saveOrUpdateDeptAttachInfo.action?token='+Constant.token,{
                    deptAttachId:this.baseInfo.id,
                    deptId:this.baseInfo.deptId,
                    builder:this.baseInfo.builder,
                    builderTime:this.baseInfo.builderTimeStr+" 00:00:00",
                    builderPhone:this.baseInfo.builderPhone,
                    deptPhone:this.baseInfo.deptPhone
                }).then(function(ret){
                    if(ret.data.result == 'ok'){
                        $.toast('提交成功');
                    }else{
                        $.toast('提交失败');
                    }
                });
            },
            submit:function(_fileinput,item){
                var _this = this;
                setTimeout(function(){
                    var vFD = new FormData(document.getElementById('f1'));
                    var oXHR = new XMLHttpRequest();
                    //oXHR.upload.addEventListener('progress', uploadProgress, false);
                    oXHR.addEventListener('load', function(o){
                        $.hidePreloader();
                        var res = JSON.parse(oXHR.response);
                        if(res.result == "ok"){
                            $.toast('上传成功');
                            item.attachments.push(res.data.attachment);
                            _this.resetSeq();
                            $(_fileinput).remove();
                        }
                    }, false);
                    oXHR.addEventListener('error', function(){
                        $.hidePreloader();
                        $.toast('上传失败');
                    }, false);
                    oXHR.addEventListener('abort', function(){
                        $.hidePreloader();
                        $.toast('abort');
                    }, false);
                    oXHR.open('POST', '/service/pictureUpload.action?token='+Constant.token);
                    oXHR.send(vFD);
                },1000);
            },
            deleteImg:function(childType,id,index){
                var _this = this;
                this.$http.post('/service/deleteAttachmentImageById.action?token='+Constant.token,{
                    imageId:id
                }).then(function(ret){
                    if(ret.data.result == 'ok'){
                        $.toast('删除成功');
                        childType.attachments.splice(index,1);
                        _this.resetSeq();
                    }else{
                        $.toast('删除失败');
                    }
                });
            },
            toggleEdit:function(){
                this.editStatus = !this.editStatus;
                if(this.editStatus){
                    this.optName = '完成';
                }else{
                    this.optName = '编辑';
                }
            },
            /**
             * 重新计算每个input name数组的下标
             */
            resetIndex:function(){
                var types = this.types;
                var i = 0;
                $('.fp-row-img').each(function(){
                    var clses = this.className.split(' ');
                    var cc_cls = clses[2];
                    var indexArr = cc_cls.replace('cc-','').split('-');
                    var index0 = indexArr[0],index1 = indexArr[1],index2 = indexArr[2];
                    types[index0].childred[index1].childred[index2].index = i;
                    i++;
                });
            },
            resetSeq:function(){
                this.pics = [];
                var _this = this;
                setTimeout(function(){
                    var i=0;
                    $('.pb-standalone').each(function(){
                        $(this).attr('index',i++);
                        _this.pics.push($(this).find('img').attr('osrc'));
                    });
                },500);
            },
            formatData:function(list){
                for(var i=0;i<list.length;i++){
                    var children = list[i].childred;
                    for(var j=0;j<children.length;j++){
                        var item = children[j];
                        item.showTextArea = false;//是否显示描述框
                        item.desCopy = null;
                    }
                }
            },
            showTextArea:function(childType){
                if(childType.showTextArea) return;
                childType.showTextArea = true;
                childType.desCopy = childType.descript;
                $('.textarea-'+childType.id).css('opacity',1);
                $('.search-shop-tip-'+childType.id).css('opacity',0);
            },
            hideTextArea:function(childType,justHide){
                childType.showTextArea = false;
                $('.textarea-'+childType.id).css('opacity',0);
                $('.search-shop-tip-'+childType.id).css('opacity',1);
            },
            clearData:function(){
                $('.hidden').empty();
                this.types = [];
                return;
                $.extend(true,Constant.types,Constant.originalTypes);//深度拷贝
                this.types = Constant.types;
            },
            success:function(){
                var _this = this;
                $.actions([[{
                    text:'继续上传',
                    bold:true,
                    onClick:function(){
                        _this.clearData();
                    }
                }],[{
                    text:'归档完成',
                    bold:true,
                    bg:'danger',
                    onClick:function(){
                        $('.submit-panel').remove();
                        window.webview　&& window.webview.goBack(true);
                    }
                }]]);
            }
        }
    };

    function getChildType(list,id){
        for(var i=0;i<list.length;i++){
            var children = list[i].childred;
            for(var j=0;j<children.length;j++){
                var item = children[j];
                if(item.id == id){
                    return item;
                }
            }
        }
    }
</script>
<style>
    .content{
        background-color: #eee;
        overflow-x:hidden ;
    }
    .content-title{
        padding: 4px 10px;
        margin:0px;
        font-size: 16px;
    }
    .content-panel{
        border:1px solid #ddd;
        margin:10px 10px 10px 10px;
        min-height:50px;
        background: #fff;
    }
    .f-title{
        padding:10px;
        border-bottom: 1px solid #ddd;
        background: #fcfcfc;
        font-size: 14px;
    }
    .f-panel{
        padding:10px;
    }
    .fp-left{
        width: 70px;
        float:left;
        position: relative;
    }
    .fp-right{
        width: 100%;
    }
    .fp-right textarea{
        font-size: 14px;
        height: 60px;
        padding-left:4px;
        width: calc(100% - 70px);
        border: 1px solid #ddd;
    }
    .fp-row{
        clear: both;
    }
    .fp-add{
        position: relative;
        float: left;
        width:70px;
    }
    .fp-add input{
        position: absolute;
        top:0px;
        left:0px;
        opacity: 0;
        font-size: 12px;
        width: 60px;
        height: 60px;
    }
    .file-input{
        display: none;
    }
    .hidden{
        display: none;
    }
    .footer-blank{
        height:50px;
    }
    .submit-panel-small{
        width:60px;
    }
    .submit-panel-small .button.button-fill{
        height: 30px;
        line-height: 30px;
    }
    .search-shop-tip{
        font-size: 14px;
        height: auto;
        min-height: 60px;
        word-wrap: break-word;
    }
    .text-area{
        font-size: 14px;
        height: 60px;
        padding-left:4px;
        width: 100%;
        border: 1px solid #ddd;
        position: absolute;
        top:0px;
        z-index: 2;
        opacity: 0;
    }
    .btn-panel{
        height: 50px;
    }
    .row-des-input{
        height: auto;
        margin-top: 10px;
    }
    .readonly-input{
        border:none;
        overflow-y: visible;
    }
    .delete-img{
        position: absolute;
        top:-4px;
        right: 2px;
        background: #eee;
        border-radius: 8px;
        font-size: 12px;
        padding: 2px;
    }
    .right-menu{
        float: right;
        line-height: 2.2rem;
        height:2.2rem;
        color: #333;
        position: relative;
    }
    .text-area-container{
        position: relative;
        width: 100%;
    }
    .red{
        color: red;
    }
    .item-form .list-block input{
        font-size: 15px;
    }
    .item-form .list-block .item-title.label{
        font-size: 15px;
    }
    @media all and (max-width:360px){
        .item-form .list-block input{
            font-size: 12px;
        }
    }
</style>