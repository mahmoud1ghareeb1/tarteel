import React from 'react';
import {
    XIcon,
    PlayIcon,
    TranslateIcon,
    BookOpenIcon,
    BookmarkIcon,
    DocumentDuplicateIcon,
    ClipboardIcon,
    ShareIcon
} from '../icons';

interface AyahActionsModalProps {
  onClose: () => void;
  selectedVerse: { suraName: string; ayahNumber: number; surahNumber: number; };
  onBookmark: () => void;
  onCopy: () => void;
  onShare: () => void;
}

const AyahActionsModal: React.FC<AyahActionsModalProps> = ({ onClose, selectedVerse, onBookmark, onCopy, onShare }) => {
  const actionItems = [
    { label: 'استمع', icon: <PlayIcon className="w-6 h-6" />, action: () => {} },
    { label: 'ترجمة', icon: <TranslateIcon className="w-6 h-6" />, action: () => {} },
    { label: 'تفسير', icon: <BookOpenIcon className="w-6 h-6" />, action: () => {} },
    { label: 'أضف إشارة مرجعية', icon: <BookmarkIcon className="w-6 h-6" />, action: onBookmark },
    { label: 'المتشابهات', icon: <DocumentDuplicateIcon className="w-6 h-6" />, action: () => {} },
    { label: 'نسخ', icon: <ClipboardIcon className="w-6 h-6" />, action: onCopy },
    { label: 'شارك', icon: <ShareIcon className="w-6 h-6" />, action: onShare },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-t-2xl p-4" dir="rtl">
      <header className="flex justify-between items-center mb-4 pb-2 border-b">
        <h2 className="font-bold text-lg">{selectedVerse.suraName} - الآية {selectedVerse.ayahNumber}</h2>
        <button onClick={onClose} className="p-2 text-gray-500">
          <XIcon className="w-6 h-6" />
        </button>
      </header>
      <ul className="space-y-1">
        {actionItems.map(item => (
          <li key={item.label}>
            <button onClick={item.action} className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 text-right">
              <span className="font-semibold">{item.label}</span>
              <div className="text-gray-600 mr-auto">{item.icon}</div>
            </button>
          </li>
        ))}
         <li className="p-3 mt-2">
            <div className="bg-gray-50 p-3 rounded-lg text-center text-gray-500">
                لا توجد آيات متشابهة
            </div>
        </li>
      </ul>
    </div>
  );
};

export default AyahActionsModal;
