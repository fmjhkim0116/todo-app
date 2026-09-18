@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "C:\Users\fmjhk\Documents\todo-app"
call npm run preview -- --port 4174 --strictPort
