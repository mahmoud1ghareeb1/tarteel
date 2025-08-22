import React from 'react';
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { RecitationReport, RecitationMistake } from '../../types';

interface MistakeReportModalProps {
  onClose: () => void;
  recitationReport: RecitationReport | null;
}

const StatCard: React.FC<{ value: string | number, label: string }> = ({ value, label }) => (
    <div className="bg-gray-100 p-3 rounded-lg">
        <p className="text-2xl font-bold text-emerald-600">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
    </div>
);

const MistakeItem: React.FC<{ mistake: RecitationMistake }> = ({ mistake }) => (
    <div className="bg-gray-50 rounded-lg p-3 text-right">
        <p className="text-sm font-semibold text-gray-700 mb-2">{mistake.suraName} : {mistake.ayahNumber}</p>
        <div className="text-lg quran-text">
             <p className="flex items-center justify-end">
                <span className="text-red-500 font-bold ml-2">{mistake.recited}</span>
                <span>:ما تم تلاوته</span>
                <XCircleIcon className="w-5 h-5 text-red-500 ml-2"/>
            </p>
            <p className="flex items-center justify-end mt-1">
                <span className="text-emerald-600 font-bold ml-2">{mistake.expected}</span>
                <span>:متوقع</span>
                 <CheckCircleIcon className="w-5 h-5 text-emerald-500 ml-2"/>
            </p>
        </div>
    </div>
);


const MistakeReportModal: React.FC<MistakeReportModalProps> = ({ onClose, recitationReport }) => {
    if (!recitationReport) return null;

    const { accuracy, correctWords, mistakeCount, mistakes } = recitationReport;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-t-2xl p-4">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
            <div className="w-8"></div>
            <h2 className="font-bold text-xl text-center">تقرير التلاوة</h2>
            <button onClick={onClose} className="p-1">
                <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
        </div>
      
        <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <StatCard value={`${accuracy}%`} label="الدقة" />
            <StatCard value={correctWords} label="كلمات صحيحة" />
            <StatCard value={mistakeCount} label="أخطاء" />
        </div>

        {mistakes.length > 0 ? (
            <div className="border-t pt-4">
                <h3 className="font-bold text-lg mb-2 text-right">تفاصيل الخطأ</h3>
                <div className="max-h-60 overflow-y-auto space-y-2 p-1">
                    {mistakes.map((mistake, index) => (
                        <MistakeItem key={`${mistake.verseKey}-${mistake.wordIndex}-${index}`} mistake={mistake} />
                    ))}
                </div>
            </div>
        ) : (
             <div className="text-center p-8 text-gray-500">
                <CheckCircleIcon className="w-16 h-16 mx-auto text-emerald-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">تلاوة ممتازة!</h2>
                <p>لم يتم الكشف عن أي أخطاء في هذه الجلسة.</p>
            </div>
        )}
    </div>
  );
};

export default MistakeReportModal;