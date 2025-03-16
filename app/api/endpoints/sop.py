from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.auth import get_current_user
from app.services.sop_manager import create_sop_template, get_sop_templates, get_sop_template, start_sop_run, get_sop_run, cancel_sop_run
from app.schemas.sop import SOPTemplateCreate, SOPTemplateResponse, SOPRunCreate, SOPRunResponse

router = APIRouter()

@router.post("/templates", response_model=SOPTemplateResponse)
def create_template(
    template_in: SOPTemplateCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> Any:
    """
    创建SOP模板
    """
    template = create_sop_template(db=db, template_in=template_in, user_id=current_user.id)
    return template

@router.get("/templates", response_model=List[SOPTemplateResponse])
def read_templates(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    获取SOP模板列表
    """
    templates = get_sop_templates(db=db, skip=skip, limit=limit)
    return templates

@router.get("/templates/{template_id}", response_model=SOPTemplateResponse)
def read_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> Any:
    """
    获取SOP模板详情
    """
    template = get_sop_template(db=db, template_id=template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOP模板不存在"
        )
    return template

@router.post("/runs", response_model=SOPRunResponse)
def start_run(
    run_in: SOPRunCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> Any:
    """
    启动SOP流程
    """
    # 检查模板是否存在
    template = get_sop_template(db=db, template_id=run_in.template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOP模板不存在"
        )
    
    run = start_sop_run(db=db, run_in=run_in, user_id=current_user.id)
    return run

@router.get("/runs/{run_id}", response_model=SOPRunResponse)
def read_run(
    run_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> Any:
    """
    获取SOP流程执行状态
    """
    run = get_sop_run(db=db, run_id=run_id)
    if not run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOP流程不存在"
        )
    return run

@router.post("/runs/{run_id}/cancel", response_model=dict)
def cancel_run(
    run_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> Any:
    """
    取消SOP流程
    """
    run = get_sop_run(db=db, run_id=run_id)
    if not run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOP流程不存在"
        )
    
    result = cancel_sop_run(db=db, run_id=run_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SOP流程无法取消，可能已完成或已取消"
        )
    return {"run_id": run_id, "status": "canceled", "message": "SOP流程已取消"} 