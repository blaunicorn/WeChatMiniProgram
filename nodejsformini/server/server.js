let http = require('http')

var fs = require("fs");
var url = require('url');
// 创建服务器
var contents = fs.readFileSync("./data.json");
var jsondata = JSON.parse(contents);
// console.log(data)
http.createServer(function (request, response) {
    // 解析请求，包括文件名
    var pathname = url.parse(request.url).pathname;
    // 输出请求的文件名
    console.log("Request for " + pathname + " received.");
    // 从文件系统中读取请求的文件内容
    fs.readFile(pathname.substr(1), function (err, data) {
        var urlContent = pathname.substr(1);
        if (urlContent.lastIndexOf("png") > -1) {
            if (err) {
                console.log(err);
                // HTTP 状态码: 404 : NOT FOUND
                // Content Type: text/plain
                response.writeHead(404, { 'Content-Type': 'text/html' });
            } else {
                // HTTP 状态码: 200 : OK
                // Content Type: text/plain
                response.writeHead(200, { 'Content-Type': 'image/png' });
                var imageFilePath = pathname.substr(1);
                var stream = fs.createReadStream(imageFilePath);
                var responseData = [];//存储文件流
                if (stream) {//判断状态
                    stream.on('data', function (chunk) {
                        responseData.push(chunk);
                    });
                    stream.on('end', function () {
                        var finalData = Buffer.concat(responseData);
                        response.write(finalData);
                        response.end();
                    });
                }
            }
        }
        if (urlContent.lastIndexOf("json") > -1) {
            if (err) {
                console.log(err);
                // HTTP 状态码: 404 : NOT FOUND
                // Content Type: text/plain
                response.writeHead(404, { 'Content-Type': 'text/html' });
            } else {
                // HTTP 状态码: 200 : OK
                // Content Type: text/plain
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(data);
            }
        }
    })
    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    // response.writeHead(200, { 'Content-Type': 'text/plain' });
    // response.writeHead(200, { 'Content-Type': 'application/json' });

    // 发送响应数据 "Hello World"
    // response.end('Hello World\n');
    // response.end(JSON.stringify(data));
}).listen(8080);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8080/');