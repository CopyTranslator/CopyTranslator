# -*- coding: utf-8 -*-
# @Time    : 2018/9/24 0024 9:01
# @Author  : Elliott Zheng
# @FileName: youdao.py
# @Software: PyCharm

# original source: https://github.com/longcw/youdao/blob/master/youdao/spider.py
# original author: https://github.com/longcw

import requests
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
    web_url = u'http://dict.youdao.com/w/eng/{0}/#keyfrom=dict2.index'
    error_code = {
        0: '正常',
        20: '要翻译的文本过长',
        30: '无法进行有效的翻译',
        40: '不支持的语言类型',
        50: '无效的key',
        60: '无词典结果，仅在获取词典结果生效',
        70: '无法连接到Youdao'
    }

    result = {
        "query": "",
        "errorCode": 0,
    }

    def __init__(self):
        pass

    def get_result(self, word, use_api=False):
        """
        获取查询结果
        :param use_api:是否使用有道API, 否则解析web版有道获取结果
        :return:与有道API返回的json数据一致的dict
        """
        try:
            if use_api:
                self.params['q'] = word
                r = requests.get(self.api_url, params=self.params)
                r.raise_for_status()  # a 4XX client error or 5XX server error response
                self.result = r.json()
            else:
                r = requests.get(self.web_url.format(word))
                r.raise_for_status()
                self.parse_html(word, r.text)
        except:
            return {
                'errorCode': 70
            }
        return self.result

    def parse_html(self, word, html):
        """
        解析web版有道的网页
        :param html:网页内容
        :return:result
        """
        self.result = {
            "query": "",
            "errorCode": 0,
        }
        soup = BeautifulSoup(html, "lxml")
        root = soup.find(id='results-contents')

        # query 搜索的关键字
        keyword = root.find(class_='keyword')
        if not keyword:
            self.result['query'] = word
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

        # 网络释义(短语)
        web = root.find(id='webPhrase')
        if web:
            self.result['web'] = [
                {
                    'key': wordgroup.find(class_='search-js').string.strip(),
                    'value': [v.strip() for v in wordgroup.find('span').next_sibling.split(';')]
                } for wordgroup in web.find_all(class_='wordGroup', limit=4)
            ]


if __name__ == '__main__':
    test = YoudaoSpider()
    print(test.get_result('come to'))
