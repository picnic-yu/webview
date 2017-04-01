<template>
    <div class="page-group">
        <div class="page page-current container app" id="index">
            <header class="bar bar-nav">
                <h1 class='title' v-i18n="{value:'hotspotdata'}"></h1>
                <span class="pull-left icon-back" v-on:click="backTo()"></span>
            </header>
            <div class="top-panel">
                <div class="search-box search-box-shop" v-on:click="goToShoplist()">
                    <div class="search-box-left"><span class="icon-shop"></span></div>
                    <div class="search-box-right">
                        <a class="search-shop-tip"  v-show="!shopInfo.id" v-i18n="{value:'selectdepartment'}"></a>
                        <span class="search-shop"   v-show="shopInfo.id">{{shopInfo.name}}</span>
                    </div>
                </div>
                <div class="search-box search-box-time" v-on:click="searchMore()">
                    <div class="search-box-left"><span class="icon-calendar"></span></div>
                    <div class="search-box-right">
                        <div class="search-time">
                            <div class="timebox">
                                <label class="date-time">{{search.startTime}}<span class="is-today" v-show="search.startTime|istoday" v-i18n="{value:'today'}"></span></label><br>
                                <span class="datetime-tip" v-i18n="{value:'starttime'}"></span>
                            </div>
                            <div class="to">～</div>
                            <div class="timebox">
                                <label class="date-time">{{search.endTime}}<span class="is-today" v-show="search.endTime|istoday" v-i18n="{value:'today'}"></span></label><br>
                                <span class="datetime-tip" v-i18n="{value:'endtime'}"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="dataContent" class="content content-items">
                <div class="no-data" v-show="display.nodata" v-i18n="{value:'nohotspotdata'}"></div>
                <!--<div class="hs-container" >

                    &lt;!&ndash;<img src="../../../common/assets/imgs/hotspot_default_bg.png" width="{{layout.width}}px"/>&ndash;&gt;
                </div>-->
                <div class="swiper-container">
                    <div class="swiper-pagination" v-show="devices.length>1"></div>

                    <div class="data-container swiper-wrapper" v-show="devices.length>0">
                        <div class="swiper-slide" v-for="device in devices">
                            <div v-show="display.showareas" class="canvas" id="canvas-{{$index}}" v-bind:style="{width:layout.width-10+'px',height:(layout.width-10)*3/4+'px'}"></div>
                            <h2 class="device-name">{{device.deviceName}}</h2>

                            <div class="hs-container" v-bind:style="{minHeight:(layout.width-10)*3/4+'px'}">
                                <img v-bind:src="device.thumb" width="{{layout.width-10}}px"/>

                                <div class="hotspot-overlay">
                                    <img v-bind:src="device.hotmap" width="{{layout.width-10}}px"
                                         height="{{(layout.width-10)*3/4}}px"/>
                                </div>
                            </div>
                            <div class="opt-container">
                                <a class="hide-btn" v-on:click="toggleShowArea()">{{bottomBtnText}}</a>
                            </div>
                            <div class="data-container">
                                <ul>
                                    <li class="data-li" v-for="area in areas">
                                        <div class="area-item">
                                            <table>
                                                <tr class="area-name"><td colspan="4">{{area.productName}}</td></tr>
                                                <tr class="no"><td>{{area.remain}}</td><td>{{area.validRemain}}</td><td>{{area|whichrate}}</td><td>{{area.remainAvg}}<span v-i18n="{value:'second'}"></span></td></tr>
                                                <tr class="data-name"><td><span v-i18n="{value:'flowcount'}"></span></td><td><span v-i18n="{value:'stopcount'}"></span></td><td><span v-i18n="{value:'stoprate'}"></span></td><td><span v-i18n="{value:'stopavg'}"></span></td></tr>
                                            </table>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    require('../../../common/assets/css/sm-extend.min.css');
    require('../../../common/assets/font.css');
    require('../../../common/libs/sm-extend.js');
    var commonutils = require('../../../common/assets/js/commonutils');
    var drawutils = require('./../draw');
    var num = 20;//每页显示的条数
    module.exports =  {
        route:{
            data:function(transition){
                if(Constant.shopInfo.id || Constant.search.startTime){
                    if(this.refreshInit){
                        this.getDevices({
                            //selectIndex:0,
                            search:Constant.search,
                            shopInfo:Constant.shopInfo
                        });
                    }
                }
                transition.next({
                    //selectIndex:0,
                    search:Constant.search,
                    shopInfo:Constant.shopInfo
                });
            },
            deactivate:function(transition){
                this.clearData();
                transition.next();
            }
        },
        data:function(){
            return {
                search:{
                    startTime:'',
                    endTime:'',
                    mac:'',
                    minTime:5
                },
                shopInfo:{
                    id:'',
                    name:''
                },
                layout:{
                    width:$('body').width()
                },
                display:{
                    nodata:false,
                    loadimg:true,
                    showareas:true
                },
                hasInitSwiper:false,
                bottomBtnText:this.$translate("hiddlayer"),
                selectIndex:0,
                loading:false,
                devices:[],//当前门店的设备列表
                deviceCache:{},
                areas:[],
                areaCache:{},
                hotMapCache:{},//热点热力图缓存
                refreshInit:false
            }
        },
        created:function(){

        },
        filters:{
            'whichrate':function(area){
                if(area.remain == 0) return '0%';
                return (100*area.validRemain/area.remain).toFixed(1)+'%';
            }
        },
        ready:function(){
            Constant.search = this.search;
            this.initData();
            this.init();
        },
        methods:{
            initData:function(){
                var time = commonutils.getThisWeekTime();
                this.search.startTime = time.startTime;
                this.search.endTime = time.endTime;
            },
            init:function(){
                if(!this.refreshInit){
                    $('#dataContent').scroller({
                        type:'native'
                    });
                    this.refreshInit = true;
                }
                this.getDefaultShop();
            },
            backTo: function () {
                if ($.device.android) {
                    try{
                        window.webview && window.webview.closeCurrentInterface();
                    } catch (e) {
                    }
                } else if ($.device.ios) {
                    try {
                        window.webkit.messageHandlers.closeCurrentInterface.postMessage(1);
                    } catch (e) {
                    }
                } else {

                }
            },
            getDefaultShop: function () {
                var _this = this;
                this.$http.post('/service/getDefaultHotspotShop.action?token=' + Constant.token, {}).then(function (ret) {
                    if (ret.ok && ret.data && ret.data.result == 'ok') {
                        var data = ret.data.data.data;
                        if (data) {
                            _this.shopInfo.id = data.id;
                            _this.shopInfo.name = data.name;
                            _this.display.nodata = false;
                            _this.getDevices();
                        } else {
                            _this.display.nodata = true;
                        }
                    }
                });
            },
            /**
             * 获取当前门店下的热点设备
             * @param searchData
             */
            getDevices:function(searchData){
                var _this = this;
                searchData = searchData?searchData:this;
                var depId = searchData.shopInfo.id;
                if(!depId){
                    return;
                }
                $.showPreloader(this.$translate("loading"));
                if(this.deviceCache[depId] == 0){
                    $.hidePreloader();
                    $.toast(this.$translate("nohotspotdevice"));
                    _this.display.nodata = true;
                    return;
                }else if(this.deviceCache[depId]){
                    _this.display.nodata = false;
                    this.devices = this.deviceCache[depId];
                    searchData.search.mac = this.devices[this.selectIndex].mac;
                    this.initSwiper();
                    this.getDeviceHotspotZone(searchData);
                    this.getDeviceHotspot(searchData);
                    return;
                }
                this.$http.post('/service/gethotSpotsDevices.action?token='+Constant.token,{
                    depId:depId
                }).then(function(ret){
                    if(ret.ok && ret.data){
                        _this.devices = _this.formatData(ret.data.data);
                        _this.deviceCache[depId] = _this.devices;
                        if(!_this.devices || _this.devices.length == 0){
                            _this.deviceCache[depId] = 0;
                            $.hidePreloader();
                            $.toast(this.$translate("nohotspotdevice"));
                            _this.display.nodata = true;
                            return;
                        }
                        _this.display.nodata = false;
                        _this.initSwiper();
                        searchData.search.mac = _this.devices[_this.selectIndex].mac;
                        _this.getDeviceHotspotZone(searchData);
                        _this.getDeviceHotspot(searchData);
                    }
                });
            },
            /**
             * 获取热点区域数据
             * @param searchData
             */
            getDeviceHotspotZone:function(searchData){
                var areas;
                if((areas = this.areaCache[getCacheKey(this.shopInfo.id,searchData.search,this.selectIndex)])){
                    this.areas = areas;
                    $.hidePreloader();
                    drawutils.draw({
                        container:'canvas-'+this.selectIndex,
                        width:this.layout.width-10,
                        height:(this.layout.width-10)*3/4
                    },areas);
                    return;
                }
                var _this = this;
                this.$http.post('/service/getDeviceHotspotZone.action?token='+Constant.token,{
                    mac:searchData.search.mac,
                    startTime:searchData.search.startTime+" 00:00:00",
                    endTime:searchData.search.endTime+" 23:59:59",
                    minTime:5
                }).then(function(ret){
                    $.hidePreloader();
                    if(ret.ok && ret.data && ret.data.result == 'ok'){
                        _this.areas = ret.data.data.data;
                        _this.areaCache[getCacheKey(_this.shopInfo.id,searchData.search,_this.selectIndex)] = _this.areas;//缓存起来
                        drawutils.draw({
                            container:'canvas-'+_this.selectIndex,
                            width:_this.layout.width-10,
                            height:(_this.layout.width-10)*3/4
                        },_this.areas);
                    }
                });
            },
            /**
             * 获取热力图
             * @param searchData
             */
            getDeviceHotspot:function(searchData){
                if(this.hotMapCache[getCacheKey(this.shopInfo.id,searchData.search,this.selectIndex)]){
                    this.devices[this.selectIndex].hotmap = this.hotMapCache[getCacheKey(this.shopInfo.id,searchData.search,this.selectIndex)];
                    $.hidePreloader();
                    return;
                }
                var _this = this;
                this.$http.post('/service/getDeviceHotspot.action?token='+Constant.token,{
                    mac:searchData.search.mac,
                    startTime:searchData.search.startTime+" 00:00:00",
                    endTime:searchData.search.endTime+" 23:59:59",
                    gauss:1
                }).then(function(ret){
                    if(ret.data && ret.data.result == 'ok'){
                        _this.hotMapCache[getCacheKey(_this.shopInfo.id,searchData.search,_this.selectIndex)] =
                                _this.devices[_this.selectIndex].hotmap = ret.data.data.data.hotmap;
                    }
                });
            },
            /**
             * 格式化数据
             */
            formatData:function(data){
                if(data){
                    for(var i=0;i<data.length;i++){
                        data[i].hotmap = '';
                    }
                }
                return data;
            },
            clearData:function(){
                this.areaCache = {};
            },
            searchMore:function(){
                Constant.search = this.search;
                router.go({path:'/search'});
            },
            goToShoplist:function(){
                router.go({path:'/shoplist'});
            },
            toggleShowArea:function(){
                this.display.showareas = !this.display.showareas;
                if(this.display.showareas){
                    this.bottomBtnText = this.$translate("hiddlayer");
                }else{
                    this.bottomBtnText = this.$translate("showlayer");
                }
            },
            initSwiper:function(){
                var _this = this;
                setTimeout(function(){
                    if(!_this.hasInitSwiper){
                        _this.hasInitSwiper = true;
                        $('.swiper-container').swiper({
                            //initialSlide:_this.selectIndex,
                            pagination:'.swiper-pagination',
                            onSlideChangeStart:function(swiper){
                                $.showPreloader(this.$translate("loading"));
                                _this.selectIndex = swiper.activeIndex;
                                _this.search.mac = _this.devices[swiper.activeIndex].mac;
                                _this.getDeviceHotspotZone(_this);
                                _this.getDeviceHotspot(_this);
                            },
                            onSlideChangeEnd:function(swiper){

                            }
                        });
                    }else{
                        $.reinitSwiper('.swiper-container');
                    }
                },1000);
            }
        }
    };

    /**
     *
     * 获取缓存的key(类似时间戳)
     * @param search
     * @returns {string}
     */
    function getCacheKey(depId,search,index){
        return depId+"-"+search.startTime+'-'+search.endTime+'-'+index;
    }
