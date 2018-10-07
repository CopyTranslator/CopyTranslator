# -*- coding: utf-8 -*-
# @Time    : 2018/9/25 0025 17:49
# @Author  : Elliott Zheng
# @FileName: setting.py
# @Software: PyCharm

import json
import os
import threading
import time

# from copyTranslator import smart_clipboard
import pyperclip as smart_clipboard
import regex as re
import wx
import wx.adv
from googletrans import LANGCODES
from googletrans import LANGUAGES
from googletrans import Translator
from pynput import mouse
from pynput.keyboard import Key, Controller

from copyTranslator.constant import *
from copyTranslator.mainframe import MainFrame
from copyTranslator.mypanel import MyPanel
from copyTranslator.subframe import SubFrame
from copyTranslator.taskbar import TaskBarIcon
from copyTranslator.update_checker import UpdateThread
from copyTranslator.youdao import YoudaoSpider


# 只要有一个汉字就是中文
def check_contain_chinese(check_str):
    for ch in check_str:
        if u'\u4e00' <= ch <= u'\u9fff':
            return True
    return False


class TranslateThread(threading.Thread):
    def __init__(self, setting, show):
        threading.Thread.__init__(self)
        self.setting = setting
        self.show = show

    def run(self):
        self.setting.subFrame.panel.SetState(MyPanel.TRANSLATEING)
        self.setting.smart_translate(self.show)
        if self.setting.is_copy:
            self.setting.Copy(None)

        self.setting.subFrame.panel.SetState(self.setting.state)


class DictThread(threading.Thread):
    def __init__(self, setting):
        threading.Thread.__init__(self)
        self.setting = setting

    def run(self):
        self.setting.youdao_smart_dict(None)


