<template>
    <div class="page" id="search" :transition="transitionName">
        <div class="container">
            <header class="bar bar-nav">
                <h1 class='title' onclick="goBack()">选择日期</h1>
            </header>
            <div class="content">
                <div id="date"></div>
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
                transitionName: 'right'
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
            init: function () {

            },
            initUI: function () {
                var _this = this;
                $('#date').calendar({
                    maxDate: commonutils.formatDateTime(new Date(), 1).replace(/-/g, '/'),
                    canselected: true,//已经选择的日期可以触发
                    ready: function (p) {
                        _sc = p;
                        _this.open();
                    },
                    onChange: function (p, values, displayValues) {
                        _this.setTime({
                            startTime: displayValues[0] + " 00:00:00",
                            endTime: displayValues[0] + " 23:59:59",
                            dateTime: displayValues[0]
                        });
                        _this.toIndex();
                    }
                    /*onDayClick:function(p,obj,year,month,day){
                     month = new Number(month)+1;
                     month = (month+"").length==2?month:('0'+month);
                     day = (day+"").length==2?day:('0'+day);
                     var date = year+"-"+month+"-"+day;
                     _this.setTime({
                     startTime:date+" 00:00:00",
                     endTime:date+" 23:59:59",
                     dateTime:date
                     });
                     _this.toIndex();
                     }*/
                });
            },
            open: function () {
                _sc.open();
            },
            setTime: function (time) {
                Constant.search = time;
            },
            notdate: function () {
                this.setTime({
                    startTime: '',
                    endTime: '',
                    dateTime: ''
                });
                this.toIndex();
            },
            toIndex: function () {
                this.$dispatch('search-data');
                Constant.needRefresh = true;
                router.go({name: 'default'});
            }
        }
    };
</script>

<style>
</style>
