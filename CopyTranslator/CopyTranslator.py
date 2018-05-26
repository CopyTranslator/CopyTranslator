import wx
import wx.adv
import pyperclip
from googletrans import Translator
from googletrans import LANGCODES
from googletrans import LANGUAGES
from pkg_resources import resource_filename,Requirement

logopath=resource_filename(Requirement.parse("CopyTranslator"),'CopyTranslator/logo.ico')

class TaskBarIcon(wx.adv.TaskBarIcon):
    ID_Listen=wx.NewId()
    ID_Copy=wx.NewId()
    ID_Dete= wx.NewId()
    ID_Show = wx.NewId()
    ID_About = wx.NewId()
    ID_Closeshow = wx.NewId()

    def __init__(self, frame):
        wx.adv.TaskBarIcon.__init__(self)
        self.IsListen=False
        self.IsCopy=False
        self.IsDete=False
        self.frame = frame
        self.SetIcon(wx.Icon(name=logopath, type=wx.BITMAP_TYPE_ICO), 'CopyTranslator')  # wx.ico为ico图标文件
        self.Bind(wx.adv.EVT_TASKBAR_LEFT_DCLICK, self.OnTaskBarLeftDClick)  # 定义左键双击
        self.Bind(wx.EVT_MENU, self.OnTaskBarLeftDClick, id=self.ID_Show)
        self.Bind(wx.EVT_MENU, self.OnListen, id=self.ID_Listen)
        self.Bind(wx.EVT_MENU, self.OnCopy, id=self.ID_Copy)
        self.Bind(wx.EVT_MENU, self.OnAbout, id=self.ID_About)
        self.Bind(wx.EVT_MENU, self.OnCloseshow, id=self.ID_Closeshow)

    def OnListen(self,event):
        self.IsListen=not self.IsListen
        self.frame.listenCheck.SetValue(self.IsListen)
        self.frame.SetListen(event)


    def OnCopy(self,event):
        self.IsCopy = not self.IsCopy
        self.frame.copyCheck.SetValue(self.IsCopy)

    def OnDete(self,event):
        self.IsDete = not self.IsDete
        self.frame.detectCheck.SetValue(self.IsDete)

    def OnTaskBarLeftDClick(self, event):
        if self.frame.IsIconized():
            self.frame.Iconize(False)
        if not self.frame.IsShown():
            self.frame.Show(True)
        self.frame.Raise()

    def OnAbout(self, event):
        wx.MessageBox('CopyTranslator v0.0.1 --Elliott Zheng\nCopy, translate and paste with Google translate API.', 'About')


    def OnCloseshow(self, event):
        self.frame.Close(True)

    # 右键菜单
    def CreatePopupMenu(self):
        menu = wx.Menu()
        listen=menu.AppendCheckItem(self.ID_Listen, 'Listen clipboard', 'Listen to Clipboard and auto translate.')
        listen.Check(self.IsListen)

        copy = menu.AppendCheckItem(self.ID_Copy, 'Auto copy', 'Auto copy result to clipboard.')
        copy.Check(self.IsCopy)

        dete = menu.AppendCheckItem(self.ID_Dete, 'Detect language', 'Detect the input language.')
        dete.Check(self.IsDete)

        menu.Append(self.ID_Show, 'Main interface')
        menu.Append(self.ID_About, 'About')
        menu.Append(self.ID_Closeshow, 'Exit')
        return menu




