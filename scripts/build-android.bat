@echo off
REM 🔐 Android企业级安全构建脚本 (Windows)
REM 
REM 核心价值：Windows环境下自动化构建Android安全APK

echo 🔒 开始Android企业级安全构建...

REM 检查Java环境
echo 📱 检查Android构建环境...
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java未安装，请安装JDK 11+
    exit /b 1
)

REM 检查Android SDK
if not defined ANDROID_HOME (
    echo ❌ ANDROID_HOME未设置，请配置Android SDK
    exit /b 1
)

REM 进入android目录
cd android

REM 清理构建
echo 🧹 清理之前的构建...
call gradlew.bat clean

REM 🛡️ 企业级安全检查
echo 🔐 执行安全检查...
call gradlew.bat printAndroidSecurityInfo

REM 构建Release APK
echo 🏗️ 构建企业级安全APK...
call gradlew.bat assembleRelease

REM 检查构建结果
if exist "app\build\outputs\apk\release\app-release.apk" (
    echo ✅ Android企业级安全APK构建成功！
    echo 📦 APK位置: android\app\build\outputs\apk\release\app-release.apk
    
    REM 显示APK信息
    echo 📊 APK信息:
    dir app\build\outputs\apk\release\app-release.apk
    
    echo 🎉 Android企业级安全构建完成！
) else (
    echo ❌ APK构建失败！
    exit /b 1
)
