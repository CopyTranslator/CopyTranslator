---
sidebarDepth: 6
---

# 参与贡献

## Project structure
- dist_electron: the output of `npm run electron:build`
- dist_locales: the locale files
- docs: source of documentation [copytranslator.gitee.io](https://copytranslator.gitee.io/)
- src
    - core: anything about translation and string process
    - tools: anything
    - views: vue view
    - components: vue components

## Build from source
For windows users, you need to `yarn global add windows-build-tools` first.
```bash
yarn global add element-theme
```
```bash
git clone https://github.com/copytranslator/CopyTranslator.git
cd CopyTranslator
yarn
yarn electron:build
```

## 请注意


## Locale settings
Using my own l10n module, for memory saving purpose. 
### For locale maintainers
If you want to add a new locale, follow the instructions below.

> view `json` files under `dist_locales` to see the format of the locale file, fork the repo and add a new `{{locale}}.json` file under the directory, and create a pull request.

Welcome to join the `gitter` chat room at [here](https://gitter.im/CopyTranslator/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link), so you can get notified before new version release. You can create a pull request at any time as **the out of date locale file won't cause any error**, the program will go back to English for the missing words.


## Documentation Development
```bash
yarn global add vuepress
yarn docs:dev
```

## Publish Documentation
Make sure you are Elliott Zheng 
```bash
npm run docs:build
npm run docs:deploy
```