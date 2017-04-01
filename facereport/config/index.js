// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../../../../workspace/shopweb/WebContent/webview/facereport/index.html'),
    assetsRoot: path.resolve(__dirname, '../../../../workspace/shopweb/WebContent/webview/facereport/'),
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
