/**
 *
 * @author master
 *
 */
const fs = require('fs-extra');
const path = require('path');
const globalState = require('../state');
const {log} = require('../utils');

module.exports = (state, next) => {
    const rootDir = globalState.getState().rootDir;
    const componentsDir = path.join(rootDir, './src/components');
    const missComponent = [];
    const missComponentFolder = [];

    const componentFolders = fs.readdirSync(componentsDir).filter(file => {
        const folderPath = path.join(componentsDir, file);
        const isDirectory = fs.statSync(folderPath).isDirectory();
        // c-xx
        const isKebabCase = /^[a-z0-9-]+$/.test(file);

        // 过滤出组件文件夹，要求文件夹名符合 kebab-case 规范
        if (!isKebabCase && isDirectory) {
            missComponentFolder.push(file);
        }
        return isDirectory && isKebabCase;
    });

    componentFolders.forEach(folder => {
        const folderPath = path.join(componentsDir, folder);
        const componentFile = path.join(folderPath, `${folder}.vue`);
        if (!fs.existsSync(componentFile)) {
            missComponent.push(folder);
        }
    });
    if (missComponentFolder.length > 0) {
        log.desc('以下文件不符合kebab-case规范');
        missComponentFolder.forEach(folder => {
            const dir = `src/components/${folder}`;
            log.error(dir);
        });

    }
    if (missComponent.length > 0) {
        log.desc('组件命名不符合easycom组件规范(文件夹和文件名字保持一致）');
        missComponent.forEach(component => {
            const target = `src/components/${component}`;
            log.error(target);
        });

    } else {
        console.log('All components are valid.');
    }

    next();
};
