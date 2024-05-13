
/**
 *
 * @author master
 *
 */
const fs = require('fs');
const path = require('path');
const globalState = require('../state');
const {log} = require('../utils');

module.exports = (config, next) => {

    const rootDir = globalState.getState().rootDir;
    const readDir = path.join(rootDir, 'README.md');

    fs.readFile(readDir, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading README file: ${err}`);
            return;
        }

        const nodeVersionRegex = /node\s+(\D*)(\d+\.\d+(\.\d+)?)/i;
        const matches = data.match(nodeVersionRegex);

        if (!matches || matches.length === 0) {
            log.desc('README.md,文件缺少信息');
            log.error('缺少node版本信息');
        }
    });

    next();
};
