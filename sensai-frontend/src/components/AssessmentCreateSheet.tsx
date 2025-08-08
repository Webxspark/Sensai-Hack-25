"use client";
import React from 'react';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {ConfigProvider, Select, theme} from "antd";
import {Label} from "@/components/ui/label";
import {MOCK_getSkillsForRole, MOCK_ROLES} from "@/mocks/roles-skills-mapping";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {ArrowRight, LoaderCircle} from "lucide-react";

interface IAssessmentCreateSheetProps {
    open: boolean;
    onClose: () => void;
    schoolId: number | string | undefined;
    onSuccess?: () => void;
}

export type TDifficultyLevel = "easy" | "medium" | "hard";
export type TAssessmentFor = "education" | "elimination"
const AssessmentCreateSheet = ({open, onClose, onSuccess, schoolId}: IAssessmentCreateSheetProps) => {
    const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = React.useState<TDifficultyLevel | null>(null);
    const [selectedAssessmentFor, setSelectedAssessmentFor] = React.useState<TAssessmentFor | null>(null);
    const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
    const [expectedCandidates, setExpectedCandidates] = React.useState<number | null>(null);
    const [processing, setProcessing] = React.useState(false);
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // validate all fields
        if (!selectedRole || !selectedSkills.length || !selectedDifficulty || !selectedAssessmentFor) {
            alert("Please fill all the fields");
            return;
        }
        if (selectedAssessmentFor === "elimination" && !expectedCandidates) {
            alert("Please enter expected number of candidates");
            return;
        }
        setProcessing(true)
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/assessments/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                role: selectedRole,
                skills: selectedSkills.join(", "),
                difficulty: selectedDifficulty,
                assessment_type: selectedAssessmentFor,
                candidates: expectedCandidates || 0,
                org_id: Number(schoolId)
            })
        }).then(res => res.json())
            .catch(err => {
                console.error("Error creating assessment:", err);
                alert("Failed to create assessment. Please try again.");
            }).finally(() => {
            setProcessing(false);
            onClose();
            if (onSuccess) onSuccess();
        });
    }
    return (
        <Sheet open={open} onOpenChange={() => {
            if (processing) return;
            onClose();
        }}>
            <SheetContent className={'text-white bg-[#1a1a1a] border-l-[#1c1c1c]'}>
                <SheetHeader>
                    <SheetTitle>Create Assessment</SheetTitle>
                    <SheetDescription className="text-gray-400">
                        Generate a new assessment for each role according to the skills and difficulty levels you set.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                    <ConfigProvider
                        theme={{
                            algorithm: theme.darkAlgorithm
                        }}
                    >
                        <form onSubmit={handleFormSubmit} className={'space-y-4'}>
                            <div className="grid grid-cols-1 gap-y-2">
                                <Label htmlFor={'role-select'}>
                                    Select Role
                                </Label>
                                <Select
                                    id={"role-select"}
                                    className={'w-full'}
                                    placeholder={'Select a role'}
                                    options={MOCK_ROLES.map((role) => ({
                                        label: role,
                                        value: role
                                    }))}
                                    value={selectedRole}
                                    onChange={(value) => setSelectedRole(value)}
                                    popupClassName="pointer-events-auto"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-y-2">
                                <Label htmlFor={'skills-select'}>
                                    Skills mapped with the role
                                </Label>
                                <Select
                                    id={'skills-select'}
                                    className={'w-full'}
                                    disabled={!selectedRole}
                                    title={!selectedRole ? "Please select a role first" : ""}
                                    placeholder={'Select a role'}
                                    options={MOCK_getSkillsForRole(selectedRole || "").map((role: string) => ({
                                        label: role,
                                        value: role
                                    }))}
                                    value={selectedSkills}
                                    onChange={(value) => setSelectedSkills(value as string[])}
                                    mode={"tags"}
                                    popupClassName="pointer-events-auto"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-y-2">
                                <Label htmlFor={'difficulty-select'}>
                                    Difficulty Level
                                </Label>
                                <div className={'grid lg:grid-cols-3 md:grid-col-2 grid-cols-1 gap-3'}>
                                    <div
                                        className={
                                            cn("p-4 rounded-md flex items-center cursor-pointer justify-center border-1 border-gray-700 hover:border-gray-400 duration-75",
                                                selectedDifficulty === "easy" && "border-white shadow-lg hover:border-white")
                                        }
                                        onClick={() => setSelectedDifficulty("easy")}
                                    >
                                        Easy
                                    </div>
                                    <div
                                        className={
                                            cn("p-4 rounded-md flex items-center cursor-pointer justify-center border-1 border-gray-700 hover:border-gray-400 duration-75",
                                                selectedDifficulty === "medium" && "border-white shadow-lg hover:border-white")
                                        }
                                        onClick={() => setSelectedDifficulty("medium")}
                                    >
                                        Medium
                                    </div>
                                    <div
                                        className={
                                            cn("p-4 rounded-md flex items-center cursor-pointer justify-center border-1 border-gray-700 hover:border-gray-400 duration-75",
                                                selectedDifficulty === "hard" && "border-white shadow-lg hover:border-white")
                                        }
                                        onClick={() => setSelectedDifficulty("hard")}
                                    >
                                        Hard
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-y-2">
                                <Label htmlFor={"assessment-for"}>
                                    Assessment Type
                                </Label>
                                <div className={'grid grid-cols-1 gap-3'}>
                                    <div
                                        className={
                                            cn("p-4 rounded-md cursor-pointer flex flex-col border-1 border-gray-700 hover:border-gray-400 duration-75",
                                                selectedAssessmentFor === "education" && "border-white shadow-lg hover:border-white")
                                        }
                                        onClick={() => setSelectedAssessmentFor("education")}
                                    >
                                        <h2 className={'font-semibold'}>Educational Assessment</h2>
                                        <p className={'text-sm text-gray-400 mt-1'}>Standardized questions for fair
                                            comparison across students</p>
                                    </div>
                                    <div
                                        className={
                                            cn("p-4 rounded-md cursor-pointer flex flex-col border-1 border-gray-700 hover:border-gray-400 duration-75",
                                                selectedAssessmentFor === "elimination" && "border-white shadow-lg hover:border-white")
                                        }
                                        onClick={() => setSelectedAssessmentFor("elimination")}
                                    >
                                        <h2 className={'font-semibold'}>Recruitment Screening</h2>
                                        <p className={'text-sm text-gray-400 mt-1'}>Dynamic variants to prevent cheating
                                            during hiring</p>
                                    </div>
                                </div>
                            </div>
                            {selectedAssessmentFor == "elimination" && <div className="grid grid-cols-1 gap-y-2">
                                <Label htmlFor={'no-of-candidates'}>
                                    Expected number of candidates
                                </Label>
                                <Input
                                    placeholder={'Eg: 1000'}
                                    id={'no-of-candidates'}
                                    type={'number'}
                                    className={'w-full'}
                                    value={expectedCandidates?.toString()}
                                    onChange={(e) => setExpectedCandidates(Number(e.target.value))}
                                />
                            </div>}
                            <div className="grid grid-cols-1 gap-y-2">
                                <button
                                    disabled={processing}
                                    className={cn('px-6 py-2  flex  items-center justify-center bg-white text-black text-sm font-medium rounded-full hover:opacity-90 transition-opacity focus:outline-none cursor-pointer', processing && "!cursor-not-allowed")}>
                                    Start Generation {processing &&
                                    <LoaderCircle className={'size-4 ml-1 animate-spin'}/> ||
                                    <ArrowRight className={'size-4'}/>}
                                </button>
                            </div>
                        </form>
                    </ConfigProvider>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default AssessmentCreateSheet;