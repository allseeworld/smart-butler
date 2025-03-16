import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

interface Tool {
  id: string
  name: string
  category: string
  brand: string
  model: string
  serialNumber: string
  purchaseDate: string
  location: string
  status: 'available' | 'in_use' | 'maintenance'
  lastMaintenance: string
  nextMaintenance: string
  currentUser?: string
  description?: string
  usageHistory: {
    id: string
    user: string
    borrowDate: string
    returnDate?: string
    condition: string
  }[]
}

const ToolDetail = () => {
  const { toolId } = useParams<{ toolId: string }>()
  const navigate = useNavigate()
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // 模拟从API获取工具详情
    const fetchToolDetail = async () => {
      try {
        setLoading(true)
        // 实际项目中应该从API获取数据
        // const response = await fetch(`/api/tools/${toolId}`)
        // const data = await response.json()
        
        // 模拟数据
        const mockTool: Tool = {
          id: toolId || '1',
          name: '吸尘器',
          category: '清洁工具',
          brand: '戴森',
          model: 'V11',
          serialNumber: 'DYS-V11-2023-001',
          purchaseDate: '2023-01-15',
          location: '储物间',
          status: 'available',
          lastMaintenance: '2023-10-15',
          nextMaintenance: '2024-01-15',
          description: '无线手持吸尘器，适用于地板和地毯清洁。配有多种吸头，可用于不同场景。',
          usageHistory: [
            {
              id: '1',
              user: '张三',
              borrowDate: '2023-09-10',
              returnDate: '2023-09-12',
              condition: '良好'
            },
            {
              id: '2',
              user: '李四',
              borrowDate: '2023-08-05',
              returnDate: '2023-08-07',
              condition: '良好'
            }
          ]
        }
        
        // 模拟网络延迟
        setTimeout(() => {
          setTool(mockTool)
          setLoading(false)
        }, 500)
      } catch (err) {
        console.error('获取工具详情失败:', err)
        setError('获取工具详情失败，请稍后重试')
        setLoading(false)
      }
    }

    if (toolId) {
      fetchToolDetail()
    } else {
      setError('工具ID无效')
      setLoading(false)
    }
  }, [toolId])

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

  const handleBorrow = async () => {
    if (tool?.status !== 'available') {
      alert('该工具当前不可借用')
      return
    }
    
    try {
      // 实际项目中应该调用API借用工具
      // await fetch(`/api/tools/${toolId}/borrow`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ user: '当前用户' })
      // })
      
      // 模拟借用成功
      alert('工具借用成功')
      // 刷新页面或更新状态
      setTool(tool => tool ? { ...tool, status: 'in_use', currentUser: '当前用户' } : null)
    } catch (err) {
      console.error('借用工具失败:', err)
      alert('借用工具失败，请稍后重试')
    }
  }

  const handleReturn = async () => {
    if (tool?.status !== 'in_use') {
      alert('该工具当前不在借用状态')
      return
    }
    
    try {
      // 实际项目中应该调用API归还工具
      // await fetch(`/api/tools/${toolId}/return`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ condition: '良好' })
      // })
      
      // 模拟归还成功
      alert('工具归还成功')
      // 刷新页面或更新状态
      setTool(tool => tool ? { ...tool, status: 'available', currentUser: undefined } : null)
    } catch (err) {
      console.error('归还工具失败:', err)
      alert('归还工具失败，请稍后重试')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('确定要删除此工具吗？')) {
      try {
        // 实际项目中应该调用API删除工具
        // await fetch(`/api/tools/${toolId}`, {
        //   method: 'DELETE'
        // })
        
        // 模拟删除成功
        alert('工具已成功删除')
        navigate('/tools')
      } catch (err) {
        console.error('删除工具失败:', err)
        alert('删除工具失败，请稍后重试')
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

  if (error || !tool) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">错误！</strong>
        <span className="block sm:inline"> {error || '无法加载工具详情'}</span>
        <div className="mt-4">
          <Link to="/tools" className="text-red-700 underline">返回工具列表</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link to="/tools" className="text-primary-600 hover:text-primary-800">
          &larr; 返回工具列表
        </Link>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">工具详情</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">工具ID: {tool.id}</p>
          </div>
          <div className="flex space-x-2">
            {tool.status === 'available' && (
              <button
                onClick={handleBorrow}
                className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                借用
              </button>
            )}
            {tool.status === 'in_use' && (
              <button
                onClick={handleReturn}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                归还
              </button>
            )}
            <Link
              to={`/tools/${tool.id}/edit`}
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
              <dt className="text-sm font-medium text-gray-500">工具名称</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tool.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">类别</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tool.category}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">品牌</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tool.brand}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">型号</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tool.model}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">序列号</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tool.serialNumber}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">购买日期</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tool.purchaseDate}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">存放位置</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tool.location}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">状态</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(tool.status)}`}>
                  {getStatusText(tool.status)}
                </span>
                {tool.currentUser && (
                  <span className="ml-2 text-gray-500">当前使用者: {tool.currentUser}</span>
                )}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">最近维护日期</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tool.lastMaintenance}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">下次维护日期</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tool.nextMaintenance}</dd>
            </div>
            {tool.description && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">描述</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tool.description}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      
      {/* 使用历史 */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">使用历史</h3>
        </div>
        <div className="border-t border-gray-200">
          {tool.usageHistory.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    使用者
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    借用日期
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    归还日期
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    归还状态
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tool.usageHistory.map((history) => (
                  <tr key={history.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{history.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{history.borrowDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{history.returnDate || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{history.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
              暂无使用记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ToolDetail 