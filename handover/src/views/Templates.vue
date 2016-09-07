<template>
    <div class="page-group" :transition="transitionName">
        <div class="page page-current container" id="index">
            <header class="bar bar-nav">
                <h1 class='title'>请选择一个类型</h1>
                <span class="pull-left icon-back" v-on:click="backTo()" v-if="showBackBtn==1"></span>
            </header>
            <div id="templatesContent" class="content">
                <div class="items-list">
                    <ul>
                        <li v-on:click="detail('','')" v-if="$route.params.dowhich==0">
                            <div class="">
                                <div class="item-name">全部</div>
                            </div>
                        </li>
                        <li v-for="item in items" v-on:click="detail(item.id,item.name,item.moudleType)">
                            <div class="">
                                <div class="item-name">{{item.name}}</div>
                            </div>
                        </li>
                        <li v-on:click="detail('','')" v-if="$route.params.dowhich==1">
                            <div class="">
                                <div class="item-name">无</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        route: {
            data: function (transition) {
                transition.next();
            }
        },
        data: function () {
            return {
                transitionName: 'right',
                loading: false,
                items: [],
                scrollInit: false,
                infiniteInit: false,
                refreshInit: false,
                showBackBtn: Constant.showBackBtn
            };
        },
        ready: function () {
            this.init();
        },
        methods: {
            backTo: function () {
                var curPathName = Constant.curRoute.pathName;
                var backInfo = utils.getBackPath(curPathName);
                Constant.needRefresh = false;
                if (Constant.curRoute.path.indexOf('/templates/0') > -1) {//主界面，选择类型时，返回到主界面
                    router.go({name: 'default'});
                } else {
                    router.go({name: backInfo.parent, params: backInfo.params});
                }
            },
            init: function () {
                if (!this.refreshInit) {
                    $('#templatesContent').scroller({
                        type: 'native'
                    });
                    this.refreshInit = true;
                }
                this.getData();
            },
            getData: function () {
                //this.items = Constant.bo.moudles;
                var _this = this;
                this.$http.post('/service/getMoudlesByGroupId.action?token=' + Constant.token, {}).then(function (ret) {
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        _this.items = ret.data.data.data;
                    }
                });
            },
            clearData: function () {
                this.items = [];
            },
            detail: function (id, name, type) {
                if (this.$route.params.dowhich == 1) {//创建时，选择工作圈的类型
                    Constant.bo.moudleId = id;
                    Constant.bo.moudleName = name;
                    Constant.bo.moudleType = type;
                    router.go({name: 'create', params: {deptId: Constant.shopInfo.id ? Constant.shopInfo.id : 0}});
                } else if (this.$route.params.dowhich == 0) {//查询时，筛选类型
                    Constant.module.id = id;
                    Constant.module.name = name;
                    Constant.needRefresh = true;
                    router.go({name: 'default'});
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
        padding: 15px 10px;
    }

    .item-name {
        white-space: normal;
        word-break: normal;
        font-size: 14px;
    }
</style>
