import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

interface KnowledgeItem {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  viewCount: number
  author: string
  relatedItems?: {
    id: string
    title: string
  }[]
}

const KnowledgeDetail = () => {
  const { knowledgeId } = useParams<{ knowledgeId: string }>()
  const navigate = useNavigate()
  const [knowledge, setKnowledge] = useState<KnowledgeItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // 模拟从API获取知识详情
    const fetchKnowledgeDetail = async () => {
      try {
        setLoading(true)
        // 实际项目中应该从API获取数据
        // const response = await fetch(`/api/knowledge/${knowledgeId}`)
        // const data = await response.json()
        
        // 模拟数据
        const mockKnowledge: KnowledgeItem = {
          id: knowledgeId || '1',
          title: '实木家具保养指南',
          content: `
# 实木家具保养指南

实木家具因其自然美观、环保健康的特性，成为许多家庭的首选。但实木家具需要定期保养，才能保持其美观和延长使用寿命。

## 日常清洁

1. **定期除尘**：使用柔软的棉布或鸡毛掸轻轻除去表面灰尘。
2. **避免湿擦**：清洁时避免使用过湿的布料，以防水分渗入木材导致变形。
3. **专用清洁剂**：可使用专门的木质家具清洁剂，按说明使用。

## 防潮防晒

1. **避免阳光直射**：长时间阳光直射会导致实木家具褪色、开裂。
2. **保持适宜湿度**：室内湿度最好保持在40%-60%之间，过于干燥或潮湿都会对实木家具造成损害。
3. **远离热源**：避免将实木家具放置在暖气、空调出风口等热源附近。

## 定期保养

1. **打蜡保养**：每3-6个月使用优质家具蜡进行保养，能够滋润木质并形成保护层。
2. **修补划痕**：小划痕可用同色系的家具修复笔或核桃仁轻轻擦拭。
3. **紧固件检查**：定期检查螺丝、铰链等紧固件，及时拧紧松动部件。

## 特殊情况处理

1. **水渍处理**：如有水渍，立即用干布吸干，然后用吹风机低温档吹干。
2. **油渍处理**：可用少量酒精轻轻擦拭，然后立即用干布擦干。
3. **霉变处理**：轻微霉变可用布蘸少量酒精擦拭，严重霉变建议请专业人士处理。

遵循以上保养方法，您的实木家具将能保持长久的美观和使用寿命。
          `,
          category: '家具保养',
          tags: ['实木家具', '保养', '清洁'],
          createdAt: '2023-10-15',
          updatedAt: '2023-11-02',
          viewCount: 156,
          author: '李管家',
          relatedItems: [
            {
              id: '4',
              title: '大理石台面清洁方法'
            },
            {
              id: '7',
              title: '皮质沙发保养技巧'
            }
          ]
        }
        
        // 模拟网络延迟
        setTimeout(() => {
          setKnowledge(mockKnowledge)
          setLoading(false)
        }, 500)
      } catch (err) {
        console.error('获取知识详情失败:', err)
        setError('获取知识详情失败，请稍后重试')
        setLoading(false)
      }
    }

    if (knowledgeId) {
      fetchKnowledgeDetail()
    } else {
      setError('知识ID无效')
      setLoading(false)
    }
  }, [knowledgeId])

  const handleDelete = async () => {
    if (window.confirm('确定要删除此知识条目吗？')) {
      try {
        // 实际项目中应该调用API删除知识
        // await fetch(`/api/knowledge/${knowledgeId}`, {
        //   method: 'DELETE'
        // })
        
        // 模拟删除成功
        alert('知识条目已成功删除')
        navigate('/knowledge')
      } catch (err) {
        console.error('删除知识条目失败:', err)
        alert('删除知识条目失败，请稍后重试')
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

  if (error || !knowledge) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">错误！</strong>
        <span className="block sm:inline"> {error || '无法加载知识详情'}</span>
        <div className="mt-4">
          <Link to="/knowledge" className="text-red-700 underline">返回知识库</Link>
        </div>
      </div>
    )
  }

  // 将Markdown内容转换为HTML（简化版，实际项目中应使用markdown-to-jsx或react-markdown等库）
  const renderContent = () => {
    const lines = knowledge.content.split('\n')
    return (
      <div className="prose prose-primary max-w-none">
        {lines.map((line, index) => {
          if (line.startsWith('# ')) {
            return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h1>
          } else if (line.startsWith('## ')) {
            return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{line.substring(3)}</h2>
          } else if (line.startsWith('### ')) {
            return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{line.substring(4)}</h3>
          } else if (line.startsWith('1. ')) {
            return <li key={index} className="ml-6 list-decimal">{line.substring(3)}</li>
          } else if (line.startsWith('2. ') || line.startsWith('3. ')) {
            return <li key={index} className="ml-6 list-decimal">{line.substring(3)}</li>
          } else if (line.startsWith('- ')) {
            return <li key={index} className="ml-6 list-disc">{line.substring(2)}</li>
          } else if (line.trim() === '') {
            return <br key={index} />
          } else {
            return <p key={index} className="my-2">{line}</p>
          }
        })}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link to="/knowledge" className="text-primary-600 hover:text-primary-800">
          &larr; 返回知识库
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{knowledge.title}</h1>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <span>作者: {knowledge.author}</span>
              <span className="mx-2">•</span>
              <span>更新于: {knowledge.updatedAt}</span>
              <span className="mx-2">•</span>
              <span>浏览: {knowledge.viewCount}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/knowledge/${knowledge.id}/edit`}
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
        
        <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-500 mr-2">分类:</span>
            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
              {knowledge.category}
            </span>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-sm font-medium text-gray-500 mr-2">标签:</span>
            <div className="flex flex-wrap gap-1">
              {knowledge.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4">
          {renderContent()}
        </div>
      </div>
      
      {/* 相关知识 */}
      {knowledge.relatedItems && knowledge.relatedItems.length > 0 && (
        <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">相关知识</h2>
          </div>
          <div className="px-6 py-4">
            <ul className="divide-y divide-gray-200">
              {knowledge.relatedItems.map((item) => (
                <li key={item.id} className="py-3">
                  <Link to={`/knowledge/${item.id}`} className="text-primary-600 hover:text-primary-800">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default KnowledgeDetail 