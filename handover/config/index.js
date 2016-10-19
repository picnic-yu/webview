// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../../../wdz/shopweb/WebContent/webview/handover/index.html'),
        feedback: path.resolve(__dirname, '../../../wdz/shopweb/WebContent/webview/handover/feedback.html'),
        customer: path.resolve(__dirname, '../../../wdz/shopweb/WebContent/webview/handover/customer.html'),
        assetsRoot: path.resolve(__dirname, '../../../wdz/shopweb/WebContent/webview/handover/'),
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
