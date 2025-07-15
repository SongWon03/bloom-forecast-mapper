export interface Prediction {
  region_code: string;
  region_name: string;
  lat: number;
  lon: number;
  species: 'cherry' | 'forsythia' | 'azalea';
  predicted_date: string;
  confidence_low: string;
  confidence_high: string;
  model_version: string;
  updated_at: string;
}

export interface Sighting {
  id: string;
  user_id: string;
  nickname: string;
  region_name: string;
  lat: number;
  lon: number;
  species: 'cherry' | 'forsythia' | 'azalea';
  stage: 'bud' | 'bloom';
  date: string;
  photo_url?: string;
  memo?: string;
  created_at: string;
}

export interface User {
  id: string;
  nickname: string;
  points: number;
  reports: number;
  last_report?: string;
}

export interface SpeciesConfig {
  key: 'cherry' | 'forsythia' | 'azalea';
  name: string;
  color: string;
  icon: string;
}

export const SPECIES_CONFIG: Record<string, SpeciesConfig> = {
  cherry: {
    key: 'cherry',
    name: '벚꽃',
    color: 'flower-cherry',
    icon: '🌸'
  },
  forsythia: {
    key: 'forsythia',
    name: '개나리',
    color: 'flower-forsythia',
    icon: '🟡'
  },
  azalea: {
    key: 'azalea',
    name: '진달래',
    color: 'flower-azalea',
    icon: '🌺'
  }
};