import React, { useState } from 'react';
import { CloseIcon, ChevronLeftIcon, MicrophoneIcon } from '../icons';
import { Juz } from '../../types';
import { surahs } from '../../data/surahs';
import { juzStartPages } from '../../data/juz';

interface SearchModalProps {
  onClose: () => void;
  onNavigate: (page: number) => void;
}

const juzData = juzStartPages.map(j => ({
    number: j.juz,
    start: `جزء ${j.juz}`,
    page: j.page,
}));

const SearchModal: React.FC<SearchModalProps> = ({ onClose, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'parts'>('chapters');

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col h-full" dir="rtl">
      <div className="p-4 bg-white border-b">
        <div className="relative">
          <input 
            type="text" 
            placeholder="البحث... الفاتحة، ١:٤، ص٢٦..." 
            className="w-full bg-gray-100 rounded-full py-2 pr-10 pl-4 text-right focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <MicrophoneIcon className="w-5 h-5 text-gray-500" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold">قرأت مؤخرا</span>
            <div className="flex items-center space-x-2">
                 <button className="flex items-center bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 text-sm">
                    <span>الإسراء</span>
                    <span className="font-sans mr-1">17:105</span>
                </button>
            </div>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button 
            onClick={() => setActiveTab('chapters')}
            className={`w-1/2 py-2 rounded-md font-semibold text-sm ${activeTab === 'chapters' ? 'bg-white shadow' : 'text-gray-600'}`}
          >
            اختر السورة والجزء
          </button>
          <button 
            onClick={() => setActiveTab('parts')}
            className={`w-1/2 py-2 rounded-md font-semibold text-sm ${activeTab === 'parts' ? 'bg-white shadow' : 'text-gray-600'}`}
          >
            Parts
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        {activeTab === 'chapters' && (
          <ul>
            {surahs.map((surah) => (
              <li key={surah.number} onClick={() => onNavigate(surah.startPage)} className="flex items-center justify-between p-4 border-b hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-emerald-600">{surah.number}</div>
                  <div className="mr-4">
                    <p className="font-semibold text-lg">{surah.name}</p>
                    <p className="text-sm text-gray-500">{surah.numberOfAyahs} آيات - {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</p>
                  </div>
                </div>
                <p className="text-3xl" style={{ fontFamily: "'Amiri', serif" }}>{surah.name}</p>
              </li>
            ))}
          </ul>
        )}
        {activeTab === 'parts' && (
            <ul>
                {juzData.map((juz) => (
                    <li key={juz.number} onClick={() => onNavigate(juz.page)} className="flex items-center justify-between p-4 border-b hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-emerald-600">{juz.number}</div>
                            <div className="mr-4">
                                <p className="font-semibold text-lg">{juz.start}</p>
                            </div>
                        </div>
                        <ChevronLeftIcon className="w-6 h-6 text-gray-400" />
                    </li>
                ))}
            </ul>
        )}
      </div>

       <div className="p-2 border-t bg-white">
            <button onClick={onClose} className="w-full py-2 text-gray-600 rounded-lg font-semibold">إغلاق</button>
        </div>
    </div>
  );
};

export default SearchModal;