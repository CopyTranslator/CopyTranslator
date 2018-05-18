import wx  
import pyperclip
from googletrans import Translator
from googletrans import LANGCODES
from googletrans import LANGUAGES

class TextFrame(wx.Frame):  
    
    def __init__(self):
        self.valid = False
        self.dest= ''
        self.translator=Translator(service_urls=['translate.google.cn'])
        self.src= ''
        wx.Frame.__init__(self, None, -1, 'CopyTranslator',   
                size=(465, 345))
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

    def paste(self,event):
        normalizedText=pyperclip.paste().replace('\r', '\\r').replace('\n', '\\n').replace('-\\r\\n', '').replace("\\r\\n", " ")
        self.srcText.SetValue(normalizedText)


    def translate(self,event):
        if self.detectCheck.GetValue():
            src=self.translator.detect(self.src).lang
            self.fromchoice.SetSelection(self.fromchoice.FindString(LANGUAGES[src.lower()]))
        else:
            src=LANGCODES[self.fromchoice.GetString(self.fromchoice.GetSelection())]
        dest=LANGCODES[self.tochoice.GetString(self.tochoice.GetSelection())]
        if self.dest!=self.src:
            normalizedText=self.src.replace('\r', '\\r').replace('\n', '\\n').replace('-\\r\\n', '').replace("\\r\\n", " ")
            self.dest=self.translator.translate(normalizedText, src=src, dest=dest).text
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

def main():
    app = wx.App()  
    frame = TextFrame()  
    frame.Show()  
    app.MainLoop()

if __name__ == '__main__':  
    main()
