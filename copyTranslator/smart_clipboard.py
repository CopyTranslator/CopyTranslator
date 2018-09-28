# -*- coding: utf-8 -*-
# @Time    : 2018/9/28 0028 9:14
# @Author  : Yinglin Zheng
# @Email   : zhengyinglin@stu.xmu.edu.cn
# @FileName: smart_clipboard.py
# @Software: PyCharm
# @Affiliation: XMU IPIC

import win32clipboard as clipboard


def copy(value):
    clipboard.OpenClipboard()
    clipboard.SetClipboardText(value, clipboard.CF_UNICODETEXT)
    clipboard.CloseClipboard()


def paste():
    clipboard.OpenClipboard()
    try:
        data = clipboard.GetClipboardData(clipboard.CF_UNICODETEXT)
    except:
        data = ''
    clipboard.CloseClipboard()
    return data


def getTheClipboardType():
    formats = []
    clipboard.OpenClipboard()
    lastFormat = 0
    nextFormat = clipboard.EnumClipboardFormats(lastFormat)
    while True:
        nextFormat = clipboard.EnumClipboardFormats(lastFormat)
        if 0 == nextFormat:
            # all done -- get out of the loop
            break
        else:
            formats.append(nextFormat)
            lastFormat = nextFormat
    clipboard.CloseClipboard()
    return formats
