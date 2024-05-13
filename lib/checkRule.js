
/**
 *
 * @author master
 *
 */
const checkBaseRule = require('./common/index');
const xcxRule = require('./xcx/index');

module.exports = (type, config) => {
    checkBaseRule(config);
    const ruleType = {
        'xcx': xcxRule,
    };
    ruleType[type] && ruleType[type](config);
};
