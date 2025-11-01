import React, { useState } from 'react';

interface InputTableProps {
    headers: string[];
    data: Record<string, string>[];
    onDataChange: (rowIndex: number, header: string, value: string) => void;
    isReadOnly: boolean;
}

const InputTable: React.FC<InputTableProps> = ({ headers, data, onDataChange, isReadOnly }) => {
    const [copyButtonText, setCopyButtonText] = useState('入力内容をコピー (Copy Input)');
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
        // During IME composition, prevent navigation to allow the user to confirm their input.
        // FIX: Property 'isComposing' does not exist on type 'KeyboardEvent<HTMLInputElement>'. Access it from the native event.
        if (e.nativeEvent.isComposing || e.keyCode === 229) {
            return;
        }

        let nextRow = rowIndex;
        let nextCol = colIndex;
        let shouldMove = true;

        switch (e.key) {
            case 'Enter': // Moves down, like in Excel
            case 'ArrowDown':
                nextRow++;
                break;
            case 'ArrowUp':
                nextRow--;
                break;
            case 'ArrowRight':
                 // If at the end of input, go to next line start
                if (e.currentTarget.selectionStart === e.currentTarget.value.length) {
                    nextCol++;
                } else {
                    shouldMove = false;
                }
                break;
            case 'ArrowLeft':
                // If at the start of input, go to prev line end
                if (e.currentTarget.selectionStart === 0) {
                    nextCol--;
                } else {
                    shouldMove = false;
                }
                break;
            default:
                shouldMove = false;
        }

        if (shouldMove) {
            e.preventDefault();

            // Handle column overflow/underflow
            if (nextCol >= headers.length) {
                nextCol = 0;
                nextRow++;
            }
            if (nextCol < 0) {
                nextCol = headers.length - 1;
                nextRow--;
            }

            // Check if next row is valid
            if (nextRow >= 0 && nextRow < data.length) {
                const nextInput = document.querySelector(`[data-row='${nextRow}'][data-col='${nextCol}']`) as HTMLInputElement;
                if (nextInput) {
                    nextInput.focus();
                    nextInput.select();
                }
            }
        }
    };

    const handleCopy = () => {
        const tsv = [
            headers.join('\t'),
            ...data.map(row => headers.map(header => row[header] || '').join('\t'))
        ].join('\n');
        
        navigator.clipboard.writeText(tsv).then(() => {
            setCopyButtonText('コピーしました！');
            setTimeout(() => setCopyButtonText('入力内容をコピー (Copy Input)'), 2000);
        }).catch(err => {
            console.error('Failed to copy TSV: ', err);
            setCopyButtonText('コピーに失敗');
            setTimeout(() => setCopyButtonText('入力内容をコピー (Copy Input)'), 2000);
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-slate-700">入力用シート (Input Sheet)</h3>
                 <button onClick={handleCopy} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-1 px-3 rounded-md transition-colors duration-150">
                    {copyButtonText}
                </button>
            </div>
            <div className="overflow-auto flex-grow">
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-slate-100 z-10">
                        <tr>
                            <th className="border border-slate-300 px-2 py-2 text-center text-sm font-medium text-slate-600 bg-slate-200 w-12 select-none">#</th>
                            {headers.map((header, index) => (
                                <th key={index} className="border border-slate-300 px-2 py-2 text-left text-sm font-medium text-slate-600">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-slate-50">
                                <td className="border border-slate-200 p-2 text-center text-sm text-slate-500 bg-slate-100 select-none">
                                    {rowIndex + 1}
                                </td>
                                {headers.map((header, colIndex) => (
                                    <td key={colIndex} className="border border-slate-200 p-0">
                                        <input
                                            type="text"
                                            value={row[header] || ''}
                                            onChange={(e) => onDataChange(rowIndex, header, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                            className="w-full h-full px-2 py-1 border-none focus:ring-2 focus:ring-blue-400 focus:outline-none bg-transparent disabled:bg-slate-200"
                                            aria-label={`Row ${rowIndex + 1}, Column ${header}`}
                                            data-row={rowIndex}
                                            data-col={colIndex}
                                            readOnly={isReadOnly}
                                            disabled={isReadOnly}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InputTable;