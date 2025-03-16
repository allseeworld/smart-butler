import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  status: 'pending' | 'in_progress' | 'completed'
  dueDate: string
  createdAt: string
  priority: 'low' | 'medium' | 'high'
  notes?: string
}

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // 模拟从API获取任务详情
    const fetchTaskDetail = async () => {
      try {
        setLoading(true)
        // 实际项目中应该从API获取数据
        // const response = await fetch(`/api/tasks/${taskId}`)
        // const data = await response.json()
        
        // 模拟数据
        const mockTask: Task = {
          id: taskId || '1',
          title: '客厅清洁',
          description: '清洁客厅地板和家具，确保所有表面无灰尘，地板干净光亮。',
          assignee: '张三',
          status: 'completed',
          dueDate: '2023-11-15',
          createdAt: '2023-11-10',
          priority: 'medium',
          notes: '需要使用特殊清洁剂处理大理石表面，注意不要使用酸性清洁剂。'
        }
        
        // 模拟网络延迟
        setTimeout(() => {
          setTask(mockTask)
          setLoading(false)
        }, 500)
      } catch (err) {
        console.error('获取任务详情失败:', err)
        setError('获取任务详情失败，请稍后重试')
        setLoading(false)
      }
    }

    if (taskId) {
      fetchTaskDetail()
    } else {
      setError('任务ID无效')
      setLoading(false)
    }
  }, [taskId])

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

  const getPriorityBadgeClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return '低'
      case 'medium':
        return '中'
      case 'high':
        return '高'
      default:
        return '未知'
    }
  }

  const handleDelete = async () => {
    if (window.confirm('确定要删除此任务吗？')) {
      try {
        // 实际项目中应该调用API删除任务
        // await fetch(`/api/tasks/${taskId}`, {
        //   method: 'DELETE'
        // })
        
        // 模拟删除成功
        alert('任务已成功删除')
        navigate('/tasks')
      } catch (err) {
        console.error('删除任务失败:', err)
        alert('删除任务失败，请稍后重试')
      }
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

  if (error || !task) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">错误！</strong>
        <span className="block sm:inline"> {error || '无法加载任务详情'}</span>
        <div className="mt-4">
          <Link to="/tasks" className="text-red-700 underline">返回任务列表</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link to="/tasks" className="text-primary-600 hover:text-primary-800">
          &larr; 返回任务列表
        </Link>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">任务详情</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">任务ID: {task.id}</p>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/tasks/${task.id}/edit`}
              className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              编辑
            </Link>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              删除
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">任务名称</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{task.title}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">描述</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{task.description}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">负责人</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{task.assignee}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">状态</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">优先级</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">截止日期</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{task.dueDate}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">创建日期</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{task.createdAt}</dd>
            </div>
            {task.notes && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">备注</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{task.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail 