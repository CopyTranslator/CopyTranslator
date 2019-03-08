---
sidebarDepth: 6
---
# 进阶教程
CopyTranslator 提供了丰富的自定义功能，但是需要用户有一定的动手能力。

## 自定义界面语言

由于我无法自己维护所有界面语言文件，因此最新版本的最新的界面语言文件可能不会和`CopyTranslator`一同发布（除了`en`和`zh-cn`）。现在，您可以下载本仓库目录[dist_locales](https://github.com/CopyTranslator/CopyTranslator/tree/phoenix/dist_locales)下的语言文件 `{locale}.json`，并将其放在`{userDir}/copytranslator/locales`下面，`CopyTranslator`将在启动时检测它们，然后您可以在设置面板上选择它们。、


## 自定义界面样式/风格

您可以通过修改`{{userDir}}/copytranslator/styles.css`文件来自定义`CopyTranslator`的界面风格，样式。

可以修改的属性包括但不限于：字体，颜色，背景，边框。

可以自定义的部分包括但不限于：两大模式的结果框，设置框，状态栏的样式。

参考文件中的注释，您可以更改`CopyTranslator`的部分外观。以下是一个例子。

```css
.focusText {
    /*modify the style of the focus result textarea*/
    font-family: Monaco; 
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

## 动作系统

以下是目前所有可用动作的列表。

```json
//down below are status switching action
"switchActions": [
    "autoCopy",
    "autoPaste",
    "autoPurify",
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
//down below are actions that do a specific thing.
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
```


## 自定义全局快捷键

对于大多数[动作](#动作系统)，您可以通过修改`{{userDir}}/copytranslator/shortcut.json`来绑定全局快捷键。
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

## 自定义右键菜单/面板

当然！您可以自定义`CopyTranslator`的上下文菜单。只要改变`{{userDir}}/copytranslator/copytranslator.json`中的`contrastMenu`，`focusMenu`，`trayMenu`的值;所有[动作](#动作系统)几乎都可以用作菜单项。

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

