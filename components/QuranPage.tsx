import React, { useRef, useMemo } from 'react';
import { quranData } from '../data/quran';
import { surahs } from '../data/surahs';
import SurahHeader from './SurahHeader';

interface QuranPageProps {
    pageIndex: number;
    selectedVerse: { suraName: string, ayahNumber: number } | null;
    onVerseLongPress: (suraName: string, ayahNumber: number, surahNumber: number) => void;
    
    currentlyPlayingVerse: { suraName: string, ayahNumber: number } | null;

    isHifdhModeActive: boolean;
    revealedWordCount: { [key: string]: number };
    
    recitingAyah: { suraName: string, ayahNumber: number } | null;
    
    // New props for word-by-word tracking
    trackedVerseKey: string | null;
    trackedWordIndex: number;
    mistakes: Array<{verseKey: string, wordIndex: number}>;
}

const QuranPage: React.FC<QuranPageProps> = ({
    pageIndex,
    selectedVerse,
    onVerseLongPress,
    currentlyPlayingVerse,
    isHifdhModeActive,
    revealedWordCount,
    recitingAyah,
    trackedVerseKey,
    trackedWordIndex,
    mistakes
}) => {
    const pageData = quranData.find(p => p.page_index === pageIndex);
    const longPressTimer = useRef<number | null>(null);

    const mistakeMap = useMemo(() => {
        const map: { [key: string]: { [key: number]: boolean } } = {};
        mistakes.forEach(m => {
            if (!map[m.verseKey]) map[m.verseKey] = {};
            map[m.verseKey][m.wordIndex] = true;
        });
        return map;
    }, [mistakes]);

    const handlePressStart = (suraName: string, ayahNumber: number, surahNumber: number) => {
        longPressTimer.current = window.setTimeout(() => {
            onVerseLongPress(suraName, ayahNumber, surahNumber);
        }, 500);
    };

    const handlePressEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };

    if (!pageData) {
        return <div className="p-8 text-center">Page not found</div>;
    }

    const getSurahNumber = (suraName: string) => {
        const surahInfo = surahs.find(s => s.name === suraName);
        return surahInfo ? surahInfo.number : 0;
    };

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <div className="quran-text text-2xl md:text-3xl lg:text-4xl leading-loose md:leading-loose lg:leading-loose text-right" style={{ lineHeight: '2.5' }}>
                {Object.entries(pageData.verses_by_sura).map(([suraName, suraVerses]) => (
                    <div key={suraName}>
                        {suraVerses.some(v => v.index === 1) && <SurahHeader surahName={suraName} />}
                        {suraVerses.map(verse => {
                            if (verse.index === 0) {
                                return <p key={`${suraName}-bismillah`} className="text-center font-bold text-lg my-4">{verse.text}</p>;
                            }

                            const verseKey = `${suraName}-${verse.index}`;
                            const isSelected = selectedVerse?.suraName === suraName && selectedVerse?.ayahNumber === verse.index;
                            const isPlaying = currentlyPlayingVerse?.suraName === suraName && currentlyPlayingVerse?.ayahNumber === verse.index;
                            const isRecitingVerse = trackedVerseKey === verseKey;
                            
                            const words = verse.text.split(' ');
                            const totalWords = words.length;
                            const revealedCount = isHifdhModeActive ? (revealedWordCount[verseKey] || 0) : totalWords;

                            return (
                                <div
                                    key={verseKey}
                                    className={`inline rounded-md transition-colors duration-300
                                        ${isSelected ? 'bg-emerald-100' : ''}
                                        ${isPlaying ? 'bg-yellow-100' : ''}
                                        ${isRecitingVerse ? 'bg-emerald-100' : ''}
                                    `}
                                    onMouseDown={() => handlePressStart(suraName, verse.index, getSurahNumber(suraName))}
                                    onMouseUp={handlePressEnd}
                                    onMouseLeave={handlePressEnd}
                                    onTouchStart={() => handlePressStart(suraName, verse.index, getSurahNumber(suraName))}
                                    onTouchEnd={handlePressEnd}
                                >
                                    {words.map((word, wordIndex) => {
                                        const isWordRevealed = wordIndex < revealedCount;
                                        const isCurrentTrackedWord = isRecitingVerse && wordIndex === trackedWordIndex;
                                        const isMistake = mistakeMap[verseKey]?.[wordIndex];

                                        return (
                                            <span key={wordIndex} className={`transition-colors duration-200 rounded-sm
                                                ${!isWordRevealed ? 'text-transparent bg-gray-300' : ''}
                                                ${isCurrentTrackedWord ? 'bg-emerald-300' : ''}
                                                ${isMistake ? 'bg-red-200' : ''}
                                            `}>
                                                {word}{' '}
                                            </span>
                                        );
                                    })}
                                    <span className="text-lg font-bold text-emerald-600 border border-emerald-500 rounded-full px-2 mx-1" style={{ display: 'inline-block', lineHeight: 'normal' }}>
                                        {verse.index.toLocaleString('ar-EG')}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuranPage;