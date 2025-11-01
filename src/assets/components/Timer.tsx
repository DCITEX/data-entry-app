
import React from 'react';

interface TimerProps {
    seconds: number;
}

const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const Timer: React.FC<TimerProps> = ({ seconds }) => {
    return (
        <div className="bg-white px-4 py-2 rounded-full shadow-md text-lg font-semibold font-mono text-slate-700">
            Time: <span className="text-blue-600">{formatTime(seconds)}</span>
        </div>
    );
};

export default Timer;