class TextFrame(wx.Frame):  
    
    def __init__(self):
        self.valid = False
        self.dest= ''
        self.translator=Translator(service_urls=['translate.google.cn'])
        self.src= ''
        wx.Frame.__init__(self, None, -1, 'CopyTranslator',   
                size=(465, 345))
        self.SetIcon(wx.Icon(logopath, wx.BITMAP_TYPE_ICO))
        self.SetWindowStyle(wx.DEFAULT_FRAME_STYLE^wx.RESIZE_BORDER)
        TextPanel = wx.Panel(self, -1)
        buttonPanel = wx.Panel(self, -1)

        #始终置顶按钮
        self.topCheck = wx.CheckBox(buttonPanel, -1, 'Stay on top')
        self.Bind(wx.EVT_CHECKBOX, self.EvtTop, self.topCheck)

        # 自动检测语言按钮
        self.detectCheck = wx.CheckBox(buttonPanel, -1, 'Auto dectet language')
        self.Bind(wx.EVT_CHECKBOX, self.EvtDetect, self.detectCheck)

        # 监听剪贴板选框
        self.listenCheck = wx.CheckBox(buttonPanel, -1, 'Listen on Clipboard')
        self.Bind(wx.EVT_CHECKBOX, self.SetListen, self.listenCheck )

        # 自动复制选框
        self.copyCheck = wx.CheckBox(buttonPanel, -1, 'Auto copy')

        self.pasteBtn = wx.Button(buttonPanel, -1, "Paste")
        self.Bind(wx.EVT_BUTTON, self.paste, self.pasteBtn)

        self.transBtn = wx.Button(buttonPanel, -1, "Translate")
        self.Bind(wx.EVT_BUTTON, self.translateCtrl, self.transBtn)
        self.transBtn.SetDefault()

        #原文本
        self.srcLabel=wx.StaticText(TextPanel, -1, "Source:")
        self.srcText = wx.TextCtrl(TextPanel, -1, "",
                                   size=(300, 125), style=wx.TE_MULTILINE) #创建一个文本控件
    
        self.copyBtn = wx.Button(buttonPanel, -1, "Copy result")
        self.Bind(wx.EVT_BUTTON, self.Copy, self.copyBtn)

        #目标文本
        self.dstLabel=wx.StaticText(TextPanel, -1, "Result:")
        self.destText = wx.TextCtrl(TextPanel, -1, "",
                                    size=(300, 125), style=wx.TE_MULTILINE) #创建一个文本控件


        langList = list(LANGCODES.keys())
        self.fromlabel=wx.StaticText(buttonPanel,-1,'Source language')
        
        self.fromchoice=wx.Choice(buttonPanel,-1,choices = langList)
        self.fromchoice.SetSelection(self.fromchoice.FindString('english'))

        tolabel=wx.StaticText(buttonPanel,-1,'Target language :')
        self.tochoice=wx.Choice(buttonPanel,-1,choices = langList)
        self.tochoice.SetSelection(self.tochoice.FindString('chinese (simplified)'))

        panel1sizer=wx.FlexGridSizer(4,1,6,6)  
        panel1sizer.AddMany([self.srcLabel, self.srcText, self.dstLabel, self.destText])

        TextPanel.SetSizer(panel1sizer)
        panel2sizer=wx.FlexGridSizer(11,1,6,0)
        panel2sizer.AddMany([self.topCheck, self.listenCheck, self.detectCheck,self.copyCheck,self.fromlabel, self.fromchoice, tolabel, self.tochoice, self.pasteBtn, self.transBtn, self.copyBtn])
        buttonPanel.SetSizer(panel2sizer)

        sizer = wx.FlexGridSizer(1,2,0,0)
        sizer.AddMany([TextPanel,buttonPanel])
        self.SetSizer(sizer)  
        
        # 创建定时器
        self.timer = wx.Timer(self)#创建定时器
        self.Bind(wx.EVT_TIMER, self.OnTimer, self.timer)#绑定一个定时器事件

        self.taskBarIcon = TaskBarIcon(self)

        # 绑定事件
        self.Bind(wx.EVT_CLOSE, self.OnClose)
        self.Bind(wx.EVT_ICONIZE,
                  self.OnIconfiy)  # 窗口最小化时，调用OnIconfiy,注意Wx窗体上的最小化按钮，触发的事件是 wx.EVT_ICONIZE,而根本就没有定义什么wx.EVT_MINIMIZE,但是最大化，有个wx.EVT_MAXIMIZE。

    def paste(self,event):
        normalizedText=pyperclip.paste().replace('\r', '\\r').replace('\n', '\\n').replace('-\\r\\n', '').replace("\\r\\n", " ")
        self.srcText.SetValue(normalizedText)


    def translate(self,event):
        src = self.translator.detect(self.src).lang
        if self.detectCheck.GetValue():
            self.fromchoice.SetSelection(self.fromchoice.FindString(LANGUAGES[src.lower()]))
        else:
            src2=LANGCODES[self.fromchoice.GetString(self.fromchoice.GetSelection())]
            if src2!=src: ## 如果语言不对，就不翻译了，不然浪费时间
                self.destText.SetValue('')
                return
        dest=LANGCODES[self.tochoice.GetString(self.tochoice.GetSelection())]

        if self.dest!=self.src:
            self.src=self.normalize(self.src) # 规范化
            self.dest=self.translator.translate(self.src, src=src, dest=dest).text
            self.destText.SetValue(self.dest)
            self.valid=True
        else:
            self.valid=False

    def translateCtrl(self,event):
        self.src=self.srcText.GetValue()
        self.translate(event)


    def translateCopy(self,event):
        if self.dest!=pyperclip.paste():
            self.paste(event)
            self.src=pyperclip.paste()
            self.translate(event)
        else:
            self.valid=False


    def normalize(self,src):
        return src.replace('\r', '\\r').replace('\n', '\\n').replace('-\\r\\n', '').replace("\\r\\n", " ").replace('\\n',' ')


    def Copy(self,event):
        pyperclip.copy(self.destText.GetValue())
    
    def OnTimer(self,event):
        self.translateCopy(event)
        if self.valid and self.copyCheck.GetValue():
            self.Copy(event)

    def EvtTop(self, event):
        if self.topCheck.GetValue():
            self.SetWindowStyle(wx.STAY_ON_TOP|wx.DEFAULT_FRAME_STYLE^wx.RESIZE_BORDER)
        else:
            self.SetWindowStyle(wx.DEFAULT_FRAME_STYLE^wx.RESIZE_BORDER)

    def EvtDetect(self, event):
        if self.detectCheck.GetValue():
            self.fromchoice.Disable()
            self.fromlabel.SetLabel("Detected language")
        else:
            self.fromchoice.Enable()
            self.fromlabel.SetLabel("Source language")

    def SetListen(self,event):
        if self.listenCheck.GetValue():
            self.timer.Start(3000)#设定时间间隔为1000毫秒,并启动定时器
        else:
            self.timer.Stop()

    def OnHide(self, event):
        self.Hide()

    def OnIconfiy(self, event):
        self.Hide()
        event.Skip()

    def OnClose(self, event):
        self.taskBarIcon.Destroy()
        self.Destroy()

def main():
    app = wx.App()  
    frame = TextFrame()
    frame.Centre()
    frame.Show()  
    app.MainLoop()

if __name__ == '__main__':  
    main()
