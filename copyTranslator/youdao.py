# -*- coding: utf-8 -*-
# @Time    : 2018/9/24 0024 9:01
# @Author  : Elliott Zheng
# @FileName: youdao.py
# @Software: PyCharm

# original source:https://github.com/93Alliance/Translator
# original author: 93Alliance

import sys
import requests
from requests.exceptions import RequestException
from termcolor import colored



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
    # web_url = u'http://dict.youdao.com/w/eng/{0}/#keyfrom=dict2.index'

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

    def __init__(self):
        pass

    def get_result(self, word):
        """
        获取查询结果
        :param use_api:是否使用有道API, 否则解析web版有道获取结果
        :return:与有道API返回的json数据一致的dict
        """
        try:
            self.params['q'] = word
            r = requests.get(self.api_url, params=self.params)
            r.raise_for_status()  # a 4XX client error or 5XX server error response
            self.result = r.json()
        except RequestException as e:
            print(colored(u'网络错误: %s' % e.message, 'red'))
            sys.exit()
        return self.result

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
    test = YoudaoSpider()
    print(test.get_result('come to'))
