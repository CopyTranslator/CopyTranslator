## Project structure
- src
    - core  : anything about translation and string process
    - tools : anything
    - views : vue view
    - components : vue components

## Build from source
```bash
npm install 
npm run electron:build 
```

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

### Locale settings system

Using my own l10n module, for memory saving purpose. If you want to add a new locale, follow the instructions below.

> view `json` files under `dist_locales` to see the format of the locale file, fork the repo and add a new `{{locale}}.json` file under the directory, and create a pull request.

As I can't maintain all the locales myself, so the latest locales(except `en` and `zh-cn`) may not be released with the new version of `CopyTranslator`.  You can download the latest `{{locale}}.json` file from `dist_locales`, and place it under `{{userDir}}/copytranslator/locales`，`CopyTranslator` will detect them on startup, then you can choose on settings panel.

### Context menu system
For both focus mode, contrast mode, and tray, we generate menu on real time. they share the same `BaseMenu` object, but the content of the menu can be different according to the context.
