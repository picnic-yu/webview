<template>
    <div class="page-group" :transition="transitionName">
        <div class="page page-current container">
            <header class="bar bar-nav">
                <h1 class='title'>选择用户{{tt}}</h1>
                <span class="pull-left icon-back" v-on:click="backTo()" v-if="showBackBtn==1"></span>
            </header>
            <div class="bar bar-header-secondary">
                <div class="searchbar">
                    <a class="searchbar-cancel" v-on:click="cancelSearch()">取消</a>

                    <div class="search-input">
                        <label class="icon icon-search" for="search"></label>
                        <input type="search" id="search" v-model="searchName" placeholder="请输入用户名、显示名、手机号码进行查询"/>
                    </div>
                </div>
            </div>
            <div id="userListContent" class="content content-items pull-to-refresh-content infinite-scroll"
                 data-ptr-distance="55" data-distance="240">
                <div class="pull-to-refresh-layer">
                    <div class="preloader"></div>
                    <div class="pull-to-refresh-arrow"></div>
                </div>
                <div class="items-list">
                    <ul>
                        <li v-on:click="detail('','')" v-if="$route.params.dowhich==0">
                            <div class="item-left">
                                <div class="default-header">
                                    <span class="user-icon"></span></div>
                            </div>
                            <div class="item-right">
                            <div class="item-name">全部</div>
                          </div>
                        </li>
                        <li v-for="item in items" v-on:click="detail(item.id,item.showName)">
                            <div class="item-left">
                                <userhead v-bind:user="item"></userhead>
                            </div>
                            <div class="item-right">
                                <div class="item-name">{{item.showName}}</div>
                                <span class="item-sub">{{item.userName}}</span><span
                                    class="item-sub">{{item.tel}}</span>
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
                    this.getData(null, {
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
                loading: false,
                items: [],
                searchName: '',
                scrollInit: false,
                infiniteInit: false,
                refreshInit: false,
                showBackBtn: Constant.showBackBtn
            };
        },
        components: {
            'userhead': require('../components/UserHead.vue')
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
                        _this.getData(null, _this);
                    }, 500);
                }
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            backTo: function () {
                var curPathName = Constant.curRoute.pathName;
                var backInfo = utils.getBackPath(curPathName);
                Constant.needRefresh = false;
                if (Constant.curRoute.path.indexOf('/userlist/1') > -1) {//创建界面，选择门店时，返回到创建界面
                    router.go({name: 'create', params: {deptId: Constant.shopInfo.id ? Constant.shopInfo.id : 0}});
                } else {
                    router.go({name: backInfo.parent, params: backInfo.params});
                }
            },
            init: function (opt) {
                var _this = this;
                if (!this.refreshInit) {
                    $('#userListContent').scroller({
                        type: 'native'
                    });
                    $.initPullToRefresh('#userListContent');
                    $(document).on('refresh', '#userListContent', function (e) {
                        _this.refresh();
                    });
                    this.refreshInit = true;
                }
                this.bindInfiniteEvent();
                this.getData(null, opt);
            },
            reInitScroll: function () {
                this.unbindInfinite();
                this.bindInfiniteEvent();
            },
            unbindInfinite: function () {
                if (!this.infiniteInit) return;
                this.infiniteInit = false;
                $.detachInfiniteScroll($('#userListContent'));
                $('#userListContent .infinite-scroll-preloader').hide();
            },
            bindInfiniteEvent: function () {
                if (this.infiniteInit) return;
                var _this = this;
                $.attachInfiniteScroll($('#userListContent'));
                $('#userListContent .infinite-scroll-preloader').show();
                var func = function (e) {
                    if (_this.loading) return;
                    _this.page.index += _this.page.num;
                    _this.getData();
                };
                $(document).off('infinite', '#userListContent').on('infinite', '#userListContent', func);
                this.infiniteInit = true;
            },
            getData: function (callback, searchData) {
                var _this = this;
                this.loading = true;
                searchData = searchData ? searchData : this;
                this.$http.post('/service/getUsers.action?token=' + Constant.token, {
                    userName: searchData.searchName,
                    pageNumber: searchData.page.index / searchData.page.num + 1,
                    pageSize: searchData.page.num
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
                    $.pullToRefreshDone('#userListContent');
                });
            },
            detail: function (id, name) {
                if (this.$route.params.dowhich == 0) {//返回到主页
                    Constant.userInfo = {
                        id: id,
                        name: name
                    };
                    Constant.needRefresh = true;
                    router.go({name: 'default'});
                } else if (this.$route.params.dowhich == 1) {
                    Constant.create.mUserInfo.names = name;
                    Constant.create.mUserInfo.ids = id;
                    router.go({name: 'create', params: {deptId: Constant.shopInfo.id ? Constant.shopInfo.id : 0}});
                }
            }
        }
    };
</script>

<style scoped>
    .content {
        background: #fff;
    }

    .items-list li {
    }

    .item-name {
        white-space: normal;
        word-break: normal;
        font-size: 14px;
    }

    .item-sub {
        color: #666;
        font-size: 12px;
        margin-right: 20px;
    }

    .items-list .item-left {
        width: 80px;
        height: 42px;
        float: left;
        text-align: center;
    }

    .items-list .item-right {
        width: 100%;
    }

    .bar .button.btn-submit {
        margin-top: 0.3rem;
        padding: 0px 0.5rem;
        height: 1.6rem;
        line-height: 1.6rem;
    }
</style>
