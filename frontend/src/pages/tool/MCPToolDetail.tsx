import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getMCPTools, 
  MCPTool, 
  callMCPTool, 
  pollMCPToolStatus, 
  MCPToolStatus 
} from '../../services/mcpService';
import { Loader2, ArrowLeft, Send, RefreshCw } from '../../components/ui/icons';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Alert } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

// 简单的SelectContent组件
const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10 max-h-60 overflow-auto">
    {children}
  </div>
);

// 简单的SelectTrigger组件
const SelectTrigger = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer">
    {children}
  </div>
);

// 简单的SelectValue组件
const SelectValue = ({ placeholder }: { placeholder: string }) => (
  <span className="text-gray-500">{placeholder}</span>
);

// 简单的SelectItem组件
const SelectItem = ({ value, children }: { value: string, children: React.ReactNode }) => (
  <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer" data-value={value}>
    {children}
  </div>
);

// 简单的AlertTitle组件
const AlertTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-medium mb-1">{children}</h3>
);

// 简单的AlertDescription组件
const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm">{children}</div>
);

const MCPToolDetail: React.FC = () => {
  const { toolName } = useParams<{ toolName: string }>();
  const navigate = useNavigate();
  
  const [tool, setTool] = useState<MCPTool | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 工具参数和调用状态
  const [params, setParams] = useState<Record<string, any>>({});
  const [calling, setCalling] = useState<boolean>(false);
  const [callResult, setCallResult] = useState<MCPToolStatus | null>(null);
  const [activeTab, setActiveTab] = useState<string>('form');
  
  // 加载工具详情
  useEffect(() => {
    const fetchToolDetail = async () => {
      try {
        setLoading(true);
        const tools = await getMCPTools();
        const foundTool = tools.find(t => t.name === toolName);
        
        if (foundTool) {
          setTool(foundTool);
          
          // 初始化参数默认值
          const defaultParams: Record<string, any> = {};
          Object.entries(foundTool.inputSchema.properties).forEach(([key, prop]: [string, any]) => {
            if (prop.default !== undefined) {
              defaultParams[key] = prop.default;
            } else if (prop.type === 'string') {
              defaultParams[key] = '';
            } else if (prop.type === 'number' || prop.type === 'integer') {
              defaultParams[key] = 0;
            } else if (prop.type === 'boolean') {
              defaultParams[key] = false;
            } else if (prop.type === 'array') {
              defaultParams[key] = [];
            } else if (prop.type === 'object') {
              defaultParams[key] = {};
            }
          });
          
          setParams(defaultParams);
          setError(null);
        } else {
          setError(`未找到名为 "${toolName}" 的工具`);
        }
      } catch (err) {
        console.error('获取工具详情失败:', err);
        setError('获取工具详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    if (toolName) {
      fetchToolDetail();
    }
  }, [toolName]);
  
  // 处理参数变化
  const handleParamChange = (key: string, value: any) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // 调用工具
  const handleCallTool = async () => {
    if (!tool) return;
    
    try {
      setCalling(true);
      setCallResult(null);
      
      // 调用工具
      const result = await callMCPTool(tool.name, params);
      
      // 从响应中提取调用ID
      const invokeIdMatch = result.content[0]?.text.match(/调用ID: ([a-zA-Z0-9-]+)/);
      if (invokeIdMatch && invokeIdMatch[1]) {
        const invokeId = invokeIdMatch[1];
        
        // 轮询调用状态
        const status = await pollMCPToolStatus(invokeId);
        setCallResult(status);
        
        // 切换到结果标签
        setActiveTab('result');
      } else {
        setError('无法获取调用ID');
      }
    } catch (err) {
      console.error('调用工具失败:', err);
      setError('调用工具失败，请稍后重试');
    } finally {
      setCalling(false);
    }
  };
  
  // 渲染参数输入表单
  const renderParamInput = (key: string, prop: any) => {
    const isRequired = tool?.inputSchema.required?.includes(key);
    
    if (prop.enum) {
      // 枚举类型，使用下拉选择
      return (
        <div className="space-y-1" key={key}>
          <Label htmlFor={key}>
            {key} {isRequired && <span className="text-red-500">*</span>}
          </Label>
          <Select
            options={prop.enum.map((option: string) => ({ value: option, label: option }))}
            value={params[key] || ''}
            onChange={(value) => handleParamChange(key, value)}
          />
          {prop.description && <p className="text-xs text-gray-500">{prop.description}</p>}
        </div>
      );
    } else if (prop.type === 'string' && (key === 'text' || key === 'content' || key === 'query')) {
      // 文本类型，使用文本域
      return (
        <div className="space-y-1" key={key}>
          <Label htmlFor={key}>
            {key} {isRequired && <span className="text-red-500">*</span>}
          </Label>
          <Textarea
            id={key}
            value={params[key] || ''}
            onChange={(e) => handleParamChange(key, e.target.value)}
            placeholder={prop.description || `请输入${key}`}
            rows={5}
          />
          {prop.description && <p className="text-xs text-gray-500">{prop.description}</p>}
        </div>
      );
    } else if (prop.type === 'boolean') {
      // 布尔类型，使用复选框
      return (
        <div className="flex items-center space-x-2" key={key}>
          <input
            type="checkbox"
            id={key}
            checked={!!params[key]}
            onChange={(e) => handleParamChange(key, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor={key}>
            {key} {isRequired && <span className="text-red-500">*</span>}
          </Label>
          {prop.description && <p className="text-xs text-gray-500">{prop.description}</p>}
        </div>
      );
    } else {
      // 默认使用文本输入框
      return (
        <div className="space-y-1" key={key}>
          <Label htmlFor={key}>
            {key} {isRequired && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id={key}
            type={prop.type === 'number' || prop.type === 'integer' ? 'number' : 'text'}
            value={params[key] || ''}
            onChange={(e) => handleParamChange(
              key, 
              prop.type === 'number' || prop.type === 'integer' 
                ? parseFloat(e.target.value) 
                : e.target.value
            )}
            placeholder={prop.description || `请输入${key}`}
          />
          {prop.description && <p className="text-xs text-gray-500">{prop.description}</p>}
        </div>
      );
    }
  };
  
  // 渲染调用结果
  const renderCallResult = () => {
    if (!callResult) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant={callResult.status === 'success' ? 'success' : callResult.status === 'failed' ? 'danger' : 'default'}>
            {callResult.status === 'success' ? '成功' : callResult.status === 'failed' ? '失败' : '处理中'}
          </Badge>
          <span className="text-sm text-gray-500">
            调用ID: {callResult.invoke_id}
          </span>
        </div>
        
        {callResult.status === 'success' && callResult.output && (
          <Card>
            <CardHeader>
              <CardTitle>调用结果</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(callResult.output, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
        
        {callResult.status === 'failed' && callResult.error && (
          <Alert variant="error">
            <AlertTitle>调用失败</AlertTitle>
            <AlertDescription>{callResult.error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setActiveTab('form')}>
            返回表单
          </Button>
          <Button onClick={handleCallTool}>
            <RefreshCw className="mr-2 h-4 w-4" />
            重新调用
          </Button>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">加载中...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" onClick={() => navigate('/tools/mcp')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回工具列表
        </Button>
        <Alert variant="error">
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!tool) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" onClick={() => navigate('/tools/mcp')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回工具列表
        </Button>
        <Alert>
          <AlertTitle>未找到工具</AlertTitle>
          <AlertDescription>未找到指定的工具，请返回工具列表重新选择。</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" onClick={() => navigate('/tools/mcp')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回工具列表
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{tool.name}</CardTitle>
              <CardDescription>{tool.description || '无描述'}</CardDescription>
            </div>
            {tool.capabilities && tool.capabilities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tool.capabilities.map((capability) => (
                  <Badge key={capability} variant="secondary">
                    {capability}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="form">参数表单</TabsTrigger>
              <TabsTrigger value="result" disabled={!callResult}>调用结果</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="space-y-4">
              {Object.entries(tool.inputSchema.properties).map(([key, prop]: [string, any]) => 
                renderParamInput(key, prop)
              )}
              
              <div className="flex justify-end mt-4">
                <Button onClick={handleCallTool} disabled={calling}>
                  {calling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      调用中...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      调用工具
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="result">
              {renderCallResult()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MCPToolDetail; 