# -*- coding: utf-8 -*-
# @Time    : 2018/9/25 0025 11:30
# @Author  : Elliott Zheng
# @FileName: color.py
# @Software: PyCharm


import wx
from copyTranslator.color_ctrl import ColoredCtrl
from copyTranslator.youdao import YoudaoSpider


class F(wx.Frame):
    def __init__(self):
        wx.Frame.__init__(self, None, size=(500, 500))
        self.status_area = ColoredCtrl(self, -1,
                                       pos=(10, 270),
                                       size=(300, 300))
        test = YoudaoSpider()
        result = self.status_area.show_result(test.get_result("come to"))


app = wx.PySimpleApp()
f = F()
f.Show()
app.MainLoop()
