from typing import List, Dict, Tuple, Literal
import json

from api.utils.db import (
    get_new_db_connection,
    execute_db_operation,
    execute_multiple_db_operations,
)

from api.config import (
    assessments_table_name,
)

async def get_assessments_by_org_id(org_id: int) -> List[Dict]:
    async with get_new_db_connection() as conn:
        cursor = await conn.cursor()

        await cursor.execute(
            f"SELECT id, assessment_role, assessment_skills, assessment_type, assessment_difficulty, assessment_candidates, assessment_questions, created_at FROM {assessments_table_name} WHERE org_id = ?",
            (org_id,)
        )

        return [
            {
                "id":  row[0],
                "role": row[1],
                "skills": row[2],
                "type": row[3],
                "difficulty": row[4],
                "candidates": row[5],
                # "questions": row[6],
                "created_at": row[7],
            }
            for row in await cursor.fetchall()
        ]

async def create_assessment(
    org_id: int,
    role: str,
    skills: str,
    assessment_type: Literal["education", "elimination"],
    difficulty: Literal["easy", "medium", "hard"],
    candidates: int,
    questions: str
) -> int:
    async with get_new_db_connection() as conn:
        cursor = await conn.cursor()

        await cursor.execute(
            f"""
            INSERT INTO {assessments_table_name} (org_id, assessment_role, assessment_skills, assessment_type, assessment_difficulty, assessment_candidates, assessment_questions)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (org_id, role, skills, assessment_type, difficulty, candidates, questions)
        )

        await conn.commit()
        return cursor.lastrowid

async def delete_assessment(assessment_id: int) -> None:
    async with get_new_db_connection() as conn:
        cursor = await conn.cursor()

        await cursor.execute(
            f"DELETE FROM {assessments_table_name} WHERE id = ?",
            (assessment_id,)
        )

        await conn.commit()

        if cursor.rowcount == 0:
            raise ValueError("Assessment not found")  # Raise an error if no rows were deleted
async def update_assessment(
    assessment_id: int,
    role: str,
    skills: str,
    assessment_type: Literal["education", "elimination"],
    difficulty: Literal["easy", "medium", "hard"],
    candidates: int,
    questions: str
) -> None:
    async with get_new_db_connection() as conn:
        cursor = await conn.cursor()

        await cursor.execute(
            f"""
            UPDATE {assessments_table_name}
            SET assessment_role = ?, assessment_skills = ?, assessment_type = ?, assessment_difficulty = ?, assessment_candidates = ?, assessment_questions = ?
            WHERE id = ?
            """,
            (role, skills, assessment_type, difficulty, candidates, questions, assessment_id)
        )

        await conn.commit()

        if cursor.rowcount == 0:
            raise ValueError("Assessment not found")  # Raise an error if no rows were updated
async def get_assessment_by_id(assessment_id: int) -> Dict:
    async with get_new_db_connection() as conn:
        cursor = await conn.cursor()

        await cursor.execute(
            f"SELECT id, org_id, assessment_role, assessment_skills, assessment_type, assessment_difficulty, assessment_candidates, assessment_questions, created_at FROM {assessments_table_name} WHERE id = ?",
            (assessment_id,)
        )
        row = await cursor.fetchone()
        if not row:
            raise ValueError("Assessment not found")
        questions_json = row[7]
        try:
            questions = json.loads(questions_json)
            # If questions is a string (nested JSON), parse it again
            if isinstance(questions, str):
                questions = json.loads(questions)
        except (json.JSONDecodeError, TypeError):
            questions = questions_json  # Fallback to raw data

        return {
            "id": row[0],
            "org_id": row[1],
            "role": row[2],
            "skills": row[3],
            "type": row[4],
            "difficulty": row[5],
            "candidates": row[6],
            "questions": questions,
            "created_at": row[8],
        }