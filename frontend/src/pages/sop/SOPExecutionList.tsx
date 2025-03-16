import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface SOPExecution {
  id: string
  templateId: string
  templateTitle: string
  templateCategory: string
  status: 'in_progress' | 'completed' | 'cancelled'
  startTime: string
  endTime?: string
  executor: string
  completedSteps: number
  totalSteps: number
}

const SOPExecutionList = () => {
  const [executions, setExecutions] = useState<SOPExecution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  
  const categories = ['日常清洁', '设备维护', '安全检查', '接待服务', '餐饮服务']
  const statuses = [
    { value: 'in_progress', label: '进行中' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' }
  ]

  useEffect(() => {
    // 模拟从API获取SOP执行记录列表
    const fetchExecutions = async () => {
      try {
        setLoading(true)
        // 实际项目中应该从API获取数据
        // const response = await fetch('/api/sop/executions')
        // const data = await response.json()
        
        // 模拟数据
        const mockExecutions: SOPExecution[] = [
          {
            id: '1',
            templateId: '1',
            templateTitle: '客厅日常清洁流程',
            templateCategory: '日常清洁',
            status: 'in_progress',
            startTime: '2023-11-15T08:30:00Z',
            executor: '张三',
            completedSteps: 3,
            totalSteps: 8
          },
          {
            id: '2',
            templateId: '2',
            templateTitle: '空调季度维护流程',
            templateCategory: '设备维护',
            status: 'completed',
            startTime: '2023-11-10T13:15:00Z',
            endTime: '2023-11-10T15:45:00Z',
            executor: '李四',
            completedSteps: 6,
            totalSteps: 6
          },
          {
            id: '3',
            templateId: '3',
            templateTitle: '家庭消防安全检查流程',
            templateCategory: '安全检查',
            status: 'completed',
            startTime: '2023-11-05T09:00:00Z',
            endTime: '2023-11-05T11:30:00Z',
            executor: '王五',
            completedSteps: 10,
            totalSteps: 10
          },
          {
            id: '4',
            templateId: '4',
            templateTitle: '客人接待流程',
            templateCategory: '接待服务',
            status: 'cancelled',
            startTime: '2023-11-12T14:00:00Z',
            endTime: '2023-11-12T14:15:00Z',
            executor: '赵六',
            completedSteps: 2,
            totalSteps: 7
          },
          {
            id: '5',
            templateId: '5',
            templateTitle: '家庭晚宴准备流程',
            templateCategory: '餐饮服务',
            status: 'in_progress',
            startTime: '2023-11-14T16:00:00Z',
            executor: '钱七',
            completedSteps: 8,
            totalSteps: 12
          }
        ]
        
        // 模拟网络延迟
        setTimeout(() => {
          setExecutions(mockExecutions)
          setLoading(false)
        }, 500)
      } catch (err) {
        console.error('获取SOP执行记录失败:', err)
        setError('获取SOP执行记录列表失败，请稍后重试')
        setLoading(false)
      }
    }

    fetchExecutions()
  }, [])

  // 格式化日期时间
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // 计算执行进度百分比
  const calculateProgress = (completed: number, total: number) => {
    return Math.round((completed / total) * 100)
  }
  
  // 获取状态标签样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // 获取状态显示文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress':
        return '进行中'
      case 'completed':
        return '已完成'
      case 'cancelled':
        return '已取消'
      default:
        return status
    }
  }

  // 过滤SOP执行记录
  const filteredExecutions = executions.filter(execution => {
    const matchesSearch = searchTerm === '' || 
      execution.templateTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      execution.executor.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || execution.status === statusFilter
    const matchesCategory = categoryFilter === '' || execution.templateCategory === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

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
        <h1 className="text-2xl font-bold text-gray-900">SOP执行记录</h1>
        <Link
          to="/sop/templates"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          选择SOP模板执行
        </Link>
      </div>
      
      {/* 搜索和过滤 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              搜索
            </label>
            <input
              type="text"
              id="search"
              placeholder="搜索标题或执行人..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              状态
            </label>
            <select
              id="status"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">全部状态</option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              分类
            </label>
            <select
              id="category"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">全部分类</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* SOP执行记录列表 */}
      {filteredExecutions.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {filteredExecutions.map((execution) => (
              <li key={execution.id} className="hover:bg-gray-50">
                <Link to={`/sop/executions/${execution.id}`} className="block">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-primary-600 truncate">{execution.templateTitle}</p>
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {execution.templateCategory}
                        </span>
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(execution.status)}`}>
                          {getStatusText(execution.status)}
                        </span>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="text-sm text-gray-500">执行人: {execution.executor}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          开始时间: {formatDateTime(execution.startTime)}
                        </p>
                        {execution.endTime && (
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            结束时间: {formatDateTime(execution.endTime)}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <div className="w-full">
                          <div className="flex justify-between mb-1">
                            <span>进度: {execution.completedSteps}/{execution.totalSteps}</span>
                            <span>{calculateProgress(execution.completedSteps, execution.totalSteps)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${execution.status === 'completed' ? 'bg-green-500' : 'bg-primary-500'}`}
                              style={{ width: `${calculateProgress(execution.completedSteps, execution.totalSteps)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          没有找到匹配的SOP执行记录
        </div>
      )}
    </div>
  )
}

export default SOPExecutionList 