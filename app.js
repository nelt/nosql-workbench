const argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('server', 'Run as server')
    .command('batch')
    .describe('p', 'server port')
    .alias('p', 'port')
    .default('p', '8080')
    .describe('s', 'script in batch mode')
    .alias('p', 'script')
    .help('h')
    .alias('h', 'help')
    .argv;

var fs = require('fs');

if(argv.server) {
    console.info("starting in server mode, binding to port " + argv.port)

    var http = require('http');
    var url = require('url');

    http.createServer(async function (req, res) {
        try {
            var q = url.parse(req.url, true);
            if (q.pathname.startsWith("/workspace/") || q.pathname.startsWith("/scripts/")) {
                console.info("request for script : " + q.pathname);
                let dep = '.' + q.pathname;
                if (fs.existsSync(dep)) {
                    if (fs.lstatSync(dep).isFile()) {
                        delete require.cache[require.resolve(dep)];
                        try {
                            const script = require(dep);
                            if (typeof script.handleRequest === 'function') {
                                await script.handleRequest(req, res);
                            } else {
                                res.writeHead(400, {'Content-Type': 'text/html'})
                                res.write("Bad Request - script " + q.pathname + " must export a handleRequest(req, res) function");
                                res.end()
                            }
                        } catch (e) {
                            console.log("ERROR RUNNING SCRIPT !! : " + e.stackTrace);
                            res.writeHead(500, {'Content-Type': 'text/html'})
                            res.write("error running script : " + q.pathname + " see logs");
                            res.end()
                        }
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write("Directory content");
                        res.end()
                    }
                } else {
                    res.writeHead(404, {'Content-Type': 'text/html'})
                    res.write("path not found in workspace : " + q.pathname);
                    res.end()
                }
            } else {
                res.writeHead(404, {'Content-Type': 'text/html'})
                res.write("nothing to do with : " + q.pathname);
                res.end()
            }
        } catch (e) {
            console.error('ERROR RUNNING SCRIPT : ', e.stackTrace);
            res.writeHead(500, {'Content-Type': 'text/html'})
            res.write("error running script : " + q.pathname + " see logs");
            res.end()
        } finally {}
    }).listen(8080);
} else if(argv.batch) {
    console.info("starting in batch mode with arguments : " + argv.batch + " :: " + argv._)
    if (argv.batch.startsWith("/workspace/") || argv.batch.startsWith("/scripts/")) {
        let dep = '.' + argv.batch;
        if (fs.existsSync(dep)) {
            if (fs.lstatSync(dep).isFile()) {
                delete require.cache[require.resolve(dep)];
                try {
                    const script = require(dep);
                    if (typeof script.run === 'function') {
                        console.info("running " + argv.batch)
                        script.run(argv._);
                    } else {
                        console.error("script  must export a run(args) function");
                    }
                } catch (e) {
                    console.error("ERROR RUNNING SCRIPT !! : " + e.stackTrace);
                }
            } else {
                console.error("script not found : " + argv.batch);
            }
        } else {
            console.error("script not found : " + argv.batch);
        }
    } else {
        console.error("can only run scripts in /workspace or /scripts location")
    }
} else {
    console.info("nothing to do, must be run with either --server or --batch: " + argv._)
}


