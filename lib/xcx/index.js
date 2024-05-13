
/**
 *
 * @author master
 *
 */
const checkComponent = require('./checkComponent');
const checkPic = require('./checkPic');
const Task = require('../task');
module.exports = config => {
    const task = new Task(config);
    task
        .add(checkPic)
        .add(checkComponent)
        .run();
};
