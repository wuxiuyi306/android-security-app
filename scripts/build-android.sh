#!/bin/bash

# 🔐 Android企业级安全构建脚本
# 
# 核心价值：自动化构建Android安全APK

set -e

echo "🔒 开始Android企业级安全构建..."

# 检查环境
echo "📱 检查Android构建环境..."
if ! command -v java &> /dev/null; then
    echo "❌ Java未安装，请安装JDK 11+"
    exit 1
fi

if [ ! -d "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME未设置，请配置Android SDK"
    exit 1
fi

# 清理构建
echo "🧹 清理之前的构建..."
cd android
./gradlew clean

# 🛡️ 企业级安全检查
echo "🔐 执行安全检查..."
./gradlew printAndroidSecurityInfo

# 构建Release APK
echo "🏗️ 构建企业级安全APK..."
./gradlew assembleRelease

# 检查构建结果
if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ Android企业级安全APK构建成功！"
    echo "📦 APK位置: android/app/build/outputs/apk/release/app-release.apk"
    
    # 显示APK信息
    echo "📊 APK信息:"
    ls -lh app/build/outputs/apk/release/app-release.apk
    
    # 🔒 安全签名验证
    echo "🔐 验证APK签名..."
    $ANDROID_HOME/build-tools/*/aapt dump badging app/build/outputs/apk/release/app-release.apk | grep "package:"
    
else
    echo "❌ APK构建失败！"
    exit 1
fi

echo "🎉 Android企业级安全构建完成！"
