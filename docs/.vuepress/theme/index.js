const { path } = require('@vuepress/utils')

module.exports = {
  name: 'vuepress-theme-jxy-walkthrough',
  extends: '@vuepress/theme-default',
  layouts: path.resolve(__dirname, './layouts'),
}
