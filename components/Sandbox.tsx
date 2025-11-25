
import React, { useState } from 'react';
import { EmotionalProfile, Language } from '../types';
import { generateSandboxResponse } from '../services/geminiService';
import { getTranslation } from '../utils/localization';

interface SandboxProps {
  profile: EmotionalProfile;
  language: Language;
}

const Sandbox: React.FC<SandboxProps> = ({ profile, language }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const t = getTranslation(language);

  const handleSimulate = async () => {
    if (!prompt.trim() || isSimulating) return;

    setIsSimulating(true);
    setResponse(null);
    const res = await generateSandboxResponse(prompt, profile, language);
    setResponse(res);
    setIsSimulating(false);
  };

  return (
    <div className="h-full p-6 md:p-10 bg-gray-950 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{t.sandboxTitle}</h2>
          <p className="text-gray-400">{t.sandboxDesc}</p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            {t.scenarioPrompt}
          </label>
          <div className="flex gap-2 flex-wrap mb-4">
            {t.scenarios.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(p)}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full transition-colors border border-gray-700 text-left"
              >
                {p}
              </button>
            ))}
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[100px]"
            placeholder={t.enterScenario}
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSimulate}
              disabled={isSimulating || !prompt.trim()}
              className="bg-accent-500 hover:bg-accent-400 text-white font-medium px-6 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSimulating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {t.simulating}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  {t.runSimulation}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        {response && (
          <div className="bg-gray-900/50 border border-primary-900/50 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-primary-400 uppercase tracking-wider">{t.analysisTitle}</h3>
              <div className="flex gap-2 text-xs text-gray-500 font-mono">
                <span>E:{profile.empathy}</span>
                <span>R:{profile.rationality}</span>
                <span>H:{profile.humor}</span>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-200 whitespace-pre-wrap leading-relaxed border-l-4 border-primary-500 pl-4">
                {response}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sandbox;
