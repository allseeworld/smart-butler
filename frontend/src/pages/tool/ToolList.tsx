import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Tool {
  id: string
  name: string
  category: string
  location: string
  status: 'available' | 'in_use' | 'maintenance'
  lastMaintenance: string
}

const ToolList = () => {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // 模拟从API获取工具列表
    const fetchTools = async () => {
      try {
        setLoading(true)
        // 实际项目中应该从API获取数据
        // const response = await fetch('/api/tools')
        // const data = await response.json()
        
        // 模拟数据
        const mockTools: Tool[] = [
          {
            id: '1',
            name: '吸尘器',
            category: '清洁工具',
            location: '储物间',
            status: 'available',
            lastMaintenance: '2023-10-15'
          },
          {
            id: '2',
            name: '电钻',
            category: '维修工具',
            location: '工具室',
            status: 'in_use',
            lastMaintenance: '2023-09-20'
          },
          {
            id: '3',
            name: '割草机',
            category: '园艺工具',
            location: '花园仓库',
            status: 'maintenance',
            lastMaintenance: '2023-11-05'
          }
        ]
        
        // 模拟网络延迟
        setTimeout(() => {
          setTools(mockTools)
          setLoading(false)
        }, 500)
      } catch (err) {
        console.error('获取工具失败:', err)
        setError('获取工具列表失败，请稍后重试')
        setLoading(false)
      }
    }

    fetchTools()
  }, [])

  const getStatusBadgeClass = (status: Tool['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'in_use':
        return 'bg-yellow-100 text-yellow-800'
      case 'maintenance':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Tool['status']) => {
    switch (status) {
      case 'available':
        return '可用'
      case 'in_use':
        return '使用中'
      case 'maintenance':
        return '维护中'
      default:
        return '未知'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        <span className="ml-3 text-lg text-gray-700">加载中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">错误！</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">工具列表</h1>
        <div className="flex space-x-2">
          <Link
            to="/tools/register"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            登记新工具
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                工具名称
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                类别
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                存放位置
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最近维护日期
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tools.map((tool) => (
              <tr key={tool.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary-600">{tool.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{tool.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{tool.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(tool.status)}`}>
                    {getStatusText(tool.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tool.lastMaintenance}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/tools/${tool.id}`} className="text-primary-600 hover:text-primary-900 mr-4">
                    详情
                  </Link>
                  {tool.status === 'available' && (
                    <button className="text-yellow-600 hover:text-yellow-900">
                      借用
                    </button>
                  )}
                  {tool.status === 'in_use' && (
                    <button className="text-green-600 hover:text-green-900">
                      归还
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ToolList 