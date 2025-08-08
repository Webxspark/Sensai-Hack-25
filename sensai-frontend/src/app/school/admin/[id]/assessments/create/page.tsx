"use client"
import React from 'react';
import {Header} from "@/components/layout/header";
import {Building, ExternalLink} from "lucide-react";

const GenerateAssessment = () => {
    return (
       <>
            <Header showCreateCourseButton={false}/>

            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-8">
                    <main>
                        <div className="mb-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-purple-700 rounded-lg flex items-center justify-center mr-4">
                                        <Building size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center">
                                            <h1
                                                className={`text-3xl font-light outline-none`}
                                            >
                                                {school.name}
                                            </h1>
                                            {/* <button
                                                onClick={toggleNameEdit}
                                                className="ml-2 p-2 text-gray-400 hover:text-white"
                                                aria-label={isEditingName ? "Save school name" : "Edit school name"}
                                            >
                                                {isEditingName ? <Save size={16} /> : <Edit size={16} />}
                                            </button> */}
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <p className="text-gray-400">{school.url}</p>
                                            <a
                                                href={school.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                                aria-label="Open school URL"
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        Create a new assessment for your course here. You can add questions, set time limits, and more.
                    </main>
                </div>
            </div>

        </>
    );
};

export default GenerateAssessment;