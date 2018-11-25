# -*- coding: utf-8 -*-
# @Time    : 2018/11/17 0017 22:48
# @Author  : Elliott Zheng
# @Email   : admin@hypercube.top
# @FileName: language.py
# @Software: PyCharm
import json

from googletranslator import GoogleLanguages

Chinese = {
    'Stay on Top': '始终置顶',
    'Detect Language': '检测语言',
    'Listen on Clipboard': '监听剪贴板',
    'Auto Copy': '自动复制',
    'Incremental Copy': '增量复制',
    'Smart Dict': '智能词典',
    "Switch Mode": '切换模式',
    "Translate": '翻译',
    "Source": '原文',
    'Copy Source': '复制原文',
    "Copy Result": '复制结果',
    "Result": '译文',
    'Source Language': '源语言',
    'Target Language': '目标语言',
    'Clear': '清空',
    'Help and Update': '帮助与更新',
    'Exit': '退出',
    'Main Mode': '对照模式',
    'Focus Mode': '专注模式',
    'Writing Mode': '写作模式',
    'Detected Language': '检测到语言',
    'Switch Language': '切换软件语言',
    'Auto Hide': '贴边隐藏',
    'Auto Formation': '自动格式化'
}

English = {k: k for k, v in Chinese.items()}


class LanguageManager:
    chinese_lang = 'zh-cn.json'
    English_lang = 'en.json'

    def __init__(self, language=None):
        self.value = None
        self.language = language
        self.switch_language(language)

    def switch_language(self, language):
        if language == None:
            return
        self.language = language
        path = GoogleLanguages[language] + '.json'
        myfile = open(path, 'r')
        self.value = json.load(myfile)
        myfile.close()

    def __call__(self, item):
        return self.value[item]

    def save(self, path):
        myfile = open(path, 'w')
        json.dump(self.value, myfile, indent=4)
        myfile.close()


# if __name__ == '__main__':
#     lang = LanguageManager()
#     lang.value=Chinese
#     lang.save('zh-cn.json')
#     print(lang.value)

if __name__ == '__main__':
    lang = LanguageManager()
    lang.value = English
    lang.save('en.json')
    lang.value = Chinese
    lang.save('zh-cn.json')
    # print(lang.value)
