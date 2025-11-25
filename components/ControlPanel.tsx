
import React from 'react';
import { EmotionalProfile, Language } from '../types';
import { getTranslation } from '../utils/localization';
import ProfileRadar from './ProfileRadar';
import SliderControl from './SliderControl';

interface ControlPanelProps {
  profile: EmotionalProfile;
  setProfile: React.Dispatch<React.SetStateAction<EmotionalProfile>>;
  language: Language;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ profile, setProfile, language }) => {
  const t = getTranslation(language);

  const handleChange = (key: keyof EmotionalProfile, value: number) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const radarLabels = {
    empathy: t.empathy,
    rationality: t.rationality,
    humor: t.humor,
    intimacy: t.intimacy,
    narrative: t.narrative,
  };

  return (
    <div className="bg-gray-900 border-r border-gray-800 flex flex-col h-full overflow-y-auto w-full md:w-96 shrink-0">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
          {t.corePersonality}
        </h2>
        <p className="text-xs text-gray-400 mt-1">{t.adjustDimensions}</p>
      </div>

      <div className="p-4 bg-gray-900/50">
        <ProfileRadar profile={profile} labels={radarLabels} />
      </div>

      <div className="p-6 flex-1">
        <SliderControl
          label={t.empathy}
          value={profile.empathy}
          onChange={(v) => handleChange('empathy', v)}
          description={t.empathyDesc}
          colorClass="text-pink-400"
        />
        <SliderControl
          label={t.rationality}
          value={profile.rationality}
          onChange={(v) => handleChange('rationality', v)}
          description={t.rationalityDesc}
          colorClass="text-blue-400"
        />
        <SliderControl
          label={t.humor}
          value={profile.humor}
          onChange={(v) => handleChange('humor', v)}
          description={t.humorDesc}
          colorClass="text-yellow-400"
        />
        <SliderControl
          label={t.intimacy}
          value={profile.intimacy}
          onChange={(v) => handleChange('intimacy', v)}
          description={t.intimacyDesc}
          colorClass="text-red-400"
        />
        <SliderControl
          label={t.narrative}
          value={profile.narrative}
          onChange={(v) => handleChange('narrative', v)}
          description={t.narrativeDesc}
          colorClass="text-purple-400"
        />
      </div>
    </div>
  );
};

export default ControlPanel;
