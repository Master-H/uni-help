
/**
 *
 * @author master
 *
 */
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const globalState = require('../state');
const {tryCatchWrapper, log} = require('../utils');

module.exports = async (state, next) => {
    const rootDir = globalState.getState().rootDir;
    const staticDir = path.join(rootDir, './src/static');
    //  获取本地图片宽高
    function getImageSize(imagePath) {
        return new Promise((resolve, reject) => {
            Jimp.read(imagePath)
                .then(image => {
                    const w = image.bitmap.width;
                    const h = image.bitmap.height;
                    resolve({w, h});
                })
                .catch(err => {
                    console.error('读取图片失败：', err);
                    reject('读取失败', err);
                });
        });
    }
    function checkImg(width, height, file) {
        const imageSizes = [
            {width: 48, height: 48, maxSize: 5},
            {width: 73, height: 73, maxSize: 5},
            {width: 170, height: 170, maxSize: 13},
            {width: 170, height: 227, maxSize: 17},
            {width: 267, height: 267, maxSize: 23},
            {width: 364, height: 273, maxSize: 27},
            {width: 364, height: 243, maxSize: 24},
            {width: 364, height: 364, maxSize: 36},
            {width: 273, height: 364, maxSize: 47},
            {width: 558, height: 372, maxSize: 43},
            {width: 558, height: 419, maxSize: 49},
            {width: 558, height: 558, maxSize: 65},
            {width: 558, height: 744, maxSize: 86},
            {width: 752, height: 423, maxSize: 56},
            {width: 1140, height: 228, maxSize: 37},
            {width: 1140, height: 456, maxSize: 73},
            {width: 1140, height: 642, maxSize: 103},
            {width: 1242, height: 828, maxSize: 144},
        ];
        // 找出与目标图片尺寸最接近的做体积判断
        return new Promise(resolve => {
            const imageSize = imageSizes.reduce((prev, curr) => {
                const prevDiff = Math.abs(prev.width - width) + Math.abs(prev.height - height);
                const currDiff = Math.abs(curr.width - width) + Math.abs(curr.height - height);
                return currDiff < prevDiff ? curr : prev;
            });
            if (+file / 1024 > imageSize.maxSize) {
                resolve({pass: false, rule: imageSize});
            }
            else {
                resolve({pass: true, rule: imageSize});
            }
        });
    }


    async function getFilesInFolder(folderPath, outputFile) {
        const result = [];
        // 获取文件夹下所有的文件和文件夹
        const files = fs.readdirSync(folderPath);
        for (const fileName of files) {
        // 拼接文件路径
            const filePath = path.join(folderPath, fileName);
            // 如果是文件夹，则递归调用该函数，并将子文件夹的结果合并到当前文件夹的结果中
            if (fs.lstatSync(filePath).isDirectory()) {
                try {
                    const subResult = await getFilesInFolder(filePath, outputFile);
                    subResult.length > 0 && result.push(...subResult);
                }
                catch (error) {
                    console.log('error', error);
                }
            }
            else {
                const extname = path.extname(filePath).toLowerCase();
                if (['.png', '.jpg', '.jpeg', '.bmp', '.gif'].includes(extname)) {
                    const fileSize = fs.statSync(filePath).size;

                    const projectRoot = path.resolve(__dirname, '..');
                    const relativePath = path.relative(projectRoot, filePath);
                    const res = await getImageSize(filePath).catch();
                    const {pass, rule} = await checkImg(res.w, res.h, fileSize);
                    if (!pass) {
                        result.push({
                            path: relativePath,
                            real: {
                                width: res.w,
                                height: res.h,
                                size: fileSize / 1024,
                            },
                            rule,
                            desc: '不符合图片规范',
                        });
                    }
                }
            }
        }
        return result;
    }
    const result = await tryCatchWrapper(getFilesInFolder, next)(staticDir);
    if (result?.length) {
        log.desc('如下图片体积不符合规范，参考:https://ku.test-int.com/knowledge/HFVrC7hq1Q/0dKPD8kSo1/uijnETZ6iG/qKes8I-P6XCN9r');
        log.error(result);
    }
};
