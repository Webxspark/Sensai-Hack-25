import Link from "next/link";
import { useParams } from "next/navigation";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import {TDifficultyLevel} from "@/components/AssessmentCreateSheet";

interface AssessmentCardProps {
    id: string | number;
    title: string;
    skills: string;
    difficulty: TDifficultyLevel;
    orgId: string | number;
    onDelete?: (assessmentId: string | number) => void;
}

export default function AssessmentCard({ id, orgId, title, skills, difficulty, onDelete }: AssessmentCardProps) {
    const params = useParams();
    const schoolId = params?.id;
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Generate a unique border color based on the course id
    const getBorderColor = () => {
        const colors = [
            'border-purple-500',
            'border-green-500',
            'border-pink-500',
            'border-yellow-500',
            'border-blue-500',
            'border-red-500',
            'border-indigo-500',
            'border-orange-500'
        ];

        // Handle string IDs by converting to a number
        let idNumber: number;
        if (typeof id === 'string') {
            // Use string hash code
            idNumber = Array.from(id).reduce(
                (hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0
            );
            // Ensure positive number
            idNumber = Math.abs(idNumber);
        } else {
            idNumber = id;
        }

        return colors[idNumber % colors.length];
    };

    // Check if this is an admin view
    const isAdminView = schoolId;

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/assessments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete assessment');
            }

            // Close the dialog after successful deletion
            setIsDeleteConfirmOpen(false);

            // Call the onDelete callback if provided
            if (onDelete) {
                onDelete(id);
            }

        } catch (error) {
            console.error('Error deleting course:', error);
            setDeleteError('An error occurred while deleting the course. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="group relative">
            <Link href={`/school/admin/${orgId}/assessments/${id}`} className="block h-full">
                <div className={`bg-[#1A1A1A] text-gray-300 rounded-lg p-6 h-full transition-all hover:opacity-90 cursor-pointer border-b-2 ${getBorderColor()} border-opacity-70`}>
                    <div className={'flex items-center justify-between'}>
                        <h2 className="text-xl font-light mb-2">{title}</h2>
                        <div className={'p-1 rounded-full border-1 border-gray-500 px-3 flex items-center gap-2'}>
                            {difficulty === 'easy' && <span className="text-green-500 text-sm">Easy</span>}
                            {difficulty === 'medium' && <span className="text-yellow-500 text-sm">Medium</span>}
                            {difficulty === 'hard' && <span className="text-red-500 text-sm">Hard</span>}
                        </div>
                    </div>
                    <p className={'text-sm text-gray-400'}>{skills}</p>
                </div>
            </Link>
            {isAdminView && (
                <button
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none cursor-pointer rounded-full hover:bg-gray-800"
                    aria-label="Delete assessment"
                    onClick={handleDeleteClick}
                >
                    <Trash2 size={18} />
                </button>
            )}

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                show={isDeleteConfirmOpen}
                title="Delete assessment"
                message={`Are you sure you want to delete this assessment? All the modules and tasks will be permanently deleted, any learner with access will lose all their progress and this action is irreversible`}
                confirmButtonText="Delete"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setIsDeleteConfirmOpen(false)}
                type="delete"
                isLoading={isDeleting}
                errorMessage={deleteError}
            />
        </div>
    );
} 