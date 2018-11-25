import wx
import wx.adv

from copyTranslator.constant import *
from copyTranslator.googletranslator import GoogleLangList as langList


class SettingFrame(wx.Frame):
    mainStyle = wx.DEFAULT_FRAME_STYLE ^ wx.RESIZE_BORDER ^ wx.MAXIMIZE_BOX ^ wx.MINIMIZE_BOX | wx.STAY_ON_TOP

    def __init__(self, setting):
        wx.Frame.__init__(self, None, -1, project_name + ' Settings',
                          size=(465, 385))

        self.SetIcon(wx.Icon(logopath, wx.BITMAP_TYPE_ICO))
        self.SetWindowStyle(SettingFrame.mainStyle)
        self.setting = setting
        self.lang = self.setting.lang
        buttonPanel = wx.Panel(self, -1)

        # 始终置顶按钮
        self.topCheck = wx.CheckBox(buttonPanel, -1, self.lang('Stay on Top'))
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseStayTop, self.topCheck)

        # 自动检测语言按钮
        self.detectCheck = wx.CheckBox(buttonPanel, -1, self.lang('Detect Language'))
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseDete, self.detectCheck)

        # 监听剪贴板选框
        self.listenCheck = wx.CheckBox(buttonPanel, -1, self.lang('Listen on Clipboard'))
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseListen, self.listenCheck)

        # 自动复制选框
        self.copyCheck = wx.CheckBox(buttonPanel, -1, self.lang('Auto Copy'))
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseCopy, self.copyCheck)
        # self.copyCheck.SetValue(self.settin)

        # 连续复制模式
        self.continusCheck = wx.CheckBox(buttonPanel, -1, self.lang('Incremental Copy'))
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseContinus, self.continusCheck)
        self.continusCheck.SetValue(self.setting.continus)

        # 连续复制模式
        self.dictCheck = wx.CheckBox(buttonPanel, -1, self.lang('Smart Dict'))
        self.dictCheck.SetValue(self.setting.is_dict)
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseDict, self.dictCheck)

        self.fromlabel = wx.StaticText(buttonPanel, -1, self.lang('Source Language'))

        self.fromchoice = wx.Choice(buttonPanel, -1, choices=langList)

        self.fromchoice.SetSelection(self.fromchoice.FindString(self.setting.source))

        tolabel = wx.StaticText(buttonPanel, -1, self.lang('Target Language'))
        self.tochoice = wx.Choice(buttonPanel, -1, choices=langList)
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

        buttonPanel.SetSizer(panel2sizer)

        # self.SetSizer(panel2sizer)
        # self.Fit()

        # 创建定时器
        self.timer = wx.Timer(self)  # 创建定时器
        self.Bind(wx.EVT_TIMER, self.setting.OnTimer, self.timer)  # 绑定一个定时器事件

        # 绑定事件
        # self.Bind(wx.EVT_CLOSE, self.setting.OnExit)

        self.Show(True)
