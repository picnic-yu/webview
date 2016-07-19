var commonutils = require('../../common/assets/js/commonutils');

module.exports = {
  isToday:function(dateStr){//判断是否是今天
    var today = new Date();
    if (commonutils.formatDateTime(today, 1) == dateStr) {
      return true;
    }
    return false;
  },
  percent: function (value, num) {
    num = num ? num : 1;
    if ((value + '').length <= 4) {
      return (value * 100) + '%';
    }
    return (value * 100).toFixed(num) + '%';
  }
};
