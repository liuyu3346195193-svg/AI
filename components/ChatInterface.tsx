
import React, { useState, useRef, useEffect } from 'react';
import { EmotionalProfile, Message, MessageRole, Language } from '../types';
import { generateChatResponse } from '../services/geminiService';
import { getTranslation } from '../utils/localization';

interface ChatInterfaceProps {
  profile: EmotionalProfile;
  history: Message[];
  setHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  language: Language;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ profile, history, setHistory, language }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSceneMode, setIsSceneMode] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(language);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading, editingMessageId]);

  // Close plus menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsPlusMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = async (messageText: string = input) => {
    if (!messageText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: messageText,
      timestamp: Date.now(),
    };

    setHistory((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateChatResponse(history, userMsg.text, profile, language, isSceneMode);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: MessageRole.MODEL,
      text: responseText,
      timestamp: Date.now(),
    };

    setHistory((prev) => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Edit User Message logic: Truncate history after edited index, then resend
  const startEditing = (msg: Message) => {
    setEditingMessageId(msg.id);
    setEditText(msg.text);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditText('');
  };

  const confirmEdit = async (msgId: string) => {
    const msgIndex = history.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;

    // Slice history to include everything BEFORE this message
    const newHistory = history.slice(0, msgIndex);
    
    // Update State immediately
    setHistory(newHistory);
    setEditingMessageId(null);
    
    // Send as new message
    await handleSend(editText);
  };

  // Regenerate AI Response Logic
  const handleRegenerate = async (aiMsgIndex: number) => {
    if (isLoading) return;
    
    // We need the context up to the previous USER message
    // The history array currently contains [..., UserMsg, AiMsg (to be replaced), ...]
    const context = history.slice(0, aiMsgIndex);
    
    // Find the last user message to resend as the prompt
    const lastUserMsg = context[context.length - 1];
    if (!lastUserMsg || lastUserMsg.role !== MessageRole.USER) return;

    setIsLoading(true);
    // Remove the bad AI message from UI immediately or keep it until replaced? 
    // Usually replacing it with loader is better UX for "Regenerate"
    setHistory(context); 

    // We pass the context *excluding* the last user message to the API wrapper 
    // because generateChatResponse appends the currentMessage to history internally for the API call? 
    // Wait, generateChatResponse takes (history, currentMessage). 
    // So we pass context.slice(0, -1) as history, and lastUserMsg.text as currentMessage.
    
    const historyForApi = context.slice(0, -1);
    const responseText = await generateChatResponse(historyForApi, lastUserMsg.text, profile, language, isSceneMode);

    const newAiMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.MODEL,
      text: responseText,
      timestamp: Date.now(),
    };

    setHistory((prev) => [...prev, newAiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 relative">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
            <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
              <span className="text-4xl">🤖</span>
            </div>
            <p className="text-center text-sm">{t.connectionEstablished}<br/>{t.configureAndSayHello}</p>
          </div>
        )}
        
        {history.map((msg, index) => {
          const isUser = msg.role === MessageRole.USER;
          const isEditing = editingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex w-full gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className="shrink-0 flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${isUser ? 'bg-primary-700' : 'bg-gray-800'}`}>
                   <span className="text-xl">{isUser ? '👤' : '🤖'}</span>
                </div>
              </div>

              {/* Message Content Wrapper */}
              <div className={`flex flex-col max-w-[75%] md:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Nickname */}
                <span className="text-xs text-gray-500 mb-1 px-1">
                  {isUser ? t.userNickname : t.aiNickname}
                </span>

                {isEditing ? (
                  <div className="w-full min-w-[300px] bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-xl z-10 animate-in fade-in zoom-in-95">
                    <textarea 
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-gray-800 text-white p-2 rounded-md mb-2 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={cancelEditing} 
                        className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition"
                      >
                        {t.cancel}
                      </button>
                      <button 
                        onClick={() => confirmEdit(msg.id)} 
                        className="text-xs px-3 py-1 rounded bg-primary-600 hover:bg-primary-500 text-white transition"
                      >
                        {t.saveAndSend}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group relative">
                    {/* Bubble */}
                    <div
                      className={`relative px-4 py-3 text-sm md:text-base leading-relaxed shadow-md break-words ${
                        isUser
                          ? 'bg-primary-600 text-white rounded-2xl rounded-tr-none'
                          : 'bg-gray-800 text-gray-200 rounded-2xl rounded-tl-none border border-gray-700'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>

                    {/* Actions (Edit / Regenerate) */}
                    <div className={`absolute top-full mt-1 flex ${isUser ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                      {isUser ? (
                        <button 
                          onClick={() => startEditing(msg)} 
                          className="p-1 text-gray-500 hover:text-white bg-gray-900/50 rounded-full backdrop-blur-sm"
                          title={t.edit}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleRegenerate(index)} 
                          className="p-1 text-gray-500 hover:text-white bg-gray-900/50 rounded-full backdrop-blur-sm"
                          title={t.regenerate}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex w-full gap-3">
             <div className="shrink-0 flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center shadow-lg">
                   <span className="text-xl">🤖</span>
                </div>
              </div>
              <div className="flex flex-col items-start">
                 <span className="text-xs text-gray-500 mb-1 px-1">{t.aiNickname}</span>
                <div className="bg-gray-800 rounded-2xl rounded-tl-none px-5 py-4 border border-gray-700 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          
          {/* Plus Button with Menu */}
          <div className="relative pb-2" ref={menuRef}>
            <button
              onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
              className={`p-2 rounded-full transition-colors ${isPlusMenuOpen ? 'text-white bg-gray-700' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Popover Menu */}
            {isPlusMenuOpen && (
              <div className="absolute bottom-14 left-0 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                <div 
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                  onClick={() => {
                    setIsSceneMode(!isSceneMode);
                    setIsPlusMenuOpen(false);
                  }}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSceneMode ? 'bg-primary-500 border-primary-500' : 'border-gray-500'}`}>
                    {isSceneMode && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white block">{t.sceneMode}</span>
                    <span className="text-[10px] text-gray-400 leading-tight block">{t.sceneModeDesc}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="flex-1 bg-gray-800 rounded-2xl flex items-center border border-gray-700 focus-within:ring-2 focus-within:ring-primary-500/50 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.typeMessage}
              className="w-full bg-transparent text-white px-4 py-3 focus:outline-none resize-none max-h-32 min-h-[48px]"
              rows={1}
              style={{ height: 'auto', minHeight: '48px' }}
              disabled={isLoading}
            />
          </div>

          {/* Send Button */}
          <div className="pb-2">
             <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
