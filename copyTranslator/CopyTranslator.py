import wx

from copyTranslator.setting import Setting


# import subprocess

def main():
    # subprocess.Popen('shortcut.bat',stdin = subprocess.PIPE, stdout = subprocess.PIPE)
    app = wx.App()
    setting = Setting()

    app.MainLoop()


if __name__ == '__main__':
    main()
