---
sidebarDepth: 6
---
# 使用技巧
这里是一些CopyTranslator的使用技巧

## GalGame机翻技巧


在我们游玩[文字冒险游戏](https://baike.baidu.com/item/%E6%96%87%E5%AD%97%E5%86%92%E9%99%A9%E6%B8%B8%E6%88%8F/10736665)，例如GalGame，视觉小说(Visual Novel)时，我们经常会需要啃生肉，阅读英文或者日语可太痛苦了，即使我们懂外语，但是面对一大段一大段的外文，读起来也很费劲，怎么办呢？

游戏里面的文字又不像网页或者word可以直接复制，一个直接的方法就是我们用[OCR](https://baike.baidu.com/item/OCR%E6%96%87%E5%AD%97%E8%AF%86%E5%88%AB/10392860)，把游戏截图转换成文字，然后再用翻译软件翻译。这就是[团子翻译器](https://translator.dango.cloud/)做的事哈，他依然是一个非常好的解决方案。

但是，使用OCR来提取文本的问题就是
1. 它是个比较耗时的步骤，一般在线OCR，或者是离线OCR都需要比较长的时间，更别提在线OCR一般是需要付费的，而离线OCR对计算机性能的要求比较高。
2. 它不一定准确，可能会误识别。

下面我将介绍一个使用技巧，copytranslator配合Textractor来提取游戏中的文本能够让你畅玩大部分生肉文字冒险游戏时无比丝滑。

效果如下面的GIF所示，随着鼠标的点击，游戏中文本发生了改变，右边窗口的Textractor捕获到游戏中的文本，并将其传递到剪贴板当中交给copytranslator翻译。所以你只需要照常玩游戏，其他的啥也不用干，就能够看到快速准确的翻译啦。

![这是一个GIF，比较大，请耐心等待加载](/gal.gif)

其原理如下：

[Textractor](https://github.com/Artikash/Textractor/releases)是一个开源的视频游戏文本钩子，适用于Windows 7以上，它的作用在于它能够自动从游戏当中提取出当前的文本，然后复制到剪贴板当中。

一旦游戏文本被复制到剪贴板，后面的翻译就完全交给copytranslator了。这种获取游戏文本的方式又快又准确，十分的方便，而且完全自动化。

**原理非常的简单，详细教程请参考 [柒年灬良辰](https://space.bilibili.com/84047170)制作的[视频教程](https://www.bilibili.com/video/BV1V54y1p7CN/)**



::: tip
对于基于新版本[Ren'Py](https://www.renpy.org/)制作的游戏（很多欧美的视觉小说都是用这个)，你甚至可能不需要使用Textractor就可以把游戏文本提取到剪贴板当中。
最近 Ren'Py 添加了一个辅助功能菜单，其中一项新功能是用于自动配音的附加选项。 一个选项允许您将文本复制到剪贴板以在文本转语音程序中使用，那么如果你正运行copytranslator，就可以轻松实现翻译。

您可以通过辅助功能菜单（按 A）或按 Shift + C 打开复制到剪贴板。

对于没有此功能的旧版 Ren'Py 游戏，您可以尝试[通过Ren'Py SDK运行它们](https://www.youtube.com/watch?v=WUv8TbRs9Nk)，以使用较新版本引擎的功能。（这适用于大多数 Ren'Py 游戏，但非常古老和/或有很多自定义代码的游戏除外，不过那些游戏你可以用 Textractor）

:::

这个技巧，有许多同学都发现了，并做了一些指南，大家可以自行查阅。
- [【机翻小攻略】Textaractor + Copytranslator实现机翻效果](https://www.bilibili.com/video/BV1V54y1p7CN/) by [柒年灬良辰](https://space.bilibili.com/84047170)
- [机翻galgame新姿势](https://www.jianshu.com/p/a2284e450d5d) by [_骤雨](https://www.jianshu.com/u/78dc09ce11af)

- [How to text hook & translate Ren'Py games](https://www.reddit.com/r/vns/comments/ru4yj3/how_to_text_hook_translate_renpy_games/)
- [Textractor 图文教程](https://www.vikacg.com/p/99232.html)