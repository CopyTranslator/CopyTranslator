# -*- coding: utf-8 -*-
# @Time    : 2018/9/25 0025 17:49
# @Author  : Elliott Zheng
# @FileName: setting.py
# @Software: PyCharm

import threading
import time

import pyperclip as smart_clipboard
import regex as re
from pynput.keyboard import Key, Controller

from config import Config
from copyTranslator.focusframe import FocusFrame
from copyTranslator.mainframe import MainFrame
from copyTranslator.mypanel import MyPanel
from copyTranslator.taskbar import TaskBarIcon
from copyTranslator.translation import Translation
from copyTranslator.update_checker import UpdateThread
from copyTranslator.writingframe import WritingFrame
from language import LanguageManager
from myenum import *


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

        self.setting.subFrame.panel.SetState(self.setting.config.state)


class DictThread(threading.Thread):
    def __init__(self, setting):
        threading.Thread.__init__(self)
        self.setting = setting

    def run(self):
        self.setting.youdao_smart_dict(None)
        self.setting.subFrame.panel.SetState(self.setting.config.state)


# 只要有一个汉字就是中文
def check_contain_chinese(check_str):
    for ch in check_str:
        if u'\u4e00' <= ch <= u'\u9fff':
            return True
    return False


class Setting():
    def __init__(self):
        # Collect events until released
        self.keyboard = Controller()
        self.ori_x = 0
        self.ori_y = 0
        self.t1 = time.time()

        self.src = ''
        self.last_append = ''
        self.result = ''

        self.is_word = False
        self.config = Config(self)
        self.config.load()
        self.language = LanguageManager(self.config['language'])
        self.taskbar = TaskBarIcon(self)
        self.mainFrame = MainFrame(self)
        self.subFrame = FocusFrame(self)
        self.writingFrame = WritingFrame(self)
        self.stored_source = self.source
        self.config.initialize()

        self.mainFrame.Centre()
        # self.mainFrame.Show()
        self.patterns = [re.compile(r'([?!.])[ ]?\n'), re.compile(r'([？！。])[ \n]')]  # 前面一个处理英语语系的，后面一个可以处理汉语系。
        self.pattern2 = re.compile(r'\$([?？！!.。])\$')

        UpdateThread(self).start()

    def resume_translation(self, translation):
        self.src = translation
        if translation.type == Translation.PURE_TEXT:
            self.result = translation.result
            self.subFrame.destText.SetValue(self.result)
            self.mainFrame.destText.SetValue(self.result)
        else:
            self.result = translation.result['translation']
            self.set_word_result(translation.result)

    def get_src_target(self):
        src = self.mainFrame.tochoice.GetString(self.mainFrame.fromchoice.GetSelection())
        target = self.mainFrame.tochoice.GetString(self.mainFrame.tochoice.GetSelection())
        return src, target

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

    def ToWriting(self, event):
        self.subFrame.Show(False)
        self.mainFrame.Show(False)
        self.writingFrame.Show(True)

    def save_config(self):
        # print(self.subFrame.GetSize())
        self.config['focus_x'], self.config['focus_y'] = self.subFrame.GetPosition()
        self.config['focus_width'], self.config['focus_height'] = self.subFrame.GetSize()
        self.config.source, self.config.target = self.get_src_target()
        self.config.save()

    def OnExit(self, event):
        self.save_config()
        self.mainFrame.Destroy()
        self.subFrame.Destroy()
        self.writingFrame.Destroy()
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

    def getExpSrc(self):
        return self.mainFrame.srcText.GetValue()

    def getResult(self):
        return self.result

    # 智能互译
    def smart_translate(self, event):
        show = (event != False)
        src_lang = self.config.detect(self.src)
        should_src, dest_lang = self.get_src_target()

        if self.is_dete:
            self.mainFrame.fromchoice.SetSelection(self.mainFrame.fromchoice.FindString(src_lang))

        if src_lang == dest_lang:
            src_lang, dest_lang = dest_lang, should_src
        else:
            src_lang = should_src

        if self.result != self.src:
            self.setResult(self.config.translate(self.src, src=src_lang, dest=dest_lang), show)

    def youdao_smart_dict(self, event):
        if self.result != self.src:
            result = self.config.youdao_dict.get_result(self.src)
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
            self.is_word = self.config.is_dict and (len(append.split()) <= 3) and not check_contain_chinese(
                append) and not self.config.continus
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
            self.config.frame_mode = FrameMode.main
        elif event.Id == self.taskbar.ID_Focus:
            self.config.frame_mode = FrameMode.focus
        elif event.Id == self.subFrame.destText.ID_Mode1 or event.Id == self.taskbar.ID_Mode1:
            self.config.frame_mode = self.config.Mode1
        elif event.Id == self.subFrame.destText.ID_Mode2 or event.Id == self.taskbar.ID_Mode2:
            self.config.frame_mode = self.config.Mode2

    def clear(self, event=None):
        self.setSrc('')
        self.setResult('')
        smart_clipboard.copy('')
        self.last_append = ''

    def SwitchMode(self, event):
        self.config.frame_mode = self.config.Mode1

    def get_current_frame(self):
        if self.config.frame_mode == FrameMode.main:
            frame = self.mainFrame
        elif self.config.frame_mode == FrameMode.focus:
            frame = self.subFrame
        else:
            frame = self.writingFrame
        return frame

    def OnTaskBarLeftDClick(self, event):
        frame = self.get_current_frame()
        if frame.IsIconized():
            frame.Iconize(False)
        if not frame.IsShown():
            frame.Show(True)
        frame.Raise()

    def BossKey(self, evt):
        value = self.config.frame_mode
        if value == FrameMode.main:
            frame = self.mainFrame
        elif value == FrameMode.focus:
            frame = self.subFrame
        else:
            frame = self.writingFrame

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

    def ReverseDete(self, event):
        self.config.is_dete = not self.config.is_dete

    def ReverseCopy(self, event):
        self.config.is_copy = not self.config.is_copy

    def ReverseContinus(self, event):
        self.clear()
        self.config.continus = not self.config.continus

    def ReverseDict(self, event):
        self.config.is_dict = not self.config.is_dict

    def ReverseStayTop(self, event):
        self.config.stay_top = not self.config.stay_top

    def ReverseListen(self, event):
        self.config.is_listen = not self.config.is_listen

    @property
    def source(self):
        return self.config.source

    @property
    def target(self):
        return self.config.target

    @property
    def is_listen(self):
        return self.config.is_listen

    @property
    def is_copy(self):
        return self.config.is_copy

    @property
    def is_dete(self):
        return self.config.is_dete

    @property
    def stay_top(self):
        return self.config.stay_top

    @property
    def continus(self):
        return self.config.continus

    @property
    def is_dict(self):
        return self.config.is_dict

    @property
    def font_size(self):
        return self.config.font_size

    @property
    def frame_mode(self):
        return self.config.frame_mode
