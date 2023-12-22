@echo off
echo TyuNotes-Frontend building starts.
SET TARGET_PATH=.\target

if exist %TARGET_PATH% (
    rd /s/q %TARGET_PATH%
)
mkdir %TARGET_PATH%
mkdir %TARGET_PATH%\note
cd .\note
call npm run build
echo Building finished successfully.
cd ..
xcopy /e /y /h /r .\note\dist\ %TARGET_PATH%\note\
xcopy /e /y /h /r .\css\ %TARGET_PATH%\css\
xcopy /e /y /h /r .\js\ %TARGET_PATH%\js\
xcopy .\index.html %TARGET_PATH%\