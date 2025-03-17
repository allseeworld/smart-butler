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

interface AgentExecutionResult {
  task_id: string
  status: string
  execution_time?: number
  result?: any
  timestamp: string
  agent_type: 'standard' | 'reflection' | 'comparison' | 'siliconflow'
  message?: string
}

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [executionLoading, setExecutionLoading] = useState(false)
  const [executionResult, setExecutionResult] = useState<AgentExecutionResult | null>(null)
  const [useReflection, setUseReflection] = useState(false)
  const [useSiliconFlow, setUseSiliconFlow] = useState(false)

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

  const executeTask = async () => {
    if (!task) return
    
    try {
      setExecutionLoading(true)
      setExecutionResult(null)
      
      // 实际项目中应该调用API执行任务
      // const response = await fetch(`/api/tasks/${taskId}/execute`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     description: task.description,
      //     use_reflection: useReflection,
      //     use_siliconflow: useSiliconFlow
      //   })
      // })
      // const data = await response.json()
      
      // 模拟API调用
      setTimeout(() => {
        // 模拟执行结果
        const mockResult: AgentExecutionResult = {
          task_id: taskId || '1',
          status: 'completed',
          execution_time: 5.2,
          result: {
            messages: [
              { role: 'system', content: '我是李府管家系统中的智能任务执行Agent' },
              { role: 'user', content: `请执行以下任务: ${task.description}` },
              { role: 'assistant', content: '我将执行这个任务。首先，我需要了解具体的清洁要求。' },
              { role: 'assistant', content: '我已完成任务，客厅清洁工作已按要求完成。所有表面已除尘，地板已清洁并打蜡。特别注意了大理石表面的处理，使用了专用的中性清洁剂。' }
            ],
            plan: [
              { step: 1, description: '步骤1: 分析任务需求', status: 'completed' },
              { step: 2, description: '步骤2: 准备清洁工具和材料', status: 'completed' },
              { step: 3, description: '步骤3: 执行清洁工作', status: 'completed' },
              { step: 4, description: '步骤4: 验证清洁效果', status: 'completed' }
            ],
            model_info: useSiliconFlow ? {
              name: "SiliconFlow FLUX.1",
              provider: "SiliconFlow",
              version: "1.0"
            } : null
          },
          timestamp: new Date().toISOString(),
          agent_type: useSiliconFlow ? 'siliconflow' : (useReflection ? 'reflection' : 'standard')
        }
        
        setExecutionResult(mockResult)
        setExecutionLoading(false)
      }, 2000)
    } catch (err) {
      console.error('执行任务失败:', err)
      setExecutionResult({
        task_id: taskId || '1',
        status: 'failed',
        message: '执行任务失败，请稍后重试',
        timestamp: new Date().toISOString(),
        agent_type: useSiliconFlow ? 'siliconflow' : (useReflection ? 'reflection' : 'standard')
      })
      setExecutionLoading(false)
    }
  }

  const compareAgents = async () => {
    if (!task) return
    
    try {
      setExecutionLoading(true)
      setExecutionResult(null)
      
      // 实际项目中应该调用API比较Agent
      // const response = await fetch(`/api/tasks/${taskId}/compare-agents`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     description: task.description,
      //     use_siliconflow: useSiliconFlow
      //   })
      // })
      // const data = await response.json()
      
      // 模拟API调用
      setTimeout(() => {
        // 模拟比较结果
        const mockResult: AgentExecutionResult = {
          task_id: taskId || '1',
          status: 'completed',
          execution_time: 10.5,
          result: {
            standard_agent: {
              execution_time: 4.8,
              messages_count: 4,
              tools_used: 2
            },
            reflection_agent: {
              execution_time: 5.7,
              messages_count: 6,
              tools_used: 3,
              reflections: [
                { attempt: 1, content: '我需要更详细地了解清洁要求，特别是关于大理石表面的处理' },
                { attempt: 2, content: '我应该先准备好所有清洁工具，再开始清洁工作' }
              ]
            },
            siliconflow_agent: useSiliconFlow ? {
              execution_time: 3.9,
              messages_count: 5,
              tools_used: 2,
              model_info: {
                name: "SiliconFlow FLUX.1",
                provider: "SiliconFlow",
                version: "1.0"
              }
            } : null,
            comparison: useSiliconFlow ? 
              'SiliconFlow模型执行速度最快，反思Agent提供了更详细的执行计划和更全面的任务完成报告' : 
              '反思Agent虽然执行时间略长，但提供了更详细的执行计划和更全面的任务完成报告'
          },
          timestamp: new Date().toISOString(),
          agent_type: 'comparison'
        }
        
        setExecutionResult(mockResult)
        setExecutionLoading(false)
      }, 3000)
    } catch (err) {
      console.error('比较Agent失败:', err)
      setExecutionResult({
        task_id: taskId || '1',
        status: 'failed',
        message: '比较Agent失败，请稍后重试',
        timestamp: new Date().toISOString(),
        agent_type: 'standard'
      })
      setExecutionLoading(false)
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
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
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
      
      {/* Agent执行区域 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">智能Agent执行</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">使用智能Agent自动执行任务</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5">
          <div className="mb-4 space-y-2">
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-primary-600"
                  checked={useReflection}
                  onChange={(e) => {
                    setUseReflection(e.target.checked);
                    if (e.target.checked) setUseSiliconFlow(false);
                  }}
                  disabled={useSiliconFlow}
                />
                <span className="ml-2 text-gray-700">使用支持反思的高级Agent</span>
              </label>
              <p className="text-sm text-gray-500 mt-1">
                反思Agent能够在执行过程中进行自我反思和修正，提供更详细的执行计划和结果
              </p>
            </div>
            
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  checked={useSiliconFlow}
                  onChange={(e) => {
                    setUseSiliconFlow(e.target.checked);
                    if (e.target.checked) setUseReflection(false);
                  }}
                  disabled={useReflection}
                />
                <span className="ml-2 text-gray-700">使用硅基流动(SiliconFlow)模型</span>
              </label>
              <p className="text-sm text-gray-500 mt-1">
                硅基流动模型是国产大模型，执行速度更快，支持中文任务处理
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={executeTask}
              disabled={executionLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {executionLoading ? '执行中...' : `使用${useSiliconFlow ? '硅基流动' : (useReflection ? '反思' : '标准')}Agent执行`}
            </button>
            
            <button
              onClick={compareAgents}
              disabled={executionLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {executionLoading ? '比较中...' : '比较不同Agent效果'}
            </button>
          </div>
        </div>
        
        {/* 执行结果显示 */}
        {executionResult && (
          <div className="border-t border-gray-200 px-4 py-5">
            <h4 className="text-md font-medium text-gray-900 mb-2">
              执行结果 
              <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                executionResult.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {executionResult.status === 'completed' ? '成功' : '失败'}
              </span>
            </h4>
            
            {executionResult.message && (
              <div className="mb-4 text-sm text-gray-700">{executionResult.message}</div>
            )}
            
            {executionResult.execution_time && (
              <div className="mb-4 text-sm text-gray-700">
                执行时间: {executionResult.execution_time.toFixed(2)}秒
              </div>
            )}
            
            {executionResult.result && executionResult.result.messages && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">执行过程:</h5>
                <div className="border border-gray-200 rounded-md p-3 bg-gray-50 max-h-60 overflow-y-auto">
                  {executionResult.result.messages.map((msg: any, index: number) => (
                    <div key={index} className={`mb-2 p-2 rounded-md ${
                      msg.role === 'system' ? 'bg-gray-100' :
                      msg.role === 'user' ? 'bg-blue-50' : 'bg-green-50'
                    }`}>
                      <div className="text-xs text-gray-500 mb-1">{msg.role}</div>
                      <div className="text-sm">{msg.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {executionResult.result && executionResult.result.plan && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">执行计划:</h5>
                <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                  {executionResult.result.plan.map((step: any) => (
                    <div key={step.step} className="flex items-center mb-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                        step.status === 'completed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                      }`}>
                        {step.status === 'completed' ? '✓' : '⋯'}
                      </div>
                      <div className="text-sm">{step.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {executionResult.result && executionResult.result.reflections && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Agent反思:</h5>
                <div className="border border-gray-200 rounded-md p-3 bg-gray-50 max-h-40 overflow-y-auto">
                  {executionResult.result.reflections.map((reflection: any, index: number) => (
                    <div key={index} className="mb-2 p-2 bg-purple-50 rounded-md">
                      <div className="text-xs text-gray-500 mb-1">反思 #{reflection.attempt}</div>
                      <div className="text-sm">{reflection.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {executionResult.result && executionResult.result.model_info && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">模型信息:</h5>
                <div className="border border-gray-200 rounded-md p-3 bg-indigo-50">
                  <div className="text-sm">名称: {executionResult.result.model_info.name}</div>
                  <div className="text-sm">提供商: {executionResult.result.model_info.provider}</div>
                  <div className="text-sm">版本: {executionResult.result.model_info.version}</div>
                </div>
              </div>
            )}
            
            {executionResult.agent_type === 'comparison' && executionResult.result && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Agent比较结果:</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-md p-3 bg-blue-50">
                    <h6 className="text-sm font-medium mb-2">标准Agent</h6>
                    <div className="text-sm">执行时间: {executionResult.result.standard_agent.execution_time.toFixed(2)}秒</div>
                    <div className="text-sm">消息数量: {executionResult.result.standard_agent.messages_count}</div>
                    <div className="text-sm">使用工具数: {executionResult.result.standard_agent.tools_used}</div>
                  </div>
                  <div className="border border-gray-200 rounded-md p-3 bg-purple-50">
                    <h6 className="text-sm font-medium mb-2">反思Agent</h6>
                    <div className="text-sm">执行时间: {executionResult.result.reflection_agent.execution_time.toFixed(2)}秒</div>
                    <div className="text-sm">消息数量: {executionResult.result.reflection_agent.messages_count}</div>
                    <div className="text-sm">使用工具数: {executionResult.result.reflection_agent.tools_used}</div>
                    <div className="text-sm">反思次数: {executionResult.result.reflection_agent.reflections.length}</div>
                  </div>
                </div>
                
                {executionResult.result.siliconflow_agent && (
                  <div className="mt-4 border border-gray-200 rounded-md p-3 bg-indigo-50">
                    <h6 className="text-sm font-medium mb-2">硅基流动Agent</h6>
                    <div className="text-sm">执行时间: {executionResult.result.siliconflow_agent.execution_time.toFixed(2)}秒</div>
                    <div className="text-sm">消息数量: {executionResult.result.siliconflow_agent.messages_count}</div>
                    <div className="text-sm">使用工具数: {executionResult.result.siliconflow_agent.tools_used}</div>
                    <div className="text-sm">模型: {executionResult.result.siliconflow_agent.model_info.name}</div>
                  </div>
                )}
                
                <div className="mt-3 p-3 bg-gray-100 rounded-md text-sm">
                  <strong>比较结论:</strong> {executionResult.result.comparison}
                </div>
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              执行时间: {new Date(executionResult.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskDetail 