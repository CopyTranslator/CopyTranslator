![logo](https://user-images.githubusercontent.com/22427645/50773452-d738dd80-12cb-11e9-9b7c-45e5d7f74c8a.png)

[英语/English](README.md)

[![](https://img.shields.io/github/stars/elliottzheng/copytranslator.svg)](https://github.com/elliottzheng/CopyTranslator/stargazers)
[![](https://img.shields.io/github/release/elliottzheng/copytranslator.svg)](https://github.com/elliottzheng/CopyTranslator/releases)
[![](https://img.shields.io/gitter/room/elliottzheng/copytranslator.svg)](https://gitter.im/CopyTranslator/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![](https://img.shields.io/github/downloads/elliottzheng/copytranslator/total.svg)](https://github.com/elliottzheng/CopyTranslator/wiki/Downloads-%E4%B8%8B%E8%BD%BD%E4%B8%8E%E5%AE%89%E8%A3%85)
[![](https://img.shields.io/badge/Project%20Phoenix%20-ongoing-orange.svg)](https://github.com/elliottzheng/CopyTranslator-Phoenix)
[![](https://img.shields.io/github/license/elliottzheng/copytranslator.svg)](./LICENSE)

**复制即翻译的外文辅助阅读翻译解决方案**

**请尽快更新到[![Download](https://api.bintray.com/packages/elliottzheng/CopyTranslator/CopyTranslator/images/download.svg) ](https://bintray.com/elliottzheng/CopyTranslator/CopyTranslator/_latestVersion)
，这是你没有体验过的全新版本，也是当前唯一可用版本（之前版本都凉了），只需3分钟，你就会跟我一样，爱上这个软件。**

**如果您觉得软件对您有所帮助，不用follow，不用fork，点一下右上角的star并推荐给周围的朋友就是对我极大的支持。**

(在线翻译资源来自互联网，版权属于相关网站，软件仅供交流使用)

**本软件免费开源，如果您发现有人在网上售卖此软件，请帮忙举报下**

## 简介
### 前言
科研人员总少不了阅读大量文献，理解文献内容就成了科研生活常态，而我们平时复制PDF内容黏贴到网页翻译的时候可能会出现多余换行而导致翻译乱码，译文与中文阅读习惯不符的情况，翻译结果很差，需要手动删除换行，而`CopyTranslator`可以帮我们快速且完美地解决这个问题。

只需打开`CopyTranslator`，直接复制PDF文本，`CopyTranslator`监听到剪贴板变化，会将剪贴板内容进行处理（如去除多余换行等），并显示翻译结果，翻译效果相比于直接复制黏贴到网页版翻译有了巨大的改善，同时翻译所需时间也大大减少，借助于强大的Google翻译API，翻译质量有保证。另外还有丰富的选项可以设置，如自动复制翻译结果到剪贴板，[增量复制](#增量复制)，[智能互译](#智能互译)等等，有效提高人们阅读及翻译外文文献的效率。
`CopyTranslator`经过多次迭代，功能越来越丰富，越来越人性化，**建议阅读完整使用指南[wiki](https://github.com/elliottzheng/CopyTranslator/wiki)，最大限度发挥其功能。**

### 核心用法
**打开网页/PDF，选中要翻译的段落文字，按Ctrl+C/右键复制文本，CopyTranslator监听到剪贴板变化，会将剪贴板内容进行处理（如去除多余换行等），翻译，并显示**。只要这边鼠标一复制，不用粘贴，`CopyTranslator`立刻给出翻译结果，有效提高工作效率。

  ![](https://s1.ax1x.com/2018/11/30/FmrNFS.gif)

## 特性
### 复制即翻译
**大大简化翻译所需步骤**，只需复制文本到剪贴板，下一秒即可查看翻译结果，让你享受所见即所得的快感，更有[点按复制](#点按复制)机制，让你复制文本更轻松。

###  解决PDF复制翻译换行问题
**`CopyTranslator`专门针对英文及中文pdf的换行和句尾做了优化，基本解决断句和换行的问题。** 以下为使用`CopyTranslator`直接复制翻译后的结果，可以看出翻译效果相比于直接复制黏贴到网页有了巨大的改善。同时，借助于强大的google翻译API，翻译质量有保证，所使用的translate.google.cn连接速度也较快，无需担心网络问题。

![](https://s1.ax1x.com/2018/09/13/iEiIRx.png)

### 多段同时翻译
效率更高，同时尽可能保持原有分段。

![](https://s1.ax1x.com/2018/09/13/iEi7QK.png)

### 点按复制

在打开`监听剪贴板`选项后，只需选中文字，并将鼠标悬停在选中文字上方**长按不动超过0.3s后释放鼠标（其实0.3s你基本没感觉自己长按了），**也就是**长按后释放**，即可复制。这可以避免我们过度移动鼠标（右键再选择复制）或者是疯狂按ctrl+c按得很累。

![](https://s1.ax1x.com/2018/09/13/iEibLD.gif)

### 强大的专注模式
无比强大的专注模式，一个简单的文本框，能够满足日常翻译90%的需求!
- **译文同步显示在`专注模式`和`对照模式`当中。**
- **[智能词典](#智能词典)仅在`专注模式`中显示，彩色显示帮助你快速分辨各项内容**
- **拖拽文本到专注模式框，可以直接得到翻译结果**。
- **当光标位于专注模式结果框中时，`Ctrl+Enter`可以翻译框内内容，`Ctrl+B`实现百度搜索框内内容，`Ctrl+G`实现Google搜索框内内容**。
- **专注模式右键菜单可以实现几乎全部选项的设置，全部的应用**。


### 智能互译      

`CopyTranslator`会自动识别所复制的文字，**根据所设置的**`源语言`和`目标语言`**进行自动智能互译**，举个例子，设置`源语言`为英语，`目标语言`为简体中文,这时如果您复制的是英语，会翻译为中文，复制中文则会翻译为英文。（不用担心，`自动复制`不会与此机制相互影响。）

### 智能词典

单词少于3的**外语句子**将被视为短语或单词，您将在专注模式上看到更详细的解释。勾选`智能词典`选项以启用它。**注：查词限于Youdao支持的语言，但是您无需也无法手动选择语言。**（基于[Youdao](https://github.com/longcw/youdao)提供的API）

![](https://s1.ax1x.com/2018/09/26/iManhV.png)

### 增量复制

将复制的文本附加到原文而不是替换它，**当段落在不同页面中分隔时尤其有用**。勾选`增量复制`选项以启用它。

### 双模式自由切换，应对不同场景

- `对照模式`符合用户以前的的使用习惯，原文与译文对照显示。
- `专注模式`只提供译文窗口，便于您关注译文。使用专注模式时注意勾选`始终置顶`及`监听剪贴板`,必要时应勾选`自动复制`。

### 其他特性
- 支持语言丰富，Google翻译支持啥我们就支持啥。
- 更多自动化的自定义选项可供选择，如`自动复制`，`设置记忆`，`贴边隐藏`,`自动显示`
- 支持全局热键及方便的快捷键操作
- 国际化，界面语言可选择English/简体中文
- 占用内存小，运行时常驻内存只有十几兆。
- `CopyTranslator`还将继续加入更多新特性，敬请期待。

请查阅[使用指南](https://github.com/elliottzheng/CopyTranslator/wiki/Usage-%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97)了解更多




## 使用指南以及下载和安装方式

**请查看本项目[WIKI](https://github.com/elliottzheng/CopyTranslator/wiki)**。

**`CopyTranslator`经过多次迭代，功能越来越丰富，越来越人性化，请一定阅读完整[使用指南](https://github.com/elliottzheng/CopyTranslator/wiki/Usage-%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97)，才能最大限度发挥其功能**。


## 转载声明
本软件为免费的开源软件，开发者为[Elliott Zheng](https://github.com/elliottzheng)，欢迎STAR，PR。**转发时请一定附上项目地址，未附上项目地址/软件官网的转载行为均构成侵权**。 

## 相关链接
- [软件官网](https://hypercube.top/copytranslator/)
- [Github项目主页](https://github.com/elliottzheng/CopyTranslator)
- [码云项目主页](https://gitee.com/ylzheng/CopyTranslator)
- [相关博客](https://www.cnblogs.com/elliottzheng/p/9060159.html)
- [官方邮箱](mailto:copytranslator@hypercube.top)

## 致谢

`CopyTranslator`的重生离不开以下人员的贡献

### 界面与交互设计

设计师：[Mārtiņš Zemlickis](http://mzemlickis.lv/)

### 开源库

- [Electron](https://electronjs.org)：使用 JavaScript, HTML 和 CSS 构建跨平台的桌面应用
- [Vue](http://vuejs.org)：渐进式 JavaScript 框架
- [Vuetify](https://vuetifyjs.com): Material Design 组件库
- [NODE_GOOGLE_TRANSLATE](https://github.com/shikar/NODE_GOOGLE_TRANSLATE): 核心翻译引擎
- [iohook](https://github.com/wilix-team/iohook): 捕获全局鼠标和键盘事件
- [robotjs](http://robotjs.io/): 模拟键盘输入

## 支持CopyTranslator

### 分享

点下star，并分享给您的朋友，社交网络就是对CopyTranslator的极大支持。

### 赞助

CopyTranslator是采用 GPL v2 许可的开源项目，使用完全免费。但是它的维护也是需要较大的精力的，你可以通过捐赠的形式来帮助发展该项目。

- [爱发电](https://afdian.net/@elliottzheng/plan)

## 开源协议

代码采用GNU GENERAL PUBLIC LICENSE 2.0协议授权。请查阅[LICENSE](./LICENSE) 文件，获取更多信息。





