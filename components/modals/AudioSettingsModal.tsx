import React from 'react';
import { ChevronDownIcon, ArrowDownTrayIcon, PlayIcon } from '../icons';

interface AudioSettingsModalProps {
  onClose: () => void;
  onStartPlayback: () => void;
}

const RadioButtonGroup: React.FC<{ options: string[], selected: string }> = ({ options, selected }) => (
    <div className="grid grid-cols-4 gap-2">
        {options.map(option => (
            <button key={option} className={`py-2 px-3 rounded-md text-sm font-semibold border ${selected === option ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300'}`}>
                {option}
            </button>
        ))}
    </div>
);

const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ onClose, onStartPlayback }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-t-2xl p-4" dir="rtl">
        <div className="text-center mb-4">
             <div className="inline-block w-10 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
      <h2 className="font-bold text-xl text-center mb-6">إعدادات التشغيل الصوتي</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">حدد الآيات</label>
          <div className="flex space-x-3 rtl:space-x-reverse">
            <div className="w-1/2 relative">
              <select className="w-full appearance-none bg-gray-100 border border-gray-200 rounded-md py-2 px-3 text-right">
                <option>بدء من الآية - الإسراء - ١٧:١٠٥</option>
              </select>
              <ChevronDownIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="w-1/2 relative">
              <select className="w-full appearance-none bg-gray-100 border border-gray-200 rounded-md py-2 px-3 text-right">
                <option>إنتهاء عند الآية - الناس - ١١٤:٦</option>
              </select>
              <ChevronDownIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">القارئ</label>
            <div className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-md py-2 px-3">
                <div className="flex items-center">
                    <span className="font-semibold">محمود الحصري (مجوّد)</span>
                    <button className="mr-3 text-emerald-500"><ArrowDownTrayIcon className="w-5 h-5"/></button>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </div>
        </div>

        <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">سرعة التلاوة</label>
            <RadioButtonGroup options={['x٠.٥', 'x٠.٧٥', 'x١', 'x١.٢٥', 'x١.٥']} selected="x١" />
        </div>
        <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">كرر كل آية</label>
            <RadioButtonGroup options={['مرة', 'مرتين', '٣ مرات', 'لانهائي']} selected="مرة" />
        </div>
        <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">كرر الآيات</label>
            <RadioButtonGroup options={['مرة', 'مرتين', '٣ مرات', 'لانهائي']} selected="مرة" />
        </div>

        <div className="pt-4">
             <button onClick={onStartPlayback} className="w-full bg-gray-900 text-white rounded-full py-3 font-bold text-lg flex items-center justify-center">
                <PlayIcon className="w-6 h-6 ml-2" />
                <span>تشغيل التلاوة</span>
             </button>
        </div>
      </div>
    </div>
  );
};

export default AudioSettingsModal;
