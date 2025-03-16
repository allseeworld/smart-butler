import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  UsersIcon,
  DocumentTextIcon,
  PlayIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

const navigation = [
  { name: '仪表盘', href: '/dashboard', icon: HomeIcon },
  { name: '任务管理', href: '/tasks', icon: ClipboardDocumentListIcon },
  { name: '工具管理', href: '/tools', icon: WrenchScrewdriverIcon },
  { name: '知识管理', href: '/knowledge', icon: BookOpenIcon },
  { 
    name: 'SOP管理', 
    href: '/sop', 
    icon: ClipboardDocumentCheckIcon,
    children: [
      { name: 'SOP模板', href: '/sop/templates', icon: DocumentTextIcon },
      { name: 'SOP执行记录', href: '/sop/executions', icon: PlayIcon },
    ]
  },
  { name: '用户管理', href: '/users', icon: UsersIcon },
]

const Sidebar = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['/sop'])

  const toggleExpand = (href: string) => {
    if (expandedItems.includes(href)) {
      setExpandedItems(expandedItems.filter(item => item !== href))
    } else {
      setExpandedItems([...expandedItems, href])
    }
  }

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-white text-2xl font-bold">李府管家系统</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <div
                        className="group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                        onClick={() => toggleExpand(item.href)}
                      >
                        <div className="flex items-center">
                          <item.icon
                            className="mr-3 flex-shrink-0 h-6 w-6"
                            aria-hidden="true"
                          />
                          {item.name}
                        </div>
                        <svg
                          className={`h-5 w-5 transform ${
                            expandedItems.includes(item.href) ? 'rotate-90' : ''
                          } transition-transform duration-200`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      {expandedItems.includes(item.href) && (
                        <div className="ml-8 space-y-1 mt-1">
                          {item.children.map((child) => (
                            <NavLink
                              key={child.name}
                              to={child.href}
                              className={({ isActive }) =>
                                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                  isActive
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`
                              }
                            >
                              <child.icon
                                className="mr-3 flex-shrink-0 h-5 w-5"
                                aria-hidden="true"
                              />
                              {child.name}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`
                      }
                    >
                      <item.icon
                        className="mr-3 flex-shrink-0 h-6 w-6"
                        aria-hidden="true"
                      />
                      {item.name}
                    </NavLink>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar 