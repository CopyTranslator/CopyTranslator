# -*- coding: utf-8 -*-
# @Time    : 2018/9/25 0025 14:38
# @Author  : Elliott Zheng
# @FileName: color_ctrl.py
# @Software: PyCharm

import pyperclip as smart_clipboard
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
    ID_Top = wx.NewId()
    ID_Listen = wx.NewId()
    ID_Copy = wx.NewId()
    ID_Dict = wx.NewId()
    ID_Dete = wx.NewId()
    ID_Continus = wx.NewId()
    ID_Show = wx.NewId()
    ID_Main = wx.NewId()
    ID_Exchange = wx.NewId()
    ID_Focus = wx.NewId()
    ID_About = wx.NewId()
    ID_Closeshow = wx.NewId()
    ID_Mode1 = wx.NewId()
    ID_Mode2 = wx.NewId()
    ID_Copy_result = wx.NewId()
    ID_Clear = wx.NewId()
    ID_Write = wx.NewId()

    def __init__(self, parent=None, id=None, style=0):
        self.parent = parent
        self.setting = self.parent.parentFrame.setting
        if style == 0:
            style = wx.TE_RICH2 | wx.TE_MULTILINE | wx.TE_PROCESS_ENTER
        super(ColoredCtrl, self).__init__(parent=parent, id=id, style=style)

        self.Bind(wx.EVT_RIGHT_DOWN, self.OnShowPopup)

        # self.Bind(wx.EVT_TEXT_ENTER, self.enter)

        self.Bind(wx.EVT_MENU, self.setting.ReverseStayTop, id=self.ID_Top)
        self.Bind(wx.EVT_MENU, self.setting.ReverseListen, id=self.ID_Listen)
        self.Bind(wx.EVT_MENU, self.setting.ReverseDict, id=self.ID_Dict)
        self.Bind(wx.EVT_MENU, self.setting.ReverseDete, id=self.ID_Dete)
        self.Bind(wx.EVT_MENU, self.setting.ReverseCopy, id=self.ID_Copy)
        self.Bind(wx.EVT_MENU, self.setting.ReverseContinus, id=self.ID_Continus)

        self.Bind(wx.EVT_MENU, self.setting.ChangeMode, id=self.ID_Mode1)
        self.Bind(wx.EVT_MENU, self.setting.ChangeMode, id=self.ID_Mode2)
        self.Bind(wx.EVT_MENU, self.setting.taskbar.OnExchange, id=self.ID_Exchange)
        self.Bind(wx.EVT_MENU, self.setting.Copy, id=self.ID_Copy_result)

        self.Bind(wx.EVT_MENU, self.setting.taskbar.OnAbout, id=self.ID_About)
        self.Bind(wx.EVT_MENU, self.setting.clear, id=self.ID_Clear)
        self.Bind(wx.EVT_MENU, self.setting.OnExit, id=self.ID_Closeshow)

        self.Bind(wx.EVT_CHAR, self.OnSelectAll)

    def OnSelectAll(self, evt):
        keyInput = evt.GetKeyCode()
        print(keyInput)
        if keyInput == 1:  # 1 stands for 'ctrl+a'
            self.SelectAll()
        elif keyInput == 10:  # 10 stands for 'ctrl+enter'
            smart_clipboard.copy(self.GetValue())
        elif keyInput == 19:  # 19 stands for 'ctrl+s'
            pass
        elif keyInput == 23:  # 19 stands for 'ctrl+w'
            pass
        evt.Skip()


    # 右键菜单
    def OnShowPopup(self, event):
        self.PopupMenu(self.CreateContextMenu())

    def CreateContextMenu(self):
        menu = wx.Menu()

        menu.Append(self.ID_Exchange, 'Copy Source')

        menu.Append(self.ID_Copy_result, 'Copy Result')

        menu.Append(self.ID_Clear, 'Clear')

        menu.Append(self.ID_Mode1, self.setting.config.Mode1)

        menu.Append(self.ID_Mode2, self.setting.config.Mode2)

        copy = menu.AppendCheckItem(self.ID_Copy, 'Auto Copy', 'Auto copy result to clipboard.')
        copy.Check(self.setting.is_copy)

        continus = menu.AppendCheckItem(self.ID_Continus, 'Incremental Copy', 'Incremental Copy content to source.')
        continus.Check(self.setting.continus)

        is_dict = menu.AppendCheckItem(self.ID_Dict, 'Smart Dict', 'Enable Youdao smart dictionary')
        is_dict.Check(self.setting.is_dict)

        listen = menu.AppendCheckItem(self.ID_Listen, 'Listen Clipboard', 'Listen to Clipboard and auto translate.')
        listen.Check(self.setting.is_listen)

        listen = menu.AppendCheckItem(self.ID_Top, 'Stay on Top', 'Always stay on Top.')
        listen.Check(self.setting.stay_top)

        dete = menu.AppendCheckItem(self.ID_Dete, 'Detect Language', 'Detect the input language.')
        dete.Check(self.setting.is_dete)

        menu.Append(self.ID_About, 'Help and Update')
        menu.Append(self.ID_Closeshow, 'Exit')
        return menu

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
