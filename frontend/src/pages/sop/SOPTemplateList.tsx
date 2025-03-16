import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface SOPTemplate {
  id: string
  title: string
  description: string
  category: string
  steps: number
  createdAt: string
  updatedAt: string
  author: string
  usageCount: number
}

const SOPTemplateList = () => {
  const [templates, setTemplates] = useState<SOPTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  
  const categories = ['日常清洁', '设备维护', '安全检查', '接待服务', '餐饮服务']

  useEffect(() => {
    // 模拟从API获取SOP模板列表
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        // 实际项目中应该从API获取数据
        // const response = await fetch('/api/sop/templates')
        // const data = await response.json()
        
        // 模拟数据
        const mockTemplates: SOPTemplate[] = [
          {
            id: '1',
            title: '客厅日常清洁流程',
            description: '详细的客厅清洁标准操作流程，包括地板、家具、窗户等清洁步骤',
            category: '日常清洁',
            steps: 8,
            createdAt: '2023-10-15',
            updatedAt: '2023-11-02',
            author: '李管家',
            usageCount: 42
          },
          {
            id: '2',
            title: '空调季度维护流程',
            description: '空调季度维护的标准操作流程，包括清洗滤网、检查制冷效果等步骤',
            category: '设备维护',
            steps: 6,
            createdAt: '2023-09-20',
            updatedAt: '2023-10-25',
            author: '张工程师',
            usageCount: 15
          },
          {
            id: '3',
            title: '家庭消防安全检查流程',
            description: '家庭消防安全检查的标准操作流程，包括检查灭火器、烟雾报警器等步骤',
            category: '安全检查',
            steps: 10,
            createdAt: '2023-11-05',
            updatedAt: '2023-11-05',
            author: '王安全',
            usageCount: 28
          },
          {
            id: '4',
            title: '客人接待流程',
            description: '客人到访的标准接待流程，包括迎接、引导、茶水准备等步骤',
            category: '接待服务',
            steps: 7,
            createdAt: '2023-10-10',
            updatedAt: '2023-11-01',
            author: '赵接待',
            usageCount: 36
          },
          {
            id: '5',
            title: '家庭晚宴准备流程',
            description: '家庭晚宴的准备流程，包括餐具摆放、菜品准备、上菜顺序等步骤',
            category: '餐饮服务',
            steps: 12,
            createdAt: '2023-09-15',
            updatedAt: '2023-10-20',
            author: '钱厨师',
            usageCount: 22
          }
        ]
        
        // 模拟网络延迟
        setTimeout(() => {
          setTemplates(mockTemplates)
          setLoading(false)
        }, 500)
      } catch (err) {
        console.error('获取SOP模板失败:', err)
        setError('获取SOP模板列表失败，请稍后重试')
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  // 过滤SOP模板
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchTerm === '' || 
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === '' || template.category === selectedCategory
    
    return matchesSearch && matchesCategory
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
        <h1 className="text-2xl font-bold text-gray-900">SOP模板</h1>
        <Link
          to="/sop/templates/create"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          创建模板
        </Link>
      </div>
      
      {/* 搜索和过滤 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              搜索
            </label>
            <input
              type="text"
              id="search"
              placeholder="搜索标题或描述..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              分类
            </label>
            <select
              id="category"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
      
      {/* SOP模板列表 */}
      {filteredTemplates.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {filteredTemplates.map((template) => (
              <li key={template.id} className="hover:bg-gray-50">
                <Link to={`/sop/templates/${template.id}`} className="block">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-primary-600 truncate">{template.title}</p>
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {template.category}
                        </span>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="text-sm text-gray-500">步骤数: {template.steps}</p>
                        <p className="ml-4 text-sm text-gray-500">使用次数: {template.usageCount}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {template.description}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>更新于: {template.updatedAt}</p>
                        <p className="ml-4">作者: {template.author}</p>
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
          没有找到匹配的SOP模板
        </div>
      )}
    </div>
  )
}

export default SOPTemplateList 