/**
 *
 * @author master
 *
 */
const fs = require('fs');
const {parse, compileStyleAsync} = require('@vue/compiler-sfc');
const {getChangedFiles, getRootDir, log} = require('../utils');
const path = require('path');
const stylelint = require('stylelint');
const globalState = require('../state');
const cheerio = require('cheerio');
const postcssScss = require('postcss-scss');
const stylelintScss = require('stylelint-scss');
const styleConfigStandard = require.resolve('stylelint-config-standard');

module.exports = async ({config}, next) => {

    let startLine = 0;
    async function extractStyleModule(filePath, file) {
        // 读取 .vue 文件内容
        const content = fs.readFileSync(filePath, 'utf8');

        // 解析 Vue 单文件组件
        const {descriptor} = parse(content, {filename: filePath});

        // 提取 <style> 模块
        const styleBlock = descriptor.styles.find(style => style.lang === 'scss');

        if (styleBlock) {
            startLine = styleBlock.loc.start.line; // <style> 模块在文件中的起始行

            // 解析样式代码
            const {code} = await compileStyleAsync({
                source: styleBlock.content,
                filename: filePath,
                id: `data-v-${descriptor.id}`,
                scoped: styleBlock.scoped,
            });
            // 逐行分析样式代码
            const styleLines = code.split('\n');
            const missStyle = [];
            styleLines.forEach((line, index) => {
                if (line.includes('font-weight')) {
                    const fileLineNumber = startLine + index;
                    missStyle.push(`${fileLineNumber}: ${line}`);
                }
            });
            if (missStyle.length) {
                log.desc('样式使用不符合规范');
                log.error(`${file}, 请使用全局文件uni.css对应的类名替换font-weight属性`);
                missStyle.forEach(log.error);
            }
        }
    }


    function lintStyle(filePath, config = {}) {
        const {styleRule = {}} = config;
        const {rules = {}, off} = styleRule;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        // 使用 cheerio 解析文件内容
        const $ = cheerio.load(fileContent, {xmlMode: true});
        // 提取 <style> 标签中的内容
        const styleContent = $('style').text();

        const defaultRules = {
            // 基础规则
            'no-empty-first-line': false, // 禁止空的第一行
            'indentation': 4, // 缩进为4个空格
            'declaration-block-trailing-semicolon': 'always', // 声明块末尾必须有分号
            'block-no-empty': true, // 禁止空的块
            'selector-pseudo-element-no-unknown': [
                true, {ignorePseudoElements: ['v-deep']},
            ], // 允许使用 ::v-deep 伪元素
            'property-no-unknown': false, // 禁止未知的属性
            'no-duplicate-selectors': true, // 禁止重复的选择器
            'color-no-invalid-hex': true, // 禁止无效的十六进制颜色值

            // SCSS规则
            'scss/at-rule-no-unknown': true, // 禁止未知的SCSS规则
            'scss/dollar-variable-no-missing-interpolation': true, // 禁止缺失插值的变量
            'scss/selector-no-redundant-nesting-selector': true, // 禁止冗余的嵌套选择器
            'unit-no-unknown': [true, {ignoreUnits: ['rpx']}], // 忽略校验 rpx 单位
            'color-hex-case': false,
        };

        const configPath = path.resolve(__dirname, '../config/stylelint.config.js');
        const options = {
            code: styleContent,
            formatter: 'string',
            customSyntax: postcssScss,
            configFile: null,
            config: {
                // extends: require.resolve('stylelint-config-standard'),
                extends: styleConfigStandard,
                plugins: [stylelintScss],
                rules: {
                    ...defaultRules,
                    ...rules,
                },
            },
        };
        if (off) {
            return;
        }
        stylelint
            .lint(options)
            .then(result => {
                const {errored, results} = result;
                if (errored) {
                    results.forEach(result => {
                        if (result.warnings.length > 0) {
                            log.desc(filePath);
                            log.desc(111111);
                            result.warnings.forEach(warning => {
                                log.error(`${warning.line + startLine - 1}行: ${warning.text}`);

                            });
                        }
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    const rootDir = getRootDir();
    const changeFiles = getChangedFiles();
    if (changeFiles.length) {
        changeFiles.forEach(file => {
            if (file.includes('.vue')) {
                const filePath = path.join(rootDir, file);
                extractStyleModule(filePath, file);
                lintStyle(file, config);
            }
        });
    }
    next();
};
