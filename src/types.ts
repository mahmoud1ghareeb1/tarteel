export enum View {
  Reader,
  Dashboard,
  Settings,
}

export enum ReaderModal {
  None,
  Search,
  DisplaySettings,
  AudioSettings,
  Bookmarks,
  MistakeReport,
  AyahActions,
}

export enum DashboardTab {
    Main,
    Goals,
    Hifdh,
    Activity,
    Community
}

export type Surah = {
  number: number;
  name: string;
  englishName: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
};

export type Juz = {
    number: number;
    start: string;
}

export type Bookmark = {
    surahName: string;
    surahNumber: number;
    ayahNumber: number;
    pageNumber: number;
    timestamp: number;
}

export type SurahSimpleInfo = Surah & {
    startPage: number;
};

export type RecitationMistake = {
    verseKey: string;
    wordIndex: number;
    expected: string;
    recited: string;
    suraName: string;
    ayahNumber: number;
    verseText: string;
};

export type RecitationReport = {
    accuracy: number;
    correctWords: number;
    mistakeCount: number;
    mistakes: RecitationMistake[];
};