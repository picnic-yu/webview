<template>
    <div class="popup popup-scene">
        <header class="bar bar-nav">
            <button class="button pull-left cancel-button" v-on:click="close()">取消</button>
            <button class="button pull-right submit-button" v-on:click="submit()">确定</button>
            <h1 class='title'>场景</h1>
        </header>
        <div class="content">
            <div class="eval-list">
                <div class="child-container"><ul><li v-for="scene in scenes" v-on:click="selectScene(scene.id)"><span class="item-icon" v-bind:class="{'icon-square-check':scene.checked,'icon-square':!scene.checked}"></span><span class="item-name">{{scene.preName}}</span></li></ul></div>
            </div>
        </div>
    </div>
</template>
<script>
    require('../../../common/assets/font.css');
    module.exports = {
        route:{
            data:function(transition){
            },
            deactivate:function(transition){
            }
        },
        data: function () {
            return {
                scenes : [],
                selectscenes:[],
                selectscenescopy:[]
            };
        },
        events:{
            'popup':function(param){
                if(param.name == 'scene'){
                    $.popup('.popup-scene');
                    this.selectscenes = [];
                    $.extend(true,this.selectscenes,param.selectscenes);//深度拷贝
                    this.selectscenescopy = [];
                    $.extend(true,this.selectscenescopy,param.selectscenes);//深度拷贝
                    this.initData();
                }
            }
        },
        ready: function () {
        },
        methods: {
            initData: function () {
               var _this = this;
               this.$http.post('/service/getGroupPresetList.action?token='+Constant.token).then(function(ret){
                   if(ret.ok && ret.data && ret.data.result == 'ok'){
                     _this.scenes = ret.data.data.data;
                     for(var i=0;i<_this.scenes.length;i++){
                         var flag = false;
                         for(var j=0;j< _this.selectscenes.length;j++){
                             if(_this.scenes[i].id == _this.selectscenes[j].id){
                                 _this.scenes.$set(i,{id:_this.scenes[i].id,preName:_this.scenes[i].preName,preId:_this.scenes[i].preId,checked:true});
                                 flag = true;
                                 break;
                             }
                     }
                     if(!flag){
                        _this.scenes.$set(i,{id:_this.scenes[i].id,preName:_this.scenes[i].preName,preId:_this.scenes[i].preId,checked:false});
                     }
                   }
                   }
               });
            },
            submit:function(){
                var _this = this;
                if(_this.selectscenes.length == 0) return;
                _this.$dispatch('scene', {
                   selectscenes : _this.selectscenes
                });
                $.closeModal('.popup-scene');
            },
            close:function(){
                this.selectscenes = [];
                this.$dispatch('scene', {
                      selectscenes : this.selectscenescopy
                });
                $.closeModal('.popup-scene');
            },
            selectScene:function(id){
                for(var i=0;i<this.scenes.length;i++){
                   if(this.scenes[i].id == id){
                        if(this.scenes[i].checked){
                            this.scenes.$set(i,{id:this.scenes[i].id,preName:this.scenes[i].preName,preId:this.scenes[i].preId,checked:false});
                        }else{
                            this.scenes.$set(i,{id:this.scenes[i].id,preName:this.scenes[i].preName,preId:this.scenes[i].preId,checked:true});
                        }
                        //如果是选中，则放进已选择数组中
                        if(this.scenes[i].checked){
                            var flag = false;
                            for(var j=0;j<this.selectscenes.length;j++){
                                if(id == this.selectscenes[j].id){
                                    flag = true;
                                    break;
                                }
                            }
                            if(!flag){
                                this.selectscenes.push(this.scenes[i]);
                            }
                        //如果取消选中,则从已选择数组中移除
                        }else{
                            for(var m=0;m<this.selectscenes.length;m++){
                                if(id == this.selectscenes[m].id){
                                        this.selectscenes.$remove(this.selectscenes[m]);
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