</script>

<style>
    /**{
      -webkit-touch-callout:none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }*/
    html {
        height: 100%;
    }
    body {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color:#333;
    }
    ul{list-style: none}
    #dataContent{overflow-x: hidden;top:144px;z-index:4;background: #eee;}
    .buttons-tab.head-tab a.tab-link{width:120px;top:0px;height:44px;line-height: 44px;color: #999;}
    .buttons-tab.head-tab .button.active{border-color:#f90; color: #333;font-size: 18px}
    .timebox .date-time{font-size: 16px;}
    .timebox .datetime-tip{font-size: 12px;color:#999;}
    header.bar,.content{background: #fff;}
    .is-today{color:#f90;font-size: 15px;}

    .search-box{
        text-align: left;
        height:40px;
        background: #fff;
        border-bottom: 1px solid #ddd;
    }
    .search-box-time{
        height:58px;
    }
    .search-box-left{
        float: left;
        width:60px;
        text-align: center;
        font-size: 20px;
        line-height: 40px;
    }
    .search-box-time .search-box-left{
        line-height: 58px;
    }
    .search-box-right{
        width: 100%;
        font-size: 16px;
    }
    .search-box-shop .search-box-right{
        line-height: 40px;
    }
    .search-time{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 58px;
    }

    .search-shop-tip{
        color: #999;
        height:30px;
        line-height: 30px;
    }
    .search-shop{
        color: #333;
        max-width: 200px;
        max-width:calc(100% - 80px);
        overflow: hidden;
        text-overflow:ellipsis;
        -o-text-overflow:ellipsis;
        white-space:nowrap;
        display: inline-block;
    }
    .to{
        margin:0 20px;
    }


    .top-panel{
        background: #eee;
        font-size: 14px;
        position: absolute;
        top:44px;
        width: 100%;
        z-index:5;
    }
    .items-list ul{margin:0;padding:0px;}
    .items-list li{border-bottom: 1px solid #ddd;padding:5px 10px;display: flex;align-items: flex-start;flex-direction: column;}
    .item-num span{
        font-size: 16px;
    }
    .hs-container{
        background: #fff;
        padding:0px 5px;
        position: relative;
    }
    .opt-container{
        position: relative;
        background: #fff;
        height: 30px;
    }
    .data-container{
        width: 100%;
        background: #fff;
    }
    .device-name{
        padding: 0px;
        margin: 0px;
        height: 45px;
        line-height: 30px;
        text-align: center;
        color: #333;
        font-size: 16px;
        width: 100%;
        background: #fff;
    }
    .hotspot-overlay{position: absolute;left:5px;top:0px;z-index: 2;height:100%;}
    .area-data{float: right;width:25%;height:100%;overflow: auto;position: relative;}
    .area-item{border:1px solid #ddd;background: #fff;border-radius:4px;margin:10px;cursor: pointer;}
    /*.area-item:HOVER{background: #fa0;border-color: #fa0;color: #fff}
    .area-item.active{background: #f90;border-color: #f90;color: #fff}*/
    .no{font-size: 18px;vertical-align: bottom;text-align: center;}
    .data-name{height:20px;vertical-align: top;font-size: 12px;text-align: center;color: #888;}
    .area-item table{margin:0 auto;width: 100%;}
    .area-name{text-align: center;font-size: 20px;height:35px;}
    .swiper-pagination,.content .swiper-container-horizontal>.swiper-pagination{
        top:20px;
        bottom: auto;
    }
    .canvas{
        position: absolute;
        top:45px;
        z-index: 99;
        left:5px;
    }
    .hide-btn{
        float: right;
        height: 30px;
        line-height: 30px;
        margin-right: 10px;
    }

    .app .no-data {
        width: 100%;
        height: 100%;
        color: red;
        text-align: center;
        margin-top: 40px;
    }
    @media all and (max-width:360px){
        .timebox .date-time{font-size: 12px;}
        .is-today{font-size: 12px;}
    }
</style>
