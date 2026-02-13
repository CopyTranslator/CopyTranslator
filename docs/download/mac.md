# Mac
::: tip 提示
- **下面的链接是到Github Release下载，如果你无法下载的话，可以尝试其他下载源**

**其他下载源**
1. Github Release下载加速：[网站1](https://doget.nocsdn.com/#/), [网站2](https://d.serctl.com/)
2. [码云 Gitee](https://gitee.com/ylzheng/CopyTranslator/releases)
3. [蓝奏云](https://elliottzheng.lanzouy.com/b0bhgluri): 密码:7m52
::: 

## 下载前必读

- **初次打开后请手动允许copytranslator使用辅助功能以及屏幕录制([点击查看示意图](#设置示意图))，否则copytranslator将无法正常使用拖拽复制，自动粘贴等功能。[设置后仍有问题？点这里](#设置后仍有问题)**

- mac-zip 版本如果无法启动，请尝试下载dmg版本，安装完成后，打开安全性与隐私，通用，允许打开这个app

<FromMD source="/wiki/mac.md"/>

#### 设置示意图
[设置后仍有问题？点这里](#设置后仍有问题)
![](https://s2.ax1x.com/2019/03/10/ApT0YT.png)
![](/images/access.png)
![](/images/record.png)

#### 设置后仍有问题？

应用程序需要申请安全与隐私里的辅助功能权限，在辅助功能里明明已经授权了，但是app总是获取不到权限。

尝试过重新授权、重启都无效。

解决办法是重置 Accessibility permissions：
`sudo tccutil reset Accessibility`

这条命令会将所有需要辅助功能权限的应用重新授权，原来授权无效的app也可以正常授权了。

[参考链接](https://blog.csdn.net/nicekwell/article/details/117768278)