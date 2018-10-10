# -*- coding: utf-8 -*-
# @Time    : 2018/9/30 0030 11:33
# @Author  : Yinglin Zheng
# @Email   : zhengyinglin@stu.xmu.edu.cn
# @FileName: speech.py
# @Software: PyCharm
# @Affiliation: XMU IPIC

from aip import AipSpeech

""" 你的 APPID AK SK """
APP_ID = '14281625'
API_KEY = 'UGGTKdF2GVPcXLpMt4GGjWgm'
SECRET_KEY = 'inAmSQU697HZrhdI5H4AVmVjt5zDzGv8'

client = AipSpeech(APP_ID, API_KEY, SECRET_KEY)


# 读取文件
def get_file_content(filePath):
    with open(filePath, 'rb') as fp:
        return fp.read()


# 识别本地文件
t = client.asr(get_file_content(r'C:\Users\18350\Desktop\5.wav'), 'wav', 16000, {
    'dev_pid': 1536,
})
print(t)
