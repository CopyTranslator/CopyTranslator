'''
这个代码是很久以前开始写的，很难看，同时也难以重构。
如果重构的话，可能一些构建的脚本也要重新写，所以就直接在原基础上改了，不代表现在的水平。
2018/9/23 Elliott Zheng
'''
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
import webbrowser
import os
import json

# logopath=resource_filename(Requirement.parse("CopyTranslator"),'CopyTranslator/logo.ico')
logopath = 'logo.ico'
version = 'v0.0.6.0'

ori_x = 0
ori_y = 0

t1 = time.time()


class Setting():
    def __init__(self):

        # Collect events until released
        self.mouseListener = mouse.Listener(on_click=self.onLongClick)
        self.keyboard = Controller()

        self._default_value = {'author': 'Elliott Zheng',
                               'version': version,
                               'is_listen': False,
                               'is_copy': False,
                               'is_dete': False,
                               'stay_top': True,
                               'continus': False,
                               'is_main': True,
                               'pixel_size': 12
                               }
        self.value = self._default_value
        self.filepath = os.path.expanduser('~/copytranslator.json')
        self.load()

        self.taskbar = TaskBarIcon(self)
        self.mainFrame = MainFrame(self)
        self.subFrame = SubFrame(self)

        self.mainFrame.Centre()
        # self.mainFrame.Show()

        self.valid = False
        self.translator = Translator(service_urls=['translate.google.cn'])
        self.src = ''
        self.last_append = ''
        self.result = ''
        self.patterns = [re.compile(r'([?!.])[ ]?\n'), re.compile(r'([？！。])[ \n]')]  # 前面一个处理英语语系的，后面一个可以处理汉语系。
        self.pattern2 = re.compile(r'\$([?？！!.。])\$')

        self.initialize()

    def initialize(self):
        self.continus = self.continus
        self.stay_top = self.stay_top
        self.is_listen = self.is_listen
        self.is_dete = self.is_dete
        self.is_copy = self.is_copy
        self.is_main = self.is_main

    def get_normalized_append(self, src):
        src = src.replace('\r\n', '\n')
        src = src.replace('-\n', '')
        for pattern in self.patterns:
            src = pattern.sub(r'$\1$', src)
        src = src.replace('\n', ' ')
        src = self.pattern2.sub(r'\1\n', src)
        return src

    def get_normalized_src(self, append):
        if self.continus and self.src != '':
            return self.src + ' ' + append
        else:
            return append

    def paste(self, event):
        self.setSrc(self.last_append)

    def setSrc(self, append):
        self.src = self.get_normalized_src(append)
        self.mainFrame.srcText.SetValue(self.src)

    def setResult(self, string):
        self.result = "" + string.replace('\n', '\r\n').replace('（', '(').replace('）', ')') + '\r\n'
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
        if self.is_dete:
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

    def check_valid(self):
        if self.result == pyperclip.paste():
            return False
        append = self.get_normalized_append(pyperclip.paste())
        if self.last_append != append:
            return True
        return False

    def translateCopy(self, event):
        if self.check_valid():
            self.last_append = self.get_normalized_append(pyperclip.paste())
            self.paste(event)
            self.translate(event)
        else:
            self.valid = False

    def Copy(self, event):
        pyperclip.copy(self.result)

    def OnTimer(self, event):
        self.translateCopy(event)
        if self.valid and self.is_copy:
            self.Copy(event)

    def ChangeMode(self, event):
        if event.Id == self.taskbar.ID_Main:
            self.is_main = True
        elif event.Id == self.taskbar.ID_Focus:
            self.is_main = False
        else:
            self.is_main = not self.is_main

        self.subFrame.Show(not self.is_main)
        self.mainFrame.Show(self.is_main)

    def SwitchMode(self, event):
        self.is_main = not self.is_main

    def OnTaskBarLeftDClick(self, event):
        if self.is_main:
            frame = self.mainFrame
        else:
            frame = self.subFrame

        if frame.IsIconized():
            frame.Iconize(False)
        if not frame.IsShown():
            frame.Show(True)
        frame.Raise()

    def BossKey(self, evt):
        if self.is_main:
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

    def onLongClick(self, x, y, button, pressed):
        global t1, ori_x, ori_y
        if pressed:
            t1 = time.time()
            ori_x = x
            ori_y = y
        else:
            if time.time() - t1 > 0.3 and abs(ori_y - y) < 3 and abs(ori_x - x) < 3:
                self.simulateCopy()

    def load(self):
        if not os.path.exists(self.filepath):
            self.save_to(self.filepath)
            return self
        myfile = open(self.filepath, 'r')
        value = json.load(myfile)
        myfile.close()
        if value['version'] < self['version']:
            os.remove(self.filepath)
            self.save_to(self.filepath)
            return self
        self.value = value

        return self

    def save_to(self, filepath):
        myfile = open(filepath, 'w')
        json.dump(self.value, myfile, indent=4)
        myfile.close()

    def __getitem__(self, item):
        return self.value[item]

    def __setitem__(self, key, value):
        self.value[key] = value
        self.save_to(self.filepath)

    @property
    def is_listen(self):
        return self['is_listen']

    @is_listen.setter
    def is_listen(self, value):
        self['is_listen'] = value
        self.mainFrame.listenCheck.SetValue(value)
        if value:
            self.mainFrame.timer.Start(3000)  # 设定时间间隔为1000毫秒,并启动定时器
            self.mouseListener.start()
        else:
            self.mainFrame.timer.Stop()

    def ReverseListen(self, event):
        self.is_listen = not self.is_listen

    @property
    def is_copy(self):
        return self['is_copy']

    @is_copy.setter
    def is_copy(self, value):
        self['is_copy'] = value
        self.mainFrame.copyCheck.SetValue(self.is_copy)

    def ReverseCopy(self, event):
        self.is_copy = not self.is_copy

    @property
    def is_dete(self):
        return self['is_dete']

    @is_dete.setter
    def is_dete(self, value):
        self['is_dete'] = value
        self.mainFrame.detectCheck.SetValue(value)
        if value:
            self.mainFrame.fromchoice.Disable()
            self.mainFrame.fromlabel.SetLabel("Detected language")
        else:
            self.mainFrame.fromchoice.Enable()
            self.mainFrame.fromlabel.SetLabel("Source language")

    def ReverseDete(self, event):
        self.is_dete = not self.is_dete

    @property
    def stay_top(self):
        return self['stay_top']

    @stay_top.setter
    def stay_top(self, value):
        self['stay_top'] = value
        self.mainFrame.topCheck.SetValue(value)
        if value:
            self.subFrame.SetWindowStyle(wx.STAY_ON_TOP | SubFrame.subStyle)
            self.mainFrame.SetWindowStyle(wx.STAY_ON_TOP | MainFrame.mainStyle)
        else:
            self.subFrame.SetWindowStyle(SubFrame.subStyle)
            self.mainFrame.SetWindowStyle(MainFrame.mainStyle)

    def ReverseStayTop(self, event):
        self.stay_top = not self.stay_top

    @property
    def continus(self):
        return self['continus']

    @continus.setter
    def continus(self, value):
        self['continus'] = value
        self.mainFrame.continusCheck.SetValue(value)

    def ReverseContinus(self, event):
        self.setSrc('')
        self.setResult('')
        self.last_append = ''
        self.continus = not self.continus

    @property
    def is_main(self):
        return self['is_main']

    @is_main.setter
    def is_main(self, value):
        self['is_main'] = value
        self.subFrame.Show(not value)
        self.mainFrame.Show(value)

    @property
    def pixel_size(self):
        return self['pixel_size']

    @pixel_size.setter
    def pixel_size(self, value):
        self['pixel_size'] = value


