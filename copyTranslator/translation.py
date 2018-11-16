# -*- coding: utf-8 -*-
# @Time    : 2018/11/16 0016 22:55
# @Author  : Elliott Zheng
# @Email   : admin@hypercube.top
# @FileName: translation.py
# @Software: PyCharm

# 单次翻译结果类

class Translation:
    PURE_TEXT = 0
    DICT_TEXT = 1

    def __init__(self, source, result, type=PURE_TEXT):
        self.souce = source
        self.result = result
        self.type = type


# 这个写的什么，不一定正确
class TranslationManager:
    def __init__(self):
        self.translations = []
        self.index = -1

    def add(self, translation):
        self.translations.append(translation)
        self.index = len(self.translations) - 1

    def next(self):
        if self.index != -1 and self.index < len(self.translations):
            self.index += 1
            return self.translations[self.index - 1]
        else:
            return None

    def prev(self):
        if self.index != -1 and self.index < len(self.translations):
            self.index -= 1
            return self.translations[self.index + 1]
        else:
            return None
