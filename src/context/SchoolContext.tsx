import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { SchoolSettings } from '../types';
import { api } from '../services/api';

const DEFAULT_SETTINGS: SchoolSettings = {
  school_name: 'Bhartal Inter College',
  tagline: 'Excellence in Education & Character Building',
  address: 'Hasanpur Road, Bhartal, Sirsi, District Sambhal, Uttar Pradesh, India',
  phone: '+91 90124 93127',
  email: 'afarjand581@gmail.com',
  principal_name: "Principal's Name",
  principal_designation: 'Principal, Bhartal Inter College',
  principal_photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
  principal_message: 'Welcome to Bhartal Inter College. Our commitment is to foster a disciplined, inspiring, and supportive learning environment that empowers our students to excel academically and ethically. (Demo content - Editable via Admin Panel)',
  homepage_intro: 'Bhartal Inter College provides high quality education, fostering discipline, character development, and academic achievement for students in Bhartal, Sirsi, and the Sambhal district.',
  vision: 'To nurture educated, enlightened, and conscientious citizens who excel academically and contribute positively to our society and nation.',
  mission: 'To impart quality education with a strong emphasis on character building, moral ethics, academic rigor, and holistic student development.',
  office_hours: {
    days: 'Monday to Saturday',
    timings: '08:00 AM - 02:00 PM (Demo)',
    closed: 'Sundays & Gazetted Holidays',
  },
  statistics: [
    { id: '1', label: 'Students Enrolled', value: '1,200+', isDemo: true },
    { id: '2', label: 'Dedicated Faculty', value: '35+', isDemo: true },
    { id: '3', label: 'Classrooms & Labs', value: '24+', isDemo: true },
    { id: '4', label: 'Years of Service', value: '15+', isDemo: true },
  ],
  facilities: [
    { id: '1', title: 'Modern Classrooms', description: 'Spacious, well-ventilated rooms designed for attentive learning and active student participation.', enabled: true, isDemo: true },
    { id: '2', title: 'Science Laboratories', description: 'Practical labs supporting physics, chemistry, and biology experiments under faculty guidance.', enabled: true, isDemo: true },
    { id: '3', title: 'College Library', description: 'A quiet reading room with curriculum textbooks, reference literature, and magazines.', enabled: true, isDemo: true },
    { id: '4', title: 'Computer Workstations', description: 'Dedicated IT workstations introducing students to digital literacy and basic computing.', enabled: true, isDemo: true },
    { id: '5', title: 'Sports & Playground', description: 'Outdoor area supporting physical fitness, team sports, cricket, and annual athletics events.', enabled: true, isDemo: true },
    { id: '6', title: 'Clean Drinking Water', description: 'Purified drinking water stations and maintained hygienic sanitary facilities.', enabled: true, isDemo: true },
  ],
  social_links: {
    facebook: '',
    twitter: '',
    youtube: '',
    instagram: '',
  },
};

interface SchoolContextType {
  settings: SchoolSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SchoolSettings>) => Promise<boolean>;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await api.settings.get();
      if (res.settings) {
        setSettings(prev => ({
          ...prev,
          ...res.settings,
          office_hours: typeof res.settings.office_hours === 'object' && res.settings.office_hours !== null
            ? res.settings.office_hours
            : prev.office_hours,
          statistics: Array.isArray(res.settings.statistics)
            ? res.settings.statistics
            : prev.statistics,
          facilities: Array.isArray(res.settings.facilities)
            ? res.settings.facilities
            : prev.facilities,
          social_links: typeof res.settings.social_links === 'object' && res.settings.social_links !== null
            ? res.settings.social_links
            : prev.social_links,
        }));
      }
    } catch (err) {
      console.warn('Could not fetch remote school settings, using local fallback:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const updateSettings = async (newSettings: Partial<SchoolSettings>): Promise<boolean> => {
    try {
      await api.settings.update(newSettings);
      await refreshSettings();
      return true;
    } catch (err) {
      console.error('Settings update error:', err);
      return false;
    }
  };

  return (
    <SchoolContext.Provider value={{ settings, isLoading, refreshSettings, updateSettings }}>
      {children}
    </SchoolContext.Provider>
  );
};

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
}
