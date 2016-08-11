'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const parseColor = require('parse-color');

const SCALES = ['22x40', '44x80', '66x120', '88x160'];
const DEFAULT_COLOR = "#f55c50";
const DEFAULT_SCALE = SCALES.slice(-1)[0];

const config = {};

/**
 * Initialize generator.
 * @param {Object} options Initialization options
 * @param {String} options.assetsDir Assets directory
 * @param {String} options.cacheDir Cache directory
 * @param {String} options.convertBinary ImageMagick convert binary path
 * @param {String} options.tmpDir Temp directory
 * @param {Boolean} options.logEnabled Log settings
 * @returns {Object} Initialized generator
 */
module.exports.init = function (options) {
    const opt = options || {};
    config.assetsDir = opt.assetsDir || 'assets';
    config.cacheDir = opt.cacheDir || path.resolve('cache');
    config.convertBinary = opt.convertBinary || 'convert';
    config.tmpDir = opt.tmpDir || '/tmp';
    config.logEnabled = opt.logEnabled;

    let imageMagickVersion;
    try {
        imageMagickVersion = childProcess.execSync(`${config.convertBinary} -version`).toString();
    } catch (e) {
        throw new Error(`ImageMagick is not found in ${config.convertBinary}`);
    }

    if (!imageMagickVersion.startsWith('Version: ImageMagick 6')) {
        throw new Error(`${config.convertBinary} is not ImageMagick 6 binary`);
    }

    return module.exports;
};

/**
 * Generate callback
 * @callback generateCallback
 * @param {Error} err
 * @param {String} filename
 */

/**
 * Generate new marker with specified color and scale to file
 * @param {String} filename Output file name
 * @param {String} fullFilename Output file name with path
 * @param {String} color Marker color
 * @param {String} scale Marker scale
 * @param {generateCallback} callback Callback function
 * @return {undefined}
 */
const generateNewMarker = function (filename, fullFilename, color, scale, callback) {

    const timerName = `${new Date()}: generating ${filename}`;
    if (config.logEnabled) {
        console.time(timerName);
    }

    const maskFilename = `${config.tmpDir}/mask${color}${scale}.png`;
    const tempFilename = `${config.tmpDir}/temp${color}${scale}.png`;
    const assetFilename = `${config.assetsDir}/marker-bw-${scale}.png`;

    /*
     1) create color mask
     2) overlay mask to grayscale asset
     3) copy opacity mask to temp image
     */
    const generateScript = `
                    ${config.convertBinary} -size ${scale} xc:"${color}" ${maskFilename}
                    ${config.convertBinary} ${assetFilename} ${maskFilename} -compose Overlay -composite ${tempFilename}
                    ${config.convertBinary} ${tempFilename} ${assetFilename} -compose copy-opacity -composite ${fullFilename}
                `;

    childProcess.exec(generateScript, (err) => {
        if (err) {
            if (config.logEnabled) {
                console.error(`${new Date()}: script error: ${err.message}`);
            }
            callback(new Error('Marker generation failed'), null);
        } else {
            if (config.logEnabled) {
                console.timeEnd(timerName);
            }
            callback(null, fullFilename);
        }
    });
};

/**
 * Generate new GMaps marker with specified options.
 * @param {Object} options Marker options
 * @param {String} options.color Marker color
 * @param {String} options.scale Marker scale
 * @param {generateCallback} callback Callback function
 * @return {undefined}
 */
module.exports.generate = function (options, callback) {

    if (!config.assetsDir) {
        throw new Error('GMaps markers generator not initialized');
    }

    const color = options.color || DEFAULT_COLOR;
    const parsedColor = parseColor(color).hex || parseColor(`#{color}`).hex; // try to parse hex color without '#'
    const scale = options.scale || DEFAULT_SCALE;

    if (!parsedColor) {
        callback(new Error(`Invalid color ${color}`), null);
    } else if (SCALES.indexOf(scale) == -1) {
        callback(new Error(`Invalid scale ${scale}`), null);
    } else {
        const filename = `marker-${parsedColor}-${scale}.png`;
        const fullFilename = `${config.cacheDir}/${filename}`;

        fs.exists(fullFilename, (exists) => {

            if (exists) {
                if (config.logEnabled) {
                    console.log(`${new Date()}: ${filename} exists`);
                }
                callback(null, fullFilename);
            } else {
                generateNewMarker(filename, fullFilename, color, scale, callback);
            }
        });
    }
};