// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../../../wdz/shopweb/WebContent/webview/saledata/index.html'),
    historys: path.resolve(__dirname, '../../../wdz/shopweb/WebContent/webview/saledata/historys.html'),
    assetsRoot: path.resolve(__dirname, '../../../wdz/shopweb/WebContent/webview/saledata/'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: true
  },
  dev: {
    env: require('./dev.env'),
    port: 8888,
    proxyTable: {}
  }
};
