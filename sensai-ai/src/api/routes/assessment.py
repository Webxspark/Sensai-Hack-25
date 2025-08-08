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
import openai
import json
router = APIRouter()
oai_client = openai.OpenAI(
    api_key=settings.openai_api_key,
    base_url="https://agent.dev.hyperverge.org"
)


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
    if item.assessment_type == "elimination" and item.candidates < 1:
        raise HTTPException(
            status_code=400,
            detail="For elimination assessments, candidates must be at least 1."
        )
    try:
        # Generate questions with exact distribution
        # generated_questions = await generate_questions_for_assessment(
        #     skills=item.skills,
        #     role=item.role,
        #     assessment_type=item.assessment_type,
        #     difficulty=item.difficulty
        # )
        prompt = f"""You are instructed to generate {f"1/3rd or 1/4th of {item.candidates}" if item.assessment_type == "elimination" else "a"} set{"s" if item.assessment_type == "elimination" else ""} of questions for an assessment.
        The assessment is for the role of {item.role} with the following skills: {item.skills}.
        The difficulty level is {item.difficulty}.
        Role-specific aptitude questions should be included.
        
        Generate exactly:
        - *15* MCQs (multiple-choice questions)
        - 5 SAQs (short answer questions)
        - 1 Case Study question
        - A set of 6-8 aptitude questions relevant to the role
        Ensure that the questions are relevant to the skills and role specified.
        
        Return as a JSON array where each question follows this format based on type:
        MCQ: {{
             "type": "mcq",
              "skill": "relevant_skill",
              "difficulty": "{item.difficulty}",
              "question": "Question text",
              "options": ["A", "B", "C", "D"],
              "correct_answer": "A",
              "explanation": "Why this is correct"
        }}[]
        SAQ format:
        {{
          "type": "saq",
          "skill": "relevant_skill", 
          "difficulty": "{item.difficulty}",
          "question": "Question text",
          "sample_answer": "Expected response",
          "max_words": 100,
          "evaluation_criteria": ["Criterion 1", "Criterion 2"]
        }}[]
        
        Case format:
        {{
          "type": "case",
          "skill": "combined_skills",
          "difficulty": "{item.difficulty}",
          "scenario": "Real-world scenario",
          "question": "What would you do?",
          "sample_solution": "Approach",
          "evaluation_criteria": ["Analysis", "Solution", "Implementation"],
          "time_limit": 15 # in minutes
        }}[]
        
        Aptitude format:
        {{
          "type": "aptitude",
          "skill": "aptitude",
          "difficulty": "{item.difficulty}",
          "question": "Question text",
          "question_type": "logical/numerical/analytical",
          "options": ["A", "B", "C", "D"],
          "correct_answer": "A",
          "explanation": "Solution steps"
        }}[]
        
        Example:
        [
            "mcq": [{{...}}]
            "saq": [{{...}}],
            "case": [{{...}}],
            "aptitude": [{{...}}]
        ]{'[]' if item.assessment_type == 'elimination' else ''}
Make questions practical, job-relevant, and vary the skills across questions."""

        response = oai_client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert in generating assessment questions."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        generated_questions = response.choices[0].message.content
        assessment_id = await create_assessment(
            org_id=item.org_id,
            role=item.role,
            skills=item.skills,
            assessment_type=item.assessment_type,
            difficulty=item.difficulty,
            candidates=item.candidates,
            questions=json.dumps(generated_questions)  # Store as JSON string
        )
        return {
            "assessment_id": assessment_id
        }
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