class TaskBarIcon(wx.adv.TaskBarIcon):
    ID_Top = wx.NewId()
    ID_Listen = wx.NewId()
    ID_Copy = wx.NewId()
    ID_Dete = wx.NewId()
    ID_Continus = wx.NewId()
    ID_Show = wx.NewId()
    ID_Main = wx.NewId()
    ID_Exchange = wx.NewId()
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
        self.Bind(wx.EVT_MENU, self.setting.ReverseContinus, id=self.ID_Continus)

        self.Bind(wx.EVT_MENU, self.setting.ChangeMode, id=self.ID_Switch)
        self.Bind(wx.EVT_MENU, self.OnExchange, id=self.ID_Exchange)
        self.Bind(wx.EVT_MENU, self.OnAbout, id=self.ID_About)
        self.Bind(wx.EVT_MENU, self.OnCloseshow, id=self.ID_Closeshow)

    def OnExchange(self, event):
        pyperclip.copy(self.setting.src)

    def OnAbout(self, event):
        # wx.MessageBox('CopyTranslator v0.0.5.2 by Elliott Zheng\nProject website: https://github.com/elliottzheng/CopyTranslator',
        #               'About')

        webbrowser.open("https://github.com/elliottzheng/CopyTranslator")

    def OnCloseshow(self, event):
        self.setting.mainFrame.Destroy()
        self.setting.subFrame.Destroy()
        self.Destroy()

    # 右键菜单
    def CreatePopupMenu(self):
        menu = wx.Menu()
        listen = menu.AppendCheckItem(self.ID_Top, 'Stay on Top', 'Always stay on Top.')
        listen.Check(self.setting.stay_top)

        listen = menu.AppendCheckItem(self.ID_Listen, 'Listen clipboard', 'Listen to Clipboard and auto translate.')
        listen.Check(self.setting.is_listen)

        copy = menu.AppendCheckItem(self.ID_Copy, 'Auto copy', 'Auto copy result to clipboard.')
        copy.Check(self.setting.is_copy)

        continus = menu.AppendCheckItem(self.ID_Continus, 'Continus Copy', 'Continus copy content to source.')
        continus.Check(self.setting.continus)

        dete = menu.AppendCheckItem(self.ID_Dete, 'Detect language', 'Detect the input language.')
        dete.Check(self.setting.is_dete)

        menu.Append(self.ID_Switch, 'Main Mode' if not self.setting.is_main else 'Focus Mode')
        menu.Append(self.ID_Exchange, 'Copy Source')
        menu.Append(self.ID_About, 'About')
        menu.Append(self.ID_Closeshow, 'Exit')
        return menu


