---
sidebarDepth: 6
---

# 参与贡献

## Project structure
- dist_electron: the output of `npm run electron:build`
- dist_locales: the locale files
- src
    - core: anything about translation and string process
    - tools: anything
    - views: vue view
    - components: vue components
    - docs: source of documentation [copytranslator.github.io](https://copytranslator.github.io/)

## Build from source
You need to install `node-gyp` and `windows-build-tools`(for windows users) globally first.
```bash
git clone --recursive https://github.com/copytranslator/CopyTranslator.git
cd CopyTranslator
npm install 
npm run rebuild
npm run electron:build 
```


## Locale settings
Using my own l10n module, for memory saving purpose. 
### For locale maintainers
If you want to add a new locale, follow the instructions below.

> view `json` files under `dist_locales` to see the format of the locale file, fork the repo and add a new `{{locale}}.json` file under the directory, and create a pull request.

Welcome to join the `gitter` chat room at [here](https://gitter.im/CopyTranslator/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link), so you can get notified before new version release. You can create a pull request at any time as **the out of date locale file won't cause any error**, the program will go back to English for the missing words.

### For normal users
As I can't maintain all the locales myself, so the latest locales(except `en` and `zh-cn`) may not be released with the new version of `CopyTranslator`. For now, you can download the latest `{{locale}}.json` file from `dist_locales`, and place it under `{{userDir}}/copytranslator/locales`，`CopyTranslator` will detect them on startup, then you can choose them on settings panel.

## Components
### BrowserWindow Control System
In main process
```ts
import { windowController } from "../tools/windowController";
windowController.bind();
```
In render process

```vue
<template>
    <div v-on:dblclick="minify" v-on:mousedown="bindDrag" ></div>
</template>

<script>
import WindowController from "./WindowController";
export default {
  mixins: [WindowController]
};
</script>
```



### Context menu system
For both focus mode, contrast mode, and tray, we generate menu on real time. they share the same `BaseMenu` object, but the content of the menu can be different according to the context.


## Publish Documentation
Make sure you are Elliott Zheng 
```bash
npm run docs:build
npm run docs:deploy
```