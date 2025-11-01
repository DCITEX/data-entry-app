
import React, { useState } from 'react';

interface TaskDisplayProps {
    instructions: string;
    displayData: string;
    onToggleVisibility: () => void;
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({ instructions, displayData, onToggleVisibility }) => {
    const [copyButtonText, setCopyButtonText] = useState('コピー (Copy)');

    const handleCopy = () => {
        navigator.clipboard.writeText(displayData).then(() => {
            setCopyButtonText('コピーしました！');
            setTimeout(() => setCopyButtonText('コピー (Copy)'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyButtonText('コピーに失敗');
             setTimeout(() => setCopyButtonText('コピー (Copy)'), 2000);
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h3 className="text-lg font-semibold text-slate-700">指示 (Instructions)</h3>
            </div>
            <p className="text-slate-600 mb-4">{instructions}</p>

            <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h3 className="text-lg font-semibold text-slate-700">入力元データ (Source Data)</h3>
                <div className="flex space-x-2">
                    <button onClick={handleCopy} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-1 px-3 rounded-md transition-colors duration-150">
                        {copyButtonText}
                    </button>
                    <button onClick={onToggleVisibility} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-1 px-3 rounded-md transition-colors duration-150">
                        シートを最大化 (Maximize)
                    </button>
                </div>
            </div>

            <div className="bg-slate-100 p-3 rounded-md text-sm font-mono whitespace-pre-wrap overflow-auto flex-grow">
                {displayData}
            </div>
        </div>
    );
};

export default TaskDisplay;