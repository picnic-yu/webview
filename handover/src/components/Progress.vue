<template>
    <div class="circleProgress_wrapper not-view">
        <div class="wrapper right not-view">
            <div class="circleProgress rightcircle not-view" v-bind:style="{transform:'rotate('+progress+'deg)'}"
                 v-show="percent<=0.5"></div>
            <div class="circleProgress rightcircle-default not-view" v-show="percent>0.5"></div>
        </div>
        <div class="wrapper left not-view">
            <div class="circleProgress leftcircle not-view" v-bind:style="{transform:'rotate('+progress+'deg)'}"
                 v-show="percent>0.5"></div>
            <div class="circleProgress leftcircle-default not-view" v-show="percent<=0.5"></div>
        </div>
    </div>
</template>
<script>
    module.exports = {
        data: function () {
            return {};
        },
        props: ['percent'],
        computed: {
            progress: function () {
                var percent = this.percent * 100;
                if (percent > 50) percent = percent - 50;
                return -135 + percent * 18 / 5;
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            init: function () {

            }
        }
    };
</script>
<style>
    .circleProgress_wrapper {
        width: 16px;
        height: 16px;
        position: relative;
        display: inline-block;
        vertical-align: middle;
        margin-right: 2px;
    }

    .wrapper {
        width: 8px;
        height: 16px;
        position: absolute;
        top: 0;
        overflow: hidden;
    }

    .right {
        right: 0;
    }

    .left {
        left: 0;
    }

    .circleProgress {
        width: 16px;
        height: 16px;
        border: 4px solid #eee;
        border-radius: 50%;
        position: absolute;
        top: 0;
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
    }

    .rightcircle, .rightcircle-default {
        border-top: 4px solid #fa0;
        border-right: 4px solid #fa0;
        right: 0;
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
    }

    .leftcircle, .leftcircle-default {
        border-bottom: 4px solid #fa0;
        border-left: 4px solid #fa0;
        left: 0;
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
        -moz-transform: rotate(-135deg);
    }
</style>