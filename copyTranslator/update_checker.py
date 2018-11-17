# -*- coding: utf-8 -*-
# @Time    : 2018/9/25 0025 20:18
# @Author  : Elliott Zheng
# @FileName: update_checker.py
# @Software: PyCharm

import json
import threading
import time
import webbrowser
from urllib.request import *

import wx

from copyTranslator.constant import *


def load_log(filepath):
    myfile = open(filepath, 'r')
    lines = myfile.readlines()
    log = ''
    for line in lines:
        log += line
    myfile.close()
    return log


class UpdateChecker:
    def __init__(self):
        pass

    @staticmethod
    def check(setting):
        if time.time() - setting.config['last_ask'] < 172800:
            return
        try:
            string = urlopen(update_json_url).read().decode()
            string = string[string.find('{'):]

            version_value = json.loads(string)
            new_version = version_value['version']
            if new_version <= version:
                return

            update_log = version_value['update_log']
            box = wx.MessageDialog(setting.get_current_frame(),
                                   levels_log[version_value[
                                       'level']] + ' ' + new_version + ' is available, update now?\n\n' + update_log,
                                   'Update', wx.YES_NO | wx.ICON_QUESTION)
            answer = box.ShowModal()
            if answer == wx.ID_YES:
                webbrowser.open(install_url)
            else:
                setting.config['last_ask'] = time.time()
            box.Destroy()
        except:
            pass

    @staticmethod
    def generate_json():
        '''

        :return:
        '''
        value = {
            'version': version,
            'install_url': install_url,
            'update_log': load_log(log_path),
            'level': level
        }
        myfile = open('version.json', 'w')
        string = 'version=' + json.dumps(value)
        myfile.write(string)
        myfile.close()


class UpdateThread(threading.Thread):
    def __init__(self, parent):
        threading.Thread.__init__(self)
        self.parent = parent

    def run(self):
        UpdateChecker.check(self.parent)


if __name__ == '__main__':
    # app = wx.App()
    # UpdateChecker.check()
    # app.MainLoop()
    UpdateChecker.generate_json()
    # load_log(log_path)
