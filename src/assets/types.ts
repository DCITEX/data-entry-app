export enum TaskType {
    CUSTOMER_LIST = 'customer_list',
    PRODUCT_LIST = 'product_list',
    SALES_DATA = 'sales_data',
    INVOICE_INFO = 'invoice_info'
}

export enum Difficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard'
}

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