module.exports = {
  title: 'CopyTranslator',
  description: '复制即翻译的外文辅助阅读翻译解决方案',
  themeConfig: {
      nav: [
        { text: '主页', link: '/' },
        { text: '指南', link: '/guide/' },
        { text: '更新日志', link: '/changelogs/0.0.8' },
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
        ]
      }
    } 
}