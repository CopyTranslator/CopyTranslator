# -*- coding: utf-8 -*-
# @Time    : 2018/10/17 0017 17:19
# @Author  : Elliott Zheng
# @Email   : admin@hypercube.top
# @FileName: config.py
# @Software: PyCharm

import json
import os

import wx
from pynput import mouse

from constant import version
from copyTranslator.youdao import YoudaoSpider
from focusframe import FocusFrame
from googletranslator import GoogleTranslator
from mainframe import MainFrame
from myenum import *
from mypanel import MyPanel


class Config:
    def __init__(self, setting):
        self.setting = setting
        self.mouseListener = mouse.Listener(on_click=self.setting.onLongClick)
        self._default_value = {'author': 'Elliott Zheng',
                               'version': version,
                               'is_listen': False,
                               'is_copy': False,
                               'is_dete': False,
                               'stay_top': True,
                               'continus': False,
                               'smart_dict': True,
                               'frame_mode': FrameMode.main,
                               'translator_type': TranslatorType.GOOGLE,
                               'font_size': 15,
                               'focus_x': 100,
                               'focus_y': 100,
                               'focus_height': 150,
                               'focus_width': 300,
                               'source': 'English',
                               'target': 'Chinese (Simplified)',
                               'last_ask': 0
                               }
        self.value = self._default_value
        self.state = MyPanel.NOT_LISTEN
        self.filepath = os.path.expanduser('~/copytranslator.json')
        self.translator = None
        self.youdao_dict = YoudaoSpider()
        self.Mode1 = FrameMode.focus
        self.Mode2 = FrameMode.writing

    def initialize(self):
        self.mainFrame = self.setting.mainFrame
        self.subFrame = self.setting.subFrame
        self.writingFrame = self.setting.writingFrame

        self.load()
        self.activate()

        self.subFrame.SetSize(self['focus_x'], self['focus_y'], self['focus_width'], self['focus_height'])

    def activate(self):
        self.continus = self.continus
        self.stay_top = self.stay_top
        self.is_listen = self.is_listen
        self.is_dete = self.is_dete
        self.is_copy = self.is_copy
        self.frame_mode = self.frame_mode
        self.is_dict = self.is_dict
        self.switch_translator()

    def detect(self, string):
        return self.translator.detect(string)

    def translate(self, string, src, dest):
        return self.translator.translate(string, src=src, dest=dest)

    @property
    def source(self):
        return self.value['source']

    @source.setter
    def source(self, value):
        self['source'] = value

    @property
    def target(self):
        return self.value['target']

    @target.setter
    def target(self, value):
        self['target'] = value

    def load(self):
        if not os.path.exists(self.filepath):
            self.save(self.filepath)
            return self
        myfile = open(self.filepath, 'r')
        value = json.load(myfile)
        myfile.close()
        if value['version'] < 'v0.0.7.0':
            self.inherent(value)
        elif value['version'] >= 'v0.0.7.0':
            self.value = value
        self.save(self.filepath)
        return self

    def save(self, filepath=None):
        if filepath is None:
            filepath = self.filepath
        myfile = open(filepath, 'w')
        json.dump(self.value, myfile, indent=4)
        myfile.close()

    def inherent(self, old_value):
        self.continus = old_value['continus']
        self.stay_top = old_value['stay_top']
        self.is_listen = old_value['is_listen']
        self.is_dete = old_value['is_dete']
        self.is_copy = old_value['is_copy']
        self.frame_mode = FrameMode.main if old_value['is_main'] else FrameMode.focus  # TODO
        self.font_size = old_value['pixel_size']
        self.is_dict = old_value['smart_dict']

    def switch_translator(self, type=TranslatorType.GOOGLE):
        if type == TranslatorType.GOOGLE:
            self.translator = GoogleTranslator()

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
            self.mouseListener = mouse.Listener(on_click=self.setting.onLongClick)
            self.mouseListener.start()
        else:
            self.mainFrame.timer.Stop()
            self.mouseListener.stop()
        self.RefreshState()

    @property
    def is_copy(self):
        return self['is_copy']

    @is_copy.setter
    def is_copy(self, value):
        self['is_copy'] = value
        self.mainFrame.copyCheck.SetValue(value)
        self.RefreshState()

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
            self.mainFrame.fromchoice.SetSelection(self.mainFrame.fromchoice.FindString(self.setting.stored_source))
            self.mainFrame.fromchoice.Enable()
            self.mainFrame.fromlabel.SetLabel("Source Language")

    @property
    def stay_top(self):
        return self['stay_top']

    @stay_top.setter
    def stay_top(self, value):
        self['stay_top'] = value
        self.mainFrame.topCheck.SetValue(value)
        if value:
            self.subFrame.SetWindowStyle(wx.STAY_ON_TOP | FocusFrame.subStyle)
            self.mainFrame.SetWindowStyle(wx.STAY_ON_TOP | MainFrame.mainStyle)
        else:
            self.subFrame.SetWindowStyle(FocusFrame.subStyle)
            self.mainFrame.SetWindowStyle(MainFrame.mainStyle)

    @property
    def continus(self):
        return self['continus']

    @continus.setter
    def continus(self, value):
        self['continus'] = value
        self.mainFrame.continusCheck.SetValue(value)
        self.RefreshState()

    @property
    def font_size(self):
        return self['font_size']

    @font_size.setter
    def font_size(self, value):
        self['font_size'] = value

    @property
    def is_dict(self):
        return self['smart_dict']

    @is_dict.setter
    def is_dict(self, value):
        self['smart_dict'] = value
        self.mainFrame.dictCheck.SetValue(value)

    @property
    def translator_type(self):
        return self['translator_type']

    @translator_type.setter
    def translator_type(self, value):
        self['translator_type'] = value
        self.switch_translator(value)

    @property
    def frame_mode(self):
        return self['frame_mode']

    @frame_mode.setter
    def frame_mode(self, value):
        self['frame_mode'] = value
        if value == FrameMode.main:
            self.subFrame.Show(False)
            self.mainFrame.Show(True)
            self.writingFrame.Show(False)
            self.Mode1 = FrameMode.focus
            self.Mode2 = FrameMode.writing
        elif value == FrameMode.focus:
            self.subFrame.Show(True)
            self.mainFrame.Show(False)
            self.writingFrame.Show(False)
            self.Mode1 = FrameMode.main
            self.Mode2 = FrameMode.writing
        elif value == FrameMode.writing:
            self.subFrame.Show(False)
            self.mainFrame.Show(False)
            self.writingFrame.Show(True)
            self.Mode1 = FrameMode.main
            self.Mode2 = FrameMode.focus
