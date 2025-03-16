import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

interface Step {
  id: string
  order: number
  title: string
  description: string
  estimatedTime: string
  tools?: string[]
  notes?: string
}

interface SOPTemplate {
  id: string
  title: string
  description: string
  category: string
  steps: Step[]
  createdAt: string
  updatedAt: string
  author: string
  usageCount: number
  version: string
}

const SOPTemplateDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [template, setTemplate] = useState<SOPTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeStep, setActiveStep] = useState<string | null>(null)

  useEffect(() => {
    // 模拟从API获取SOP模板详情
    const fetchTemplateDetail = async () => {
      try {
        setLoading(true)
        // 实际项目中应该从API获取数据
        // const response = await fetch(`/api/sop/templates/${id}`)
        // const data = await response.json()
        
        // 模拟数据
        const mockTemplate: SOPTemplate = {
          id: id || '1',
          title: '客厅日常清洁流程',
          description: '详细的客厅清洁标准操作流程，包括地板、家具、窗户等清洁步骤',
          category: '日常清洁',
          version: '1.2',
          createdAt: '2023-10-15',
          updatedAt: '2023-11-02',
          author: '李管家',
          usageCount: 42,
          steps: [
            {
              id: 's1',
              order: 1,
              title: '准备清洁工具',
              description: '准备吸尘器、拖把、抹布、清洁剂等必要的清洁工具',
              estimatedTime: '5分钟',
              tools: ['吸尘器', '拖把', '抹布', '清洁剂']
            },
            {
              id: 's2',
              order: 2,
              title: '清理杂物',
              description: '将客厅内的杂物整理归位，确保清洁区域畅通',
              estimatedTime: '10分钟'
            },
            {
              id: 's3',
              order: 3,
              title: '除尘',
              description: '使用吸尘器清理地毯、沙发、角落等处的灰尘',
              estimatedTime: '15分钟',
              tools: ['吸尘器'],
              notes: '注意吸尘器的吸力调节，避免损坏精细物品'
            },
            {
              id: 's4',
              order: 4,
              title: '擦拭家具表面',
              description: '使用适合的清洁剂和抹布擦拭桌子、柜子等家具表面',
              estimatedTime: '20分钟',
              tools: ['抹布', '家具清洁剂'],
              notes: '根据家具材质选择合适的清洁剂，避免损坏表面'
            },
            {
              id: 's5',
              order: 5,
              title: '清洁窗户',
              description: '使用玻璃清洁剂和专用抹布清洁窗户玻璃',
              estimatedTime: '15分钟',
              tools: ['玻璃清洁剂', '玻璃刮', '抹布']
            },
            {
              id: 's6',
              order: 6,
              title: '拖地',
              description: '使用拖把和地板清洁剂拖洗地板',
              estimatedTime: '20分钟',
              tools: ['拖把', '地板清洁剂'],
              notes: '注意不同材质地板的清洁方法'
            },
            {
              id: 's7',
              order: 7,
              title: '整理摆设',
              description: '将客厅内的装饰品、摆设等物品整理归位',
              estimatedTime: '10分钟'
            },
            {
              id: 's8',
              order: 8,
              title: '最终检查',
              description: '检查清洁效果，确保所有区域都已清洁到位',
              estimatedTime: '5分钟'
            }
          ]
        }
        
        // 模拟网络延迟
        setTimeout(() => {
          setTemplate(mockTemplate)
          if (mockTemplate.steps.length > 0) {
            setActiveStep(mockTemplate.steps[0].id)
          }
          setLoading(false)
        }, 500)
      } catch (err) {
        console.error('获取SOP模板详情失败:', err)
        setError('获取SOP模板详情失败，请稍后重试')
        setLoading(false)
      }
    }

    fetchTemplateDetail()
  }, [id])

  const handleStartSOP = () => {
    // 实际项目中应该创建一个SOP执行记录
    // 然后跳转到SOP执行页面
    alert('开始执行SOP: ' + template?.title)
    // navigate(`/sop/execution/new?templateId=${id}`)
  }

  const handleDeleteTemplate = () => {
    if (window.confirm('确定要删除此SOP模板吗？此操作不可撤销。')) {
      // 实际项目中应该调用API删除模板
      // await fetch(`/api/sop/templates/${id}`, { method: 'DELETE' })
      alert('SOP模板已删除')
      navigate('/sop/templates')
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

  if (error || !template) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">错误！</strong>
        <span className="block sm:inline"> {error || '未找到SOP模板'}</span>
        <Link to="/sop/templates" className="block mt-2 text-red-700 underline">
          返回模板列表
        </Link>
      </div>
    )
  }

  const currentStep = template.steps.find(step => step.id === activeStep)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 头部信息 */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{template.title}</h1>
              <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                {template.category}
              </span>
              <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                版本 {template.version}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{template.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">创建时间：</span>
                {template.createdAt}
              </div>
              <div>
                <span className="font-medium">更新时间：</span>
                {template.updatedAt}
              </div>
              <div>
                <span className="font-medium">作者：</span>
                {template.author}
              </div>
              <div>
                <span className="font-medium">使用次数：</span>
                {template.usageCount}
              </div>
              <div>
                <span className="font-medium">步骤数：</span>
                {template.steps.length}
              </div>
              <div>
                <span className="font-medium">总预计时间：</span>
                {template.steps.reduce((total, step) => {
                  const minutes = parseInt(step.estimatedTime) || 0
                  return total + minutes
                }, 0)} 分钟
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleStartSOP}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              开始执行
            </button>
            <Link
              to={`/sop/templates/edit/${template.id}`}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              编辑
            </Link>
            <button
              onClick={handleDeleteTemplate}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              删除
            </button>
          </div>
        </div>
      </div>

      {/* 步骤列表和详情 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 步骤列表 */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">步骤列表</h2>
          <ul className="space-y-2">
            {template.steps.map((step) => (
              <li 
                key={step.id}
                className={`p-3 rounded-md cursor-pointer ${
                  activeStep === step.id 
                    ? 'bg-primary-100 border-l-4 border-primary-500' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-white text-xs font-medium">
                    {step.order}
                  </span>
                  <span className="ml-2 font-medium">{step.title}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500 truncate">{step.description}</p>
                <p className="mt-1 text-xs text-gray-400">预计时间: {step.estimatedTime}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* 步骤详情 */}
        <div className="md:col-span-2 bg-white shadow rounded-lg p-6">
          {currentStep ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium text-gray-900">
                  步骤 {currentStep.order}: {currentStep.title}
                </h2>
                <span className="text-sm text-gray-500">预计时间: {currentStep.estimatedTime}</span>
              </div>
              
              <div className="prose max-w-none">
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
              
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => {
                    const currentIndex = template.steps.findIndex(step => step.id === activeStep)
                    if (currentIndex > 0) {
                      setActiveStep(template.steps[currentIndex - 1].id)
                    }
                  }}
                  disabled={template.steps.findIndex(step => step.id === activeStep) === 0}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一步
                </button>
                <button
                  onClick={() => {
                    const currentIndex = template.steps.findIndex(step => step.id === activeStep)
                    if (currentIndex < template.steps.length - 1) {
                      setActiveStep(template.steps[currentIndex + 1].id)
                    }
                  }}
                  disabled={template.steps.findIndex(step => step.id === activeStep) === template.steps.length - 1}
                  className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一步
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-10">
              请选择一个步骤查看详情
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SOPTemplateDetail 