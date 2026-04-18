export interface IExamMatrixDetailProps {
    id?: string;
    chapterId: string;
    percentage: number;
}

export interface IExamMatrixProps {
    id?: string;
    licenseCategoryId: string;
    totalQuestions: number;
    passingScore: number;
    durationMinutes: number;
    minCriticalQuestions: number;
    details: IExamMatrixDetailProps[];
    deletedAt?: Date | null;
}