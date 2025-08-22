// --- Start of SpeechRecognition type definitions ---
interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onend: () => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    start: () => void;
    stop: () => void;
}

interface SpeechRecognitionStatic {
    new(): SpeechRecognition;
}

declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionStatic;
        webkitSpeechRecognition: SpeechRecognitionStatic;
    }
}
// --- End of SpeechRecognition type definitions ---

import React, { useState, useEffect, useRef, useMemo } from 'react';
import TopToolbar from './TopToolbar';
import BottomToolbar from './BottomToolbar';
import QuranPage from './QuranPage';
import ModalWrapper from './modals/ModalWrapper';
import SearchModal from './modals/SearchModal';
import DisplaySettingsModal from './modals/DisplaySettingsModal';
import AudioSettingsModal from './modals/AudioSettingsModal';
import MistakeReportModal from './modals/MistakeReportModal';
import BookmarksModal from './modals/BookmarksModal';
import AyahActionsModal from './modals/AyahActionsModal';
import { ReaderModal, RecitationReport } from '../types';
import { quranData } from '../data/quran';
import { getJuzForPage, getHizbDataForPage } from '../data/juz';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon, XIcon } from './icons';
import { useApp } from '../App';

type SelectedVerse = { suraName: string; ayahNumber: number; surahNumber: number; };

type PageVerseInfo = {
    key: string;
    suraName: string;
    ayahNumber: number;
    wordCount: number;
};

type Mistake = {verseKey: string, wordIndex: number, expected: string, recited: string};

