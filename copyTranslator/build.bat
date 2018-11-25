pyi-makespec -i logo.ico -w CopyTranslator.py
pyinstaller --clean CopyTranslator.spec
cp ./logo.ico ./dist/CopyTranslator/logo.ico
cp ./shortcut.bat ./dist/CopyTranslator/shortcut.bat
cp ./zh-cn.json ./dist/CopyTranslator/zh-cn.json
cp ./en.json ./dist/CopyTranslator/en.json

