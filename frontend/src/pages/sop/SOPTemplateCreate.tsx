import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray, Controller } from 'react-hook-form'

interface StepForm {
  title: string
  description: string
  estimatedTime: string
  tools?: string
  notes?: string
}

interface SOPTemplateForm {
  title: string
  description: string
  category: string
  steps: StepForm[]
}

const SOPTemplateCreate = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const categories = ['日常清洁', '设备维护', '安全检查', '接待服务', '餐饮服务']
  
  const { register, control, handleSubmit, formState: { errors } } = useForm<SOPTemplateForm>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      steps: [{ title: '', description: '', estimatedTime: '', tools: '', notes: '' }]
    }
  })
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'steps'
  })
  
  const onSubmit = async (data: SOPTemplateForm) => {
    try {
      setIsSubmitting(true)
      setError('')
      
      // 处理工具字段，将逗号分隔的字符串转换为数组
      const formattedData = {
        ...data,
        steps: data.steps.map(step => ({
          ...step,
          tools: step.tools ? step.tools.split(',').map(tool => tool.trim()) : []
        }))
      }
      
      console.log('提交的SOP模板数据:', formattedData)
      
      // 实际项目中应该调用API创建模板
      // const response = await fetch('/api/sop/templates', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(formattedData)
      // })
      // 
      // if (!response.ok) {
      //   throw new Error('创建SOP模板失败')
      // }
      // 
      // const result = await response.json()
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('SOP模板创建成功！')
      navigate('/sop/templates')
    } catch (err) {
      console.error('创建SOP模板失败:', err)
      setError('创建SOP模板失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">创建SOP模板</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">错误！</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 基本信息 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">基本信息</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                标题 <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                className={`block w-full rounded-md shadow-sm ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'}`}
                placeholder="输入SOP模板标题"
                {...register('title', { required: '标题不能为空' })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                分类 <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                className={`block w-full rounded-md shadow-sm ${errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'}`}
                {...register('category', { required: '请选择分类' })}
              >
                <option value="">选择分类</option>
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
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={3}
                className={`block w-full rounded-md shadow-sm ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'}`}
                placeholder="输入SOP模板描述"
                {...register('description', { required: '描述不能为空' })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* 步骤列表 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">步骤列表</h2>
            <button
              type="button"
              onClick={() => append({ title: '', description: '', estimatedTime: '', tools: '', notes: '' })}
              className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              添加步骤
            </button>
          </div>
          
          {fields.map((field, index) => (
            <div key={field.id} className="mb-8 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium text-gray-800">步骤 {index + 1}</h3>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`block w-full rounded-md shadow-sm ${errors.steps?.[index]?.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'}`}
                    placeholder="步骤标题"
                    {...register(`steps.${index}.title` as const, { required: '步骤标题不能为空' })}
                  />
                  {errors.steps?.[index]?.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.steps?.[index]?.title?.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    预计时间 (分钟) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`block w-full rounded-md shadow-sm ${errors.steps?.[index]?.estimatedTime ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'}`}
                    placeholder="例如: 15分钟"
                    {...register(`steps.${index}.estimatedTime` as const, { 
                      required: '预计时间不能为空',
                      pattern: {
                        value: /^\d+分钟$/,
                        message: '格式应为: 数字+分钟，例如 15分钟'
                      }
                    })}
                  />
                  {errors.steps?.[index]?.estimatedTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.steps?.[index]?.estimatedTime?.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    className={`block w-full rounded-md shadow-sm ${errors.steps?.[index]?.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'}`}
                    placeholder="步骤详细描述"
                    {...register(`steps.${index}.description` as const, { required: '步骤描述不能为空' })}
                  />
                  {errors.steps?.[index]?.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.steps?.[index]?.description?.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    所需工具 (用逗号分隔)
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="例如: 吸尘器, 拖把, 抹布"
                    {...register(`steps.${index}.tools` as const)}
                  />
                  <p className="mt-1 text-xs text-gray-500">多个工具请用逗号分隔</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    注意事项
                  </label>
                  <textarea
                    rows={2}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="步骤执行时的注意事项"
                    {...register(`steps.${index}.notes` as const)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {fields.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              请添加至少一个步骤
            </div>
          )}
        </div>
        
        {/* 提交按钮 */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/sop/templates')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '提交中...' : '创建模板'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SOPTemplateCreate 