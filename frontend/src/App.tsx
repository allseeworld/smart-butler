import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/common/LoadingSpinner'

// 懒加载页面组件
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/auth/Login'))
const TaskList = lazy(() => import('./pages/task/TaskList'))
const TaskDetail = lazy(() => import('./pages/task/TaskDetail'))
const TaskCreate = lazy(() => import('./pages/task/TaskCreate'))
const ToolList = lazy(() => import('./pages/tool/ToolList'))
const ToolDetail = lazy(() => import('./pages/tool/ToolDetail'))
const ToolRegister = lazy(() => import('./pages/tool/ToolRegister'))
const MCPToolList = lazy(() => import('./pages/tool/MCPToolList'))
const MCPToolDetail = lazy(() => import('./pages/tool/MCPToolDetail'))
const KnowledgeSearch = lazy(() => import('./pages/knowledge/KnowledgeSearch'))
const KnowledgeDetail = lazy(() => import('./pages/knowledge/KnowledgeDetail'))
const KnowledgeCreate = lazy(() => import('./pages/knowledge/KnowledgeCreate'))
const SOPTemplateList = lazy(() => import('./pages/sop/SOPTemplateList'))
const SOPTemplateDetail = lazy(() => import('./pages/sop/SOPTemplateDetail'))
const SOPTemplateCreate = lazy(() => import('./pages/sop/SOPTemplateCreate'))
const SOPExecution = lazy(() => import('./pages/sop/SOPExecution'))
const SOPExecutionList = lazy(() => import('./pages/sop/SOPExecutionList'))
const UserList = lazy(() => import('./pages/user/UserList'))
const UserDetail = lazy(() => import('./pages/user/UserDetail'))
const UserCreate = lazy(() => import('./pages/user/UserCreate'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="tasks">
            <Route index element={<TaskList />} />
            <Route path="create" element={<TaskCreate />} />
            <Route path=":taskId" element={<TaskDetail />} />
          </Route>
          
          <Route path="tools">
            <Route index element={<ToolList />} />
            <Route path="register" element={<ToolRegister />} />
            <Route path=":toolId" element={<ToolDetail />} />
            <Route path="mcp">
              <Route index element={<MCPToolList />} />
              <Route path=":toolName" element={<MCPToolDetail />} />
            </Route>
          </Route>
          
          <Route path="knowledge">
            <Route index element={<KnowledgeSearch />} />
            <Route path="create" element={<KnowledgeCreate />} />
            <Route path=":knowledgeId" element={<KnowledgeDetail />} />
          </Route>
          
          <Route path="sop">
            <Route path="templates">
              <Route index element={<SOPTemplateList />} />
              <Route path="create" element={<SOPTemplateCreate />} />
              <Route path=":templateId" element={<SOPTemplateDetail />} />
              <Route path="edit/:templateId" element={<SOPTemplateCreate />} />
            </Route>
            <Route path="executions">
              <Route index element={<SOPExecutionList />} />
              <Route path=":executionId" element={<SOPExecution />} />
            </Route>
          </Route>
          
          <Route path="users">
            <Route index element={<UserList />} />
            <Route path="create" element={<UserCreate />} />
            <Route path=":userId" element={<UserDetail />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App 