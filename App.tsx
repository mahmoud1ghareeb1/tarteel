import React, { useState, createContext, useContext, useEffect } from 'react';
import { View, Bookmark } from './types';
import QuranReader from './components/QuranReader';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';

interface AppContextType {
  currentView: View;
  setView: (view: View) => void;
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'timestamp'>) => void;
  removeBookmark: (timestamp: number) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Reader);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem('tarteel-bookmarks');
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error("Failed to load bookmarks from localStorage", error);
    }
  }, []);

  const saveBookmarks = (updatedBookmarks: Bookmark[]) => {
    try {
      localStorage.setItem('tarteel-bookmarks', JSON.stringify(updatedBookmarks));
      setBookmarks(updatedBookmarks);
    } catch (error) {
      console.error("Failed to save bookmarks to localStorage", error);
    }
  };

  const addBookmark = (bookmark: Omit<Bookmark, 'timestamp'>) => {
    const newBookmark: Bookmark = { ...bookmark, timestamp: Date.now() };
    const newBookmarks = [...bookmarks, newBookmark].sort((a,b) => a.pageNumber - b.pageNumber);
    saveBookmarks(newBookmarks);
  };

  const removeBookmark = (timestamp: number) => {
    const newBookmarks = bookmarks.filter(b => b.timestamp !== timestamp);
    saveBookmarks(newBookmarks);
  };


  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard />;
      case View.Settings:
        return <Settings />;
      case View.Reader:
      default:
        return <QuranReader />;
    }
  };

  return (
    <AppContext.Provider value={{ currentView, setView: setCurrentView, bookmarks, addBookmark, removeBookmark }}>
      <div className="w-full h-screen bg-white text-gray-800 font-sans antialiased" dir="rtl">
        {renderView()}
      </div>
    </AppContext.Provider>
  );
};

export default App;
