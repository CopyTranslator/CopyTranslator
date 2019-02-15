![logo](https://user-images.githubusercontent.com/22427645/50773452-d738dd80-12cb-11e9-9b7c-45e5d7f74c8a.png)


**Thank [Mārtiņš Zemlickis](http://mzemlickis.lv/) for designing the new logo of CopyTranslator.**

# CopyTranslator 

[中文 Chinese](README_zh.md)

[![](https://img.shields.io/github/stars/copytranslator/copytranslator.svg)](https://github.com/copytranslator/copytranslator/stargazers)
[![](https://img.shields.io/github/release/copytranslator/copytranslator.svg)](https://github.com/copytranslator/copytranslator/releases)
[![](https://img.shields.io/gitter/room/copytranslator/copytranslator.svg)](https://gitter.im/CopyTranslator/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![](https://img.shields.io/github/downloads/copytranslator/copytranslator/total.svg)](https://github.com/copytranslator/copytranslator/wiki/Downloads-%E4%B8%8B%E8%BD%BD%E4%B8%8E%E5%AE%89%E8%A3%85)
[![](https://img.shields.io/badge/Project%20Phoenix%20-ongoing-orange.svg)](https://github.com/copytranslator/copytranslator/tree/phoenix)
[![](https://img.shields.io/github/license/copytranslator/copytranslator.svg)](./LICENSE)


**Foreign language assisted reading and translation solution**

**Please update to latest version as soon as possible. This is a new version that you have never experienced before. It is also the only available version (all the previous version is invalid now). Trust me, you will fall in love with it within minutes.**

**If you found it helpful to you, no need to follow or fork, just give me a star and recommend it to your friends around you.**

(Online translation resources come from the Internet, copyright belongs to related websites, and this software is only for academic exchange.)

**This software is free and open source. If you find someone selling this software , please report it in the Issue.**

## Introduction

### Foreword

Researchers always have to read a lot of literature, and understanding the content of the literature has become the norm in scientific research life. However, when we copy the PDF content and paste it into the webpage translation, there may be extra line breaks that lead to garbled translation, and the translation does not match the Chinese reading habits. The translation results are very poor and  you need to manually delete the line break, and `CopyTranslator` can help us solve this problem quickly and perfectly.

Just open the `CopyTranslator` and copy the PDF text to clipboard,  `CopyTranslator` will watch the clipboard changes, then it will process the clipboard contents (such as removing extra line breaks, etc.) and display the translation results. The translation effect is greatly improved compared to the direct copy and paste to the web version of the translation, and the time required for translation is greatly reduced. With the powerful Google translation API, the translation quality is guaranteed. There are also a wealth of options you can set, such as automatically copy translation results to the clipboard, [Incremental Copy](#Incremental Copy), [Smart Translation](#Smart Translation), etc., it effectively improve people's reading and translation efficiency of foreign literature.

**After several iterations, `CopyTranslator` has became more and more powerful as well as user-friendly. It is recommended to read the full usage guide [wiki](https://github.com/copytranslator/copytranslator/wiki) to make best use of it**.

### Core usage

**Open a webpage/PDF, select the text to be translated, copy the text to the clipboard, `CopyTranslator` will listens to the clipboard change, and  process the clipboard content (such as removing extra line breaks, etc.), translate it, and display**.  Just copy the text,`CopyTranslator` will immediately give the translation result, effectively improving your work efficiency.**

![](https://s1.ax1x.com/2018/11/30/FmrNFS.gif)

## Features

### Copy=Translate

**Greatly simplify the steps required for translation**, just copy the text to the clipboard, and wait to view the translation results in the next second, enjoy the WYSIWYG pleasure, and we also have the [Tap to Copy](#Tap to Copy) mechanism , making it easier for you to copy text.

### Solve the problem of PDF copy translation

`CopyTranslator` is specifically optimized for English and Chinese pdf line breaks and sentence endings, basically solving the problem caused by extra sentence breaks and line breaks. The following figure shows the translation results using `CopyTranslator`. It's obvious that the translation effect is greatly improved compared to directly copy and paste to the online translator. At the same time, with the powerful google translation API, the translation quality is guaranteed, and the translation.google.cn used is also faster to connect, no need to worry about network problems.

![](https://s1.ax1x.com/2018/09/13/iEiIRx.png)



### Multi segments Co-translation

More efficient, while keeping the original segment as much as possible.

![entoch](./screenshot/entoch.png)

### Tap to Copy

After turning on the `listen Clipboard` option, just select the text, and hover the mouse over the selected text to release the mouse over 0.3s. That is, **after long press and  release, it can be copied.** This can prevent us from over moving the mouse (right click to choose Copy) or tired of  pressing `Ctrl+C`.

![longpresscopy](/screenshot/longpresscopy.gif)

### Powerful Focus Mode

Unparalleled powerful focus mode, while it's just a simple text box, it can meet the needs of 90% of daily translation!

- **The translation is displayed in the `Focus mode` and `Contrast Mode` at the same time**. 
- **The result of [Smart Dictionary](#Smart Dictionary) is only displayed in `Focus Mode`, colorful text helps you quickly distinguish between items**.
- **Drag text to focus mode box, you can get translation results directly**.
- **When the cursor is in the focus mode result box, `Ctrl+Enter` to translate the contents of the box, `Ctrl+B` to use Baidu to search the contents of the box, and `Ctrl+G` to use Google to search the contents of the box**.
- **The right-click menu of `Focus mode` can be used to set up almost all options as well as all the function**.

### Smart Translation

`CopyTranslator` will automatically recognize the copied text, **intelligently translate according to the set`source language` and `target language`**, for example, set `source language` to English,and the ` target language` to be Simplified Chinese. If you copy English, it will be translated into Chinese, and if you copy Chinese, it will be translated into English. 

### Smart Dictionary

Sentences with words less than 3 will be view as phrase or word, you will see a more detailed explanations in `Focus Mode`. Check the `Smart Dict ` option to enable it. **Note: It is limited to the languages `Youdao` supported , but you don't need and cannot  manually choose language**.Based on API provided by [Youdao](https://github.com/longcw/youdao)

![1537871607106](assets/1537871607106.png)

### Incremental Copy

Append the copied text to the source other than replace it, especially useful when the paragraph is separated in different page. Check the `Incremental Copy ` option to enable it.

### Dual Mode Free Switching to Cope with Different Scenes

- The `Contrast Mode` is in accordance with the user's previous usage habits, and the original text is displayed against the translation.
- `Focus mode` only provides a translation window for you to follow the translation. When using the focus mode, please check the `Stay on top` and `Listen Clipboard`. Check the `Auto copy` if necessary, 

### Other features

- Support for rich languages, `CopyTranslator` support whatever Google translation supports.
- Many automated customization options are available, such as `Auto Copy`, `Config Memorization`, `Auto Hide`, `Auto Display`.
- Support global hotkeys and convenient shortcut operations.
- International, interface language can choose from English or Simplified Chinese.
- It occupies less memory and has only a few ten megabytes of  resident memory.
- There will be more new features in`CopyTranslator` , so stay tuned.

Please refer to the [User Manual](https://github.com/copytranslator/copytranslator/wiki/Usage-%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97) to know more about `CopyTranslator`

## User Manual and download and installation methods

Please refer to the project [WIKI](https://github.com/copytranslator/copytranslator/wiki) .

**After several iterations, `CopyTranslator` has became more and more powerful as well as user-friendly. It is recommended to read the full project [wiki](https://github.com/copytranslator/copytranslator/wiki) to make best use of it**.

## Reprint statement

This software is free open source software, the developer is [Elliott Zheng](https://github.com/elliottzheng), STAR and PR are welcomed.  **Please  attach the project address when forwarding, and the reprinting `CopyTranslator`without project address/software official website is infringement.**

## Related Links

- [Software official website](https://hypercube.top/copytranslator/) 
- [Project homepage on Github ](https://github.com/copytranslator/copytranslator) 
- [Project homepage on Gitee](https://gitee.com/ylzheng/CopyTranslator) 
- [Offical Blogs](https://www.cnblogs.com/elliottzheng/p/9060159.html) 
- [Official Email](mailto:copytranslator@hypercube.top)


## Acknowledgements

Thanks to the developers of [wxpython](https://wxpython.org/), [googletrans](https://github.com/ssut/py-googletrans), [pyperclip](https://github.com/asweigart/pyperclip) ,[Youdao](https://github.com/longcw/youdao),and [Gitee](https://gitee.com/),as well as my dear friends.

## License

The code is licensed under GNU GENERAL PUBLIC LICENSE 2.0. For more details, read the [LICENSE](./LICENSE) file.


