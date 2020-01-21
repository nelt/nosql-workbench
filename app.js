const argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('server', 'Run as server')
    .describe('p', 'server port')
    .alias('p', 'port')
    .default('p', '8080')
    .help('h')
    .alias('h', 'help')
    .argv;

console.info("starting in server mode, binding to port " + argv.port)

var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    if(q.pathname.startsWith("/workspace/") || q.pathname.startsWith("/scripts/")) {
        console.info("request for script : " + q.pathname);
        if(fs.existsSync('.' + q.pathname)) {
            if(fs.lstatSync('.' + q.pathname).isFile()) {
                require('.' + q.pathname).handleRequest(req, res);
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write("Directory content");
            }
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'})
            res.write("path not found in workspace : " + q.pathname);
        }
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'})
        res.write("nothing to do with : " + q.pathname);
    }
    res.end();
}).listen(8080);