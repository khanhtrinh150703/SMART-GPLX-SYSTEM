export interface IStartSessionInputDTO {
  readonly examId: string;
}

export interface IUpdateAnswerInputDTO {
  readonly questionId: string;
  readonly selectedAnswerId: number | null;
}
