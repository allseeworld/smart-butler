import api from './api';

// MCP工具定义接口
export interface MCPTool {
  name: string;
  description?: string;
  capabilities?: string[];
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

// MCP工具列表响应接口
export interface MCPToolsListResponse {
  tools: MCPTool[];
  nextCursor?: string;
}

// MCP工具调用请求接口
export interface MCPToolCallRequest {
  name: string;
  arguments: Record<string, any>;
}

// MCP工具调用响应接口
export interface MCPToolCallResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

// MCP工具调用状态接口
export interface MCPToolStatus {
  invoke_id: string;
  status: 'running' | 'success' | 'failed';
  started_at: string;
  finished_at?: string;
  output?: Record<string, any>;
  error?: string;
}

/**
 * 获取MCP工具列表
 */
export const getMCPTools = async (): Promise<MCPTool[]> => {
  try {
    const response = await api.get<MCPToolsListResponse>('/mcp/tools/list');
    return response.data.tools;
  } catch (error) {
    console.error('获取MCP工具列表失败:', error);
    throw error;
  }
};

/**
 * 调用MCP工具
 * @param name 工具名称
 * @param args 工具参数
 */
export const callMCPTool = async (name: string, args: Record<string, any>): Promise<MCPToolCallResponse> => {
  try {
    const request: MCPToolCallRequest = {
      name,
      arguments: args
    };
    const response = await api.post<MCPToolCallResponse>('/mcp/tools/call', request);
    return response.data;
  } catch (error) {
    console.error(`调用MCP工具 ${name} 失败:`, error);
    throw error;
  }
};

/**
 * 获取MCP工具调用状态
 * @param invokeId 调用ID
 */
export const getMCPToolStatus = async (invokeId: string): Promise<MCPToolStatus> => {
  try {
    const response = await api.get<MCPToolStatus>(`/mcp/tools/status/${invokeId}`);
    return response.data;
  } catch (error) {
    console.error(`获取MCP工具调用状态失败 (${invokeId}):`, error);
    throw error;
  }
};

/**
 * 轮询MCP工具调用状态直到完成
 * @param invokeId 调用ID
 * @param interval 轮询间隔(毫秒)
 * @param maxAttempts 最大尝试次数
 */
export const pollMCPToolStatus = async (
  invokeId: string,
  interval = 1000,
  maxAttempts = 30
): Promise<MCPToolStatus> => {
  let attempts = 0;
  
  const poll = async (): Promise<MCPToolStatus> => {
    attempts++;
    const status = await getMCPToolStatus(invokeId);
    
    if (status.status !== 'running' || attempts >= maxAttempts) {
      return status;
    }
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(poll()), interval);
    });
  };
  
  return poll();
}; 