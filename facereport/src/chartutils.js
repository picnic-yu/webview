

//pie图表定义
module.exports.getPieChartOption = function(){
  return {
    option:{
      animation: false,
      series : [ {
        type : 'pie',
        radius: ['35%', '55%'],
        color:['#8acc47','#04bafe','#ff4d27', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
        avoidLabelOverlap : true,
        itemStyle : {
          normal : {
            label : {
              show : true,
              formatter:function(params){
                var str = '';
                if(params){
                  str = params.name+":"+params.value;
                }
                return str;
              }
            },
            labelLine : {
              show : true,
              length:2
            }
          }
        },
        data: [{
          name: '',
          value: 0
        }]
      }]
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
        name:'暂无数据',
        value:1
      }]
    } ]
  };
};
