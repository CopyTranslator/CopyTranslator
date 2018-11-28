import wx

from copyTranslator.controller import Controller


# import subprocess

def main():
    # subprocess.Popen('shortcut.bat',stdin = subprocess.PIPE, stdout = subprocess.PIPE)
    app = wx.App()
    controller = Controller()

    app.MainLoop()


if __name__ == '__main__':
    main()
