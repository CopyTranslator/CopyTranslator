---
sidebarDepth: 6
---
# 使用指南

## 视频教程

附上我朋友录制的介绍视频链接(v0.0.6) 2018-09-09 

- [Copytranslator 复译 高容错率实时翻译软件](https://www.bilibili.com/video/av31396414/) by 简约生活干货铺

最新介绍视频(v0.0.7) 2018.12.06：
- [【超强】CopyTranslator！最适合科研工作者的翻译工具](https://www.bilibili.com/video/av37503818/) by 哼哈未来

**更详细的功能还请看文字教程，CopyTranslator经过多次迭代，功能越来越丰富（~~复杂~~），不阅读完整使用指南无法完全发挥其功能，查看使用指南能够解决您90%的疑惑。**

## 基本使用

### 特性

1. 勾选`监听剪贴板`，`CopyTranslator`会自动翻译剪贴板内容。

2. `点按复制`，**默认关闭**，为减少多次按`Ctrl+C`或者是右键复制所带来的麻烦，复译引入一个选中长按自动复制的机制，在打开监听剪贴板选项后，只需选中文字，并将鼠标悬停在选中文字上方**长按不动超过0.3s后**释放鼠标**（其实0.3s你基本没感觉自己长按了），也就是长按后释放，即可复制（释放很重要，不是按越久越好）。**这可以避免我们过度移动鼠标（右键再选择复制）或者是疯狂按Ctrl+C按得很累。（在一些软件中不能用，已知可用软件：文电通 PDF阅读器等等）

   ![](https://camo.githubusercontent.com/eda5800ebf8dcf00979bd564b7e7e3ca2dd2ef80/68747470733a2f2f73312e617831782e636f6d2f323031382f30392f31332f694569624c442e676966)

3. `智能互译`，`CopyTranslator`会自动识别所复制的文本，根据所设置的`source`和`target`进行自动智能互译，也就是说，如果您复制的是`source`，会翻译为`target`，复制`target`则会翻译为`source`。（不用担心，`Auto Copy`不会与此机制相互影响。但是如果同时还打开了`检测语言` 则`智能互译`不会生效，只会将您的原文翻译成`target`语言。详细解释见Q&A）

4. `智能词典`

   单词和部分短语将在专注模式上看到更详细的解释。勾选`Smart Dict`选项以启用它。

    ![iManhV.png](https://s1.ax1x.com/2018/09/26/iManhV.png)


4. `设置记忆`，您的设置将自动保存在磁盘中，并在下次启动时自动重新加载。配置文件版本间变动很大，又因为如果配置文件不兼容软件将直接无法使用，影响用户体验，但处理兼容性会占用较长的时间，因此决定**不向前兼容也不向后兼容，每次更新您的旧版本/新版本配置会消失。**
5. 在设置界面中可以**选择界面语言**（当前原生支持：English，简体中文，繁体中文），逐步生效，无需重启。
6. **自动检查更新**，每次启动，CopyTranslator会在后台检测更新，如果有新版本会提示，但仍需手动下载安装更新。

### 设置/选项描述

1. `始终置顶`：让`CopyTranslator`窗口总是在其他窗口上方。

2. `监听剪贴板`：监听剪贴板并自动翻译。

3. `自动复制`：如果您想在自动翻译后自动复制结果，请勾选它。

4. `自动净化`：**注意：此功能与自动复制冲突，会自动反选`自动复制`**，将存在错误空行的剪贴板内容替换为正常的剪贴板

5. `自动黏贴`：**前提：选中自动复制**，自动复制之后模拟ctrl+v自动黏贴，替换选中文字。

6. `智能词典`，单词少于3的`外语句子`将被视为短语或单词，您将在专注模式上看到更详细的解释，这个不用设置。

7. `增量复制`, 将复制的文本附加到原文而不是替换它，**当段落在不同页面中分隔时尤其有用**。**用来解决一句话被页面断成两句，一次复制不全的场景**。勾选`增量复制`选项以启用它。

8. `检测语言`：自动检测源文本语言。

9. `源语言`：默认是English。`目标语言`：默认是简体中文. 

   `v0.0.6.0`后，`源`和`目标`均是相对而言的，`CopyTranslator`会自动识别所复制的文字，**根据所设置的`源`和`目标`进行自动智能互译**，也就是说，如果您复制的是`源语言`，会翻译为`目标语言`，复制`目标语言`则会翻译为`源语言`。（不用担心，`自动复制`不会与此机制相互影响。）

10. `切换模式`: 在对照模式和专注模式间切换

11. `自动隐藏`，选项打开后

    - 专注模式窗口贴上边（Y坐标小于0）|贴左边|贴右边 失去焦点后会自动隐藏，可设置，另外可设置翻译后自动显示。所谓失去焦点指的是，原本焦点在专注模式，而后鼠标/键盘点击其他软件，焦点转移这一事件。

    - 当专注模式处于贴边收起时可以点击其下边缘，使其获得焦点，专注模式展开。
      `对照模式`暂时不会`贴边隐藏`,也不会`自动显示`。

12. `自动显示`：勾选此选项后，当专注模式处于收起状态，且监听到剪贴板变化，专注模式将自动展开。**展开后想要收起结果框，请先点击一下结果框，后点击其他地方，如果`贴边隐藏`选项处于打开状态则结果框会收起。**

13. `复制原文`，您可以通过任务栏图标的菜单/专注模式右键菜单点击`复制原文`以在`自动复制`模式下暂时复制原文，而不是译文。

    ![1537871871793](https://s1.ax1x.com/2018/09/26/iMamt0.png)

14. `切换界面语言`，在**设置页面**中可以选择界面语言，随意切换模式后生效。

15. 翻译器：可以从Google,Baidu,Youdao中选择

16. 隐藏方向：可以选择向上，向左，向右
:::warning
请双屏用户务必选择**向上**
:::

### 双模式具体描述

有两种可供选择的模式。

- 对照模式
- 专注模式

#### 对照模式

对照模式提供了一个交互式框架,可以快速地设置，同时可以原文和译文对照着看。



![win10.png](https://s2.ax1x.com/2019/03/08/ASEOD1.png)

#### 专注模式

专注模式只提供一个结果窗口，让您更好地关注结果。 （通常需要配合`监听剪贴板`和`始终置顶`选项使用）

1. 你可以对它自由拉伸，任意变换。

   - 拖动窗口边框可以拉伸变形这个窗口；

   - 拖动状态栏可以整体移动窗口

   - 双击状态栏可以收起窗口，可以设置双击隐藏的方向/最小化。

   - 状态栏颜色会指示软件状态，根据你的设置会变换颜色。提示你当前是否监听剪贴板，是否打开了`自动复制`选项等等或者现在正在请求服务器翻译等等，具体颜色自行体验。

     ![1528470182001](https://s2.ax1x.com/2019/03/08/ASEXHx.png)

2. 字体缩放：现在两个模式均可通过Ctrl+滚轮进行字体缩放。


   ![iMaKpT.png](https://s2.ax1x.com/2019/03/08/ASVnPS.png)

3. 当光标位于专注模式结果框中时`Ctrl+Enter`实现翻译（监听剪贴板时会复制框内文本，当不监听剪贴板时复制框内文本），`Ctrl+B`实现百度搜索框内内容，`Ctrl+G`实现Google搜索框内内容。

## 进阶教程
CopyTranslator 提供了丰富的自定义功能，但是需要用户有一定的动手能力。

### 自定义界面语言

由于我无法自己维护所有界面语言文件，因此最新版本的最新的界面语言文件可能不会和`CopyTranslator`一同发布（除了`en`和`zh-cn`）。现在，您可以下载本仓库目录[dist_locales](https://github.com/CopyTranslator/CopyTranslator/tree/phoenix/dist_locales)下的语言文件 `{locale}.json`，并将其放在`{userDir}/copytranslator/locales`下面，`CopyTranslator`将在启动时检测它们，然后您可以在设置面板上选择它们。、


### 自定义界面样式/风格

您可以通过修改`{userDir}/copytranslator/styles.css`文件来自定义`CopyTranslator`的界面风格，样式。

可以修改的属性包括但不限于：字体，颜色，背景，边框。

可以自定义的部分包括但不限于：两大模式的结果框，设置框，状态栏的样式。

参考文件中的注释，您可以更改`CopyTranslator`的部分外观。以下是一个例子。

```css
.focusText {
    /*modify the style of the focus result textarea*/
    font-family: Monaco; /*设置专注模式的字体为 Monaco*/
}

.contrastText {
    /*modify the style of the contrast src and result textarea*/

}

.contrast {
    /*modify the style of the contrast mode panel*/
}

.statusBar {

}
```
::: tip
CSS文件的编写可以参考[HTML中文网](https://www.html.cn/book/css/all-properties.html)。欢迎大家分享自己编写的`style.css`文件。
:::

### 动作系统

以下是目前所有可用动作的列表。动作系统统一了界面设置，菜单设置，按钮等等。

```json
//下面是切换选项的动作
"switchActions": [
    "autoCopy",
    "autoPaste",
    "autoFormat",
    "tapCopy",
    "detectLanguage",
    "incrementalCopy",
    "autoHide",
    "autoShow",
    "stayTop",
    "listenClipboard",
    "translatorType"//|{{0|1|2}} change translator，0 means Google,1 means Youdao,2 means Baidu
    "hideDirect"//|{{0|1|2|3|4}} //set the hide direction when double click on status bar. 0-4 means Up,Right,Left,None,Minify.
]
//以下是做一个特定的事的动作
"normalAction":[
    "copySource",
    "copyResult",
    "clear",
    "focusMode",
    "contrastMode",
    "settings",
    "helpAndUpdate",
    "exit",
    "retryTranslate"
]
//以下是Electron 原生角色

"roles":[
    "undo",
    "redo",
    "cut",
    "copy",
    "paste",
    "pasteAndMatchStyle",
    "selectAll",
    "delete",
    "minimize",
    "close",
    "quit",
    "reload",
    "forcereload",
    "toggledevtools",
    "toggleFullScreen",
    "resetzoom",
    "zoomin",
    "zoomout",
    "editMenu",
    "windowMenu"
]

```


### 自定义全局快捷键

对于大多数[动作](#动作系统)，您可以通过修改`{userDir}/copytranslator/shortcut.json`来绑定全局快捷键。
::: warning
当快捷键已被其他应用程序占用时，绑定将失败。
:::
每条记录的形式为：`action:accelerator`。

以下为一个例子

```json
{
"listenClipboard": "CommandOrControl+J",
"translatorType|0":"CommandOrControl+T"
}
```

它将切换监听剪贴板的动作绑定到快捷键`CommandOrControl+J`。并将切换为Google翻译器的操作绑定到快捷键`CommandOrControl+T`。

对于所有可用操作，请参看 [动作](#动作系统)。 

所有可用的快捷键，请查看[Electron Accelerator](https://electronjs.org/docs/api/accelerator)。

### 自定义右键菜单/面板

当然！您可以自定义`CopyTranslator`的上下文菜单。只要改变`{userDir}/copytranslator/copytranslator.json`中的`contrastMenu`，`focusMenu`，`trayMenu`的值;所有[动作](#动作系统)几乎都可以用作菜单项。

```json
    "contrastMenu": [
        "copySource",
        "copyResult",
        "clear",
        "retryTranslate",
        "focusMode",
        "settings",
        "exit"
    ],
    "focusMenu": [
        "copySource",
        "copyResult",
        "clear",
        "retryTranslate",
        "contrastMode",
        "settings",
        "exit"
    ],
    "trayMenu": [
        "translatorType",
        "copySource",
        "copyResult",
        "clear",
        "retryTranslate",
        "contrastMode",
        "focusMode",
        "settings",
        "helpAndUpdate",
        "exit"
    ],
```

<Valine></Valine>

