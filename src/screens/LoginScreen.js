/**
 * Android登录页面 - 企业级安全标准
 * 
 * 🔒 集成Android原生安全检测的登录界面
 * 
 * 核心价值：确保只有在Android安全环境中才能登录
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import SecurityManager from '../security';

export default function LoginScreen({ navigation, route }) {
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [securityStatus, setSecurityStatus] = useState(null);
  
  const dispatch = useDispatch();

  useEffect(() => {
    // 获取Android安全状态
    const getSecurityStatus = async () => {
      try {
        const summary = SecurityManager.getSecuritySummary();
        const deviceInfo = SecurityManager.getDeviceInfo();
        
        setSecurityStatus({
          ...summary,
          deviceInfo
        });

        // 显示Android安全状态
        console.log('🔐 Android安全状态:', summary);
        
      } catch (error) {
        console.error('❌ 获取Android安全状态失败:', error);
      }
    };

    getSecurityStatus();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);

      // 验证输入
      if (!phone || !idCard || !birthDate) {
        Alert.alert('错误', '请填写所有字段');
        return;
      }

      // 手机号验证
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        Alert.alert('错误', '请输入正确的手机号');
        return;
      }

      // 身份证后四位验证
      if (!/^\d{4}$/.test(idCard)) {
        Alert.alert('错误', '请输入身份证后四位数字');
        return;
      }

      // 出生日期验证
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
        Alert.alert('错误', '请输入正确的出生日期格式 (YYYY-MM-DD)');
        return;
      }

      // 🔒 执行Android安全检查
      console.log('🔍 执行登录前Android安全检查...');
      const securityChecks = await SecurityManager.performSecurityChecks();
      
      // 检查是否有关键安全违规
      const criticalViolations = securityChecks.filter(v => v.severity === 'critical');
      if (criticalViolations.length > 0) {
        Alert.alert(
          '🔒 Android安全检查失败',
          '检测到关键安全违规，无法登录。请在安全的Android设备上使用应用。',
          [{ text: '确定' }]
        );
        return;
      }

      // 验证Android防截屏保护
      if (!SecurityManager.isScreenshotProtectionEnabled()) {
        Alert.alert(
          '⚠️ 安全警告',
          'Android防截屏保护未启用，登录可能存在安全风险。',
          [
            { text: '取消', style: 'cancel' },
            { text: '继续', onPress: () => proceedWithLogin() }
          ]
        );
        return;
      }

      await proceedWithLogin();

    } catch (error) {
      console.error('❌ 登录失败:', error);
      Alert.alert('错误', '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const proceedWithLogin = async () => {
    try {
      // 模拟登录API调用
      const loginData = {
        phone,
        idCard,
        birthDate,
        platform: 'android',
        deviceInfo: securityStatus?.deviceInfo,
        securityChecks: await SecurityManager.performSecurityChecks(),
        timestamp: new Date().toISOString()
      };

      // 记录登录事件
      SecurityManager.logSecurityEvent('user_login_attempt', {
        phone: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
        platform: 'android',
        securityProtected: SecurityManager.isScreenshotProtectionEnabled()
      });

      // 模拟API响应
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            token: 'mock_jwt_token_' + Date.now(),
            user: {
              id: 1,
              phone: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
              role: 'user',
              platform: 'android'
            }
          });
        }, 1500);
      });

      if (response.success) {
        // 登录成功
        dispatch(login({
          token: response.token,
          user: response.user
        }));

        SecurityManager.logSecurityEvent('user_login_success', {
          userId: response.user.id,
          platform: 'android'
        });

        Alert.alert(
          '✅ 登录成功',
          `欢迎使用Android安全图片管理系统\n\n设备：${securityStatus?.deviceInfo?.manufacturer} ${securityStatus?.deviceInfo?.model}\n安全状态：${SecurityManager.isScreenshotProtectionEnabled() ? '🛡️ 已保护' : '⚠️ 未保护'}`,
          [{ text: '确定', onPress: () => navigation.replace('Home') }]
        );
      }

    } catch (error) {
      console.error('❌ 登录处理失败:', error);
      Alert.alert('错误', '登录处理失败，请重试');
    }
  };

  const renderSecurityStatus = () => {
    if (!securityStatus) {
      return (
        <Card style={styles.securityCard}>
          <Card.Content>
            <Text style={styles.securityTitle}>🔍 正在检查Android安全状态...</Text>
          </Card.Content>
        </Card>
      );
    }

    const isSecure = securityStatus.screenshotProtectionEnabled && 
                     securityStatus.nativeModuleAvailable;

    return (
      <Card style={[styles.securityCard, { backgroundColor: isSecure ? '#1b5e20' : '#bf360c' }]}>
        <Card.Content>
          <Text style={styles.securityTitle}>
            {isSecure ? '🛡️ Android安全环境' : '⚠️ 安全状态异常'}
          </Text>
          <Text style={styles.securityText}>
            • 防截屏保护: {securityStatus.screenshotProtectionEnabled ? '✅ 已启用' : '❌ 未启用'}
          </Text>
          <Text style={styles.securityText}>
            • 原生模块: {securityStatus.nativeModuleAvailable ? '✅ 可用' : '❌ 不可用'}
          </Text>
          {securityStatus.deviceInfo && (
            <>
              <Text style={styles.securityText}>
                • 设备: {securityStatus.deviceInfo.manufacturer} {securityStatus.deviceInfo.model}
              </Text>
              <Text style={styles.securityText}>
                • Android: API {securityStatus.deviceInfo.sdkInt}
              </Text>
            </>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Title style={styles.title}>🔐 Android安全图片管理系统</Title>
          <Paragraph style={styles.subtitle}>企业级安全 • Android原生保护</Paragraph>
        </View>

        {renderSecurityStatus()}

        <Card style={styles.loginCard}>
          <Card.Content>
            <Title style={styles.loginTitle}>安全登录</Title>
            
            <TextInput
              label="手机号"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              keyboardType="phone-pad"
              maxLength={11}
              style={styles.input}
              left={<TextInput.Icon icon="phone" />}
            />

            <TextInput
              label="身份证后四位"
              value={idCard}
              onChangeText={setIdCard}
              mode="outlined"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              style={styles.input}
              left={<TextInput.Icon icon="card-account-details" />}
            />

            <TextInput
              label="出生日期 (YYYY-MM-DD)"
              value={birthDate}
              onChangeText={setBirthDate}
              mode="outlined"
              placeholder="1990-01-01"
              maxLength={10}
              style={styles.input}
              left={<TextInput.Icon icon="calendar" />}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              contentStyle={styles.loginButtonContent}
            >
              {loading ? '正在验证...' : '🔐 安全登录'}
            </Button>

            <Text style={styles.disclaimer}>
              * 本系统采用Android原生安全模块保护{'\n'}
              * 登录过程受企业级安全监控{'\n'}
              * 仅支持在安全Android设备上使用
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#00ff00',
    textAlign: 'center',
  },
  securityCard: {
    marginBottom: 20,
    elevation: 4,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  securityText: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 4,
  },
  loginCard: {
    backgroundColor: '#1e1e1e',
    elevation: 8,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#2a2a2a',
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#6200ee',
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  disclaimer: {
    fontSize: 11,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 16,
  },
});