// Helper to normalize Arabic text for searching and matching
const normalizeArabic = (text: string) => {
    if (!text) return "";
    return text
        .replace(/[\u064B-\u0652]/g, "") // Remove harakat/diacritics
        .replace(/[أإآ]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
};

const QuranReader: React.FC = () => {
    const { addBookmark } = useApp();
    const [activeModal, setActiveModal] = useState<ReaderModal>(ReaderModal.None);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedVerse, setSelectedVerse] = useState<SelectedVerse | null>(null);
    
    // --- Recitation State ---
    const [isListening, setIsListening] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState('');
    const [recitationStatus, setRecitationStatus] = useState<'idle' | 'searching' | 'tracking'>('idle');
    const [recitingAyah, setRecitingAyah] = useState<{ suraName: string; ayahNumber: number; } | null>(null);
    const [trackedVerse, setTrackedVerse] = useState<{
      key: string; suraName: string; ayahNumber: number;
      words: string[]; normalizedWords: string[]; page: number;
    } | null>(null);
    const [trackedWordIndex, setTrackedWordIndex] = useState(0);
    const [mistakes, setMistakes] = useState<Mistake[]>([]);
    const [recitationReport, setRecitationReport] = useState<RecitationReport | null>(null);
    const [processedWordsCount, setProcessedWordsCount] = useState(0);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const pauseTimerRef = useRef<number | null>(null);
    const finalTranscriptRef = useRef<string>('');
    const recitationStatusRef = useRef(recitationStatus);
    recitationStatusRef.current = recitationStatus;
    
    // --- Audio Playback State ---
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [playbackPaused, setPlaybackPaused] = useState(false);
    const [currentlyPlayingVerse, setCurrentlyPlayingVerse] = useState<{suraName: string, ayahNumber: number} | null>(null);
    const audioTimer = useRef<number | null>(null);

    // --- Hifdh Mode State ---
    const [isHifdhModeActive, setIsHifdhModeActive] = useState(false);
    const [revealedWordCount, setRevealedWordCount] = useState<{ [key: string]: number }>({});
    const pageVersesRef = useRef<PageVerseInfo[]>([]);

    const pageData = quranData.find(p => p.page_index === currentPage);
    const juzNumber = getJuzForPage(currentPage);
    const hizbData = getHizbDataForPage(currentPage);

    // Create a flat, searchable list of all verses
    const allVerses = useMemo(() => {
        return quranData.flatMap(page => 
            Object.entries(page.verses_by_sura).flatMap(([suraName, verses]) => 
                verses.filter(v => v.index > 0).map(verse => ({
                    ...verse,
                    suraName,
                    pageNumber: page.page_index,
                    normalizedText: normalizeArabic(verse.text)
                }))
            )
        );
    }, []);

    const findVerseByText = (transcript: string): (typeof allVerses)[0] | null => {
        if (!transcript || transcript.length < 5) return null;
        const normalizedTranscript = normalizeArabic(transcript);

        let bestMatch = null;
        let highestScore = 0;

        for (const verse of allVerses) {
            if (verse.normalizedText.includes(normalizedTranscript)) {
                const score = normalizedTranscript.length / verse.normalizedText.length;
                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = verse;
                }
            }
        }
        return bestMatch;
    };
    
    const handleSearchForRecitedVerse = (transcript: string) => {
        if (!transcript) return;

        const verse = findVerseByText(transcript);
        if (verse) {
            setCurrentPage(verse.pageNumber);
            const verseWords = verse.text.split(' ');
            const newTrackedVerse = {
                key: `${verse.suraName}-${verse.index}`,
                suraName: verse.suraName,
                ayahNumber: verse.index,
                words: verseWords,
                normalizedWords: verseWords.map(normalizeArabic),
                page: verse.pageNumber
            };
            setTrackedVerse(newTrackedVerse);
            setRecitingAyah({ suraName: verse.suraName, ayahNumber: verse.index });
            setTrackedWordIndex(0);
            setMistakes([]);
            setRecitationStatus('tracking');
            setLiveTranscript('');
            finalTranscriptRef.current = '';
        } else {
            setLiveTranscript(`لم يتم العثور على: "${transcript}"`);
             setTimeout(() => {
                setLiveTranscript('');
                finalTranscriptRef.current = '';
             }, 3000);
        }
    };
    
    const stopListening = () => {
        if(recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
        if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        
        const mistakeCount = mistakes.length;
        const totalWordsRecited = processedWordsCount;

        if (recitationStatusRef.current === 'tracking' && (totalWordsRecited > 0 || mistakeCount > 0)) {
            const correctWords = Math.max(0, totalWordsRecited - mistakeCount);
            const accuracy = totalWordsRecited > 0 ? Math.round((correctWords / totalWordsRecited) * 100) : 0;

            const formattedMistakes = mistakes.map(mistake => {
                const verseKeyParts = mistake.verseKey.split('-');
                const suraName = verseKeyParts.slice(0, -1).join('-');
                const ayahNumber = parseInt(verseKeyParts[verseKeyParts.length - 1]);
                const verseText = allVerses.find(v => v.suraName === suraName && v.index === ayahNumber)?.text || '';
                return { ...mistake, suraName, ayahNumber, verseText };
            });

            setRecitationReport({
                accuracy,
                correctWords,
                mistakeCount,
                mistakes: formattedMistakes,
            });
            setActiveModal(ReaderModal.MistakeReport);
        }
        
        setLiveTranscript('');
        finalTranscriptRef.current = '';
        setRecitationStatus('idle');
        setTrackedVerse(null);
        setTrackedWordIndex(0);
        setRecitingAyah(null);
    };

    const processRecitedWords = (recitedWords: string[]) => {
        if (recitedWords.length === 0) return;
        setProcessedWordsCount(prev => prev + recitedWords.length);

        setTrackedVerse(currentVerseState => {
            if (!currentVerseState) return null;
    
            let currentVerse = { ...currentVerseState };
            let currentWordIdx = trackedWordIndex;
    
            for (const recitedWord of recitedWords) {
                if (!recitedWord) continue;
                const normalizedRecited = normalizeArabic(recitedWord);
                if (!normalizedRecited) continue;
    
                if (currentWordIdx >= currentVerse.normalizedWords.length) continue;
    
                const expectedWord = currentVerse.normalizedWords[currentWordIdx];
    
                if (expectedWord.includes(normalizedRecited) || normalizedRecited.includes(expectedWord)) {
                    // Match
                } else {
                    setMistakes(prev => [...prev, {
                        verseKey: currentVerse.key,
                        wordIndex: currentWordIdx,
                        expected: currentVerse.words[currentWordIdx],
                        recited: recitedWord
                    }]);
                }
                currentWordIdx++;
    
                if (currentWordIdx >= currentVerse.normalizedWords.length) {
                    const currentGlobalIndex = allVerses.findIndex(v => v.suraName === currentVerse.suraName && v.index === currentVerse.ayahNumber);
                    const nextVerseData = allVerses[currentGlobalIndex + 1];
    
                    if (nextVerseData) {
                        if (nextVerseData.pageNumber !== currentPage) {
                            setCurrentPage(nextVerseData.pageNumber);
                        }
                        const verseWords = nextVerseData.text.split(' ');
                        currentVerse = {
                            key: `${nextVerseData.suraName}-${nextVerseData.index}`,
                            suraName: nextVerseData.suraName,
                            ayahNumber: nextVerseData.index,
                            words: verseWords,
                            normalizedWords: verseWords.map(normalizeArabic),
                            page: nextVerseData.pageNumber
                        };
                        currentWordIdx = 0;
                        setRecitingAyah({ suraName: nextVerseData.suraName, ayahNumber: nextVerseData.index });
                    } else {
                        stopListening();
                        return null; 
                    }
                }
            }
            setTrackedWordIndex(currentWordIdx);
            return currentVerse;
        });
    };
    
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ar-SA';
        recognitionRef.current = recognition;

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            for (let i = 0; i < event.results.length; ++i) {
                const transcriptPart = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptPart + ' ';
                } else {
                    interimTranscript = transcriptPart;
                }
            }
            finalTranscript = finalTranscript.trim();

            if (recitationStatusRef.current === 'searching') {
                finalTranscriptRef.current = finalTranscript;
                setLiveTranscript(finalTranscriptRef.current + ' ' + interimTranscript);
                if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
                if (finalTranscript) {
                    pauseTimerRef.current = window.setTimeout(() => {
                        handleSearchForRecitedVerse(finalTranscript);
                    }, 1500);
                }
            } else if (recitationStatusRef.current === 'tracking') {
                setLiveTranscript(interimTranscript);
                const lastResult = event.results[event.results.length - 1];
                if (lastResult.isFinal) {
                    const lastChunk = finalTranscript.replace(finalTranscriptRef.current, '').trim();
                    if (lastChunk) {
                        processRecitedWords(lastChunk.split(' ').filter(w => w));
                        finalTranscriptRef.current = finalTranscript;
                    }
                }
            }
        };

        recognition.onend = () => {
            if (isListening) recognition.start();
        };
        
        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error, event.message);
            if(event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                 setLiveTranscript("يرجى السماح بالوصول إلى الميكروفون.");
            }
            stopListening();
        };
        
        return () => {
            recognition.stop();
            if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        };
    }, []); 

    const startListening = () => {
        setRecitingAyah(null);
        setLiveTranscript('');
        finalTranscriptRef.current = '';
        setMistakes([]);
        setRecitationReport(null);
        setProcessedWordsCount(0);
        setIsListening(true);
        setRecitationStatus('searching');
        recognitionRef.current?.start();
    };
    
    const handleListenClick = () => {
        isListening ? stopListening() : startListening();
    };

    useEffect(() => {
        setRevealedWordCount({});
        const versesOnPage: PageVerseInfo[] = [];
        if (pageData) {
            Object.entries(pageData.verses_by_sura).forEach(([suraName, suraVerses]) => {
                suraVerses.filter(v => v.index > 0).forEach(v => {
                    versesOnPage.push({
                        key: `${suraName}-${v.index}`, 
                        suraName: suraName,
                        ayahNumber: v.index,
                        wordCount: v.text.split(' ').length
                    });
                })
            });
        }
        pageVersesRef.current = versesOnPage;
    }, [currentPage, pageData]);


    const handleCloseModal = () => {
        setActiveModal(ReaderModal.None);
        setSelectedVerse(null); 
    };
    
    const navigateToPage = (page: number) => {
        setCurrentPage(page);
        setSelectedVerse(null);
    };

    const goToNextPage = () => navigateToPage(Math.min(currentPage + 1, 604));
    const goToPrevPage = () => navigateToPage(Math.max(currentPage - 1, 1));

    const handleVerseLongPress = (suraName: string, ayahNumber: number, surahNumber: number) => {
        if (isListening) return;
        setSelectedVerse({ suraName, ayahNumber, surahNumber });
        setActiveModal(ReaderModal.AyahActions);
    };

    const handleBookmarkSelected = () => {
        if (selectedVerse) {
            addBookmark({
                surahName: selectedVerse.suraName,
                surahNumber: selectedVerse.surahNumber,
                ayahNumber: selectedVerse.ayahNumber,
                pageNumber: currentPage
            });
            handleCloseModal();
        }
    };
    
    const handleStartPlayback = () => {
        setIsPlayingAudio(true);
        setPlaybackPaused(false);
        setActiveModal(ReaderModal.None);
    };

    const stopPlayback = () => {
        setIsPlayingAudio(false);
        setPlaybackPaused(false);
        setCurrentlyPlayingVerse(null);
        if(audioTimer.current) clearInterval(audioTimer.current);
    }
    
    const onToggleHifdhMode = () => {
        setIsHifdhModeActive(prev => !prev);
        setRevealedWordCount({});
    };

    const findVerseToReveal = (direction: 'forward' | 'backward' = 'forward') => {
        const verses = direction === 'forward' ? pageVersesRef.current : [...pageVersesRef.current].reverse();
        for (const verse of verses) {
            const currentCount = revealedWordCount[verse.key] || 0;
            if (direction === 'forward' && currentCount < verse.wordCount) {
                return verse;
            }
            if (direction === 'backward' && currentCount > 0) {
                return verse;
            }
        }
        return direction === 'backward' ? pageVersesRef.current[pageVersesRef.current.length-1] : pageVersesRef.current[0];
    }

    const onRevealNextWord = () => {
        const verse = findVerseToReveal('forward');
        if (!verse) return;
        const currentCount = revealedWordCount[verse.key] || 0;
        const newCount = Math.min(verse.wordCount, currentCount + 1);
        setRevealedWordCount(prev => ({...prev, [verse.key]: newCount}));
    };

    const onRevealNextAyah = () => {
        const verse = findVerseToReveal('forward');
        if (!verse) return;
        setRevealedWordCount(prev => ({...prev, [verse.key]: verse.wordCount}));
    };

    const onRevealPreviousWord = () => {
        const verse = findVerseToReveal('backward');
        if (!verse) return;
        const currentCount = revealedWordCount[verse.key] || 0;
        const newCount = Math.max(0, currentCount - 1);
        setRevealedWordCount(prev => ({...prev, [verse.key]: newCount}));
    };
    
    const onRevealPreviousAyah = () => {
        const verse = findVerseToReveal('backward');
        if (!verse) return;
        setRevealedWordCount(prev => ({...prev, [verse.key]: 0}));
    };

    useEffect(() => {
        if (isPlayingAudio && !playbackPaused) {
            const versesOnPage: {suraName: string, ayahNumber: number}[] = [];
            if(pageData) {
                 Object.entries(pageData.verses_by_sura).forEach(([suraName, verses]) => {
                    verses.forEach(v => {
                        if (v.index > 0) versesOnPage.push({ suraName, ayahNumber: v.index });
                    });
                });
            }

            if (versesOnPage.length > 0) {
                let currentVerseIndex = 0;
                setCurrentlyPlayingVerse(versesOnPage[0]);

                audioTimer.current = setInterval(() => {
                    currentVerseIndex++;
                    if (currentVerseIndex < versesOnPage.length) {
                        setCurrentlyPlayingVerse(versesOnPage[currentVerseIndex]);
                    } else {
                        stopPlayback();
                    }
                }, 3000);
            }
        } else if (audioTimer.current) {
            clearInterval(audioTimer.current);
        }

        return () => {
            if (audioTimer.current) clearInterval(audioTimer.current);
        };
    }, [isPlayingAudio, playbackPaused, currentPage]);


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goToPrevPage();
            if (e.key === 'ArrowLeft') goToNextPage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentPage]);


    return (
        <div className="relative w-full h-screen overflow-hidden bg-gray-50">
            <TopToolbar 
                onSearchClick={() => setActiveModal(ReaderModal.Search)}
                onBookmarkClick={() => setActiveModal(ReaderModal.Bookmarks)}
                pageData={pageData}
                juzNumber={juzNumber}
                hizbData={hizbData}
            />
            
            <main className="w-full h-full pt-16 pb-24">
                <QuranPage 
                    pageIndex={currentPage} 
                    selectedVerse={selectedVerse}
                    onVerseLongPress={handleVerseLongPress}
                    currentlyPlayingVerse={currentlyPlayingVerse}
                    isHifdhModeActive={isHifdhModeActive}
                    revealedWordCount={revealedWordCount}
                    recitingAyah={recitingAyah}
                    trackedVerseKey={trackedVerse?.key ?? null}
                    trackedWordIndex={trackedWordIndex}
                    mistakes={mistakes}
                />
            </main>

            {isPlayingAudio && (
                <div className="absolute bottom-24 left-0 right-0 p-4 flex justify-center z-10">
                    <div className="w-full max-w-sm bg-white rounded-full shadow-lg p-2 flex items-center justify-between">
                         <button onClick={stopPlayback} className="p-2 text-gray-500 hover:text-gray-800"><XIcon className="w-5 h-5"/></button>
                         <div className="text-sm font-semibold">
                             {currentlyPlayingVerse ? `${currentlyPlayingVerse.suraName} - ${currentlyPlayingVerse.ayahNumber}` : '...'}
                         </div>
                         <button onClick={() => setPlaybackPaused(!playbackPaused)} className="p-2 text-emerald-500">
                             {playbackPaused ? <PlayIcon className="w-6 h-6"/> : <PauseIcon className="w-6 h-6"/>}
                         </button>
                    </div>
                </div>
            )}


            <button onClick={goToNextPage} disabled={currentPage === 604} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full disabled:opacity-25 z-30">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button onClick={goToPrevPage} disabled={currentPage === 1} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full disabled:opacity-25 z-30">
                <ChevronRightIcon className="w-6 h-6" />
            </button>

            <BottomToolbar 
                onDisplaySettingsClick={() => setActiveModal(ReaderModal.DisplaySettings)}
                onAudioSettingsClick={() => setActiveModal(ReaderModal.AudioSettings)}
                isListening={isListening}
                onListenClick={handleListenClick}
                isHifdhModeActive={isHifdhModeActive}
                onToggleHifdhMode={onToggleHifdhMode}
                onRevealNextWord={onRevealNextWord}
                onRevealNextAyah={onRevealNextAyah}
                onRevealPreviousWord={onRevealPreviousWord}
                onRevealPreviousAyah={onRevealPreviousAyah}
                liveTranscript={liveTranscript}
            />

            {/* Modals */}
            {activeModal === ReaderModal.Search && <SearchModal onClose={handleCloseModal} onNavigate={(page) => { navigateToPage(page); handleCloseModal(); }} />}
            
            <ModalWrapper show={activeModal === ReaderModal.DisplaySettings} onClose={handleCloseModal} position="bottom">
                <DisplaySettingsModal onClose={handleCloseModal} />
            </ModalWrapper>

            <ModalWrapper show={activeModal === ReaderModal.AudioSettings} onClose={handleCloseModal} position="bottom">
                <AudioSettingsModal onClose={handleCloseModal} onStartPlayback={handleStartPlayback} />
            </ModalWrapper>
            
            <ModalWrapper show={activeModal === ReaderModal.MistakeReport} onClose={() => {
                handleCloseModal();
                setMistakes([]);
                setRecitationReport(null);
            }} position="bottom">
                <MistakeReportModal 
                    onClose={() => {
                        handleCloseModal();
                        setMistakes([]);
                        setRecitationReport(null);
                    }} 
                    recitationReport={recitationReport}
                />
            </ModalWrapper>

            {activeModal === ReaderModal.Bookmarks && <BookmarksModal onNavigate={(page) => { navigateToPage(page); handleCloseModal(); }} onClose={handleCloseModal} />}

            {selectedVerse && (
                <ModalWrapper show={activeModal === ReaderModal.AyahActions} onClose={handleCloseModal} position="bottom">
                    <AyahActionsModal
                        onClose={handleCloseModal}
                        selectedVerse={selectedVerse}
                        onBookmark={handleBookmarkSelected}
                        onCopy={() => { 
                            const verseData = allVerses.find(v => v.suraName === selectedVerse.suraName && v.index === selectedVerse.ayahNumber);
                            if(verseData) navigator.clipboard.writeText(verseData.text);
                            handleCloseModal();
                        }}
                        onShare={() => {
                            const verseData = allVerses.find(v => v.suraName === selectedVerse.suraName && v.index === selectedVerse.ayahNumber);
                            if (navigator.share && verseData) {
                                navigator.share({
                                    title: `Quran Ayah: ${selectedVerse.suraName} ${selectedVerse.ayahNumber}`,
                                    text: `${verseData.text} (${selectedVerse.suraName}:${selectedVerse.ayahNumber})`,
                                });
                            }
                            handleCloseModal();
                        }}
                    />
                </ModalWrapper>
            )}

        </div>
    );
};

export default QuranReader;