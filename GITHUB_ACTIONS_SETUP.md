# 🔐 GitHub Actions构建Android企业级安全APK - 完整指南

## 🚀 快速开始（5分钟完成）

### 步骤1：准备GitHub仓库
1. 在GitHub上创建新仓库（或使用现有仓库）
2. 将整个`frontend-android`文件夹上传到仓库

### 步骤2：确认文件结构
确保您的GitHub仓库中有以下结构：
```
your-repo/
├── frontend-android/
│   ├── .github/
│   │   └── workflows/
│   │       └── build-android.yml  ✅ 已创建
│   ├── android/
│   │   ├── app/
│   │   │   └── src/main/java/com/photomanagerandroid/
│   │   │       ├── SecurityModule.java      ✅ 15,899 bytes
│   │   │       ├── SecurityPackage.java     ✅ 1,037 bytes  
│   │   │       ├── MainActivity.java        ✅ 4,272 bytes
│   │   │       └── MainApplication.java     ✅ 3,818 bytes
│   │   ├── build.gradle
│   │   └── gradlew
│   ├── src/
│   ├── package.json
│   └── ...其他文件
```

### 步骤3：触发构建
有三种方式触发构建：

#### 方式1：推送代码（自动触发）
```bash
git add .
git commit -m "🔐 添加Android企业级安全模块"
git push origin main
```

#### 方式2：手动触发（推荐）
1. 进入GitHub仓库页面
2. 点击 **Actions** 标签
3. 选择 **🔐 Android企业级安全APK构建**
4. 点击 **Run workflow**
5. 选择构建类型（Release/Debug）
6. 点击 **Run workflow**

#### 方式3：Pull Request触发
创建Pull Request时自动触发构建

## 📥 下载APK

### 构建完成后：
1. 进入 **Actions** 页面
2. 点击最新的构建任务
3. 滚动到底部找到 **Artifacts** 部分
4. 下载 `android-security-apk-release-xxx.zip`
5. 解压得到 `app-release.apk`

## 🔍 构建监控

### 实时查看构建过程：
1. 构建开始后，点击构建任务
2. 点击 **🏗️ 构建Android企业级安全APK**
3. 实时查看构建日志

### 构建时间：
- **首次构建**: 8-12分钟（需要下载依赖）
- **后续构建**: 5-8分钟（有缓存）

## 🛡️ 安全功能验证

构建完成的APK包含完整的Android原生安全模块：

### 核心安全功能：
- ✅ **FLAG_SECURE防截屏保护** - MainActivity.java实现
- ✅ **模拟器检测** - SecurityModule.java多重检测
- ✅ **Root检测** - SecurityModule.java企业级检测
- ✅ **开发者选项检测** - SecurityModule.java系统级检测
- ✅ **企业级零容忍安全策略** - AndroidSecurity.js实现

### 验证方法：
1. 安装APK到Android设备
2. 启动应用，查看安全状态显示
3. 尝试截屏 - 应该被阻止
4. 在模拟器中运行 - 应该检测到并警告

## 🔧 自定义配置

### 修改构建配置：
编辑 `.github/workflows/build-android.yml`：

```yaml
# 修改触发条件
on:
  push:
    branches: [ main, develop ]  # 添加更多分支
    
# 修改Node.js版本
- name: 🟢 设置Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # 使用Node.js 20
```

### 添加签名配置：
```yaml
- name: 🔐 签名APK
  run: |
    # 添加APK签名步骤
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
      -keystore ${{ secrets.KEYSTORE_FILE }} \
      app-release-unsigned.apk alias_name
```

## 🚨 常见问题

### Q: 构建失败怎么办？
A: 查看构建日志，常见问题：
- Node.js依赖安装失败 → 检查package.json
- Gradle构建失败 → 检查build.gradle配置
- 权限问题 → 确保gradlew有执行权限

### Q: APK在哪里下载？
A: Actions页面 → 选择构建任务 → Artifacts部分下载

### Q: 可以构建多个版本吗？
A: 可以，每次构建都会生成新的APK，保留30天

### Q: 构建时间太长？
A: 首次构建需要下载依赖，后续构建会使用缓存，速度更快

## 🎉 成功标志

当您看到以下信息时，表示构建成功：
```
✅ Android企业级安全APK构建完成!
📦 构建产物信息:
-rw-r--r-- 1 runner docker 25M Oct 19 15:30 app-release.apk
```

**恭喜！您的Android企业级安全APK已经成功构建，包含完整的原生安全模块！**
