import React, { useState, useEffect, useCallback, useRef } from 'react';
//import { TaskType, Difficulty, ProblemSet, GradingResult } from './src/assets/types';
import { TaskType, Difficulty } from './src/assets/types';
import type { ProblemSet, GradingResult } from './src/assets/types';
import { generateProblem, generateFeedback, analyzeMistakes } from './src/assets/services/geminiService';

import Header from './src/assets/components/Header';

import Footer from './src/assets/components/Footer';
import ProblemSelector from './src/assets/components/ProblemSelector';
//import LoadingSpinner from './components/LoadingSpinner';
//import LoadingSpinner from './src/assets/components/LoadingSpinner';

import TaskDisplay from './src/assets/components/TaskDisplay';
import InputTable from './src/assets/components/IuputTable';

import Timer from './src/assets/components/Timer';
import Results from './src/assets/components/Results';
import UserGuide from './src/assets/components/UserGuide';

type GameState = 'selecting' | 'generating' | 'typing' | 'results';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('selecting');
    const [problem, setProblem] = useState<ProblemSet | null>(null);
    const [userInput, setUserInput] = useState<Record<string, string>[]>([]);
    const [time, setTime] = useState(0);
    const [results, setResults] = useState<GradingResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [taskType, setTaskType] = useState<TaskType | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [showGuide, setShowGuide] = useState(false);
    
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [showTimer, setShowTimer] = useState(true);
    const [isSourceVisible, setIsSourceVisible] = useState(true);

    const timerIntervalRef = useRef<number | null>(null);

    const startTimer = useCallback(() => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setTime(0);
        timerIntervalRef.current = window.setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);
    }, []);

    const stopTimer = useCallback(() => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            stopTimer(); // Cleanup on unmount
        };
    }, [stopTimer]);
    
    const handleGenerateProblem = useCallback(async (selectedTaskType: TaskType, selectedDifficulty: Difficulty) => {
        setGameState('generating');
        setError(null);
        setTaskType(selectedTaskType);
        setDifficulty(selectedDifficulty);
        try {
            const problemSet = await generateProblem(selectedTaskType, selectedDifficulty);
            setProblem(problemSet);
            const initialUserInput = Array(problemSet.sourceData.length).fill({}).map(() => 
                problemSet.templateHeaders.reduce((acc, header) => ({ ...acc, [header]: '' }), {})
            );
            setUserInput(initialUserInput);
            setGameState('typing');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
            setGameState('selecting');
        }
    }, []);

    const handleDataChange = (rowIndex: number, header: string, value: string) => {
        setUserInput(prev => {
            const newData = [...prev];
            newData[rowIndex] = { ...newData[rowIndex], [header]: value };
            return newData;
        });
    };
    
    const handleStart = () => {
        setIsTimerRunning(true);
        startTimer();
    };

    const handleGrade = () => {
        stopTimer();
        if (!problem || !taskType || !difficulty) return;

        const errors: GradingResult['errors'] = [];
        let correctEntries = 0;
        const totalEntries = problem.sourceData.length * problem.templateHeaders.length;

        problem.sourceData.forEach((correctRow, rowIndex) => {
            problem.templateHeaders.forEach((header, colIndex) => {
                const correctValue = String(correctRow[colIndex] ?? '');
                const userValue = String(userInput[rowIndex]?.[header] ?? '');

                if (correctValue.trim() === userValue.trim()) {
                    correctEntries++;
                } else {
                    errors.push({
                        rowIndex,
                        colIndex,
                        header,
                        userValue,
                        correctValue,
                    });
                }
            });
        });

        const accuracy = totalEntries > 0 ? (correctEntries / totalEntries) * 100 : 100;
        
        const gradingResult: GradingResult = { accuracy, time, errors, totalEntries, correctEntries, timestamp: new Date().toISOString() };
        setResults(gradingResult);
        setGameState('results');

        // Asynchronously fetch AI feedback and analysis
        generateFeedback(gradingResult, taskType, difficulty)
            .then(feedback => {
                setResults(prev => prev ? { ...prev, aiFeedback: feedback } : null);
            })
            .catch(error => {
                console.error('Failed to generate AI feedback:', error);
                setResults(prev => prev ? { ...prev, aiFeedback: 'AIからのフィードバックの読み込みに失敗しました。' } : null);
            });

        analyzeMistakes(gradingResult)
            .then(analysis => {
                 setResults(prev => prev ? { ...prev, mistakeAnalysis: analysis } : null);
            })
            .catch(error => {
                console.error('Failed to analyze mistakes:', error);
                 setResults(prev => prev ? { ...prev, mistakeAnalysis: 'ミスの傾向分析に失敗しました。' } : null);
            });
    };
    
    const handleReset = () => {
        setGameState('selecting');
        setProblem(null);
        setUserInput([]);
        setTime(0);
        setResults(null);
        setError(null);
        setTaskType(null);
        setDifficulty(null);
        stopTimer();
        setIsTimerRunning(false);
        setIsSourceVisible(true);
    };

    const renderContent = () => {
        switch (gameState) {
            case 'typing':
                if (!problem) return null;
                return (
                    <div className={`w-full ${isSourceVisible ? 'max-w-7xl mx-auto' : ''} space-y-4 h-full flex flex-col`}>
                        <div className={`grid grid-cols-1 ${isSourceVisible ? 'lg:grid-cols-2' : ''} gap-4 flex-grow min-h-[500px]`}>
                            {isSourceVisible && (
                                <TaskDisplay instructions={problem.instructions} displayData={problem.displayData} onToggleVisibility={() => setIsSourceVisible(false)} />
                            )}
                            <div className={!isSourceVisible ? 'lg:col-span-2' : ''}>
                                <InputTable headers={problem.templateHeaders} data={userInput} onDataChange={handleDataChange} isReadOnly={!isTimerRunning} />
                            </div>
                        </div>
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <div className="flex items-center space-x-4">
                                {!isTimerRunning ? (
                                    <button onClick={handleStart} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105">
                                        開始 (Start)
                                    </button>
                                ) : (
                                   showTimer && <Timer seconds={time} />
                                )}
                                 <div className="flex items-center">
                                    <label htmlFor="showTimer" className="flex items-center cursor-pointer group">
                                        <span className="text-sm text-gray-900">タイマーを表示</span>
                                        <div className="ml-3 relative">
                                            <input
                                                type="checkbox"
                                                id="showTimer"
                                                className="sr-only peer"
                                                checked={showTimer}
                                                onChange={() => setShowTimer(prev => !prev)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 transition-all"></div>
                                            <div className="absolute top-0.5 left-[2px] bg-white border-gray-300 border rounded-full h-5 w-5 peer-checked:translate-x-full peer-checked:border-white transition-all"></div>
                                        </div>
                                    </label>
                                </div>
                                {!isSourceVisible && (
                                    <button onClick={() => setIsSourceVisible(true)} className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-150 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 00-4-4H3m18 0h-2a4 4 0 00-4 4v2m-4-14v2a4 4 0 004 4h2M5 5h2a4 4 0 004-4V1" />
                                        </svg>
                                        入力元を再表示 (Show Source)
                                    </button>
                                )}
                            </div>
                            <button onClick={handleGrade} disabled={!isTimerRunning} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed">
                                採点する (Submit)
                            </button>
                        </div>
                    </div>
                );
            case 'results':
                if (!results) return null;
                return <Results result={results} onReset={handleReset} />;
            // FIX: Combined 'generating' and 'selecting' states to fix TypeScript error and improve UX
            // by showing an inline loading state on the ProblemSelector button instead of a full-page spinner.
            case 'generating':
            case 'selecting':
            default:
                return (
                    <div>
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 max-w-lg mx-auto" role="alert">{error}</div>}
                        <ProblemSelector 
                            onGenerate={handleGenerateProblem} 
                            isLoading={gameState === 'generating'}
                            onShowGuide={() => setShowGuide(true)}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {showGuide && <UserGuide onClose={() => setShowGuide(false)} />}
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};

export default App;