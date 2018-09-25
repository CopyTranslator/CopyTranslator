# -*- coding: utf-8 -*-
# @Time    : 2018/9/25 0025 20:18
# @Author  : Yinglin Zheng
# @Email   : zhengyinglin@stu.xmu.edu.cn
# @FileName: update_checker.py
# @Software: PyCharm
# @Affiliation: XMU IPIC
from copyTranslator.constant import *
from urllib.request import *
import json
import wx
import webbrowser
import threading
import time


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
        if time.time() - setting['last_ask'] < 172800:
            return
        try:
            version_value = json.loads(urlopen(update_json_url).read().decode())
            new_version = version_value['version']
            if new_version <= version:
                return
            update_log = version_value['update_log']
            box = wx.MessageDialog(setting.mainFrame if setting.is_main else setting.subFrame,
                                   'Newer version of CopyTranslator ' + new_version + ' is available, update now?\n\n' + update_log,
                                   'Update', wx.YES_NO | wx.ICON_QUESTION)
            answer = box.ShowModal()
            if answer == wx.ID_YES:
                webbrowser.open(install_url)
            else:
                setting['last_ask'] = time.time()
            box.Destroy()
        except:
            pass

    @staticmethod
    def generate_json():
        value = {
            'version': version,
            'install_url': install_url,
            'update_log': load_log(log_path)
        }
        myfile = open('version.json', 'w')
        json.dump(value, myfile, indent=4)
        myfile.close()


class UpdateThread(threading.Thread):
    def __init__(self, parent):
        threading.Thread.__init__(self)
        self.parent = parent

    def run(self):
        UpdateChecker.check(self.parent)


if __name__ == '__main__':
    app = wx.App()
    UpdateChecker.check()
    app.MainLoop()
    # UpdateChecker.generate_json()
    # load_log(log_path)
