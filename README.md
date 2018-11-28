![logo](./logo.png)

# CopyTranslator 

[中文 Chinese](https://github.com/elliottzheng/CopyTranslator/wiki)

## User manual for Windows users.

Foreign Paper Reading and Translation Asistant. (Latest: v0.0.7-Kylin-RC0)

### Warning
**Due to the mechanism change of google translate, versions before v0.0.5.2 is no longer valid, I had fixed it in v0.0.5.3, Please update to the latest version.**


#### v0.0.6.0 Comprehensively Empower the Focus Mode

1. **`Youdao` smart dictionary**(based on API provided by [Youdao](https://github.com/longcw/youdao)), sentences with words less than 3 will be view as phrase or word, you will see a more detailed explanations in `Focus Mode`. Check the `Smart Dict ` option to enable it. 

   **Note: It is limited to the languages `Youdao` supported , but you don't need and cannot  manually choose language.**

   ![1537871607106](assets/1537871607106.png)

   ![1537871905985](assets/1537871905985.png)

2. **Font resizable**, use `shift+F3` and `shift+F4`  to resize the font size of `Focus Mode`

   ![1537871658665](assets/1537871658665.png)


3. **Config memorization**, your config will be save in the disk, and auto reload on the next start.

4. `'Incremental Copy`, append the copied text to the source other than replace it, especially useful when the paragraph is separated in different page. Check the `'Incremental Copy ` option to enable it.

5. **Copy source**, you can copy the source by the menu of  the taskbar icon.

   ![1537871871793](assets/1537871871793.png)

6. Less sensitive, increase the response time of long press copy to 0.3s.

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

Thanks to the developers of [wxpython](https://wxpython.org/), [googletrans](https://github.com/ssut/py-googletrans), [pyperclip](https://github.com/asweigart/pyperclip) ,[Youdao](https://github.com/longcw/youdao) and my dear schoolmates.

## License

The code is licensed under Mozilla Public License 2.0. For more details, read the [LICENSE](./LICENSE) file.
