import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  status: 'pending' | 'in_progress' | 'completed'
  dueDate: string
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // 模拟从API获取任务列表
    const fetchTasks = async () => {
      try {
        setLoading(true)
        // 实际项目中应该从API获取数据
        // const response = await fetch('/api/tasks')
        // const data = await response.json()
        
        // 模拟数据
        const mockTasks: Task[] = [
          {
            id: '1',
            title: '客厅清洁',
            description: '清洁客厅地板和家具',
            assignee: '张三',
            status: 'completed',
            dueDate: '2023-11-15'
          },
          {
            id: '2',
            title: '厨房设备维护',
            description: '检查并维护厨房设备',
            assignee: '李四',
            status: 'in_progress',
            dueDate: '2023-11-20'
          },
          {
            id: '3',
            title: '花园修剪',
            description: '修剪花园植物和草坪',
            assignee: '王五',
            status: 'pending',
            dueDate: '2023-11-25'
          }
        ]
        
        // 模拟网络延迟
        setTimeout(() => {
          setTasks(mockTasks)
          setLoading(false)
        }, 500)
      } catch (err) {
        console.error('获取任务失败:', err)
        setError('获取任务列表失败，请稍后重试')
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const getStatusBadgeClass = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return '待处理'
      case 'in_progress':
        return '进行中'
      case 'completed':
        return '已完成'
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
        <h1 className="text-2xl font-bold text-gray-900">任务列表</h1>
        <Link
          to="/tasks/create"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          创建任务
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key={task.id}>
                <Link to={`/tasks/${task.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary-600 truncate">{task.title}</p>
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(task.status)}`}>
                          {getStatusText(task.status)}
                        </span>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="text-sm text-gray-500">截止日期: {task.dueDate}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {task.description}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>负责人: {task.assignee}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 sm:px-6">
              <div className="text-center text-gray-500">
                暂无任务，请点击"创建任务"按钮添加新任务
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default TaskList 