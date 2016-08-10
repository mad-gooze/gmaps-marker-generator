'use strict';

const express = require('express');
const compression = require('compression');
const generator = require('./lib/generator').init({
    cacheDir: process.env.OPENSHIFT_DATA_DIR,
    tmpDir: process.env.OPENSHIFT_TMP_DIR,
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

app.get('/health', (req, res) => {
    res.send('ok');
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
            res.sendFile(filename);
        }
    });
});


app.listen(PORT, IP, () => {
    console.log(`${new Date()}: ${appName} server started.`);
});

