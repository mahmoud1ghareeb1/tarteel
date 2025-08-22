
import React, { useState, useRef } from 'react';
import { 
    ChevronUpIcon, PlayIcon, MicrophoneIcon, XIcon, EyeIcon, 
    LockClosedIcon, ChevronRightIcon, ChevronLeftIcon,
    ChevronDoubleLeftIcon, ChevronDoubleRightIcon
} from './icons';

interface BottomToolbarProps {
  onDisplaySettingsClick: () => void;
  onAudioSettingsClick: () => void;
  isListening: boolean;
  onListenClick: () => void;
  isHifdhModeActive: boolean;
  onToggleHifdhMode: () => void;
  onRevealNextWord: () => void;
  onRevealNextAyah: () => void;
  onRevealPreviousWord: () => void;
  onRevealPreviousAyah: () => void;
  liveTranscript?: string;
}

const BottomToolbar: React.FC<BottomToolbarProps> = ({ 
    onDisplaySettingsClick, onAudioSettingsClick, isListening, onListenClick,
    isHifdhModeActive, onToggleHifdhMode, onRevealNextWord, onRevealNextAyah,
    onRevealPreviousWord, onRevealPreviousAyah, liveTranscript
}) => {
    const [showReciteOptions, setShowReciteOptions] = useState(false);
    const longPressTimer = useRef<number | null>(null);
    const isLongPress = useRef(false);

    const handleMicPressStart = () => {
        isLongPress.current = false;
        longPressTimer.current = window.setTimeout(() => {
            if (!isListening) {
                isLongPress.current = true;
                setShowReciteOptions(true);
            }
        }, 400);
    };

    const handleMicPressEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };
    
    const handleMicClick = () => {
        if (showReciteOptions) {
            setShowReciteOptions(false);
            return;
        }
        if (!isLongPress.current) {
            onListenClick();
        }
    };

    const handleReciteOptionClick = () => {
        setShowReciteOptions(false);
        onListenClick();
    };
    
    const handleListenOptionClick = () => {
        setShowReciteOptions(false);
        onAudioSettingsClick();
    };

    if (isHifdhModeActive) {
        return (
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-center z-20" style={{ pointerEvents: 'none' }}>
                <div className="bg-gray-800 text-white rounded-full px-4 py-2 text-sm mb-2" style={{ pointerEvents: 'auto' }}>
                    الآيات المخفية: مفعل
                </div>
                <div className="w-full max-w-sm h-16 bg-white bg-opacity-95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-evenly px-2" style={{ pointerEvents: 'auto' }}>
                    <button onClick={onRevealPreviousAyah} className="p-3 rounded-full hover:bg-gray-200 text-gray-700" aria-label="الآية السابقة"><ChevronDoubleRightIcon className="w-6 h-6" /></button>
                    <button onClick={onRevealPreviousWord} className="p-3 rounded-full hover:bg-gray-200 text-gray-700" aria-label="الكلمة السابقة"><ChevronRightIcon className="w-6 h-6" /></button>
                    <button onClick={onToggleHifdhMode} className="p-3 rounded-full bg-gray-100 text-gray-700" aria-label="إظهار الآيات"><LockClosedIcon className="w-6 h-6" /></button>
                    <button onClick={onRevealNextWord} className="p-3 rounded-full hover:bg-gray-200 text-gray-700" aria-label="الكلمة التالية"><ChevronLeftIcon className="w-6 h-6" /></button>
                    <button onClick={onRevealNextAyah} className="p-3 rounded-full hover:bg-gray-200 text-gray-700" aria-label="الآية التالية"><ChevronDoubleLeftIcon className="w-6 h-6" /></button>
                </div>
            </div>
        );
    }

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center items-end z-20" style={{ pointerEvents: 'none' }}>
        <div className="relative w-full max-w-sm" style={{ pointerEvents: 'auto' }}>
             {isListening && (
                <div className="absolute bottom-full left-0 right-0 mb-2 px-2">
                    <div className="bg-white rounded-xl shadow-lg p-3 text-right">
                        <div className="flex items-center justify-end text-gray-500 text-sm mb-2">
                            يتم الاستماع...
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-2"></div>
                        </div>
                        <p className="font-semibold text-lg" dir="rtl">{liveTranscript || "..."}</p>
                    </div>
                </div>
            )}
            {showReciteOptions && (
                 <>
                    <div className="absolute inset-x-0 bottom-full mb-6" onClick={() => setShowReciteOptions(false)}>
                        <div className="flex justify-center items-center gap-10">
                             <button onClick={(e) => { e.stopPropagation(); handleListenOptionClick(); }} className="flex flex-col items-center gap-2 text-gray-700">
                                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                    <PlayIcon className="w-8 h-8"/>
                                 </div>
                                 <span className="font-semibold">استمع</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleReciteOptionClick(); }} className="flex flex-col items-center gap-2 text-gray-700">
                                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                    <MicrophoneIcon className="w-8 h-8"/>
                                 </div>
                                 <span className="font-semibold">تلاوة</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
            <div className="w-full h-16 bg-white bg-opacity-90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-between px-2">
                <div className="flex items-center space-x-2">
                    <button onClick={onDisplaySettingsClick} className="p-3 rounded-full hover:bg-gray-200">
                        <ChevronUpIcon className="w-6 h-6 text-gray-700" />
                    </button>
                     <button onClick={onAudioSettingsClick} className="p-3 rounded-full hover:bg-gray-200">
                        <PlayIcon className="w-6 h-6 text-gray-700" />
                    </button>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                     <button 
                        onClick={handleMicClick}
                        onMouseDown={handleMicPressStart}
                        onMouseUp={handleMicPressEnd}
                        onTouchStart={handleMicPressStart}
                        onTouchEnd={handleMicPressEnd}
                        onMouseLeave={handleMicPressEnd}
                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all -translate-y-4 border-4 border-white ${isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`}>
                        {isListening ? <XIcon className="w-8 h-8 text-white"/> : <MicrophoneIcon className="w-10 h-10 text-white" />}
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={onToggleHifdhMode} className="p-3 rounded-full hover:bg-gray-200">
                        <EyeIcon className="w-6 h-6 text-gray-700" />
                    </button>
                    <div className="flex items-center space-x-1 text-sm text-gray-700 bg-gray-100 rounded-full px-3 py-1.5">
                        <span>١.٠x</span>
                        <span>ص</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default BottomToolbar;
