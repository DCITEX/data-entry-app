
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white mt-auto">
            <div className="container mx-auto px-4 py-4 text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} AI Data Entry Skill Trainer. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
