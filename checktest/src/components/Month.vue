<template>
    <div class="popup popup-month">
        <header class="bar bar-nav">
                <button class="button pull-left cancel-button" v-on:click="close()">取消</button>
                <button class="button pull-right submit-button" v-on:click="submit()">确定</button>
                <h1 class='title'>月</h1>
        </header>
        <div class="content">
            <div class="month-list items-list">
                <table>
                <tr v-for="rowdate in rowDates">
                	<td v-bind:class="coldate.display?'monthdate-select':''" align="center" v-for="coldate in colDates | paginition rowdate*7 7"  v-on:click="checkThisDay(coldate.id)">{{coldate.id}}</td>
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
                rowDates : [0,1,2,3,4],
                colDates:[],
                selectmonths:[],
                selectmonthscopy:[]
            };
        },
        events:{
            'popup':function(param){
                if(param.name == 'monthcombo'){
                    $.popup('.popup-month');
                    this.selectmonths = [];
                    $.extend(true,this.selectmonths,param.selectmonths);//深度拷贝
                    for(var i=0;i<this.colDates.length;i++){
                        var flag = false;
                        for(var j=0;j<this.selectmonths.length;j++){
                            if(this.colDates[i].id == this.selectmonths[j]){
                                this.colDates.$set(i,{id:this.colDates[i].id,display:true});
                                flag = true;
                            }
                        }
                        if(!flag){
                            this.colDates.$set(i,{id:this.colDates[i].id,display:false});
                        }
                    }
                    this.selectmonthscopy = [];
                    $.extend(true,this.selectmonthscopy,param.selectmonths);//深度拷贝
                }
            }
        },
        ready: function () {
            this.init();
        },
        filters:{
            paginition:function(rows,start,number) {
                if(rows && rows.length > number)
                    return rows.slice(start,start+number);
                return rows;
            }
        },
        methods: {
            init: function () {
               for(var i=1;i<32;i++){
                this.colDates.push({id:i,display:false});
               }
            },
            clearData:function(){
                this.selectmonths = [];
            },
            submit:function(){
                var _this = this;
                if(_this.selectmonths.length == 0) return;
                _this.$dispatch('month', {
                   selectmonths : _this.selectmonths
                });
                $.closeModal('.popup-month');
            },
            close:function(){
                this.clearData();
                this.$dispatch('month', {
                        selectmonths : this.selectmonthscopy
                });
                $.closeModal('.popup-month');
            },
            checkThisDay:function(id){
                for(var i=0;i<this.colDates.length;i++){
                    if(this.colDates[i].id==id){
                        this.colDates[i].display = !this.colDates[i].display;
                        if(this.colDates[i].display){
                            var flag = false;
                            for(var j=0;j<this.selectmonths.length;j++){
                                if(this.colDates[i].id == this.selectmonths[j]){
                                    flag = true;
                                    break;
                                }
                            }
                            if(!flag){
                                this.selectmonths.push(this.colDates[i].id);
                            }
                        }else{
                            for(var j=0;j<this.selectmonths.length;j++){
                                if(this.selectmonths[j]==id){
                                    this.selectmonths.splice(j,1);
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
.month-list{
   height:50%;
}
.month-list table{
   width:100%;
   height:100%;
}
.month-list table td{
	width:14%;
	height:14%;
	border:1px solid #fff;
}

.monthdate-select{
	background-color:#f90;
}

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