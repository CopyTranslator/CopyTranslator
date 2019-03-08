module.exports = {
  title: 'CopyTranslator',
  description: '复制即翻译的外文辅助阅读翻译解决方案',
  head: [
    ['link', { rel: 'icon', href: `/icon.png` }]
  ],
  // base: '/docs/',
  plugins: {
    '@vssue/vuepress-plugin-vssue': {
      // 设置 `platform` 而不是 `api`
      platform: 'github',

      // 其他的 Vssue 配置
      owner: 'CopyTranslator',
      repo: 'comments',
      clientId: '28524bb606982ce73bf0',
      clientSecret: '8bcd70bf3339fb0c0a946738e0327ca53ae3bb37'
    },
  },
  themeConfig: {
      nav: [
        { text: '主页', link: '/' },
        { text: '指南', link: '/guide/' },
        { text: '更新日志', link: '/changelogs/0.0.8' },
        { text: '支持', link: '/support/' },
        { text: '关于', link: '/about/' },
        { text: 'GitHub', link: 'https://github.com/CopyTranslator/CopyTranslator' },
      ],
      sidebar: {
        '/guide/':[
          {
            title:"指南",
            collapsable: false,
            children: [
              'download',
              '',
              'advance',
              'questions'
            ]
          }
        ],
        '/changelogs/':[
          {
            title:"更新日志",
            collapsable: false,
            children: [
              '0.0.8',
              '0.0.7',
              '0.0.6'
            ]
          }
        ],
        '/support/':[
          {
            title:"支持",
            collapsable: false,
            children: [
              ''
            ]
          }
        ],
        '/about/':[
          {
            title:"关于",
            collapsable: false,
            children: [
              '',
              'acknowledge',
              'statement',
              'lisence',
              'author'
            ]
          }
        ]
      }
    } 
}