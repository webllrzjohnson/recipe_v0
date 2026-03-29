import type { HomePageStoredContent } from '@/lib/static-pages/types';

const HOME_FALLBACK: HomePageStoredContent = {
  tagline: 'Authentic Filipino Cuisine',
  heroTitle: 'Discover Authentic Filipino Flavors',
  heroSubtitle:
    'Explore our collection of traditional and modern Filipino recipes, passed down through generations',
  exploreRecipesLabel: 'Explore Recipes',
  blogLabel: 'Blog',
  heroImageUrl: 'https://placehold.co/1200x675/C0392B/FFFFFF?text=Filipino+Cuisine',
  heroImageAlt: 'Filipino cuisine spread',
};

export function getHomeFallback(): HomePageStoredContent {
  return HOME_FALLBACK;
}
