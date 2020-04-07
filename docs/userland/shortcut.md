---
sidebarDepth: 6
---
# 全局快捷键
## 使用方法
对于大多数[动作](#动作系统)，您可以通过修改[配置目录](/guide/questions.html#copytranslator%E7%9A%84%E9%85%8D%E7%BD%AE%E7%9B%AE%E5%BD%95%E5%9C%A8%E5%93%AA%E9%87%8C)下的`shortcut.json`来绑定全局快捷键。

::: warning
当快捷键已被其他应用程序占用时，绑定将失败。
:::
每条记录的形式为：`action:accelerator`。

## 默认快捷键定义
```json
{
"listenClipboard": "CommandOrControl+J"
}
```

## 快捷键设置库

### Default
#### 简介
- 作者：[Elliott Zheng](https://github.com/elliottzheng)
- 源码：[Github](https://github.com/CopyTranslator/CopyTranslator/blob/4edc7970231246832e3415cf9d8450ff070b1b1d/src/shortcuts.json)
- 描述：将切换监听剪贴板的动作绑定到快捷键`CommandOrControl+J`



