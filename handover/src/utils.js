var paths = [{
    name: 'default', parent: ''
},
    {
        name: 'shoplist', parent: 'default'
    },
    {
        name: 'userlist', parent: 'default'
    },
    {
        name: 'search', parent: 'default'
    },
    {
        name: 'create', parent: 'default'
    },
    {
        name: 'detail', parent: 'default'
    },
    {
        name: 'mutipleuserlist', parent: 'create'
    },
    {
        name: 'grouplist', parent: 'create'
    },
    {
        name: 'templates', parent: 'create'
    },
    {
        name: 'searchdate', parent: 'default'
    },
    {
        name: 'opt', parent: 'detail'
    }];
module.exports.getBackPath = function (name) {
    var res = {};
    for (var i = 0; i < paths.length; i++) {
        if (name == paths[i].name) {
            res.parent = paths[i].parent;
            break;
        }
    }
    for (var i = 0; i < paths.length; i++) {
        if (res.parent == paths[i].name) {
            res.params = paths[i].params;
            break;
        }
    }
    return res;
};

module.exports.setBackPath = function (name, params) {
    for (var i = 0; i < paths.length; i++) {
        if (name == paths[i].name) {
            paths[i].params = params;
            break;
        }
    }
};


/**
 * 计算单个图片的宽高
 * @param width 图片宽度
 * @param height 图片高度
 * @param defaultWidth
 * @param defaultWidthX
 * @param defaultWidthL
 * @returns {{w: *, h: *, pw: *, ph: *, offsetX: number, offsetY: number}}
 */
module.exports.computeSigleImgWH = function(width,height,defaultWidth,defaultWidthX,defaultWidthL){
    if(width == 0 || height == 0){
        return {
            w:defaultWidthL,
            h:defaultWidthL,
            pw:defaultWidthL,
            ph:defaultWidthL,
            offsetX:0,
            offsetY:0
        };
    }
    var x = width/height;//宽高比
    var w, H,pw,ph,offsetX=0,offsetY=0;//最终返回的所略图大小
    if(width < defaultWidth){
        defaultWidth = width;
    }
    if(width < defaultWidthL){
        defaultWidthL = width;
    }
    if(x>=1 && x<= 2.5){//宽高比保持不变
        pw = w = defaultWidth;
        ph = h = w/x;
    }else if(x>2.5 && x<=3){
        pw = defaultWidth;
        ph = h = pw/2.5;
        w = h*x;
        offsetX = (pw-w)/2;
        //缩略图水平方向隐藏
    }else if(x > 3){
        pw = defaultWidthX;
        ph = h = pw/3;
        w = h*x;
        offsetX = (pw-w)/2;
        //缩略图水平方向隐藏
    }else if(x < 1 && x >= 1/2){
        pw = w = defaultWidthL;
        ph = h = defaultWidthL/x;
    }else if(x < 1/2){
        pw = w = defaultWidthL;
        ph = defaultWidthL*2;
        h = defaultWidthL/x;
    }
    return {
        w:w,
        h:h,
        pw:pw,
        ph:ph,
        offsetX:offsetX,
        offsetY:offsetY,
    };
};
/**
 * 计算4宫格，9宫格宽高
 * @param width
 * @param height
 * @param whichgrid
 * @param totalWidth
 * @returns {{w: *, h: *, pw: *, ph: *, offsetX: number, offsetY: number}}
 */
module.exports.computeImgWH = function(width,height,whichgrid,totalWidth){
    var margin = 5;//图片之间的间隙
    var pw,ph;
    if(whichgrid == 4){//4宫格 2张 4张
        ph = pw = (totalWidth - margin)/2;
    }else if(whichgrid == 9){
        ph = pw = (totalWidth - 2*margin)/3;
    }
    if(width == 0 || height == 0){
        return {
            w:pw,
            h:pw,
            pw:pw,
            ph:pw,
            offsetX:0,
            offsetY:0
        };
    }
    var x = width/height;//宽高比
    var w, h,offsetX=0,offsetY=0;//最终返回的所略图大小
    if(x>=1 && x<= 2.5){//宽高比保持不变
        w = pw;
        h = w/x;
    }else if(x>2.5 && x<=3){
        h = pw/2.5;
        w = h*x;
        offsetX = (pw-w)/2;
        //缩略图水平方向隐藏
    }else if(x > 3){
        h = pw/3;
        w = h*x;
        offsetX = (pw-w)/2;
        //缩略图水平方向隐藏
    }else if(x < 1){
        w = pw;
        h = w/x;
        offsetY = (ph-h)/2;
    }
    if(h < ph){
        h = ph;
        w = h*x;
        offsetX = (pw-w)/2;
    }

    return {
        w:w,
        h:h,
        pw:pw,
        ph:ph,
        offsetX:offsetX,
        offsetY:offsetY,
    };
};


var JPEGEncoder = require('../../common/libs/html5ImgCompress/libs/jpeg_encoder_basic');

