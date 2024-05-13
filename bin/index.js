#!/usr/bin/env node --harmony
'use strict';

const program = require('commander');

// 定义当前版本
program
    .version(require('../package').version, '-v --version', '当前版本号');


program
    .command('check')
    .description('规范检车')
    .alias('c')
    .action(() => {
        require('../command/check')();
    });


program.parse(process.argv);

if (!program.args.length) {
    program.help();
}
