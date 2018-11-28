# -*- coding: utf-8 -*-
# @Time    : 2018/9/25 0025 17:53
# @Author  : Elliott Zheng
# @FileName: taskbar.py
# @Software: PyCharm

import webbrowser

import pyperclip
import wx
import wx.adv

from copyTranslator.constant import *
from copyTranslator.update_checker import UpdateThread


class TaskBarIcon(wx.adv.TaskBarIcon):
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
    ID_Result = wx.NewId()
    ID_CHINESE = wx.NewId()
    ID_ENGLISH = wx.NewId()
    ID_Hide = wx.NewId()
    ID_Format = wx.NewId()
    ID_AutoShow = wx.NewId()

    def __init__(self, setting):
        self.setting = setting
        self.lang = self.setting.lang
        wx.adv.TaskBarIcon.__init__(self)
        self.SetIcon(wx.Icon(name=logopath, type=wx.BITMAP_TYPE_ICO), project_name)  # wx.ico为ico图标文件

        self.Bind(wx.adv.EVT_TASKBAR_LEFT_DCLICK, self.setting.OnTaskBarLeftDClick)  # 定义左键双击
        self.Bind(wx.EVT_MENU, self.setting.OnTaskBarLeftDClick, id=self.ID_Show)  # 显示主界面

        self.Bind(wx.EVT_MENU, self.setting.ReverseStayTop, id=self.ID_Top)
        self.Bind(wx.EVT_MENU, self.setting.ReverseListen, id=self.ID_Listen)
        self.Bind(wx.EVT_MENU, self.setting.ReverseDict, id=self.ID_Dict)
        self.Bind(wx.EVT_MENU, self.setting.ReverseDete, id=self.ID_Dete)
        self.Bind(wx.EVT_MENU, self.setting.ReverseCopy, id=self.ID_Copy)
        self.Bind(wx.EVT_MENU, self.setting.ReverseContinus, id=self.ID_Continus)

        self.Bind(wx.EVT_MENU, self.setting.ChangeMode, id=self.ID_Mode1)
        self.Bind(wx.EVT_MENU, self.setting.Copy, id=self.ID_Result)
        self.Bind(wx.EVT_MENU, self.setting.ChangeMode, id=self.ID_Mode2)
        self.Bind(wx.EVT_MENU, self.OnExchange, id=self.ID_Exchange)
        self.Bind(wx.EVT_MENU, self.OnAbout, id=self.ID_About)
        self.Bind(wx.EVT_MENU, self.setting.OnExit, id=self.ID_Closeshow)
        self.Bind(wx.EVT_MENU, self.OnLanguage, id=self.ID_ENGLISH)
        self.Bind(wx.EVT_MENU, self.OnLanguage, id=self.ID_CHINESE)
        self.Bind(wx.EVT_MENU, self.setting.switch_hide, id=self.ID_Hide)
        self.Bind(wx.EVT_MENU, self.setting.switch_show, id=self.ID_AutoShow)

    def OnLanguage(self, event):
        if event.Id == self.ID_ENGLISH:
            self.setting.language = 'English'
        else:
            self.setting.language = 'Chinese (Simplified)'

    def OnExchange(self, event):
        pyperclip.copy(self.setting.src)

    def OnAbout(self, event):
        UpdateThread(self.setting).start()
        box = wx.MessageDialog(self.setting.get_current_frame(),
                               'If you found it useful, please give me a star on GitHub or introduce to your friend.\n\n如果您感觉本软件对您有所帮助，请在项目Github上给个star或是介绍给您的朋友，谢谢。\n\n本软件免费开源，如果您是以付费的方式获得本软件，那么你应该是被骗了。[○･｀Д´･ ○]\n\n前往软件官网？',
                               project_name + ' ' + version + ' by Elliott Zheng', wx.YES_NO | wx.ICON_QUESTION)
        answer = box.ShowModal()
        if answer == wx.ID_YES:
            webbrowser.open(project_url)
        box.Destroy()


    # 右键菜单
    def CreatePopupMenu(self):
        menu = wx.Menu()
        listen = menu.AppendCheckItem(self.ID_Top, self.lang('Stay on Top'), 'Always stay on Top.')
        listen.Check(self.setting.stay_top)

        listen = menu.AppendCheckItem(self.ID_Listen, self.lang('Listen on Clipboard'),
                                      'Listen to Clipboard and auto translate.')
        listen.Check(self.setting.is_listen)

        copy = menu.AppendCheckItem(self.ID_Copy, self.lang('Auto Copy'), 'Auto copy result to clipboard.')
        copy.Check(self.setting.is_copy)

        is_dict = menu.AppendCheckItem(self.ID_Dict, self.lang('Smart Dict'), 'Enable Youdao smart dictionary')
        is_dict.Check(self.setting.is_dict)

        continus = menu.AppendCheckItem(self.ID_Continus, self.lang('Incremental Copy'),
                                        'Incremental Copy content to source.')
        continus.Check(self.setting.continus)

        dete = menu.AppendCheckItem(self.ID_Dete, self.lang('Detect Language'), 'Detect the input language.')
        dete.Check(self.setting.is_dete)

        hide = menu.AppendCheckItem(self.ID_Hide, self.lang('Auto Hide'), 'Auto Hide')
        hide.Check(self.setting.config.autohide)

        autoShow = menu.AppendCheckItem(self.ID_AutoShow, self.lang('Auto Show'), 'Auto Show')
        autoShow.Check(self.setting.config.autoshow)

        # hide = menu.AppendCheckItem(self.ID_Format, self.lang('Auto Formation'), 'Auto Hide')
        # hide.Check(self.setting.config.autohide)

        menu.Append(self.ID_Mode1, self.lang(self.setting.config.Mode1))
        # menu.Append(self.ID_Mode2, self.lang(self.setting.config.Mode2))

        modeMenu = wx.Menu()

        english = modeMenu.AppendRadioItem(self.ID_ENGLISH, "English")

        chinese = modeMenu.AppendRadioItem(self.ID_CHINESE, "简体中文")
        if self.lang.language == 'Chinese (Simplified)':
            chinese.Check()
        else:
            english.Check()

        switchMode = menu.AppendSubMenu(modeMenu, self.lang('Switch Language'))

        menu.Append(self.ID_Exchange, self.lang('Copy Source'))
        menu.Append(self.ID_Result, self.lang('Copy Result'))
        menu.Append(self.ID_About, self.lang('Help and Update'))
        menu.Append(self.ID_Closeshow, self.lang('Exit'))
        return menu
