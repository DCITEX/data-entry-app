export const TaskType = {
    CUSTOMER_LIST: 'customer_list',
    PRODUCT_LIST: 'product_list',
    SALES_DATA: 'sales_data',
    INVOICE_INFO: 'invoice_info'
} as const;

export type TaskType = typeof TaskType[keyof typeof TaskType];


export const Difficulty = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
} as const;

export type Difficulty = typeof Difficulty[keyof typeof Difficulty];

export interface ProblemSet {
    instructions: string;
    templateHeaders: string[];
    sourceData: string[][];
    displayData: string;
}

export interface GradingResult {
    accuracy: number;
    time: number;
    errors: {
        rowIndex: number;
        colIndex: number;
        header: string;
        userValue: string;
        correctValue: string;
    }[];
    totalEntries: number;
    correctEntries: number;
    aiFeedback?: string;
    mistakeAnalysis?: string;
    timestamp: string;
}