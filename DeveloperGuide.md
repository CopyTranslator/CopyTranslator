## Project structure
- src
    - core: anything about translation and string process
    - tools:


## Conpoments
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


