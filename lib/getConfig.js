
/**
 *
 * @author master
 *
 */
const fs = require('fs');
const path = require('path');

function getConfig() {
    const projectRoot = process.cwd();
    const filePath = path.join(projectRoot, 'scu.js');
    let config = {};
    if (fs.existsSync(filePath)) {
        try {
            config = require(filePath);
        } catch (error) {
            console.error('Error reading scu.js:', error);
        }
    } else {
        console.error('scu.js does not exist');
    }
    return config;
}

module.exports = getConfig;

