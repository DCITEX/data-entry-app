import React from 'react';
import { TaskType, Difficulty } from '../types';
import { TASK_OPTIONS, DIFFICULTY_OPTIONS } from '../constants';

interface ProblemSelectorProps {
    onGenerate: (taskType: TaskType, difficulty: Difficulty) => void;
    isLoading: boolean;
    onShowGuide: () => void;
}

const ProblemSelector: React.FC<ProblemSelectorProps> = ({ onGenerate, isLoading, onShowGuide }) => {
    const [taskType, setTaskType] = React.useState<TaskType>(TaskType.CUSTOMER_LIST);
    const [difficulty, setDifficulty] = React.useState<Difficulty>(Difficulty.EASY);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(taskType, difficulty);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-lg mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold">練習問題を作成</h2>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-8" role="alert">
                <div className="flex">
                    <div className="py-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-slate-700 mb-1">練習したい業務の種類と難易度を選択してください。</p>
                        <p className="text-sm text-slate-700">
                            初めての方は
                            <button onClick={onShowGuide} className="font-bold text-blue-600 hover:underline ml-1">
                                ご利用ガイド
                            </button>
                            をご確認ください。
                        </p>
                    </div>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="taskType" className="block text-sm font-medium text-slate-700 mb-2">業務の種類 (Task Type)</label>
                    <select
                        id="taskType"
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value as TaskType)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        disabled={isLoading}
                    >
                        {TASK_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 mb-2">難易度 (Difficulty)</label>
                    <select
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        disabled={isLoading}
                    >
                        {DIFFICULTY_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isLoading}
                >
                    {isLoading ? '作成中...' : '問題を作成 (Create Problem)'}
                </button>
            </form>
        </div>
    );
};

export default ProblemSelector;