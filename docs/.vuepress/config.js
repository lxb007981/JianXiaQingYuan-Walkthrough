module.exports = {
  // 站点配置
  lang: 'zh-CN',
  title: '剑侠情缘2攻略整合',
  description: '一个方便玩家查阅的攻略站',
  base: '/',
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: `/images/icons/favicon-16x16.png`,
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: `/images/icons/favicon-32x32.png`,
      },
    ],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { name: 'application-name', content: '剑侠情缘2攻略整合' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'VuePress' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    [
      'link',
      { rel: 'apple-touch-icon', href: `/images/icons/apple-touch-icon.png` },
    ],
    [
      'link',
      {
        rel: 'mask-icon',
        href: '/images/icons/safari-pinned-tab.svg',
        color: '#3eaf7c',
      },
    ],
    ['meta', { name: 'msapplication-TileColor', content: '#3eaf7c' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ],
  // 主题和它的配置
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: '/images/logo.png',
    repo: 'lxb007981/JianXiaQingYuan-Walkthrough',
    docsDir: 'docs',
    navbar: [
      {
        text: '攻略',
        link: '/Walkthrough/',
      }, {
        text: '指南',
        link: '/Guide/',
      },
    ],
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdatedText: '上次更新',
    contributorsText: '贡献者',
    notFound: [
      '这里什么都没有',
      '我们怎么到这来了？',
      '这是一个 404 页面',
      '看起来我们进入了错误的链接',
    ],
    backToHome: '返回首页',
    openInNewWindow: '在新窗口打开',
    toggleDarkMode: '切换夜间模式',
    toggleSidebar: '切换侧边栏',
  },
}