
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 md:px-6">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                    <span className="text-blue-600">AI</span> 実践的データ入力スキル評価ツール
                </h1>
                <p className="text-sm text-slate-500 mt-1">AI-Powered Data Entry Skill Trainer</p>
            </div>
        </header>
    );
};

export default Header;
