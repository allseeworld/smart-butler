import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Loader2 } from '../../components/ui/icons';
import { getMCPTools, MCPTool } from '../../services/mcpService';

const MCPToolList: React.FC = () => {
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const toolsData = await getMCPTools();
        setTools(toolsData);
        setError(null);
      } catch (err) {
        console.error('获取MCP工具列表失败:', err);
        setError('获取工具列表失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  // 根据工具类型返回不同的颜色
  const getToolTypeColor = (schema: any): string => {
    if (schema.properties.query) return 'bg-blue-100 text-blue-800'; // 数据库查询
    if (schema.properties.city) return 'bg-green-100 text-green-800'; // 天气查询
    if (schema.properties.text) return 'bg-purple-100 text-purple-800'; // 文本处理
    return 'bg-gray-100 text-gray-800'; // 默认
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">MCP工具列表</h1>
        <Button variant="outline">
          <Link to="/tools">返回工具管理</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">加载中...</span>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">错误：</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">暂无可用的MCP工具</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.name} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle>{tool.name}</CardTitle>
                <CardDescription>{tool.description || '无描述'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">参数：</h4>
                  <div className="space-y-1">
                    {Object.entries(tool.inputSchema.properties).map(([key, prop]: [string, any]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium">{key}</span>
                        <span className="text-gray-500 ml-1">
                          ({prop.type})
                          {tool.inputSchema.required?.includes(key) && <span className="text-red-500 ml-1">*</span>}
                        </span>
                        {prop.description && <p className="text-xs text-gray-500">{prop.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
                {tool.capabilities && tool.capabilities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">能力：</h4>
                    <div className="flex flex-wrap gap-1">
                      {tool.capabilities.map((capability) => (
                        <Badge key={capability} variant="secondary">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Link to={`/tools/mcp/${tool.name}`} className="text-white w-full block">使用工具</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MCPToolList; 