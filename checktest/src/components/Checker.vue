<template>
    <div class="popup popup-checker">
        <header class="bar bar-nav">
                <button class="button pull-left cancel-button" v-on:click="close()">返回</button>
                <h1 class='title'>点检人</h1>
        </header>
        <div id="checkerListContent"  class="content content-items pull-to-refresh-content infinite-scroll" data-ptr-distance="55" data-distance="240">
            <div class="pull-to-refresh-layer">
                   <div class="preloader"></div>
                   <div class="pull-to-refresh-arrow"></div>
            </div>
            <div class="eval-list">
                <div class="child-container"><ul><li v-for="item in items" v-on:click="selectChecker(item.id)"><span v-bind:class="selectcheckerId==item.id?'checker-selected':''" class="item-name">{{item.showName}}</span></li></ul></div>
            </div>
            <div class="infinite-scroll-preloader">
                <div class="preloader"></div>
            </div>
        </div>
    </div>
</template>
<script>
    require('../../../common/assets/font.css');
    var num = 20;//每页显示的条数
    module.exports = {
        route:{
            data:function(transition){
            },
            deactivate:function(transition){
            }
        },
        data: function () {
            return {
                    page:{
                          index:0,
                          num:num,
                          total:0
                        },
                    loading:false,
                    scrollInit:false,
                    items:[],
                    selectcheckerId:'',
                    refreshInit:false
                    };
        },
        events:{
                    'popup':function(param){
                        if(param.name == 'checker'){
                            $.popup('.popup-checker');
                            this.selectcheckerId = '';
                            if(param.selectchecker&&param.selectchecker.length>0){
                                this.selectcheckerId = param.selectchecker[0].id;
                            }else{
                                this.selectcheckerId = '';
                            }
                            this.init();
                        }
                    },
                    'refresh':function(){
                        this.refresh();
                    }
                },
                methods: {
                    init: function (opt) {
                    var _this = this;
                    if(!this.refreshInit){
                              $('#checkerListContent').scroller({
                                type: 'native'
                              });
                              $.initPullToRefresh('#checkerListContent');
                              $(document).on('refresh','#checkerListContent',function(e){
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
                            this.$http.post('/service/getUsersByPrivilege.action?token='+Constant.token,{
                              privilegeNames:'CHECK',
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
                        $.attachInfiniteScroll($('#checkerListContent'));
                        $('#checkerListContent .infinite-scroll-preloader').show();
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
                    $(document).off('infinite','#checkerListContent').on('infinite','#checkerListContent',func);
                },
                unbindInfinite:function(){
                        $.detachInfiniteScroll($('#checkerListContent'));
                        $('#checkerListContent .infinite-scroll-preloader').hide();
                },
                clearData:function(){
                         this.page.index = 0;
                         this.items = [];
                },
                close:function(){
                    $.closeModal('.popup-checker');
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
                   $.pullToRefreshDone('#checkerListContent');
                 });
                },
                selectChecker:function(id){
                   for(var i=0;i<this.items.length;i++){
                       if(this.items[i].id == id){
                        this.$dispatch('checker', {
                              selectchecker : [this.items[i]]
                        });
                        $.closeModal('.popup-checker');
                       }
                   }
                }
            }
    };

</script>
<style scoped>

.content{
    bottom:95px;
    background:#fff;
}
.child-container{
  background-color:#fff;
  margin-left:.5rem;
  height:100%;
  overflow:auto;
}

.child-container li{
   width:100%;
   border-bottom:1px solid #f1f1f1;
   line-height:2rem;
   padding-left:.5rem;
}

.item-icon{
    font-size: 20px;
}
.item-name{
    word-wrap: break-word;
}
.items-list li{
    flex-direction: row ;
}
.submit-panel{
    margin:5px 10px;
    margin-bottom: 0px;
}
.cancel-button{
   background-color:#ccc;
   border:none;
   color:#333;
   width:3rem;
   height:1.7rem;
   line-height:1.7rem;
}
.submit-button{
   background-color:#f90;
   border:none;
   color:#fff;
   width:3rem;
   height:1.7rem;
   line-height:1.7rem;
}
.checker-selected{
   color:#f90;
}
</style>