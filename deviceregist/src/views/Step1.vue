<template>
    <div class="page-group" :transition="transitionName">
        <div class="page page-current container" id="index">
            <header class="bar bar-nav">
                <h1 class='title' v-i18n="{value:'devregister'}"></h1>
                <a class="right-menu" v-on:click="goDeviceList()" v-i18n="{value:'list'}"></a>
            </header>
            <div class="content">
                <div class="list-block item-step1">
                    <ul><li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-input" v-on:click="goToShoplist()">
                                    <a class="search-shop-tip"  v-show="!shopInfo.id" v-i18n="{value:'selectastore'}"></a>
                                    <span class="search-shop"   v-show="shopInfo.id">{{shopInfo.name}}</span>
                                </div>
                            </div>
                        </div>
                    </li></ul>
                    <p class="submit-panel"><a class="button button-fill  button-orange"  v-on:click="next()" v-bind:class="shopInfo.id?'':'disabled'" v-i18n="{value:'next'}"></a></p>
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
            },
            deactivate:function(transition){
                this.transitionName = 'left';
                transition.next();
            }
        },
        data:function(){
            return {
                transitionName : 'show',
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