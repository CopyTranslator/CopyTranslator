# CopyTranslator 
![图标暂无](https://s1.ax1x.com/2018/11/29/FZxqM9.png)

**原图标废止o(╥﹏╥)o，现向广大用户征集新图标，欢迎对设计有兴趣的同学在[Issue](https://github.com/elliottzheng/CopyTranslator/issues/12)投稿。**

**外文辅助阅读翻译解决方案**

`CopyTranslator`专门针对英文及中文pdf的换行和句尾做了优化，解决文章断句和换行带来的翻译错误问题，翻译结果更符合中文表达。

**请尽快更新到[![Download](https://api.bintray.com/packages/elliottzheng/CopyTranslator/CopyTranslator/images/download.svg) ](https://bintray.com/elliottzheng/CopyTranslator/CopyTranslator/_latestVersion)
，这是你没有体验过的全新版本，只需3分钟，你就会跟我一样，爱上这个软件。**

**如果您觉得软件对您有所帮助，不用follow，不用fork，点一下右上角的star就是对我最大的支持，欢迎介绍给朋友使用。**
(在线翻译资源来自互联网，版权属于相关网站，软件仅供交流使用)

**本软件免费开源，如果您发现有人在网上售卖此软件，请帮忙举报下**

## 特性

###  解决PDF复制翻译换行问题
**复译专门针对英文及中文pdf的换行和句尾做了优化，基本解决断句和换行的问题。** 以下为使用复译直接复制翻译后的结果，可以看出翻译效果相比于直接复制黏贴到网页有了巨大的改善。同时，借助于强大的google翻译API，翻译质量有保证，**所使用的translate.google.cn连接速度也较快，无需担心网络问题。**

![](https://s1.ax1x.com/2018/09/13/iEiIRx.png)

### 多段同时翻译
效率更高，同时尽可能保持原有分段。

![](https://s1.ax1x.com/2018/09/13/iEi7QK.png)

![](https://s1.ax1x.com/2018/09/13/iEiHsO.png).

### 重新定义复制

为减少多次按ctrl+c或者是右键复制所带来的麻烦，复译引入一个选中长按自动复制的机制，在打开监听剪贴板选项后，只需选中文字，并将鼠标悬停在选中文字上方**长按不动超过0.3s后释放鼠标（其实0.3s你基本没感觉自己长按了），**也就是**长按后释放**，即可复制。这可以避免我们过度移动鼠标（右键再选择复制）或者是疯狂按ctrl+c按得很累。

![](https://s1.ax1x.com/2018/09/13/iEibLD.gif)

### 智能互译      

`CopyTranslator`会自动识别所复制的文字，**根据所设置的**`source`和`target`**进行自动智能互译**，也就是说，如果您复制的是`source`，会翻译为`target`，复制`target`则会翻译为`source`。（不用担心，`Auto Copy`不会与此机制相互影响。）

### 智能词典

基于[Youdao](https://github.com/longcw/youdao)提供的API

单词少于3的**外语句子**将被视为短语或单词，您将在专注模式上看到更详细的解释。勾选`Smart Dict`选项以启用它。**注：查词限于Youdao支持的语言，但是您无需也无法手动选择语言。**

![](https://s1.ax1x.com/2018/09/26/iManhV.png)

![](https://s1.ax1x.com/2018/09/26/iMaM1U.png)

### 自定义字体大小

使用`shift + F3`和`shift + F4`缩小或增大专注模式的字体大小

![](https://s1.ax1x.com/2018/09/26/iMaKpT.png)

### 连续复制

将复制的文本附加到原文而不是替换它，**当段落在不同页面中分隔时尤其有用。**勾选`Continus Copy`选项以启用它。

### 两种窗口模式可供选择

`主模式`及`专注模式`，专注模式只提供译文窗口，便于您关注结果。使用专注模式时注意勾选`Stay on top`及`Listen clipboard`,必要时应勾选`Auto Copy`。

### 支持语言丰富

Google翻译支持啥我们就支持啥。

### 占用内存小

运行时常驻内存只有十几兆


## 致谢

感谢[wxpython](https://wxpython.org/), [googletrans](https://github.com/ssut/py-googletrans), [pyperclip](https://github.com/asweigart/pyperclip), [Youdao](https://github.com/longcw/youdao) 的开发者以及我亲爱的朋友们。



