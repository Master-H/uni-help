module.exports = {
    extends: 'stylelint-config-standard',
    plugins: ['stylelint-scss'],
    rules: {
      // 基础规则
      'indentation': 2, // 缩进为2个空格
      'declaration-block-trailing-semicolon': 'always', // 声明块末尾必须有分号
      'block-no-empty': true, // 禁止空的块
      'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['v-deep'] }], // 允许使用 ::v-deep 伪元素
      'property-no-unknown': true, // 禁止未知的属性
      'no-duplicate-selectors': true, // 禁止重复的选择器
      'color-no-invalid-hex': true, // 禁止无效的十六进制颜色值
  
      // SCSS规则
      'scss/at-rule-no-unknown': true, // 禁止未知的SCSS规则
      'scss/dollar-variable-no-missing-interpolation': true, // 禁止缺失插值的变量
      'scss/selector-no-redundant-nesting-selector': true, // 禁止冗余的嵌套选择器
    },
  };
  
