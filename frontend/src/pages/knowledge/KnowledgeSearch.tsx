import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface KnowledgeItem {
  id: string
  title: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  viewCount: number
}

const KnowledgeSearch = () => {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  
  const categories = ['家具保养', '电器维修', '园艺技巧', '清洁方法', '安全知识']

  useEffect(() => {
    // 模拟从API获取知识库列表
    const fetchKnowledgeItems = async () => {
      try {
        setLoading(true)
        // 实际项目中应该从API获取数据
        // const response = await fetch('/api/knowledge')
        // const data = await response.json()
        
        // 模拟数据
        const mockItems: KnowledgeItem[] = [
          {
            id: '1',
            title: '实木家具保养指南',
            category: '家具保养',
            tags: ['实木家具', '保养', '清洁'],
            createdAt: '2023-10-15',
            updatedAt: '2023-11-02',
            viewCount: 156
          },
          {
            id: '2',
            title: '空调滤网清洗方法',
            category: '电器维修',
            tags: ['空调', '清洗', '维护'],
            createdAt: '2023-09-20',
            updatedAt: '2023-10-25',
            viewCount: 98
          },
          {
            id: '3',
            title: '室内植物浇水技巧',
            category: '园艺技巧',
            tags: ['植物', '浇水', '养护'],
            createdAt: '2023-11-05',
            updatedAt: '2023-11-05',
            viewCount: 42
          },
          {
            id: '4',
            title: '大理石台面清洁方法',
            category: '清洁方法',
            tags: ['大理石', '清洁', '保养'],
            createdAt: '2023-10-10',
            updatedAt: '2023-11-01',
            viewCount: 87
          },
          {
            id: '5',
            title: '家庭用电安全指南',
            category: '安全知识',
            tags: ['用电安全', '预防', '应急'],
            createdAt: '2023-09-15',
            updatedAt: '2023-10-20',
            viewCount: 124
          }
        ]
        
        // 模拟网络延迟
        setTimeout(() => {
          setKnowledgeItems(mockItems)
          setLoading(false)
        }, 500)
      } catch (err) {
        console.error('获取知识库失败:', err)
        setError('获取知识库列表失败，请稍后重试')
        setLoading(false)
      }
    }

    fetchKnowledgeItems()
  }, [])

  // 过滤知识库条目
  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === '' || item.category === selectedCategory
    
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
        <h1 className="text-2xl font-bold text-gray-900">知识库</h1>
        <Link
          to="/knowledge/create"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          添加知识
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
              placeholder="搜索标题或标签..."
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
      
      {/* 知识库列表 */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              to={`/knowledge/${item.id}`}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h2>
                  <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>更新于: {item.updatedAt}</span>
                  <span>浏览: {item.viewCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          没有找到匹配的知识条目
        </div>
      )}
    </div>
  )
}

export default KnowledgeSearch 