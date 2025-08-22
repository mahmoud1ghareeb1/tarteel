
import React from 'react';
import { useApp } from '../App';
import { View } from '../types';
import { ChevronRightIcon, ChevronLeftIcon, MicrophoneIcon, BookOpenIcon, GlobeAltIcon, MoonIcon, BellIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline'; // Using heroicons for variety

const Settings: React.FC = () => {
    const { setView } = useApp();

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100" dir="rtl">
        <header className="bg-white p-4 flex justify-between items-center border-b sticky top-0">
            <div className="w-8"></div>
            <h1 className="font-bold text-xl">الإعدادات</h1>
            <button onClick={() => setView(View.Dashboard)}>
                <ChevronLeftIcon className="w-8 h-8 text-gray-700"/>
            </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="p-4 bg-white rounded-lg flex items-center">
                <div className="w-20 h-12 bg-blue-200 rounded-lg ml-4"></div>
                <div>
                    <p className="font-semibold">ابدأ رحلتك مع ترتيل</p>
                    <p className="text-sm text-gray-500">ابدأ بتعلم كيفية استخدام التطبيق بأفضل طريقة</p>
                    <button className="mt-2 text-sm text-blue-500 font-semibold">عرض الدروس</button>
                </div>
            </div>
            
            <SettingsSection title="التجربة">
                <SettingsItem title="التلاوة" icon={<MicrophoneIcon className="w-6 h-6 text-gray-500"/>} />
                <SettingsItem title="الاستماع" icon={<SpeakerWaveIcon className="w-6 h-6 text-gray-500"/>} />
            </SettingsSection>
            
            <SettingsSection title="مظهر القرآن">
                <SettingsItem title="هيئة المصحف" icon={<BookOpenIcon className="w-6 h-6 text-gray-500"/>} />
                <SettingsItem title="الآيات المخفية" icon={<div className="w-6 h-6 text-gray-500">...</div>} />
                <SettingsItem title="تحديد" icon={<div className="w-6 h-6 text-gray-500">🖊️</div>} />
            </SettingsSection>
            
            <SettingsSection title="مظهر التطبيق">
                <SettingsItem title="اللغة" icon={<GlobeAltIcon className="w-6 h-6 text-gray-500"/>} />
                <SettingsItem title="الوضع الليلي" icon={<MoonIcon className="w-6 h-6 text-gray-500"/>} />
            </SettingsSection>

            <SettingsSection title="إشعارات">
                <SettingsItem title="تذكيرات" icon={<BellIcon className="w-6 h-6 text-gray-500"/>} />
            </SettingsSection>

             <SettingsSection title="الخصوصية">
                <SettingsItem title="استخدام البيانات" />
                <SettingsItem title="حذف جميع التسجيلات" isDestructive={true} />
            </SettingsSection>

        </main>
    </div>
  );
};

const SettingsSection: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div>
        <h2 className="px-4 pb-2 font-bold text-gray-600">{title}</h2>
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {children}
        </div>
    </div>
);

interface SettingsItemProps {
    title: string;
    icon?: React.ReactNode;
    isDestructive?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({title, icon, isDestructive = false}) => (
    <button className="w-full flex items-center justify-between text-right p-4 border-b last:border-b-0 hover:bg-gray-50">
        <div className="flex items-center">
            {icon && <div className="ml-4">{icon}</div>}
            <span className={`font-semibold ${isDestructive ? 'text-red-500' : 'text-gray-800'}`}>{title}</span>
        </div>
        {!isDestructive && <ChevronRightIcon className="w-5 h-5 text-gray-400 transform -rotate-180" />}
    </button>
);


export default Settings;
