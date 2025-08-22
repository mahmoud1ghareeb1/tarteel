import React, { useState } from 'react';
import { useApp } from '../App';
import { View, DashboardTab } from '../types';
import { TarteelLogo, SettingsIcon, InfoIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon, BookOpenIcon, HistoryIcon } from './icons';

const Dashboard: React.FC = () => {
    const { setView } = useApp();
    const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.Main);
    
    const renderTabContent = () => {
        switch(activeTab) {
            case DashboardTab.Main:
                return <MainDashboardContent />;
            case DashboardTab.Goals:
                return <GoalsContent />;
            case DashboardTab.Hifdh:
                return <HifdhContent />;
            case DashboardTab.Activity:
                return <ActivityContent />;
            case DashboardTab.Community:
                return <CommunityContent />;
            default:
                return <div className="p-4 text-center text-gray-500">محتوى "{DashboardTab[activeTab]}" غير متوفر بعد.</div>;
        }
    }

    return (
        <div className="h-screen w-full flex flex-col bg-gray-50" dir="rtl">
            <header className="bg-white p-4 flex justify-between items-center border-b">
                 <div className="flex items-center space-x-4">
                    <button onClick={() => setView(View.Settings)}><SettingsIcon className="w-6 h-6 text-gray-600" /></button>
                    {/* User Profile */}
                </div>
                <TarteelLogo className="w-8 h-8"/>
                <button onClick={() => setView(View.Reader)} className="font-bold text-emerald-500">
                    <ChevronLeftIcon className="w-8 h-8" />
                </button>
            </header>
            
            <nav className="bg-white border-b sticky top-0 z-10">
                <div className="flex justify-around">
                    <DashboardTabButton text="اللوحة الرئيسية" tab={DashboardTab.Main} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <DashboardTabButton text="الأهداف" tab={DashboardTab.Goals} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <DashboardTabButton text="الحفظ" tab={DashboardTab.Hifdh} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <DashboardTabButton text="نشاط" tab={DashboardTab.Activity} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <DashboardTabButton text="المجتمع" tab={DashboardTab.Community} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            </nav>

            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {renderTabContent()}
            </main>
        </div>
    );
};

const DashboardTabButton: React.FC<{text: string, tab: DashboardTab, activeTab: DashboardTab, setActiveTab: (tab: DashboardTab) => void}> = ({ text, tab, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`py-3 px-2 font-semibold text-sm ${activeTab === tab ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-500'}`}
    >
        {text}
    </button>
);

const MainDashboardContent = () => (
    <>
        <div className="bg-blue-500 text-white rounded-lg p-4 text-center">
            <p className="font-bold">سلام Mahmoud..Gh!</p>
            <p className="text-sm">هناك ٧ أيام متبقية في الإصدار التجريبي المجاني من ترتيل Premium.</p>
        </div>
        <Card title="الأشياء المهمة">
            <div className="flex items-start justify-between">
                <div>
                    <p>المداومة</p>
                    <p className="font-bold text-lg">١ يوم</p>
                </div>
                <div className="flex items-center space-x-2">
                    <InfoIcon className="w-5 h-5 text-gray-400"/>
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
            </div>
             <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm">أهداف - الشارات المحصلة</p>
                <div className="flex items-center mt-2">
                    <div className="w-12 h-12 bg-blue-200 rounded-lg mr-3"></div>
                    <p className="font-semibold">تعديل</p>
                </div>
             </div>
        </Card>
        <Card title="أهداف اليوم" actionText="إظهار الكل">
            <button className="w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-semibold">
                + ابدأ هدف جديد
            </button>
        </Card>
        <Card title="مجموعاتي" actionText="إظهار الكل">
             <div className="text-center">
                 <p className="text-lg mb-2">وَفِي ذَٰلِكَ فَلْيَتَنَافَسِ الْمُتَنَافِسُونَ <span className="text-gray-500">(سورة المطففين: ٢٦)</span></p>
                 <p className="text-sm text-gray-600 mb-4">انضم إلى مجموعة أو ابدأ واحدة وتنافس مع عائلتك وأصدقائك لمعرفة من يقرأ أكثر على لوحة المتصدرين. استمتع بالتحفيز والحسنات عند القراءة معًا!</p>
                 <div className="flex justify-center space-x-3">
                     <button className="bg-white border border-gray-300 rounded-full px-6 py-2 font-semibold">انضم إلى مجموعة</button>
                     <button className="bg-emerald-400 text-white rounded-full px-6 py-2 font-semibold">أنشئ مجموعة</button>
                 </div>
             </div>
        </Card>
    </>
);

