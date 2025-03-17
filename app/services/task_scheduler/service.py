"""
任务调度器服务接口
提供任务执行、监控和管理功能
"""

from typing import Dict, List, Any, Optional
import logging
from datetime import datetime
import os

from .agent import execute_task
from .reflection_agent import execute_task_with_reflection

# 配置日志
logger = logging.getLogger(__name__)

class TaskSchedulerService:
    """任务调度器服务"""
    
    @staticmethod
    async def execute_task(task_id: str, task_description: str, use_reflection: bool = False, use_siliconflow: bool = False) -> Dict[str, Any]:
        """
        执行指定任务
        
        Args:
            task_id: 任务ID
            task_description: 任务描述
            use_reflection: 是否使用支持反思的Agent
            use_siliconflow: 是否使用硅基流动模型
            
        Returns:
            执行结果
        """
        logger.info(f"开始执行任务: {task_id}, 使用反思Agent: {use_reflection}, 使用硅基流动模型: {use_siliconflow}")
        try:
            # 记录任务开始时间
            start_time = datetime.now()
            
            # 根据参数选择Agent执行任务
            if use_siliconflow:
                # 设置环境变量
                os.environ["SILICONFLOW_API_KEY"] = os.getenv("SILICONFLOW_API_KEY", "")
                result = execute_task(task_id, task_description)
                agent_type = "siliconflow"
            elif use_reflection:
                result = execute_task_with_reflection(task_id, task_description)
                agent_type = "reflection"
            else:
                result = execute_task(task_id, task_description)
                agent_type = "standard"
            
            # 记录任务结束时间
            end_time = datetime.now()
            execution_time = (end_time - start_time).total_seconds()
            
            # 构建响应
            response = {
                "task_id": task_id,
                "status": "completed",
                "execution_time": execution_time,
                "result": result,
                "timestamp": datetime.now().isoformat(),
                "agent_type": agent_type
            }
            
            logger.info(f"任务执行完成: {task_id}, 耗时: {execution_time}秒")
            return response
            
        except Exception as e:
            logger.error(f"任务执行失败: {task_id}, 错误: {str(e)}")
            # 返回错误信息
            return {
                "task_id": task_id,
                "status": "failed",
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "agent_type": "siliconflow" if use_siliconflow else ("reflection" if use_reflection else "standard")
            }
    
    @staticmethod
    async def get_task_status(task_id: str) -> Dict[str, Any]:
        """
        获取任务状态
        
        Args:
            task_id: 任务ID
            
        Returns:
            任务状态信息
        """
        # 这里应该从数据库或缓存中获取任务状态
        # 当前为示例实现
        return {
            "task_id": task_id,
            "status": "in_progress",
            "progress": 50,
            "timestamp": datetime.now().isoformat()
        }
    
    @staticmethod
    async def list_tasks(status: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """
        获取任务列表
        
        Args:
            status: 可选的状态过滤
            limit: 返回结果数量限制
            
        Returns:
            任务列表
        """
        # 这里应该从数据库中查询任务列表
        # 当前为示例实现
        return [
            {
                "task_id": f"task_{i}",
                "title": f"示例任务 {i}",
                "status": "completed" if i % 3 == 0 else "in_progress" if i % 3 == 1 else "pending",
                "created_at": datetime.now().isoformat()
            }
            for i in range(limit)
        ]
    
    @staticmethod
    async def cancel_task(task_id: str) -> Dict[str, Any]:
        """
        取消任务
        
        Args:
            task_id: 任务ID
            
        Returns:
            操作结果
        """
        # 这里应该实现任务取消逻辑
        # 当前为示例实现
        return {
            "task_id": task_id,
            "status": "cancelled",
            "timestamp": datetime.now().isoformat()
        }
        
    @staticmethod
    async def compare_agents(task_id: str, task_description: str, use_siliconflow: bool = False) -> Dict[str, Any]:
        """
        比较不同Agent的执行效果
        
        Args:
            task_id: 任务ID
            task_description: 任务描述
            use_siliconflow: 是否包含硅基流动模型
            
        Returns:
            比较结果
        """
        logger.info(f"开始比较不同Agent执行任务: {task_id}, 包含硅基流动模型: {use_siliconflow}")
        try:
            # 记录开始时间
            start_time = datetime.now()
            
            # 使用标准Agent执行任务
            standard_result = await TaskSchedulerService.execute_task(
                f"{task_id}_standard", 
                task_description,
                use_reflection=False,
                use_siliconflow=False
            )
            
            # 使用反思Agent执行任务
            reflection_result = await TaskSchedulerService.execute_task(
                f"{task_id}_reflection", 
                task_description,
                use_reflection=True,
                use_siliconflow=False
            )
            
            # 如果需要，使用硅基流动模型执行任务
            siliconflow_result = None
            if use_siliconflow:
                siliconflow_result = await TaskSchedulerService.execute_task(
                    f"{task_id}_siliconflow", 
                    task_description,
                    use_reflection=False,
                    use_siliconflow=True
                )
            
            # 记录结束时间
            end_time = datetime.now()
            total_time = (end_time - start_time).total_seconds()
            
            # 构建比较结果
            comparison = {
                "task_id": task_id,
                "task_description": task_description,
                "standard_agent": standard_result,
                "reflection_agent": reflection_result,
                "siliconflow_agent": siliconflow_result,
                "total_time": total_time,
                "timestamp": datetime.now().isoformat(),
                "includes_siliconflow": use_siliconflow
            }
            
            logger.info(f"Agent比较完成: {task_id}, 总耗时: {total_time}秒")
            return comparison
            
        except Exception as e:
            logger.error(f"Agent比较失败: {task_id}, 错误: {str(e)}")
            return {
                "task_id": task_id,
                "status": "failed",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            } 