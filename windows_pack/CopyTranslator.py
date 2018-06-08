import wx
import wx.adv
import pyperclip
import regex as re
from googletrans import Translator
from googletrans import LANGCODES
from googletrans import LANGUAGES
from pkg_resources import resource_filename, Requirement

# logopath=resource_filename(Requirement.parse("CopyTranslator"),'CopyTranslator/logo.ico')
logopath = 'logo.ico'


class Setting():
    def __init__(self):
        self.IsListen = False
        self.IsCopy = False
        self.IsDete = False
        self.StayTop = False

        self.mainFrame = MainFrame(self)
        self.subFrame = SubFrame(self)
        self.taskbar = TaskBarIcon(self)

        self.IsMain = True
        self.mainFrame.Centre()
        self.mainFrame.Show()

        self.valid = False
        self.translator = Translator(service_urls=['translate.google.cn'])
        self.src = ''
        self.result = ''
        self.patterns = [re.compile(r'([?!.])[\n]'),re.compile(r'([？！。])[ \n]')]   #前面一个处理英语语系的，后面一个可以处理汉语系。
        self.pattern2 = re.compile(r'\$([?？！!.。])\$')

    def normalize(self, src):
        src=src.replace('\r\n', '\n')
        src=src.replace('-\n', '')
        for pattern in self.patterns:
            src=pattern.sub(r'$\1$',src)
        src=src.replace('\n',' ')
        src=self.pattern2.sub(r'\1\n',src)
        return src


    def paste(self, event):
        self.setSrc(pyperclip.paste())

    def ReverseListen(self, event):
        self.IsListen = not self.IsListen
        self.mainFrame.listenCheck.SetValue(self.IsListen)
        if self.IsListen:
            self.mainFrame.timer.Start(3000)  # 设定时间间隔为1000毫秒,并启动定时器
        else:
            self.mainFrame.timer.Stop()

    def ReverseCopy(self, event):
        self.IsCopy = not self.IsCopy
        self.mainFrame.copyCheck.SetValue(self.IsCopy)

    def ReverseDete(self, event):
        self.IsDete = not self.IsDete
        self.mainFrame.detectCheck.SetValue(self.IsDete)
        if self.IsDete:
            self.mainFrame.fromchoice.Disable()
            self.mainFrame.fromlabel.SetLabel("Detected language")
        else:
            self.mainFrame.fromchoice.Enable()
            self.mainFrame.fromlabel.SetLabel("Source language")

    def ReverseStayTop(self, event):
        self.StayTop = not self.StayTop
        if self.StayTop:
            self.subFrame.SetWindowStyle(wx.STAY_ON_TOP | wx.DEFAULT_FRAME_STYLE)
            self.mainFrame.SetWindowStyle(wx.STAY_ON_TOP | wx.DEFAULT_FRAME_STYLE ^ wx.RESIZE_BORDER)
        else:
            self.subFrame.SetWindowStyle(wx.DEFAULT_FRAME_STYLE)
            self.mainFrame.SetWindowStyle(wx.DEFAULT_FRAME_STYLE ^ wx.RESIZE_BORDER)

    def setSrc(self, string):
        self.src = self.normalize(string)
        self.mainFrame.srcText.SetValue(self.src)

    def setResult(self, string):
        self.result = "   "+string.replace('\n','\n   ')
        self.mainFrame.destText.SetValue(self.result)
        self.subFrame.destText.SetValue(self.result)

    def getTgtLang(self):
        return LANGCODES[self.mainFrame.tochoice.GetString(self.mainFrame.tochoice.GetSelection())]

    def getSrcLang(self):
        return LANGCODES[self.mainFrame.fromchoice.GetString(self.mainFrame.fromchoice.GetSelection())]

    def getExpSrc(self):
        return self.mainFrame.srcText.GetValue()

    def getResult(self):
        return self.result

    def translate(self, event):
        src = self.translator.detect(self.src).lang
        if self.IsDete:
            self.mainFrame.fromchoice.SetSelection(self.mainFrame.fromchoice.FindString(LANGUAGES[src.lower()]))
        else:
            src = self.getSrcLang()

        dest = self.getTgtLang()

        if self.result != self.src:
            self.setResult(self.translator.translate(self.src, src=src, dest=dest).text)
            self.valid = True
        else:
            self.valid = False

    def translateCtrl(self, event):
        self.setSrc(self.getExpSrc())
        self.translate(event)

    def translateCopy(self, event):
        if self.result != pyperclip.paste() and self.src != self.normalize(pyperclip.paste()):
            self.paste(event)
            self.translate(event)
        else:
            self.valid = False

    def Copy(self, event):
        pyperclip.copy(self.result)

    def OnTimer(self, event):
        self.translateCopy(event)
        if self.valid and self.IsCopy:
            self.Copy(event)

    def ChangeMode(self, event):
        if event.Id == self.taskbar.ID_Main:
            self.IsMain = True
        elif event.Id == self.taskbar.ID_Focus:
            self.IsMain = False
        else:
            self.IsMain = not self.IsMain

        self.subFrame.Show(not self.IsMain)
        self.mainFrame.Show(self.IsMain)

    def OnTaskBarLeftDClick(self, event):
        if self.IsMain:
            frame = self.mainFrame
        else:
            frame = self.subFrame

        if frame.IsIconized():
            frame.Iconize(False)
        if not frame.IsShown():
            frame.Show(True)
        frame.Raise()


