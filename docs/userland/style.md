---
sidebarDepth: 6
---
# 样式
## 使用方法
您可以通过修改[配置目录](/guide/questions.html#copytranslator%E7%9A%84%E9%85%8D%E7%BD%AE%E7%9B%AE%E5%BD%95%E5%9C%A8%E5%93%AA%E9%87%8C)下的`styles.css`文件来自定义`CopyTranslator`的界面风格，样式。

可以修改的属性包括但不限于：字体，颜色，背景，边框。

可以自定义的部分包括但不限于：两大模式的结果框，设置框，状态栏的样式。
::: tip
CSS文件的编写可以参考[HTML中文网](https://www.html.cn/book/css/all-properties.html)。欢迎大家分享自己编写的`style.css`文件。
:::

## 默认样式
```css
.focusText {
    /*modify the style of the focus result textarea*/
    font-family: Monaco; /*设置专注模式的字体为 Monaco*/
}

.contrastText {
    /*modify the style of the contrast src and result textarea*/

}

.contrast {
    /*modify the style of the contrast mode panel*/
}

```

## 样式库
### Default
#### 简介
- 作者：[Elliott Zheng](https://github.com/elliottzheng)
- 源码：[Github](https://raw.githubusercontent.com/CopyTranslator/CopyTranslator/4edc7970231246832e3415cf9d8450ff070b1b1d/src/styles.css)
- 说明：就是默认的，没有什么花里胡哨的
#### 截图
![](https://s2.ax1x.com/2019/03/08/ASEXHx.png)



