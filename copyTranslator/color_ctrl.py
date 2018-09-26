# -*- coding: utf-8 -*-
# @Time    : 2018/9/25 0025 14:38
# @Author  : Elliott Zheng
# @FileName: color_ctrl.py
# @Software: PyCharm

import wx

from copyTranslator.youdao import YoudaoSpider


class Color:
    magenta = (255, 0, 255)
    red = (255, 0, 0)
    blue = (0, 0, 255)
    black = (0, 0, 0)


class ColoredCtrl(wx.TextCtrl):
    ERROR = 0
    WORD = 1

    def __init__(self, parent=None, id=None, style=0):
        if style == 0:
            style = wx.TE_RICH2 | wx.TE_MULTILINE | wx.TE_READONLY
        super(ColoredCtrl, self).__init__(parent=parent, id=id, style=style)

    def ColoredAppend(self, text, color):
        style = self.GetDefaultStyle()
        color = wx.Colour(color[0], color[1], color[2])
        new_style = wx.TextAttr(color)
        self.SetDefaultStyle(new_style)
        self.AppendText(text)
        self.SetDefaultStyle(style)

    def show_word(self, result):
        """
        展示查询结果
        :param result: 与有道API返回的json 数据结构一致的dict
        """
        self.Clear()
        self.ColoredAppend('[%s]\n' % result['query'], Color.magenta)
        if 'basic' in result:
            if 'us-phonetic' in result['basic']:
                self.ColoredAppend('American:', Color.blue), self.ColoredAppend(
                    '[%s]\t' % result['basic']['us-phonetic'],
                    Color.black),
            if 'uk-phonetic' in result['basic']:
                self.ColoredAppend('English:', Color.blue), self.ColoredAppend(
                    '[%s]\t' % result['basic']['uk-phonetic'],
                    Color.black)
            # if 'phonetic' in result['basic']:
            #     self.ColoredAppend('拼音:', Color.blue), self.ColoredAppend('[%s]' % result['basic']['phonetic'],
            #                                                               Color.black)

            self.ColoredAppend('\nBasic Explains:\n', Color.blue)
            self.ColoredAppend('\t' + '\n\t'.join(result['basic']['explains']) + '\n', Color.black)

        if 'translation' in result:
            self.ColoredAppend('Google Translation:\n', Color.blue)
            self.ColoredAppend('\t' + result['translation'], Color.black)

        if 'web' in result:
            self.ColoredAppend('Web:\n', Color.blue)
            for item in result['web']:
                self.ColoredAppend('\t' + item['key'] + ': ' + '; '.join(item['value']) + '\n', Color.black)
        self.SetInsertionPoint(0)

    def show_result(self, result):
        type = self.check_type(result)
        if type != ColoredCtrl.ERROR:
            self.show_word(result)

    def check_type(self, result):
        if result['errorCode'] != 0:
            self.ColoredAppend(YoudaoSpider.error_code[result['errorCode']] + '\n', Color.red)
            return ColoredCtrl.ERROR
        else:
            return ColoredCtrl.WORD
