# CopyTranslator 

[中文 Chinese](./README_zh.md)

## User manual for Windows users.

Copy, Translate, and Paste with Google translate API.

### Project Homepage

https://github.com/elliottzheng/CopyTranslator

### Install
1. Download the latest build for Windows from 
   - [Github Releases](https://github.com/elliottzheng/CopyTranslator/releases) 
   - Latest builds on master:[![Download](https://api.bintray.com/packages/elliottzheng/CopyTranslator/CopyTranslator/images/download.svg) ](https://bintray.com/elliottzheng/CopyTranslator/CopyTranslator/_latestVersion)
2. Run the `shortcut.bat` in the program directory, it will create a shortcut on you desktop.
### Usage
There are two frame modes you can choose from.

- Main mode
- Focus mode

You can switch mode by the menu of taskbar icon.

**Global hot key**: `Shift+F1`, you can use it to iconize the and restores the `CopyTranslator`.

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

  ![win10.png](./screenshot/screenshot.png)
#### Focus Mode

Focus mode provides only a result frame, for you to focus on the result better. (Remember to check the `Listen to Clipboard` and `Stay on top` options.)

You can resize it freely.

- Drag the orange (or color of your theme) area at the top of the window, or the border can resize the window.
- You can move the window by drag the gray area between blue line above and  the orange area.

![1528452758866](./screenshot/newfocus.png)

### Highlights
#### Multi segment Co-translation

![entoch](./screenshot/entoch.png)

![chtoen](./screenshot/chtoen.png).


## Acknowledgements

Thanks to the developers of [wxpython](https://wxpython.org/), [googletrans](https://github.com/ssut/py-googletrans), [pyperclip](https://github.com/asweigart/pyperclip) and my dear schoolmates.

## License

The code is licensed under Mozilla Public License 2.0. For more details, read the [LICENSE](./LICENSE) file.
