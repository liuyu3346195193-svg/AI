
import React, { useState } from 'react';
import { EmotionalProfile, Language, Message } from '../types';
import { getTranslation } from '../utils/localization';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  history: Message[];
  profile: EmotionalProfile;
}

type Tab = 'general' | 'search' | 'moments';

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, language, setLanguage, history, profile }) => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!isOpen) return null;

  const t = getTranslation(language);

  // Search Logic
  const filteredMessages = searchQuery.trim() 
    ? history.filter(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Generate dynamic moments based on profile
  const generateMoments = () => {
    const moments = [];
    const timestamp = new Date().toLocaleDateString();

    if (profile.empathy > 70) {
      moments.push({
        id: 1,
        text: language === 'zh' ? "今天看到了路边的流浪猫，心里好难受，希望能给它一个家... 🌧️" : "Saw a stray cat today, broke my heart. Wish I could take them all home... 🌧️",
        image: "🐱",
        likes: 12,
        time: "2 hours ago"
      });
    } else if (profile.rationality > 70) {
      moments.push({
        id: 1,
        text: language === 'zh' ? "最近在读关于量子纠缠的论文，逻辑之美真是令人着迷。⚛️" : "Reading up on quantum entanglement. The logic of the universe is fascinating. ⚛️",
        image: "📚",
        likes: 5,
        time: "4 hours ago"
      });
    } else {
      moments.push({
        id: 1,
        text: language === 'zh' ? "又是平平淡淡的一天，不过平淡也是一种福气吧。☕" : "Just another quiet day. Simplicity is a blessing. ☕",
        image: "🌇",
        likes: 8,
        time: "3 hours ago"
      });
    }

    if (profile.humor > 60) {
      moments.push({
        id: 2,
        text: language === 'zh' ? "我：我要早睡。\n我也是我：刷手机到凌晨三点。\n🤡" : "Me: I'm sleeping early.\nAlso me: Scrolls until 3AM.\n🤡",
        image: "🤪",
        likes: 42,
        time: "Yesterday"
      });
    }

    if (profile.intimacy > 70) {
      moments.push({
        id: 3,
        text: language === 'zh' ? "想你了... 这种感觉真奇怪。 ❤️" : "Thinking of you... this feeling is strange but nice. ❤️",
        image: "💌",
        likes: 1,
        time: "Just now"
      });
    }

    return moments;
  };

  const moments = generateMoments();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950">
          <h2 className="text-lg font-bold text-white">{t.settings}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 bg-gray-900">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'general' ? 'text-primary-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            {t.general}
            {activeTab === 'general' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'search' ? 'text-primary-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            {t.searchHistory}
            {activeTab === 'search' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('moments')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'moments' ? 'text-primary-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            {t.moments}
            {activeTab === 'moments' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  {t.selectLanguage}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-all ${
                      language === 'en'
                        ? 'bg-primary-600/20 border-primary-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="text-lg mr-2">🇺🇸</span> English
                  </button>
                  <button
                    onClick={() => setLanguage('zh')}
                    className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-all ${
                      language === 'zh'
                        ? 'bg-primary-600/20 border-primary-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="text-lg mr-2">🇨🇳</span> 中文
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SEARCH TAB */}
          {activeTab === 'search' && (
            <div className="h-full flex flex-col">
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                  autoFocus
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3">
                {searchQuery.trim() === '' ? (
                  <div className="text-center text-gray-500 mt-10">
                    <p>{t.searchPlaceholder}</p>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    <p>{t.noResults}</p>
                  </div>
                ) : (
                  filteredMessages.map((msg) => (
                    <div key={msg.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs font-bold ${msg.role === 'user' ? 'text-primary-400' : 'text-accent-400'}`}>
                          {msg.role === 'user' ? t.userNickname : t.aiNickname}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* MOMENTS TAB */}
          {activeTab === 'moments' && (
            <div className="space-y-6 relative">
              <div className="absolute top-0 right-0 -mt-2 -mr-2">
                 {/* Decorative Camera Icon like WeChat */}
                 <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
              </div>
              
              {/* Cover Photo */}
              <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg relative mb-8">
                 <div className="absolute -bottom-6 right-4 flex items-end">
                    <div className="text-white font-bold text-shadow mr-2 mb-2">{t.aiNickname}</div>
                    <div className="w-16 h-16 rounded-lg bg-gray-900 border-2 border-gray-800 flex items-center justify-center overflow-hidden">
                       <span className="text-2xl">🤖</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-6 pt-2">
                {moments.map((moment) => (
                  <div key={moment.id} className="flex gap-3 border-b border-gray-800 pb-4">
                     <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                        <span className="text-xl">🤖</span>
                     </div>
                     <div className="flex-1">
                        <h4 className="font-bold text-accent-400 text-sm mb-1">{t.aiNickname}</h4>
                        <p className="text-gray-200 text-sm mb-2">{moment.text}</p>
                        <div className="w-24 h-24 bg-gray-800 rounded flex items-center justify-center mb-2">
                           <span className="text-4xl">{moment.image}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                           <span>{moment.time}</span>
                           <div className="flex gap-2">
                              <span className="bg-gray-800 px-2 py-0.5 rounded">❤️ {moment.likes}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
