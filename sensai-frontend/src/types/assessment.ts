import {TAssessmentFor, TDifficultyLevel} from "@/components/AssessmentCreateSheet";

export interface IAssessmentMCQ {
    type: string;
    skill: string;
    difficulty: TDifficultyLevel;
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

export interface IAssessmentSAQ {
    type: string;
    skill: string;
    difficulty: TDifficultyLevel;
    question: string;
    sample_answer: string;
    max_words: number;
    evaluation_criteria: string[];
}

export interface IAssessmentCase {
    type: string;
    skill: string;
    difficulty: TDifficultyLevel;
    scenario: string;
    question: string;
    sample_solution: string;
    evaluation_criteria: string[];
    time_limit: number; // in minutes
}

export interface IAssessmentAptitude {
    type: string;
    skill: string;
    difficulty: TDifficultyLevel;
    question: string;
    question_type: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

export interface IAssessmentQuestion {
    mcq: IAssessmentMCQ[];
    saq: IAssessmentSAQ[];
    case: IAssessmentCase[];
    aptitude: IAssessmentAptitude[];
}

export interface IAssessment {
    id: number;
    org_id: number;
    role: string;
    skills: string;
    type: TAssessmentFor;
    difficulty: TDifficultyLevel;
    candidates: number;
    questions: IAssessmentQuestion[];
    created_at: string;
}

export interface IOrgAssessments {
    assessments: {
        id: number;
        org_id: number;
        role: string;
        skills: string;
        type: TAssessmentFor;
        difficulty: TDifficultyLevel;
        candidates: number;
        created_at: string;
    }[];
}