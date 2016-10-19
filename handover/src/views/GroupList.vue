<template>
    <div class="page mutiple-groups" :transition="transitionName">
        <div class="container">
            <header class="bar bar-nav">
                <h1 class='title'></h1>
                <span class="pull-left icon-back" v-on:click="backTo()" v-if="showBackBtn==1"></span>
                <button class="button button-link button-nav button-fill  pull-right  button-orange btn-submit"
                        v-on:click="ok()">
                    确定
                </button>
                <button class="button button-link button-nav button-fill  pull-right  button-light btn-submit"
                        v-on:click="who()">
                    <span class="icon-user icon-head"></span>
                    {{groups.length}}
                </button>
            </header>
            <div class="bar bar-header-secondary">
                <div class="searchbar">
                    <a class="searchbar-cancel" v-on:click="cancelSearch()">取消</a>

                    <div class="search-input">
                        <label class="icon icon-search" for="search"></label>
                        <input type="search" id="search" v-model="searchName" placeholder="请输入企业名称进行查询"/>
                    </div>
                </div>
            </div>
            <div id="mgroupListContent" class="content content-items mu-content pull-to-refresh-content"
                 data-ptr-distance="55">
                <div class="pull-to-refresh-layer">
                    <div class="preloader"></div>
                    <div class="pull-to-refresh-arrow"></div>
                </div>
                <div class="items-list">
                    <ul>
                        <li v-on:click="all()">
                            <span class="item-icon icon-square"></span>

                            <div class="item-left">
                                <div class="item-name public">公开（所有企业可见）</div>
                            </div>
                        </li>
                        <li v-for="item in items" v-on:click="detail(item)">
                            <span class="item-icon" v-bind:class="!!item.checked?'icon-square-checked':'icon-square'">
                                <span class="path1"></span><span class="path2"></span>
                            </span>

                            <div class="item-left">
                                {{item.name}}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <modal-dialog v-bind:show-modal.sync="showModal">
            <header class="dialog-header" slot="header">
                <div class="dlg-title">已选择{{groups.length}}个企业</div>
            </header>
            <div class="dialog-body" slot="body">
                <div class="tab active">
                    <ul class="modal-ul">
                        <li v-for="group in groups" @click="deleteGroup(group)" class="group-li">
                            <div class="dlg-username">{{group.name}}</div>
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
    var searchTimer = null;
    var Vue = require('vue');
    module.exports = {
        route: {
            data: function (transition) {
                if (this.refreshInit) {
                    this.getData();
                }
                this.groups = [];
                if (this.$route.params.type == 0) {//＠的用户
                    this.groups = $.extend(true, this.groups, Constant.selectedGroups);
                } else if (this.$route.params.type == 1) {//选择模板中的用户时，设置好原来选择的用户
                    if (Constant.create.mGroupInfo.ids) {
                        var ids = Constant.create.mGroupInfo.ids.split(',');
                        var names = Constant.create.mGroupInfo.names.split(',');
                        for (var i = 0; i < ids.length; i++) {
                            this.groups.push({
                                id: ids[i],
                                showName: names[i]
                            });
                        }
                    }
                }
                this.$nextTick(function () {
                    transition.next();
                })
            },
            deactivate: function (transition) {
                this.clearData();
                transition.next();
            }
        },
        data: function () {
            return {
                transitionName: 'right',
                layout: {
                    top: 44,
                    width: $('body').width()
                },
                showModal: false,
                loading: false,
                items: [],
                groups: [],//已选择用户列表
                grouplist: [],//最终选择的用户
                searchName: '',
                scrollInit: false,
                infiniteInit: false,
                refreshInit: false,
                showBackBtn: Constant.showBackBtn
            };
        },
        components: {
            'modal-dialog': require('../components/ReadUserDialog.vue')
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
                router.go({name: backInfo.parent, params: backInfo.params});
            },
            init: function (opt) {
                var _this = this;
                if (!this.refreshInit) {
                    $('#mgroupListContent').scroller({
                        type: 'native'
                    });
                    $.initPullToRefresh('#mgroupListContent');
                    $(document).on('refresh', '#mgroupListContent', function (e) {
                        _this.refresh();
                    });
                    this.refreshInit = true;
                }
                this.getData(null, opt);
            },
            getData: function (callback, searchData) {
                var _this = this;
                this.loading = true;
                searchData = searchData ? searchData : this;
                this.$http.post('/sysmanager/getUserGroups.action?token=' + Constant.token, {
                    groupName: searchData.searchName
                }).then(function (ret) {
                    _this.loading = false;
                    if (ret.ok && ret.data) {
                        var data = ret.data;
                        if (data && _this.groups.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                for (var j = 0; j < _this.groups.length; j++) {
                                    if (data[i].id == _this.groups[j].id) {
                                        data[i].checked = true;
                                        break;
                                    }
                                }
                            }
                        }
                        _this.items = data;
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
                this.items = [];
                this.searchName = '';
            },
            refresh: function () {
                this.getData(function () {
                    $.pullToRefreshDone('#mgroupListContent');
                });
            },
            /**
             * 查看已经选择了谁
             */
            who: function () {
                var userlength = this.groups.length;
                if (userlength == 0) {
                    $.toast('没有选择任何企业');
                    return;
                }
                this.showModal = true;
            },
            detail: function (item) {
                Vue.set(item, 'checked', !item.checked);
                if (item.checked) {
                    this.groups.push(item);
                } else {
                    var i = getRemoveGroupIndex(this.groups, item.id);
                    if (i != -1) {
                        this.groups.splice(i, 1);
                    }
                }
            },
            all: function () {
                Constant.bo.isOpen = 1;
                Constant.create.isOpen = 1;
                router.go({name: 'create', params: {deptId: Constant.shopInfo.id ? Constant.shopInfo.id : 0}});
            },
            ok: function () {
                if (Constant.bo)
                    Constant.bo.isOpen = 0;
                Constant.create.isOpen = 0;
                this.grouplist = [];
                this.grouplist = $.extend(true, this.grouplist, this.groups);
                this.grouplist.push({});
                this.grouplist.pop();
                Constant.selectedGroups = this.grouplist;
                router.go({name: 'create', params: {deptId: Constant.shopInfo.id ? Constant.shopInfo.id : 0}});
            },
            deleteGroup: function (user) {
                Vue.set(user, 'checked', !user.checked);
                var i = getRemoveGroupIndex(this.groups, user.id);
                if (i != -1) {
                    this.groups.splice(i, 1);
                }
                if (this.groups.length == 0) {
                    this.showModal = false;
                }
            }
        }
    };

    function getRemoveGroupIndex(groups, id) {
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    function getIdsNames(data) {
        var ids = '', names = '';
        for (var i = 0; i < data.length; i++) {
            ids += data[i].id;
            names += data[i].showName;
            if (i < data.length - 1) {
                ids += ',';
                names += ',';
            }
        }
        return {
            ids: ids,
            names: names
        };
    }
</script>

<style>
    .content.mu-content {
        background: #fff;
    }

    .mutiple-groups .item-left {
        float: left;
        height: 30px;
        line-height: 30px;
        text-align: left;
        width: 100%;
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

    .mutiple-groups .item-icon {
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

    .mutiple-groups .dlg-title {
        height: 30px;
        line-height: 30px;
        margin-top: 10px;
        background: #fff;
        border-bottom: 1px solid #ddd;
        color: #333;
        text-align: center;
    }

    .mutiple-groups .dialog-overlay {
        z-index: 3001;
    }

    .mutiple-groups .dialog {
        z-index: 3002;
    }

    .public {
        color: #fa0;
    }

    .modal-ul li.group-li {
        display: block;
    }

    .mutiple-groups .dlg-username {
        width: 100%;
        text-align: left;
    }
</style>
