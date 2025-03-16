import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

interface KnowledgeFormData {
  title: string
  content: string
  category: string
  tags: string
}

const KnowledgeCreate = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<KnowledgeFormData>()
  
  const categories = ['家具保养', '电器维修', '园艺技巧', '清洁方法', '安全知识']
  
  const onSubmit = async (data: KnowledgeFormData) => {
    setIsSubmitting(true)
    try {
      // 处理标签，将逗号分隔的字符串转换为数组
      const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      
      const formattedData = {
        ...data,
        tags: tagsArray
      }
      
      // 实际项目中应该调用API创建知识
      // const response = await fetch('/api/knowledge', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(formattedData)
      // })
      // const result = await response.json()
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('创建的知识数据:', formattedData)
      
      // 模拟创建成功
      alert('知识条目创建成功')
      navigate('/knowledge')
    } catch (err) {
      console.error('创建知识条目失败:', err)
      alert('创建知识条目失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link to="/knowledge" className="text-primary-600 hover:text-primary-800">
          &larr; 返回知识库
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">添加新知识</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              {...register('title', { required: '标题不能为空' })}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              分类 <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              {...register('category', { required: '请选择分类' })}
            >
              <option value="">请选择分类</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              标签 <span className="text-red-500">*</span>
              <span className="text-gray-500 text-xs ml-1">(用逗号分隔多个标签)</span>
            </label>
            <input
              type="text"
              id="tags"
              placeholder="例如: 家具,保养,清洁"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              {...register('tags', { required: '标签不能为空' })}
            />
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              内容 <span className="text-red-500">*</span>
              <span className="text-gray-500 text-xs ml-1">(支持Markdown格式)</span>
            </label>
            <textarea
              id="content"
              rows={15}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono"
              placeholder="# 标题
## 子标题
正文内容...

- 列表项1
- 列表项2

1. 有序列表项1
2. 有序列表项2"
              {...register('content', { required: '内容不能为空' })}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <Link
              to="/knowledge"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSubmitting ? '提交中...' : '创建知识'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default KnowledgeCreate 