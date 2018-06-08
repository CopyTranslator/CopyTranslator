pyi-makespec -i logo.ico -w CopyTranslator.py
pyinstaller CopyTranslator.spec
copy ./logo.ico ./dist/CopyTranslator/logo.ico
copy ./shortcut.bat ./dist/CopyTranslator/shortcut.bat
