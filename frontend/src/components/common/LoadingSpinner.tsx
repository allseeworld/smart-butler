import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      <span className="ml-3 text-lg text-gray-700">加载中...</span>
    </div>
  )
}

export default LoadingSpinner 