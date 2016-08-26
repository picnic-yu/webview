<template>
    <div class="userhead-container">
        <div class="default-header header-{{getWhichHeader(user.userId||user.id)}}"
             v-if="!user.thumbUrl && !user.userPicture">
            <!--<span class="user-icon"></span>-->
            <span class="user-shortname">{{user.shortName || user.userShortName}}</span>
        </div>
        <img class="user-header-img" v-if="user.thumbUrl || user.userPicture"
             v-bind:src="user.thumbUrl || user.userPicture" width="42px" height="42px"/>
    </div>
</template>
<script>
    module.exports = {
        data: function () {
            return {};
        },
        props: {
            user: {
                type: Object,
                default: function () {
                    return {
                        id: '',
                        userId: '',
                        thumbUrl: '',
                        userPicture: '',
                        userShortName: '',
                        shortName: ''
                    };
                }
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            /**
             * 获取用户头像简单算法，末位数
             * */
            getWhichHeader: function (id) {
                id = id + '';
                return id.substr(id.length - 1, 1);
            },
            init: function () {

            }
        }
    };
</script>
<style>
    .user-header-img {
        border-radius: 21px;
    }

    .default-header {
        background: #48dc6c;
        width: 42px;
        height: 42px;
        border-radius: 21px;
        text-align: center;
        margin: 0 auto;
    }

    .default-header .user-icon {
        background: url("../../../common/assets/imgs/userface.png") no-repeat;
        width: 16px;
        height: 24px;
        background-size: 100%;
        display: inline-block;
        margin-top: 10px;
    }

    .default-header .user-shortname {
        height: 24px;
        display: inline-block;
        margin-top: 12px;
        font-size: 13px;
        color: #fff;
    }

    .header-0 {
        background: #48dc6c;
    }

    .header-1 {
        background: #6b72e7;
    }

    .header-2 {
        background: #0192ff;
    }

    .header-3 {
        background: #2dbae7;
    }

    .header-4 {
        background: #61d2fe;
    }

    .header-5 {
        background: #fe4a65;
    }

    .header-6 {
        background: #ff5534;
    }

    .header-7 {
        background: #ffa500;
    }

    .header-8 {
        background: #fed201;
    }

    .header-9 {
        background: #bb59ff;
    }
</style>