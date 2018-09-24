# -*- coding: utf-8 -*-
# @Time    : 2018/9/24 0024 9:01
# @Author  : Yinglin Zheng
# @Email   : zhengyinglin@stu.xmu.edu.cn
# @FileName: youdao.py
# @Software: PyCharm
# @Affiliation: XMU IPIC
# coding:utf-8

import re
import sys
import os
import requests
from requests.exceptions import RequestException
from termcolor import colored
from bs4 import BeautifulSoup


class YoudaoSpider:
    """
    通过有道获取单词解释, 以及展示查询结果
    """

    params = {
        'keyfrom': 'longcwang',
        'key': '131895274',
        'type': 'data',
        'doctype': 'json',
        'version': '1.1',
        'q': 'query'
    }
    api_url = u'http://fanyi.youdao.com/openapi.do'
    voice_url = u'http://dict.youdao.com/dictvoice?type=2&audio={word}'
    web_url = u'http://dict.youdao.com/w/eng/{0}/#keyfrom=dict2.index'

    error_code = {
        0: u'正常',
        20: u'要翻译的文本过长',
        30: u'无法进行有效的翻译',
        40: u'不支持的语言类型',
        50: u'无效的key',
        60: u'无词典结果，仅在获取词典结果生效'
    }

    result = {
        "query": "",
        "errorCode": 0,
    }

    def __init__(self, word):
        self.word = word

    def get_result(self, use_api=False):
        """
        获取查询结果
        :param use_api:是否使用有道API, 否则解析web版有道获取结果
        :return:与有道API返回的json数据一致的dict
        """
        try:
            if use_api:
                self.params['q'] = self.word
                r = requests.get(self.api_url, params=self.params)
                r.raise_for_status()  # a 4XX client error or 5XX server error response
                self.result = r.json()
            else:
                r = requests.get(self.web_url.format(self.word))
                r.raise_for_status()
                self.parse_html(r.text)
        except RequestException as e:
            print(colored(u'网络错误: %s' % e.message, 'red'))
            sys.exit()
        return self.result

    def parse_html(self, html):
        """
        解析web版有道的网页
        :param html:网页内容
        :return:result
        """
        soup = BeautifulSoup(html, "lxml")
        root = soup.find(id='results-contents')

        # query 搜索的关键字
        keyword = root.find(class_='keyword')
        if not keyword:
            self.result['query'] = self.word
        else:
            self.result['query'] = keyword.string

        # 基本解释
        basic = root.find(id='phrsListTab')
        if basic:
            trans = basic.find(class_='trans-container')
            if trans:
                self.result['basic'] = {}
                self.result['basic']['explains'] = [tran.string for tran in trans.find_all('li')]
                # 中文
                if len(self.result['basic']['explains']) == 0:
                    exp = trans.find(class_='wordGroup').stripped_strings
                    self.result['basic']['explains'].append(' '.join(exp))

                # 音标
                phons = basic(class_='phonetic', limit=2)
                if len(phons) == 2:
                    self.result['basic']['uk-phonetic'], self.result['basic']['us-phonetic'] = \
                        [p.string[1:-1] for p in phons]
                elif len(phons) == 1:
                    self.result['basic']['phonetic'] = phons[0].string[1:-1]

        # # 翻译
        # if 'basic' not in self.result:
        #     self.result['translation'] = self.get_translation(self.word)

        # 网络释义(短语)
        web = root.find(id='webPhrase')
        if web:
            self.result['web'] = [
                {
                    'key': wordgroup.find(class_='search-js').string.strip(),
                    'value': [v.strip() for v in wordgroup.find('span').next_sibling.split(';')]
                } for wordgroup in web.find_all(class_='wordGroup', limit=4)
            ]

    @staticmethod
    def show_result(result):
        """
        展示查询结果
        :param result: 与有道API返回的json 数据结构一致的dict
        """
        if 'stardict' in result:
            print(colored(u'StarDict:', 'blue'))
            print(result['stardict'])
            return

        if result['errorCode'] != 0:
            print(colored(YoudaoSpider.error_code[result['errorCode']], 'red'))
        else:
            print(colored('[%s]' % result['query'], 'magenta'))
            if 'basic' in result:
                if 'us-phonetic' in result['basic']:
                    print(colored(u'美音:', 'blue'), colored('[%s]' % result['basic']['us-phonetic'], 'green')),
                if 'uk-phonetic' in result['basic']:
                    print(colored(u'英音:', 'blue'), colored('[%s]' % result['basic']['uk-phonetic'], 'green'))
                if 'phonetic' in result['basic']:
                    print(colored(u'拼音:', 'blue'), colored('[%s]' % result['basic']['phonetic'], 'green'))

                print(colored(u'基本词典:', 'blue'))
                print(colored('\t' + '\n\t'.join(result['basic']['explains']), 'yellow'))

            if 'translation' in result:
                print(colored(u'有道翻译:', 'blue'))
                print(colored('\t' + '\n\t'.join(result['translation']), 'cyan'))

            if 'web' in result:
                print(colored(u'网络释义:', 'blue'))
                for item in result['web']:
                    print('\t' + colored(item['key'], 'cyan') + ': ' + '; '.join(item['value']))


if __name__ == '__main__':
    test = YoudaoSpider('what')
    YoudaoSpider.show_result(test.get_result())
