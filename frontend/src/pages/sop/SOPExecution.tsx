import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

interface Step {
  id: string
  order: number
  title: string
  description: string
  estimatedTime: string
  tools?: string[]
  notes?: string
  completed: boolean
  startTime?: string
  endTime?: string
  comments?: string
}

interface SOPExecution {
  id: string
  templateId: string
  templateTitle: string
  templateCategory: string
  status: 'in_progress' | 'completed' | 'cancelled'
  startTime: string
  endTime?: string
  executor: string
  steps: Step[]
  comments?: string
}

const SOPExecution = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [execution, setExecution] = useState<SOPExecution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [stepComment, setStepComment] = useState('')
  const [executionComment, setExecutionComment] = useState('')
  
  useEffect(() => {
    // 模拟从API获取SOP执行记录
    const fetchExecution = async () => {
      try {
        setLoading(true)
        // 实际项目中应该从API获取数据
        // const response = await fetch(`/api/sop/executions/${id}`)
        // const data = await response.json()
        
        // 模拟数据
        const mockExecution: SOPExecution = {
          id: id || '1',
          templateId: '1',
          templateTitle: '客厅日常清洁流程',
          templateCategory: '日常清洁',
          status: 'in_progress',
          startTime: new Date().toISOString(),
          executor: '张三',
          steps: [
            {
              id: 's1',
              order: 1,
              title: '准备清洁工具',
              description: '准备吸尘器、拖把、抹布、清洁剂等必要的清洁工具',
              estimatedTime: '5分钟',
              tools: ['吸尘器', '拖把', '抹布', '清洁剂'],
              completed: false
            },
            {
              id: 's2',
              order: 2,
              title: '清理杂物',
              description: '将客厅内的杂物整理归位，确保清洁区域畅通',
              estimatedTime: '10分钟',
              completed: false
            },
            {
              id: 's3',
              order: 3,
              title: '除尘',
              description: '使用吸尘器清理地毯、沙发、角落等处的灰尘',
              estimatedTime: '15分钟',
              tools: ['吸尘器'],
              notes: '注意吸尘器的吸力调节，避免损坏精细物品',
              completed: false
            },
            {
              id: 's4',
              order: 4,
              title: '擦拭家具表面',
              description: '使用适合的清洁剂和抹布擦拭桌子、柜子等家具表面',
              estimatedTime: '20分钟',
              tools: ['抹布', '家具清洁剂'],
              notes: '根据家具材质选择合适的清洁剂，避免损坏表面',
              completed: false
            },
            {
              id: 's5',
              order: 5,
              title: '清洁窗户',
              description: '使用玻璃清洁剂和专用抹布清洁窗户玻璃',
              estimatedTime: '15分钟',
              tools: ['玻璃清洁剂', '玻璃刮', '抹布'],
              completed: false
            },
            {
              id: 's6',
              order: 6,
              title: '拖地',
              description: '使用拖把和地板清洁剂拖洗地板',
              estimatedTime: '20分钟',
              tools: ['拖把', '地板清洁剂'],
              notes: '注意不同材质地板的清洁方法',
              completed: false
            },
            {
              id: 's7',
              order: 7,
              title: '整理摆设',
              description: '将客厅内的装饰品、摆设等物品整理归位',
              estimatedTime: '10分钟',
              completed: false
            },
            {
              id: 's8',
              order: 8,
              title: '最终检查',
              description: '检查清洁效果，确保所有区域都已清洁到位',
              estimatedTime: '5分钟',
              completed: false
            }
          ]
        }
        
        // 模拟网络延迟
        setTimeout(() => {
          setExecution(mockExecution)
          setLoading(false)
        }, 500)
      } catch (err) {
        console.error('获取SOP执行记录失败:', err)
        setError('获取SOP执行记录失败，请稍后重试')
        setLoading(false)
      }
    }

    fetchExecution()
  }, [id])

  const handleCompleteStep = () => {
    if (!execution) return
    
    const updatedSteps = [...execution.steps]
    updatedSteps[currentStepIndex] = {
      ...updatedSteps[currentStepIndex],
      completed: true,
      endTime: new Date().toISOString(),
      comments: stepComment
    }
    
    setExecution({
      ...execution,
      steps: updatedSteps
    })
    
    // 如果不是最后一步，自动前进到下一步
    if (currentStepIndex < execution.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
      setStepComment('')
    }
    
    // 实际项目中应该调用API更新步骤状态
    // await fetch(`/api/sop/executions/${id}/steps/${updatedSteps[currentStepIndex].id}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     completed: true,
    //     endTime: new Date().toISOString(),
    //     comments: stepComment
    //   })
    // })
  }
  
  const handleCompleteExecution = () => {
    if (!execution) return
    
    const allCompleted = execution.steps.every(step => step.completed)
    if (!allCompleted) {
      if (!window.confirm('还有未完成的步骤，确定要完成整个SOP执行吗？')) {
        return
      }
    }
    
    setExecution({
      ...execution,
      status: 'completed',
      endTime: new Date().toISOString(),
      comments: executionComment
    })
    
    // 实际项目中应该调用API完成SOP执行
    // await fetch(`/api/sop/executions/${id}/complete`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     endTime: new Date().toISOString(),
    //     comments: executionComment
    //   })
    // })
    
    alert('SOP执行已完成！')
    navigate('/sop/executions')
  }
  
  const handleCancelExecution = () => {
    if (!execution) return
    
    if (!window.confirm('确定要取消此SOP执行吗？此操作不可撤销。')) {
      return
    }
    
    setExecution({
      ...execution,
      status: 'cancelled',
      endTime: new Date().toISOString()
    })
    
    // 实际项目中应该调用API取消SOP执行
    // await fetch(`/api/sop/executions/${id}/cancel`, {
    //   method: 'POST'
    // })
    
    alert('SOP执行已取消！')
    navigate('/sop/executions')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        <span className="ml-3 text-lg text-gray-700">加载中...</span>
      </div>
    )
  }

  if (error || !execution) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">错误！</strong>
        <span className="block sm:inline"> {error || '未找到SOP执行记录'}</span>
        <Link to="/sop/executions" className="block mt-2 text-red-700 underline">
          返回执行列表
        </Link>
      </div>
    )
  }
  
  const currentStep = execution.steps[currentStepIndex]
  const completedSteps = execution.steps.filter(step => step.completed).length
  const progress = Math.round((completedSteps / execution.steps.length) * 100)
  const isLastStep = currentStepIndex === execution.steps.length - 1

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 头部信息 */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{execution.templateTitle}</h1>
              <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                {execution.templateCategory}
              </span>
              <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                execution.status === 'in_progress' 
                  ? 'bg-blue-100 text-blue-800' 
                  : execution.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {execution.status === 'in_progress' ? '进行中' : execution.status === 'completed' ? '已完成' : '已取消'}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">开始时间：</span>
                {new Date(execution.startTime).toLocaleString()}
              </div>
              {execution.endTime && (
                <div>
                  <span className="font-medium">结束时间：</span>
                  {new Date(execution.endTime).toLocaleString()}
                </div>
              )}
              <div>
                <span className="font-medium">执行人：</span>
                {execution.executor}
              </div>
              <div>
                <span className="font-medium">进度：</span>
                {completedSteps}/{execution.steps.length} 步骤 ({progress}%)
              </div>
            </div>
          </div>
          {execution.status === 'in_progress' && (
            <div className="flex space-x-2">
              <button
                onClick={handleCompleteExecution}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                完成执行
              </button>
              <button
                onClick={handleCancelExecution}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                取消执行
              </button>
            </div>
          )}
        </div>
        
        {/* 进度条 */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {execution.status === 'in_progress' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 步骤列表 */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">步骤列表</h2>
            <ul className="space-y-2">
              {execution.steps.map((step, index) => (
                <li 
                  key={step.id}
                  className={`p-3 rounded-md cursor-pointer ${
                    currentStepIndex === index 
                      ? 'bg-primary-100 border-l-4 border-primary-500' 
                      : step.completed
                      ? 'bg-green-50 border-l-4 border-green-500'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentStepIndex(index)}
                >
                  <div className="flex items-center">
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                      step.completed ? 'bg-green-500' : 'bg-primary-500'
                    } text-white text-xs font-medium`}>
                      {step.completed ? '✓' : step.order}
                    </span>
                    <span className="ml-2 font-medium">{step.title}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 truncate">{step.description}</p>
                  <p className="mt-1 text-xs text-gray-400">预计时间: {step.estimatedTime}</p>
                </li>
              ))}
            </ul>
          </div>
          
          {/* 当前步骤详情 */}
          <div className="md:col-span-2 bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-gray-900">
                步骤 {currentStep.order}: {currentStep.title}
              </h2>
              <span className="text-sm text-gray-500">预计时间: {currentStep.estimatedTime}</span>
            </div>
            
            <div className="prose max-w-none mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">描述</h3>
              <p className="text-gray-700 mb-4">{currentStep.description}</p>
              
              {currentStep.tools && currentStep.tools.length > 0 && (
                <>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">所需工具</h3>
                  <ul className="list-disc pl-5 mb-4">
                    {currentStep.tools.map((tool, index) => (
                      <li key={index} className="text-gray-700">{tool}</li>
                    ))}
                  </ul>
                </>
              )}
              
              {currentStep.notes && (
                <>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">注意事项</h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-yellow-700">{currentStep.notes}</p>
                  </div>
                </>
              )}
            </div>
            
            {!currentStep.completed ? (
              <>
                <div className="mb-4">
                  <label htmlFor="stepComment" className="block text-sm font-medium text-gray-700 mb-1">
                    步骤备注 (可选)
                  </label>
                  <textarea
                    id="stepComment"
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="记录此步骤的执行情况、问题或建议..."
                    value={stepComment}
                    onChange={(e) => setStepComment(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      if (currentStepIndex > 0) {
                        setCurrentStepIndex(currentStepIndex - 1)
                      }
                    }}
                    disabled={currentStepIndex === 0}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一步
                  </button>
                  <button
                    onClick={handleCompleteStep}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {isLastStep ? '完成此步骤' : '完成并继续'}
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
                <strong className="font-bold">步骤已完成！</strong>
                {currentStep.comments && (
                  <p className="mt-2">{currentStep.comments}</p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">执行总结</h2>
          
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-800 mb-2">步骤完成情况</h3>
            <ul className="space-y-2">
              {execution.steps.map((step) => (
                <li key={step.id} className="p-3 border rounded-md">
                  <div className="flex items-center">
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                      step.completed ? 'bg-green-500' : 'bg-red-500'
                    } text-white text-xs font-medium`}>
                      {step.completed ? '✓' : '✗'}
                    </span>
                    <span className="ml-2 font-medium">{step.title}</span>
                    <span className={`ml-2 text-sm ${step.completed ? 'text-green-600' : 'text-red-600'}`}>
                      {step.completed ? '已完成' : '未完成'}
                    </span>
                  </div>
                  {step.comments && (
                    <p className="mt-2 text-sm text-gray-600 border-t pt-2">{step.comments}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          {execution.comments && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-800 mb-2">执行备注</h3>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700">{execution.comments}</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Link
              to="/sop/executions"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              返回执行列表
            </Link>
          </div>
        </div>
      )}
      
      {execution.status === 'in_progress' && (
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">完成整个SOP执行</h2>
          <p className="text-gray-600 mb-4">
            完成所有步骤后，您可以添加整体执行的备注并完成此SOP执行。
          </p>
          
          <div className="mb-4">
            <label htmlFor="executionComment" className="block text-sm font-medium text-gray-700 mb-1">
              执行备注 (可选)
            </label>
            <textarea
              id="executionComment"
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="记录整个SOP执行的情况、问题或建议..."
              value={executionComment}
              onChange={(e) => setExecutionComment(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleCompleteExecution}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              完成执行
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SOPExecution 