module.exports.longTapEvent =  {
    bind: function(el,cb) {
        var self = this;
        this.tapInfo = {};
        this.touchstartFn = function(e) {
            /*if(e.stopPropagation) e.stopPropagation();
            if(e.preventDefault) e.preventDefault();*/
            self._touchstart(self, e);
        };
        this.touchendFn = function(e) {
            self._touchend(self, e);
        };
        el.removeEventListener('touchstart', this.touchstartFn);
        el.removeEventListener('touchend', this.touchstartFn)
        el.addEventListener('touchstart', this.touchstartFn);
        el.addEventListener('touchend', this.touchendFn);
        this.el = el;
        this.timer = null;
    },

    _touchstart: function(obj, event) {
        var touch = event.touches[0];
        obj.tapInfo.pageX = touch.pageX;
        obj.tapInfo.pageY = touch.pageY;
        obj.tapInfo.touchStartTime = (new Date()).getTime();
        this.touchend = false;
        var self = this;
        timer = setTimeout(function(){
            var disX = touch.pageX - obj.tapInfo.pageX;
            var disY = touch.pageY - obj.tapInfo.pageY;
            if(!self.touchend && Math.abs(disX) < 2 && Math.abs(disY) < 2){
                var img = $(self.el).find('.swiper-slide-active img')[0];
                if(img){
                    popMenu(img.src,'');
                    self.touchend = true;
                    timer = null;
                }
            }
        },800);
    },

    _touchend: function(obj, event) {
        var touch = event.changedTouches[0];
        var interval = (new Date()).getTime() - obj.tapInfo.touchStartTime;
        var disX = touch.pageX - obj.tapInfo.pageX;
        var disY = touch.pageY - obj.tapInfo.pageY;
        this.touchend = true;
        /*if (interval > 1000 && Math.abs(disX) < 2 && Math.abs(disY) < 2) {//长按超过2s
            var img = $(this.el).find('.swiper-slide-active img')[0];
            if(img){
                popMenu(img.src,getBase64Image(img));
            }
        }*/
    }
};

function popMenu(url,base64){
    var btns = [{
        text:'请选择',
        label:true
    },{
        text:'保存到手机',
        bold:true,
        close:false,
        onClick:function(){
            if ($.device.android) {
                try{
                    window.webview && window.webview.saveImage(url,base64);
                }catch (e){
                    $.toast('暂不支持此功能');
                }
            } else if ($.device.ios) {
                try {
                    window.webkit.messageHandlers.saveImage.postMessage(url,base64);
                } catch (e) {
                    $.toast('暂不支持此功能');
                }
            }
        }
    }];
    var groups = [];
    groups.push(btns);
    groups.push([{
        text:'取消',
        bg:'default',
        onClick:function(){

        }
    }]);
    $.actions(groups);
};

module.exports.popMenu = popMenu;

function getBase64Code(img){
    try{
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        var encoder = new JPEGEncoder();
        return encoder.encode(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }catch (e){
        return '';
    }
}

function getBase64Image(img) {
    try{
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img,0,0,img.width,img.height);
        return canvas.toDataURL("image/png");
    }catch (e){
        return '';
    }
}

window.saveImageCallback = function (code) {
    if(code == 1){
        $.toast('保存成功');
        $.closeModal('div.actions-modal.modal-in');
    }else{
        $.toast('保存失败');
    }
};



module.exports.hyperlinkReg = /((https|http|ftp|rtsp|mms):\/\/)([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)?((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.[a-zA-Z]{2,4})(\:[0-9]+)?(\/[^\/][a-zA-Z0-9\.\,\?\'\\/\+&amp;%\$#\=~_\-@]*)*/g;

module.exports.formatHyperLink = function (item,content) {
    var c;
    var contentFormatFlag=0;
    if(content){
        c = content.replace(this.hyperlinkReg,function(a,b){
            contentFormatFlag = 1;
            if(!item.contentFormatArray) item.contentFormatArray = [];
            item.contentFormatArray.push({
                value:a,
                http:b
            });
            //return '<a href="'+(b ? "" : "http://") + a +'">'+ a +'</a>';
        });
        item.contentFormatFlag = contentFormatFlag;
        if(contentFormatFlag == 1){
            item.contentFormatStr = content;
            for(var j=0;j<item.contentFormatArray.length;j++){
                var replaceStr;
                if(!item.contentFormatArray[j].http){
                    replaceStr = "$^*~~*^$WDZ_HREFhttp://"+item.contentFormatArray[j].value+'$^*~~*^$';
                }else{
                    replaceStr = "$^*~~*^$WDZ_HREF"+item.contentFormatArray[j].value+'$^*~~*^$';
                }
                item.contentFormatStr = item.contentFormatStr.replace(item.contentFormatArray[j].value,replaceStr);
            }
            item.contentFormatArray = item.contentFormatStr.split('$^*~~*^$');
        }
    }
};


