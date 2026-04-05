export const DifficultyLevel = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3
} as const;

export const labels: Record<number, string> = {
    1: 'EASY',
    2: 'MEDIUM',
    3: 'HARD'
};

// Tạo type để dùng cho TypeScript
export type DifficultyLevelType = typeof DifficultyLevel[keyof typeof DifficultyLevel];