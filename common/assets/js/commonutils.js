/**
 * 格式化日期
 * @param date : 日期值, [Date]或者[long]
 * @param mode 模式：
 * 		默认值 0或null,返回格式：yyyy-MM-dd HH:mm:ss
 * 		1		返回格式：yyyy-MM-dd
 * 		2		返回格式：HH:mm:ss
 */
module.exports.formatDateTime = function(date, mode){
    var _type = typeof date;
    if(_type == "object"){
        return formatDate0(date);
    }else if(_type == "number"){
        return formatDate1(date);
    }

    function formatDate0(date){
        function _ten(i){
            return i < 10 ? "0" + i  : "" + i;
        }

        var s1 = date.getFullYear() + "-" + _ten((date.getMonth() + 1)) + "-" + _ten(date.getDate());
        var s2 = _ten(date.getHours()) + ":" + _ten(date.getMinutes()) + ":" + _ten(date.getSeconds());

        if(mode == 1){
            return s1;
        }else if(mode == 2){
            return s2;
        }else{
            return s1 + " " + s2;
        }
    }
    function formatDate1(time){
        var d = new Date();
        d.setTime(time);
        return formatDate0(d);
    }

};

module.exports.getThisWeekTime = function(){
    var curDate = new Date();
    var startDate = new Date();
    if(curDate.getDay() == 0){//周日特殊处理
        startDate.setDate(curDate.getDate()-6);
    }else{
        startDate.setDate(curDate.getDate()-curDate.getDay()+1);
    }
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    return {
        startTime : this.formatDateTime(startDate,1),
        endTime : this.formatDateTime(curDate,1)
    };
};
module.exports.getThisMonthTime = function(){
    var curDate = new Date();
    var startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    return {
        startTime : this.formatDateTime(startDate,1),
        endTime : this.formatDateTime(curDate,1)
    };
};

module.exports.getPageUrlParam = function(param){
    var query = window.location.search;//获取URL地址中？后的所有字符
    var iLen = param.length;//获取你的参数名称长度
    var iStart = query.indexOf(param);//获取你该参数名称的其实索引
    if (iStart == -1)//-1为没有该参数
        return "";
    iStart += iLen + 1;
    var iEnd = query.indexOf("&", iStart);//获取第二个参数的其实索引
    if (iEnd == -1)//只有一个参数
        return query.substring(iStart);//获取单个参数的参数值
    return query.substring(iStart, iEnd);//获取第二个参数的值
};

/**
 * 压缩图片
 * @param source_img_obj 图片
 * @param quality        压缩率0-1之间
 * @param output_format  格式
 * @returns {*}
 */
module.exports.compressImg = function (source_img_obj, quality, output_format) {
    var mime_type = "image/jpeg";
    if (output_format != undefined && output_format == "png") {
        mime_type = "image/png";
    }
    var cvs = document.createElement('canvas');
    //naturalWidth真实图片的宽度
    cvs.width = source_img_obj.naturalWidth / 2;
    cvs.height = source_img_obj.naturalHeight / 2;
    cvs.getContext("2d").drawImage(source_img_obj, 0, 0);
    var newImageData = cvs.toDataURL(mime_type, quality);
    return newImageData;
};




