module.exports = {
  title: 'CopyTranslator',
  description: '复制即翻译的外文辅助阅读翻译解决方案',
  head: [
    ['link', {
      rel: 'icon',
      href: `/icon.png`
    }]
  ],
  // base: '/docs/',
  plugins: {
  },
  themeConfig: {
    // 假如你的文档仓库和项目本身不在一个仓库：
    docsRepo: 'copytranslator/copytranslator',
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 假如文档放在一个特定的分支下：
    docsBranch: 'master',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '帮助我们改善此页面！',
    lastUpdated: 'Last Updated', // string | boolean
    nav: [{
        text: '主页',
        link: '/'
      },
      {
        text: '下载安装',
        link: '/download/'
      },
      {
        text: '❤️支持项目',
        link: '/support/'
      },
      {
        text: '使用指南',
        link: '/guide/'
      },
      {
        text: '更新日志',
        link: '/changelogs/v9'
      },
      {
        text: '用户生态',
        link: '/userland/'
      },
      {
        text: '关于',
        link: '/about/'
      },
      {
        text: 'GitHub',
        link: 'https://github.com/CopyTranslator/CopyTranslator'
      },
    ],
    sidebar: {
      '/userland/': [{
        title: "用户生态",
        collapsable: false,
        children: [
          '',
          'style',
          'shortcut'
        ]
      }],
      '/guide/': [{
        title: "指南",
        collapsable: false,
        children: [
          '',
          '10.0.0',
          '9.0.0',
          '8.4.0',
          '8.3.0',
          'questions'
        ]
      }],
      '/changelogs/': [{
        title: "更新日志",
        collapsable: false,
        children: [
          'v9',
          'v8',
          'v7',
          'v6'
        ]
      }],
      '/support/': [{
        title: "支持",
        collapsable: false,
        children: [
          '',
          'contributing'
        ]
      }],
      '/about/': [{
        title: "关于",
        collapsable: false,
        children: [
          '',
          'acknowledge',
          'statement',
          'lisence',
          'author'
        ]
      }]
    }
  }
}