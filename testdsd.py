# coding:utf - 8
import random
from urllib.request import Request
from urllib.request import urlopen


def getContent(url, headers):
    """
    此函数用于抓取返回403禁止访问的网页
    """
    random_header = random.choice(headers)

    """
    对于Request中的第二个参数headers，它是字典型参数，所以在传入时
    也可以直接将个字典传入，字典中就是下面元组的键值对应
    """
    req = Request(url)
    req.add_header("User-Agent", random_header)
    req.add_header("GET", url)
    req.add_header("Host", "fanyi.sogou.com")
    req.add_header("Referer", "https://fanyi.sogou.com/")
    req.add_header('Origin', 'https://fanyi.sogou.com')
    req.add_header('X-Requested-With', 'XMLHttpRequest')

    content = urlopen(req)
    content = content.read().decode("utf-8")
    return content


url = "https://fanyi.sogou.com/#ko/zh-CHS/hello"
# 这里面的my_headers中的内容由于是个人主机的信息，所以我就用句号省略了一些，在使用时可以将自己主机的
my_headers = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"]
print(getContent(url, my_headers))
