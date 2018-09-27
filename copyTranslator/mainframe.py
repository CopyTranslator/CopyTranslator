# -*- coding: utf-8 -*-
# @Time    : 2018/9/25 0025 17:52
# @Author  : Elliott Zheng
# @FileName: mainframe.py
# @Software: PyCharm


import wx
import wx.adv
from googletrans import LANGCODES

from copyTranslator.constant import *


class MainFrame(wx.Frame):
    mainStyle = wx.DEFAULT_FRAME_STYLE ^ wx.RESIZE_BORDER ^ wx.MAXIMIZE_BOX

    def __init__(self, setting):
        langList = list(LANGCODES.keys())
        wx.Frame.__init__(self, None, -1, project_name + ' ' + version,
                          size=(465, 385))

        self.SetIcon(wx.Icon(logopath, wx.BITMAP_TYPE_ICO))
        self.SetWindowStyle(MainFrame.mainStyle)
        self.setting = setting
        TextPanel = wx.Panel(self, -1)
        buttonPanel = wx.Panel(self, -1)

        # 始终置顶按钮
        self.topCheck = wx.CheckBox(buttonPanel, -1, 'Stay on top')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseStayTop, self.topCheck)

        # 自动检测语言按钮
        self.detectCheck = wx.CheckBox(buttonPanel, -1, 'Auto detect language')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseDete, self.detectCheck)

        # 监听剪贴板选框
        self.listenCheck = wx.CheckBox(buttonPanel, -1, 'Listen on Clipboard')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseListen, self.listenCheck)

        # 自动复制选框
        self.copyCheck = wx.CheckBox(buttonPanel, -1, 'Auto copy')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseCopy, self.copyCheck)

        # 连续复制模式
        self.continusCheck = wx.CheckBox(buttonPanel, -1, 'Incremental Copy')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseContinus, self.continusCheck)

        # 连续复制模式
        self.dictCheck = wx.CheckBox(buttonPanel, -1, 'Smart dict')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseDict, self.dictCheck)

        # 切换模式
        self.switchBtn = wx.Button(buttonPanel, -1, "Switch Mode")
        self.Bind(wx.EVT_BUTTON, self.setting.SwitchMode, self.switchBtn)

        self.transBtn = wx.Button(buttonPanel, -1, "Translate")
        self.Bind(wx.EVT_BUTTON, self.setting.translateCtrl, self.transBtn)
        self.transBtn.SetDefault()

        # 原文本
        self.srcLabel = wx.StaticText(TextPanel, -1, "Source:")
        self.srcText = wx.TextCtrl(TextPanel, -1, "", size=(300, 150), style=wx.TE_MULTILINE)  # 创建一个文本控件

        self.copyBtn = wx.Button(buttonPanel, -1, "Copy result")
        self.Bind(wx.EVT_BUTTON, self.setting.Copy, self.copyBtn)

        # 目标文本
        self.dstLabel = wx.StaticText(TextPanel, -1, "Result:")
        self.destText = wx.TextCtrl(TextPanel, -1, "", size=(300, 150),
                                    style=wx.TE_MULTILINE)  # 创建一个文本控件

        self.fromlabel = wx.StaticText(buttonPanel, -1, 'Source language')

        self.fromchoice = wx.Choice(buttonPanel, -1, choices=langList)

        self.fromchoice.SetSelection(self.fromchoice.FindString(self.setting.source))

        tolabel = wx.StaticText(buttonPanel, -1, 'Target language :')
        self.tochoice = wx.Choice(buttonPanel, -1, choices=langList)
        self.tochoice.SetSelection(self.tochoice.FindString(self.setting.target))

        panel1sizer = wx.FlexGridSizer(4, 1, 6, 0)
        panel1sizer.AddMany([self.srcLabel, self.srcText, self.dstLabel, self.destText])

        TextPanel.SetSizer(panel1sizer)

        panel2sizer = wx.FlexGridSizer(13, 1, 6, 0)
        panel2sizer.AddMany(
            [self.topCheck, self.listenCheck, self.copyCheck, self.dictCheck, self.continusCheck, self.detectCheck,
             self.fromlabel,
             self.fromchoice,
             tolabel, self.tochoice, self.switchBtn, self.transBtn, self.copyBtn])
        buttonPanel.SetSizer(panel2sizer)

        sizer = wx.FlexGridSizer(1, 2, 0, 0)
        sizer.AddMany([TextPanel, buttonPanel])

        self.SetSizer(sizer)
        self.Fit()

        # 创建定时器
        self.timer = wx.Timer(self)  # 创建定时器
        self.Bind(wx.EVT_TIMER, self.setting.OnTimer, self.timer)  # 绑定一个定时器事件

        # 绑定事件
        self.Bind(wx.EVT_CLOSE, self.OnClose)
        self.Bind(wx.EVT_ICONIZE,
                  self.OnIconfiy)  # 窗口最小化时，调用OnIconfiy,注意Wx窗体上的最小化按钮，触发的事件是 wx.EVT_ICONIZE,而根本就没有定义什么wx.EVT_MINIMIZE,但是最大化，有个wx.EVT_MAXIMIZE。

    def OnHide(self, event):
        self.Hide()
        event.Skip()

    def OnIconfiy(self, event):
        self.Hide()
        event.Skip()

    def OnClose(self, event):
        self.setting.save_config()
        self.setting.taskbar.Destroy()
        self.setting.subFrame.Destroy()
        self.Destroy()
