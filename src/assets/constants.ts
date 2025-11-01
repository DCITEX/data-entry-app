
import { TaskType, Difficulty } from './types';

export const TASK_OPTIONS: { value: TaskType; label: string }[] = [
    { value: TaskType.CUSTOMER_LIST, label: '顧客名簿 (Customer List)' },
    { value: TaskType.PRODUCT_LIST, label: '商品リスト (Product List)' },
    { value: TaskType.SALES_DATA, label: '売上データ (Sales Data)' },
    { value: TaskType.INVOICE_INFO, label: '請求書情報 (Invoice Info)' },
];

export const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
    { value: Difficulty.EASY, label: '簡単 (Easy)' },
    { value: Difficulty.MEDIUM, label: '普通 (Medium)' },
    { value: Difficulty.HARD, label: '難しい (Hard)' },
];
