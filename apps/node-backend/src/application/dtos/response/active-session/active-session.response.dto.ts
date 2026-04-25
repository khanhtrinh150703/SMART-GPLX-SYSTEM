export interface IActiveSessionResponseDTO {
  readonly examId: string;
  readonly expiresAt: Date;
  readonly currentAnswers: {
    readonly questionId: string;
    readonly selectedAnswerIndex: number | null;
    readonly updatedAt: Date;
  }[];
}