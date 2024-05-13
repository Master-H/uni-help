
/**
 *
 * @author master
 *
 */
const checkReadme = require('./checkReadme');
const checkEslint = require('./checkEslint');
const analysisStyle = require('./analysisStyle');
const Task = require('../task');
module.exports = config => {
    const task = new Task(config);
    task
        .add(checkReadme)
        .add(checkEslint)
        .add(analysisStyle)
        .run();
};
