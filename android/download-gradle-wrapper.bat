@echo off
echo 🔐 下载Android企业级安全项目的Gradle Wrapper...

REM 创建临时目录
if not exist "temp" mkdir temp

REM 下载gradle-wrapper.jar
echo 正在下载gradle-wrapper.jar...
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/gradle/gradle/raw/v7.6.3/gradle/wrapper/gradle-wrapper.jar' -OutFile 'temp\gradle-wrapper.jar'"

REM 检查下载是否成功
if exist "temp\gradle-wrapper.jar" (
    echo ✅ 下载成功，正在复制到正确位置...
    copy "temp\gradle-wrapper.jar" "gradle\wrapper\gradle-wrapper.jar"
    
    REM 清理临时文件
    rmdir /s /q temp
    
    echo ✅ gradle-wrapper.jar 已就绪
    echo 🏗️ 现在可以构建APK了：
    echo    .\gradlew.bat assembleRelease
) else (
    echo ❌ 下载失败，请手动下载gradle-wrapper.jar
    echo 📁 放置位置：gradle\wrapper\gradle-wrapper.jar
)

pause
