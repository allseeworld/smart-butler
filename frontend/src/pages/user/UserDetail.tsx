import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Space, message, Spin, Switch } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  full_name?: string;
  phone?: string;
  department?: string;
}

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        message.error('获取用户详情失败');
        console.error('获取用户详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId]);

  const handleStatusChange = async (checked: boolean) => {
    if (!user) return;
    
    setUpdating(true);
    try {
      await axios.patch(`/api/users/${userId}`, { is_active: checked });
      setUser({ ...user, is_active: checked });
      message.success(`用户已${checked ? '激活' : '禁用'}`);
    } catch (error) {
      message.error('更新用户状态失败');
      console.error('更新用户状态失败:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Spin size="small" className="flex justify-center items-center h-full" />;
  }

  if (!user) {
    return <div className="text-center text-gray-500">用户不存在或已被删除</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <Space size="small">
          <Button 
            size="small"
            icon={<ArrowLeftOutlined style={{ fontSize: '12px' }} />} 
            onClick={() => navigate('/users')}
          >
            返回
          </Button>
          <h1 className="text-lg font-medium m-0">用户详情</h1>
        </Space>
        <Space>
          <Button 
            type="primary" 
            size="small"
            icon={<EditOutlined style={{ fontSize: '12px' }} />}
            onClick={() => navigate(`/users/edit/${userId}`)}
          >
            编辑
          </Button>
        </Space>
      </div>

      <div className="p-4">
        <Descriptions bordered size="small" column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }} labelStyle={{ width: '120px' }}>
          <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
          <Descriptions.Item label="姓名">{user.full_name || '未设置'}</Descriptions.Item>
          <Descriptions.Item label="电话">{user.phone || '未设置'}</Descriptions.Item>
          <Descriptions.Item label="部门">{user.department || '未设置'}</Descriptions.Item>
          <Descriptions.Item label="角色">
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {user.role}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Switch 
              checked={user.is_active} 
              onChange={handleStatusChange}
              loading={updating}
              size="small"
              checkedChildren="激活" 
              unCheckedChildren="禁用"
            />
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            <span className="text-xs text-gray-500">
              {new Date(user.created_at).toLocaleString()}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            <span className="text-xs text-gray-500">
              {new Date(user.updated_at).toLocaleString()}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
};

export default UserDetail; 