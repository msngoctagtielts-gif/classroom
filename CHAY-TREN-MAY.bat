@echo off
chcp 65001 >nul
setlocal
title Ms.Ngoc Elite English - Bo dung slide Kid's Box

REM ── Duong dan kho giao trinh tren may co. Sua dong duoi neu kho nam cho khac. ──
set "KHO_KIDSBOX=D:\KHO-MSNGOC\1_NOI-BO\01_NGUON-NXB\KIDS-BOX"

echo.
echo ===========================================================
echo   Ms.Ngoc Elite English - Kid's Box
echo   Kho giao trinh: %KHO_KIDSBOX%
echo ===========================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [X] Chua cai Node.js.
  echo     Tai ban LTS tai https://nodejs.org roi chay lai file nay.
  echo.
  pause
  exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do echo [v] Node.js %%v

cd /d "%~dp0build"

if not exist node_modules (
  echo.
  echo [1/4] Cai thu vien lan dau, doi mot chut...
  call npm install --no-audit --no-fund
  if errorlevel 1 ( echo [X] Cai that bai. & pause & exit /b 1 )
)

echo.
echo [2/4] Quet kho giao trinh...
call node scan-kho.js "%KHO_KIDSBOX%"

echo.
echo [3/4] Dung slide...
call node deck.js lessons/kb1-u01-l01.js
if errorlevel 1 ( echo [!] Co slide vuot ngan sach chu - xem o tren. )

echo.
echo [4/4] Soi file .pptx vua dung...
call node audit-deck.js ../slides/KIDS_KB1_U01_L01.pptx

echo.
echo ===========================================================
echo   XONG. File slide nam trong thu muc: slides\
echo   File kiem ke kho nam trong: research\kho-inventory.json
echo   Co gui file kho-inventory.json vao khung chat cho em.
echo ===========================================================
echo.
pause