class Setting():
    def __init__(self):
        # Collect events until released
        self.mouseListener = mouse.Listener(on_click=self.onLongClick)
        self.keyboard = Controller()
        self.ori_x = 0
        self.ori_y = 0
        self.t1 = time.time()

        self._default_value = {'author': 'Elliott Zheng',
                               'version': version,
                               'is_listen': False,
                               'is_copy': False,
                               'is_dete': False,
                               'stay_top': True,
                               'continus': False,
                               'smart_dict': True,
                               'is_main': True,
                               'pixel_size': 15,
                               'source': 'english',
                               'target': 'chinese (simplified)',
                               'last_ask': 0
                               }
        self.value = self._default_value
        self.filepath = os.path.expanduser('~/copytranslator.json')
        self.load()

        self.taskbar = TaskBarIcon(self)
        self.mainFrame = MainFrame(self)
        self.subFrame = SubFrame(self)

        self.mainFrame.Centre()
        # self.mainFrame.Show()
        self.state = MyPanel.NOT_LISTEN
        self.translator = Translator(service_urls=['translate.google.cn'])
        self.youdao_dict = YoudaoSpider()
        self.src = ''
        self.last_append = ''
        self.result = ''
        self.patterns = [re.compile(r'([?!.])[ ]?\n'), re.compile(r'([？！。])[ \n]')]  # 前面一个处理英语语系的，后面一个可以处理汉语系。
        self.pattern2 = re.compile(r'\$([?？！!.。])\$')
        self.is_word = False
        self.stored_source = self.source
        self.initialize()

        UpdateThread(self).start()

    def RefreshState(self):
        if self.continus and self.is_listen and self.is_copy:
            self.state = MyPanel.INCERMENT_COPY
        elif self.continus and self.is_listen:
            self.state = MyPanel.INCERMENT_LISTEN
        elif self.is_listen and self.is_copy:
            self.state = MyPanel.LISTEN_COPY
        elif self.is_listen:
            self.state = MyPanel.LISTEN
        else:
            self.state = MyPanel.NOT_LISTEN
        self.subFrame.panel.SetState(self.state)

        return self.state

    def initialize(self):
        self.continus = self.continus
        self.stay_top = self.stay_top
        self.is_listen = self.is_listen
        self.is_dete = self.is_dete
        self.is_copy = self.is_copy
        self.is_main = self.is_main
        self.is_dict = self.is_dict

    @property
    def source(self):
        return self.value['source']

    @property
    def target(self):
        return self.value['target']

    def save_config(self):
        self.value['source'] = self.mainFrame.tochoice.GetString(self.mainFrame.fromchoice.GetSelection())
        self.value['target'] = self.mainFrame.tochoice.GetString(self.mainFrame.tochoice.GetSelection())
        self.save_to(self.filepath)

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

    def OnExit(self, event):
        self.save_config()
        self.mainFrame.Destroy()
        self.subFrame.Destroy()
        self.taskbar.Destroy()

    def paste(self, event):
        self.setSrc(self.last_append)

    def setSrc(self, append):
        self.src = self.get_normalized_src(append)
        self.mainFrame.srcText.SetValue(self.src)
        self.subFrame.destText.Clear()
        self.mainFrame.destText.Clear()

    def setResult(self, string, show=True):
        self.result = "" + string.replace('\n', '\r\n') + '\r\n'
        self.mainFrame.destText.SetValue(self.result)
        if show:
            self.subFrame.destText.SetValue(self.result)

    def getTgtLang(self):
        return LANGCODES[self.mainFrame.tochoice.GetString(self.mainFrame.tochoice.GetSelection())]

    def getSrcLang(self):
        return LANGCODES[self.mainFrame.fromchoice.GetString(self.mainFrame.fromchoice.GetSelection())]

    def getExpSrc(self):
        return self.mainFrame.srcText.GetValue()

    def getResult(self):
        return self.result

    def smart_translate(self, event):
        show = (event != False)
        src = self.translator.detect(self.src).lang.lower()
        dest = self.getTgtLang()
        should_src = src

        if self.is_dete:
            self.mainFrame.fromchoice.SetSelection(self.mainFrame.fromchoice.FindString(LANGUAGES[src]))
        else:
            should_src = self.getSrcLang()

        if src == dest:
            src, dest = dest, should_src
        else:
            src = should_src

        if self.result != self.src:
            self.setResult(self.translator.translate(self.src, src=src, dest=dest).text, show)

    def youdao_smart_dict(self, event):
        if self.result != self.src:
            result = self.youdao_dict.get_result(self.src)
            self.set_word_result(result)

    def set_word_result(self, result):
        self.subFrame.destText.show_result(result)
        self.mainFrame.destText.SetValue(self.result)

    def translateCtrl(self, event):
        self.setSrc(self.getExpSrc())
        TranslateThread(self, True).start()

    def check_valid(self):
        string = smart_clipboard.paste()
        if self.result == string or self.src == string or string == '':
            return False
        append = self.get_normalized_append(string)
        if self.last_append != append:
            self.is_word = self.is_dict and (len(append.split()) <= 3) and not check_contain_chinese(
                append) and not self.continus
            return True
        return False

    def translateCopy(self, event):
        if self.check_valid():

            self.last_append = self.get_normalized_append(smart_clipboard.paste())
            self.paste(event)
            if not self.is_word:
                TranslateThread(self, True).start()
            else:
                TranslateThread(self, False).start()
                DictThread(self).start()

    def Copy(self, event):
        smart_clipboard.copy(self.result)

    def OnTimer(self, event):
        self.translateCopy(event)

    def ChangeMode(self, event):
        if event.Id == self.taskbar.ID_Main:
            self.is_main = True
        elif event.Id == self.taskbar.ID_Focus:
            self.is_main = False
        else:
            self.is_main = not self.is_main

        self.subFrame.Show(not self.is_main)
        self.mainFrame.Show(self.is_main)

    def clear(self, event=None):
        self.setSrc('')
        self.setResult('')
        smart_clipboard.copy('')
        self.last_append = ''

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
        if pressed:
            self.t1 = time.time()
            self.ori_x = x
            self.ori_y = y
        else:
            if time.time() - self.t1 > 0.3 and abs(self.ori_y - y) < 3 and abs(self.ori_x - x) < 3:
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

    @property
    def is_listen(self):
        return self['is_listen']

    @is_listen.setter
    def is_listen(self, value):
        self['is_listen'] = value
        self.mainFrame.listenCheck.SetValue(value)
        if value:
            self.mainFrame.timer.Start(2000)  # 设定时间间隔为1000毫秒,并启动定时器
            self.mouseListener = mouse.Listener(on_click=self.onLongClick)
            self.mouseListener.start()
        else:
            self.mainFrame.timer.Stop()
            self.mouseListener.stop()
        self.RefreshState()

    def ReverseListen(self, event):
        self.is_listen = not self.is_listen

    @property
    def is_copy(self):
        return self['is_copy']

    @is_copy.setter
    def is_copy(self, value):
        self['is_copy'] = value
        self.mainFrame.copyCheck.SetValue(self.is_copy)
        self.RefreshState()

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
            self.stored_source = self.mainFrame.tochoice.GetString(self.mainFrame.fromchoice.GetSelection())
            self.mainFrame.fromchoice.Disable()
            self.mainFrame.fromlabel.SetLabel("Detected Language")
        else:
            self.mainFrame.fromchoice.SetSelection(self.mainFrame.fromchoice.FindString(self.stored_source))
            self.mainFrame.fromchoice.Enable()
            self.mainFrame.fromlabel.SetLabel("Source Language")

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
        self.RefreshState()

    def ReverseContinus(self, event):
        self.clear()
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

    @property
    def is_dict(self):
        return self['smart_dict']

    @is_dict.setter
    def is_dict(self, value):
        self['smart_dict'] = value
        self.mainFrame.dictCheck.SetValue(value)

    def ReverseDict(self, event):
        self.is_dict = not self.is_dict
