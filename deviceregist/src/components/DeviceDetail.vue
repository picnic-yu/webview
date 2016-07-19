<template>
    <div class="popup popup-deviceinfo">
        <header class="bar bar-nav">
            <h1 class='title'>设备详情</h1>
        </header>
        <div class="content ">
            <div class="list-block">
                    <ul>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">设备名称</div>
                                    <div class="item-input"><span class="item-input-span">{{device.deviceName}}</span></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">设备类型</div>
                                    <div class="item-input"><span class="item-input-span">{{device.deviceType}}</span></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">设备版本</div>
                                    <div class="item-input"><span class="item-input-span">{{device.version}}</span></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">IP地址</div>
                                    <div class="item-input"><span class="item-input-span">{{device.deviceIp}}</span></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">视频状态</div>
                                    <div class="item-input"><span class="item-input-span" v-bind:class="device.onlineOnPlatform?'':'red'">{{device.onlineOnPlatform?'在线':'不在线'}}</span></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">网管状态</div>
                                    <div class="item-input"><span class="item-input-span" v-bind:class="device.online?'':'red'">{{device.online?'在线':'不在线'}}</span></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">PUID</div>
                                    <div class="item-input"><textarea readonly class="item-input-span">{{device.puid}}</textarea></div>
                                </div>
                            </div>
                        </li>
                    </ul>
            </div>
        </div>
        <div class="bottom">
            <p class="submit-panel"><a class="button button-fill  button-orange"  v-on:click="close()">确定</a></p>
        </div>
        </div>
    </div>
</template>
<script>
    module.exports = {
        props:{
            device:{
                type:Object,
                twoWay:true,
                default:function(){
                    return {
                        id:'',
                        deviceName:'',
                        deviceType:'',
                        version:'',
                        latestVersion:'',
                        dType:'',
                        deviceIp:'',
                        puid:'',
                        mac:'',
                        mac1:'',
                        online:'',
                        onlineOnPlatform:''
                    };
                }
            }
        },
        data: function () {
            return {
                hasInit:false
            };
        },
        events:{
            'popup':function(param){
                if(param.name == 'device-info'){
                    $.popup('.popup-deviceinfo');
                    this.getData();
                }
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            init: function () {
                this.hasInit = true;
            },
            clearData:function(){
                this.device = {};
            },
            getData:function(){
                var _this = this;
                if(this.device.id) return;
                this.$http.post('/service/getDeviceByMac0.action?token='+Constant.token,{
                    mac:Constant.device.mac
                }).then(function(ret){
                    if(ret.ok && ret.data){
                        _this.device = ret.data.data.data;
                    }
                });
            },
            close:function(){
                this.clearData();
                $.closeModal('.popup-deviceinfo');
            }
        }
    };
</script>
<style scoped>
.content{
    bottom:50px;
}
.bottom{
    position: absolute;
    bottom: 5px;
    width: 100%;
}

.item-icon{
    font-size: 20px;
}
.item-name{
    margin-left: 10px;
    word-wrap: break-word;
}
.items-list li{
    flex-direction: row ;
}
    .submit-panel{
        margin:5px 10px;
        margin-bottom: 0px;
    }
    .item-input-span{
        height: auto;
    }
    .red{
        color: red;
    }
</style>