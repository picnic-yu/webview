var vue = require('vue');
//pie图表定义
module.exports.getPieChartOption = function(){
    return {
        option:{
            animation: false,
            series : [ {
                type : 'pie',
                radius: ['35%', '55%'],
                color:['#8acc47','#04bafe','#ff4d27', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                avoidLabelOverlap : false,
                label : {
                    normal : {
                        show : true,
                        position: 'outside'
                        //formatter:'{b}\n{d}%'
                    }
                },
                labelLine : {
                    normal : {
                        show: true
                    }
                },
                data: [{
                    name: '',
                    value: 0
                }]
            } ]
        },
        bestStyleOption:{
            normal : {
                color:'#8acc47'
            }
        },
        goodStyleOption:{
            normal : {
                color:'#04bafe'
            }
        },
        badStyleOption:{
            normal : {
                color:'#ff4d27'
            }
        }
    };
};

module.exports.getNoDataPieChartOption = function(){
    return {
        animation:false,
        series : [ {
            type : 'pie',
            radius : [ '50%', '70%' ],
            color:['#ccc'],
            avoidLabelOverlap : false,
            legendHoverLink:false,
            hoverAnimation:false,
            label : {
                normal : {
                    show : false,
                    position : 'center'
                },
                emphasis : {
                    show : true,
                    textStyle : {
                        fontSize : '30',
                        fontWeight : 'bold'
                    }
                }
            },
            labelLine : {
                normal : {
                    show : false
                }
            },
            animation:false,
            silent:false,
            data : [{
                name:vue.prototype.$translate('common.nodata'),
                value:1
            }]
        } ]
    };
};

module.exports.getTopChartOption_item = function(){
    return {
        title: {
            text: vue.prototype.$translate('checkreport.lastcheckitems'),
            subtext: vue.prototype.$translate('checkreport.lastfivepassitems'),
            left:'center'
        },
        animation: false,
        color:['#ff4d27'],
        grid:{
            top: 50
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            //position:['0%','90%'],
            formatter: function(params){
                if (typeof(params[0].value) == 'undefined') return vue.prototype.$translate('common.nodata');
                var name = params[0].name;
                var namestr = '', lastIndex = 0;
                if (name.length > 10) {
                    namestr += name.substring(0, 10) + '<br>';
                    lastIndex = 10;
                }
                if (name.length > 20) {
                    namestr += name.substring(10, 20) + '<br>';
                    lastIndex = 20;
                }
                if (name.length > 30) {
                    namestr += name.substring(20, 30) + '<br>';
                    lastIndex = 30;
                }
                if (name.length > 40) {
                    namestr += name.substring(30, 40) + '<br>';
                    lastIndex = 40;
                }
                if (name.length > 50) {
                    namestr += name.substring(40, 50) + '<br>';
                    lastIndex = 50;
                }
                if (name.length > 60) {
                    namestr += name.substring(50) + '<br>';
                    lastIndex = 100000;
                }
                namestr += name.substring(lastIndex);
                return namestr + "<br>" + params[0].seriesName + ":" + (params[0].value * 100).toFixed(1) + '%';
            }
        },
        xAxis: {
            type : 'value',
            position: 'bottom',
            max:1,
            //min:0.001,
            axisLabel: {
                show: true,
                formatter: function(value){
                    if (value * 100 % 10 == 0) {
                        return (value * 100) + '%';
                    }
                    return (value * 100).toFixed(1) + '%';
                }
            },
            splitLine: {show:false}
        },
        yAxis: {
            type : 'category',
            axisLine: {show: false},
            axisLabel: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            data : [vue.prototype.$translate('checkreport.checkitems')+'1', vue.prototype.$translate('checkreport.checkitems')+'2', vue.prototype.$translate('checkreport.checkitems')+'3', vue.prototype.$translate('checkreport.checkitems')+'4', vue.prototype.$translate('checkreport.checkitems')+'5']
        },
        series : [
            {
                name:vue.prototype.$translate('checkreport.passpercent'),
                type:'bar',
                label: {
                    normal: {
                        show: true,
                        position: ['0%', '-55%'],
                        formatter: function(params){
                            var name = params.name;
                            if (params.name.length > 20) {
                                name = params.name.substring(0, 20) + '...';
                            }
                            if (params.value * 100 % 10 == 0) {
                                return name + ' ' + (params.value * 100) + '%'
                            } else {
                                return name + ' ' + (params.value * 100).toFixed(1) + '%'
                            }
                        },
                        textStyle : {
                            fontSize : '10',
                            textAlign:'left',
                            color:'#333'
                        }
                    }
                },
                barWidth: 28,
                data:[0, 0,0,0,0]
            }
        ]
    };
};

module.exports.getTopChartOption_shop = function(){
    return {
        animation: false,
        title: {
            text: vue.prototype.$translate('checkreport.lastfivestore'),
            left:'center'
        },
        color:['#ff4d27'],
        grid:{
            top:50
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            //position:['0%','90%'],
            formatter: function(params){
                if (typeof(params[0].value) == 'undefined') return vue.prototype.$translate('common.nodata');
                var name = params[0].name;
                var namestr = '', lastIndex = 0;
                if (name.length > 10) {
                    namestr += name.substring(0, 10) + '<br>';
                    lastIndex = 10;
                }
                if (name.length > 20) {
                    namestr += name.substring(10, 20) + '<br>';
                    lastIndex = 20;
                }
                if (name.length > 30) {
                    namestr += name.substring(20, 30) + '<br>';
                    lastIndex = 30;
                }
                if (name.length > 40) {
                    namestr += name.substring(30, 40) + '<br>';
                    lastIndex = 40;
                }
                if (name.length > 50) {
                    namestr += name.substring(40, 50) + '<br>';
                    lastIndex = 50;
                }
                if (name.length > 60) {
                    namestr += name.substring(50) + '<br>';
                    lastIndex = 100000;
                }
                namestr += name.substring(lastIndex);
                return namestr + "<br>" + params[0].seriesName + ":" + params[0].value + '分';
            }
        },
        xAxis: {
            type : 'value',
            position: 'bottom',
            max:100,
            //min:0.1,
            axisLabel: {
                show: true,
                formatter: '{value}'+vue.prototype.$translate('common.sc')
            },
            splitLine: {show:false}
        },
        yAxis: {
            type : 'category',
            axisLine: {show: false},
            axisLabel: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            data : [vue.prototype.$translate('common.store')+'1', vue.prototype.$translate('common.store')+'2', vue.prototype.$translate('common.store')+'3', vue.prototype.$translate('common.store')+'4', vue.prototype.$translate('common.store')+'5']
        },
        series : [
            {
                name:vue.prototype.$translate('common.scores'),
                type:'bar',
                label: {
                    normal: {
                        show: true,
                        position: ['0%', '-55%'],
                        formatter: function(params){
                            return params.name+' '+params.value+'分';
                        },
                        textStyle : {
                            fontSize : '10',
                            textAlign:'left',
                            color:'#333'
                        }
                    }
                },
                barWidth: 28,
                data:[0, 0,0,0,0]
            }
        ]
    };
};

module.exports.getMyChartOption = function(formatValue){
    return {
        option:{
            animation: true,
            color:['#fa0'],
            backgroundColor:'#fff',
            grid: {
                show:false,
                top:'20px',
                bottom: '5%',
                left:'0',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    axisLabel:{
                        show:true,
                        textStyle:{
                            color:'#999'
                        }
                    },
                    splitLine:{
                        show:false
                    },
                    boundaryGap : true,
                    data : ['08:00','09:00','10:00','11:00','12:00','13:00','14:00']
                }
            ],
            yAxis : [
                {
                    axisLine:{
                        show:false
                    },
                    axisLabel:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:['#eee']
                        }
                    },
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'',
                    type:'line',
                    stack: '',
                    smooth:true,
                    label:{
                        normal:{
                            show:true,
                            position:'top',
                            formatter: function(params){
                                if(formatValue&&formatValue=="1"){
                                    return (params.value*100).toFixed(1)+'%';
                                }else {
                                    return params.value;
                                }
                            },
                            textStyle:{
                                color:'#999'
                            }
                        }
                    },
                    data:[0, 0, 0, 0, 0, 0]
                }
            ]
        }
    };
};

module.exports.getMyChartOption1 = function(){
    return {
        option:{
            animation: true,
            color:['#fa0','#25c4ff'],
            backgroundColor:'#fff',
            legend:{
                data:[],
                bottom:0,
                textStyle:{
                    color:'#999'
                }
            },
            grid: {
                show:false,
                top:'20px',
                bottom: '10%',
                left:'0',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    axisLabel:{
                        show:true,
                        textStyle:{
                            color:'#999'
                        }
                    },
                    splitLine:{
                        show:false
                    },
                    boundaryGap : true,
                    data : ['08:00','09:00','10:00','11:00','12:00','13:00','14:00']
                }
            ],
            yAxis : [
                {
                    axisLine:{
                        show:false
                    },
                    axisLabel:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:['#eee']
                        }
                    },
                    type : 'value'
                }
            ],
            series : []
        }
    };
};
