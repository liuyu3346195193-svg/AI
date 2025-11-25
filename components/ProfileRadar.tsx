
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { EmotionalProfile } from '../types';

interface ProfileRadarProps {
  profile: EmotionalProfile;
  labels: Record<string, string>;
}

const ProfileRadar: React.FC<ProfileRadarProps> = ({ profile, labels }) => {
  const data = [
    { subject: labels.empathy || 'Empathy', A: profile.empathy, fullMark: 100 },
    { subject: labels.rationality || 'Rationality', A: profile.rationality, fullMark: 100 },
    { subject: labels.humor || 'Humor', A: profile.humor, fullMark: 100 },
    { subject: labels.intimacy || 'Intimacy', A: profile.intimacy, fullMark: 100 },
    { subject: labels.narrative || 'Narrative', A: profile.narrative, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 relative z-0">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Profile"
            dataKey="A"
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="#0ea5e9"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfileRadar;
