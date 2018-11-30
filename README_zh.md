![图标暂无](https://s1.ax1x.com/2018/11/29/FZxqM9.png)

**原图标废止o(╥﹏╥)o，现向广大用户征集新图标，欢迎对设计有兴趣的同学在[Issue](https://github.com/elliottzheng/CopyTranslator/issues/12)投稿。**

# CopyTranslator 
[英语/English](README.md)

**外文辅助阅读翻译解决方案**

**请尽快更新到[![Download](https://api.bintray.com/packages/elliottzheng/CopyTranslator/CopyTranslator/images/download.svg) ](https://bintray.com/elliottzheng/CopyTranslator/CopyTranslator/_latestVersion)
，这是你没有体验过的全新版本，只需3分钟，你就会跟我一样，爱上这个软件。**

**如果您觉得软件对您有所帮助，不用follow，不用fork，点一下右上角的star就是对我最大的支持，欢迎介绍给朋友使用。**
(在线翻译资源来自互联网，版权属于相关网站，软件仅供交流使用)
**本软件免费开源，如果您发现有人在网上售卖此软件，请帮忙举报下**

## 简介
### 前言
每个科研人员总少不了阅读大量文献，理解文献内容就成了科研生活常态，现在用的最多的翻译软件以谷歌翻译、百度翻译、有道词典等方法居多，但如果从pdf复制文本，常存在多余换行，直接复制黏贴翻译结果很差，需要手动删除换行。

而现在只需打开CopyTranslator，直接复制PDF文本，CopyTranslator监听到剪贴板变化，会将剪贴板内容进行处理（如去除多余换行等），并显示翻译结果，翻译效果相比于直接复制黏贴到网页版翻译有了巨大的改善，同时翻译所需时间也大大减少，借助于强大的google翻译API，翻译质量有保证。另外还有丰富的选项可以设置，如自动复制翻译结果到剪贴板，增量复制，智能互译等等，最大程度地辅助人们阅读及翻译外文文献。
CopyTranslator经过多次迭代，功能越来越丰富，越来越人性化，建议完整使用指南[wiki](https://github.com/elliottzheng/CopyTranslator/wiki)，发挥其最大功能。

### 核心用法
**打开网页/PDF，选中要翻译的段落文字，按Ctrl+C/右键复制文本，CopyTranslator监听到剪贴板变化，会将剪贴板内容进行处理（如去除多余换行等），翻译，并显示。**

## 特性
### 复制即翻译
**简化翻译所需步骤**，只需复制文本到剪贴板，下一秒即可查看翻译结果，让你享受所见即所得的快感，更有`点按复制`机制，让你复制文本更轻松。

###  解决PDF复制翻译换行问题
**`CopyTranslator`专门针对英文及中文pdf的换行和句尾做了优化，基本解决断句和换行的问题。** 以下为使用`CopyTranslator`直接复制翻译后的结果，可以看出翻译效果相比于直接复制黏贴到网页有了巨大的改善。同时，借助于强大的google翻译API，翻译质量有保证，所使用的translate.google.cn连接速度也较快，无需担心网络问题。

![](https://s1.ax1x.com/2018/09/13/iEiIRx.png)

### 多段同时翻译
效率更高，同时尽可能保持原有分段。

![](https://s1.ax1x.com/2018/09/13/iEi7QK.png)

![](https://s1.ax1x.com/2018/09/13/iEiHsO.png).

### 点按复制

为减少多次按ctrl+c或者是右键复制所带来的麻烦，CopyTranslator引入一个选中`点按复制`的机制，在打开监听剪贴板选项后，只需选中文字，并将鼠标悬停在选中文字上方**长按不动超过0.3s后释放鼠标（其实0.3s你基本没感觉自己长按了），**也就是**长按后释放**，即可复制。这可以避免我们过度移动鼠标（右键再选择复制）或者是疯狂按ctrl+c按得很累。

![](https://s1.ax1x.com/2018/09/13/iEibLD.gif)

### 智能互译      

`CopyTranslator`会自动识别所复制的文字，**根据所设置的**`source`和`target`**进行自动智能互译**，也就是说，如果您复制的是`source`，会翻译为`target`，复制`target`则会翻译为`source`。（不用担心，`Auto Copy`不会与此机制相互影响。）

### 智能词典

基于[Youdao](https://github.com/longcw/youdao)提供的API

单词少于3的**外语句子**将被视为短语或单词，您将在专注模式上看到更详细的解释。勾选`Smart Dict`选项以启用它。**注：查词限于Youdao支持的语言，但是您无需也无法手动选择语言。**

![](https://s1.ax1x.com/2018/09/26/iManhV.png)

![](https://s1.ax1x.com/2018/09/26/iMaM1U.png)

### 增量复制

将复制的文本附加到原文而不是替换它，**当段落在不同页面中分隔时尤其有用。**勾选`增量复制`选项以启用它。

### 两种窗口模式可供选择

`主模式`及`专注模式`，专注模式只提供译文窗口，便于您关注结果。使用专注模式时注意勾选`始终置顶`及`监听剪贴板`,必要时应勾选`自动复制`。

### 支持语言丰富

Google翻译支持啥我们就支持啥。

### 占用内存小

运行时常驻内存只有十几兆

### 自定义字体大小

使用`shift + F3`和`shift + F4`缩小或增大专注模式的字体大小

![](https://s1.ax1x.com/2018/09/26/iMaKpT.png)

## 使用指南以及下载和安装方式

请查看本项目[WIKI](https://github.com/elliottzheng/CopyTranslator/wiki)

## 致谢

感谢[wxpython](https://wxpython.org/), [googletrans](https://github.com/ssut/py-googletrans), [pyperclip](https://github.com/asweigart/pyperclip), [Youdao](https://github.com/longcw/youdao) 的开发者以及我亲爱的朋友们。



