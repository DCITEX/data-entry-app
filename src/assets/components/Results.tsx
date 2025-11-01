import React, { useState } from 'react';
import { GradingResult } from '../types';

interface ResultsProps {
    result: GradingResult;
    onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onReset }) => {
    const [copyButtonText, setCopyButtonText] = useState('結果をコピー');

    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}分 ${seconds}秒`;
    };
    
    const accuracyColor = result.accuracy >= 95 ? 'text-green-600' : result.accuracy >= 80 ? 'text-yellow-600' : 'text-red-600';

    const handleCopy = () => {
        const reportParts: string[] = [];

        reportParts.push('■□■ データ入力スキル評価結果 ■□■');
        reportParts.push(`実施日時: ${new Date(result.timestamp).toLocaleString('ja-JP')}`);
        reportParts.push('');

        reportParts.push('--- 概要 ---');
        reportParts.push(`正答率: ${result.accuracy.toFixed(2)}% (${result.correctEntries} / ${result.totalEntries})`);
        reportParts.push(`入力時間: ${formatTime(result.time)}`);
        reportParts.push(`ミスした箇所: ${result.errors.length}件`);
        reportParts.push('');

        if (result.aiFeedback) {
            reportParts.push('--- AIからのフィードバック ---');
            reportParts.push(result.aiFeedback);
            reportParts.push('');
        }

        if (result.mistakeAnalysis && result.errors.length > 0) {
            reportParts.push('--- ケアレスミス分析 ---');
            const plainAnalysis = result.mistakeAnalysis.replace(/\*\*/g, '');
            reportParts.push(plainAnalysis);
            reportParts.push('');
        }

        if (result.errors.length > 0) {
            reportParts.push('--- ミスの詳細 ---');
            result.errors.forEach(err => {
                reportParts.push(`・行 ${err.rowIndex + 1}, 項目「${err.header}」: 入力「${err.userValue || '""'}」, 正解「${err.correctValue}」`);
            });
            reportParts.push('');
        }

        const reportText = reportParts.join('\n');

        navigator.clipboard.writeText(reportText).then(() => {
            setCopyButtonText('コピーしました！');
            setTimeout(() => setCopyButtonText('結果をコピー'), 2000);
        }).catch(err => {
            console.error('Failed to copy results: ', err);
            setCopyButtonText('コピーに失敗');
            setTimeout(() => setCopyButtonText('結果をコピー'), 2000);
        });
    };


    const LoadingState = ({ text }: { text: string }) => (
         <div className="flex items-center space-x-2 text-slate-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span>{text}</span>
        </div>
    );

    const renderAnalysis = (text: string) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        return (
            <div className="text-slate-700 leading-relaxed text-left w-full">
                {lines.map((line, index) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                            <h4 key={index} className="font-semibold text-slate-800 mt-3 first:mt-0 text-base">
                                {line.substring(2, line.length - 2)}
                            </h4>
                        );
                    }
                    return <p key={index} className="text-sm mt-1">{line}</p>;
                })}
            </div>
        );
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">採点結果 (Results)</h2>
                <button
                    onClick={handleCopy}
                    className="flex items-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-150 text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copyButtonText}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
                <div className="bg-slate-100 p-4 rounded-lg">
                    <p className="text-sm text-slate-500">正答率 (Accuracy)</p>
                    <p className={`text-4xl font-bold ${accuracyColor}`}>{result.accuracy.toFixed(2)}%</p>
                    <p className="text-xs text-slate-500">({result.correctEntries} / {result.totalEntries})</p>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg">
                    <p className="text-sm text-slate-500">入力時間 (Time)</p>
                    <p className="text-4xl font-bold text-blue-600">{formatTime(result.time)}</p>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg">
                    <p className="text-sm text-slate-500">ミスした箇所 (Errors)</p>
                    <p className="text-4xl font-bold text-red-600">{result.errors.length}</p>
                </div>
            </div>
            
            <div className="space-y-8 mb-8">
                 {/* AI Feedback */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-slate-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AIからのフィードバック (AI Feedback)
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg min-h-[80px] flex items-center justify-center">
                        {result.aiFeedback ? (
                            <p className="text-slate-700 leading-relaxed">{result.aiFeedback}</p>
                        ) : (
                            <LoadingState text="AIがパフォーマンスを分析中..." />
                        )}
                    </div>
                </div>

                {/* Mistake Analysis */}
                {result.errors.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-slate-800 flex items-center">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            ケアレスミス分析 (Careless Mistake Analysis)
                        </h3>
                         <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg min-h-[80px] flex items-center">
                            {result.mistakeAnalysis ? (
                                renderAnalysis(result.mistakeAnalysis)
                            ) : (
                                <div className="w-full flex items-center justify-center">
                                    <LoadingState text="AIがミスの傾向を分析中..." />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                 {/* Error Details */}
                {result.errors.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">ミスの詳細 (Error Details)</h3>
                        <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 sticky top-0">
                                    <tr>
                                        <th className="p-2">行</th>
                                        <th className="p-2">項目</th>
                                        <th className="p-2">あなたの入力</th>
                                        <th className="p-2">正解</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.errors.map((err, i) => (
                                        <tr key={i} className="border-b">
                                            <td className="p-2">{err.rowIndex + 1}</td>
                                            <td className="p-2 font-medium">{err.header}</td>
                                            <td className="p-2 text-red-600 bg-red-50">{err.userValue || '""'}</td>
                                            <td className="p-2 text-green-600 bg-green-50">{err.correctValue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <div className="text-center">
                <button
                    onClick={onReset}
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105"
                >
                    別の問題に挑戦する (Try Another)
                </button>
            </div>
        </div>
    );
};

export default Results;