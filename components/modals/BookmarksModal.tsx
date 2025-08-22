import React from 'react';
import { XIcon, BookmarkIcon } from '../icons';
import { useApp } from '../../App';
import { Bookmark } from '../../types';

interface BookmarksModalProps {
  onClose: () => void;
  onNavigate: (page: number) => void;
}

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);


const BookmarksModal: React.FC<BookmarksModalProps> = ({ onClose, onNavigate }) => {
  const { bookmarks, removeBookmark } = useApp();

  const handleNavigate = (page: number) => {
    onNavigate(page);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col h-full" dir="rtl">
      <header className="p-4 bg-white border-b flex justify-between items-center sticky top-0">
        <div className="w-8"></div>
        <h1 className="font-bold text-xl flex items-center">
            <BookmarkIcon className="w-6 h-6 ml-2 text-emerald-500" />
            الإشارات المرجعية
        </h1>
        <button onClick={onClose}>
          <XIcon className="w-6 h-6 text-gray-700" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        {bookmarks.length > 0 ? (
            <ul>
                {bookmarks.map((bookmark) => (
                    <li key={bookmark.timestamp} className="border-b">
                        <div className="p-4 flex justify-between items-center hover:bg-gray-100">
                            <div onClick={() => handleNavigate(bookmark.pageNumber)} className="flex-grow cursor-pointer">
                                <p className="font-semibold text-lg">{bookmark.surahName} : {bookmark.ayahNumber}</p>
                                <p className="text-sm text-gray-500">صفحة {bookmark.pageNumber}</p>
                            </div>
                            <button onClick={() => removeBookmark(bookmark.timestamp)} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
                                <TrashIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="text-center p-8 text-gray-500 flex flex-col items-center justify-center h-full">
                <BookmarkIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold mb-2">لا توجد إشارات مرجعية</h2>
                <p>يمكنك إضافة إشارة مرجعية عن طريق تحديد آية والضغط على زر الإشارة المرجعية.</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default BookmarksModal;
