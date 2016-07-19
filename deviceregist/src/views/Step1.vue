<template>
    <div class="page-group">
        <div class="page page-current" id="index">
            <header class="bar bar-nav">
                <h1 class='title'>设备注册</h1>
                <a class="right-menu" v-on:click="goDeviceList()">列表</a>
            </header>
            <div class="content">
                <div class="list-block item-step1">
                    <ul><li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-input" v-on:click="goToShoplist()">
                                    <a class="search-shop-tip"  v-show="!shopInfo.id" >请选择一个门店</a>
                                    <span class="search-shop"   v-show="shopInfo.id">{{shopInfo.name}}</span>
                                </div>
                            </div>
                        </div>
                    </li></ul>
                    <p class="submit-panel"><a class="button button-fill  button-orange"  v-on:click="next()" v-bind:class="shopInfo.id?'':'disabled'">下一步</a></p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    var utils = require('./../utils');
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
                }
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            init: function () {

            },
            goDeviceList:function(){
                utils.goDeviceList();
            },
            goToShoplist:function(){
                router.go('/shoplist');
            },
            next:function(){
                if(!this.shopInfo.id) return;
                router.go('/step2');
            }
        }
    };
</script>
<style>

</style>