class SubFrame(wx.Frame):
    subStyle = wx.DEFAULT_FRAME_STYLE ^ wx.CAPTION

    def __init__(self, setting):
        wx.Frame.__init__(self, None, -1, 'CopyTranslator -Focus Mode',
                          size=(465, 150))
        self.SetIcon(wx.Icon(logopath, wx.BITMAP_TYPE_ICO))
        self.SetWindowStyle(SubFrame.subStyle)
        self.setting = setting
        self.panel = TestPanel(self)
        sizer = wx.BoxSizer(wx.VERTICAL)
        sizer.Add((-1, 15))
        self.destText = wx.TextCtrl(self.panel, -1, "",
                                    style=wx.TE_MULTILINE | wx.TE_READONLY)  # 创建一个文本控件
        self.font = self.destText.GetFont()
        self.font.SetPixelSize((0, self.setting.pixel_size))
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
            win32con.VK_F4)  # the key to watch for shift+F1

        self.hotKeyId4 = wx.NewId()
        self.RegisterHotKey(
            self.hotKeyId4,  # a unique ID for this hotkey
            win32con.MOD_SHIFT,  # the modifier key
            win32con.VK_F3)  # the key to watch for shift+F1

    def onFontPlus(self, event):
        self.font = self.font.Scaled(1.25)
        print(self.font.GetPixelSize()[1])
        self.setting.pixel_size = self.font.GetPixelSize()[1]
        self.destText.SetFont(self.font)

    def onFontMinus(self, event):
        self.font = self.font.Scaled(0.8)
        self.setting.pixel_size = self.font.GetPixelSize()[1]
        self.destText.SetFont(self.font)

    def OnHide(self, event):
        self.Hide()

    def OnIconfiy(self, event):
        self.Hide()
        event.Skip()

    def OnClose(self, event):
        self.Hide()


class MainFrame(wx.Frame):
    mainStyle = wx.DEFAULT_FRAME_STYLE ^ wx.RESIZE_BORDER ^ wx.MAXIMIZE_BOX

    def __init__(self, setting):
        langList = list(LANGCODES.keys())
        wx.Frame.__init__(self, None, -1, 'CopyTranslator ' + version,
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

        # 连续复制模式
        self.continusCheck = wx.CheckBox(buttonPanel, -1, 'Continus Copy')
        self.Bind(wx.EVT_CHECKBOX, self.setting.ReverseContinus, self.continusCheck)

        # 切换模式
        self.switchBtn = wx.Button(buttonPanel, -1, "Switch Mode")
        self.Bind(wx.EVT_BUTTON, self.setting.SwitchMode, self.switchBtn)

        self.transBtn = wx.Button(buttonPanel, -1, "Translate")
        self.Bind(wx.EVT_BUTTON, self.setting.translateCtrl, self.transBtn)
        self.transBtn.SetDefault()

        # 原文本
        self.srcLabel = wx.StaticText(TextPanel, -1, "Source:")
        self.srcText = wx.TextCtrl(TextPanel, -1, "", size=(300, 135), style=wx.TE_MULTILINE)  # 创建一个文本控件

        self.copyBtn = wx.Button(buttonPanel, -1, "Copy result")
        self.Bind(wx.EVT_BUTTON, self.setting.Copy, self.copyBtn)

        # 目标文本
        self.dstLabel = wx.StaticText(TextPanel, -1, "Result:")
        self.destText = wx.TextCtrl(TextPanel, -1, "", size=(300, 135),
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

        panel2sizer = wx.FlexGridSizer(12, 1, 6, 0)
        panel2sizer.AddMany(
            [self.topCheck, self.listenCheck, self.copyCheck, self.continusCheck, self.detectCheck, self.fromlabel,
             self.fromchoice,
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
        self.setting.taskbar.Destroy()
        self.setting.subFrame.Destroy()
        self.Destroy()


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
        self.Bind(wx.EVT_RIGHT_DOWN, self.parentFrame.setting.taskbar.OnExchange)
        self.Bind(wx.EVT_MOTION, self.OnMouseMove)
        self.Bind(wx.EVT_RIGHT_UP, self.parentFrame.setting.Copy)

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
