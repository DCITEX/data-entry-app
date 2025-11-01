import React from 'react';

interface UserGuideProps {
    onClose: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-down"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-slate-800">ご利用ガイド (User Guide)</h2>
                    <button 
                        onClick={onClose} 
                        className="text-slate-500 hover:text-slate-800 transition-colors"
                        aria-label="ガイドを閉じる"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6 md:p-8 space-y-8 text-slate-700">
                    <p className="text-base">このツールは、AIが生成する問題でデータ入力の練習とスキル評価ができるアプリケーションです。以下のステップで、あなたのスキルを楽しく向上させましょう！</p>
                    
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center">
                            <span className="bg-blue-500 text-white rounded-full h-6 w-6 text-sm flex items-center justify-center mr-3 shrink-0">1</span>
                            練習問題を選ぶ
                        </h3>
                        <p className="pl-9">「業務の種類」と「難易度」を選択し、[問題を作成]ボタンをクリックします。AIがあなたにぴったりの練習問題を作成します。</p>
                        <div className="pt-4 pl-9">
                            <div className="bg-slate-50 border-l-4 border-slate-300 p-4 rounded-r-lg space-y-3">
                                <h4 className="font-bold text-slate-800">業務の種類の詳細</h4>
                                <div className="text-sm space-y-3">
                                    <div>
                                        <p className="font-semibold">顧客名簿 (Customer List)</p>
                                        <p className="pl-2 text-slate-600">氏名、住所、連絡先などの個人情報を正確に入力する練習です。</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">商品リスト (Product List)</p>
                                        <p className="pl-2 text-slate-600">商品コードや価格など、英数字が混在するデータを素早く入力する練習です。</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">売上データ (Sales Data)</p>
                                        <p className="pl-2 text-slate-600">日付や金額など、数字データをテンキーなどを使って効率的に入力する練習です。</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">請求書情報 (Invoice Info)</p>
                                        <p className="pl-2 text-slate-600">請求書番号や取引先、品目など、複数の項目を正確に転記する練習です。</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 border-l-4 border-slate-300 p-4 rounded-r-lg space-y-3 mt-4">
                                <h4 className="font-bold text-slate-800">難易度の詳細</h4>
                                <div className="text-sm space-y-3">
                                    <div>
                                        <p className="font-semibold">簡単 (Easy)</p>
                                        <p className="pl-2 text-slate-600">入力するデータ量が少なく、単純な内容です。まずは操作に慣れたい方に最適です。</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">普通 (Medium)</p>
                                        <p className="pl-2 text-slate-600">標準的なデータ量です。正確さとスピードのバランスが求められます。</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">難しい (Hard)</p>
                                        <p className="pl-2 text-slate-600">データ量が多く、複雑な文字列（英数字、記号の混在など）が含まれます。高い集中力と正確性が試されます。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center">
                            <span className="bg-blue-500 text-white rounded-full h-6 w-6 text-sm flex items-center justify-center mr-3 shrink-0">2</span>
                            データ入力に挑戦！
                        </h3>
                        <p className="pl-9">問題が作成されたら、[開始]ボタンをクリックしてタイマーをスタートさせ、入力用シートへの入力を開始します。</p>
                        <div className="pt-4 pl-9">
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg space-y-4">
                                <h4 className="font-bold text-blue-800">💡 実践的な入力方法のヒント</h4>
                                <p className="text-sm">このツールでは、実際の業務に近い2つの入力スタイルを練習できます。</p>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="font-semibold">A. 画面分割スタイル (デフォルト)</p>
                                        <p className="pl-4">左の「入力元データ」を見ながら、右の「入力用シート」に入力します。</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">B. 別ウィンドウ/モニター活用スタイル (より実践的！)</p>
                                        <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                            <li>まず「入力元データ」の <strong className="font-semibold text-slate-800">[コピー]</strong> ボタンで内容をコピーし、メモ帳や別モニターに貼り付けて参照します。</li>
                                            <li>次に <strong className="font-semibold text-slate-800">[シートを最大化]</strong> ボタンで入力シートを全画面表示にして作業に集中します。</li>
                                            <li>入力元を再確認したい場合は、<strong className="font-semibold text-slate-800">[入力元を再表示]</strong> ボタンで元の表示に戻せます。</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                             <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg space-y-2 mt-4">
                                <h4 className="font-bold text-green-800">⏱️ タイマーの活用について</h4>
                                <p className="text-sm">タイマーは画面下部に表示され、入力速度の目安になります。もし時間を気にせず集中したい場合は、<strong className="font-semibold text-slate-800">[タイマーを表示]</strong>のスイッチで非表示にすることも可能です。</p>
                            </div>
                        </div>
                    </div>

                     <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center">
                            <span className="bg-blue-500 text-white rounded-full h-6 w-6 text-sm flex items-center justify-center mr-3 shrink-0">3</span>
                            結果を確認してスキルアップ
                        </h3>
                        <p className="pl-9">入力が終わったら[採点する]ボタンを押します。結果画面では以下の詳細なフィードバックを確認して、次の練習に活かしましょう。</p>
                        <div className="pl-9 pt-2">
                            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg space-y-3">
                                <h4 className="font-bold text-purple-800">📈 結果画面で確認できること</h4>
                                <ul className="list-none space-y-3 text-sm">
                                    <li className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                        <div>
                                            <strong className="font-semibold text-slate-800">AIからのフィードバック</strong>
                                            <p className="text-slate-600 mt-0.5">パフォーマンス全体へのアドバイスがもらえます。</p>
                                        </div>
                                    </li>
                                     <li className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                        <div>
                                            <strong className="font-semibold text-slate-800">ケアレスミス分析</strong>
                                            <p className="text-slate-600 mt-0.5">ミスの傾向と、それに基づいた具体的な対策を提案します。</p>
                                        </div>
                                    </li>
                                     <li className="flex items-start">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        <div>
                                            <strong className="font-semibold text-slate-800">ミスの詳細</strong>
                                            <p className="text-slate-600 mt-0.5">どの項目をどう間違えたか、一覧で正確に把握できます。</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
                 <div className="sticky bottom-0 bg-slate-50 border-t px-6 py-4 text-right">
                    <button 
                        onClick={onClose}
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserGuide;