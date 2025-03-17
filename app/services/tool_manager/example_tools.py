"""
示例工具定义，用于测试MCP接口
"""
from typing import Dict, Any, List

# 天气查询工具
WEATHER_TOOL = {
    "name": "weather_query",
    "type": "api",
    "endpoint": "https://api.example.com/weather",
    "description": "查询指定城市的天气信息",
    "auth_type": "apiKey",
    "auth_info": {
        "type": "apikey",
        "header": "X-API-Key",
        "key": "demo-api-key"
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "city": {
                "type": "string",
                "description": "城市名称，如'北京'、'上海'"
            },
            "date": {
                "type": "string",
                "description": "查询日期，格式为YYYY-MM-DD，默认为当天",
                "format": "date"
            }
        },
        "required": ["city"]
    },
    "capabilities": ["天气查询", "城市信息"]
}

# 文档摘要工具
DOCUMENT_SUMMARY_TOOL = {
    "name": "document_summary",
    "type": "api",
    "endpoint": "https://api.example.com/summarize",
    "description": "对文档内容进行摘要生成",
    "auth_type": "bearer",
    "auth_info": {
        "type": "bearer",
        "token": "demo-token"
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "text": {
                "type": "string",
                "description": "需要摘要的文本内容"
            },
            "max_length": {
                "type": "integer",
                "description": "摘要最大长度，默认200字",
                "default": 200
            }
        },
        "required": ["text"]
    },
    "capabilities": ["文本摘要", "内容提取"]
}

# 数据库查询工具
DATABASE_QUERY_TOOL = {
    "name": "database_query",
    "type": "script",
    "endpoint": "db_query.py",
    "description": "执行SQL查询并返回结果",
    "auth_type": "None",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "SQL查询语句"
            },
            "database": {
                "type": "string",
                "description": "数据库名称",
                "enum": ["customers", "products", "orders"]
            }
        },
        "required": ["query", "database"]
    },
    "capabilities": ["数据查询", "报表生成"]
}

# 所有示例工具列表
EXAMPLE_TOOLS = [
    WEATHER_TOOL,
    DOCUMENT_SUMMARY_TOOL,
    DATABASE_QUERY_TOOL
]

def get_example_tools() -> List[Dict[str, Any]]:
    """
    获取示例工具列表
    """
    return EXAMPLE_TOOLS

def mock_weather_api(city: str, date: str = None) -> Dict[str, Any]:
    """
    模拟天气API响应
    """
    weather_data = {
        "北京": {"temperature": 25, "condition": "晴", "humidity": 40},
        "上海": {"temperature": 28, "condition": "多云", "humidity": 65},
        "广州": {"temperature": 32, "condition": "雨", "humidity": 80},
        "深圳": {"temperature": 30, "condition": "多云", "humidity": 75}
    }
    
    if city not in weather_data:
        return {
            "error": f"未找到城市 '{city}' 的天气信息"
        }
    
    result = {
        "city": city,
        "date": date or "今天",
        "weather": weather_data[city]
    }
    
    return result

def mock_document_summary(text: str, max_length: int = 200) -> Dict[str, Any]:
    """
    模拟文档摘要API响应
    """
    if not text:
        return {"error": "文本内容不能为空"}
    
    # 简单实现：截取前N个字符作为摘要
    summary = text[:max_length] + ("..." if len(text) > max_length else "")
    
    return {
        "original_length": len(text),
        "summary_length": len(summary),
        "summary": summary
    }

def mock_database_query(query: str, database: str) -> Dict[str, Any]:
    """
    模拟数据库查询响应
    """
    # 模拟数据
    mock_data = {
        "customers": [
            {"id": 1, "name": "张三", "phone": "13800138000"},
            {"id": 2, "name": "李四", "phone": "13900139000"}
        ],
        "products": [
            {"id": 101, "name": "笔记本电脑", "price": 5999},
            {"id": 102, "name": "智能手机", "price": 3999}
        ],
        "orders": [
            {"id": 1001, "customer_id": 1, "product_id": 101, "quantity": 1},
            {"id": 1002, "customer_id": 2, "product_id": 102, "quantity": 2}
        ]
    }
    
    if database not in mock_data:
        return {"error": f"数据库 '{database}' 不存在"}
    
    # 简单模拟：返回该数据库的所有数据
    # 实际应用中应该解析SQL并执行
    return {
        "query": query,
        "database": database,
        "results": mock_data[database],
        "count": len(mock_data[database])
    } 