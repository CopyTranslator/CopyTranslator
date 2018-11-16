# -*- coding: utf-8 -*-
# @Time    : 2018/10/12 0012 16:23
# @FileName: sougoutranslator.py
# @Software: PyCharm
import hashlib
import json
import random

import requests

import copyTranslator.translator as  MyTranslator
from sogou import SogouLanguages


class SogouTranslate:
    SOGOU_API_URL = 'https://fanyi.sogou.com/reventondc/api/sogouTranslate'

    def __init__(self, pid: str = '643622c12fd6fa85330057a8c350a9e5',
                 secret_key: str = '3979d815ce33296f768b636a05ae196a'):
        if (not pid) or (not secret_key):
            raise Exception('pid or secret key cannot be empty')

        self.pid = pid
        self.secret_key = secret_key
        self.engine = 'sogou'

    def _generate_salt(self) -> str:
        return hashlib.sha256(str(random.getrandbits(256)).encode('utf-8')).hexdigest()[:19]

    def _compute_sign(self, source_text: str, salt: str) -> str:
        text = self.pid + source_text + salt + self.secret_key
        return hashlib.md5(text.encode('utf-8')).hexdigest()

    def _generate_data(self, source_text: str, from_language,
                       to_language):
        salt = self._generate_salt()
        data = {
            'q': source_text,  # text
            'from': from_language,  # from language
            'to': to_language,  # to language
            'pid': self.pid,  # pid
            'salt': salt,  # salt
            'sign': self._compute_sign(source_text, salt),  # sign
            'charset': 'utf-8',  # charset
            #     'callback': '', # optional for CORs
        }
        return data

    def translate(self, source_text: str, from_language=SogouLanguages['Auto'],
                  to_language=SogouLanguages['Chinese Simplified']):
        if not source_text:
            raise Exception('Source text does not exist')

        data = self._generate_data(
            source_text, from_language, to_language
        )
        res = requests.post(self.SOGOU_API_URL, data=data)

        if not res.ok:
            raise Exception(
                'Translation request is not successful'
            )

        json_res = json.loads(res.text)

        error_code = json_res['errorCode']
        if error_code != '0':
            return source_text

        return json_res['translation']


class SougouTranslator(MyTranslator.Translator):
    def __init__(self):
        pass

    def get_langlist(self):
        pass


if __name__ == '__main__':
    text = '均方误差'
    trans = SogouTranslate()
    zh_text = trans.translate(text)
    print(zh_text)
