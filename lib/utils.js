/**
 * @file utils
 * @author master
 *
 * 工具函数
 */

const chalk = require('chalk');
const util = require('util');
const path = require('path');
const globalState = require('./state');
const {execSync} = require('child_process');

const tryCatchWrapper = (fn, callback) => {
    return function (...args) {
        try {
            return fn(...args);
        } catch (error) {

            return console.error('An error occurred:', error);
        } finally {
            callback && callback();
        }
    };
};

const yesList = [];
const noList = [];
const warnList = [];

const log = {
    yes(msg) {
        yesList.push(msg);
        console.log(chalk.green(`✔ -${util.inspect(msg, {colors: true})}  `));
    },
    error(msg) {
        noList.push(msg);
        console.log(chalk.red(`✘  -${util.inspect(msg, {colors: true})}  `));
    },
    warn(msg) {
        warnList.push(msg);
        console.log(chalk.yellow(`⚠️  -${util.inspect(msg, {colors: true})}  `));
    },
    desc(msg) {
        console.log(msg);
    },
};

function getChangedFiles() {
    const output = execSync('git diff --name-only HEAD~1 HEAD', {encoding: 'utf8'});
    return output.trim().split('\n');
}

const getRootDir = () => {
    const rootDir = globalState.getState().rootDir;
    return rootDir;
};


module.exports = {
    tryCatchWrapper,
    log,
    getChangedFiles,
    getRootDir,
};
