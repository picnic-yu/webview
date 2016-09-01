<template>
    <div class="page mutiple-users" :transition="transitionName">
        <div class="container">
            <header class="bar bar-nav">
                <h1 class='title'></h1>
                <button class="button button-link button-nav button-fill  pull-right  button-orange btn-submit"
                        v-bind:class="users.length>0?'':'disabled'" v-on:click="ok()">
                    确定
                </button>
                <button class="button button-link button-nav button-fill  pull-right  button-light btn-submit"
                        v-on:click="who()">
                    <span class="icon-user icon-head"></span>
                    {{users.length}}
                </button>
            </header>
            <div class="bar bar-header-secondary">
                <div class="searchbar">
                    <a class="searchbar-cancel" v-on:click="cancelSearch()">取消</a>

                    <div class="search-input">
                        <label class="icon icon-search" for="search"></label>
                        <input type="search" id="search" v-model="searchName" placeholder="请输入用户名、显示名、手机号码进行查询"/>
                    </div>
                </div>
                <!--<nav class="user-list" v-show="users.length>0">
                  <div class="user-list-outer">
                    <div class="user-list-inner">
                        <div v-for="user in users" class="user-li">
                          <span class="splitor-f" v-if="$index!=0">,</span>{{user.showName}}
                        </div>
                    </div>
                  </div>
                </nav>-->
            </div>
            <div id="muserListContent" class="content content-items mu-content pull-to-refresh-content infinite-scroll"
                 data-ptr-distance="55" data-distance="240">
                <div class="pull-to-refresh-layer">
                    <div class="preloader"></div>
                    <div class="pull-to-refresh-arrow"></div>
                </div>
                <div class="items-list">
                    <ul>
                        <li v-on:click="atall()">
                            <span class="item-icon icon-square"></span>

                            <div class="item-left">
                                <div class="default-header">
                                    <span class="user-icon"></span></div>
                            </div>
                            <div class="item-right">
                                <div class="item-name">全部</div>
                                <span class="item-sub">@all</span>
                                <span class="item-sub"></span>
                            </div>
                        </li>
                        <li v-for="item in items" v-on:click="detail(item)">
                            <span class="item-icon" v-bind:class="!!item.checked?'icon-square-checked':'icon-square'">
                                <span class="path1"></span><span class="path2"></span>
                            </span>
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
        <!--<partial name="userdlg" class="users-content" >
        </partial>-->
        <modal-dialog v-bind:show-modal.sync="showModal">
            <header class="dialog-header" slot="header">
                <div class="dlg-title">已选择{{users.length}}人</div>
            </header>
            <div class="dialog-body" slot="body">
                <div class="tab active">
                    <ul class="modal-ul">
                        <li v-for="user in users" @click="deleteUser(user)">
                            <userhead v-bind:user="user"></userhead>
                            <div class="dlg-username">{{user.showName}}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </modal-dialog>
    </div>
</template>

