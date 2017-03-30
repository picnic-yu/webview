<template>
    <div class="popup popup-relevancy">
        <header class="bar bar-nav">
            <h1 class='title' v-i18n="{value:'selectrelatedevice'}"></h1>
        </header>
        <div class="content pull-to-refresh-content" id="shopListContent" data-ptr-distance="55">
            <div class="pull-to-refresh-layer">
                <div class="preloader"></div>
                <div class="pull-to-refresh-arrow"></div>
            </div>
            <div class="device-list items-list">
                <ul>
                    <li v-for="device in devices">
                        <table><tr v-on:click="selectDevice(device)"><td colspan="2"><span class="item-icon" v-bind:class="!!device.checked?'icon-square-check':'icon-square'"></span><span class="item-name">{{device.device_alias_name}}</span></td></tr>
                            <tr v-on:click="selectDevice(device)"><td><span class="item-mac">{{device.ipcmac}}</span></td><td align="right"><span class="item-mac">{{device.device_type}}</span></td></tr>
                            <tr v-show="device.accessType==2"><td><span class="item-username">用户名</span><input id="userinput_{{device.ipcmac}}" type="text" class="device-input"></td>
                                <td align="right"><span class="item-username">密码</span><input id="pwd_{{device.ipcmac}}" type="text" class="device-input"></td></tr>
                        </table>
                    </li>
                </ul>
            </div>
        </div>
        <div class="bottom">
            <p class="submit-panel"><a class="button button-fill  button-orange"  v-on:click="submit()" v-bind:class="selectDevices.length>0 && !doing?'':'disabled'" v-i18n="{value:'ok'}"></a></p>
            <p class="submit-panel"><a class="button button-fill  button-dark"  v-on:click="close()" v-i18n="{value:'cancel'}"></a></p>
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
                this.$http.post('/service/searchNvrDev.action?token='+Constant.token,{
                    serialNo:Constant.device.mac
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
                var selectedArray = this.getSelectedDevices();
                if(!selectedArray) return;
                this.doing = true;
                $.showPreloader(this.$translate('islinking'));
                this.$http.post('/service/addNvrDevNew.action?token='+Constant.token,JSON.stringify({
                    serialNo :Constant.device.mac,
                    deviceBos : selectedArray
                })).then(function(ret){
                    $.hidePreloader();
                    _this.doing = false;
                    if(ret.ok && ret.data){
                        if(ret.data.result == 'EXCEED_LIMIT'){
                            $.alert(this.$translate('limiterror')+":"+ret.data.data.data);
                            return;
                        }else if(ret.data.result != 'ok'){
                            $.toast(this.$translate('linkfailed'));
                            return;
                        }
                        var res = ret.data.data.data;
                        var flag = true;
                        for ( var i = 0; i < res.length; i++) {
                            if(res[i].result != 200000 && res[i].result != 404002){
                                if(res[i].result == 404005){
                                    $.alert(this.$translate('cannotlinkdevice')+res[i].ipcmac);
                                }else if(res[i].result == 404003){
                                    $.alert(this.$translate('devicefor')+res[i].ipcmac+this.$translate('usernamepasswordnotright'));
                                }else if(res[i].result == 404002){
                                    $.alert(this.$translate('devicefor')+res[i].ipcmac+this.$translate('hasexist'));
                                }else if(res[i].result == 400000){
                                    $.alert(this.$translate('devicefor')+res[i].ipcmac+this.$translate('linkfailed'));
                                }
                                flag = false;
                            }
                        }
                        if(flag){
                            $.toast(this.$translate('linksuccess'));
                            _this.close();
                            _this.$dispatch('refreshDeviceList');
                        }


                        /*if(res.add_result == 0){
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
                                $.toast(this.$translate('linksuccess'));
                                _this.close();
                                _this.$dispatch('refreshDeviceList');
                            }else if(error < _this.selectDevices.length){
                                $.alert(this.$translate('linkdevno')+errorMacs+this.$translate('devicesfailed'),function(){
                                    _this.close();
                                    _this.$dispatch('refreshDeviceList');
                                });
                            }else{
                                $.toast(this.$translate('alldevicelinkfailed'));
                            }
                        }else{
                            $.toast(this.$translate('linkfailed'));
                        }*/
                    }
                });
            },
            close:function(){
                this.clearData();
                $.closeModal('.popup-relevancy');
            },
            getSelectedDevices:function(){
                var selectedArray = [];
                for(var i=0;i<this.selectDevices.length;i++){
                        var obj = this.selectDevices[i];
                        var username = "";
                        var pwd = "";
                        if(obj.accessType==2){
                            username = $("#userinput_"+obj.ipcmac).val();
                            pwd = $("#pwd_"+obj.ipcmac).val();
                            if(!username){
                                $.alert("MAC:"+obj.ipcmac+"的用户名不能为空");
                                $("#userinput_"+obj.ipcmac).focus();
                                return null;
                            }
                            if(!pwd){
                                $.alert("MAC:"+obj.ipcmac+"的密码不能为空");
                                $("#pwd_"+obj.ipcmac).focus();
                                return null;
                            }
                        }
                        selectedArray.push({
                            ipcmac : obj.ipcmac,
                            accessType : obj.accessType,
                            userName : username,
                            passwd :  pwd
                        });
                }
                return selectedArray;
            }
        }
    };

    function add(devices,device){
        devices.push({
            ipcmac : device.ipcmac,
            accessType : device.accessType,
            device_type :  device.device_type
        });
        return devices;
    }
    function remove(devices,device){
        var index = -1;
        for(var i=0;i<devices.length;i++){
            if(devices[i].ipcmac == device.ipcmac){
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

.items-list table{
    width:100%;
}
    .submit-panel{
        margin:5px 10px;
        margin-bottom: 0px;
    }
    .item-mac{
        margin-right:5px;
        font-size:14px;
        margin-left:30px;
    }
    .device-input{
        border:1px solid #ddd;
        width:80px;
    }
    .item-username{
        font-size: 14px;
        margin-right:5px;
        margin-left:30px;
    }
</style>