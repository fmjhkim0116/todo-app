Set WshShell = CreateObject("WScript.Shell")

' start the local server hidden (no console window)
WshShell.Run """C:\Users\fmjhk\Documents\todo-app\start-server.bat""", 0, False

' give vite preview a moment to come up
WScript.Sleep 3000

' open the app in a chromeless Edge window, like an installed PWA
WshShell.Run """C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"" --app=http://localhost:4174 --window-size=420,640", 1, False
