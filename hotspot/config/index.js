// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../../../wdz/shopweb/WebContent/webview/hotspot/index.html'),
    assetsRoot: path.resolve(__dirname, '../../../wdz/shopweb/WebContent/webview/hotspot/'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: false
  },
  dev: {
    env: require('./dev.env'),
    port: 8888,
    proxyTable: {}
  }
};
