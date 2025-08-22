import React from 'react';
import { useApp } from '../App';
import { View } from '../types';
import { HamburgerIcon, SearchIcon, BookmarkIcon, SettingsIcon } from './icons';

interface TopToolbarProps {
  onSearchClick: () => void;
  onBookmarkClick: () => void;
  pageData: any;
  juzNumber: number;
  hizbData: { hizb: number, quarterText: string };
}

const TopToolbar: React.FC<TopToolbarProps> = ({ onSearchClick, onBookmarkClick, pageData, juzNumber, hizbData }) => {
    const { setView } = useApp();
    const surahNames = pageData ? Object.keys(pageData.verses_by_sura).join(' - ') : '';
    const pageNumber = pageData ? pageData.page_index.toLocaleString('ar-EG') : '';
    
    const formattedHizb = hizbData.hizb.toLocaleString('ar-EG');
    const formattedJuz = juzNumber.toLocaleString('ar-EG');

  return (
    <div className="absolute top-0 left-0 right-0 h-16 bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-2 sm:px-4 z-20">
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        <button onClick={() => setView(View.Settings)} className="p-2 text-gray-600 hover:text-emerald-500 transition-colors" aria-label="Settings">
          <SettingsIcon className="w-6 h-6" />
        </button>
        <button onClick={onBookmarkClick} className="p-2 text-gray-600 hover:text-emerald-500 transition-colors" aria-label="Bookmarks">
          <BookmarkIcon className="w-6 h-6" />
        </button>
      </div>

      <button onClick={onSearchClick} className="flex-grow mx-2 h-11 bg-gray-100 rounded-lg flex items-center justify-between px-3 py-1 shadow-inner hover:bg-gray-200 transition-colors" aria-label="Search Quran">
        <SearchIcon className="w-5 h-5 text-gray-400" />
        <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-800">{surahNames}</span>
            <span className="text-xs text-gray-500">
                صفحة {pageNumber} | جزء {formattedJuz} | حزب {formattedHizb} {hizbData.quarterText}
            </span>
        </div>
      </button>

      <button onClick={() => setView(View.Dashboard)} className="p-2 text-gray-600 hover:text-emerald-500 transition-colors" aria-label="Open Dashboard">
        <HamburgerIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default TopToolbar;
