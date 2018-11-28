@echo off

::设置程序或文件的完整路径（必选）

set Program=%~dp0CopyTranslator.exe

 

::设置快捷方式名称（必选）

set LnkName=CopyTranslator

 

::设置程序的工作路径，一般为程序主目录，此项若留空，脚本将自行分析路径

set WorkDir=%~dp0

 

::设置快捷方式显示的说明（可选）

set Desc=Foreign language assisted reading and translation solution

 

if not defined WorkDir call:GetWorkDir "%Program%"

(echo Set WshShell=CreateObject("WScript.Shell"^)

echo strDesKtop=WshShell.SpecialFolders("DesKtop"^)

echo Set oShellLink=WshShell.CreateShortcut(strDesKtop^&"\%LnkName%.lnk"^)

echo oShellLink.TargetPath="%Program%"

echo oShellLink.WorkingDirectory="%WorkDir%"

echo oShellLink.WindowStyle=1

echo oShellLink.Description="%Desc%"

echo oShellLink.Save)>makelnk.vbs

echo 桌面快捷方式创建成功！

makelnk.vbs

del /f /q makelnk.vbs

exit

goto :eof

:GetWorkDir

set WorkDir=%~dp1

set WorkDir=%WorkDir:~,-1%

goto :eof