class TaskBarIcon(wx.adv.TaskBarIcon):
    ID_Top = wx.NewId()
    ID_Listen = wx.NewId()
    ID_Copy = wx.NewId()
    ID_Dete = wx.NewId()
    ID_Show = wx.NewId()
    ID_Main = wx.NewId()

    ID_Focus = wx.NewId()
    ID_About = wx.NewId()
    ID_Closeshow = wx.NewId()
    ID_Switch = wx.NewId()

    def __init__(self, setting):
        self.setting = setting
        wx.adv.TaskBarIcon.__init__(self)
        self.SetIcon(wx.Icon(name=logopath, type=wx.BITMAP_TYPE_ICO), 'CopyTranslator')  # wx.ico为ico图标文件

        self.Bind(wx.adv.EVT_TASKBAR_LEFT_DCLICK, self.setting.OnTaskBarLeftDClick)  # 定义左键双击
        self.Bind(wx.EVT_MENU, self.setting.OnTaskBarLeftDClick, id=self.ID_Show)  # 显示主界面

        self.Bind(wx.EVT_MENU, self.setting.ReverseStayTop, id=self.ID_Top)
        self.Bind(wx.EVT_MENU, self.setting.ReverseListen, id=self.ID_Listen)
        self.Bind(wx.EVT_MENU, self.setting.ReverseDete, id=self.ID_Dete)
        self.Bind(wx.EVT_MENU, self.setting.ReverseCopy, id=self.ID_Copy)

        self.Bind(wx.EVT_MENU, self.setting.ChangeMode, id=self.ID_Main)
        self.Bind(wx.EVT_MENU, self.setting.ChangeMode, id=self.ID_Focus)

        self.Bind(wx.EVT_MENU, self.OnAbout, id=self.ID_About)
        self.Bind(wx.EVT_MENU, self.OnCloseshow, id=self.ID_Closeshow)

    def OnAbout(self, event):
        wx.MessageBox('CopyTranslator v0.0.3 --Elliott Zheng\nCopy, translate and paste with Google translate API.',
                      'About')

    def OnCloseshow(self, event):
        self.setting.mainFrame.Destroy()
        self.setting.subFrame.Destroy()
        self.Destroy()

    # 右键菜单
    def CreatePopupMenu(self):
        menu = wx.Menu()
        listen = menu.AppendCheckItem(self.ID_Top, 'Stay on Top', 'Always stay on Top.')
        listen.Check(self.setting.StayTop)

        listen = menu.AppendCheckItem(self.ID_Listen, 'Listen clipboard', 'Listen to Clipboard and auto translate.')
        listen.Check(self.setting.IsListen)

        copy = menu.AppendCheckItem(self.ID_Copy, 'Auto copy', 'Auto copy result to clipboard.')
        copy.Check(self.setting.IsCopy)

        dete = menu.AppendCheckItem(self.ID_Dete, 'Detect language', 'Detect the input language.')
        dete.Check(self.setting.IsDete)

        modeMenu = wx.Menu()

        mainMode = modeMenu.AppendRadioItem(self.ID_Main, "Main Mode")

        subMode = modeMenu.AppendRadioItem(self.ID_Focus, "Focus Mode")
        if self.setting.IsMain:
            mainMode.Check()
        else:
            subMode.Check()

        switchMode = menu.AppendSubMenu(modeMenu, 'Switch frame mode.')

        menu.Append(self.ID_Show, 'Main interface')
        menu.Append(self.ID_About, 'About')
        menu.Append(self.ID_Closeshow, 'Exit')
        return menu


