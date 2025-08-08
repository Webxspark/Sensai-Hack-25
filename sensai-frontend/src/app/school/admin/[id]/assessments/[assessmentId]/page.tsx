"use client";
import React from 'react';
import {useParams} from "next/navigation";
import {Header} from "@/components/layout/header";
import {BookOpen, ChartSpline, ExternalLink, LaptopMinimalCheck, Layers, ListChecks, Users} from "lucide-react";
import {IAssessment} from "@/types/assessment";
import dayjs from "dayjs";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {
    Table,
    TableBody, TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Radio} from "antd";
import {MOCK_ASSESSMENT_ATTEMPTS} from "@/mocks/assessment-attempts";

type TTabs = "overview" | "attempts";
type TQuestionTabs = "mcq" | "saq" | "case" | "aptitude"
const ViewAssessment = () => {
    const params = useParams();
    const assessmentId = params.assessmentId;
    const [loading, setLoading] = React.useState(false);
    const isMounted = React.useRef(false)
    const [assessment, setAssessment] = React.useState<IAssessment | null>(null);
    const [activeTab, setActiveTab] = React.useState<TTabs>("overview");
    const [activeQuestionTab, setActiveQuestionTab] = React.useState<TQuestionTabs>("mcq");
    const pageMiddleware = React.useCallback(() => {
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/assessments/${assessmentId}`)
            .then(r => r.json())
            .then(res => {
                setAssessment(res.assessment as IAssessment)
            }).catch((err) => {
            console.error("Something went wrong while fetching Assessment Info:: ", err)
        }).finally(() => {
            setLoading(false)
        })
    }, [assessmentId])
    React.useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true
            pageMiddleware()
        }
    }, [pageMiddleware])

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Header showCreateCourseButton={false}/>
                <div className="flex justify-center items-center py-12">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p>Something went wrong (or) Assessment not found</p>
            </div>
        );
    }

    function abcdTo0123(correct_answer: string): number {
        const upperCaseAnswer = correct_answer.toUpperCase();

        switch (upperCaseAnswer) {
            case 'A':
                return 0;
            case 'B':
                return 1;
            case 'C':
                return 2;
            case 'D':
                return 3;
            default:
                return -1;
        }
    }

    return (
        <div>
            <Header showCreateCourseButton={false}/>

            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-8">
                    <main>

                        {/* Assessment header with title */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div
                                        className="w-12 h-12 bg-purple-700 rounded-lg flex items-center justify-center mr-4">
                                        <LaptopMinimalCheck size={24} className="text-white"/>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-x-3">
                                            <h1
                                                className={`text-3xl font-light outline-none`}
                                            >
                                                {assessment.role} ({dayjs(assessment.created_at).format("DD/MMM/YYYY")})
                                            </h1>
                                            <div
                                                className={'p-1 rounded-full border-1 border-gray-500 px-3 flex items-center gap-2'}>
                                                {assessment.difficulty === 'easy' &&
                                                    <span className="text-green-500 text-sm">Easy</span>}
                                                {assessment.difficulty === 'medium' &&
                                                    <span className="text-yellow-500 text-sm">Medium</span>}
                                                {assessment.difficulty === 'hard' &&
                                                    <span className="text-red-500 text-sm">Hard</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <p className="text-gray-400 text-sm">{assessment.skills}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs for navigation */}
                        <div className="mb-8">
                            <div className="flex border-b border-gray-800">
                                <button
                                    className={`px-4 py-2 font-light cursor-pointer ${activeTab === 'overview' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
                                    onClick={() => setActiveTab('overview')}
                                >
                                    <div className="flex items-center">
                                        <BookOpen size={16} className="mr-2"/>
                                        Overview
                                    </div>
                                </button>
                                <button
                                    className={`px-4 py-2 font-light cursor-pointer ${activeTab === 'attempts' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
                                    onClick={() => setActiveTab('attempts')}
                                >
                                    <div className="flex items-center">
                                        <ListChecks size={16} className="mr-2"/>
                                        Attempts
                                    </div>
                                </button>
                            </div>
                        </div>

                        {
                            activeTab === "overview" && <div className={'w-full md:w-[80%]'}>
                                <div className={'grid grid-cols-12 gap-12'}>
                                    <div className="grid col-span-4">
                                        <div className={'w-full flex flex-col space-y-2 items-end'}>
                                            {
                                                Object.keys(assessment.questions).map((key, index) => (
                                                    <Button
                                                        key={index}
                                                        onClick={() => setActiveQuestionTab(key as TQuestionTabs)}
                                                        className={cn('cursor-pointer uppercase w-[50%]', (activeQuestionTab === key) && "bg-white text-black text-sm font-medium hover:opacity-90 transition-opacity inline-block cursor-pointer")}
                                                    >
                                                        {key}
                                                    </Button>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="grid col-span-8">
                                        {(activeQuestionTab === "mcq" || activeQuestionTab === "aptitude") && <>
                                                {assessment.questions[activeQuestionTab].map((question, index) => (
                                                    <div key={index}
                                                         className={'flex flex-col gap-3 py-6 px-4 hover:bg-gray-900 rounded-lg duration-200'}>
                                                        <h1 className={'text-lg'}>{index + 1}) {question.question} ({question.skill})</h1>
                                                        <div className={'grid gap-2'}>
                                                            {question.options.map((opt, idx) => <Radio className={'!text-white'}
                                                                                                       checked={abcdTo0123(question.correct_answer) === idx}
                                                                                                       key={idx}>{opt}</Radio>)}
                                                        </div>
                                                        <span className={'text-gray-400'}>
                                                        <b>Explanation: </b> {question.explanation}
                                                    </span>
                                                    </div>
                                                ))}
                                            </>
                                            || activeQuestionTab === "saq" && <>
                                                {assessment.questions[activeQuestionTab].map((question, index) => (
                                                    <div
                                                        key={index}
                                                        className={'flex flex-col gap-3 py-6 px-4 hover:bg-gray-900 rounded-lg duration-200'}
                                                    >
                                                        <h1 className={'text-lg'}>{index + 1}) {question.question} ({question.skill})</h1>
                                                        <p className={'text-gray-400'}>
                                                            <b>Sample answer:</b> {question.sample_answer} <br/>
                                                            <span className={'text-white'}><b>Evaluation
                                                                Criteria:</b> {question.evaluation_criteria}</span>
                                                        </p>
                                                    </div>
                                                ))}
                                            </>
                                            || activeQuestionTab === "case" && <>
                                                {assessment.questions[activeQuestionTab].map((question, index) => (
                                                    <div
                                                        key={index}
                                                        className={'flex flex-col gap-3 py-6 px-4 hover:bg-gray-900 rounded-lg duration-200'}
                                                    >
                                                        <h1 className={'text-lg'}>{index + 1}) {question.scenario} ({question.skill})</h1>
                                                        <p>
                                                            <b>Question:</b> {question.question} <br/>
                                                            <b>Sample answer:</b> {question.sample_solution} <br/>
                                                            <span className={'text-gray-400'}><b>Evaluation
                                                                Criteria:</b> {question.evaluation_criteria}</span>
                                                        </p>
                                                    </div>
                                                ))}
                                            </>

                                        }
                                    </div>
                                </div>
                            </div>
                            || activeTab === "attempts" && <>
                                <Table>
                                            <TableCaption>NOTE: THIS IS A MOCK DATA</TableCaption>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>S.No</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Score</TableHead>
                                                    <TableHead>Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {MOCK_ASSESSMENT_ATTEMPTS.map((item, index) => <TableRow key={index}>
                                                    <TableCell className="font-medium">{index+1})</TableCell>
                                                    <TableCell>{item.Name}</TableCell>
                                                    <TableCell>{item.Email}</TableCell>
                                                    <TableCell>{item.Score}</TableCell>
                                                    <TableCell>
                                                        <Button className={'outline'}>
                                                            Full report <ChartSpline className={'size-4 ml-1'}/>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>)}
                                            </TableBody>
                                        </Table>
                            </>
                        }
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ViewAssessment;