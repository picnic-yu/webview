<template>
    <div class="page-group">
        <div class="page page-current" id="index">
            <header class="bar bar-nav">
                <h1 class='title' v-i18n="{value:'projectfile'}"></h1>
                <span class="pull-left icon-back" v-on:click="backTo()"></span>
            </header>
            <div class="content">
                <div class="list-block item-step1">
                    <ul><li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-input" v-on:click="goToShoplist()">
                                    <a class="search-shop-tip"  v-show="!shopInfo.id" v-i18n="{value:'selectonestore'}"></a>
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
    require('../../../common/assets/font.css');
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
            backTo: function () {
                if ($.device.android) {
                    try{
                        window.webview && window.webview.closeCurrentInterface();
                    } catch (e) {
                    }
                } else if ($.device.ios) {
                    try {
                        window.webkit.messageHandlers.closeCurrentInterface.postMessage(1);
                    } catch (e) {
                    }
                } else {

                }
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