"""
支持反思和自我修正的高级Agent
基于LangGraph实现
"""

import os
from typing import Annotated, Literal, TypedDict, List, Dict, Any, Optional, Tuple, Union
from enum import Enum

from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, FunctionMessage
from langchain_core.tools import tool, BaseTool
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.prebuilt import ToolNode

# 定义Agent状态
class ReflectionAgentState(TypedDict):
    """反思Agent的状态定义"""
    messages: List[Any]  # 消息历史
    task_id: Optional[str]  # 当前任务ID
    task_info: Optional[Dict[str, Any]]  # 任务相关信息
    tools_results: Optional[Dict[str, Any]]  # 工具调用结果
    memory: Optional[Dict[str, Any]]  # 记忆/上下文
    status: Optional[str]  # 任务状态
    reflections: Optional[List[Dict[str, Any]]]  # 反思记录
    attempts: Optional[int]  # 尝试次数
    plan: Optional[List[Dict[str, Any]]]  # 执行计划


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

@tool
def save_to_knowledge_base(key: str, content: str) -> str:
    """将信息保存到知识库"""
    # 这里是示例实现，实际应该保存到知识库服务
    return f"信息已保存到知识库，键名: {key}"


# 定义Agent工具集
tools = [
    search_knowledge_base,
    get_task_details,
    update_task_status,
    get_sop_template,
    save_to_knowledge_base
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
SYSTEM_PROMPT = """你是李府管家系统中的智能任务执行Agent，具有反思和自我修正能力。你的职责是:
1. 分析和理解任务需求
2. 制定详细的执行计划
3. 按照SOP标准流程执行任务
4. 使用可用工具获取信息和执行操作
5. 在执行过程中进行反思和自我修正
6. 提供清晰的执行过程和结果

在执行任务时，请遵循以下原则:
- 先理解任务需求，再制定执行计划
- 按照SOP流程逐步执行
- 需要信息时主动使用工具获取
- 保持逻辑清晰，步骤明确
- 定期反思执行过程，识别问题并修正
- 遇到问题时尝试自主解决，必要时请求人工协助
- 将有价值的经验保存到知识库

请记住，你的目标是高效、准确地完成任务，并通过反思不断提升自己的能力。
"""

# 定义反思提示
REFLECTION_PROMPT = """请对你刚才的执行过程进行反思，考虑以下几个方面:
1. 我的理解是否准确？
2. 我的计划是否合理？
3. 我的执行是否有效？
4. 我是否遗漏了重要信息？
5. 我是否犯了错误？如果是，错在哪里？
6. 我如何改进？

请提供具体的反思内容，并给出改进建议。
"""

# 定义计划提示
PLANNING_PROMPT = """请根据任务需求，制定详细的执行计划。计划应包括:
1. 任务目标
2. 执行步骤
3. 需要使用的工具
4. 可能遇到的问题及解决方案
5. 成功标准

请确保计划清晰、具体、可执行。
"""

# 定义调用LLM的函数
def call_model(state: ReflectionAgentState):
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

# 定义制定计划的函数
def create_plan(state: ReflectionAgentState):
    """制定执行计划"""
    messages = state.get('messages', [])
    task_id = state.get('task_id')
    
    # 获取任务详情
    task_info = get_task_details(task_id)
    
    # 创建计划提示
    plan_prompt = f"""
{PLANNING_PROMPT}

任务信息:
ID: {task_id}
标题: {task_info.get('title')}
描述: {task_info.get('description')}
优先级: {task_info.get('priority')}
截止日期: {task_info.get('deadline')}
    """
    
    # 添加计划提示消息
    plan_messages = messages + [HumanMessage(content=plan_prompt)]
    
    # 调用LLM生成计划
    model = get_llm()
    plan_response = model.invoke(plan_messages)
    
    # 解析计划
    plan = [
        {"step": i+1, "description": f"步骤{i+1}: {step}", "status": "pending"}
        for i, step in enumerate(plan_response.content.split("\n"))
        if step.strip() and not step.startswith("任务目标") and not step.startswith("执行步骤")
    ]
    
    # 更新状态
    return {
        "messages": messages + [HumanMessage(content=plan_prompt), plan_response],
        "plan": plan,
        "task_info": task_info
    }

# 定义反思函数
def reflect(state: ReflectionAgentState):
    """对执行过程进行反思"""
    messages = state.get('messages', [])
    reflections = state.get('reflections', [])
    attempts = state.get('attempts', 0)
    
    # 创建反思提示
    reflection_messages = messages + [HumanMessage(content=REFLECTION_PROMPT)]
    
    # 调用LLM进行反思
    model = get_llm()
    reflection_response = model.invoke(reflection_messages)
    
    # 记录反思
    reflection = {
        "attempt": attempts + 1,
        "content": reflection_response.content,
        "timestamp": "2023-01-01T00:00:00"  # 实际应使用当前时间
    }
    
    # 更新状态
    return {
        "messages": messages + [HumanMessage(content=REFLECTION_PROMPT), reflection_response],
        "reflections": reflections + [reflection],
        "attempts": attempts + 1
    }

# 定义路由函数
def route_next_step(state: ReflectionAgentState) -> Literal["agent", "tools", "plan", "reflect", END]:
    """决定下一步执行什么操作"""
    messages = state.get('messages', [])
    plan = state.get('plan')
    attempts = state.get('attempts', 0)
    
    # 如果没有消息，结束执行
    if not messages:
        return END
    
    # 获取最后一条消息
    last_message = messages[-1]
    
    # 如果没有计划，先制定计划
    if not plan:
        return "plan"
    
    # 如果最后一条消息包含工具调用，则路由到工具节点
    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        return "tools"
    
    # 每执行3轮后进行反思
    if attempts > 0 and attempts % 3 == 0 and not any(isinstance(msg, HumanMessage) and REFLECTION_PROMPT in msg.content for msg in messages[-2:]):
        return "reflect"
    
    # 默认继续执行agent
    return "agent"

# 定义完成检查函数
def is_task_complete(state: ReflectionAgentState) -> Literal["agent", END]:
    """检查任务是否完成"""
    messages = state.get('messages', [])
    
    # 如果没有消息，结束执行
    if not messages:
        return END
    
    # 获取最后几条消息的内容
    last_contents = [msg.content for msg in messages[-3:] if hasattr(msg, 'content')]
    
    # 检查是否有完成标志
    completion_indicators = [
        "任务已完成",
        "已完成所有步骤",
        "执行完毕",
        "任务执行成功"
    ]
    
    for content in last_contents:
        for indicator in completion_indicators:
            if indicator in content:
                return END
    
    # 如果尝试次数过多，也结束执行
    if state.get('attempts', 0) > 10:
        return END
    
    # 否则继续执行
    return "agent"

# 创建Agent工作流图
def create_reflection_agent_workflow():
    """创建支持反思的Agent工作流图"""
    # 创建状态图
    workflow = StateGraph(ReflectionAgentState)
    
    # 添加节点
    workflow.add_node("agent", call_model)
    workflow.add_node("tools", tool_node)
    workflow.add_node("plan", create_plan)
    workflow.add_node("reflect", reflect)
    
    # 添加边
    workflow.add_edge(START, "plan")
    workflow.add_edge("plan", "agent")
    
    # 添加条件边
    workflow.add_conditional_edges(
        "agent",
        route_next_step,
        {
            "agent": "agent",
            "tools": "tools",
            "plan": "plan",
            "reflect": "reflect",
            END: END
        }
    )
    
    workflow.add_edge("tools", "agent")
    workflow.add_edge("reflect", "agent")
    
    # 添加完成检查
    workflow.add_conditional_edges(
        "reflect",
        is_task_complete,
        {
            "agent": "agent",
            END: END
        }
    )
    
    # 初始化内存保存器
    memory = MemorySaver()
    
    # 编译工作流
    return workflow.compile(checkpointer=memory)

# 创建Agent实例
reflection_agent_workflow = create_reflection_agent_workflow()

# 执行Agent
def execute_task_with_reflection(task_id: str, task_description: str) -> Dict[str, Any]:
    """使用支持反思的Agent执行任务"""
    # 初始化状态
    initial_state = {
        "messages": [HumanMessage(content=f"请执行以下任务: {task_description}. 任务ID: {task_id}")],
        "task_id": task_id,
        "task_info": None,
        "tools_results": {},
        "memory": {},
        "status": "started",
        "reflections": [],
        "attempts": 0,
        "plan": None
    }
    
    # 执行工作流
    result = reflection_agent_workflow.invoke(initial_state)
    
    # 更新任务状态为已完成
    update_task_status(task_id, "completed")
    
    # 提取执行结果
    messages = result.get('messages', [])
    reflections = result.get('reflections', [])
    
    # 构建响应
    response = {
        "task_id": task_id,
        "status": "completed",
        "messages": [
            {
                "role": "system" if isinstance(msg, SystemMessage) else "user" if isinstance(msg, HumanMessage) else "assistant" if isinstance(msg, AIMessage) else "function",
                "content": msg.content if hasattr(msg, 'content') else str(msg)
            }
            for msg in messages
        ],
        "reflections": reflections,
        "plan": result.get('plan'),
        "attempts": result.get('attempts', 0)
    }
    
    return response 