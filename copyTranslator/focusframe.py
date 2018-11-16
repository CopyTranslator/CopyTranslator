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
from copyTranslator.mypanel import MyPanel


class FocusFrame(wx.Frame):
    subStyle = wx.DEFAULT_FRAME_STYLE ^ wx.CAPTION

    def __init__(self, setting):
        wx.Frame.__init__(self, None, -1, 'CopyTranslator -Focus Mode',
                          size=(465, 300))
        self.SetIcon(wx.Icon(logopath, wx.BITMAP_TYPE_ICO))
        self.SetWindowStyle(FocusFrame.subStyle)
        self.setting = setting
        self.config = setting.config
        self.panel = MyPanel(self)
        sizer = wx.BoxSizer(wx.VERTICAL)
        sizer.Add((-1, 15))
        self.destText = ColoredCtrl(self.panel, -1)  # 创建一个文本控件
        self.font = self.destText.GetFont()
        self.font.SetPixelSize((0, self.setting.font_size))
        self.destText.SetFont(self.font)

        sizer.Add(self.destText, -1, wx.EXPAND)

        self.panel.SetSizer(sizer)
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
