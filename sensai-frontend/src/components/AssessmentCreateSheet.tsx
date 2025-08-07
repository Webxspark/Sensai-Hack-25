"use client";
import React from 'react';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";

interface IAssessmentCreateSheetProps {
    open: boolean;
    onClose: () => void;
    schoolId: number | string | undefined;
    onSuccess?: () => void;
}

const AssessmentCreateSheet = ({open, onClose, onSuccess, schoolId}: IAssessmentCreateSheetProps) => {
    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className={'text-white bg-[#1a1a1a] border-l-[#1c1c1c]'}>
                <SheetHeader>
                    <SheetTitle>Create Assessment</SheetTitle>
                    <SheetDescription className="text-gray-400">
                        Generate a new assessment for each role according to the skills and difficulty levels you set.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                    <p className="text-sm ">
                        This feature is currently under development. Please check back later for updates.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default AssessmentCreateSheet;