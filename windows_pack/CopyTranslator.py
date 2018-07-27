import wx
import wx.adv
import regex as re
from googletrans import Translator
from googletrans import LANGCODES
from googletrans import LANGUAGES

from pynput import mouse
import time
import pyperclip
import win32con
from pynput.keyboard import Key, Controller

#logopath=resource_filename(Requirement.parse("CopyTranslator"),'CopyTranslator/logo.ico')
logopath = 'logo.ico'


ori_x=0
ori_y=0

t1=time.time()

class Setting():
    def __init__(self):

        # Collect events until released
        self.mouseListener=mouse.Listener(on_click=self.onLongClick)
        self.keyboard = Controller()

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
        self.patterns = [re.compile(r'([?!.])[ ]?\n'),re.compile(r'([？！。])[ \n]')]   #前面一个处理英语语系的，后面一个可以处理汉语系。
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
            self.mouseListener.start()
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
            self.subFrame.SetWindowStyle(wx.STAY_ON_TOP | SubFrame.subStyle)
            self.mainFrame.SetWindowStyle(wx.STAY_ON_TOP | MainFrame.mainStyle)
        else:
            self.subFrame.SetWindowStyle(SubFrame.subStyle)
            self.mainFrame.SetWindowStyle(MainFrame.mainStyle)

    def setSrc(self, string):
        self.src = self.normalize(string)
        self.mainFrame.srcText.SetValue(self.src)

    def setResult(self, string):
        self.result = ""+string.replace('\n','\r\n')+'\r\n'
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

    def SwitchMode(self, event):
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


    def BossKey(self,evt):
        if self.IsMain:
            frame = self.mainFrame
        else:
            frame = self.subFrame

        frame.Iconize(not frame.IsIconized())

        if not frame.IsIconized():
            frame.Show(True)
            frame.Raise()

    def simulateCopy(self):
        with self.keyboard.pressed(Key.ctrl):
            self.keyboard.press('c')
            self.keyboard.release('c')

    def onLongClick(self,x, y, button, pressed):
        global t1, ori_x, ori_y
        if pressed:
            t1 = time.time()
            ori_x = x
            ori_y = y
        else:
            if time.time() - t1 > 0.4 and abs(ori_y - y) < 3 and abs(ori_x - x) < 3:
                self.simulateCopy()

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
        wx.MessageBox('CopyTranslator v0.0.5 --Elliott Zheng\nCopy, translate and paste with Google translate API.',
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
    subStyle=wx.DEFAULT_FRAME_STYLE ^ wx.CAPTION
    def __init__(self, setting):
        wx.Frame.__init__(self, None, -1, 'CopyTranslator -Focus Mode',
                          size=(465, 345))
        self.SetIcon(wx.Icon(logopath, wx.BITMAP_TYPE_ICO))
        self.SetWindowStyle(SubFrame.subStyle)
        self.setting = setting
        self.panel=TestPanel(self)
        sizer=wx.BoxSizer(wx.VERTICAL)
        sizer.Add((-1, 15))
        self.destText = wx.TextCtrl(self.panel, -1, "",
                                    style=wx.TE_MULTILINE|wx.TE_READONLY)  # 创建一个文本控件

        sizer.Add(self.destText,-1,wx.EXPAND)

        self.panel.SetSizer(sizer)
        # 绑定事件
        self.Bind(wx.EVT_CLOSE, self.OnClose)
        self.Bind(wx.EVT_ICONIZE,
                  self.OnIconfiy)  # 窗口最小化时，调用OnIconfiy,注意Wx窗体上的最小化按钮，触发的事件是 wx.EVT_ICONIZE,而根本就没有定义什么wx.EVT_MINIMIZE,但是最大化，有个wx.EVT_MAXIMIZE。
        self.regHotKey()
        self.Bind(wx.EVT_HOTKEY, self.setting.BossKey, id=self.hotKeyId)
        self.Bind(wx.EVT_HOTKEY, self.setting.ChangeMode, id=self.hotKeyId2)

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


    def OnHide(self, event):
        self.Hide()

    def OnIconfiy(self, event):
        self.Hide()
        event.Skip()

    def OnClose(self, event):
        self.Hide()


class MainFrame(wx.Frame):
    mainStyle=wx.DEFAULT_FRAME_STYLE ^ wx.RESIZE_BORDER^wx.MAXIMIZE_BOX
    def __init__(self, setting):

        langList = list(LANGCODES.keys())
        wx.Frame.__init__(self, None, -1, 'CopyTranslator',
                          size=(465, 345))

        self.SetIcon(wx.Icon(logopath, wx.BITMAP_TYPE_ICO))
        self.SetWindowStyle(MainFrame.mainStyle)
        self.setting = setting
        TextPanel = wx.Panel(self, -1)
        buttonPanel = wx.Panel(self, -1)

        # 始终置顶按钮
        self.topCheck = wx.CheckBox(buttonPanel, -1, 'Stay on top')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseStayTop, self.topCheck)

        # 自动检测语言按钮
        self.detectCheck = wx.CheckBox(buttonPanel, -1, 'Auto detect language')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseDete, self.detectCheck)

        # 监听剪贴板选框
        self.listenCheck = wx.CheckBox(buttonPanel, -1, 'Listen on Clipboard')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseListen, self.listenCheck)

        # 自动复制选框
        self.copyCheck = wx.CheckBox(buttonPanel, -1, 'Auto copy')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseCopy, self.copyCheck)

        # 切换模式
        self.switchBtn = wx.Button(buttonPanel, -1, "Switch Mode")
        self.Bind(wx.EVT_BUTTON, self.setting.SwitchMode, self.switchBtn)

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
             tolabel, self.tochoice, self.switchBtn, self.transBtn, self.copyBtn])
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

class TestPanel(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent, -1)
        self.leftDown = False
        self.parentFrame = parent
        while self.parentFrame.GetParent() is not None:
            self.parentFrame = self.parentFrame.GetParent()
        self.Bind(wx.EVT_LEFT_DOWN, self.OnLeftDown)
        self.Bind(wx.EVT_LEFT_UP, self.OnLeftUp)
        self.Bind(wx.EVT_LEFT_DCLICK, self.OnLeftDClick)
        self.Bind(wx.EVT_MOTION, self.OnMouseMove)
        self.Bind(wx.EVT_RIGHT_UP,self.parentFrame.setting.Copy)

    def OnLeftDClick(self, evt):
        self.parentFrame.Close()


    def OnLeftDown(self, evt):
        self.CaptureMouse()
        self.leftDown = True
        pos = self.ClientToScreen(evt.GetPosition())
        origin = self.parentFrame.GetPosition()
        dx = pos.x - origin.x
        dy = pos.y - origin.y
        self.delta = wx.Point(dx, dy)

    def OnLeftUp(self, evt):
        self.ReleaseMouse()
        self.leftDown = False

    def OnMouseMove(self, evt):
        if evt.Dragging() and self.leftDown:
            pos = self.ClientToScreen(evt.GetPosition())
            fp = (pos.x - self.delta.x, pos.y - self.delta.y)
            self.parentFrame.Move(fp)

def main():
    app = wx.App()
    setting = Setting()

    app.MainLoop()


if __name__ == '__main__':
    main()
