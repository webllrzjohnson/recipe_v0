import type { AboutPageStoredContent } from '@/lib/static-pages/types';

const ABOUT_FALLBACK: AboutPageStoredContent = {
  title: 'About Sarap Kitchen',
  subtitle: 'Bringing the warmth of Filipino home cooking to your kitchen',
  storyHeading: 'Our Story',
  storyText:
    'Sarap Kitchen was born from a love of Filipino cuisine and a desire to share these beloved recipes with the world. Every dish tells a story of family gatherings, celebrations, and the simple joy of a home-cooked meal.',
  missionHeading: 'Our Mission',
  missionText:
    'We believe that cooking should be accessible to everyone. Our recipes are carefully tested and written with clear instructions, whether you are a beginner or an experienced cook.',
  valuesHeading: 'Our Values',
  values: [
    {
      title: 'Made with Love',
      description: 'Every recipe is prepared and tested with care and passion.',
    },
    {
      title: 'For Everyone',
      description: 'Clear instructions for beginners and experts alike.',
    },
    {
      title: 'Authentic',
      description: 'Traditional recipes passed down through generations.',
    },
  ],
  storyImageUrl: 'https://placehold.co/800x600/C0392B/FFFFFF?text=Our+Kitchen',
  missionImageUrl: 'https://placehold.co/800x600/F39C12/FFFFFF?text=Cooking+Together',
};

export function getAboutFallback(): AboutPageStoredContent {
  return ABOUT_FALLBACK;
}
