# -*- coding: utf-8 -*-

import json
import uuid

import requests
from fake_useragent import UserAgent

ua = UserAgent()

SOGOU_API_URL = 'https://fanyi.sogou.com/reventondc/translateV1'

data = {
    'from': 'auto',
    'to': 'en',
    'client': 'pc',
    'fr': 'browser_pc',
    'text': '网络连接中断',
    'pid': 'sogou-dict-vr',
    'useDetect': 'on',
    'useDetectResult': 'off',
    'needQc': '1',
    # 'uuid': '6ec121b4-3917-401d-b883-a4cb304542e8',
    'uuid': str(uuid.uuid1()),
    'oxford': 'on',
    'isReturnSugg': 'on'
}
headers = {
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Connection': 'keep-alive',
    'Content-Length': '180',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    # 'Cookie': 'SNUID=0E13592F15116C4D403298B2157F49F6; SUID=1A064D3B2113940A000000005BC5E41F; ld=ulllllllll2beWyKlllllVsVixDllllln11ppkllll9lllll9llll5@@@@@@@@@@; SUV=1539695649365557; LSTMV=416%2C234; LCLKINT=3037; ABTEST=0|1539739176|v17; SELECTION_SWITCH=1; HISTORY_SWITCH=1; MTRAN_ABTEST=0; IPLOC=CN3502',
    'DNT': '1',
    'Host': 'fanyi.sogou.com',
    'Origin': 'https://fanyi.sogou.com',
    'Referer': 'https://fanyi.sogou.com/',
    # 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    'User-Agent': ua.chrome,
    'X-Requested-With': 'XMLHttpRequest',
}

res = requests.post(SOGOU_API_URL, data=data)
json_res = json.loads(res.text)
print(json_res['data']['translate']['dit'])
