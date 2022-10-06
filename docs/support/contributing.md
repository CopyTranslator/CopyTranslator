---
sidebarDepth: 6
---

# 参与贡献

## 编译源码

### 项目结构
- dist_electron: 编译的输出
- dist_locales: 翻译文件
- docs: 本文档的源码

### 编译环境要求
- Nodejs v12
- yarn v1 # 不要使用v2

对于windows用户, 你需要先执行`yarn global add windows-build-tools`.
```bash
git clone https://github.com/copytranslator/CopyTranslator.git
cd CopyTranslator
yarn
yarn rebuild
```
要调试和运行程序：
```bash
npm run electron:serve
```
要编译为可分发的程序：
```bash
npm run electron:build
```
按照上述说明操作时，程序能运行，但是翻译引擎不工作，这说明您的配置已经成功了，这是完全正常的，因为copytranslator依赖的opentranslate版本与开源版本opentranslate不完全一样。

如果您是想编译了自己使用，请直接在设置中填入各个翻译引擎的api key使用。

如果您想参与到copytranslator的跨平台移植当中，造福其他人，请联系我，我会指导您如何编译。


## Locale settings
Using my own l10n module, for memory saving purpose. 
### For locale maintainers
If you want to add a new locale, follow the instructions below.

> view `json` files under `dist_locales` to see the format of the locale file, fork the repo and add a new `{{locale}}.json` file under the directory, and create a pull request.

Welcome to join the `gitter` chat room at [here](https://gitter.im/CopyTranslator/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link), so you can get notified before new version release. You can create a pull request at any time as **the out of date locale file won't cause any error**, the program will go back to English for the missing words.
