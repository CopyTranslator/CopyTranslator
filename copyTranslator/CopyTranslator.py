import wx
from copyTranslator.setting import Setting


def main():
    app = wx.App()
    setting = Setting()
    app.MainLoop()


if __name__ == '__main__':
    main()
