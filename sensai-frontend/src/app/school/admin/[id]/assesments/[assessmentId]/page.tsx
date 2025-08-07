"use client";
import React from 'react';
import {useParams} from "next/navigation";

const ViewAssessment = (props) => {
    const params = useParams();
    return (
        <div>
            You are viewing assessment with ID: {params.assessmentId as string}
        </div>
    );
};

export default ViewAssessment;