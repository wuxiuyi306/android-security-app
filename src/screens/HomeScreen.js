/**
 * Android主页面 - 企业级安全标准
 * 
 * 🔒 集成Android原生安全保护的主界面
 * 
 * 核心价值：在Android安全环境中管理图片
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  StatusBar,
  RefreshControl,
  Dimensions
} from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  FAB, 
  Chip,
  Avatar,
  Divider
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import SecurityManager from '../security';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [securityStatus, setSecurityStatus] = useState(null);
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    loadPhotos();
    checkSecurityStatus();
    
    // 定期检查Android安全状态
    const securityInterval = setInterval(checkSecurityStatus, 30000); // 每30秒检查一次
    
    return () => clearInterval(securityInterval);
  }, []);

  const checkSecurityStatus = async () => {
    try {
      const summary = SecurityManager.getSecuritySummary();
      const deviceInfo = SecurityManager.getDeviceInfo();
      
      setSecurityStatus({
        ...summary,
        deviceInfo
      });

      // 如果安全状态异常，执行安全检查
      if (!summary.screenshotProtectionEnabled || !summary.nativeModuleAvailable) {
        console.warn('⚠️ Android安全状态异常，执行安全检查...');
        await SecurityManager.performSecurityChecks();
      }
      
    } catch (error) {
      console.error('❌ Android安全状态检查失败:', error);
    }
  };

  const loadPhotos = async () => {
    try {
      setLoading(true);
      
      // 记录访问事件
      SecurityManager.logSecurityEvent('photo_list_access', {
        userId: user?.id,
        platform: 'android',
        securityProtected: SecurityManager.isScreenshotProtectionEnabled()
      });

      // 模拟API调用
      const mockPhotos = [
        {
          id: 1,
          title: '企业文档-001',
          description: '重要企业文档，受Android安全保护',
          thumbnail: 'https://picsum.photos/200/200?random=1',
          uploadDate: '2024-01-15',
          size: '2.3 MB',
          protected: true
        },
        {
          id: 2,
          title: '机密图片-002',
          description: '机密级别图片，防截屏保护',
          thumbnail: 'https://picsum.photos/200/200?random=2',
          uploadDate: '2024-01-14',
          size: '1.8 MB',
          protected: true
        },
        {
          id: 3,
          title: '项目资料-003',
          description: '项目相关资料图片',
          thumbnail: 'https://picsum.photos/200/200?random=3',
          uploadDate: '2024-01-13',
          size: '3.1 MB',
          protected: true
        }
      ];

      setPhotos(mockPhotos);
      
    } catch (error) {
      console.error('❌ 加载图片失败:', error);
      Alert.alert('错误', '加载图片失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPhotos();
    await checkSecurityStatus();
    setRefreshing(false);
  };

  const handlePhotoPress = (photo) => {
    // 检查Android安全状态
    if (!SecurityManager.isScreenshotProtectionEnabled()) {
      Alert.alert(
        '⚠️ 安全警告',
        'Android防截屏保护未启用，查看图片可能存在安全风险。是否继续？',
        [
          { text: '取消', style: 'cancel' },
          { 
            text: '继续查看', 
            onPress: () => navigateToPhoto(photo),
            style: 'destructive'
          }
        ]
      );
      return;
    }

    navigateToPhoto(photo);
  };

  const navigateToPhoto = (photo) => {
    SecurityManager.logSecurityEvent('photo_view_access', {
      photoId: photo.id,
      userId: user?.id,
      platform: 'android',
      protectionEnabled: SecurityManager.isScreenshotProtectionEnabled()
    });

    navigation.navigate('PhotoView', { photo });
  };

  const handleLogout = () => {
    Alert.alert(
      '确认退出',
      '确定要退出Android安全图片管理系统吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '退出',
          style: 'destructive',
          onPress: () => {
            SecurityManager.logSecurityEvent('user_logout', {
              userId: user?.id,
              platform: 'android'
            });
            dispatch(logout());
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const handleUserManage = () => {
    if (user?.role !== 'admin') {
      Alert.alert('权限不足', '只有管理员可以访问用户管理功能');
      return;
    }

    SecurityManager.logSecurityEvent('user_manage_access', {
      userId: user?.id,
      platform: 'android'
    });

    navigation.navigate('UserManage');
  };

  const renderSecurityStatus = () => {
    if (!securityStatus) return null;

    const isSecure = securityStatus.screenshotProtectionEnabled && 
                     securityStatus.nativeModuleAvailable;

    return (
      <Card style={[styles.securityCard, { backgroundColor: isSecure ? '#1b5e20' : '#bf360c' }]}>
        <Card.Content>
          <View style={styles.securityHeader}>
            <Text style={styles.securityTitle}>
              {isSecure ? '🛡️ Android安全保护已启用' : '⚠️ Android安全状态异常'}
            </Text>
            <Chip 
              icon={isSecure ? 'shield-check' : 'shield-alert'} 
              textStyle={{ color: '#ffffff', fontSize: 10 }}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              {isSecure ? '企业级' : '风险'}
            </Chip>
          </View>
          
          <View style={styles.securityDetails}>
            <Text style={styles.securityText}>
              防截屏: {securityStatus.screenshotProtectionEnabled ? '✅ FLAG_SECURE' : '❌ 未保护'}
            </Text>
            <Text style={styles.securityText}>
              原生模块: {securityStatus.nativeModuleAvailable ? '✅ 可用' : '❌ 不可用'}
            </Text>
            {securityStatus.deviceInfo && (
              <Text style={styles.securityText}>
                设备: {securityStatus.deviceInfo.manufacturer} {securityStatus.deviceInfo.model}
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderPhotoItem = ({ item }) => (
    <Card style={styles.photoCard} onPress={() => handlePhotoPress(item)}>
      <Card.Cover source={{ uri: item.thumbnail }} style={styles.photoThumbnail} />
      <Card.Content style={styles.photoContent}>
        <View style={styles.photoHeader}>
          <Title style={styles.photoTitle}>{item.title}</Title>
          {item.protected && (
            <Chip icon="shield-check" textStyle={{ fontSize: 10 }} style={styles.protectedChip}>
              受保护
            </Chip>
          )}
        </View>
        <Paragraph style={styles.photoDescription}>{item.description}</Paragraph>
        <View style={styles.photoMeta}>
          <Text style={styles.photoMetaText}>📅 {item.uploadDate}</Text>
          <Text style={styles.photoMetaText}>📦 {item.size}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Avatar.Icon size={40} icon="account" style={styles.avatar} />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>欢迎，{user?.phone || '用户'}</Text>
          <Text style={styles.userRole}>
            {user?.role === 'admin' ? '👑 管理员' : '👤 普通用户'} • Android平台
          </Text>
        </View>
      </View>
      
      <View style={styles.headerActions}>
        {user?.role === 'admin' && (
          <Button 
            mode="outlined" 
            onPress={handleUserManage}
            style={styles.headerButton}
            labelStyle={styles.headerButtonText}
          >
            👥 用户管理
          </Button>
        )}
        <Button 
          mode="outlined" 
          onPress={handleLogout}
          style={[styles.headerButton, styles.logoutButton]}
          labelStyle={styles.headerButtonText}
        >
          🚪 退出
        </Button>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
      
      {renderSecurityStatus()}
      
      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6200ee']}
            progressBackgroundColor="#ffffff"
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        style={styles.fab}
        icon="camera-plus"
        label="添加图片"
        onPress={() => {
          Alert.alert('功能提示', 'Android图片上传功能开发中...');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  listContainer: {
    padding: 16,
  },
  securityCard: {
    margin: 16,
    marginBottom: 0,
    elevation: 4,
  },
  securityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  securityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  securityText: {
    fontSize: 11,
    color: '#ffffff',
  },
  header: {
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    backgroundColor: '#6200ee',
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userRole: {
    fontSize: 12,
    color: '#00ff00',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButton: {
    flex: 1,
    marginHorizontal: 4,
    borderColor: '#6200ee',
  },
  logoutButton: {
    borderColor: '#ff4444',
  },
  headerButtonText: {
    fontSize: 12,
    color: '#ffffff',
  },
  photoCard: {
    marginBottom: 16,
    backgroundColor: '#1e1e1e',
    elevation: 4,
  },
  photoThumbnail: {
    height: 200,
  },
  photoContent: {
    padding: 12,
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  protectedChip: {
    backgroundColor: '#00ff00',
  },
  photoDescription: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 8,
  },
  photoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoMetaText: {
    fontSize: 12,
    color: '#888888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});
