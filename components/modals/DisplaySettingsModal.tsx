
import React from 'react';
import { CloseIcon, BookOpenIcon, TranslateIcon, ChevronLeftIcon } from '../icons';

interface DisplaySettingsModalProps {
  onClose: () => void;
}

const DisplaySettingsModal: React.FC<DisplaySettingsModalProps> = ({ onClose }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-t-2xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">تنسيق المصحف</h2>
        <button onClick={onClose} className="p-2 text-gray-500">
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">وضع القراءة</h3>
          <div className="bg-gray-100 rounded-lg p-3 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                    <BookOpenIcon className="w-6 h-6 text-emerald-500 mr-3" />
                    <div>
                        <p className="font-semibold">مصحف</p>
                        <p className="text-sm text-gray-500">المصحف المدني (١٤٠٥)</p>
                    </div>
                </div>
                <input type="radio" name="reading-mode" className="form-radio h-5 w-5 text-emerald-500" defaultChecked />
            </label>
            <div className="border-t border-gray-200"></div>
            <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                    <div className="w-6 h-6 text-emerald-500 mr-3 text-center text-xl font-bold">نص</div>
                    <div>
                        <p className="font-semibold">نص قرآني</p>
                        <p className="text-sm text-gray-500">نص قرآني قابل لتغيير الحجم</p>
                    </div>
                </div>
                <input type="radio" name="reading-mode" className="form-radio h-5 w-5 text-emerald-500" />
            </label>
             <div className="border-t border-gray-200"></div>
            <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                    <TranslateIcon className="w-6 h-6 text-emerald-500 mr-3" />
                    <div>
                        <p className="font-semibold">ترجمة / نقل صوتي بالحروف اللاتينية</p>
                        <p className="text-sm text-gray-500">Dr. Mustafa Khattab, The Clear Quran</p>
                    </div>
                </div>
                <input type="radio" name="reading-mode" className="form-radio h-5 w-5 text-emerald-500" />
            </label>
          </div>
        </div>

        <button className="w-full flex justify-between items-center text-right py-3 px-3 bg-gray-100 rounded-lg">
            <div>
              <p className="font-semibold">تنسيق المصحف وخطه</p>
              <p className="text-sm text-gray-500">اختر المصحف الذي تود استخدامه</p>
            </div>
            <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default DisplaySettingsModal;
