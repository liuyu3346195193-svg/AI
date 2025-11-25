
import React, { useState } from 'react';
import { EmotionalProfile, INITIAL_PROFILE, Message, ViewMode, Language } from './types';
import ControlPanel from './components/ControlPanel';
import ChatInterface from './components/ChatInterface';
import Sandbox from './components/Sandbox';
import SettingsModal from './components/SettingsModal';
import { getTranslation } from './utils/localization';

const App: React.FC = () => {
  const [profile, setProfile] = useState<EmotionalProfile>(INITIAL_PROFILE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CHAT);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Settings State
  const [language, setLanguage] = useState<Language>('en');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const t = getTranslation(language);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-200 overflow-hidden font-sans">
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        language={language}
        setLanguage={setLanguage}
        history={messages}
        profile={profile}
      />

      {/* Sidebar / Mobile Overlay */}
      <div className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-80 md:w-96 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <ControlPanel profile={profile} setProfile={setProfile} language={language} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full relative">
        
        {/* Header */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-mono font-bold text-white hidden sm:block">{t.appTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode(ViewMode.CHAT)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === ViewMode.CHAT
                    ? 'bg-primary-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.liveChat}
              </button>
              <button
                onClick={() => setViewMode(ViewMode.SANDBOX)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === ViewMode.SANDBOX
                    ? 'bg-accent-500 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.sandbox}
              </button>
            </div>

            {/* Settings Button */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
              title={t.settings}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* View Area */}
        <main className="flex-1 overflow-hidden relative">
          {viewMode === ViewMode.CHAT ? (
            <ChatInterface 
              profile={profile} 
              history={messages} 
              setHistory={setMessages}
              language={language}
            />
          ) : (
            <Sandbox profile={profile} language={language} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
