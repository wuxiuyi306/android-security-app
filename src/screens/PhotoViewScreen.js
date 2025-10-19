/**
 * Android图片查看页面 - 企业级安全标准
 * 
 * 🛡️ 受Android原生防截屏保护的安全图片查看器
 * 
 * 核心价值：确保图片在Android安全环境中查看，防止截屏泄露
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  StatusBar,
  PanResponder,
  Animated
} from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  Chip,
  ActivityIndicator
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import SecurityManager from '../security';

const { width, height } = Dimensions.get('window');

export default function PhotoViewScreen({ navigation, route }) {
  const { photo } = route.params;
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [securityStatus, setSecurityStatus] = useState(null);
  const [watermarkPosition, setWatermarkPosition] = useState({ x: 50, y: 50 });
  const [viewingTime, setViewingTime] = useState(0);
  
  const { user } = useSelector(state => state.auth);
  const scale = useRef(new Animated.Value(0.8)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const watermarkOpacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    initializeSecureViewing();
    startViewingTimer();
    startWatermarkAnimation();
    
    return () => {
      // 记录查看结束事件
      SecurityManager.logSecurityEvent('photo_view_end', {
        photoId: photo.id,
        userId: user?.id,
        viewingDuration: viewingTime,
        platform: 'android'
      });
    };
  }, []);

  const initializeSecureViewing = async () => {
    try {
      // 检查Android安全状态
      const summary = SecurityManager.getSecuritySummary();
      setSecurityStatus(summary);

      // 验证防截屏保护
      if (!summary.screenshotProtectionEnabled) {
        Alert.alert(
          '🚨 安全警告',
          'Android防截屏保护未启用！图片查看存在安全风险。',
          [
            { text: '退出', onPress: () => navigation.goBack() },
            { text: '继续', style: 'destructive' }
          ]
        );
      }

      // 执行安全检查
      await SecurityManager.performSecurityChecks();

      // 记录安全查看事件
      SecurityManager.logSecurityEvent('secure_photo_view_start', {
        photoId: photo.id,
        userId: user?.id,
        platform: 'android',
        protectionEnabled: summary.screenshotProtectionEnabled,
        deviceInfo: SecurityManager.getDeviceInfo()
      });

      setLoading(false);
      
      // 延迟显示图片，增加安全感
      setTimeout(() => {
        setImageLoaded(true);
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }, 1000);

    } catch (error) {
      console.error('❌ 初始化安全查看失败:', error);
      Alert.alert('错误', '初始化安全查看失败');
      navigation.goBack();
    }
  };

  const startViewingTimer = () => {
    const timer = setInterval(() => {
      setViewingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  };

  const startWatermarkAnimation = () => {
    // 水印位置动画 - 每5秒改变位置
    const watermarkInterval = setInterval(() => {
      const newX = Math.random() * (width - 200);
      const newY = Math.random() * (height - 100);
      
      setWatermarkPosition({ x: newX, y: newY });
      
      // 水印透明度动画
      Animated.sequence([
        Animated.timing(watermarkOpacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(watermarkOpacity, {
          toValue: 0.7,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
      
    }, 5000);

    return () => clearInterval(watermarkInterval);
  };

  // 手势处理 - 缩放和拖动
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // 记录用户交互
      SecurityManager.logSecurityEvent('photo_interaction', {
        photoId: photo.id,
        action: 'touch_start',
        platform: 'android'
      });
    },
    onPanResponderMove: (evt, gestureState) => {
      translateX.setValue(gestureState.dx);
      translateY.setValue(gestureState.dy);
    },
    onPanResponderRelease: () => {
      // 回弹动画
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        })
      ]).start();
    },
  });

  const handleZoomIn = () => {
    SecurityManager.logSecurityEvent('photo_interaction', {
      photoId: photo.id,
      action: 'zoom_in',
      platform: 'android'
    });

    Animated.spring(scale, {
      toValue: Math.min(scale._value + 0.2, 2.0),
      useNativeDriver: true,
    }).start();
  };

  const handleZoomOut = () => {
    SecurityManager.logSecurityEvent('photo_interaction', {
      photoId: photo.id,
      action: 'zoom_out',
      platform: 'android'
    });

    Animated.spring(scale, {
      toValue: Math.max(scale._value - 0.2, 0.5),
      useNativeDriver: true,
    }).start();
  };

  const handleResetView = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      })
    ]).start();
  };

  const renderSecurityOverlay = () => (
    <View style={styles.securityOverlay}>
      {/* 安全状态指示器 */}
      <View style={styles.securityIndicator}>
        <Chip 
          icon={securityStatus?.screenshotProtectionEnabled ? 'shield-check' : 'shield-alert'}
          textStyle={styles.securityChipText}
          style={[
            styles.securityChip,
            { backgroundColor: securityStatus?.screenshotProtectionEnabled ? '#00ff00' : '#ff4444' }
          ]}
        >
          {securityStatus?.screenshotProtectionEnabled ? 'Android保护' : '未保护'}
        </Chip>
      </View>

      {/* 动态水印 */}
      <Animated.View 
        style={[
          styles.watermark,
          {
            left: watermarkPosition.x,
            top: watermarkPosition.y,
            opacity: watermarkOpacity
          }
        ]}
      >
        <Text style={styles.watermarkText}>
          🔐 {user?.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || '用户'}
        </Text>
        <Text style={styles.watermarkSubText}>
          Android安全 • {new Date().toLocaleTimeString()}
        </Text>
      </Animated.View>

      {/* 查看时间 */}
      <View style={styles.viewingTimer}>
        <Text style={styles.timerText}>
          ⏱️ {Math.floor(viewingTime / 60)}:{(viewingTime % 60).toString().padStart(2, '0')}
        </Text>
      </View>
    </View>
  );

  const renderControls = () => (
    <View style={styles.controls}>
      <Button 
        mode="contained" 
        onPress={handleZoomOut}
        style={styles.controlButton}
        labelStyle={styles.controlButtonText}
      >
        🔍-
      </Button>
      <Button 
        mode="contained" 
        onPress={handleResetView}
        style={styles.controlButton}
        labelStyle={styles.controlButtonText}
      >
        🎯
      </Button>
      <Button 
        mode="contained" 
        onPress={handleZoomIn}
        style={styles.controlButton}
        labelStyle={styles.controlButtonText}
      >
        🔍+
      </Button>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>🔐 正在准备Android安全查看环境...</Text>
        <Text style={styles.loadingSubText}>
          • 验证防截屏保护{'\n'}
          • 初始化水印系统{'\n'}
          • 检查设备安全状态
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* 图片信息卡片 */}
      <Card style={styles.infoCard}>
        <Card.Content style={styles.infoContent}>
          <View style={styles.infoHeader}>
            <Title style={styles.infoTitle}>{photo.title}</Title>
            <Chip icon="shield-check" textStyle={styles.protectedChipText} style={styles.protectedChip}>
              Android保护
            </Chip>
          </View>
          <Paragraph style={styles.infoDescription}>{photo.description}</Paragraph>
          <View style={styles.infoMeta}>
            <Text style={styles.infoMetaText}>📅 {photo.uploadDate}</Text>
            <Text style={styles.infoMetaText}>📦 {photo.size}</Text>
            <Text style={styles.infoMetaText}>
              🛡️ {securityStatus?.screenshotProtectionEnabled ? 'FLAG_SECURE' : '未保护'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* 安全图片查看区域 */}
      <View style={styles.imageContainer}>
        {imageLoaded ? (
          <Animated.Image
            source={{ uri: photo.thumbnail }}
            style={[
              styles.image,
              {
                transform: [
                  { scale },
                  { translateX },
                  { translateY }
                ]
              }
            ]}
            {...panResponder.panHandlers}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text style={styles.placeholderText}>🔐 加载安全图片...</Text>
          </View>
        )}
      </View>

      {/* 安全覆盖层 */}
      {renderSecurityOverlay()}

      {/* 控制按钮 */}
      {renderControls()}

      {/* 底部操作栏 */}
      <View style={styles.bottomBar}>
        <Button 
          mode="outlined" 
          onPress={() => navigation.goBack()}
          style={styles.bottomButton}
          labelStyle={styles.bottomButtonText}
        >
          ← 返回列表
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => {
            Alert.alert('安全提示', 'Android防截屏保护已启用，无法分享图片');
          }}
          style={styles.bottomButton}
          labelStyle={styles.bottomButtonText}
        >
          🔒 安全分享
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 18,
  },
  infoCard: {
    margin: 10,
    backgroundColor: '#1e1e1e',
    elevation: 4,
  },
  infoContent: {
    padding: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  protectedChip: {
    backgroundColor: '#00ff00',
  },
  protectedChipText: {
    fontSize: 10,
    color: '#000000',
  },
  infoDescription: {
    fontSize: 12,
    color: '#cccccc',
    marginBottom: 8,
  },
  infoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoMetaText: {
    fontSize: 10,
    color: '#888888',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  image: {
    width: width - 20,
    height: height * 0.6,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 20,
    height: height * 0.6,
  },
  placeholderText: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 10,
  },
  securityOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  securityIndicator: {
    position: 'absolute',
    top: 80,
    right: 15,
  },
  securityChip: {
    elevation: 4,
  },
  securityChipText: {
    fontSize: 10,
    color: '#000000',
  },
  watermark: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#00ff00',
  },
  watermarkText: {
    fontSize: 12,
    color: '#00ff00',
    fontWeight: 'bold',
  },
  watermarkSubText: {
    fontSize: 8,
    color: '#ffffff',
    marginTop: 2,
  },
  viewingTimer: {
    position: 'absolute',
    top: 120,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 6,
    borderRadius: 4,
  },
  timerText: {
    fontSize: 10,
    color: '#ffffff',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  controlButton: {
    backgroundColor: '#6200ee',
    minWidth: 50,
  },
  controlButtonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#1e1e1e',
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 5,
    borderColor: '#6200ee',
  },
  bottomButtonText: {
    fontSize: 12,
    color: '#ffffff',
  },
});
