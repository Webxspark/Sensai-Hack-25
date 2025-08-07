from typing import Dict
from fastapi import APIRouter, HTTPException
from api.settings import settings
from api.db.assessment import (
    get_assessments_by_org_id,
    create_assessment,
    delete_assessment,
    update_assessment,
    get_assessment_by_id
)
from api.models import (
    CreateAssessmentRequest,
    UpdateAssessmentRequest,
    GetOrgAssessmentRequest,
    DeleteAssessmentRequest,
    GetAssessmentByIDRequest
)
from numpy.ma.core import default_filler

router = APIRouter()

@router.get("/orgs/{org_id}")
async def get_all_assessments_from_an_organization(
    org_id: int,
) -> Dict:
    try:
        assessments = await get_assessments_by_org_id(org_id)
        return {"assessments": assessments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create")
async def create_a_new_assessment(item: CreateAssessmentRequest) -> Dict:
    try:
        assessment_id = await create_assessment(
            org_id=item.org_id,
            role=item.role,
            skills=item.skills,
            assessment_type=item.assessment_type,
            difficulty=item.difficulty,
            candidates=item.candidates,
            questions=item.questions
        )
        return {"assessment_id": assessment_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{assessment_id}")
async def delete_an_assessment(assessment_id: int) -> Dict:
    try:
        await delete_assessment(assessment_id)
        return {"message": "Assessment deleted successfully"}
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{assessment_id}")
async def update_an_assessment(
    assessment_id: int, item: UpdateAssessmentRequest
) -> Dict:
    try:
        await update_assessment(
            assessment_id=assessment_id,
            role=item.role,
            skills=item.skills,
            assessment_type=item.assessment_type,
            difficulty=item.difficulty,
            candidates=item.candidates,
            questions=item.questions
        )
        return {"message": "Assessment updated successfully"}
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{assessment_id}")
async def get_assessment_info_with_id(
    assessment_id: int
) -> Dict:
    try:
        assessment = await get_assessment_by_id(assessment_id)
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        return {"assessment": assessment}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))