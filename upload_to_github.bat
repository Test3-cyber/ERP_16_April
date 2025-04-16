@echo off
cd /d C:\ERP_16_April
set /p msg="Enter commit message: "
git add .
git commit -m "%msg%"
git push origin main
pause
