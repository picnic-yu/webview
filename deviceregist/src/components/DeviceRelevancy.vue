<template>
    <div class="popup popup-relevancy">
        <header class="bar bar-nav">
            <h1 class='title'>选择关联设备</h1>
        </header>
        <div class="content pull-to-refresh-content" id="shopListContent" data-ptr-distance="55">
            <div class="pull-to-refresh-layer">
                <div class="preloader"></div>
                <div class="pull-to-refresh-arrow"></div>
            </div>
            <div class="device-list items-list">
                <ul>
                    <li v-for="device in devices" v-on:click="selectDevice(device)">
                        <span class="item-icon" v-bind:class="!!device.checked?'icon-square-check':'icon-square'"></span><span class="item-name">{{device.deviceName}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="bottom">
            <p class="submit-panel"><a class="button button-fill  button-orange"  v-on:click="submit()" v-bind:class="selectDevices.length>0 && !doing?'':'disabled'">确认</a></p>
            <p class="submit-panel"><a class="button button-fill  button-dark"  v-on:click="close()">取消</a></p>
        </div>
    </div>
</template>
<script>
    require('../../../common/assets/font.css');
    module.exports = {
        route:{
            data:function(transition){
                if(this.refreshInit){
                    this.getData();
                }
                transition.next({
                    doing:false
                });
            },
            deactivate:function(transition){
                this.clearData();
                transition.next();
            }
        },
        data: function () {
            return {
                devices:[],
                selectDevices:[],
                doing:false,
                loading:false,
                refreshInit:false
            };
        },
        events:{
            'popup':function(param){
                if(param.name == 'device-relevancy'){
                    $.popup('.popup-relevancy');
                    this.getData();
                }
            }
        },
        ready: function () {
            this.init();
        },
        methods: {
            init: function () {
                var _this = this;
                if(!this.refreshInit){
                    $('#shopListContent').scroller({
                        type:'native'
                    });
                    $.initPullToRefresh('#shopListContent');
                    $(document).on('refresh','#shopListContent',function(e){
                        _this.refresh();
                    });
                    this.refreshInit = true;
                }
            },
            clearData:function(){
                this.devices = [];
                this.selectDevices = [];
                this.doing = false;
            },
            refresh:function(){
                this.devices = [];
                this.selectDevices = [];
                this.getData(function(){
                    $.pullToRefreshDone('#shopListContent');
                });
            },
            getData:function(callback){
                var _this = this;
                this.loading = true;
                this.$http.post('/service/searchDevicesByDepId0.action?token='+Constant.token,{
                    depId:Constant.shopInfo.id,
                    mac:Constant.device.mac
                }).then(function(ret){
                    _this.loading = false;
                    if(ret.ok && ret.data){
                        var devices = ret.data.data.data;
                        if(devices && devices.length > 0){
                            for(var i=0;i<devices.length;i++){
                                devices[i].checked = false;
                            }
                        }
                        _this.devices = devices;
                        $.refreshScroller();
                    }
                    if(callback) callback();
                });
            },
            selectDevice:function(device){
                if(!device.checked){
                    this.selectDevices = add(this.selectDevices,device);
                }else{
                    remove(this.selectDevices,device);
                }
                device.checked = !device.checked;
            },
            submit:function(){
                if(this.selectDevices.length == 0 || this.doing) return;
                var _this = this;
                this.doing = true;
                $.showPreloader('正在关联设备...');
                this.$http.post('/service/addDevices.action?token='+Constant.token,JSON.stringify({
                    mac :Constant.device.mac,
                    dsList : this.selectDevices
                })).then(function(ret){
                    $.hidePreloader();
                    _this.doing = false;
                    if(ret.ok && ret.data){
                        if(ret.data.result != 'ok'){
                            $.toast('关联失败');
                            return;
                        }
                        var res = ret.data.data.data;
                        if(res.add_result == 0){
                            var addResults = res.add_dev_result;
                            var error = 0,errorMacs = '';
                            for ( var i = 0; i < addResults.length; i++) {
                                if(addResults[i].result != 0 && addResults[i].result != 4){
                                    if(error != 0){
                                        errorMacs += ',';
                                    }
                                    errorMacs+= addResults[i].ipcmac;
                                    error++;
                                }
                            }
                            if(error == 0){
                                $.toast('关联成功');
                                _this.close();
                                _this.$dispatch('refreshDeviceList');
                            }else if(error < _this.selectDevices.length){
                                $.alert('关联序列号为:'+errorMacs+'的设备失败',function(){
                                    _this.close();
                                    _this.$dispatch('refreshDeviceList');
                                });
                            }else{
                                $.toast('全部设备关联失败');
                            }
                        }else{
                            $.toast('关联失败');
                        }
                    }
                });
            },
            close:function(){
                this.clearData();
                $.closeModal('.popup-relevancy');
            }
        }
    };

    function add(devices,device){
        devices.push({
            id:device.id,
            mac : device.mac,
            mac1 : device.mac1,
            deviceName : device.deviceName,
            deviceIp : device.deviceIp,
            deviceType :  device.deviceType
        });
        return devices;
    }
    function remove(devices,device){
        var index = -1;
        for(var i=0;i<devices.length;i++){
            if(devices[i].id == device.id){
                index = i;
                break;
            }
        }
        devices.splice(index,1);
    }
</script>
<style scoped>
.content{
    bottom:95px;
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
</style>