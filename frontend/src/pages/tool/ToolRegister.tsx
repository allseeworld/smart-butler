import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

interface ToolFormData {
  name: string
  category: string
  brand: string
  model: string
  serialNumber: string
  purchaseDate: string
  location: string
  description?: string
}

const ToolRegister = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<ToolFormData>()
  
  const onSubmit = async (data: ToolFormData) => {
    setIsSubmitting(true)
    try {
      // 实际项目中应该调用API创建工具
      // const response = await fetch('/api/tools', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(data)
      // })
      // const result = await response.json()
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('登记的工具数据:', data)
      
      // 模拟创建成功
      alert('工具登记成功')
      navigate('/tools')
    } catch (err) {
      console.error('登记工具失败:', err)
      alert('登记工具失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link to="/tools" className="text-primary-600 hover:text-primary-800">
          &larr; 返回工具列表
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">登记新工具</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              工具名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              {...register('name', { required: '工具名称不能为空' })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                类别 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="category"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                {...register('category', { required: '类别不能为空' })}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                存放位置 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                {...register('location', { required: '存放位置不能为空' })}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                品牌 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="brand"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                {...register('brand', { required: '品牌不能为空' })}
              />
              {errors.brand && (
                <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                型号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="model"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                {...register('model', { required: '型号不能为空' })}
              />
              {errors.model && (
                <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                序列号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="serialNumber"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                {...register('serialNumber', { required: '序列号不能为空' })}
              />
              {errors.serialNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.serialNumber.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
                购买日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="purchaseDate"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                {...register('purchaseDate', { required: '购买日期不能为空' })}
              />
              {errors.purchaseDate && (
                <p className="mt-1 text-sm text-red-600">{errors.purchaseDate.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              描述
            </label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              {...register('description')}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Link
              to="/tools"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSubmitting ? '提交中...' : '登记工具'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ToolRegister 