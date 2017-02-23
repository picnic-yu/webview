<template>
    <div class="popup popup-dept">
        <header class="bar bar-nav">
            <button class="button pull-left cancel-button" v-on:click="close()">取消</button>
            <button class="button pull-right submit-button" v-on:click="submit()">确定</button>
            <h1 class='title'>门店</h1>
        </header>
        <div id="deptListContent"  class="content content-items pull-to-refresh-content infinite-scroll" data-ptr-distance="55" data-distance="240">
            <div class="pull-to-refresh-layer">
                   <div class="preloader"></div>
                   <div class="pull-to-refresh-arrow"></div>
            </div>
            <div class="eval-list">
                <div class="child-container"><ul><li v-for="item in items" v-on:click="selectDept(item.id)"><span class="item-icon" v-bind:class="{'icon-square-check':item.checked,'icon-square':!item.checked}"></span><span class="item-name">{{item.name}}</span></li></ul></div>
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
                    selectdepts:[],
                    selectdeptscopy:[],
                    refreshInit:false
                    };
        },
        events:{
                    'popup':function(param){
                        if(param.name == 'dept'){
                            $.popup('.popup-dept');
                            this.selectdepts = [];
                            $.extend(true,this.selectdepts,param.selectdepts);//深度拷贝
                            this.selectdeptscopy = [];
                            $.extend(true,this.selectdeptscopy,param.selectdepts);//深度拷贝
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
                              $('#deptListContent').scroller({
                                type: 'native'
                              });
                              $.initPullToRefresh('#deptListContent');
                              $(document).on('refresh','#deptListContent',function(e){
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
                            this.$http.post('/service/getUserShopListForWebview.action?token='+Constant.token,{
                              containDevice: 0,
                              name:searchData.searchName,
                              index:searchData.page.index,
                              num:searchData.page.num
                            }).then(function(ret){
                              _this.loading = false;
                              if(ret.ok && ret.data && ret.data.result == 'ok'){
                              for(var i=0;i<ret.data.data.data.length;i++){
                                   var flag = false;
                                   for(var j=0;j<_this.selectdepts.length;j++){
                                       if(ret.data.data.data[i].id == _this.selectdepts[j].id){
                                           ret.data.data.data.$set(i,{id:ret.data.data.data[i].id,name:ret.data.data.data[i].name,checked:true});
                                           flag = true;
                                           break;
                                       }
                                   }
                                   if(!flag){
                                      ret.data.data.data.$set(i,{id:ret.data.data.data[i].id,name:ret.data.data.data[i].name,checked:false});
                                   }
                                }
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
                        $.attachInfiniteScroll($('#deptListContent'));
                        $('#deptListContent .infinite-scroll-preloader').show();
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
                    $(document).off('infinite','#deptListContent').on('infinite','#deptListContent',func);
                },
                unbindInfinite:function(){
                        $.detachInfiniteScroll($('#deptListContent'));
                        $('#deptListContent .infinite-scroll-preloader').hide();
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
                   $.pullToRefreshDone('#deptListContent');
                 });
                },
                submit:function(){
                    var _this = this;
                    if(_this.selectdepts.length == 0) return;
                    _this.$dispatch('dept', {
                       selectdepts : _this.selectdepts
                    });
                    this.unbindInfinite();
                    this.clearData();
                    $.closeModal('.popup-dept');
                },
                close:function(){
                    this.selectdepts = [];
                    this.$dispatch('dept', {
                          selectdepts : this.selectdeptscopy
                    });
                    this.unbindInfinite();
                    this.clearData();
                    $.closeModal('.popup-dept');
                },
                selectDept:function(id){
                   for(var i=0;i<this.items.length;i++){
                       if(this.items[i].id == id){
                            if(this.items[i].checked){
                                this.items.$set(i,{id:this.items[i].id,name:this.items[i].name,checked:false});
                            }else{
                                this.items.$set(i,{id:this.items[i].id,name:this.items[i].name,checked:true});
                            }
                            //如果是选中，则放进已选择数组中
                            if(this.items[i].checked){
                                var flag = false;
                                for(var j=0;j<this.selectdepts.length;j++){
                                    if(id == this.selectdepts[j].id){
                                        flag = true;
                                        break;
                                    }
                                }
                                if(!flag){
                                    this.selectdepts.push(this.items[i]);
                                }
                            //如果取消选中,则从已选择数组中移除
                            }else{
                                for(var m=0;m<this.selectdepts.length;m++){
                                    if(id == this.selectdepts[m].id){
                                            this.selectdepts.$remove(this.selectdepts[m]);
                                     }
                                }
                            }
                           }
                   }
                }
            }
    };

</script>
<style scoped>

.content{
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
    margin-left: 10px;
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
</style>