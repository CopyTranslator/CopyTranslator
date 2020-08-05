![logo](https://user-images.githubusercontent.com/22427645/50773452-d738dd80-12cb-11e9-9b7c-45e5d7f74c8a.png)

[英语/English](README.md)

[![OpenTranslate](https://img.shields.io/badge/Powered_by-OpenTranslate-brightgreen)](https://github.com/OpenTranslate)
[![](https://img.shields.io/github/stars/copytranslator/copytranslator.svg)](https://github.com/copytranslator/copytranslator/stargazers)
[![](https://img.shields.io/github/release/copytranslator/copytranslator.svg)](https://github.com/copytranslator/copytranslator/releases)
[![](https://img.shields.io/gitter/room/copytranslator/copytranslator.svg)](https://gitter.im/CopyTranslator/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![](https://img.shields.io/github/downloads/copytranslator/copytranslator/total.svg)](https://github.com/copytranslator/copytranslator/wiki/Downloads-%E4%B8%8B%E8%BD%BD%E4%B8%8E%E5%AE%89%E8%A3%85)
![](https://img.shields.io/badge/platform-windows|macos|linux-orange.svg)
[![](https://img.shields.io/github/license/copytranslator/copytranslator.svg)](./LICENSE)

**复制即翻译的外文辅助阅读翻译解决方案**

**请尽快更新到[![](https://img.shields.io/github/release/copytranslator/copytranslator.svg)](https://github.com/copytranslator/copytranslator/releases)，这是你没有体验过的全新版本，只需3分钟，你就会跟我一样，爱上这个软件。**

**如果您觉得软件对您有所帮助，不用follow，不用fork，点一下右上角的star并推荐给周围的朋友就是对我极大的支持。**

(在线翻译资源来自互联网，版权属于相关网站，软件仅供交流使用，严禁商用)

**本软件免费开源，如果您发现有人在网上售卖此软件，请帮忙举报下**

<div align="center">:heart: 喜欢这个项目? 可以在<a href="https://afdian.net/@elliottzheng/plan" target="_blank">爱发电</a>请作者喝杯咖啡</div>   

## 简介
### 前言
科研人员总少不了阅读大量文献，理解文献内容就成了科研生活常态，而我们平时复制PDF内容黏贴到网页翻译的时候可能会出现多余换行而导致翻译乱码，译文与中文阅读习惯不符的情况，翻译结果很差，需要手动删除换行，而`CopyTranslator`可以帮我们快速且完美地解决这个问题。

只需打开`CopyTranslator`，直接复制PDF文本，`CopyTranslator`监听到剪贴板变化，会将剪贴板内容进行处理（如去除多余换行等），并显示翻译结果，翻译效果相比于直接复制黏贴到网页版翻译有了巨大的改善，同时翻译所需时间也大大减少，借助于强大的在线翻译API(当前支持Youdao,Google,Baidu,Sogou,Caiyun,Tencent)，翻译质量有保证。另外还有丰富的选项可以设置，如自动复制翻译结果到剪贴板，[增量复制](#增量复制)，[智能互译](#智能互译)等等，有效提高人们阅读及翻译外文文献的效率。
`CopyTranslator`经过多次迭代，功能越来越丰富，越来越人性化，**建议阅读完整[使用指南](https://copytranslator.github.io/guide/)，最大限度发挥其功能。**

### 核心用法
**打开网页/PDF，选中要翻译的段落文字，按Ctrl+C/右键复制文本，CopyTranslator监听到剪贴板变化，会将剪贴板内容进行处理（如去除多余换行等），翻译，并显示**。只要这边鼠标一复制，不用粘贴，`CopyTranslator`立刻给出翻译结果，有效提高工作效率。

  ![](https://s1.ax1x.com/2018/11/30/FmrNFS.gif)

## 特性
### 复制即翻译
**大大简化翻译所需步骤**，只需复制文本到剪贴板，下一秒即可查看翻译结果，让你享受所见即所得的快感，更有[点按复制](#点按复制)机制，让你复制文本更轻松。

### 停靠桌面

让翻译窗口永远停靠在桌面右侧，**其他窗口自动避让，翻译如行云流水般自然**。

灵感来自`OneNote`的停靠桌面功能，[点击了解更多](https://github.com/Andy-AO/CopytranslatorAppBar)。

###  解决PDF复制翻译换行问题
**`CopyTranslator`专门针对英文及中文pdf的换行和句尾做了优化，基本解决断句和换行的问题。** 以下为使用`CopyTranslator`直接复制翻译后的结果，可以看出翻译效果相比于直接复制黏贴到网页有了巨大的改善。同时，借助于常用的在线翻译API，翻译质量有保证，连接速度也较快，无需担心网络问题。

![](https://s1.ax1x.com/2018/09/13/iEiIRx.png)

### 多段同时翻译

效率更高，同时尽可能保持原有分段。

![](https://s1.ax1x.com/2018/09/13/iEi7QK.png)


### 强大的专注模式
无比强大的专注模式，一个简单的文本框，能够满足日常翻译90%的需求!
- **译文同步显示在`专注模式`和`对照模式`当中。**
- **[智能词典](#智能词典)仅在`专注模式`中显示，彩色显示帮助你快速分辨各项内容**
- **当光标位于专注模式结果框中时，`Ctrl+Enter`可以翻译框内内容，`Ctrl+B`实现百度搜索框内内容，`Ctrl+G`实现Google搜索框内内容**。
- **专注模式右键菜单可以实现几乎全部选项的设置，全部的应用**。


### 智能互译      

`CopyTranslator`会自动识别所复制的文字，**根据所设置的**`源语言`和`目标语言`**进行自动智能互译**，举个例子，设置`源语言`为英语，`目标语言`为简体中文,这时如果您复制的是英语，会翻译为中文，复制中文则会翻译为英文。（不用担心，`自动复制`不会与此机制相互影响。）

### 智能词典

对于短语或单词，您将在专注模式上看到更详细的解释。

![](https://s1.ax1x.com/2018/09/26/iManhV.png)

### 增量复制

将复制的文本附加到原文而不是替换它，**当段落被页面中分隔时尤其有用**。勾选`增量复制`选项以启用它。

### 双模式自由切换，应对不同场景

- `对照模式`符合用户以前的的使用习惯，原文与译文对照显示。
- `专注模式`只提供译文窗口，便于您关注译文。使用专注模式时注意勾选`始终置顶`及`监听剪贴板`,必要时应勾选`自动复制`。

### 可玩性超强的自定义
- 界面的风格，字体，背景等样式可以方便地自定义。
- 支持**自定义全局热键**及方便的快捷键操作
- 国际化，提供多种界面语言供选择，**并支持自行创建或下载区域语言文件。**

### 其他特性
- 支持语言丰富，Google翻译支持啥我们就支持啥。
- 跨平台，当前支持Mac及Window。
- 更多自动化的自定义选项可供选择，如`自动复制`，`设置记忆`，`贴边隐藏`,`自动显示`
- `CopyTranslator`还将继续加入更多新特性，敬请期待。

请查阅[软件文档](https://copytranslator.github.io)了解更多


## 使用指南/文档/官网

传送门：[使用指南](https://copytranslator.github.io/guide/)

## 下载/安装

传送门：[安装指南](https://copytranslator.github.io/download/)

`CopyTranslator`经过多次迭代，功能越来越丰富，越来越人性化，请一定阅读完整[使用指南](https://copytranslator.github.io/guide/)，才能最大限度发挥其功能。


## 转载声明
本软件为免费的开源软件，开发者为[Elliott Zheng](https://github.com/elliottzheng)，欢迎STAR，PR。**转发时请一定附上项目地址，未附上项目地址/软件官网的转载行为均构成侵权**。 

## 相关链接
- [软件官网](https://copytranslator.github.io/)
- [Github项目主页](https://github.com/copytranslator/CopyTranslator)
- [码云项目主页](https://gitee.com/ylzheng/CopyTranslator)
- [官方邮箱](mailto:copytranslator@hypercube.top)

## 致谢

`CopyTranslator`的重生离不开大家的无私贡献，感激不尽。篇幅所限，在这里详细列出 [致谢](https://copytranslator.github.io/about/acknowledge.html#%E7%95%8C%E9%9D%A2%E4%B8%8E%E4%BA%A4%E4%BA%92%E8%AE%BE%E8%AE%A1)。

## 支持CopyTranslator

### 分享

点下star，并分享给您的朋友，社交网络就是对CopyTranslator的极大支持。

### 赞助

CopyTranslator是采用 GPL v2 协议许可的开源项目，使用完全免费。

但是它的维护也是需要较大的精力的，这些工作目前主要由作者一人花费大量私人时间与精力完成😫。

如果你希望支持这个项目长久持续开发下去并不断加入新功能，可以选择打赏❤️让我买杯咖啡☕恢复元气，更好地投入到开发当中。

感谢所有支持CopyTranslator的小伙伴们。

<h4 style="text-align:center;">通过微信或支付宝扫码打赏</h4>
<div style="text-align:center;">
<div style="display:inline-block;">
   <img width="300" src="images/wechat.jpg" alt="微信赞赏">
   <p style="text-align:center;">微信赞赏</p>
</div>

   <div style="display:inline-block;">
   <img width="300" src="images/alipay.jpg" alt="支付宝"> 
   <p style="text-align:center;">支付宝</p>
</div>
</div>


## 开源协议

代码采用GNU GENERAL PUBLIC LICENSE 2.0协议授权。请查阅[LICENSE](./LICENSE) 文件，获取更多信息。





