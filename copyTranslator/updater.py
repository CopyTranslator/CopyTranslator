# -*- coding: utf-8 -*-
# @Time    : 2018/10/16 0016 15:39
# @FileName: updater.py
# @Software: PyCharm
# origin source :https://blog.csdn.net/u013193899/article/details/78686039
# origin source https://blog.csdn.net/luoshengkim/article/details/46647423

# 低优先级的，带来一个血的教训，千万不要在用户文件夹测试代码。尤其是牵扯到文件删除的


import os
import subprocess
import sys
import zipfile


# 解压zip文件
def un_zip(file_name):
    """unzip zip file"""
    zip_file = zipfile.ZipFile(file_name)
    if os.path.isdir(file_name + "_files"):
        pass
    else:
        os.mkdir(file_name + "_files")
    for names in zip_file.namelist():
        zip_file.extract(names, file_name + "_files/")
    zip_file.close()


# 编写bat脚本，删除旧程序，运行新程序
def WriteRestartCmd():
    bat_path = os.path.join(os.path.dirname(sys.path[0]), "upgrade.bat")
    # 新程序启动时，删除旧程序制造的脚本
    if os.path.isfile(bat_path):
        os.remove(bat_path)
    old_dir = sys.path[0]
    temp_dir = sys.path[0] + '_temp'
    b = open(bat_path, 'w')
    # TempList = "@echo off\n"   #关闭bat脚本的输出
    TempList = ""  #
    TempList += "if not exist " + temp_dir + " exit \n"  # 临时目录不存在,退出脚本执行
    TempList += "@ping 127.0.0.1 -n 5 -w 3000 > nul\n"  # 3秒后删除旧程序（3秒后程序已运行结束，不延时的话，会提示被占用，无法删除）
    TempList += "rmdir /s/q " + old_dir + "\n"  # 删除原来的文件夹
    TempList += "move  " + temp_dir + ' ' + old_dir + "\n"  # 重命名已解压的新的文件夹
    TempList += "start " + os.path.join(old_dir, 'copytranslator.exe')  # 启动新程序
    b.write(TempList)
    b.close()
    subprocess.Popen(bat_path)
    sys.exit()  # 进行升级，退出此程序


def main():
    WriteRestartCmd()


if __name__ == '__main__':
    main()
    sys.exit()
