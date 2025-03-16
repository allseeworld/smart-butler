import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500 mb-2"></div>
        <span className="text-xs text-gray-600">加载中...</span>
      </div>
    </div>
  )
}

export default LoadingSpinner 