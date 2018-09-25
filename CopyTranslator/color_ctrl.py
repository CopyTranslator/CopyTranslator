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
    SENTENCE = 2

    def __init__(self, parent=None, id=None, pos=None, size=None, style=0):
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
                self.ColoredAppend('美音:', Color.blue), self.ColoredAppend('[%s]\t' % result['basic']['us-phonetic'],
                                                                          Color.black),
            if 'uk-phonetic' in result['basic']:
                self.ColoredAppend('英音:', Color.blue), self.ColoredAppend('[%s]\t' % result['basic']['uk-phonetic'],
                                                                          Color.black)
            if 'phonetic' in result['basic']:
                self.ColoredAppend('拼音:', Color.blue), self.ColoredAppend('[%s]\n' % result['basic']['phonetic'],
                                                                          Color.black)

            self.ColoredAppend('基本词典:\n', Color.blue)
            self.ColoredAppend('\t' + '\n\t'.join(result['basic']['explains']) + '\n', Color.black)

        if 'translation' in result:
            self.ColoredAppend('有道翻译:\n', Color.blue)
            self.ColoredAppend('\t' + '\n\t'.join(result['translation']) + '\n', Color.black)

        if 'web' in result:
            self.ColoredAppend('网络释义:\n', Color.blue)
            for item in result['web']:
                self.ColoredAppend('\t' + item['key'] + ': ' + '; '.join(item['value']) + '\n', Color.black)
        self.SetInsertionPoint(0)

    def show_sentence(self, result):
        self.Clear()
        self.ColoredAppend(result['translation'][0], Color.black)

    def show_result(self, result):
        type = self.check_type(result)
        if type == ColoredCtrl.ERROR:
            return ''
        elif type == ColoredCtrl.SENTENCE:
            self.show_sentence(result)
        else:
            self.show_word(result)
        return result['translation'][0]

    def check_type(self, result):
        if result['errorCode'] != 0:
            self.ColoredAppend(YoudaoSpider.error_code[result['errorCode']] + '\n', Color.red)
            return ColoredCtrl.ERROR
        if 'web' in result:
            return ColoredCtrl.WORD
        elif 'translation' in result:
            return ColoredCtrl.SENTENCE
        else:
            return ColoredCtrl.ERROR
