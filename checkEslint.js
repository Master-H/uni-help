/**
 *
 * @author master
 *
 */
const {CLIEngine} = require('eslint');
const globalState = require('../state');
const {execSync} = require('child_process');


module.exports = async ({config}, next) => {

    const rootDir = globalState.getState().rootDir;

    function getChangedFiles() {
        const output = execSync('git diff --name-only HEAD~1 HEAD', {encoding: 'utf8'});
        return output.trim().split('\n');
    }

    function lintFilesWithConfig(configPath, file) {

        if (!file.includes('src')) {
            return;
        }
        const eslintOptions = {
            useEslintrc: false,
            configFile: configPath,
            cwd: rootDir,
            // TODO: 不生效
            // ignore: [`${configPath}/components/**`]
        };

        const cli = new CLIEngine(eslintOptions);
        const report = cli.executeOnFiles([file]); // 检查工作目录下的所有文件
        const formatter = cli.getFormatter();

        const results = report.results.filter(result => result.errorCount > 0 || result.warningCount > 0);

        if (results.length > 0) {
            console.log(formatter(results));
        } else {
            console.log('All files pass ESLint checks.');
        }
    }


    const configPath = `${rootDir}/.eslintrc.js`;
    const changedFiles = getChangedFiles();
    // 并行处理多个文件的检查任务
    await Promise.all(changedFiles.map(file => lintFilesWithConfig(configPath, file)));
    next();
};
