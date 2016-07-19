var path = require('path')
var express = require('express')
var webpack = require('webpack')
var config = require('../config')
var formidable = require('formidable');
var fs = require('fs');
var FormData = require('form-data');
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  //publicPath: webpackConfig.output.publicPath,
  publicPath:'/webview/projectfiles',
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.build.assetsPublicPath, config.build.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var request = require('request');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var baseUrl = 'http://localhost:8080/';
/*app.post('/:namespace/:actionname', function (req, response) {
  request.post(baseUrl+req.url,{
    form:req.body
  },function(error,res,data){
    response.send(data);
  });
});*/


app.post('service/picturesUpload.action', function(req, res) {

  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';		//设置编辑
  form.uploadDir = '/root/zips/';	 //设置上传目录
  form.keepExtensions = true;	 //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
  form.parse(req, function(err, fields, files) {
    if (err) {
      res.locals.error = err;
      res.send('{"result":"error"}');
      return;
    }
    var extName = '';  //后缀名
    switch (files.image.type) {
      case 'image/pjpeg':
        extName = 'jpg';
        break;
      case 'image/jpeg':
        extName = 'jpg';
        break;
      case 'image/png':
        extName = 'png';
        break;
      case 'image/x-png':
        extName = 'png';
        break;
    }

    if(extName.length == 0){
      res.locals.error = '只支持png和jpg格式图片';
      res.send('');
      return;
    }

    var avatarName = Math.random() + '.' + extName;
    var newPath = form.uploadDir + avatarName;
    fs.renameSync(files.image.path, newPath);  //重命名
    var formData = {
      // Pass a simple key-value pair
      nodeId: 'my_value'
      // Pass data via Buffers
      //my_buffer: new Buffer([1, 2, 3]),
      // Pass data via Streams
      //my_file: fs.createReadStream(__dirname + '/unicycle.jpg'),
      // Pass multiple values /w an Array
     /* attachments: [
        fs.createReadStream(__dirname + '/attachment1.jpg'),
        fs.createReadStream(__dirname + '/attachment2.jpg')
      ],*/
      // Pass optional meta-data with an 'options' object with style: {value: DATA, options: OPTIONS}
      // Use case: for some types of streams, you'll need to provide "file"-related information manually.
      // See the `form-data` README for more information about options: https://github.com/form-data/form-data
      /*custom_file: {
        value:  fs.createReadStream(form.uploadDir),
        options: {
          filename: avatarName,
          contentType: 'image/jpg'
        }
      }*/
    };
    request.post({url:baseUrl+req.url, formData: formData}, function(err, httpResponse, body) {
      if (err) {
        return console.error('upload failed:', err);
      }
      console.log('Upload successful!  Server responded with:', body);
      res.locals.success = '上传成功';
      res.send('{"result":"ok"}');
    });

  });
});
/*app.post('/service/:actionname', function (req, response) {
  request({
    url:baseUrl+req.url,
    body:req.body,
    json:true,
    method:'POST'
  },function(error,res,data){
    response.send(data);
  });
});*/
app.post('/service/:actionname', function (req, response) {
  request.post(baseUrl+req.url,{
    form:req.body
  },function(error,res,data){
    response.send(data);
  });
});

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
