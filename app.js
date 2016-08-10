const express = require('express');
const compression = require('compression');
const generator = require('./lib/generator').init({
    logEnabled: true
});

const app = express();
const appName = 'Custom Color GMaps Markers v3 Style Generator';
const PORT = process.env.NODE_PORT || 3000;
const IP = process.env.NODE_IP || 'localhost';

app.use(compression());

app.get('/', (req, res) => {
    res.send(appName);
});

app.get('/get-marker', (req, res) => {
    generator.generate({
        color: req.query.color,
        scale: req.query.scale
    }, (err, filename) => {
        if (err) {
            res.status(500);
            res.send({
                error: err.message
            });
        } else {
            res.setHeader('Cache-Control', 'public, max-age=31557600'); // one year
            res.sendFile(filename, {
                root: __dirname
            });
        }
    });
});


app.listen(PORT, IP, () => {
    console.log(`${appName} server started.`);
});
