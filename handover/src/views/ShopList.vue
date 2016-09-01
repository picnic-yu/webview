<template>
    <div class="page-group shoplist" :transition="transitionName">
        <div class="page page-current container" id="index">
            <header class="bar bar-nav">
                <h1 class='title'>请选择一个门店</h1>
            </header>
            <div class="bar bar-header-secondary">
                <div class="searchbar">
                    <a class="searchbar-cancel" v-on:click="cancelSearch()">取消</a>

                    <div class="search-input">
                        <label class="icon icon-search" for="search"></label>
                        <input type="search" id="search" v-model="searchName" placeholder="请输入门店的名称"/>
                    </div>
                </div>
            </div>
            <div id="shopListContent" class="content content-items pull-to-refresh-content infinite-scroll"
                 data-ptr-distance="55" data-distance="240">
                <div class="pull-to-refresh-layer">
                    <div class="preloader"></div>
                    <div class="pull-to-refresh-arrow"></div>
                </div>
                <div class="items-list">
                    <ul>
                        <li v-on:click="detail('','')" v-show="$route.params.dowhich==0">
                            <div class="">
                                <div class="item-name">全部</div>
                            </div>
                        </li>
                        <li v-on:click="publicShop()" v-show="$route.params.dowhich==1">
                            <div class="">
                                <div class="item-name public">公开(所有人都可见)</div>
                            </div>
                        </li>
                        <li v-for="item in items" v-on:click="detail(item.id,item.name)">
                            <div class="">
                                <div class="item-name">{{item.name}}</div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="infinite-scroll-preloader">
                    <div class="preloader"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    var num = 20;//每页显示的条数
    var searchTimer = null;
    module.exports = {
        route: {
            data: function (transition) {
                if (this.refreshInit) {
                    this.getData('', {
                        page: {
                            index: 0,
                            num: num
                        }
                    });
                }
                transition.next({
                    page: {
                        index: 0,
                        num: num
                    }
                });
            },
            /* activate:function(transition){
             if(transition.from.name == 'default'){//返回上一级，清空数据
             this.transitionName = 'right';
             this.$nextTick(function () {
             transition.next();
             })
             }else{
             this.transitionName = 'left';
             this.$nextTick(function () {
             transition.next();
             })
             }
             },*/
            /*canDeactivate:function(transition){
             if(transition.to.name == 'create'){
             this.transitionName = 'left';
             transition.next();
             }else if(transition.to.name == 'default'){//返回上一级，清空数据
             this.transitionName = 'right';
             transition.next();
             }else{
             this.transitionName = 'right';
             transition.next();
             }
             },*/
            deactivate: function (transition) {
                this.unbindInfinite();
                this.clearData();
                transition.next();
            }
        },
        data: function () {
            return {
                transitionName: 'right',
                page: {
                    index: 0,
                    num: num,
                    total: 0
                },
                dowhich: 0,//0为选择门店查询，1为选择门店进行新增交接本
                loading: false,
                items: [],
                searchName: '',
                scrollInit: false,
                infiniteInit: false,
                refreshInit: false
            };
        },
        watch: {
            /**
             * 监听搜索框的变化
             * @param newValue
             * @param oldValue
             */
            'searchName': function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (searchTimer) {
                        clearTimeout(searchTimer);
                        searchTimer = null;
                    }
                    var _this = this;
                    searchTimer = setTimeout(function () {
                        _this.searchName = newValue;
                        _this.page.index = 0;
                        _this.getData(function () {
                            if (_this.page.total <= _this.items.length) {
                                _this.unbindInfinite();
                            }
                            $.refreshScroller();
                        }, _this);
                    }, 500);
                }
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            init: function (opt) {
                var _this = this;
                if (!this.refreshInit) {
                    $('#shopListContent').scroller({
                        type: 'native'
                    });
                    $.initPullToRefresh('#shopListContent');
                    $(document).on('refresh', '#shopListContent', function (e) {
                        _this.refresh();
                    });
                    this.refreshInit = true;
                }
                this.bindInfiniteEvent();
                this.getData('', opt);
            },
            reInitScroll: function () {
                this.unbindInfinite();
                this.bindInfiniteEvent();
            },
            unbindInfinite: function () {
                if (!this.infiniteInit) return;
                this.infiniteInit = false;
                $.detachInfiniteScroll($('#shopListContent'));
                $('#shopListContent .infinite-scroll-preloader').hide();
            },
            bindInfiniteEvent: function () {
                if (this.infiniteInit) return;
                var _this = this;
                $.attachInfiniteScroll($('#shopListContent'));
                $('#shopListContent .infinite-scroll-preloader').show();
                var func = function (e) {
                    if (_this.loading) return;
                    _this.page.index += _this.page.num;
                    _this.getData();
                };
                $(document).off('infinite', '#shopListContent').on('infinite', '#shopListContent', func);
                this.infiniteInit = true;
            },
            getData: function (callback, searchData) {
                var _this = this;
                this.loading = true;
                searchData = searchData ? searchData : this;
                this.$http.post('/service/getUserShopList.action?token=' + Constant.token, {
                    containDevice: 0,
                    name: searchData.searchName,
                    index: searchData.page.index,
                    num: searchData.page.num
                }).then(function (ret) {
                    _this.loading = false;
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        if (_this.page.index == 0) {
                            _this.items = ret.data.data.data;
                        } else {
                            _this.items = _this.items.concat(ret.data.data.data);
                        }
                        _this.page.total = ret.data.data.total;
                        if (_this.page.total <= _this.items.length) {
                            _this.unbindInfinite();
                        } else {
                            _this.unbindInfinite();
                            if (!_this.infiniteInit) {
                                setTimeout(_this.reInitScroll, 500);
                            }
                        }
                        //$.refreshScroller();
                        callback && callback();
                    }
                });
            },
            cancelSearch: function () {
                this.clearData();
                this.refresh();
            },
            clearData: function () {
                this.page.index = 0;
                this.items = [];
                this.searchName = '';
            },
            refresh: function () {
                this.page.index = 0;
                //this.items = [];
                this.unbindInfinite();
                this.getData(function () {
                    $.pullToRefreshDone('#shopListContent');
                });
            },
            detail: function (id, name) {
                Constant.shopInfo = {
                    id: id,
                    name: name
                };
                if (this.$route.params.dowhich == 0) {//主页面选择
                    Constant.needRefresh = true;
                    router.go({name: 'default'});
                } else {//创建界面选择
                    Constant.create.isOpen = 0;
                    router.go({name: 'create', params: {deptId: id}});
                }
            },
            publicShop: function () {
                Constant.create.isOpen = 1;
                Constant.shopInfo = {
                    id: '',
                    name: ''
                };
                router.go({name: 'create', params: {deptId: 0}});
            }
        }
    };
</script>

<style scoped>
    .content {
        background: #fff;
    }

    .items-list li {
        padding: 15px 10px;
    }

    .item-name {
        white-space: normal;
        word-break: normal;
        font-size: 14px;
    }

    .item-name.public {
        color: #fa0;
    }

    .shoplist {
        -webkit-transform: translate3d(0%, 0, 0);
    }

    .bar .button.btn-submit {
        margin-top: 0.3rem;
        padding: 0px 0.5rem;
        height: 1.6rem;
        line-height: 1.6rem;
    }
</style>
