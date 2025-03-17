"""
基于LangGraph的智能Agent实现
用于任务的自动化执行和优化
"""

import os
from typing import Annotated, Literal, TypedDict, List, Dict, Any, Optional
from enum import Enum

from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, FunctionMessage
from langchain_core.tools import tool, BaseTool
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.prebuilt import ToolNode

# 定义Agent状态
class AgentState(TypedDict):
    """Agent的状态定义"""
    messages: List[Any]  # 消息历史
    task_id: Optional[str]  # 当前任务ID
    task_info: Optional[Dict[str, Any]]  # 任务相关信息
    tools_results: Optional[Dict[str, Any]]  # 工具调用结果
    memory: Optional[Dict[str, Any]]  # 记忆/上下文
    status: Optional[str]  # 任务状态


# 定义工具
@tool
def search_knowledge_base(query: str) -> str:
    """搜索知识库获取相关信息"""
    # 这里是示例实现，实际应该连接到知识库服务
    return f"知识库中关于'{query}'的信息: 这是一个示例回复"

@tool
def get_task_details(task_id: str) -> Dict[str, Any]:
    """获取任务详细信息"""
    # 这里是示例实现，实际应该从数据库获取任务信息
    return {
        "id": task_id,
        "title": "示例任务",
        "description": "这是一个示例任务描述",
        "priority": "高",
        "deadline": "2023-12-31"
    }

@tool
def update_task_status(task_id: str, status: str) -> str:
    """更新任务状态"""
    # 这里是示例实现，实际应该更新数据库中的任务状态
    return f"任务 {task_id} 状态已更新为 {status}"

@tool
def get_sop_template(sop_id: str) -> Dict[str, Any]:
    """获取SOP模板"""
    # 这里是示例实现，实际应该从SOP管理服务获取模板
    return {
        "id": sop_id,
        "name": "示例SOP",
        "steps": [
            {"order": 1, "description": "第一步: 分析任务需求"},
            {"order": 2, "description": "第二步: 制定执行计划"},
            {"order": 3, "description": "第三步: 执行任务"},
            {"order": 4, "description": "第四步: 验证结果"},
        ]
    }


# 定义Agent工具集
tools = [
    search_knowledge_base,
    get_task_details,
    update_task_status,
    get_sop_template
]

# 创建工具节点
tool_node = ToolNode(tools)

# 创建LLM模型
def get_llm():
    """获取LLM模型实例"""
    # 使用OpenAI包，但基础地址是硅基流动
    from langchain_openai import ChatOpenAI
    
    # 检查是否配置了SiliconFlow API密钥
    if os.getenv("SILICONFLOW_API_KEY"):
        return ChatOpenAI(
            api_key=os.getenv("SILICONFLOW_API_KEY"),
            base_url="https://api.siliconflow.cn/v1",
            model="black-forest-labs/FLUX.1-dev",  # 或其他可用模型
            temperature=0.2
        ).bind_tools(tools)
    # 优先使用Anthropic模型，如果没有则使用OpenAI
    elif os.getenv("ANTHROPIC_API_KEY"):
        from langchain_anthropic import ChatAnthropic
        return ChatAnthropic(
            model="claude-3-sonnet-20240229",
            temperature=0.2
        ).bind_tools(tools)
    else:
        # 默认使用OpenAI
        return ChatOpenAI(
            model="gpt-4-turbo",
            temperature=0.2
        ).bind_tools(tools)

# 定义Agent系统提示
SYSTEM_PROMPT = """你是李府管家系统中的智能任务执行Agent。你的职责是:
1. 分析和理解任务需求
2. 按照SOP标准流程执行任务
3. 使用可用工具获取信息和执行操作
4. 提供清晰的执行过程和结果

在执行任务时，请遵循以下原则:
- 先理解任务需求，再制定执行计划
- 按照SOP流程逐步执行
- 需要信息时主动使用工具获取
- 保持逻辑清晰，步骤明确
- 遇到问题时尝试自主解决，必要时请求人工协助

请记住，你的目标是高效、准确地完成任务，并提供有价值的结果。
"""

# 定义调用LLM的函数
def call_model(state: AgentState):
    """调用LLM模型处理当前状态"""
    messages = state.get('messages', [])
    
    # 如果是首次调用，添加系统提示
    if not any(isinstance(msg, SystemMessage) for msg in messages):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
    
    # 调用LLM
    model = get_llm()
    response = model.invoke(messages)
    
    # 返回更新后的消息列表
    return {"messages": messages + [response]}

# 定义路由函数
def should_continue(state: AgentState) -> Literal["tools", END]:
    """决定是继续执行工具还是结束"""
    messages = state.get('messages', [])
    if not messages:
        return END
        
    last_message = messages[-1]
    
    # 如果最后一条消息包含工具调用，则路由到工具节点
    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        return "tools"
    
    # 否则结束执行
    return END

# 创建Agent工作流图
def create_agent_workflow():
    """创建Agent工作流图"""
    # 创建状态图
    workflow = StateGraph(AgentState)
    
    # 添加节点
    workflow.add_node("agent", call_model)
    workflow.add_node("tools", tool_node)
    
    # 添加边
    workflow.add_edge(START, "agent")
    workflow.add_conditional_edges(
        "agent",
        should_continue,
    )
    workflow.add_edge("tools", "agent")
    
    # 初始化内存保存器
    memory = MemorySaver()
    
    # 编译工作流
    return workflow.compile(checkpointer=memory)

# 创建Agent实例
agent_workflow = create_agent_workflow()

# 执行Agent
def execute_task(task_id: str, task_description: str) -> Dict[str, Any]:
    """执行指定任务"""
    # 初始化状态
    initial_state = {
        "messages": [HumanMessage(content=f"请执行以下任务: {task_description}. 任务ID: {task_id}")],
        "task_id": task_id,
        "task_info": None,
        "tools_results": {},
        "memory": {},
        "status": "started"
    }
    
    # 执行工作流
    result = agent_workflow.invoke(initial_state)
    
    # 更新任务状态为已完成
    update_task_status(task_id, "completed")
    
    return result 