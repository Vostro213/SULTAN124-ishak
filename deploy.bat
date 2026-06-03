@echo off
chcp 65001 >nul
echo ========================================
echo   نشر موقع SULTAN124 على GitHub Pages
echo ========================================
echo.

where git >nul 2>&1
if errorlevel 1 (
    echo [خطأ] Git غير مثبت على جهازك.
    echo.
    echo حمّل Git من: https://git-scm.com/download/win
    echo أو استخدم GitHub Desktop: https://desktop.github.com
    echo.
    pause
    exit /b 1
)

cd /d "%~dp0"

echo [1/4] بناء الموقع ونسخ index.html...
cd web
call npm install
call npm run build
cd ..

echo.
echo [2/4] رفع الكود إلى GitHub (فرع ishak)...
git add index.html 404.html assets docs web .github README.md package.json .gitignore deploy.bat
git add .
git commit -m "Deploy: index.html + assets for GitHub Pages" 2>nul
git push origin ishak
if errorlevel 1 (
    echo.
    echo إذا كان أول push:
    echo   git remote add origin https://github.com/Vostro213/SULTAN124.git
    echo   git push -u origin ishak
)

echo.
echo ========================================
echo   تم! الرابط:
echo   https://Vostro213.github.io/SULTAN124
echo ========================================
echo.
echo تأكد من: GitHub ^> Settings ^> Pages ^> Branch: ishak, Folder: / (root)
pause
