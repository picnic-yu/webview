<template>
    <div class="page-group">
       <div class="page page-current" id="index">
           <header class="bar bar-nav">
               <h1 class='title'>点检任务列表</h1>
               <button class="button pull-right cancel-button" v-on:click="addCheckTask()">添加</button>
           </header>
           <div id="checkListContent" class="content content-items pull-to-refresh-content infinite-scroll"  data-ptr-distance="55" data-distance="240">
               <div class="pull-to-refresh-layer">
                   <div class="preloader"></div>
                   <div class="pull-to-refresh-arrow"></div>
               </div>
               <div class="items-list">
               <ul>
                   <li v-for="item in items" v-on:click="detail(item)">
                       <div class="item-des">
                         <span class="item-name">{{item.name}}</span>
                       </div>
                   </li>
               </ul>
               </div>
               <div class="infinite-scroll-preloader">
                   <div class="preloader"></div>
               </div>
           </div>
       </div>
       <detail></detail>
    </div>
</template>
<script>
    require('../../../common/assets/font.css');
    var commonutils = require('../../../common/assets/js/commonutils');
    var num = 20;//每页显示的条数
    module.exports = {
        route:{
            data:function(transition){
                var _this = this;
                 transition.next({
                          page:{
                            index:0,
                            num:num
                          }
                 });
            },
           deactivate:function(transition){
             this.unbindInfinite();
             this.clearData();
             transition.next();
           }
        },
        data:function(){
            return {
                page:{
                      index:0,
                      num:num,
                      total:0
                    },
                editStatus:false,
                loading:false,
                scrollInit:false,
                items:[],
                refreshInit:false
            }
        },
        events:{
            'refresh':function(){
                this.refresh();
            }
        },
        components:{
            detail: require('./../components/Detail.vue')
        },
        ready: function () {
            this.init();
        },
        methods: {
            init: function (opt) {
            var _this = this;
            if(!this.refreshInit){
                      $('#checkListContent').scroller({
                        type: 'native'
                      });
                      $.initPullToRefresh('#checkListContent');
                      $(document).on('refresh','#checkListContent',function(e){
                        _this.refresh();
                      });
                      this.refreshInit = true;
               }
               this.bindInfiniteEvent();
               var _this = this;
               this.getData(function(){
                 if(_this.page.total <= _this.items.length){
                   _this.unbindInfinite();
                 }
               $.refreshScroller();
               });
            },
            getData:function(callback,searchData){
                    var _this = this;
                    this.loading = true;
                    searchData = searchData?searchData:this;
                    this.$http.post('/service/getuserchecktask.action?token='+Constant.token,{
                      index:searchData.page.index,
                      num:searchData.page.num
                    }).then(function(ret){
                      _this.loading = false;
                      if(ret.ok && ret.data && ret.data.result == 'ok'){
                        if(_this.page.index == 0){
                          _this.items = ret.data.data.data;
                        }else{
                          _this.items = _this.items.concat(ret.data.data.data);
                        }
                        _this.page.total = ret.data.data.total;
                        callback && callback();
                      }
                    });
            },
            reInitScroll:function(){
                this.unbindInfinite();
                this.bindInfiniteEvent();
            },
            bindInfiniteEvent:function(){
                var _this = this;
                $.attachInfiniteScroll($('#checkListContent'));
                $('#checkListContent .infinite-scroll-preloader').show();
                var func = function(e){
                  if(_this.loading) return;
                  _this.page.index += _this.page.num;
                  _this.getData(function(){
                    if(_this.page.total <= _this.items.length){
                      _this.unbindInfinite();
                    }
                    $.refreshScroller();
                  });
                };
            $(document).off('infinite','#checkListContent').on('infinite','#checkListContent',func);
        },
        unbindInfinite:function(){
                $.detachInfiniteScroll($('#checkListContent'));
                $('#checkListContent .infinite-scroll-preloader').hide();
        },
        clearData:function(){
                 this.page.index = 0;
                 this.items = [];
        },
        refresh:function(){
         this.page.index = 0;
         this.items = [];
         this.reInitScroll();
         var _this = this;
         this.getData(function(){
           if(_this.page.total <= _this.items.length){
             _this.unbindInfinite();
           }
           $.pullToRefreshDone('#checkListContent');
         });
        },
        detail: function (item) {
            this.$broadcast('popup', {
                name: 'detail',
                item: item,
                flag: true
            });
        },
        addCheckTask:function(){
            this.$broadcast('popup', {
                name: 'detail',
                item: {},
                flag:false
            });
        }
       }
    };
</script>
<style>
    html {
        height: 100%;
      }
    body {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color:#333;
    }
    #checkListContent{overflow-x: hidden;z-index:4;background: #fff;}
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
    .items-list ul{margin:0;padding:0px;}

    .items-list li {
        border-bottom: 1px solid #ddd;
        padding: 5px 10px;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
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

    .export-btn {
        margin-right: 20px;
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

    .list-block .item-inner {
        color: red;
    }

    .list-block .item-inner .item-title.label {
        color: #333;
    }

    .submit-baseinfo {
        display: none;
    }

    .cancel-button{
       background-color:#ccc;
       border:none;
       color:#333;
       width:3rem;
       height:1.7rem;
       line-height:1.7rem;
    }
    @media all and (max-width:360px){
        .item-form .list-block input{
            font-size: 12px;
        }
    }
</style>