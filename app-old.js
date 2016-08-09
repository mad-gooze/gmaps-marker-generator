var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;


const test = require('lib/generator.js');
test.init();

var app = express();


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade')
app.use(express.favicon("./public/img/favicon.ico"));;
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//render main page
app.get('/', function(req, res){
    res.render('index');
});

var colorRegexp = /^(?:[0-9a-f]{3}){1,2}$/i; //regexp for matching hex color code
var scaleRegexp = /^[1-4]/; //regexp for matching scale
var scales = ["22x40", "44x80", "66x120", "88x160"]; //supported marker scales

app.get('/getmarker',function(req, res){

    //check the specified color or set the default one
    var color = req.query["color"];
    if (!color || !colorRegexp.test(color)){
        color = "f55c50"
    } else {
        color.toLowerCase();
    }

    //check the specified scale or set the default one
    var scale = req.query["scale"];
    if (!scale || !scaleRegexp.test(scale)){
        scale = 1;
    }
    scale = new Number(scale);
    scale--;
    if (scale < 0) scale = 0;
    if (scale > scales.length - 1) scale = scales.length - 1;

    var filename = "./markers/marker-" + color + "-" + scale + ".png";

    fs.exists(filename, function(exists) {

        if (exists) {

            //if we already generated that file, send it to user
            console.log(filename + " exists, sended");
            res.sendfile(filename);

        } else {

            console.log('convert -size ' + scales[scale] + ' xc:#"' + color + '" mask' + color + scale +'.png \n' +
                //overlay mask to grayscale object
                'convert marker-bw-' + scale + '.png  mask' + color + scale +'.png -compose Overlay -composite temp'  + color + scale +'.png \n' +
                //copy opacity mask to temp image
                'convert temp' + color + scale +'.png marker-bw-' + scale + '.png -compose copy-opacity -composite ' + filename);

            exec(
                //create color mask
                'convert -size ' + scales[scale] + ' xc:#"' + color + '" mask' + color + scale +'.png \n' +
                //overlay mask to grayscale object
                'convert marker-bw-' + scale + '.png  mask' + color + scale +'.png -compose Overlay -composite temp'  + color + scale +'.png \n' +
                //copy opacity mask to temp image
                'convert temp' + color + scale +'.png marker-bw-' + scale + '.png -compose copy-opacity -composite ' + filename,
                function(){
                    console.log(filename + " created and sended");
                    res.sendfile(filename, function(){
                        //clear temp files
                        exec('rm temp' + color + scale +'.png mask' + color + scale +'.png');
                    });
                }
            );

        }

    });

});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
