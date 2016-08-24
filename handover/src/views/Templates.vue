<template>
    <div class="page-group" :transition="transitionName">
        <div class="page page-current container" id="index">
            <header class="bar bar-nav">
                <h1 class='title'>请选择一个交接表</h1>
            </header>
            <div id="templatesContent" class="content">
                <div class="items-list">
                    <ul>
                        <li v-for="item in items" v-on:click="detail(item.id,item.name)">
                            <div class="">
                                <div class="item-name">{{item.name}}</div>
                            </div>
                        </li>
                        <li v-on:click="detail('','')">
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
                refreshInit: false
            };
        },
        ready: function () {
            this.init();
        },
        methods: {
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
                this.items = Constant.bo.moudles;
            },
            clearData: function () {
                this.items = [];
            },
            detail: function (id, name) {
                Constant.bo.moudleId = id;
                Constant.bo.moudleName = name;
                router.go({name: 'create', params: {deptId: Constant.shopInfo.id ? Constant.shopInfo.id : 0}});
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
