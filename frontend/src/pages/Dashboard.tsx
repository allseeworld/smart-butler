import React from 'react';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  WrenchScrewdriverIcon, 
  BookOpenIcon,
  UserIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-medium text-gray-900">仪表盘</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 任务统计卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              <ClipboardDocumentListIcon className="h-2.5 w-2.5 text-blue-600" />
            </div>
            <h2 className="text-xs font-medium text-gray-800">任务统计</h2>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-xs text-gray-500">待处理</p>
              <p className="text-sm font-bold text-blue-600">12</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">进行中</p>
              <p className="text-sm font-bold text-yellow-500">8</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">已完成</p>
              <p className="text-sm font-bold text-green-500">24</p>
            </div>
          </div>
        </div>
        
        {/* 工具使用统计卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
              <WrenchScrewdriverIcon className="h-2.5 w-2.5 text-indigo-600" />
            </div>
            <h2 className="text-xs font-medium text-gray-800">工具使用统计</h2>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">清洁工具</span>
              <span className="text-xs font-medium text-indigo-600">32次</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">厨房用具</span>
              <span className="text-xs font-medium text-indigo-600">28次</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">园艺工具</span>
              <span className="text-xs font-medium text-indigo-600">15次</span>
            </div>
          </div>
        </div>
        
        {/* 知识库统计卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
              <BookOpenIcon className="h-2.5 w-2.5 text-green-600" />
            </div>
            <h2 className="text-xs font-medium text-gray-800">知识库统计</h2>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">总条目数</span>
              <span className="text-xs font-medium text-green-600">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">本月新增</span>
              <span className="text-xs font-medium text-green-600">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">最常查询</span>
              <span className="text-xs font-medium text-green-600">家具保养</span>
            </div>
          </div>
        </div>
        
        {/* 用户统计卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
              <UserIcon className="h-2.5 w-2.5 text-purple-600" />
            </div>
            <h2 className="text-xs font-medium text-gray-800">用户统计</h2>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">活跃用户</span>
              <span className="text-xs font-medium text-purple-600">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">管理员</span>
              <span className="text-xs font-medium text-purple-600">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">普通用户</span>
              <span className="text-xs font-medium text-purple-600">6</span>
            </div>
          </div>
        </div>
        
        {/* SOP统计卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mr-2">
              <ClipboardDocumentListIcon className="h-2.5 w-2.5 text-amber-600" />
            </div>
            <h2 className="text-xs font-medium text-gray-800">SOP统计</h2>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">模板数量</span>
              <span className="text-xs font-medium text-amber-600">15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">执行中</span>
              <span className="text-xs font-medium text-amber-600">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">已完成</span>
              <span className="text-xs font-medium text-amber-600">42</span>
            </div>
          </div>
        </div>
        
        {/* 系统状态卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center mr-2">
              <ChartBarIcon className="h-2.5 w-2.5 text-cyan-600" />
            </div>
            <h2 className="text-xs font-medium text-gray-800">系统状态</h2>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">CPU使用率</span>
              <span className="text-xs font-medium text-cyan-600">23%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">内存使用</span>
              <span className="text-xs font-medium text-cyan-600">512MB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">运行时间</span>
              <span className="text-xs font-medium text-cyan-600">7天</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 最近任务列表 */}
      <div className="mt-4 bg-white rounded-lg shadow-sm">
        <div className="px-3 py-2 border-b border-gray-200 flex items-center">
          <ClipboardDocumentListIcon className="h-2.5 w-2.5 text-gray-500 mr-2" />
          <h2 className="text-xs font-medium text-gray-800">最近任务</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">任务名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">负责人</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">截止日期</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">客厅清洁</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">张三</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">已完成</span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">2023-11-15</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">厨房设备维护</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">李四</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">进行中</span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">2023-11-20</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">花园修剪</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">王五</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">待处理</span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">2023-11-25</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 