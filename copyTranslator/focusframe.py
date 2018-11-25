# -*- coding: utf-8 -*-
# @Time    : 2018/9/25 0025 17:52
# @Author  : Elliott Zheng
# @FileName: focusframe.py
# @Software: PyCharm

import win32con
import wx
import wx.adv

from copyTranslator.color_ctrl import ColoredCtrl
from copyTranslator.constant import *
from copyTranslator.googletranslator import GoogleLangList as langList
from copyTranslator.mypanel import MyPanel


class TextDropTarget(wx.TextDropTarget):
    def __init__(self, setting):
        super(TextDropTarget, self).__init__()
        self.setting = setting

    def OnDropText(self, x, y, data):
        self.setting.outsideTranslate(data)
        return True


class FocusFrame(wx.Frame):
    subStyle = wx.DEFAULT_FRAME_STYLE ^ wx.CAPTION

    def __init__(self, setting):
        wx.Frame.__init__(self, None, -1, 'CopyTranslator -Focus Mode',
                          size=(465, 300))
        self.SetIcon(wx.Icon(logopath, wx.BITMAP_TYPE_ICO))
        self.SetWindowStyle(FocusFrame.subStyle)
        self.setting = setting
        self.config = setting.config
        self.lang = self.setting.lang
        self.panel = MyPanel(self, self.setting)

        sizer = wx.BoxSizer(wx.VERTICAL)
        sizer.Add((-1, 15))
        self.destText = ColoredCtrl(self.panel, -1)  # 创建一个文本控件
        dropTarget = TextDropTarget(self.setting)
        self.destText.SetDropTarget(dropTarget)
        self.font = self.destText.GetFont()
        self.font.SetPixelSize((0, self.setting.font_size))
        self.destText.SetFont(self.font)

        sizer.Add(self.destText, -1, wx.EXPAND)

        self.panel.SetSizer(sizer)

        #########################################
        self.buttonPanel = wx.Panel(self, -1)

        # 始终置顶按钮
        self.topCheck = wx.CheckBox(self.buttonPanel, -1, self.lang('Stay on Top'))
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseStayTop, self.topCheck)

        # 自动检测语言按钮
        self.detectCheck = wx.CheckBox(self.buttonPanel, -1, self.lang('Detect Language'))
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseDete, self.detectCheck)

        # 监听剪贴板选框
        self.listenCheck = wx.CheckBox(self.buttonPanel, -1, self.lang('Listen on Clipboard'))
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseListen, self.listenCheck)

        # 自动复制选框
        self.copyCheck = wx.CheckBox(self.buttonPanel, -1, self.lang('Auto Copy'))
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseCopy, self.copyCheck)

        # 连续复制模式
        self.continusCheck = wx.CheckBox(self.buttonPanel, -1, self.lang('Incremental Copy'))
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseContinus, self.continusCheck)

        # 连续复制模式
        self.dictCheck = wx.CheckBox(self.buttonPanel, -1, self.lang('Smart Dict'))

        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseDict, self.dictCheck)

        self.fromlabel = wx.StaticText(self.buttonPanel, -1, self.lang('Source Language'))

        self.fromchoice = wx.Choice(self.buttonPanel, -1, choices=langList)

        self.fromchoice.SetSelection(self.fromchoice.FindString(self.setting.source))

        tolabel = wx.StaticText(self.buttonPanel, -1, self.lang('Target Language'))
        self.tochoice = wx.Choice(self.buttonPanel, -1, choices=langList)
        self.tochoice.SetSelection(self.tochoice.FindString(self.setting.target))

        panel2sizer = wx.FlexGridSizer(10, 1, 6, 0)

        panel2sizer.Add(self.topCheck, -1, wx.ALIGN_CENTER)
        panel2sizer.Add(self.listenCheck, -1, wx.ALIGN_CENTER)
        panel2sizer.Add(self.copyCheck, -1, wx.ALIGN_CENTER)
        panel2sizer.Add(self.dictCheck, -1, wx.ALIGN_CENTER)
        panel2sizer.Add(self.continusCheck, -1, wx.ALIGN_CENTER)
        panel2sizer.Add(self.detectCheck, -1, wx.ALIGN_CENTER)
        panel2sizer.Add(self.fromlabel, -1, wx.ALIGN_CENTER)
        panel2sizer.Add(self.fromchoice, -1, wx.ALIGN_CENTER)
        panel2sizer.Add(tolabel, -1, wx.ALIGN_CENTER)
        panel2sizer.Add(self.tochoice, -1, wx.ALIGN_CENTER)

        self.buttonPanel.SetSizer(panel2sizer)
        self.buttonPanel.Bind(wx.EVT_LEFT_DCLICK, self.OnLeftDClick)

        ########################################

        self.sizer = wx.FlexGridSizer(1, 2, 0, 0)
        self.sizer.Add(self.panel, -1, wx.EXPAND)
        self.sizer.Add(self.buttonPanel, -1, wx.EXPAND)
        self.sizer.AddGrowableCol(0, 0)
        self.sizer.AddGrowableRow(0, 0)

        self.SetSizer(self.sizer)
        self.Fit()

        # 绑定事件
        self.Bind(wx.EVT_CLOSE, self.OnClose)
        self.Bind(wx.EVT_ICONIZE,
                  self.OnIconfiy)  # 窗口最小化时，调用OnIconfiy,注意Wx窗体上的最小化按钮，触发的事件是 wx.EVT_ICONIZE,而根本就没有定义什么wx.EVT_MINIMIZE,但是最大化，有个wx.EVT_MAXIMIZE。
        self.regHotKey()
        self.Bind(wx.EVT_HOTKEY, self.setting.BossKey, id=self.hotKeyId)
        self.Bind(wx.EVT_HOTKEY, self.setting.ChangeMode, id=self.hotKeyId2)
        self.Bind(wx.EVT_HOTKEY, self.onFontPlus, id=self.hotKeyId3)
        self.Bind(wx.EVT_HOTKEY, self.onFontMinus, id=self.hotKeyId4)

        self.Show(False)

        self.Bind(wx.EVT_ACTIVATE, self.setting.AutoHide)

    def OnLeftDClick(self, evt):
        self.buttonPanel.Hide()
        self.SetSize(self.panel.GetSize())


    def regHotKey(self):
        """
        This function registers the hotkey Shift+F1 with id=100
        """
        self.hotKeyId = wx.NewId()
        self.RegisterHotKey(
            self.hotKeyId,  # a unique ID for this hotkey
            win32con.MOD_SHIFT,  # the modifier key
            win32con.VK_F1)  # the key to watch for shift+F1

        self.hotKeyId2 = wx.NewId()
        self.RegisterHotKey(
            self.hotKeyId2,  # a unique ID for this hotkey
            win32con.MOD_SHIFT,  # the modifier key
            win32con.VK_F2)  # the key to watch for shift+F1

        self.hotKeyId3 = wx.NewId()
        self.RegisterHotKey(
            self.hotKeyId3,  # a unique ID for this hotkey
            win32con.MOD_SHIFT,  # the modifier key
            win32con.VK_F4)  # the key to watch for shift+F4

        self.hotKeyId4 = wx.NewId()
        self.RegisterHotKey(
            self.hotKeyId4,  # a unique ID for this hotkey
            win32con.MOD_SHIFT,  # the modifier key
            win32con.VK_F3)  # the key to watch for shift+F3

    def onFontPlus(self, event):
        self.font = self.font.Scaled(1.25)
        self.config.font_size = self.font.GetPixelSize()[1]
        self.destText.SetFont(self.font)

    def onFontMinus(self, event):
        self.font = self.font.Scaled(0.8)
        self.config.font_size = self.font.GetPixelSize()[1]
        self.destText.SetFont(self.font)

    def OnHide(self, event):
        self.Hide()

    def OnIconfiy(self, event):
        self.Hide()
        event.Skip()

    def OnClose(self, event):
        self.Hide()
