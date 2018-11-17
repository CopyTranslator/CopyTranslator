# -*- coding: utf-8 -*-
# @Time    : 2018/10/10 0010 17:54
# @Author  : Elliott
# @FileName: writingframe.py
# @Software: PyCharm


import win32con
import wx
import wx.adv

from copyTranslator.color_ctrl import ColoredCtrl
from copyTranslator.constant import *
from copyTranslator.googletranslator import GoogleLangList as langList
from copyTranslator.mypanel import MyPanel


class WritingFrame(wx.Frame):
    subStyle = wx.DEFAULT_FRAME_STYLE ^ wx.CAPTION

    def __init__(self, setting):
        wx.Frame.__init__(self, None, -1, 'CopyTranslator -Writing Mode',
                          size=(wx.DisplaySize()[0], 300))
        self.SetIcon(wx.Icon(logopath, wx.BITMAP_TYPE_ICO))
        self.SetWindowStyle(WritingFrame.subStyle)
        self.setting = setting
        self.lang = self.setting.lang
        self.panel = MyPanel(self)
        self.small_panel = MyPanel(self.panel)
        self.mainSizer = wx.BoxSizer(wx.VERTICAL)
        self.mainSizer.Add((-1, 15))
        self.sizer = wx.BoxSizer(wx.HORIZONTAL)
        self.sizer.Add((-1, 15))
        self.srcTest = ColoredCtrl(self.small_panel, -1, setting=self.setting)  # 这个一开始是没有添加的
        self.destText = ColoredCtrl(self.small_panel, -1, setting=self.setting)  # 创建一个文本控件
        self.btnPanel = MyPanel(self.small_panel)
        self.btnSizer = wx.BoxSizer(wx.VERTICAL)

        self.fromlabel = wx.StaticText(self.btnPanel, -1, self.lang('Source Language'))

        self.fromchoice = wx.Choice(self.btnPanel, -1, choices=langList)

        self.fromchoice.SetSelection(self.fromchoice.FindString(self.setting.source))

        tolabel = wx.StaticText(self.btnPanel, -1, self.lang('Target Language'))
        self.tochoice = wx.Choice(self.btnPanel, -1, choices=langList)
        self.tochoice.SetSelection(self.tochoice.FindString(self.setting.target))

        self.transBtn = wx.Button(self.btnPanel, -1, self.lang("Translate"))
        # self.Bind(wx.EVT_BUTTON, self.showSourcePanel, self.transBtn)
        self.transBtn.SetDefault()

        self.font = self.destText.GetFont()
        self.font.SetPixelSize((0, self.setting.font_size))
        self.destText.SetFont(self.font)

        self.btnSizer.Add(self.fromlabel, -1, wx.EXPAND)
        self.btnSizer.Add(self.fromchoice, -1, wx.EXPAND)
        self.btnSizer.Add(tolabel, -1, wx.EXPAND)
        self.btnSizer.Add(self.tochoice, -1, wx.EXPAND)
        self.btnSizer.Add(self.transBtn, -1, wx.EXPAND)

        self.btnPanel.SetSizer(self.btnSizer)
        self.btnPanel.SetSize(50, -1)

        self.sizer.Add(self.srcTest, -1, wx.EXPAND)
        self.sizer.Add(self.btnPanel, 0, wx.SHAPED)
        self.sizer.Add(self.destText, -1, wx.EXPAND)
        self.small_panel.SetSizer(self.sizer)

        self.mainSizer.Add(self.small_panel, -1, wx.EXPAND)
        self.panel.SetSizer(self.mainSizer)

        # 绑定事件
        self.Bind(wx.EVT_CLOSE, self.OnClose)
        self.Bind(wx.EVT_ICONIZE,
                  self.OnIconfiy)  # 窗口最小化时，调用OnIconfiy,注意Wx窗体上的最小化按钮，触发的事件是 wx.EVT_ICONIZE,而根本就没有定义什么wx.EVT_MINIMIZE,但是最大化，有个wx.EVT_MAXIMIZE。
        self.regHotKey()
        self.Bind(wx.EVT_HOTKEY, self.setting.BossKey, id=self.hotKeyId)
        self.Bind(wx.EVT_HOTKEY, self.setting.ChangeMode, id=self.hotKeyId2)
        self.Bind(wx.EVT_HOTKEY, self.onFontPlus, id=self.hotKeyId3)
        self.Bind(wx.EVT_HOTKEY, self.onFontMinus, id=self.hotKeyId4)

    # def showSourcePanel(self,event):
    #     self.sizer.Hide(self.srcTest)
    #     self.btnPanel.Hide()
    #     self.sizer.Layout()

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
        self.setting.font_size = self.font.GetPixelSize()[1]
        self.destText.SetFont(self.font)

    def onFontMinus(self, event):
        self.font = self.font.Scaled(0.8)
        self.setting.font_size = self.font.GetPixelSize()[1]
        self.destText.SetFont(self.font)

    def OnHide(self, event):
        self.Hide()

    def OnIconfiy(self, event):
        self.Hide()
        event.Skip()

    def OnClose(self, event):
        self.Hide()
