<template>
    <div class="popup popup-week">
        <header class="bar bar-nav">
                <button class="button pull-left cancel-button" v-on:click="close()" v-i18n="{value:'cancelBtn'}">取消</button>
                <button class="button pull-right submit-button" v-on:click="submit()" v-i18n="{value:'sure'}">确定</button>
                <h1 class='title' v-i18n="{value:'week'}"></h1>
        </header>
        <div class="content" id="weekListContent">
            <div class="week-list items-list">
                <ul>
                    <li v-for="week in weeks" v-on:click="selectWeek(week)">
                        <span class="item-icon" v-bind:class="!!week.checked?'icon-square-check':'icon-square'"></span><span class="item-name">{{week.name}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    require('../../../common/assets/font.css');
    module.exports = {
        data: function () {
            return {
                weeks:[{id:2,name:this.$translate("monday"),checked:false},
                {id:3,name:this.$translate("tuesday"),checked:false},
                {id:4,name:this.$translate("wednesday"),checked:false},
                {id:5,name:this.$translate("thursday"),checked:false},
                {id:6,name:this.$translate("friday"),checked:false},
                {id:7,name:this.$translate("saturday"),checked:false},
                {id:1,name:this.$translate("sunday"),checked:false}],
                selectWeeks:[],
                selectweekscopy:[]
            };
        },
        events:{
            'popup':function(param){
                if(param.name == 'weekcombo'){
                    $.popup('.popup-week');
                    this.selectWeeks = [];
                    $.extend(true,this.selectWeeks,param.selectweeks);//深度拷贝
                    for(var i=0;i<this.weeks.length;i++){
                        var flag = false;
                        for(var j=0;j<this.selectWeeks.length;j++){
                            if(this.weeks[i].id==this.selectWeeks[j].id){
                                this.weeks.$set(i,{id:this.weeks[i].id,name:this.weeks[i].name,checked:true});
                                flag = true;
                            }
                        }
                        if(!flag){
                            this.weeks.$set(i,{id:this.weeks[i].id,name:this.weeks[i].name,checked:false});
                        }
                    }
                    this.selectweekscopy = [];
                    $.extend(true,this.selectweekscopy,param.selectweeks);//深度拷贝
                }
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            init: function () {

            },
            clearData:function(){
                this.selectWeeks = [];
            },
            selectWeek:function(week){
                if(!week.checked){
                    this.selectWeeks = add(this.selectWeeks,week);
                }else{
                    remove(this.selectWeeks,week);
                }
                week.checked = !week.checked;
            },
            submit:function(){
                var _this = this;
                if(_this.selectWeeks.length == 0) return;
                _this.$dispatch('week', {
                   selectweeks : _this.selectWeeks
                });
                $.closeModal('.popup-week');
            },
            close:function(){
                this.clearData();
                this.$dispatch('week', {
                      selectweeks : this.selectweekscopy
                });
                $.closeModal('.popup-week');
            }
        }
    };

    function add(weeks,week){
        weeks.push({
            id:week.id,
            name:week.name
        });
        return weeks;
    }
    function remove(weeks,week){
        var index = -1;
        for(var i=0;i<weeks.length;i++){
            if(weeks[i].id == week.id){
                index = i;
                break;
            }
        }
        weeks.splice(index,1);
    }
</script>
<style scoped>
.content{
    bottom:95px;
    background:#fff;
}
.bottom{
    position: absolute;
    bottom: 5px;
    width: 100%;
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

 .button-ccc{
    background-color:#ccc;
    color:#333;
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