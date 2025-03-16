import React from 'react'

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">李府管家系统仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 任务统计卡片 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">任务统计</h2>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-sm text-gray-500">待处理</p>
              <p className="text-2xl font-bold text-primary-600">12</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">进行中</p>
              <p className="text-2xl font-bold text-yellow-500">8</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">已完成</p>
              <p className="text-2xl font-bold text-green-500">24</p>
            </div>
          </div>
        </div>
        
        {/* 工具使用统计卡片 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">工具使用统计</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">清洁工具</span>
              <span className="text-primary-600 font-medium">32次</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">厨房用具</span>
              <span className="text-primary-600 font-medium">28次</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">园艺工具</span>
              <span className="text-primary-600 font-medium">15次</span>
            </div>
          </div>
        </div>
        
        {/* 知识库统计卡片 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">知识库统计</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">总条目数</span>
              <span className="text-primary-600 font-medium">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">本月新增</span>
              <span className="text-primary-600 font-medium">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">最常查询</span>
              <span className="text-primary-600 font-medium">家具保养</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 最近任务列表 */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">最近任务</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">任务名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">负责人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">截止日期</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">客厅清洁</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">张三</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">已完成</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-11-15</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">厨房设备维护</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">李四</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">进行中</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-11-20</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">花园修剪</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">王五</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">待处理</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-11-25</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 