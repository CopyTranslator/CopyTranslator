# CopyTranslator 

![logo](./logo.png)

[中文 Chinese](./README_zh.md)

## User manual for Windows users.

Copy, Translate, and Paste with Google translate API.

### Project Homepage

https://github.com/elliottzheng/CopyTranslator

### Install
1. You can download the latest build for Windows from
   - Recommended: Click the download icon to download from `Bintray`. [![Download](https://api.bintray.com/packages/elliottzheng/CopyTranslator/CopyTranslator/images/download.svg) ](https://bintray.com/elliottzheng/CopyTranslator/CopyTranslator/_latestVersion) 
   - [Github Releases](https://github.com/elliottzheng/CopyTranslator/releases)
   - [Gitee Releases](https://gitee.com/ylzheng/CopyTranslator/releases):Especialy for Chinese users.
2. Run the `shortcut.bat` in the program directory, it will create a shortcut on you desktop.


## Important Update of v0.0.5.1

**Redefining the Copy of CopyTranslator**  To reduce the trouble of multiple ctrl+c or right click replication, CopyTranslator introduces a mechanism to copy  the selected text  after long press and release. After turning on the `listen to clipboard` option, just select the text, and hover the mouse over the selected text to release the mouse over 0.1s. (in fact, 0.1s is very short), that is, **after long press and  release, it can be copied.** This can prevent us from over moving the mouse (right click to choose Copy) or tired of  pressing ctrl+c.

![longpresscopy](/screenshot/longpresscopy.gif)

### Usage
There are two frame modes you can choose from.

- Main mode
- Focus mode

You can switch mode by the menu of taskbar icon.

**Global hot key**: `Shift+F1`, you can use it to iconize the and restores the `CopyTranslator`.(notice: this might clash in some laptops)

**Global hot key**: `Shift+F2`, you can use it to switch between different frame modes.

![taskbar0](./screenshot/focus_mode.png)

#### Main Mode

Main mode provides an interactive frame.

- `Stay on top`: Let the `CopyTranslator` window always above other windows.

- `Listen on Clipboard`: Listen on Clipboard and translate it automatically.

- `Auto detect language`: Detect the source language.

- `Auto copy`: Check it if you want it to copy the result automatically after auto translate.

- `Source language`: The default is English.

- `Target language`: The default is Chinese(simplified).

- `Switch mode`: Switch from main mode to focus mode.

  ![win10.png](./screenshot/screenshot.png)
#### Focus Mode

Focus mode provides only a result frame, for you to focus on the result better. (Remember to check the `Listen to Clipboard` and `Stay on top` options.)

You can resize it freely.

- Drag the orange (or color of your theme) area at the top of the window, or the border can resize the window.
- Let‘s define the gray area between blue line above and  the orange area as `Flash area`.
  - You can move the window by drag the `Flash area`.
  - Double click on the `Flash area` will hide the window.
  - Right click on the `Flash area` will copy the translated result to clipboard.

![1528452758866](./screenshot/newfocus.png)

### Highlights
#### Multi segments Co-translation

![entoch](./screenshot/entoch.png)

![chtoen](./screenshot/chtoen.png).


## Acknowledgements

Thanks to the developers of [wxpython](https://wxpython.org/), [googletrans](https://github.com/ssut/py-googletrans), [pyperclip](https://github.com/asweigart/pyperclip) and my dear schoolmates.

## License

The code is licensed under Mozilla Public License 2.0. For more details, read the [LICENSE](./LICENSE) file.
