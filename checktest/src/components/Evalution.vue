<template>
    <div class="popup popup-evalution">
        <header class="bar bar-nav">
            <button class="button pull-left cancel-button" v-on:click="close()">取消</button>
            <button class="button pull-right submit-button" v-on:click="submit()">确定</button>
            <h1 class='title'>点检项</h1>
       </header>
        <div class="content">
            <div class="eval-list">
                <table>
                <tr>
                <td width="35%" valign="top"><div class="parent-container"><ul><li v-bind:class="{'select-font':parenteval.selected,'noselect-font':!parenteval.selected}" v-for="parenteval in parentevals" v-on:click="getChildData(parenteval.id)"><span>{{parenteval.name}}</span></li></ul></div></td>
                <td width="65%" valign="top"><div class="child-container"><ul><li v-for="eval in evals" v-on:click="checkChild(eval.id)"><span class="item-icon" v-bind:class="{'icon-square-check':eval.checked,'icon-square':!eval.checked}"></span><span>{{eval.name}}</span></li></ul></div></td>
                </tr>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
    require('../../../common/assets/font.css');
    module.exports = {
        data: function () {
            return {
                parentevals : [],
                evals:[],
                selectevals:[],
                selectevalscopy:[]
            };
        },
        events:{
            'popup':function(param){
                if(param.name == 'evalutioncombo'){
                    $.popup('.popup-evalution');
                    this.selectevals = [];
                    $.extend(true,this.selectevals,param.selectevals);//深度拷贝
                    this.selectevalscopy = [];
                    $.extend(true,this.selectevalscopy,param.selectevals);//深度拷贝
                    this.initData();
                }
            }
        },
        ready: function () {
        },
        methods: {
            initData: function () {
               var _this = this;
               this.getParentData(function(){
                   if(_this.parentevals.length>0){
                    var firstitem = _this.parentevals[0];
                    _this.getChildData(firstitem.id);
                   }
               });
            },
            clearData:function(){
                this.selectevals = [];
            },
            submit:function(){
                var _this = this;
                if(_this.selectevals.length == 0) return;
                _this.$dispatch('evalu', {
                   selectevals : _this.selectevals
                });
                $.closeModal('.popup-evalution');
            },
            close:function(){
                this.clearData();
                this.$dispatch('evalu', {
                    selectevals : this.selectevalscopy
                 });
                $.closeModal('.popup-evalution');
            },
            getParentData:function(callback){
                    var _this = this;
                    this.$http.post('/service/getMainItemsByEnterpriseId.action?token='+Constant.token).then(function(ret){
                        if(ret.ok && ret.data && ret.data.result == 'ok'){
                          _this.parentevals = ret.data.data.data;
                        }
                        callback && callback();
                      });
            },
            getChildData:function(id){
                    for(var i=0;i<this.parentevals.length;i++){
                     if(this.parentevals[i].id==id){
                        this.parentevals.$set(i,{id:this.parentevals[i].id,name:this.parentevals[i].name,selected:true});
                     }else{
                        this.parentevals.$set(i,{id:this.parentevals[i].id,name:this.parentevals[i].name,selected:false});
                     }
                    }
                    var _this = this;
                    this.$http.post('/service/getSubItemsByMainItemId.action?token='+Constant.token,{
                          parentViewShopId:id
                        }).then(function(ret){
                        if(ret.ok && ret.data && ret.data.result == 'ok'){
                          _this.evals = ret.data.data.data;
                          for(var i=0;i<_this.evals.length;i++){
                            var flag = false;
                            for(var j=0;j<_this.selectevals.length;j++){
                                if(_this.evals[i].id == _this.selectevals[j].id){
                                    _this.evals.$set(i,{id:_this.evals[i].id,name:_this.evals[i].name,checked:true});
                                    flag = true;
                                    break;
                                }
                            }
                            if(!flag){
                                _this.evals.$set(i,{id:_this.evals[i].id,name:_this.evals[i].name,checked:false});
                            }
                          }
                        }else{
                          _this.evals = [];
                        }
                      });
            },
            checkChild:function(id){
                var _this = this;
                for(var i=0;i<_this.evals.length;i++){
                    if(_this.evals[i].id==id){
                        if(_this.evals[i].checked){
                            _this.evals.$set(i,{id:_this.evals[i].id,name:_this.evals[i].name,checked:false});
                        }else{
                            _this.evals.$set(i,{id:_this.evals[i].id,name:_this.evals[i].name,checked:true});
                        }
                    //如果是选中，则放进已选择数组中
                    if(_this.evals[i].checked){
                        var flag = false;
                        for(var j=0;j<_this.selectevals.length;j++){
                            if(id == _this.selectevals[j].id){
                                flag = true;
                                break;
                            }
                        }
                        if(!flag){
                            _this.selectevals.push(_this.evals[i]);
                        }
                    //如果取消选中,则从已选择数组中移除
                    }else{
                        for(var m=0;m<_this.selectevals.length;m++){
                            if(id == _this.selectevals[m].id){
                                    _this.selectevals.$remove(_this.selectevals[m]);
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
.eval-list{
   height:100%;
}

.eval-list table{
   width:100%;
   border:none;
   height:100%;
}

.parent-container{
  background-color:#fff;
  border-right:1px solid #f1f1f1;
  height:100%;
  overflow:auto;
}

.parent-container li{
   line-height:2.5rem;
   border-bottom:1px solid #f1f1f1;
   padding-left:.5rem;
}

.child-container{
  background-color:#fff;
  border-left:1px solid #f1f1f1;
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

.content{
    background:#f1f1f1;
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
.select-font{
   color:#f90;
}
.noselect-font{
   color:#333;
}
</style>