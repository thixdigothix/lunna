export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  photoUrl: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  description: string;
  photoUrl: string;
}

export interface CuriosityItem {
  id: string;
  label: string;
  value: string;
  stat?: string; // Optional prominent statistical number (e.g. "128,9 mil")
  icon: string; // e.g., 'Heart', 'Tv', 'Pizza', 'Sparkles', 'Smile'
}

export interface SkyMessage {
  id: string;
  text: string;
  x: number; // percentage width (0-100)
  y: number; // percentage height (0-100)
  size: 'sm' | 'md' | 'lg';
  photoUrl?: string; // Optional image displayed when clicking the star
}

export interface PlaylistSong {
  id: string;
  trackId: string;
  title: string;
  description: string;
}

export interface BirthdayData {
  name: string;
  age: number;
  birthDate: string; // YYYY-MM-DD
  friendshipStartDate: string; // YYYY-MM-DD
  heroSubtitle: string;
  heroSecondaryText: string;
  realTimeTributeText: string; // Typewriter text
  photos: string[]; // Polaroid photos array
  photoCaptions: string[]; // Matching captions for polaroids
  timeline: TimelineEvent[];
  memories: MemoryItem[];
  curiosities: CuriosityItem[];
  secretMessages: string[];
  playlistTracks: string[]; // Spotify Track IDs (kept for backwards compatibility)
  playlistSongs: PlaylistSong[]; // Customizable playlist detailed songs
  playlistTitle: string; // Custom title for playlist
  playlistSubtitle: string; // Custom subtext for playlist
  skyMessages: SkyMessage[];
  videoUrl: string; // YouTube watch or embed URL
  finalLetterTitle: string;
  finalLetterBody: string[];
  finalLetterSignOff: string; // Love sign-off text e.g. "Sua melhor amizade,"
  finalLetterSignature: string; // e.g. "Com Carinho e Amor Infinito"
  surpriseBoxTitle: string;
  surpriseBoxMessage: string;

  // Customizable section labels/titles/descriptions
  polaroidTitlePill?: string;
  polaroidTitle?: string;
  polaroidSubtitle?: string;
  
  timelineTitlePill?: string;
  timelineTitle?: string;
  timelineSubtitle?: string;

  secretTitlePill?: string;
  secretTitle?: string;
  secretSubtitle?: string;

  curiositiesTitlePill?: string;
  curiositiesTitle?: string;
  curiositiesSubtitle?: string;

  playlistTitlePill?: string;
  playlistTitleText?: string;
  playlistDescription?: string;

  starsTitlePill?: string;
  starsTitle?: string;
  starsSubtitle?: string;

  // New fully customizable text properties
  heroBadgeText?: string;
  heroTitlePrefix?: string;
  heroBtnText?: string;
  heroScrollHelperText?: string;
  gateLockedTitle?: string;
  gateLockedSubtitle?: string;
  gateLockedBtn?: string;
  realTimeTributeLabel?: string;
  playlistLabel?: string;
  finalLetterStamp?: string;
  finalGiftSectionTitle?: string;
  finalGiftSectionSubtitle?: string;
  finalGiftOpenedSubtitle?: string;
  finalGiftBtnText?: string;
  finalGiftCloseModalText?: string;
  footerBadgeText?: string;
  footerDescriptionText?: string;
}