class SubFrame(wx.Frame):

    def __init__(self, setting):
        wx.Frame.__init__(self, None, -1, 'CopyTranslator -Focus Mode',
                          size=(465, 345))
        self.SetIcon(wx.Icon(logopath, wx.BITMAP_TYPE_ICO))
        self.SetWindowStyle(wx.DEFAULT_FRAME_STYLE)
        self.setting = setting

        self.destText = wx.TextCtrl(self, -1, "",
                                    style=wx.TE_MULTILINE)  # 创建一个文本控件
        # 绑定事件
        self.Bind(wx.EVT_CLOSE, self.OnClose)
        self.Bind(wx.EVT_ICONIZE,
                  self.OnIconfiy)  # 窗口最小化时，调用OnIconfiy,注意Wx窗体上的最小化按钮，触发的事件是 wx.EVT_ICONIZE,而根本就没有定义什么wx.EVT_MINIMIZE,但是最大化，有个wx.EVT_MAXIMIZE。

    def OnHide(self, event):
        self.Hide()

    def OnIconfiy(self, event):
        self.Hide()
        event.Skip()

    def OnClose(self, event):
        self.Hide()


class MainFrame(wx.Frame):

    def __init__(self, setting):
        langList = list(LANGCODES.keys())
        wx.Frame.__init__(self, None, -1, 'CopyTranslator',
                          size=(465, 345))
        self.SetIcon(wx.Icon(logopath, wx.BITMAP_TYPE_ICO))
        self.SetWindowStyle(wx.DEFAULT_FRAME_STYLE ^ wx.RESIZE_BORDER)
        self.setting = setting
        TextPanel = wx.Panel(self, -1)
        buttonPanel = wx.Panel(self, -1)

        # 始终置顶按钮
        self.topCheck = wx.CheckBox(buttonPanel, -1, 'Stay on top')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseStayTop, self.topCheck)

        # 自动检测语言按钮
        self.detectCheck = wx.CheckBox(buttonPanel, -1, 'Auto dectet language')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseDete, self.detectCheck)

        # 监听剪贴板选框
        self.listenCheck = wx.CheckBox(buttonPanel, -1, 'Listen on Clipboard')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseListen, self.listenCheck)

        # 自动复制选框
        self.copyCheck = wx.CheckBox(buttonPanel, -1, 'Auto copy')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseCopy, self.copyCheck)

        self.pasteBtn = wx.Button(buttonPanel, -1, "Paste")
        self.Bind(wx.EVT_BUTTON, self.setting.paste, self.pasteBtn)

        self.transBtn = wx.Button(buttonPanel, -1, "Translate")
        self.Bind(wx.EVT_BUTTON, self.setting.translateCtrl, self.transBtn)
        self.transBtn.SetDefault()

        # 原文本
        self.srcLabel = wx.StaticText(TextPanel, -1, "Source:")
        self.srcText = wx.TextCtrl(TextPanel, -1, "", size=(300, 125), style=wx.TE_MULTILINE)  # 创建一个文本控件

        self.copyBtn = wx.Button(buttonPanel, -1, "Copy result")
        self.Bind(wx.EVT_BUTTON, self.setting.Copy, self.copyBtn)

        # 目标文本
        self.dstLabel = wx.StaticText(TextPanel, -1, "Result:")
        self.destText = wx.TextCtrl(TextPanel, -1, "", size=(300, 125),
                                    style=wx.TE_MULTILINE)  # 创建一个文本控件

        self.fromlabel = wx.StaticText(buttonPanel, -1, 'Source language')

        self.fromchoice = wx.Choice(buttonPanel, -1, choices=langList)
        self.fromchoice.SetSelection(self.fromchoice.FindString('english'))

        tolabel = wx.StaticText(buttonPanel, -1, 'Target language :')
        self.tochoice = wx.Choice(buttonPanel, -1, choices=langList)
        self.tochoice.SetSelection(self.tochoice.FindString('chinese (simplified)'))

        panel1sizer = wx.FlexGridSizer(4, 1, 6, 6)
        panel1sizer.AddMany([self.srcLabel, self.srcText, self.dstLabel, self.destText])

        TextPanel.SetSizer(panel1sizer)

        panel2sizer = wx.FlexGridSizer(11, 1, 6, 0)
        panel2sizer.AddMany(
            [self.topCheck, self.listenCheck, self.detectCheck, self.copyCheck, self.fromlabel, self.fromchoice,
             tolabel, self.tochoice, self.pasteBtn, self.transBtn, self.copyBtn])
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
        # self.setting.taskbar.Destroy()
        # self.Destroy()
        self.Hide()


def main():
    app = wx.App()
    setting = Setting()
    app.MainLoop()


if __name__ == '__main__':
    main()