const ActivityContent = () => (
    <>
        <Card title="المداومة">
            <div className="flex justify-between items-center mb-4">
                <ChevronRightIcon className="w-6 h-6" />
                <span className="font-bold">١ يوم</span>
                <ChevronLeftIcon className="w-6 h-6" />
            </div>
            <p className="text-center text-sm text-gray-500">تاريخ الجلسات</p>
        </Card>
        <Card title="إنجازات" actionText="إظهار الكل">
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                        <div className="w-12 h-12 bg-blue-200 rounded-full"></div>
                    </div>
                    <p className="text-sm font-semibold">ابدأ في الحفظ</p>
                </div>
                <div>
                    <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                         <div className="w-12 h-12 bg-orange-200 rounded-full"></div>
                    </div>
                    <p className="text-sm font-semibold">مداوم ١</p>
                </div>
                 <div>
                    <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                         <div className="w-12 h-12 bg-purple-200 rounded-full"></div>
                    </div>
                    <p className="text-sm font-semibold">تعديل</p>
                </div>
            </div>
        </Card>
        <Card title="تعقب حالة النشاط">
            <div className="h-32 bg-gray-100 rounded-lg p-2 flex items-end">
                <div className="w-full h-1/3 bg-emerald-200 rounded-sm"></div>
            </div>
        </Card>
    </>
);

const GoalsContent = () => (
    <>
        <Card title="أهدافي الأسبوعية">
             <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <PlayIcon className="w-6 h-6 text-emerald-500 ml-3" />
                        <div>
                            <p className="font-semibold">القراءة لمدة 15 دقيقة</p>
                            <p className="text-sm text-gray-500">تم تحقيق ٠/٥ أيام</p>
                        </div>
                    </div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full"><div className="w-1/5 h-full bg-emerald-500 rounded-full"></div></div>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <BookOpenIcon className="w-6 h-6 text-blue-500 ml-3" />
                        <div>
                            <p className="font-semibold">قراءة 10 صفحات</p>
                            <p className="text-sm text-gray-500">تم تحقيق ٢/٣ أيام</p>
                        </div>
                    </div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full"><div className="w-2/3 h-full bg-blue-500 rounded-full"></div></div>
                </div>
             </div>
        </Card>
        <Card title="إنشاء هدف جديد">
            <p className="text-center text-gray-600">اختر من الأهداف المقترحة أو أنشئ هدفك الخاص.</p>
             <button className="mt-4 w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-semibold">
                + ابدأ هدف جديد
            </button>
        </Card>
    </>
);

const HifdhContent = () => (
    <>
         <Card title="خطة الحفظ الخاصة بي">
            <div className="text-center text-gray-500 p-4">
                <p>لم تبدأ أي خطة حفظ بعد.</p>
                 <button className="mt-4 bg-emerald-400 text-white rounded-full px-6 py-2 font-semibold">
                    أنشئ خطة حفظ
                </button>
            </div>
         </Card>
         <Card title="مراجعاتي اليومية">
             <div className="p-4 bg-gray-100 rounded-lg text-center">
                 <p className="font-semibold">سورة الكهف</p>
                 <p className="text-sm text-gray-500">آية ١ - ١٠</p>
                 <button className="mt-2 text-sm text-emerald-600 font-semibold">ابدأ المراجعة</button>
             </div>
         </Card>
    </>
);

const CommunityContent = () => (
    <>
        <Card title="لوحة المتصدرين - أصدقائي">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="font-bold ml-3">١.</span>
                        <div className="w-10 h-10 bg-blue-200 rounded-full ml-3"></div>
                        <p>أحمد</p>
                    </div>
                    <p className="font-semibold">٥٠ صفحة</p>
                </div>
                <div className="flex items-center justify-between bg-emerald-50 p-2 rounded-lg">
                    <div className="flex items-center">
                        <span className="font-bold ml-3">٢.</span>
                        <div className="w-10 h-10 bg-orange-200 rounded-full ml-3"></div>
                        <p>أنت</p>
                    </div>
                    <p className="font-semibold">٣٥ صفحة</p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="font-bold ml-3">٣.</span>
                        <div className="w-10 h-10 bg-purple-200 rounded-full ml-3"></div>
                        <p>فاطمة</p>
                    </div>
                    <p className="font-semibold">٢٠ صفحة</p>
                </div>
            </div>
        </Card>
        <Card title="مجموعاتي" actionText="إظهار الكل">
             <div className="text-center">
                 <p className="text-lg mb-2">وَفِي ذَٰلِكَ فَلْيَتَنَافَسِ الْمُتَنَافِسُونَ</p>
                 <div className="flex justify-center space-x-3 rtl:space-x-reverse">
                     <button className="bg-white border border-gray-300 rounded-full px-6 py-2 font-semibold">انضم إلى مجموعة</button>
                     <button className="bg-emerald-400 text-white rounded-full px-6 py-2 font-semibold">أنشئ مجموعة</button>
                 </div>
             </div>
        </Card>
    </>
);


const Card: React.FC<{title: string, actionText?: string, children: React.ReactNode}> = ({title, actionText, children}) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">{title}</h2>
            {actionText && <button className="text-emerald-500 font-semibold text-sm">{actionText}</button>}
        </div>
        {children}
    </div>
);


export default Dashboard;