<script>
    require('../../../common/assets/css/sm-extend.min.css');
    require('../../../common/assets/font.css');
    require('../../../common/libs/sm-extend.js');
    var num = 20;//每页显示的条数
    var searchTimer = null;
    var Vue = require('vue');
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
                    },
                    users: Constant.selectedUsers
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
                layout: {
                    top: 44,
                    width: $('body').width()
                },
                showModal: false,
                loading: false,
                items: [],
                users: [],//已选择用户列表
                searchName: '',
                scrollInit: false,
                infiniteInit: false,
                refreshInit: false
            };
        },
        components: {
            'modal-dialog': require('../components/ReadUserDialog.vue'),
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
            init: function (opt) {
                var _this = this;
                if (!this.refreshInit) {
                    $('#muserListContent').scroller({
                        type: 'native'
                    });
                    $.initPullToRefresh('#muserListContent');
                    $(document).on('refresh', '#muserListContent', function (e) {
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
                $.detachInfiniteScroll($('#muserListContent'));
                $('#muserListContent .infinite-scroll-preloader').hide();
            },
            bindInfiniteEvent: function () {
                if (this.infiniteInit) return;
                var _this = this;
                $.attachInfiniteScroll($('#muserListContent'));
                $('#muserListContent .infinite-scroll-preloader').show();
                var func = function (e) {
                    if (_this.loading) return;
                    _this.page.index += _this.page.num;
                    _this.getData();
                };
                $(document).off('infinite', '#muserListContent').on('infinite', '#muserListContent', func);
                this.infiniteInit = true;
            },
            getData: function (callback, searchData) {
                var _this = this;
                this.loading = true;
                searchData = searchData ? searchData : this;
                this.$http.post('/service/getUsers.action?token=' + Constant.token, {
                    userName: searchData.searchName,
                    isFilterOwn: 1,//过滤掉自己
                    pageNumber: searchData.page.index / searchData.page.num + 1,
                    pageSize: searchData.page.num
                }).then(function (ret) {
                    _this.loading = false;
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        var data = ret.data.data.data;
                        if (data && _this.users.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                for (var j = 0; j < _this.users.length; j++) {
                                    if (data[i].id == _this.users[j].id) {
                                        data[i].checked = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (_this.page.index == 0) {
                            _this.items = data;
                        } else {
                            _this.items = _this.items.concat(data);
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
                    $.pullToRefreshDone('#muserListContent');
                });
            },
            /**
             * 查看已经选择了谁
             */
            who: function () {
                var userlength = this.users.length;
                if (userlength == 0) {
                    $.toast('没有选择任何人');
                    return;
                }
                this.showModal = true;
            },
            detail: function (item) {
                /*if(!item.checked && this.users.length >= 10){
                 $.toast('最多选择10人');
                 return;
                 }*/
                Vue.set(item, 'checked', !item.checked);
                if (item.checked) {
                    this.users.push(item);
                } else {
                    var i = getRemoveUserIndex(this.users, item.id);
                    if (i != -1) {
                        this.users.splice(i, 1);
                    }
                }
            },
            atall: function () {
                Constant.bo.isAtAll = 1;
                router.go({name: 'create', params: {deptId: Constant.shopInfo.id ? Constant.shopInfo.id : 0}});
            },
            ok: function () {
                if (this.users.length == 0) return;
                Constant.bo.isAtAll = 0;
                Constant.selectedUsers = this.users;
                router.go({name: 'create', params: {deptId: Constant.shopInfo.id ? Constant.shopInfo.id : 0}});
            },
            deleteUser: function (user) {
                Vue.set(user, 'checked', !user.checked);
                var i = getRemoveUserIndex(this.users, user.id);
                if (i != -1) {
                    this.users.splice(i, 1);
                }
                if (this.users.length == 0) {
                    this.showModal = false;
                }
            }
        }
    };

    function getRemoveUserIndex(users, id) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == id) {
                return i;
            }
        }
        return -1;
    }
</script>

<style>
    .content.mu-content {
        background: #fff;
    }

    .item-left {
        width: 80px;
        float: left;
        height: 42px;
        text-align: center;
    }

    .item-right {
        width: 100%;
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

    .mutiple-users .item-icon {
        font-size: 20px;
        margin-right: 3px;
        margin-left: 3px;
    }

    .user-list {
        height: 40px;
        background: #eee;
        margin: 0 -.5rem;
        padding-bottom: 10px;
        position: relative;
        overflow: hidden;
    }

    .user-list-outer {
        width: 100%;
        height: 40px;
        position: relative;
        overflow-x: auto;
    }

    .user-list-inner {
        width: 1000px;
        overflow: hidden;
        background: #fff;
        padding-left: 10px;
    }

    .user-li {
        display: inline-block;
        padding: 0px;
        margin: 4px 0px;
        border: none;
        float: left;
    }

    .splitor-f {
        color: #888;
    }

    .bar1 {
        position: absolute;
        right: 0;
        left: 0;
        z-index: 10;
        height: 2.2rem;
        padding-right: 0.5rem;
        padding-left: 0.5rem;
        background-color: #f7f7f8;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }

    .bar1 .searchbar {
        margin: 0 -.5rem;
        padding: .4rem .5rem;
        background: rgba(0, 0, 0, .1);;
    }

    .bar1 .searchbar .search-input input {
        border: 0;
    }

    .bar .button.btn-submit {
        margin-top: 0.3rem;
        padding: 0px 0.5rem;
        height: 1.6rem;
        line-height: 1.6rem;
    }

    .bar .button .icon-user {
        vertical-align: text-top;
    }

    .userdlg-modal.modal, .userdlg-modal .modal-inner {
        background: #fff;
    }

    .modal-title {
        padding-bottom: 10px;
    }

    .dlg-closebtn {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 20px;
    }

    .modal-ul {
        text-align: left;
    }

    .dlg-username {
        width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        text-align: center;
        margin-top: 3px;
    }

    .modal-ul li {
        display: inline-block;
        text-align: center;
        padding: 10px 5px 0px 5px;
    }

    .mutiple-users .dlg-title {
        height: 30px;
        line-height: 30px;
        margin-top: 10px;
        background: #fff;
        border-bottom: 1px solid #ddd;
        color: #333;
        text-align: center;
    }

    .mutiple-users .dialog-overlay {
        z-index: 3001;
    }

    .mutiple-users .dialog {
        z-index: 3002;
    }
</style>
