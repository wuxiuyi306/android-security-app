/**
 * Android用户管理页面 - 企业级安全标准
 * 
 * 👥 集成Android原生安全验证的用户管理界面
 * 
 * 核心价值：确保用户管理操作在Android安全环境中进行
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  StatusBar,
  RefreshControl
} from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  FAB,
  Chip,
  Avatar,
  TextInput,
  Modal,
  Portal
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import SecurityManager from '../security';

export default function UserManageScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [addUserVisible, setAddUserVisible] = useState(false);
  const [newUser, setNewUser] = useState({ phone: '', idCard: '', birthDate: '', role: 'user' });
  const [securityStatus, setSecurityStatus] = useState(null);
  
  const { user: currentUser } = useSelector(state => state.auth);

  useEffect(() => {
    checkAdminPermission();
    loadUsers();
    checkSecurityStatus();
  }, []);

  const checkAdminPermission = () => {
    if (currentUser?.role !== 'admin') {
      Alert.alert(
        '权限不足',
        '只有管理员可以访问用户管理功能',
        [{ text: '返回', onPress: () => navigation.goBack() }]
      );
      return;
    }

    // 记录管理员访问事件
    SecurityManager.logSecurityEvent('admin_user_manage_access', {
      adminId: currentUser?.id,
      platform: 'android',
      timestamp: new Date().toISOString()
    });
  };

  const checkSecurityStatus = async () => {
    try {
      const summary = SecurityManager.getSecuritySummary();
      const deviceInfo = SecurityManager.getDeviceInfo();
      
      setSecurityStatus({
        ...summary,
        deviceInfo
      });

      // 管理员操作需要额外安全检查
      const securityChecks = await SecurityManager.performSecurityChecks();
      const criticalViolations = securityChecks.filter(v => v.severity === 'critical');
      
      if (criticalViolations.length > 0) {
        Alert.alert(
          '🔒 安全检查失败',
          'Android安全检查发现关键违规，无法进行用户管理操作。',
          [{ text: '返回', onPress: () => navigation.goBack() }]
        );
      }
      
    } catch (error) {
      console.error('❌ Android安全状态检查失败:', error);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // 记录用户列表访问事件
      SecurityManager.logSecurityEvent('user_list_access', {
        adminId: currentUser?.id,
        platform: 'android',
        securityProtected: SecurityManager.isScreenshotProtectionEnabled()
      });

      // 模拟API调用
      const mockUsers = [
        {
          id: 1,
          phone: '138****1234',
          role: 'admin',
          status: 'active',
          lastLogin: '2024-01-15 10:30',
          deviceInfo: 'Samsung Galaxy S21',
          securityLevel: 'enterprise'
        },
        {
          id: 2,
          phone: '139****5678',
          role: 'user',
          status: 'active',
          lastLogin: '2024-01-14 15:20',
          deviceInfo: 'Huawei P40',
          securityLevel: 'standard'
        },
        {
          id: 3,
          phone: '136****9012',
          role: 'user',
          status: 'inactive',
          lastLogin: '2024-01-10 09:15',
          deviceInfo: 'Xiaomi Mi 11',
          securityLevel: 'standard'
        }
      ];

      setUsers(mockUsers);
      
    } catch (error) {
      console.error('❌ 加载用户列表失败:', error);
      Alert.alert('错误', '加载用户列表失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    await checkSecurityStatus();
    setRefreshing(false);
  };

  const handleAddUser = async () => {
    try {
      // 验证输入
      if (!newUser.phone || !newUser.idCard || !newUser.birthDate) {
        Alert.alert('错误', '请填写所有必填字段');
        return;
      }

      // 手机号验证
      if (!/^1[3-9]\d{9}$/.test(newUser.phone)) {
        Alert.alert('错误', '请输入正确的手机号');
        return;
      }

      // 🔒 执行Android安全检查
      const securityChecks = await SecurityManager.performSecurityChecks();
      const criticalViolations = securityChecks.filter(v => v.severity === 'critical');
      
      if (criticalViolations.length > 0) {
        Alert.alert('🔒 安全检查失败', '检测到安全违规，无法添加用户');
        return;
      }

      // 记录用户添加事件
      SecurityManager.logSecurityEvent('user_add_attempt', {
        adminId: currentUser?.id,
        newUserPhone: newUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
        platform: 'android',
        securityProtected: SecurityManager.isScreenshotProtectionEnabled()
      });

      // 模拟API调用
      const newUserId = users.length + 1;
      const addedUser = {
        id: newUserId,
        phone: newUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
        role: newUser.role,
        status: 'active',
        lastLogin: '从未登录',
        deviceInfo: '未知',
        securityLevel: 'standard'
      };

      setUsers([...users, addedUser]);
      setAddUserVisible(false);
      setNewUser({ phone: '', idCard: '', birthDate: '', role: 'user' });

      Alert.alert('✅ 成功', 'Android安全环境下用户添加成功');

    } catch (error) {
      console.error('❌ 添加用户失败:', error);
      Alert.alert('错误', '添加用户失败，请重试');
    }
  };

  const handleDeleteUser = (userId, userPhone) => {
    Alert.alert(
      '⚠️ 确认删除',
      `确定要删除用户 ${userPhone} 吗？\n\n此操作将在Android安全环境中执行且无法撤销。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              // 🔒 执行Android安全检查
              const securityChecks = await SecurityManager.performSecurityChecks();
              const criticalViolations = securityChecks.filter(v => v.severity === 'critical');
              
              if (criticalViolations.length > 0) {
                Alert.alert('🔒 安全检查失败', '检测到安全违规，无法删除用户');
                return;
              }

              // 记录用户删除事件
              SecurityManager.logSecurityEvent('user_delete', {
                adminId: currentUser?.id,
                deletedUserId: userId,
                deletedUserPhone: userPhone,
                platform: 'android'
              });

              setUsers(users.filter(u => u.id !== userId));
              Alert.alert('✅ 成功', 'Android安全环境下用户删除成功');

            } catch (error) {
              console.error('❌ 删除用户失败:', error);
              Alert.alert('错误', '删除用户失败，请重试');
            }
          }
        }
      ]
    );
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
              {isSecure ? '🛡️ Android管理员安全环境' : '⚠️ Android安全状态异常'}
            </Text>
            <Chip 
              icon={isSecure ? 'shield-account' : 'shield-alert'} 
              textStyle={{ color: '#ffffff', fontSize: 10 }}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              {isSecure ? '管理员' : '风险'}
            </Chip>
          </View>
          
          <View style={styles.securityDetails}>
            <Text style={styles.securityText}>
              防截屏: {securityStatus.screenshotProtectionEnabled ? '✅ FLAG_SECURE' : '❌ 未保护'}
            </Text>
            <Text style={styles.securityText}>
              原生模块: {securityStatus.nativeModuleAvailable ? '✅ 可用' : '❌ 不可用'}
            </Text>
            <Text style={styles.securityText}>
              管理权限: ✅ 已验证
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderUserItem = ({ item }) => (
    <Card style={styles.userCard}>
      <Card.Content>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Avatar.Icon 
              size={40} 
              icon={item.role === 'admin' ? 'crown' : 'account'} 
              style={[styles.avatar, { backgroundColor: item.role === 'admin' ? '#ff6f00' : '#6200ee' }]}
            />
            <View style={styles.userDetails}>
              <Title style={styles.userName}>{item.phone}</Title>
              <View style={styles.userMeta}>
                <Chip 
                  icon={item.role === 'admin' ? 'crown' : 'account'}
                  textStyle={styles.roleChipText}
                  style={[styles.roleChip, { backgroundColor: item.role === 'admin' ? '#ff6f00' : '#6200ee' }]}
                >
                  {item.role === 'admin' ? '管理员' : '普通用户'}
                </Chip>
                <Chip 
                  icon={item.status === 'active' ? 'check-circle' : 'alert-circle'}
                  textStyle={styles.statusChipText}
                  style={[styles.statusChip, { backgroundColor: item.status === 'active' ? '#00ff00' : '#ff4444' }]}
                >
                  {item.status === 'active' ? '活跃' : '非活跃'}
                </Chip>
              </View>
            </View>
          </View>
          
          {item.id !== currentUser?.id && (
            <Button
              mode="outlined"
              onPress={() => handleDeleteUser(item.id, item.phone)}
              style={styles.deleteButton}
              labelStyle={styles.deleteButtonText}
            >
              🗑️
            </Button>
          )}
        </View>

        <View style={styles.userExtendedInfo}>
          <Text style={styles.userInfoText}>📱 设备: {item.deviceInfo}</Text>
          <Text style={styles.userInfoText}>🕒 最后登录: {item.lastLogin}</Text>
          <Text style={styles.userInfoText}>🔒 安全级别: {item.securityLevel}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderAddUserModal = () => (
    <Portal>
      <Modal
        visible={addUserVisible}
        onDismiss={() => setAddUserVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.modalCard}>
          <Card.Content>
            <Title style={styles.modalTitle}>🔐 Android安全环境添加用户</Title>
            
            <TextInput
              label="手机号 *"
              value={newUser.phone}
              onChangeText={(text) => setNewUser({...newUser, phone: text})}
              mode="outlined"
              keyboardType="phone-pad"
              maxLength={11}
              style={styles.modalInput}
              left={<TextInput.Icon icon="phone" />}
            />

            <TextInput
              label="身份证后四位 *"
              value={newUser.idCard}
              onChangeText={(text) => setNewUser({...newUser, idCard: text})}
              mode="outlined"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              style={styles.modalInput}
              left={<TextInput.Icon icon="card-account-details" />}
            />

            <TextInput
              label="出生日期 (YYYY-MM-DD) *"
              value={newUser.birthDate}
              onChangeText={(text) => setNewUser({...newUser, birthDate: text})}
              mode="outlined"
              placeholder="1990-01-01"
              maxLength={10}
              style={styles.modalInput}
              left={<TextInput.Icon icon="calendar" />}
            />

            <View style={styles.roleSelection}>
              <Text style={styles.roleLabel}>用户角色:</Text>
              <View style={styles.roleButtons}>
                <Button
                  mode={newUser.role === 'user' ? 'contained' : 'outlined'}
                  onPress={() => setNewUser({...newUser, role: 'user'})}
                  style={styles.roleButton}
                >
                  👤 普通用户
                </Button>
                <Button
                  mode={newUser.role === 'admin' ? 'contained' : 'outlined'}
                  onPress={() => setNewUser({...newUser, role: 'admin'})}
                  style={styles.roleButton}
                >
                  👑 管理员
                </Button>
              </View>
            </View>

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setAddUserVisible(false)}
                style={styles.modalButton}
              >
                取消
              </Button>
              <Button
                mode="contained"
                onPress={handleAddUser}
                style={styles.modalButton}
              >
                🔐 安全添加
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
      
      {renderSecurityStatus()}
      
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.id.toString()}
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
        icon="account-plus"
        label="添加用户"
        onPress={() => setAddUserVisible(true)}
      />

      {renderAddUserModal()}
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
    fontSize: 10,
    color: '#ffffff',
  },
  userCard: {
    marginBottom: 12,
    backgroundColor: '#1e1e1e',
    elevation: 4,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChip: {
    height: 24,
  },
  roleChipText: {
    fontSize: 10,
    color: '#ffffff',
  },
  statusChip: {
    height: 24,
  },
  statusChipText: {
    fontSize: 10,
    color: '#000000',
  },
  deleteButton: {
    borderColor: '#ff4444',
    minWidth: 40,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#ff4444',
  },
  userExtendedInfo: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  userInfoText: {
    fontSize: 12,
    color: '#cccccc',
    marginBottom: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  modalContainer: {
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#1e1e1e',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    marginBottom: 15,
    backgroundColor: '#2a2a2a',
  },
  roleSelection: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
  },
});
