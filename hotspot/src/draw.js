/**
 * Created by jxm on 16-7-13.
 */
var Kinetic = require('kinetic');
var widthRate,heightRate;
var width,height;
function draw(opt,data){
    var stage = new Kinetic.Stage({
        container:opt.container,
        width:opt.width,
        height:opt.height
    });
    width = opt.width,height = opt.height;
    widthRate = opt.width/320,heightRate = opt.height/240;
    var shapesLayer = new Kinetic.Layer();
    var tooltipLayer = new Kinetic.Layer();

    var rect = new Kinetic.Rect({
        width:150,
        height:180,
        fill: '#000',
        stroke: '#fff',
        strokeWidth: 1
    });
    var textStroke = '#eee',textWidth = 1,fontFamily = 'Microsoft Yahei, Arial, Helvetica, sans-serif',textOffsetX = 10;
    var text1 = new Kinetic.Text({
        stroke: textStroke,
        strokeWidth: textWidth,
        fontFamily:fontFamily,
        text:'客流人次',
        y:20,
        x:textOffsetX
    });
    var text2 = new Kinetic.Text({
        stroke: textStroke,
        strokeWidth: textWidth,
        fontFamily:fontFamily,
        text:'驻足人次',
        y:60,
        x:textOffsetX
    });
    var text3 = new Kinetic.Text({
        stroke: textStroke,
        strokeWidth: textWidth,
        fontFamily:fontFamily,
        text:'驻足率',
        y:100,
        x:textOffsetX
    });
    var text4 = new Kinetic.Text({
        stroke: textStroke,
        strokeWidth: textWidth,
        fontFamily:fontFamily,
        text:'暂留均时',
        y:140,
        x:textOffsetX
    });
    var rectTip = new Kinetic.Group({
        visible:false
    });
    rectTip.add(rect);
    rectTip.add(text1);
    rectTip.add(text2);
    rectTip.add(text3);
    rectTip.add(text4);
    tooltipLayer.add(rectTip);
    for(var i=0;i<data.length;i++){
        var shape = createShape(data[i],shapesLayer,rectTip,tooltipLayer);
        shapesLayer.add(shape);
    }
    stage.add(shapesLayer);
    stage.add(tooltipLayer);
}

function createShape(data,shapesLayer,rectTip,tooltipLayer){
    var points = [];
    var pots = JSON.parse(data.points);
    var maxX,maxY,minX,minY;
    for(var i=0;i<pots.length;i++){
        var p1 = pots[i][0]*widthRate,p2 = pots[i][1]*heightRate;
        if(!minX || minX > p1){
            minX = p1;
        }
        if(!minY || minY > p2){
            minY = p2;
        }
        if(!maxX || maxX < p1){
            maxX = p1;
        }
        if(!maxY || maxY < p2){
            maxY = p2;
        }
        points.push(p1,p2);
    }
    var group = new Kinetic.Group();
    var shape = new Kinetic.Line({
        points:points,
        closed:true,
        fill: '#eee',
        stroke: '#fff',
        strokeWidth: 1,
        opacity:0.6
    });

    var fontSize = 12;
    var textWidth = data.productName.length*fontSize;
    var text = new Kinetic.Text({
        x: (minX+maxX-textWidth)/2,
        y: (minY+maxY-fontSize)/2,
        text: data.productName,
        fontSize: fontSize,
        fill: '#333'
    });

    var tooltipX = 0,tooltipY = (height-160)/2;
    if(maxX < width/2){
        tooltipX = width-160;
    }else if(minX >= width/2){
        tooltipX = 10;
    }else if(Math.abs(maxX-width/2)<Math.abs(minX-width/2)){
        tooltipX = width-160;
    }else if(Math.abs(maxX-width/2)>=Math.abs(minX-width/2)){
        tooltipX = 10;
    }
    shape.on('touchstart',function(){
        this.fill('#fa0');
        this.stroke('#fa0');
        text.fill('#fff');
        showToolTip(data,rectTip,tooltipLayer,tooltipX,tooltipY);
        shapesLayer.draw();
    });
    shape.on('touchmove',function(){
        this.fill('#eee');
        this.stroke('#fff');
        text.fill('#333');
        shapesLayer.draw();
        hideToolTip(rectTip,tooltipLayer);
    });
    shape.on('touchend',function(){
        this.fill('#eee');
        this.stroke('#fff');
        text.fill('#333');
        shapesLayer.draw();
        hideToolTip(rectTip,tooltipLayer);
    });
    text.on('touchstart',function(){
        shape.fill('#fa0');
        shape.stroke('#fa0');
        this.fill('#fff');
        showToolTip(data,rectTip,tooltipLayer,tooltipX,tooltipY);
        shapesLayer.draw();
    });
    text.on('touchend',function(){
        shape.fill('#eee');
        shape.stroke('#fff');
        this.fill('#333');
        shapesLayer.draw();
        hideToolTip(rectTip,tooltipLayer);
    });
    group.add(shape);
    group.add(text);
    return group;
}

function showToolTip(data,rectTip,tooltipLayer,tooltipX,tooltipY){
    rectTip.setPosition({
        x:tooltipX,
        y:tooltipY
    });
    var children = rectTip.getChildren();
    children[1].text('客流人次 '+data.remain);//设置tip
    children[2].text('驻足人次 '+data.validRemain);
    var rate = '';
    if(data.remain == 0){
        rate = '0%';
    }else{
        rate = (100*data.validRemain/data.remain).toFixed(1)+'%';
    }
    children[3].text('驻足率    '+rate);
    children[4].text('暂留均时 '+data.remainAvg+'秒');
    rectTip.show();
    tooltipLayer.draw();
}

function hideToolTip(rectTip,tooltipLayer){
    rectTip.hide();
    tooltipLayer.draw();
}

function getToolTip(data){
    return '客流人次'+data.remain;
    //return '客流人次'+data.remain+'/r/n'+'驻足人次'+data.remain+'<br>'+'驻足率'+data.remain+'/r/n'+'暂留均时'+data.remain+'秒';
}

module.exports.draw = draw;