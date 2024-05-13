/**
 *
 * @author master
 *
 */
const getConfig = require('../lib/getConfig');
const {tryCatchWrapper} = require('../lib/utils');
const checkRule = require('../lib/checkRule');
const globalState = require('../lib/state');

module.exports = async () => {
    const config = getConfig() || {};
    const {type = 'xcx', plugins = []} = config;
    plugins.forEach(plugin => {
        tryCatchWrapper(plugin.apply)(config);
    });

    function run() {
        const rootDir = process.cwd();
        globalState.init({
            rootDir,
            config: config,
        });
        checkRule(type, config);
    }

    run();
};
