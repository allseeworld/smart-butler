import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, Card, message, Space } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: string;
  full_name?: string;
  phone?: string;
  department?: string;
}

const UserCreate = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: UserFormData) => {
    setLoading(true);
    try {
      await axios.post('/api/users', values);
      message.success('用户创建成功');
      navigate('/users');
    } catch (error) {
      message.error('用户创建失败');
      console.error('用户创建失败:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-lg font-medium m-0">创建用户</h1>
        </Space>
      </div>

      <div className="p-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size="small"
          requiredMark={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' }
              ]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>

            <Form.Item
              name="role"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select placeholder="请选择角色">
                <Option value="admin">管理员</Option>
                <Option value="manager">经理</Option>
                <Option value="staff">员工</Option>
              </Select>
            </Form.Item>

            <Form.Item name="full_name" label="姓名">
              <Input placeholder="请输入姓名" />
            </Form.Item>

            <Form.Item name="phone" label="电话">
              <Input placeholder="请输入电话" />
            </Form.Item>

            <Form.Item name="department" label="部门" className="md:col-span-2">
              <Input placeholder="请输入部门" />
            </Form.Item>
          </div>

          <Form.Item className="mb-0 mt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="small"
              icon={<SaveOutlined style={{ fontSize: '12px' }} />}
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UserCreate; 