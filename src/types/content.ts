export interface EpisodeMeta {
  episode_number: number;
  title: string;
  category: string;
  content_type: '科普' | '深度';
  hook: string;
  folder: string;
  has_content: boolean;
}

export interface EpisodeIndex {
  repo: string;
  brand: string;
  total_episodes: number;
  released_episodes: number;
  episodes: EpisodeMeta[];
}

export interface CardText {
  cover: string;
  card2: string;
  card3: string;
}

export interface Article {
  episode_number: number;
  title: string;
  category: string;
  content_type: string;
  hook: string;
  phase: number;
  cards: {
    cover: string;
    card2: string;
    card3: string;
  };
  fb_long: CardText;
  ig_short: CardText;
  web_copy: CardText;
  hashtags: string;
}
