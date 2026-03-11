// Builder shared TypeScript interfaces

export interface SectionDefinition {
  id: string;
  name: string;
  category: SectionCategory;
  description: string;
  html: string;
  thumbnail: string; // CSS gradient for preview
}

export type SectionCategory =
  | 'hero'
  | 'navigation'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'cta'
  | 'contact'
  | 'footer'
  | 'faq'
  | 'team'
  | 'stats'
  | 'gallery'
  | 'blog'
  | 'logos'
  | 'how-it-works'
  | 'video'
  | 'newsletter';

export const SECTION_CATEGORY_LABELS: Record<SectionCategory, string> = {
  hero: 'Hero',
  navigation: 'Navigation',
  features: 'Features',
  pricing: 'Pricing',
  testimonials: 'Testimonials',
  cta: 'Call to Action',
  contact: 'Contact',
  footer: 'Footer',
  faq: 'FAQ',
  team: 'Team',
  stats: 'Stats',
  gallery: 'Gallery',
  blog: 'Blog',
  logos: 'Logos & Partners',
  'how-it-works': 'How It Works',
  video: 'Video',
  newsletter: 'Newsletter',
};

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  thumbnail: string;
  html: string;
  recommendedPages: string[];
}

export type TemplateCategory = 'business' | 'creative' | 'ecommerce' | 'professional' | 'saas' | 'personal';

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  business: 'Business',
  creative: 'Creative',
  ecommerce: 'E-Commerce',
  professional: 'Professional',
  saas: 'SaaS',
  personal: 'Personal',
};

export interface BuilderPage {
  id: string;
  name: string;
  slug: string;
  html: string;
  isHome: boolean;
}

export interface SiteSettings {
  title: string;
  description: string;
  favicon: string;
  colorTheme: ColorTheme;
  fontPairing: FontPairing;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface ColorTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
}

export interface FontPairing {
  name: string;
  heading: string;
  body: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  html?: string;
  timestamp: number;
}

export interface AIBuildResponse {
  message: string;
  html?: string;
  sections?: string[];
  action: 'build' | 'refine' | 'chat' | 'error';
}

export const COLOR_THEMES: ColorTheme[] = [
  { name: 'Midnight Gold', primary: '#C9A94E', secondary: '#1a1f2e', accent: '#C9A94E', background: '#0f1219', surface: '#1a1f2e', text: '#e2e8f0', textMuted: '#9ca3af' },
  { name: 'Ocean Teal', primary: '#14b8a6', secondary: '#0c4a6e', accent: '#14b8a6', background: '#0c1220', surface: '#0f172a', text: '#e2e8f0', textMuted: '#94a3b8' },
  { name: 'Clean White', primary: '#2563eb', secondary: '#f8fafc', accent: '#2563eb', background: '#ffffff', surface: '#f1f5f9', text: '#0f172a', textMuted: '#64748b' },
  { name: 'Warm Sunset', primary: '#f59e0b', secondary: '#1c1917', accent: '#f59e0b', background: '#0c0a09', surface: '#1c1917', text: '#fafaf9', textMuted: '#a8a29e' },
  { name: 'Royal Purple', primary: '#a855f7', secondary: '#1e1b4b', accent: '#a855f7', background: '#0f0b1e', surface: '#1e1b4b', text: '#e2e8f0', textMuted: '#a5b4fc' },
  { name: 'Forest Green', primary: '#22c55e', secondary: '#14532d', accent: '#22c55e', background: '#052e16', surface: '#14532d', text: '#dcfce7', textMuted: '#86efac' },
  { name: 'Crimson Dark', primary: '#ef4444', secondary: '#1c1917', accent: '#ef4444', background: '#0c0a09', surface: '#1c1917', text: '#fafaf9', textMuted: '#fca5a5' },
  { name: 'Soft Gray', primary: '#6366f1', secondary: '#f9fafb', accent: '#6366f1', background: '#f9fafb', surface: '#f3f4f6', text: '#111827', textMuted: '#6b7280' },
];

export const FONT_PAIRINGS: FontPairing[] = [
  { name: 'Inter / Inter', heading: 'Inter', body: 'Inter' },
  { name: 'Poppins / Inter', heading: 'Poppins', body: 'Inter' },
  { name: 'Playfair / Source Sans', heading: 'Playfair Display', body: 'Source Sans 3' },
  { name: 'Montserrat / Open Sans', heading: 'Montserrat', body: 'Open Sans' },
  { name: 'Raleway / Lato', heading: 'Raleway', body: 'Lato' },
  { name: 'DM Sans / DM Sans', heading: 'DM Sans', body: 'DM Sans' },
];
