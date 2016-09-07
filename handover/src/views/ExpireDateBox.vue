<template>
    <div class="page" id="search" :transition="transitionName">
        <div class="container">
            <header class="bar bar-nav">
                <h1 class='title' onclick="goBack()">选择截止日期</h1>
                <span class="pull-left icon-back" v-on:click="backTo()" v-if="showBackBtn==1"></span>
            </header>
            <div class="content">
                <div id="expiredate"></div>
                <p class="submit-panel"><a class="button" v-on:click="notdate()">不限日期</a></p>
            </div>
        </div>
    </div>
</template>

<script>
    var commonutils = require('../../../common/assets/js/commonutils');
    var _sc;
    module.exports = {
        route: {
            data: function (transition) {
                if (_sc) {
                    this.open();
                }
                transition.next({
                    search: Constant.search
                });
            },
            deactivate: function (transition) {
                if (_sc) _sc.close();
                transition.next();
            }
        },
        data: function () {
            return {
                transitionName: 'right',
                showBackBtn: Constant.showBackBtn
            };
        },
        props: {
            search: {
                type: Object,
                twoWay: true,
                default: function () {
                    return {
                        startTime: '',
                        endTime: '',
                        dateTime: ''
                    };
                }
            }
        },
        ready: function () {
            this.init();
            this.initUI();
        },
        methods: {
            backTo: function () {
                router.go({name: 'create', params: {deptId: Constant.shopInfo.id ? Constant.shopInfo.id : 0}});
            },
            init: function () {

            },
            initUI: function () {
                var _this = this;
                $('#expiredate').calendar({
                    minDate: commonutils.formatDateTime(new Date(), 1).replace(/-/g, '/'),
                    canselected: true,//已经选择的日期可以触发
                    ready: function (p) {
                        _sc = p;
                        _this.open();
                    },
                    onChange: function (p, values, displayValues) {
                        _this.ok(displayValues);
                    }
                });
            },
            open: function () {
                _sc.open();
            },
            notdate: function () {
                Constant.create.mDate.value = '';
                router.go({name: 'create', params: {deptId: Constant.shopInfo.id ? Constant.shopInfo.id : 0}});
            },
            ok: function (displayValues) {
                Constant.create.mDate.value = displayValues[0];
                router.go({name: 'create', params: {deptId: Constant.shopInfo.id ? Constant.shopInfo.id : 0}});
            }
        }
    };
</script>

<style>
</style>
