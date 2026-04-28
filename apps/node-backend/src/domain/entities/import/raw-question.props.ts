export interface IRawQuestion {
  indexNumber: number;
  content: string;
  chapter: string;
  licenseCategory: string[];
  difficultyLevel: number;
  isCriticalRaw: boolean; 
  questionImage?: string;
  rawAnswers: {
    text: string;
    image?: string;
  }[];
  correctAnswerIndex: number;
  aiExplainDraft: string;
}