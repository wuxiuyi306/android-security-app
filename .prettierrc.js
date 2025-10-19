/**
 * Prettier配置 - Android企业级代码格式化
 * 
 * 🔒 确保Android安全模块代码格式统一
 */

module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  printWidth: 100,
  
  // 🛡️ 企业级格式化规则
  endOfLine: 'lf',
  useTabs: false,
  quoteProps: 'as-needed',
};
